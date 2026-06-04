# VERIFIED FACTS - conflict resolution (2026-06-04)

*Every row below was checked against the running code, the migration files, and the live Supabase database on 2026-06-04. When a doc disagrees with this table, the doc is wrong.*

## How to read this

- **TRUTH** = what the code / DB actually is.
- **Source** = how it was verified.
- **Stale claims** = docs that state it differently and should be corrected.

---

## A. Counts and inventory

| Fact | TRUTH | Source | Stale claims to fix |
|---|---|---|---|
| Migrations applied | **45** (45 files on disk, 45 applied) | `list_migrations` on `lafkbxypmciopebentxp` + `ls supabase/migrations` | `BUILD_STATUS.html` says 28; `SESSION_HANDOFF.md` says 43 |
| Routes (pages + API) | **20** (13 pages, 7 API/auth) | read every `page.tsx` / `route.ts` | `CLAUDE.md` lists 7; `SESSION_HANDOFF.md` lists 9; `2026-06-03-gsr-handoff.md` lists 7 |
| Episodes in DB | **48** Season 3 (Ep1-15 real dates+URLs, Ep16-48 extrapolated Tuesdays to 2027-01-05) | `CLAUDE.md` project state | `config/production.json` says `episode_count: 25` |
| Season 3 start date | 2026 air dates (per CLAUDE.md) | `CLAUDE.md` | `config/production.json` says `2024-09-02` (stale) |

## B. Stack and architecture

| Fact | TRUTH | Source | Stale claims to fix |
|---|---|---|---|
| Next.js version | **16.2.6** | `apps/dashboard/package.json` | ADR-0012 says Next.js 15 |
| React version | 19.2.4 | `apps/dashboard/package.json` | - |
| Claude model | **`claude-opus-4-7`** (env-overridable) | `regenerate/route.ts:6`, `extract-lower-thirds/route.ts:6`, Edge Fn `index.ts:9` | none (consistent); note repo runs one minor behind the session model |
| Data layer | **Supabase** (project `lafkbxypmciopebentxp`) | `.mcp.json`, code | `docs/design-bible/*` and `docs/hub-ui/PRODUCTION_HUB_BIBLE.md` assume Notion-as-backend (pre-ADR-0012; valid for UI/IA only) |
| Orchestrator | none live; n8n **deferred** (templates only in `workflows/`) | `workflows/n8n/.gitkeep` empty | ADR-0001 / `PROJECT_PLAN.md` present n8n as active |

## C. The "blocker"

| Claim | Reality | Source |
|---|---|---|
| "Stage 7 blocked by JSON mismatch vs `lower_thirds` table columns" (`CLAUDE.md`) | **Resolved.** No `lower_thirds` table exists; the table is `graphics`. The needed columns (`l3_type`, `var_1`, `var_2`) shipped in `20260527050100_add_l3_type_and_variants.sql`. `/api/import` is fully built (Zod, dry-run/live, conflict detection). | migration files + `api/import/route.ts` |

## D. Project-stage model

| Doc | Says | Status |
|---|---|---|
| `README.md` | "Phase 1 of 4" | Stale (old 4-phase model) |
| `ROADMAP_VISUAL.md` | ends at "Stage 6 - Real Episode Test" | Stale (pre Stage 6.5 insert) |
| `CLAUDE.md` / `BUILD_STATUS.html` | "Stage 7 (real episode test)" | **Current model.** Stage 6.5 (text import + fonts) was inserted, bumping the real-episode test to Stage 7. |

## E. Domain rules (the ones an automated system MUST get right)

