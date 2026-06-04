# GSR Automation v2 - Conflict Register

**Date:** 2026-06-04
**Purpose:** A deduplicated inventory of every outdated / contradictory / ghost-of-old-version item still in the repo after the V3 prune, compiled by a ten-agent read-only sweep cross-checked against the live code, the live Supabase project (`lafkbxypmciopebentxp`), and the canonical `docs/_handoff/` set.

**How to use this:** each item is tagged to the **course module** whose decision settles it (or `doc-only` / `code` / `config`). Work the course; each Blueprint/Decide step locks the answer; the **next pass** edits the listed files to match, then this register goes to zero. Authority order when judging: live code + live DB + `SYSTEM-EVOLUTION.md` + `VERIFIED-FACTS.md` win over every other doc.

> Severity: **HIGH** = wrong output, broken feature, or security/David-Rule risk · **MED** = real drift that will mislead a builder · **LOW** = cosmetic / count drift.

---

## 0. Resolved live this session (2026-06-04)

- **Confirm step is now LIVE.** Migration `add_extraction_confirm_step` applied; `extract-on-script-save` redeployed to v4. `app_config.auto_extract_apply` defaults `false` (hold-for-confirm). The docs that described it as "pending deploy" are now correct-by-reality.
- **Migration count changed 45 -> 46.** Every doc that says "45 migrations" (`CLAUDE.md`, `SYSTEM-EVOLUTION` Part 1, course CONTRACT, `VERIFIED`-adjacent) is now off by one. **Action (this/next pass):** sweep "45 migrations" -> "46 migrations". `SUPABASE_SCHEMA_DESIGN.md` says 43 (doubly stale).

---

## 1. HIGH severity (fix first)

