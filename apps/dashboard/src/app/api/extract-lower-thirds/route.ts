import { NextResponse } from 'next/server'
import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const CLAUDE_MODEL = process.env.ANTHROPIC_REGENERATE_MODEL ?? 'claude-opus-4-7'

const SEGMENTS = [
  'show_intro', 'opening_monologue', 'interview_1', 'interview_2',
  'kids_corner', 'genesis_science_qa', 'ministry_report', 'viewer_voices',
  'featured_resource', 'heavens_declare', 'genesis_science_minute', 'other',
] as const

let anthropicClient: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return anthropicClient
}

const ExtractBody = z.object({
  episode_id: z.string().uuid(),
  segment: z.enum(SEGMENTS),
  script_text: z.string().min(10).max(60_000),
})

// Segment-specific guidance for l3_type selection
function segmentTypeGuide(segment: string): string {
  switch (segment) {
    case 'interview_1':
    case 'interview_2':
      return `Beat 1 is always guest_chyron (use the pre-built text below).
Beats 2+ should be discussion_l3 (specific claim or evidence point) or topic_l3 (broad topic shift).
Use topic_l3 when the conversation moves to a distinctly new subject area — include var_1 and var_2.
Use discussion_l3 for a specific argument, data point, or mechanism being explained.`

    case 'opening_monologue':
      return `Beat 1 is segment_graphics_title for the monologue itself.
Beats 2+ are monologue_beat — each key claim, fact, or rhetorical beat in the script.
No guest chyron for this segment.`

    case 'show_intro':
      return `One graphic only: episode_intro_l3 with the episode title or theme.`

    case 'kids_corner':
    case 'heavens_declare':
    case 'genesis_science_minute':
      return `Beat 1 is segment_graphics_title.
Beats 2+ are topic_l3 (include var_1 and var_2 for each).
No guest chyron unless a named expert appears on screen.`

    case 'genesis_science_qa':
      return `Beat 1 is segment_graphics_title.
Beats 2+ are qa_topic_l3 — one per Q&A question or topic shift.`

    case 'ministry_report':
      return `Beat 1 is segment_graphics_title.
Use mr_topic_l3 for individual report points.
Use mr_cta_l3 for any call-to-action (donate, visit website, phone number).`

    case 'viewer_voices':
      return `Beat 1 is segment_graphics_title.
Beats 2+ are viewer_l3 — one per viewer question or quote read on air.`

    case 'featured_resource':
      return `Beat 1 is resource_l3 (the book or resource title).
Beats 2+ are cta_l3 (purchase link, website, promo code).`

    default:
      return `Use generic_safety_net for anything that doesn't fit a specific type.`
  }
}

