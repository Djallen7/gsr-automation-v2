import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Anthropic from 'npm:@anthropic-ai/sdk'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const WEBHOOK_SECRET = Deno.env.get('EXTRACT_WEBHOOK_SECRET') ?? ''
const CLAUDE_MODEL = Deno.env.get('ANTHROPIC_REGENERATE_MODEL') ?? 'claude-opus-4-7'

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

interface GuestData {
  title: string | null
  first_name: string
  last_name: string
  organization: string | null
  expertise: string | null
}

function buildGuestChyron(guest: GuestData): string {
  const namePart = [guest.title, guest.last_name].filter(Boolean).join(' ').toUpperCase()
  const orgPart = guest.organization?.toUpperCase() ?? null
  const expertisePart = guest.expertise?.toUpperCase() ?? null
  const parts = [namePart, orgPart, expertisePart].filter(Boolean)
  const chyron = parts.join(' | ')
  return chyron.length <= 65 ? chyron : chyron.substring(0, 62) + '...'
}

function buildPrompt(opts: {
  episodeLabel: string
  episodeTitle: string | null
  segment: string
  guestContext: string
  prebuiltChyron: string | null
  scriptText: string
}): string {
  const { episodeLabel, episodeTitle, segment, guestContext, prebuiltChyron, scriptText } = opts
  return `You are generating broadcast lower-thirds (chyrons) for the Genesis Science Report (GSR).

EPISODE: ${episodeLabel}${episodeTitle ? ` — ${episodeTitle}` : ''}
SEGMENT: ${segment.replace(/_/g, ' ').toUpperCase()}
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
${segmentTypeGuide(segment)}

FOR topic_l3 ONLY: include var_1 and var_2 as meaningfully different alternate phrasings of the same topic, each 55–65 chars. For all other types, set var_1 and var_2 to null.

REJECTED ITEMS: If a moment warrants a chyron but you cannot write compliant text, put it in the rejected array with a reason.

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
${scriptText}`
}