| Rule | TRUTH | Stale/conflicting claim |
|---|---|---|
| Lower-thirds case | **ALL CAPS always** | - |
| L3 character band | working band **55-65**, hard ceiling **65** (never over) | `LOWER_THIRDS_STYLE_GUIDE.md` frames it as "target 65"; schema/prompts say 55-65. Both agree on the 65 ceiling. |
| L3 punctuation | no em dashes, commas, connecting hyphens, slashes, end-periods, brackets, wrapping quotes. Abbreviation periods OK. Pipe `|` for chyrons only; colon `:` for topic beats. | - |
| `l3_type` vocabulary | **15** values (the DB CHECK is truth): `episode_intro_l3, monologue_beat, segment_graphics_title, topic_l3, guest_chyron, discussion_l3, generic_safety_net, qa_topic_l3, mr_topic_l3, mr_cta_l3, correspondent_chyron, viewer_l3, resource_l3, cta_l3, other` | `LOWER_THIRDS_STYLE_GUIDE.md` lists only 11 friendly types |
| Segment enum | **12** values: `show_intro, opening_monologue, interview_1, interview_2, kids_corner, genesis_science_qa, ministry_report, viewer_voices, featured_resource, heavens_declare, genesis_science_minute, other` | - |
| Guest chyron | `DR. [FIRST LAST] | [DISCIPLINE] | [AFFILIATION]`, third field positions the guest (credential/book), verified from the guest's own bio - never fabricated | - |
| Ministry Report CTA (locked, verbatim) | `SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990` | any doc showing phone `...7900` is wrong; it is **931-212-7990** |
| YouTube title | `[Hook] | Genesis Science Report - S03, Ep##`; **~30% shorter** than full production title; under 70 chars; finding-first not guest-first | AI repeatedly forgets the 30% rule - restate every run |
| YouTube category | **28 (Science & Technology)** | `GSR_METADATA_PATTERN.md` says 24 (Entertainment) - stale |
| Air vs publish cadence | TV airs **Tuesday 8 PM CST**; YouTube publishes **the day before, Monday 4 PM ET**; default privacy `private` until approved | older metadata doc implies Monday-only |
| Anchor tags | 9 always-present anchor tags + 10-18 topical | exact anchor strings differ between `GSR_METADATA_PATTERN.md` and `PROMPT_LIBRARY.md` #09 - reconcile before automating tags |

## F. Editorial / voice (hard bans)

- No em-dashes anywhere (on-air copy, email, lower thirds). Confirmed AI tell.
- No "I hope this email finds you well" or variants.
- No fact-first hooks; lead with tension.
- No fabricated guest credentials.
- One draft when one is asked for; no preamble, no options menu.
- Sign emails as **Daniel Allen, Producer** - never as David Rives. Default sign-off `Best,`.
- On-air: 7th-grade reading level, 5-10 word sentences, 20-word hard cap. Scripture lands in the final third of the monologue, never before the midpoint.

## G. People (for disambiguation)

- **Daniel Allen** (a.k.a. "Mae") - solo producer, non-developer, builds via Claude Code.
- **David Rives** - host / ministry director / on-air talent ("The David Rule" protects him).
- **Miryam / Myriam** - co-producer; social + uploads; Viewer Voices reporter.
- **Isaac** - graphics + post editor; owns the production-graphics tracker.
- **Jakob** (editor / roll-in graphics) is **not** **Jacob** (footage transfer / THD). Two different people, near-identical names. `MASTER_CONTEXT.md` defines them distinctly; some docs conflate them.

## H. Known doc-pointer problems

- `docs/CONTEXT_BOOTSTRAP.md` points at repo `Djallen7/gsr-automation` (no `-v2`) and defaults Claude to "Phase 1." Both stale.
- `BUILD_STATUS.html` `LAST_UPDATED = 2026-05-30` but shows PR-#34/#35 routes as merged while same-day `SESSION_HANDOFF.md` says those PRs were still open. On this branch the routes **do** exist, so they landed - update both docs.
- ADRs 0004-0008 do not exist (numbering gap). 0009 and 0010 are dead (superseded by 0011) but `CLAUDE.md` only calls out 0001 and 0011 as historical.