// Build the pre-formatted guest chyron from Supabase guest data
function buildGuestChyron(guest: {
  title: string | null
  first_name: string
  last_name: string
  organization: string | null
  expertise: string | null
}): string {
  const namePart = [guest.title, guest.last_name].filter(Boolean).join(' ').toUpperCase()
  const orgPart = guest.organization?.toUpperCase() ?? null
  const expertisePart = guest.expertise?.toUpperCase() ?? null

  const parts = [namePart, orgPart, expertisePart].filter(Boolean)
  const chyron = parts.join(' | ')
  // Truncate gracefully if somehow over 65
  return chyron.length <= 65 ? chyron : chyron.substring(0, 62) + '...'
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set.' }, { status: 500 })
  }

  let parsed: z.infer<typeof ExtractBody>
  try {
    parsed = ExtractBody.parse(await request.json())
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
      : 'Invalid request body.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  // Fetch episode + guests for this slot
  const { data: episode, error: epErr } = await supabase
    .from('episodes')
    .select(`
      id, season, episode_number, title,
      episode_guests(
        segment,
        guest:guests(title, first_name, last_name, organization, expertise)
      )
    `)
    .eq('id', parsed.episode_id)
    .single()

  if (epErr || !episode) {
    return NextResponse.json({ error: 'Episode not found.' }, { status: 404 })
  }

  const episodeLabel = `S${String(episode.season).padStart(2, '0')} Ep${String(episode.episode_number).padStart(3, '0')}`

  // Find the guest for this segment (interview_1 or interview_2)
  const guestRows = Array.isArray(episode.episode_guests) ? episode.episode_guests : []
  const slotGuest = guestRows.find((eg: { segment: string }) => eg.segment === parsed.segment)
  const guestData = slotGuest?.guest
    ? (Array.isArray(slotGuest.guest) ? slotGuest.guest[0] : slotGuest.guest)
    : null

  const isInterviewSegment = parsed.segment === 'interview_1' || parsed.segment === 'interview_2'
  const prebuiltChyron = isInterviewSegment && guestData
    ? buildGuestChyron(guestData)
    : null

  const guestContext = guestData
    ? `Guest: ${[guestData.title, guestData.first_name, guestData.last_name].filter(Boolean).join(' ')}` +
      (guestData.organization ? ` | ${guestData.organization}` : '') +
      (guestData.expertise ? ` | ${guestData.expertise}` : '')
    : 'No guest booked for this slot.'

  const prompt = `You are generating broadcast lower-thirds (chyrons) for the Genesis Science Report (GSR).

EPISODE: ${episodeLabel}${episode.title ? ` — ${episode.title}` : ''}
SEGMENT: ${parsed.segment.replace(/_/g, ' ').toUpperCase()}
${guestContext}
${prebuiltChyron ? `\nPRE-BUILT GUEST CHYRON (use exactly as beat 1):\n${prebuiltChyron}\n` : ''}
BROADCAST RULES (non-negotiable):
- ALL CAPS only
- 55–65 characters per line; target 65; NEVER over 65
- No em dashes, hyphens, commas, brackets, or parentheses
- No sentence-ending periods; abbreviation periods are fine (DR. PHD. VS.)
- Colon or pipe as the ONLY separators
- Pipe (|) is ONLY for NAME | ORG | TITLE chyrons — never in topic lines
- No quotation marks
- Write for a viewer with zero prior context — they are seeing this cold

L3 TYPE REFERENCE:
guest_chyron        — speaker ID: NAME | ORG | FIELD
discussion_l3       — specific claim, data point, or argument beat
topic_l3            — broad topic label when conversation shifts (REQUIRES var_1 and var_2)
segment_graphics_title — segment name card
monologue_beat      — key claim in the opening monologue
episode_intro_l3    — show title card / episode theme
qa_topic_l3         — question or topic in Genesis Science Q&A
mr_topic_l3         — point in Ministry Report
mr_cta_l3           — call-to-action in Ministry Report
viewer_l3           — viewer question or quote read on air
resource_l3         — book or resource title in Featured Resource
cta_l3              — donation or website call-to-action
generic_safety_net  — fallback when nothing else fits

SEGMENT GUIDANCE:
${segmentTypeGuide(parsed.segment)}

FOR topic_l3 ONLY: include var_1 and var_2 as meaningfully different alternate phrasings of the same topic, each 55–65 chars. For all other types, set var_1 and var_2 to null.

REJECTED ITEMS: If a moment warrants a chyron but you cannot write compliant text (e.g. proper names force the line over 65 chars), put it in the rejected array with a reason.

OUTPUT — valid JSON only. No prose. No markdown fences. No commentary.
{
  "graphics": [
    {
      "beat_number": <int starting at 1>,
      "l3_type": "<type from list above>",
      "primary": "<55-65 chars ALL CAPS>",
      "var_1": "<55-65 chars or null>",
      "var_2": "<55-65 chars or null>"
    }
  ],
  "rejected": [
    {
      "reason": "<why it was skipped>",
      "raw_text": "<original text from script>"
    }
  ]
}

SCRIPT:
${parsed.script_text}`

  try {
    const response = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('')
      .trim()

    // Strip markdown fences if Claude ignores the instruction
    const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

    let extracted: { graphics: unknown[]; rejected?: unknown[] }
    try {
      extracted = JSON.parse(jsonText) as { graphics: unknown[]; rejected?: unknown[] }
    } catch {
      return NextResponse.json(
        { error: 'Claude returned unparseable output. Try again or shorten the script.' },
        { status: 502 },
      )
    }

    if (!Array.isArray(extracted.graphics)) {
      return NextResponse.json(
        { error: 'Unexpected response shape from Claude.' },
        { status: 502 },
      )
    }

    // Wrap into the /api/import payload format
    const importPayload = {
      episodes: [
        {
          season: episode.season,
          episode_number: episode.episode_number,
          title: episode.title ?? null,
          guest_name: guestData
            ? [guestData.title, guestData.first_name, guestData.last_name].filter(Boolean).join(' ')
            : null,
        },
      ],
      graphics: (extracted.graphics as Array<Record<string, unknown>>).map((g) => ({
        episode_season: episode.season,
        episode_number: episode.episode_number,
        segment: parsed.segment,
        l3_type: g.l3_type ?? null,
        beat_number: g.beat_number,
        primary: g.primary,
        var_1: g.var_1 ?? null,
        var_2: g.var_2 ?? null,
        source_doc: `${episodeLabel} ${parsed.segment} — script extract`,
      })),
      rejected: extracted.rejected ?? [],
    }

    return NextResponse.json({ payload: importPayload })
  } catch (err) {
    if (err instanceof Anthropic.APIError && err.status === 529) {
      return NextResponse.json(
        { error: 'Claude is overloaded. Try again in a moment.' },
        { status: 503 },
      )
    }
    console.error('extract-lower-thirds route failed:', err)
    return NextResponse.json({ error: 'Extraction failed.' }, { status: 500 })
  }
}
