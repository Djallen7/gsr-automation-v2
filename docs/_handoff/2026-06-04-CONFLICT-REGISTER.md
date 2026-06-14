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
| H-11 | **ADR status banners missing / overstated** | `docs/decisions/0001:4`, `0009:4`, `0010:4`, `0011:5` | 0001 "Accepted" but n8n/SQLite dead (Tailscale is NOT deprecated -- it is permitted for read-only QNAP SMB access; see WORKFLOW-CANON section 13, corrected 2026-06-11); 0009/0010/0011 superseded but carry no back-pointer; 0011 still asserts "Notion is the database." Add "Superseded by ADR-00xx" banners; flag QNAP-admin as prohibited (not Tailscale). | M0 |
| H-12 | **Next.js 15 vs 16.2.6** | `docs/decisions/0012-supabase-backend.md:26`; `apps/dashboard/README.md:3,33,35` | Live is 16.2.6. Correct ADR-0012 (the architecture of record) and the dashboard README. | M0/M10 |
| H-13 | **.env.example missing live vars + lists dead ones** | `.env.example` (RC key/token, `EXTRACT_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_REGENERATE_MODEL` absent; Notion/n8n/Basecamp/Odysee present) | A fresh clone can't run the live pipeline. Add the real vars; move dead-era vars to a labeled "unused" block. | M0/M7/M9 |
| H-14 | **config/production.json stale (David-Rule)** | `config/production.json:7,12` | `episode_count:25` vs 48; `season_3_start_date:2024-09-02` vs 2026. Air-date math off = on-air risk. Read counts from DB; fix the date. | M1/config |
| H-15 | **INFRASTRUCTURE_INVENTORY presents off-limits infra as live** | `docs/INFRASTRUCTURE_INVENTORY.md:14-28,60-94` | QNAP admin dashboard + self-hosted n8n shown as the plan. The 2026-05-20 incident was caused by QNAP admin dashboard access, not Tailscale (Tailscale is permitted for read-only SMB -- confirmed by David and Daniel, 2026-06-11). Add a prominent SUPERSEDED/OFF-LIMITS banner for n8n and QNAP admin dashboard; note Tailscale read-only SMB is permitted. | doc-only (security) |
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

Model `claude-opus-4-7` everywhere; the 12-value `graphic_segment` enum and 15-value `l3_type` CHECK match across all four route copies + DB; `@supabase/ssr` (no auth-helpers, no Pages Router) everywhere; RLS on every table; guests 175 matches the live DB; the `lower_thirds`-phantom is described identically across the `_handoff` set; CTA phone `931-212-7990` correct everywhere (no `7900` exists); pg_cron/pg_net + the `on_script_save` trigger match authority. **STALE as of 2026-06-14 (see §6): "episodes 48" is now 49, and "graphics 0" is now 10 test rows. The 20-tables / 2-views claim remains correct.**

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

---

## 6. 2026-06-14 re-sweep (verified against the live DB this session)

A five-agent deep read (branch archaeology, pipeline-state, repo inventory, repo-health, parser code-correctness) plus my own read-only Supabase queries (project `lafkbxypmciopebentxp`) on 2026-06-14. Authority order unchanged: Daniel's word > GSR-WORKFLOW-CANON > live enum/schema/DB > config > other docs. Items here are precise enough to act on in a later pass.

### 6.1 Live-state drift (I ran the counts; these are facts, not inference)

