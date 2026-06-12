import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { resolveImportMode } from '@/lib/import-mode'

// SEGMENT enum — must match the graphic_segment Postgres enum exactly.
// If you add a value here, also add it in a SQL migration:
//   alter type graphic_segment add value 'new_value';
const SEGMENTS = [
  'show_intro',
  'opening_monologue',
  'interview_1',
  'interview_2',
  'kids_corner',
  'genesis_science_qa',
  'ministry_report',
  'viewer_voices',
  'featured_resource',
  'heavens_declare',
  'genesis_science_minute',
  'other',
] as const

// L3 type enum — must match the graphics_l3_type_check CHECK constraint.
const L3_TYPES = [
  'episode_intro_l3',
  'monologue_beat',
  'segment_graphics_title',
  'topic_l3',
  'guest_chyron',
  'discussion_l3',
  'generic_safety_net',
  'qa_topic_l3',
  'mr_topic_l3',
  'mr_cta_l3',
  'correspondent_chyron',
  'viewer_l3',
  'resource_l3',
  'cta_l3',
  'other',
] as const


const ImportEpisode = z.object({
  season: z.number().int().min(1).max(99),
  episode_number: z.number().int().min(1).max(999),
  title: z.string().nullable().optional(),
  air_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'air_date must be YYYY-MM-DD')
    .nullable()
    .optional(),
  guest_name: z.string().nullable().optional(),
})

const ImportGraphic = z.object({
  episode_season: z.number().int().min(1).max(99),
  episode_number: z.number().int().min(1).max(999),
  segment: z.enum(SEGMENTS),
  // Optional for back-compat with v1 imports. The v2 extraction prompt always
  // sets it; older callers can omit it and the graphic just lacks a type.
  l3_type: z.enum(L3_TYPES).nullable().optional(),
  beat_number: z.number().int().min(1).max(999),
  // v2 prompt names this `primary`. v1 used `initial_text`. Accept either,
  // prefer primary, store under graphics.initial_text.
  primary: z.string().min(1).max(200).optional(),
  initial_text: z.string().min(1).max(200).optional(),
  // Variant slots from the v2 3-column system. Only meaningful for
  // l3_type values episode_intro_l3 | segment_graphics_title | topic_l3,
  // but we don't enforce that here; the prompt does.
  var_1: z.string().min(1).max(200).nullable().optional(),
  var_2: z.string().min(1).max(200).nullable().optional(),
  source_doc: z.string().nullable().optional(),
})

const RejectedItem = z.object({
  reason: z.string(),
  raw_text: z.string(),
  source_doc: z.string().nullable().optional(),
})

const ImportPayload = z.object({
  episodes: z.array(ImportEpisode).min(1),
  graphics: z.array(ImportGraphic),
  // Top-level array from the v2 prompt for over-length / unclassifiable
  // copy lines. We acknowledge them in the response but never write them.
  rejected: z.array(RejectedItem).optional().default([]),
  // Safe by default: a live write requires confirm === IMPORT_CONFIRM_TOKEN.
  // dry_run: true still forces a dry-run even if a token is present.
  dry_run: z.boolean().optional(),
  confirm: z.string().optional(),
})

// Resolve the canonical primary text for a graphic — primary wins, falls
// back to initial_text for v1 callers. Validation guarantees at least one.
function resolvePrimary(g: z.infer<typeof ImportGraphic>): string {
  return (g.primary ?? g.initial_text) as string
}

type EpisodeKey = `${number}-${number}`
const keyOf = (season: number, episode_number: number): EpisodeKey =>
  `${season}-${episode_number}` as EpisodeKey

