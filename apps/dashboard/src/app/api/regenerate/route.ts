import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const CLAUDE_MODEL = 'claude-opus-4-7'

interface RegenerateBody {
  graphicId?: string
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not set on the server.' },
      { status: 500 },
    )
  }

  let body: RegenerateBody
  try {
    body = (await request.json()) as RegenerateBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const graphicId = body.graphicId
  if (!graphicId) {
    return NextResponse.json({ error: 'graphicId is required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
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

  const latestText = existingVariations?.[0]?.text_content ?? graphic.initial_text
  const nextVariationNumber = (existingVariations?.[0]?.variation_number ?? 0) + 1
  const previousTexts = (existingVariations ?? []).map((v) => v.text_content).join(' | ')

  const episodeRow = Array.isArray(graphic.episode) ? graphic.episode[0] : graphic.episode
  const guestName = episodeRow?.guest_name ?? null
  const episodeTitle = episodeRow?.title ?? null

  const userPrompt = `You are rewriting a single broadcast lower-third for the Genesis Science Report (GSR).

CONTEXT
- Episode: S${episodeRow?.season ?? '?'}E${episodeRow?.episode_number ?? '?'}${episodeTitle ? ` (${episodeTitle})` : ''}
- Segment: ${graphic.segment}
- Beat: ${graphic.beat_number ?? '?'}
- Guest: ${guestName ?? 'unspecified'}
- Latest version: ${latestText}
${previousTexts ? `- All prior versions (avoid repeating): ${previousTexts}` : ''}

RULES
- Output ONE alternative lower-third only.
- ALL CAPS broadcast style.
- Eight words or fewer.
- Never use em dashes. Use a forward slash or hyphen.
- No quotation marks around the result.
- Output only the new lower-third text, nothing else.`

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

    return NextResponse.json({ text: newText, variationNumber: nextVariationNumber })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Regenerate failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