| ID | Claim in the docs | Live reality (2026-06-14) | Where to fix |
|----|-------------------|---------------------------|--------------|
| D-01 | `production_lower_thirds = 0` rows; "no live import has ever run; the real Stage 7 milestone." | **10 rows, all `pending_review`** — but ALL belong to a synthetic test episode **season 99 ep 1, "TEST - Pipeline Demo (Stage 7, safe to delete)", `source_doc='stage7_demo'`** (created 2026-06-14 00:12 UTC by a prior session). No REAL episode has imported. So the milestone still stands, but "0 rows" is literally false and the live DB carries test pollution. | `CLAUDE.md` Project State; `HANDOFF.md:36`; `SYSTEM-EVOLUTION.md:37`; `pipeline-build-plan.md:152` (item 1.4). Reword to "0 real rows; 10 labeled test rows under season-99, safe to delete." **Recommend deleting the season-99 test episode + its 10 rows before the first real import** (it would otherwise muddy the `count(*) > 0` milestone check, and `/api/import` upserts on `(season, episode_number)`). Deletion is a live write — leave it for Daniel's go. |
| D-02 | `episodes = 48 rows`. | **49 rows** (Season 3 = 48, max ep 48; the 49th is the season-99 test row above). The "Season 3 = 48" claim is correct; the "episodes table = 48" claim is wrong. | Same docs as D-01 + `config/production.json:7`. Resolves once the test row is removed. |
| D-03 | `48 migrations` (CLAUDE.md, HANDOFF, SYSTEM-EVOLUTION); `46` (this register §0); `43/45` (SCHEMA_DESIGN). | **50 applied** (live `list_migrations`) and **50 on disk** — they match each other (schema in sync). Two added after 2026-06-12: `advisor_security_hardening`, `advisor_hardening_public_revoke`. | Sweep every "48/46/45/43 migrations" → **50**. (Supersedes register L-01 / §0 note.) |
| D-04 | (varies) | **20 base tables + 2 views = confirmed correct.** Not a conflict; logged so it is not re-litigated. Register C-2-style worries are unfounded. | none |
| D-05 | LANES.md: "Dev branch: `claude/codebase-handoff-review-M9Aia`"; live-sessions snapshot "10 hours ago / -Users-claudefix". | Actual working branch is `claude/busy-feynman-ldw1oc`; the snapshot is stale. | `lanes.json` (LANES.md is generated). Refresh the branch line + session snapshot. |
| D-06 | Code default model `claude-opus-4-7` (consistent everywhere). | Consistent across repo (not a conflict), but the hardcoded fallback is one minor version behind current Opus. The env var `ANTHROPIC_REGENERATE_MODEL` overrides it. | No file wrong vs another; flag for Daniel to confirm the model string on the next pass. |

### 6.2 Code-health (parser-critical) — confirmed this session, with file:line

Blocker / high items the parser push depends on. Several update or supersede earlier register IDs.