export async function POST(request: Request) {
  let payload: z.infer<typeof ImportPayload>
  try {
    payload = ImportPayload.parse(await request.json())
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
        : 'Invalid JSON body.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // After zod validates the shape, enforce: every graphic row must carry
  // at least one of `primary` or `initial_text`. Zod can't express the
  // OR across two optional fields cleanly, so check here.
  const missingText = payload.graphics
    .map((g, idx) => ({ idx, g }))
    .filter(({ g }) => !g.primary && !g.initial_text)
  if (missingText.length > 0) {
    return NextResponse.json(
      {
        error: "graphics rows must include either 'primary' or 'initial_text'",
        details: missingText.map(
          ({ idx, g }) =>
            `graphics[${idx}]: S${g.episode_season}E${g.episode_number} ${g.segment} beat ${g.beat_number}`,
        ),
      },
      { status: 400 },
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  // Validation: every graphic must reference an episode in the payload.
  const payloadEpisodeKeys = new Set<EpisodeKey>(
    payload.episodes.map((e) => keyOf(e.season, e.episode_number)),
  )
  const orphans = payload.graphics
    .map((g, idx) => ({ idx, key: keyOf(g.episode_season, g.episode_number), g }))
    .filter(({ key }) => !payloadEpisodeKeys.has(key))
  if (orphans.length > 0) {
    return NextResponse.json(
      {
        error: 'graphics reference episodes not in the episodes[] list',
        details: orphans.map(
          ({ idx, g }) =>
            `graphics[${idx}]: S${g.episode_season}E${g.episode_number} ${g.segment} beat ${g.beat_number}`,
        ),
      },
      { status: 400 },
    )
  }

  // Look up which episodes already exist so we can report new vs updated.
  const seasons = [...new Set(payload.episodes.map((e) => e.season))]
  const epNums = [...new Set(payload.episodes.map((e) => e.episode_number))]
  const { data: existingEps, error: epsErr } = await supabase
    .from('episodes')
    .select('id, season, episode_number')
    .in('season', seasons)
    .in('episode_number', epNums)
  if (epsErr) {
    return NextResponse.json(
      { error: 'Failed to query existing episodes.' },
      { status: 500 },
    )
  }
  const existingEpisodeMap = new Map<EpisodeKey, string>()
  for (const ep of existingEps ?? []) {
    existingEpisodeMap.set(keyOf(ep.season, ep.episode_number), ep.id)
  }

  // For each known episode, pre-fetch existing (segment, beat_number) so we
  // can detect graphic-row duplicates in dry-run mode.
  const existingGraphicsConflicts: string[] = []
  if (existingEpisodeMap.size > 0) {
    const { data: existingGfx, error: gfxErr } = await supabase
      .from('production_lower_thirds')
      .select('episode_id, segment, beat_number')
      .in('episode_id', [...existingEpisodeMap.values()])
    if (gfxErr) {
      return NextResponse.json(
        { error: 'Failed to query existing graphics.' },
        { status: 500 },
      )
    }
    const episodeIdToKey = new Map<string, EpisodeKey>()
    for (const [k, v] of existingEpisodeMap) episodeIdToKey.set(v, k)

    const existingSet = new Set<string>()
    for (const g of existingGfx ?? []) {
      const k = episodeIdToKey.get(g.episode_id)
      if (k) existingSet.add(`${k}:${g.segment}:${g.beat_number}`)
    }

    for (let i = 0; i < payload.graphics.length; i++) {
      const g = payload.graphics[i]
      const k = keyOf(g.episode_season, g.episode_number)
      if (existingSet.has(`${k}:${g.segment}:${g.beat_number}`)) {
        existingGraphicsConflicts.push(
          `graphics[${i}]: S${g.episode_season}E${g.episode_number} ${g.segment} beat ${g.beat_number} already exists`,
        )
      }
    }
  }

  const newEpisodeCount =
    payload.episodes.length - existingEpisodeMap.size
  const updatedEpisodeCount = existingEpisodeMap.size
  const newGraphicCount =
    payload.graphics.length - existingGraphicsConflicts.length

  // The write gate: without the explicit confirm token this is ALWAYS a
  // dry-run, regardless of what the caller intended. See lib/import-mode.ts.
  const importMode = resolveImportMode(payload)
  if (importMode.mode === 'dry_run') {
    return NextResponse.json({
      dry_run: true,
      mode_reason: importMode.reason,
      episodes: {
        total: payload.episodes.length,
        new: newEpisodeCount,
        updated: updatedEpisodeCount,
      },
      graphics: {
        total: payload.graphics.length,
        new: newGraphicCount,
        conflicts: existingGraphicsConflicts.length,
      },
      conflicts: existingGraphicsConflicts,
      rejected: {
        total: payload.rejected.length,
        items: payload.rejected,
      },
    })
  }

  // Live submit. Refuse if any conflicts — operator must resolve in source.
  if (existingGraphicsConflicts.length > 0) {
    return NextResponse.json(
      {
        error:
          'Refusing to import — some graphics conflict with existing rows. Re-run with dry_run=true to see the list.',
        conflicts: existingGraphicsConflicts,
      },
      { status: 409 },
    )
  }

  // Upsert episodes by (season, episode_number).
  const upsertPayload = payload.episodes.map((e) => ({
    season: e.season,
    episode_number: e.episode_number,
    title: e.title ?? null,
    air_date: e.air_date ?? null,
    guest_name: e.guest_name ?? null,
  }))
  const { data: upsertedEps, error: upsertErr } = await supabase
    .from('episodes')
    .upsert(upsertPayload, {
      onConflict: 'season,episode_number',
      ignoreDuplicates: false,
    })
    .select('id, season, episode_number')
  if (upsertErr) {
    return NextResponse.json(
      { error: `Episode upsert failed: ${upsertErr.message}` },
      { status: 500 },
    )
  }

  const episodeIdMap = new Map<EpisodeKey, string>()
  for (const ep of upsertedEps ?? []) {
    episodeIdMap.set(keyOf(ep.season, ep.episode_number), ep.id)
  }

  // Insert graphics + variation_1 for each.
  const graphicRows = payload.graphics.map((g) => {
    const episode_id = episodeIdMap.get(keyOf(g.episode_season, g.episode_number))
    if (!episode_id) {
      throw new Error(
        `Internal: missing episode_id for ${keyOf(g.episode_season, g.episode_number)}`,
      )
    }
    return {
      episode_id,
      segment: g.segment,
      l3_type: g.l3_type ?? null,
      beat_number: g.beat_number,
      initial_text: resolvePrimary(g),
      status: 'pending_review' as const,
      uploaded_by: user.id,
      // font_* and approved_* stay null until set in the UI
    }
  })

  const { data: insertedGraphics, error: insertGfxErr } = await supabase
    .from('production_lower_thirds')
    .insert(graphicRows)
    .select('id, segment, beat_number, episode_id, initial_text')
  if (insertGfxErr) {
    return NextResponse.json(
      { error: `Graphics insert failed: ${insertGfxErr.message}` },
      { status: 500 },
    )
  }

  // Insert variation_1 for each new graphic. text_content mirrors initial_text;
  // generated_by='human' marks the original import source.
  // Slots 2 and 3 preserve the v2 prompt's alternate phrasings (var_1 / var_2)
  // when present, so generated copy alternatives aren't discarded.
  const variationRows = (insertedGraphics ?? []).flatMap((g, idx) => {
    const src = payload.graphics[idx]
    const rows = [
      {
        graphic_id: g.id,
        variation_number: 1,
        text_content: g.initial_text,
        generated_by: 'human',
        generation_context: {
          source: 'import_route',
          source_doc: src?.source_doc ?? null,
        },
      },
    ]
    const variants: Array<{ slot: number; text: string | null | undefined }> = [
      { slot: 2, text: src?.var_1 },
      { slot: 3, text: src?.var_2 },
    ]
    for (const { slot, text } of variants) {
      if (typeof text === 'string' && text.trim().length > 0) {
        rows.push({
          graphic_id: g.id,
          variation_number: slot,
          text_content: text,
          generated_by: 'ai_extraction',
          generation_context: {
            source: 'import_route',
            source_doc: src?.source_doc ?? null,
          },
        })
      }
    }
    return rows
  })
  if (variationRows.length > 0) {
    const { error: varErr } = await supabase
      .from('lower_thirds_variations')
      .insert(variationRows)
    if (varErr) {
      // Graphics were inserted but variations failed — surface, don't roll back.
      return NextResponse.json(
        {
          warning: `Graphics inserted but variation_1 rows failed: ${varErr.message}. Re-run import for the affected rows or insert manually.`,
          inserted_graphics: insertedGraphics?.length ?? 0,
        },
        { status: 207 },
      )
    }
  }

  return NextResponse.json({
    success: true,
    episodes: { total: payload.episodes.length, new: newEpisodeCount, updated: updatedEpisodeCount },
    graphics: { total: payload.graphics.length, new: insertedGraphics?.length ?? 0 },
    rejected: {
      total: payload.rejected.length,
      items: payload.rejected,
    },
  })
}
