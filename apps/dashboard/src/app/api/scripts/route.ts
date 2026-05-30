import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const SEGMENT_VALUES = [
  'show_intro', 'opening_monologue', 'interview_1', 'interview_2',
  'kids_corner', 'genesis_science_qa', 'ministry_report', 'viewer_voices',
  'featured_resource', 'heavens_declare', 'genesis_science_minute', 'other',
] as const

const Body = z.object({
  episode_id: z.string().uuid(),
  segment: z.enum(SEGMENT_VALUES),
  script_text: z.string(),
})

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

  const { error } = await supabase
    .from('scripts')
    .upsert(
      { episode_id: parsed.episode_id, segment: parsed.segment, script_text: parsed.script_text },
      { onConflict: 'episode_id,segment' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
