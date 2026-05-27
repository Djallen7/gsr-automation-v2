import { NextResponse } from 'next/server'
import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const CLAUDE_MODEL = process.env.ANTHROPIC_REGENERATE_MODEL ?? 'claude-opus-4-7'

const RATE_LIMIT_WINDOW_HOURS = 1
const RATE_LIMIT_MAX_REQUESTS = 20
const MAX_PREVIOUS_TEXTS = 8

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
    .from('graphics')
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
    .from('graphics_variations')
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

  const userPrompt = `You are rewriting a single broadcast lower-third for the Genesis Science Report (GSR).

CONTEXT
- Episode: S${episodeRow?.season ?? '?'}E${episodeRow?.episode_number ?? '?'}${episodeTitle ? ` (${episodeTitle})` : ''}
- Segment: ${graphic.segment}
- Beat: ${graphic.beat_number ?? '?'}
- Guest: ${guestName ?? 'unspecified'}
- Latest version: ${latestText}
${previousTexts ? `- Prior versions to avoid (last ${MAX_PREVIOUS_TEXTS}): ${previousTexts}` : ''}

RULES
- Output ONE alternative lower-third only.
- ALL CAPS broadcast style.
- Eight words or fewer.
- Never use em dashes. Use a forward slash or hyphen.
- No quotation marks around the result.
- Output only the new lower-third text, nothing else.`

  const anthropic = getAnthropic()

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 64,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const newText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim()

    if (!newText) {
      return NextResponse.json(
        { error: 'Empty response from Claude.' },
        { status: 502 },
      )
    }

    const { error: insertError } = await supabase
      .from('graphics_variations')
      .insert({
        graphic_id: graphicId,
        variation_number: nextVariationNumber,
        text_content: newText,
        generated_by: CLAUDE_MODEL,
        generation_context: {
          source: 'regenerate_route',
          previous_count: existingVariations?.length ?? 0,
        },
      })
    if (insertError) throw insertError

    // Log this attempt for future rate-limit windows.
    await supabase.from('regenerate_attempts').insert({
      user_id: user.id,
      graphic_id: graphicId,
    })

    return NextResponse.json({
      text: newText,
      variationNumber: nextVariationNumber,
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
