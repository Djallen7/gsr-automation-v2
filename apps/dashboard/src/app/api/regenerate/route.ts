import { NextResponse } from 'next/server'
import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const CLAUDE_MODEL = process.env.ANTHROPIC_REGENERATE_MODEL ?? 'claude-opus-4-7'

const RATE_LIMIT_WINDOW_HOURS = 1
const RATE_LIMIT_MAX_REQUESTS = 20
const MAX_PREVIOUS_TEXTS = 8
const VARIATIONS_PER_CALL = 3

const RegenerateBody = z.object({
  graphicId: z.string().uuid(),
})

// Lazy singleton so the SDK client is reused across warm function invocations
// instead of allocating per request. The boot-time env-var check runs in the
// handler so an unset key returns a clean 500 instead of a constructor crash.
let anthropicClient: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return anthropicClient
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not set on the server.' },
      { status: 500 },
    )
  }

  let parsed: z.infer<typeof RegenerateBody>
  try {
    parsed = RegenerateBody.parse(await request.json())
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ')
        : 'Invalid JSON body.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
  const { graphicId } = parsed

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  // Per-user rate limit. Inserts into regenerate_attempts on success below;
  // here we count this user's attempts in the rolling window before issuing
  // another (possibly expensive) Anthropic call.
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_HOURS * 3_600_000,
  ).toISOString()
  const { count: recentCount, error: rateError } = await supabase
    .from('regenerate_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', windowStart)
  if (rateError) {
    return NextResponse.json(
      { error: 'Rate-limit check failed.' },
      { status: 500 },
    )
  }
  if ((recentCount ?? 0) >= RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      {
        error: `Rate limit exceeded: ${RATE_LIMIT_MAX_REQUESTS} regenerations per ${RATE_LIMIT_WINDOW_HOURS}h.`,
      },
      { status: 429 },
    )
  }

  const { data: graphic, error: graphicError } = await supabase
    .from('production_lower_thirds')
    .select(
      `id, segment, beat_number, initial_text,
       episode:episodes(season, episode_number, title, guest_name)`,
    )
    .eq('id', graphicId)
    .single()
  if (graphicError || !graphic) {
    return NextResponse.json({ error: 'Graphic not found.' }, { status: 404 })
  }

  const { data: existingVariations } = await supabase
    .from('lower_thirds_variations')
    .select('text_content, variation_number')
    .eq('graphic_id', graphicId)
    .order('variation_number', { ascending: false })

  const latestText =
    existingVariations?.[0]?.text_content ?? graphic.initial_text
  const nextVariationNumber =
    (existingVariations?.[0]?.variation_number ?? 0) + 1
  // Cap prior-version context so prompt size doesn't grow unbounded over many regenerates.
  const previousTexts = (existingVariations ?? [])
    .slice(0, MAX_PREVIOUS_TEXTS)
    .map((v) => v.text_content)
    .join(' | ')

  const episodeRow = Array.isArray(graphic.episode)
    ? graphic.episode[0]
    : graphic.episode
  const guestName = episodeRow?.guest_name ?? null
  const episodeTitle = episodeRow?.title ?? null

  const userPrompt = `You are rewriting a broadcast lower-third for the Genesis Science Report (GSR).

CONTEXT
- Episode: S${episodeRow?.season ?? '?'}E${episodeRow?.episode_number ?? '?'}${episodeTitle ? ` (${episodeTitle})` : ''}
- Segment: ${graphic.segment}
- Beat: ${graphic.beat_number ?? '?'}
- Guest: ${guestName ?? 'unspecified'}
- Current text: ${latestText}
${previousTexts ? `- Prior versions to avoid (last ${MAX_PREVIOUS_TEXTS}): ${previousTexts}` : ''}

RULES
- ALL CAPS broadcast style.
- Target exactly 65 characters (55–65 is acceptable; never over 65).
- No em dashes, hyphens, forward slashes, commas, brackets, or parentheses.
- No sentence-ending periods. Abbreviation periods are fine (VS. DR. PHD.).
- Use colon or pipe as the only separators. Pipe only for chyrons (NAME | ORG | TITLE).
- No quotation marks wrapping the line.
- Each variation must meaningfully differ from the others in angle or phrasing.

OUTPUT FORMAT — exactly this, nothing else:
VAR 1: YOUR TEXT HERE
VAR 2: YOUR TEXT HERE
VAR 3: YOUR TEXT HERE`

  const anthropic = getAnthropic()

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim()

    if (!rawText) {
      return NextResponse.json(
        { error: 'Empty response from Claude.' },
        { status: 502 },
      )
    }

    // Parse VAR N: lines from the response
    const varLines = rawText.split('\n').filter((l) => /^VAR\s+\d+:/i.test(l.trim()))
    const parsedTexts = varLines.map((l) =>
      l.replace(/^VAR\s+\d+:\s*/i, '').trim().toUpperCase(),
    )

    if (parsedTexts.length === 0) {
      return NextResponse.json(
        { error: 'Claude did not return parseable variations.' },
        { status: 502 },
      )
    }

    // Take up to VARIATIONS_PER_CALL; repeat last if Claude returned fewer
    const texts: string[] = Array.from(
      { length: VARIATIONS_PER_CALL },
      (_, i) => parsedTexts[Math.min(i, parsedTexts.length - 1)],
    )

    // Insert all variations in one batch
    const insertRows = texts.map((text, i) => ({
      graphic_id: graphicId,
      variation_number: nextVariationNumber + i,
      text_content: text,
      generated_by: CLAUDE_MODEL,
      generation_context: {
        source: 'regenerate_route',
        previous_count: existingVariations?.length ?? 0,
        batch_index: i,
      },
    }))
    const { error: insertError } = await supabase
      .from('lower_thirds_variations')
      .insert(insertRows)
    if (insertError) throw insertError

    // Log this attempt for future rate-limit windows (one attempt = one API call).
    await supabase.from('regenerate_attempts').insert({
      user_id: user.id,
      graphic_id: graphicId,
    })

    return NextResponse.json({
      variations: texts.map((text, i) => ({
        text,
        variationNumber: nextVariationNumber + i,
      })),
    })
  } catch (err) {
    // Map Anthropic overload (529) to a user-meaningful 503 without leaking raw SDK error text.
    if (err instanceof Anthropic.APIError && err.status === 529) {
      return NextResponse.json(
        { error: 'Claude is overloaded. Try again in a moment.' },
        { status: 503 },
      )
    }
    console.error('regenerate route failed:', err)
    return NextResponse.json(
      { error: 'Regenerate failed.' },
      { status: 500 },
    )
  }
}
