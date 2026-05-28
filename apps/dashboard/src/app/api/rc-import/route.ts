import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const RC_BASE = 'https://www.rundowncreator.com/davidrives/API.php'

function rcUrl(action: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({
    Action: action,
    APIKey: process.env.RUNDOWN_CREATOR_API_KEY ?? '',
    APIToken: process.env.RUNDOWN_CREATOR_API_TOKEN ?? '',
    ...extra,
  })
  return `${RC_BASE}?${params.toString()}`
}

// Maps RC "segment" field value → dashboard segment value
const RC_SEGMENT_MAP: Record<string, string> = {
  'Monologue': 'opening_monologue',
  'Interview 1': 'interview_1',
  'Interview 2': 'interview_2',
  "Kids' Corner": 'kids_corner',
  'Genesis Science Q&A': 'genesis_science_qa',
  'Ministry Report': 'ministry_report',
  'Viewer Voices': 'viewer_voices',
  'Featured Resource': 'featured_resource',
  'The Heavens Declare': 'heavens_declare',
  'Genesis Science Minute': 'genesis_science_minute',
}

// Fix UTF-8 bytes mis-decoded as Latin-1 (common RC API artifact)
function fixEncoding(s: string): string {
  return s
    .replace(/â€"/g, '—')
    .replace(/â€™/g, '’')
    .replace(/â€œ/g, '“')
    .replace(/â€/g, '”')
}

interface RcRow {
  RowID: number
  segment: string
  ScriptHasContent: number
  Position: number
}

interface RcScript {
  Script: string
}

async function fetchSegmentsForRundown(rundownId: string) {
  const rows: RcRow[] = await fetch(rcUrl('getRows', { RundownID: rundownId })).then(r => r.json())

  // For each mapped segment, pick the first row (by Position) that has script content
  const primary = new Map<string, RcRow>()
  for (const row of rows) {
    if (!row.ScriptHasContent || !row.segment || !RC_SEGMENT_MAP[row.segment]) continue
    const existing = primary.get(row.segment)
    if (!existing || row.Position < existing.Position) {
      primary.set(row.segment, row)
    }
  }

  return await Promise.all(
    Array.from(primary.values()).map(async (row) => {
      const scripts: RcScript[] = await fetch(rcUrl('getScript', { RowID: String(row.RowID) })).then(r => r.json())
      const text = fixEncoding(scripts[0]?.Script ?? '')
      return {
        rc_segment: row.segment,
        segment: RC_SEGMENT_MAP[row.segment],
        row_id: row.RowID,
        script_text: text,
        char_count: text.length,
      }
    })
  )
}

// GET /api/rc-import?rundown_id=79 — preview what's in a rundown (no episode needed)
export async function GET(request: Request) {
  if (!process.env.RUNDOWN_CREATOR_API_KEY || !process.env.RUNDOWN_CREATOR_API_TOKEN) {
    return NextResponse.json({ error: 'RC credentials not set in env.' }, { status: 500 })
  }
  const { searchParams } = new URL(request.url)
  const rundownId = searchParams.get('rundown_id')
  if (!rundownId) return NextResponse.json({ error: 'rundown_id required' }, { status: 400 })

  const segments = await fetchSegmentsForRundown(rundownId)
  return NextResponse.json({
    rundown_id: rundownId,
    segment_count: segments.length,
    segments: segments.map(s => ({
      rc_segment: s.rc_segment,
      segment: s.segment,
      row_id: s.row_id,
      char_count: s.char_count,
    })),
  })
}

const ImportSchema = z.object({
  rundown_id: z.number().int().positive(),
  episode_id: z.string().uuid(),
  dry_run: z.boolean().default(true),
})

// POST /api/rc-import — { rundown_id, episode_id, dry_run }
export async function POST(request: Request) {
  if (!process.env.RUNDOWN_CREATOR_API_KEY || !process.env.RUNDOWN_CREATOR_API_TOKEN) {
    return NextResponse.json({ error: 'RC credentials not set in env.' }, { status: 500 })
  }

  const parsed = ImportSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { rundown_id, episode_id, dry_run } = parsed.data

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const segments = await fetchSegmentsForRundown(String(rundown_id))

  if (dry_run) {
    return NextResponse.json({
      mode: 'dry_run',
      segment_count: segments.length,
      segments: segments.map(s => ({
        rc_segment: s.rc_segment,
        segment: s.segment,
        char_count: s.char_count,
      })),
    })
  }

  const results = await Promise.all(
    segments.map(async (seg) => {
      const { error } = await supabase.from('scripts').upsert(
        { episode_id, segment: seg.segment, script_text: seg.script_text },
        { onConflict: 'episode_id,segment' },
      )
      return { segment: seg.segment, ok: !error, error: error?.message }
    })
  )

  return NextResponse.json({
    mode: 'import',
    imported: results.filter(r => r.ok).length,
    results,
  })
}