Deno.serve(async (req: Request) => {
  try {
    // Validate webhook secret
    if (req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await req.json() as {
      id?: number
      episode_id?: string
      segment?: string
      script_text?: string
    }

    const { id: script_id, episode_id, segment, script_text } = payload

    if (!episode_id || !segment || !script_text?.trim()) {
      return new Response(JSON.stringify({ skipped: true, reason: 'empty or incomplete payload' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch episode + guests
    const { data: episode, error: epErr } = await supabase
      .from('episodes')
      .select(`
        id, season, episode_number, title,
        episode_guests(
          segment,
          guest:guests(title, first_name, last_name, organization, expertise)
        )
      `)
      .eq('id', episode_id)
      .single()

    if (epErr || !episode) {
      console.error('Episode not found:', episode_id, epErr)
      return new Response(JSON.stringify({ error: 'Episode not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const episodeLabel = `S${String(episode.season).padStart(2, '0')} Ep${String(episode.episode_number).padStart(3, '0')}`

    // Resolve guest for this segment
    const guestRows = Array.isArray(episode.episode_guests) ? episode.episode_guests : []
    const slotGuest = guestRows.find((eg: { segment: string }) => eg.segment === segment)
    const guestData: GuestData | null = slotGuest?.guest
      ? (Array.isArray(slotGuest.guest) ? slotGuest.guest[0] : slotGuest.guest) as GuestData
      : null

    const isInterview = segment === 'interview_1' || segment === 'interview_2'
    const prebuiltChyron = isInterview && guestData ? buildGuestChyron(guestData) : null

    const guestContext = guestData
      ? `Guest: ${[guestData.title, guestData.first_name, guestData.last_name].filter(Boolean).join(' ')}` +
        (guestData.organization ? ` | ${guestData.organization}` : '') +
        (guestData.expertise ? ` | ${guestData.expertise}` : '')
      : 'No guest booked for this slot.'

    const prompt = buildPrompt({
      episodeLabel,
      episodeTitle: episode.title ?? null,
      segment,
      guestContext,
      prebuiltChyron,
      scriptText: script_text,
    })

    // Call Claude
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.type === 'text' ? b.text : '')
      .join('')
      .trim()

    const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

    let extracted: { graphics: unknown[]; rejected?: unknown[] }
    try {
      extracted = JSON.parse(jsonText) as { graphics: unknown[]; rejected?: unknown[] }
    } catch {
      console.error('Claude returned unparseable output for', episodeLabel, segment)
      return new Response(JSON.stringify({ error: 'Claude returned unparseable output' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!Array.isArray(extracted.graphics)) {
      return new Response(JSON.stringify({ error: 'Unexpected response shape from Claude' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build the graphics rows (shared by both the apply-now and hold-for-confirm paths)
    const rejected = Array.isArray(extracted.rejected) ? extracted.rejected : []
    const extractedGraphics = extracted.graphics as Array<Record<string, unknown>>

    // Normalize var_1/var_2 once so both the apply and hold paths agree on which
    // alternate phrasings are non-empty.
    const normVar = (v: unknown): string | null => {
      const s = typeof v === 'string' ? v.trim() : ''
      return s.length > 0 ? s : null
    }

    // NOTE: current_image_url, var_1, and var_2 were dropped from this table by
    // 20260609120000_rename_graphics_to_production_lower_thirds.sql. Only columns
    // that survive that migration are written to production_lower_thirds here.
    // var_1/var_2 are preserved separately in lower_thirds_variations (apply path)
    // or carried in the held blob for the confirm path to persist.
    const newGraphics = extractedGraphics.map((g) => ({
      episode_id,
      segment,
      beat_number: Number(g.beat_number) || null,
      initial_text: String(g.primary ?? ''),
      status: 'pending_review',
      l3_type: String(g.l3_type ?? 'generic_safety_net'),
      source_doc: `${episodeLabel} ${segment} — auto-extract`,
    }))

    // Held blob mirrors newGraphics but keeps var_1/var_2 so the confirm-extraction
    // route can re-persist them into lower_thirds_variations on apply.
    const heldGraphics = newGraphics.map((row, i) => ({
      ...row,
      var_1: normVar(extractedGraphics[i]?.var_1),
      var_2: normVar(extractedGraphics[i]?.var_2),
    }))

    // Optional confirm step: only auto-write graphics when the flag is explicitly 'true'.
    const { data: cfg } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'auto_extract_apply')
      .maybeSingle()
    const autoApply = cfg?.value === 'true'

    if (!autoApply) {
      // HOLD: stash the result on the script row for human confirmation; write nothing to graphics.
      // (Updating only these columns does not change script_text, so the on_script_save
      //  trigger's "script unchanged" guard prevents a re-fire loop.)
      if (script_id != null) {
        const { error: holdErr } = await supabase
          .from('scripts')
          .update({
            pending_extraction: { graphics: heldGraphics, rejected, count: heldGraphics.length },
            extraction_status: 'pending_confirmation',
            extracted_at: new Date().toISOString(),
          })
          .eq('id', script_id)

        if (holdErr) {
          console.error('Hold update error:', holdErr)
          return new Response(JSON.stringify({ error: holdErr.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      console.log(`Held ${newGraphics.length} lower-thirds for ${episodeLabel} ${segment} (awaiting confirmation)`)
      return new Response(JSON.stringify({ ok: true, held: true, count: newGraphics.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // APPLY: clear existing pending_review graphics for this episode+segment (approved are preserved)
    await supabase
      .from('production_lower_thirds')
      .delete()
      .eq('episode_id', episode_id)
      .eq('segment', segment)
      .eq('status', 'pending_review')

    const { data: insertedGraphics, error: insertErr } = await supabase
      .from('production_lower_thirds')
      .insert(newGraphics)
      .select('id, initial_text')

    if (insertErr) {
      console.error('Insert error:', insertErr)
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Preserve the generated alternate phrasings: variation_number 1 mirrors the
    // primary (generated_by='human'); slots 2/3 hold var_1/var_2 when non-empty.
    // .select() returns rows in insert order, so index i aligns with extractedGraphics[i].
    const variationRows = (insertedGraphics ?? []).flatMap((row, i) => {
      const rows = [
        {
          graphic_id: row.id,
          variation_number: 1,
          text_content: row.initial_text,
          generated_by: 'human',
          generation_context: { source: 'extract_on_script_save' },
        },
      ]
      const variants = [
        { slot: 2, text: normVar(extractedGraphics[i]?.var_1) },
        { slot: 3, text: normVar(extractedGraphics[i]?.var_2) },
      ]
      for (const { slot, text } of variants) {
        if (text) {
          rows.push({
            graphic_id: row.id,
            variation_number: slot,
            text_content: text,
            generated_by: 'ai_extraction',
            generation_context: { source: 'extract_on_script_save' },
          })
        }
      }
      return rows
    })

    if (variationRows.length > 0) {
      const { error: varErr } = await supabase.from('lower_thirds_variations').insert(variationRows)
      if (varErr) {
        console.error('Variation insert error:', varErr)
        return new Response(JSON.stringify({ error: varErr.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    if (script_id != null) {
      await supabase
        .from('scripts')
        .update({ extraction_status: 'applied', extracted_at: new Date().toISOString(), pending_extraction: null })
        .eq('id', script_id)
    }

    console.log(`Extracted ${newGraphics.length} lower-thirds for ${episodeLabel} ${segment}`)
    return new Response(JSON.stringify({ ok: true, applied: true, count: newGraphics.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