| ID | Theme | Where | Truth / resolution | Module |
|----|-------|-------|--------------------|--------|
| H-01 | **gsr-blueprint ghost** | `docs/_handoff/2026-06-04-tools-curriculum-timeline.md:2,82,305,35-37,95-96` | Says "gsr-automation-v2 repo - read-only; stage in gsr-blueprint." This is the exact reversal of the active decision. Rewrite to "build in gsr-automation-v2"; agent already ships in-repo (no copy step). | M0 |
| H-02 | **gsr-health agent + session hook are broken** | `.claude/agents/gsr-health.md:25-54`, `.claude/hooks/session-start.sh:57` | Calls deleted `scripts/check-routes.sh`/`check-dupes.sh`/`check-config.sh` and audits deleted `BUILD_STATUS.html`/`MASTER_CONTEXT.md`. Hook prints "Routes: INCONSISTENT" every web session. Also unregistered in CLAUDE.md. Rebuild against live app tree + `docs/_handoff/`, or retire; guard the hook. | M0 |
| H-03 | **YouTube category 24 vs 28** | `GSR_METADATA_PATTERN.md:37,166,213`; `PROMPT_LIBRARY.md:833` | Truth is **28 (Science & Tech)**; metadata doc bakes 24 into the field, the JSON payload, and the validation check. PROMPT_LIBRARY #18 (`:762`) is already correct (28). Fix the metadata doc. | M11 |
| H-04 | **lower_thirds phantom / pending rename** | `SUPABASE_SCHEMA_DESIGN.md:9-30,87-89,121,538-539,625-626`; `AUTOMATION_ROADMAP.md:109,111,139`; `runbooks/stage-7-episode-test.md:230` | No `lower_thirds` table exists; the table is `graphics` (bucket is the only `lower-thirds`). Strike the "pending rename" and the false "Stage 7 blocked by column mismatch." | M6 |
| H-05 | **7 "PENDING" tables are actually live** | `SUPABASE_SCHEMA_DESIGN.md:213,244,271,307,328,364,390` | `production_graphics, premade_library, articles, shoot_sessions, booking_pipeline, outreach_drafts, email_threads` all have applied migrations. Remove `[PENDING]`. | M2/M7 |
| H-06 | **l3_type list wrong (11 vs 15) + invalid values** | `LOWER_THIRDS_STYLE_GUIDE.md:373-388` | Guide lists 11 types incl. `mr_news_l3` and `monologue_title_card`, which are NOT in the DB CHECK (15 values) - rows tagged that way **fail import**. Replace with the 15 canonical values; `mr_news_l3` -> `mr_topic_l3`; drop `monologue_title_card` (use `segment_graphics_title`). | M6 |
| H-07 | **Pre-air char range 41-65** | `LOWER_THIRDS_STYLE_GUIDE.md:490` | Contradicts the same doc's "under 55 too short" and the 55-65 band. Change 41 -> 55. | M6 |
| H-08 | **Email tiering: 3 unreconciled models** | `EMAIL_VOICE_SYSTEM_PROMPT.md:31-57` (4-tier), `PROMPT_LIBRARY.md:431,493` (5-tier), `EMAIL_TEMPLATES.md:22` (2-mode) | Same guest -> different salutation/length depending on doc read. Pick the appearance-count model (DB `episode_guests` already computes it) as canonical; map others as fallback; cross-link. | M3 |
| H-09 | **Prompt 04 teaches two banned patterns** | `PROMPT_LIBRARY.md:188,189` vs `GSR_VOICE_PROFILE.md:63-64,51,82-92` | "Start mid-thought" (forbidden; name+show-ID first, hook in sentence 2) and guest-name-first "we'll be joined by... to discuss" (the #1 kill-list pattern). Rewrite Prompt 04. | M4 |
| H-10 | **Anchor-tag sets disagree** | `GSR_METADATA_PATTERN.md:104-116` vs `PROMPT_LIBRARY.md:420` | Two different "always-present" 9-tag sets (differ on 4 of 9). Authority (SYSTEM-EVOLUTION 5.8) matches the metadata doc; fix PROMPT_LIBRARY #09. Lock one casing. | M11 |
| H-11 | **ADR status banners missing / overstated** | `docs/decisions/0001:4`, `0009:4`, `0010:4`, `0011:5` | 0001 "Accepted" but n8n/SQLite/Tailscale dead; 0009/0010/0011 superseded but carry no back-pointer; 0011 still asserts "Notion is the database." Add "Superseded by ADR-00xx" banners; flag Tailscale/QNAP-admin as prohibited. | M0 |
| H-12 | **Next.js 15 vs 16.2.6** | `docs/decisions/0012-supabase-backend.md:26`; `apps/dashboard/README.md:3,33,35` | Live is 16.2.6. Correct ADR-0012 (the architecture of record) and the dashboard README. | M0/M10 |
| H-13 | **.env.example missing live vars + lists dead ones** | `.env.example` (RC key/token, `EXTRACT_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_REGENERATE_MODEL` absent; Notion/n8n/Basecamp/Odysee present) | A fresh clone can't run the live pipeline. Add the real vars; move dead-era vars to a labeled "unused" block. | M0/M7/M9 |
| H-14 | **config/production.json stale (David-Rule)** | `config/production.json:7,12` | `episode_count:25` vs 48; `season_3_start_date:2024-09-02` vs 2026. Air-date math off = on-air risk. Read counts from DB; fix the date. | M1/config |
| H-15 | **INFRASTRUCTURE_INVENTORY presents off-limits infra as live** | `docs/INFRASTRUCTURE_INVENTORY.md:14-28,60-94` | Tailscale + QNAP-admin + self-hosted n8n shown as the plan - the exact path the 2026-05-20 incident barred. Add a prominent SUPERSEDED/OFF-LIMITS banner; keep only the read-only-SMB fact. | doc-only (security) |
| H-16 | **Fireside browser-automation recommended** | `OPEN_SOURCE_STACK.md:105-124`; `PROMPT_LIBRARY.md:773`; `toolkit/prompts.ts:667` | Contradicts "Fireside read-only API, handoff card, do NOT browser-automate." Kill the Playwright-for-Fireside guidance everywhere. | M11 |
| H-17 | **Per-episode route unreachable** | `apps/dashboard/src/app/lower-thirds/[episode_id]/` (no `page.tsx`) | The episode workspace (paste/extract/import/review) is linked but 404s. Add the page or remove the link + component. | M6 |
| H-18 | **UI import skips the mandatory dry-run + YES** | `lower-thirds/[episode_id]/episode-workspace.tsx:255-259` | Calls `/api/import` live in one click - violates the hard import-confirmation rule (masked only because H-17 makes it unreachable). Force dry-run + confirm before fixing H-17. | M6 |

---

## 2. MEDIUM severity

| ID | Theme | Where | Resolution | Module |
|----|-------|-------|-----------|--------|
| M-01 | Era-1 stack docs unbannered | `OPEN_SOURCE_STACK.md` (whole), `FAILURE_MODES.md` (n8n/Playwright/SQLite throughout) | Add "SUPERSEDED by ADR-0012" banner; keep generic principles, mark n8n/Chokidar/SQLite tooling dead. | M0/M11 |
| M-02 | char band "target/exactly 65" | `LOWER_THIRDS_STYLE_GUIDE.md:34`; `api/regenerate/route.ts:130`; `api/extract-lower-thirds/route.ts:159`; edge fn `:83` | Reframe everywhere as "aim for the 55-65 band; 65 is the ceiling." "Exactly 65" drives overshoot. | M4/M6 |
| M-03 | chyron field order | guide `NAME | DISCIPLINE | AFFILIATION` vs code/course `NAME | ORG | FIELD` | Pick one order; align guide to code (`ORG` before `FIELD`) or vice versa. | M6 |
| M-04 | RC GET routes unauthenticated | `api/rc-explore/route.ts`, `api/rc-import/route.ts:80` (GET) | Add the `auth.getUser()` 401 gate used elsewhere. | M7 |
| M-05 | upload-form missing show_intro + client-side writes | `upload/upload-form.tsx:18-30,254-317` | Import shared 12-value `SEGMENTS`; route writes through `/api/import`, not direct browser mutations. | M6/M10 |
| M-06 | distributions platform list 6 vs 9 | `SUPABASE_SCHEMA_DESIGN.md:431-442`; also `production.json:31-38` lists Odysee/FB/IG | Use the 9-value CHECK from migration `...003000`. | M10/M11 |
| M-07 | phantom tables in Integration Map | `SUPABASE_SCHEMA_DESIGN.md:569` | `article_guest_recommendations` and `filming_schedule` do not exist; link is `articles.recommended_guest_id`. Remove. | M2 |
| M-08 | episodes.guest_name deprecated but written | `api/import/route.ts:56,262`; `extract-lower-thirds:251`; `SCHEMA_DESIGN:66,540` | Stop writing it (or un-deprecate). Don't blind-drop while import writes it. | M2 |
| M-09 | signature org name | "Genesis Science Network" vs "Genesis Science Report" across `EMAIL_TEMPLATES.md`, `PROMPT_LIBRARY.md`, `PROJECT_INSTRUCTIONS` | Standardize one (recommend "Genesis Science Network"). | M3 |
| M-10 | "I hope you are doing well" allowed vs banned | `EMAIL_TEMPLATES.md:37`, `PROMPT_LIBRARY.md:443` vs `EMAIL_VOICE_SYSTEM_PROMPT.md:133-145` | Opener-variation rule (no generic pleasantry) is stricter; downgrade the carve-out / fix Template 1. | M3 |
| M-11 | publish-time format ambiguity | `GSR_METADATA_PATTERN.md:176` (`20:00Z`) vs `PROMPT_LIBRARY.md:862` (`16:00 -04:00`) | Standardize explicit ET offset; drop bare `Z` (DST drift). Also reconcile "Monday-only" vs "Tuesday air / Monday publish". | M11 |
| M-12 | title format single-hook vs 3-topic list | `GSR_METADATA_PATTERN.md:45` vs `PROMPT_LIBRARY.md:375` | Single-hook is authoritative; reconcile PROMPT_LIBRARY #08; add the "30% shorter + <70 char" rule to the metadata doc. | M11 |
| M-13 | "Stage 7" overloaded | tools-curriculum-timeline (build-stage) vs SYSTEM-EVOLUTION/CLAUDE (Feature-1 stage) | Rename one axis ("Build Stage" vs "Feature-1 Stage"). | doc-only |
| M-14 | runbook points at pruned docs | `runbooks/stage-7-episode-test.md:164,230` (FEATURE_1_*, BUILD_STATUS) | Repoint to live prompt source + CLAUDE.md. State there is no schema blocker (operational only). | doc-only |
| M-15 | .mcp.json vs "active MCPs" claim | `SYSTEM-EVOLUTION 6.2` lists RC/Sheets/GitHub MCP; `.mcp.json` has supabase/playwright/vercel | Correct doc: RC is in-app via `/api/rc-*`, not MCP; confirm whether GitHub MCP should be configured. | doc-only |
| M-16 | deprecated-doc pointers in PROMPT_LIBRARY | `PROMPT_LIBRARY.md:144,744,833` cite `MASTER_CONTEXT.md` (pruned) | Repoint to `SYSTEM-EVOLUTION` Part 5 (embeds the library). | doc-only |
| M-17 | LOWER_THIRDS guide points at pruned FEATURE_1_* | `LOWER_THIRDS_STYLE_GUIDE.md:476,506` | Repoint. | doc-only |
| M-18 | AUTOMATION_ROADMAP points at pruned PROJECT_PLAN | `AUTOMATION_ROADMAP.md:9,91` | Repoint to SYSTEM-EVOLUTION Part 2. | doc-only |
| M-19 | HANDOFF route list narrower than reality | `docs/_handoff/HANDOFF.md:39` (4 pages) | Match the fuller CLAUDE.md/CONTRACT route list or mark abbreviated. | doc-only |
| M-20 | Video_Pipeline_Setup vs cloud-only | `docs/reference/Video_Pipeline_Setup.docx` | Mark as the local-transcription option only; strip server-mirror/rsync framing. | M9 |
| M-21 | guest seed count 209 vs 175 live | `supabase/seeds/guests_bootstrap.sql:1` | Note seed is upsert-safe; live settled at 175. Don't treat 168/209/175 as interchangeable. | M2 |
| M-22 | articles.lane 9 values vs interview_prep.lane 7 | `SCHEMA_DESIGN:284,207` vs migrations | Document `articles.lane` as 9; note the divergence or reconcile. | M5 |

---

## 3. LOW severity (cosmetic / counts)

| ID | Theme | Where | Resolution |
|----|-------|-------|-----------|
| L-01 | Migration count 43/45 -> 46 | `SCHEMA_DESIGN:3,575`; all "45 migrations" mentions | Sweep to 46 (post confirm-step). |
| L-02 | toolkit 21 prompts vs docs say 20 | `toolkit/prompts.ts` vs SYSTEM-EVOLUTION 3.6/5.6 | Pick the real count; align docs. |
| L-03 | `__text_only__` defined twice | `lib/text-only-sentinel.ts:4` + `api/import/route.ts:45` | Import the shared constant. |
| L-04 | segment enum hand-duplicated x4 | import / extract / scripts / confirm-extraction routes | Extract a shared module (latent drift risk). |
| L-05 | `/upload` "legacy/phasing out" vs built+in-nav | `nav.tsx:14`, status docs | Remove from nav or un-deprecate in docs. |
| L-06 | em-dash in locked show-open quote | `GSR_VOICE_PROFILE.md:44`, `SYSTEM-EVOLUTION:295` | Add a carve-out note (spoken pause, not written copy). |
| L-07 | review-grid broken response shape | `lower-thirds/review-grid.tsx:236-239` (reads `data.text`; route returns `{variations}`) | Delete if unused, or fix. |
| L-08 | sponsor line wording drift | `GSR_METADATA_PATTERN.md:90` vs `PROMPT_LIBRARY.md:415` | Pick one verbatim sponsor sentence. |
| L-09 | .gitignore stale workflows/n8n path | `.gitignore:24-26` | Optional removal (path no longer exists). |
| L-10 | training-plan.docx teaches Next 14 | `docs/reference/training-plan.docx` | Add a note: live project is Next 16 App Router. |
| L-11 | chapter_markers JSON shape mismatch | `SCHEMA_DESIGN:84` (`{label,timecode}`) vs migration (`{time,label}`) | Align to the migration shape; verify against render code. |
| L-12 | `gsr-research` repo mentioned, unscoped | `SYSTEM-EVOLUTION:514` | Note purpose or scope it out. |
| L-13 | phone bolding cosmetic | `PROMPT_LIBRARY.md:340` (`7**990**`) | De-bold. (No wrong 7900 found anywhere - good.) |

---

## 4. Confirmed CONSISTENT (no action - logged so the next pass does not re-litigate)

Model `claude-opus-4-7` everywhere; the 12-value `graphic_segment` enum and 15-value `l3_type` CHECK match across all four route copies + DB; `@supabase/ssr` (no auth-helpers, no Pages Router) everywhere; RLS on every table; episodes 48 / guests 175 / graphics 0 match the live DB; the `lower_thirds`-phantom is described identically across the `_handoff` set; CTA phone `931-212-7990` correct everywhere (no `7900` exists); pg_cron/pg_net + the `on_script_save` trigger match authority.

---

## 5. Suggested course-module mapping (so decisions purge conflicts)

- **M0 Ground rules:** H-01, H-02, H-11, H-12, H-13, M-01, M-13.
- **M2 Guest DB:** H-05, M-07, M-08, M-21.
- **M3 Outreach:** H-08, M-09, M-10.
- **M4 Script/Voice:** H-09, M-02, M-12, L-02.
- **M5 Validation:** M-22.
- **M6 Graphics:** H-04, H-05, H-06, H-07, H-17, H-18, M-03, M-05, L-03, L-04, L-07.
- **M7 Rundown:** H-05, M-04.
- **M9 Transcription:** H-13, M-20.
- **M10 Dashboard:** H-12, M-05, M-06.
- **M11 Distribution:** H-03, H-10, H-16, M-06, M-11, M-12, L-08.
- **doc-only / config:** H-14, H-15, the remaining M/L doc-pointer + banner items.