- **CH-01 (blocker, updates L-07).** `/api/regenerate` returns `{ variations: [{text, variationNumber}] }` but the LIVE review grid `lower-thirds/review-grid.tsx:~227-230` reads top-level `data.text`/`data.variationNumber`. Regenerate silently shows nothing on the main `/lower-thirds` screen. L-07 called this "delete if unused" — it is NOT unused; upgrade to blocker. Fix: read `data.variations[0]`.
- **CH-02 (blocker, supersedes H-17).** `/lower-thirds/[episode_id]` is linked from `lower-thirds/page.tsx:~60` but the dir has only `episode-workspace.tsx` and **no `page.tsx`** → the link 404s; the workspace component is dead until a `page.tsx` server wrapper is added. (H-18 — the one-click-import-without-gate — is now RESOLVED: the workspace goes dry-run → TypeYesConfirm → write, `episode-workspace.tsx:~259-316`.)
- **CH-03 (high, David-Rule, updates M-05/L-04).** `upload/upload-form.tsx` still hardcodes an **11-value** segment list (missing `show_intro`) AND writes directly to `production_lower_thirds` + `lower_thirds_variations` from the **browser client** (`:~243-263`), bypassing `/api/import` and the mandatory dry-run + Type-YES gate. Now that the table holds real-shaped rows, this is a live ungated write path. Fix: import shared `SEGMENTS`; route through `/api/import`.
- **CH-04 (high).** No DB unique constraint on `production_lower_thirds(episode_id, segment, beat_number)`. The import conflict-refusal is a read-then-insert (TOCTOU); concurrent or retried imports can duplicate beats. Fix: partial unique index + upsert.
- **CH-05 (high, the big one).** Both extraction engines (`api/extract-lower-thirds/route.ts:151-209`, `functions/extract-on-script-save/index.ts:75-133`) **GENERATE** lower thirds from prose. Neither **PARSES** an existing lower-thirds block out of a pasted script (no boundary heuristic, no `L3:`/`LOWER THIRD:`/numbered marker grammar). The deterministic level-1 separator Daniel described does not exist yet. This reframes the build: grading a generator against the aired answer key will never match. Style guide §10 documents the parse behavior but it is wired into nothing.
- **CH-06 (high, updates M-04).** RC passthrough trusts HTTP status + `res.json()` despite the canon rule "RC returns errors as HTTP 200, always read the body." `rc-explore/route.ts:38-46` and `rc-import/route.ts:52,66` have no body-error check and no try/catch → a 200-with-error-body throws a raw 500. RC GET routes are also still unauthenticated (M-04 open). Fix: read body, guard JSON.parse, assert array shapes, add the 401 gate; ideally the single RC adapter from build-plan item 6.1.
- **CH-07 (high).** Chyron truncation `substring(0,62)+'...'` (`extract-lower-thirds/route.ts:89-90`, edge fn `:62-63`) emits a literal three-dot ellipsis (a banned end-punctuation pattern) and can cut mid-field. Model-generated lines have NO length enforcement; `/api/import` accepts up to 200 chars. Fix: never silently truncate a chyron (drop a field or reject); add a real 55-70 validator (per canon s13: sweet spot 60-65, hard block over 70). NOTE: the live extract prompt still says the **stale** "55-65, never over 65" (register M-02) — must not be propagated into the parser.
- **CH-08 (medium).** Beat-contiguity and the 2+15 / positional-type rules are documented (style guide §5.5/§5.6) but enforced nowhere; `beat_number` comes straight from Claude. Gaps/dupes/misorder pass silently. Fix: validate 1..N contiguity + per-segment positional types in the dry-run summary.
- **CH-09 (medium).** Variation back-fill in three paths (`import/route.ts:~321`, `confirm-extraction/route.ts:~152`, edge fn `:~342`) zips inserted rows to source by **array index**, assuming `INSERT ... RETURNING` preserves input order (not guaranteed). Risk: var_1/var_2 attach to the wrong chyron. Fix: match on a stable key.
- **CH-10 (medium).** `extract-lower-thirds` caps `script_text` at 60,000 chars and `max_tokens` at 4096, while `/api/scripts` has no cap — a long script that saves can later fail extraction, and large packages can truncate the JSON output. Detect `stop_reason==='max_tokens'`; align caps.
- **Resolved since 2026-06-04 (clear from the active list):** H-18 (one-click import gate) → fixed; L-03 (`__text_only__` double-define) → zero references remain. Build-plan item 1.0 / import gate hardening shipped (PR #55): `import-mode.ts` + `import/route.ts:~224` default to dry-run unless `confirm==='YES'`.

### 6.3 Un-merged-branch conflicts (two valid versions exist; a plan must pick)

- **BR-01.** Lower-thirds character limit: `fix/lt-merge-blockers` uses soft-warn-over-65 / 70-ceiling / 60-65 sweet spot; `claude/vigilant-ramanujan-kt4fdc` uses hard-block-over-70 (approve disabled). Neither contains the other. Canon s13 favors the soft-warn-with-hard-70 model. Decide before building the validator (CH-07).
- **BR-02.** The var_1/var_2 → `lower_thirds_variations` preservation lives ONLY on `fix/lt-merge-blockers`; the freshest base (0 behind main) is `vigilant-ramanujan`, which lacks it. A plan must combine them.
