import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const SEGMENT_VALUES = [
  'show_intro', 'opening_monologue', 'interview_1', 'interview_2',
  'kids_corner', 'genesis_science_qa', 'ministry_report', 'viewer_voices',
  'featured_resource', 'heavens_declare', 'genesis_science_minute', 'other',
] as const

// A held lower-thirds row stored in scripts.pending_extraction.
// The JSON blob may carry legacy fields (current_image_url, var_1, var_2)
// written by older extractions; strip them before inserting.
interface HeldGraphic {
  episode_id: string
  segment: string
  beat_number: number | null
  initial_text: string
  status: string
  l3_type: string
  source_doc: string
  // legacy fields present in older blobs — stripped before DB insert
  current_image_url?: string
  var_1?: string | null
  var_2?: string | null
}

interface PendingExtraction {
  graphics?: HeldGraphic[]
  rejected?: Array<{ reason: string; raw_text: string }>
  count?: number
}

// GET ?episode_id=&segment= -> summary of any held extraction awaiting confirmation.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const episode_id = url.searchParams.get('episode_id')
  const segment = url.searchParams.get('segment')
  if (!episode_id || !segment) {
    return NextResponse.json({ error: 'episode_id and segment are required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const { data, error } = await supabase
    .from('scripts')
    .select('extraction_status, extracted_at, pending_extraction')
    .eq('episode_id', episode_id)
    .eq('segment', segment)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!data || data.extraction_status !== 'pending_confirmation' || !data.pending_extraction) {
    return NextResponse.json({ pending: false })
  }

  const pe = data.pending_extraction as PendingExtraction
  const graphics = pe.graphics ?? []
  return NextResponse.json({
    pending: true,
    extracted_at: data.extracted_at,
    count: pe.count ?? graphics.length,
    graphics: graphics.map((g) => ({
      beat_number: g.beat_number,
      l3_type: g.l3_type,
      primary: g.initial_text,
      var_1: g.var_1,
      var_2: g.var_2,
    })),
    rejected: pe.rejected ?? [],
  })
}

const Body = z.object({
  episode_id: z.string().uuid(),
  segment: z.enum(SEGMENT_VALUES),
  action: z.enum(['apply', 'discard']),
})

// POST { episode_id, segment, action } -> apply the held extraction to `graphics`, or discard it.
export async function POST(request: Request) {
  let parsed: z.infer<typeof Body>
  try {
    parsed = Body.parse(await request.json())
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
      : 'Invalid request body.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const { data: script, error: selErr } = await supabase
    .from('scripts')
    .select('id, extraction_status, pending_extraction')
    .eq('episode_id', parsed.episode_id)
    .eq('segment', parsed.segment)
    .maybeSingle()

  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })
  if (!script || script.extraction_status !== 'pending_confirmation' || !script.pending_extraction) {
    return NextResponse.json({ error: 'No pending extraction to confirm.' }, { status: 409 })
  }

  if (parsed.action === 'discard') {
    const { error } = await supabase
      .from('scripts')
      .update({ extraction_status: 'discarded', pending_extraction: null })
      .eq('id', script.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, action: 'discard' })
  }

  // apply: replace pending_review graphics for this episode+segment with the held rows.
  const pe = script.pending_extraction as PendingExtraction
  const graphics = pe.graphics ?? []

  if (graphics.length > 0) {
    const { error: delErr } = await supabase
      .from('production_lower_thirds')
      .delete()
      .eq('episode_id', parsed.episode_id)
      .eq('segment', parsed.segment)
      .eq('status', 'pending_review')
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })

    // Strip legacy fields that no longer exist on production_lower_thirds
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const insertRows = graphics.map(({ current_image_url: _img, var_1: _v1, var_2: _v2, ...rest }) => rest)
    const { error: insErr } = await supabase.from('production_lower_thirds').insert(insertRows)
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
  }

  const { error: updErr } = await supabase
    .from('scripts')
    .update({ extraction_status: 'applied', pending_extraction: null })
    .eq('id', script.id)
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  return NextResponse.json({ ok: true, action: 'apply', count: graphics.length })
}
