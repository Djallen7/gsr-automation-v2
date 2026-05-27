import Anthropic from '@anthropic-ai/sdk'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BRAND_RULES = `You are a lower-third text writer for Genesis Science Report (GSR), a Christian young-earth creation science news program hosted by David Rives.

Lower-third rules:
- Maximum 8 words total
- No em dashes (—), en dashes (–), or ellipses (...)
- Present tense, active voice
- Must specifically reference the topic, guest name, or concept
- Avoid generic words like "Interview," "Discussion," or "Segment"
- Capitalize proper nouns only; avoid ALL-CAPS
- Accessible to a general Christian family audience`

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let graphicId: string
  try {
    const body = await request.json()
    graphicId = body?.graphicId
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (!graphicId) return NextResponse.json({ error: 'graphicId required' }, { status: 400 })

  const { data: graphic, error: gErr } = await supabase
    .from('graphics')
    .select(
      'id, initial_text, segment, beat_number, episode:episodes(season, episode_number, title, guest_name)',
    )
    .eq('id', graphicId)
    .single()

  if (gErr || !graphic) return NextResponse.json({ error: 'Graphic not found' }, { status: 404 })

  const { data: lastVar } = await supabase
    .from('graphics_variations')
    .select('variation_number')
    .eq('graphic_id', graphicId)
    .order('variation_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVariationNumber = (lastVar?.variation_number ?? 0) + 1

  const ep = Array.isArray(graphic.episode) ? graphic.episode[0] : graphic.episode
  const episodeLine = ep
    ? `S${ep.season}E${ep.episode_number}${ep.title ? ` (${ep.title})` : ''}${(ep as { guest_name?: string | null }).guest_name ? `, guest: ${(ep as { guest_name?: string | null }).guest_name}` : ''}`
    : 'No episode assigned'

  const userPrompt = `Generate one alternative lower-third text for this graphic.

Episode: ${episodeLine}
Segment: ${(graphic.segment as string).replaceAll('_', ' ')}
Beat: ${graphic.beat_number ?? 'unspecified'}
Current text: "${graphic.initial_text}"

Respond with ONLY the new lower-third text. No explanation, no quotation marks, no trailing punctuation.`

  try {
    const anthropic = new Anthropic()
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 100,
      system: [
        {
          type: 'text' as const,
          text: BRAND_RULES,
          cache_control: { type: 'ephemeral' as const },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    })

    const block = message.content[0]
    if (!block || block.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response from Claude' }, { status: 500 })
    }
    const newText = block.text.trim()

    const { error: insertErr } = await supabase.from('graphics_variations').insert({
      graphic_id: graphicId,
      variation_number: nextVariationNumber,
      text_content: newText,
      generated_by: 'claude-opus-4-7',
      generation_context: {
        episode: episodeLine,
        segment: graphic.segment,
        beat_number: graphic.beat_number,
        initial_text: graphic.initial_text,
      },
    })

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

    return NextResponse.json({ text: newText, variationNumber: nextVariationNumber })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Claude API error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
