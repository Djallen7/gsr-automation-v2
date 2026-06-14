# GSR Automation v2 — Repo Inventory & Read-Before-Task Guide

**Snapshot date:** 2026-06-14. **Branch surveyed:** `claude/busy-feynman-ldw1oc` (even with `main`).
**Why this exists:** `main` is far too large to load into one session. This file is the
map: read the small high-signal set for whatever you are about to do, skip the rest, and
know which side-branches still hold context that never reached `main`.

**How to keep it current (do this when the repo changes):**
- When you add a load-bearing file, add it to the right area below and to the matching
  read-before-task list.
- When a branch merges to `main` or gets deleted, update the Branch Map.
- Re-run the ground-truth counts (`git ls-files | wc -l`, etc.) and fix the "at a glance"
  numbers. Conflicting facts go in the Conflict Register, not here.

---

## 1. Repo at a glance (ground-truthed 2026-06-14)

| Thing | Count | Notes |
|---|---|---|
| Tracked files | 465 | `git ls-files` |
| Supabase migration files | **50** | on disk. Docs that say "48" are stale — see Conflict Register. |
| Edge functions | 1 | `supabase/functions/extract-on-script-save` |
| API routes (`route.ts`) | 7 | import, extract-lower-thirds, scripts, scripts/confirm-extraction, regenerate, rc-explore, rc-import (+ `auth/callback`) |
| Page routes (`page.tsx`) | 12 | login, episodes, guests, upload, import, extract, lower-thirds, lower-thirds/ready, approved, workflow, toolkit, update-password |
| Docs (`docs/**`) | 298 | of which **252** live in `docs/_handoff/` (198 of those are the transcript-pull-kit) |
| ADRs | 11 | 0001-0006, 0009-0013 (0007/0008 never existed); **ADR-0012 is the architecture of record** |

**Stack:** Next.js 16.2 (App Router only) + React + TypeScript + shadcn/ui + Tailwind v4,
Supabase (project `lafkbxypmciopebentxp`: 20 tables, 2 enums, 2 views, 3 functions, 3
triggers, 1 storage bucket `lower-thirds`), deployed on Vercel. Claude via
`@anthropic-ai/sdk`, server-side only, `ANTHROPIC_REGENERATE_MODEL` (default
`claude-opus-4-7`).

**The naming trap (memorize this):** the lower-thirds table is **`production_lower_thirds`**;
its child is **`lower_thirds_variations`**. There is **no `lower_thirds` table** (the first
migration's filename misleads). A separate table **`production_graphics`** is the Graphics
Tracker. Only the **storage bucket** is named `lower-thirds`.

---

## 2. READ-BEFORE-TASK MATRIX (the point of this file)

Read these, in order, then stop. Each line says why.

### A. Before a PLANNING task (8 files)
1. `CLAUDE.md` — authority order, David Rule, off-limits hardware, anti-churn.
2. `docs/_handoff/HANDOFF.md` — the system snapshot / pickup doc.
3. `docs/_handoff/GSR-WORKFLOW-CANON.md` — Daniel's gospel; how the show actually runs (skim section headers, read the sections your task touches).
4. `docs/_handoff/LANES.md` — the live workstream tracker (what is open/blocked/in progress).
5. `docs/_handoff/2026-06-11-pipeline-build-plan.md` — the build plan of record (slices 0-10 + addenda).
6. `docs/_handoff/CRITICAL-FILES.md` — the carry-list / what must survive a rebuild.
7. `docs/_handoff/VERIFIED-FACTS.md` — fact verdicts (versions, quotas, prices) verified against the live system, not memory.
8. `config/production.json` — the established stack: platforms, vendors, folder structure (source-of-truth #3 for distribution facts).

> Skip for planning: SYSTEM-EVOLUTION (deep background, read only for depth), the
> transcript-pull-kit, the basecamp-map (2,048 lines — pull specific facts, do not load whole).

### B. Before a BUILD task on the parser / lower-thirds pipeline (read in this order)
1. `CLAUDE.md` — rules.
2. `apps/dashboard/AGENTS.md` — **mandatory**; the Next.js 16 caveats (App Router, `@supabase/ssr`). Wrong assumptions here break every route.
3. `apps/dashboard/src/lib/segments.ts` — the canonical 12-value segment enum (tiny; load first).
4. `apps/dashboard/src/lib/import-mode.ts` — the server-side Type-YES write gate; the one rule every write path must route through (tiny).
5. `apps/dashboard/src/app/api/import/route.ts` — the payload contract the parser must emit (Zod shapes + the 15 `l3_type` values + conflict refusal).
6. `apps/dashboard/src/app/api/extract-lower-thirds/route.ts` — the existing AI generator (what level-2 builds on; what a deterministic level-1 parser replaces for past scripts).
7. `supabase/migrations/20260609120000_rename_graphics_to_production_lower_thirds.sql` — the live shape of `production_lower_thirds` (ordering cols, dropped cols, the `v_episode_master` view).
8. `docs/LOWER_THIRDS_STYLE_GUIDE.md` — sections 1-4, 5.6, 6, 10 only (format rules, the 2+15 standard, the 15 l3_types, the extraction quick-reference, the verbatim aired-LT answer key).
9. `docs/_handoff/GSR-WORKFLOW-CANON.md` — sections 0, 1, 13, 14, and the s15 gates (two-systems rule, deterministic-parse contract + the Tim Clarey doc format, the 55-70 length band, the expanded LT definition, the non-waivable gate).
10. If touching the confirm/Edge path: `apps/dashboard/src/app/api/scripts/route.ts`, `.../scripts/confirm-extraction/route.ts`, `supabase/functions/extract-on-script-save/index.ts`, plus migrations `20260527050100_add_l3_type_and_variants.sql`, `20260604180000_add_extraction_confirm_step.sql`, `20260528170055_add_scripts.sql`.
11. For the plan + gates: `docs/_handoff/2026-06-11-pipeline-build-plan.md` Slice 1 (items 1.0-1.7) + the gates section; `docs/_handoff/2026-06-11-next-prompts.md` Prompt B.

> Plus: read the two un-merged parser branches in the Branch Map (§4) before building —
> `fix/lt-merge-blockers` and `claude/vigilant-ramanujan-kt4fdc` carry parser code that is
> not on `main`.

### C. Before a PROMPT-writing or on-air-copy task (9 files)
1. `CLAUDE.md` — rules + voice constraints (no em dashes, client-not-developer tone).
2. `docs/GSR_VOICE_PROFILE.md` — the show's voice; protects David on air.
3. `docs/LOWER_THIRDS_STYLE_GUIDE.md` — the lower-thirds rules the copy must obey.
4. `docs/EMAIL_VOICE_SYSTEM_PROMPT.md` + `docs/EMAIL_TEMPLATES.md` — outbound voice + templates.
5. `docs/PROMPT_LIBRARY.md` — the curated prompt set.
6. `docs/_handoff/GSR-WORKFLOW-CANON.md` — sections 8-9 (voice/editorial canon).
7. `docs/GSR_METADATA_PATTERN.md` — naming/metadata pattern.
8. `agents/gsr-editorial.md` — the editorial agent definition (or just invoke the `gsr-editorial` subagent, which boots with the voice profile).

---

## 3. File inventory by area

Complete buckets; trivial/duplicated files grouped. Categories: **SoT** = source-of-truth,
**PARSER** = lower-thirds pipeline, **SCHEMA**, **UI**, **AGENT/HOOK**, **DOC**, **DERIVED**
(regenerable, do not read), **HIST** (historical/superseded).

### Root
- `CLAUDE.md` — **SoT** mandatory operating rules. · `.env.example` — env contract. · `.mcp.json` — MCP server wiring. · `.gitignore`, `requirements.txt` — DERIVED.

### `.claude/`
- `agents/gsr-architect.md`, `agents/gsr-health.md` — **AGENT** the planner + the health auditor. · `commands/lanes*`, `resume-lane` — lane skills. · `hooks/session-start.sh` (bootstrap + health snapshot), `hooks/pre-commit-check.sh` (TypeScript gate) — **HOOK**. · `settings.json` — harness wiring.

### `.github/`
- Issue templates (bug / decision-needed / feature / plan-change) + workflows `critical-files.yml` (carry-list check) and `course-freshness.yml` — DOC/CI.

### `apps/dashboard/` (62 files)
- `AGENTS.md` — **SoT/PARSER** Next.js 16 caveats; read before any route work. · `package.json` + 10 config files (next.config.ts, tsconfig, eslint, postcss, components.json) — SCHEMA/config.
- **Pages (`src/app/**/page.tsx`, 12):** login, episodes, guests, upload, import, extract, lower-thirds, lower-thirds/ready, approved, workflow, toolkit, update-password — **UI**.
- **API (`src/app/api/**/route.ts`, 7 + auth/callback):** `import` (gated import), `extract-lower-thirds` (Claude generator), `scripts` (+ trigger), `scripts/confirm-extraction`, `regenerate` (3 variations), `rc-explore` + `rc-import` (Rundown Creator passthrough) — **PARSER**.
- **lib:** `segments.ts` (**PARSER** canonical enum), `import-mode.ts` (**PARSER** Type-YES gate), `supabase/*` adapters, `database.types.ts` (**DERIVED** — regenerate from schema).
- **components:** `nav`, `type-yes-confirm`, `copy-text-button`, `font-editor`, 7 shadcn primitives — UI.

### `config/`
- `production.json` — **SoT** the established stack: platforms, vendors, Dropbox folder structure, graphics-tracker columns, episode checklist. Source-of-truth #3 for distribution facts.

### `supabase/` (52 files)
- `migrations/*.sql` (**50**) — **SCHEMA** the entire DB definition (schema, RLS, storage, distributions enum, graphics, guests, episodes, transcripts, scripts, the `on_script_save` trigger, hardening). · `functions/extract-on-script-save/index.ts` — **PARSER** the server-side extractor (same prompt as the in-app route). · `seed`/`guests_bootstrap.sql`, `config.toml`, `README.md`.

### `docs/` (root reference + canon)
- **Reference:** `AUTOMATION_ROADMAP.md` (the anti-churn task backlog), `FAILURE_MODES.md`, `INFRASTRUCTURE_INVENTORY.md` (off-limits hardware map), `SUPABASE_SCHEMA_DESIGN.md`, `OPEN_SOURCE_STACK.md` — **SoT/DOC**.
- **Voice/editorial:** `GSR_VOICE_PROFILE.md`, `EMAIL_VOICE_SYSTEM_PROMPT.md`, `EMAIL_TEMPLATES.md`, `LOWER_THIRDS_STYLE_GUIDE.md`, `GSR_METADATA_PATTERN.md`, `GSR_Research_Charter.md`, `PROMPT_LIBRARY.md`, `PROJECT_INSTRUCTIONS_CLAUDE_DESKTOP.md` — **SoT**.
- `decisions/` — 11 ADRs (**ADR-0012 active**; rest historical). · `reference/` — 3 irreplaceable originals (Video_Pipeline_Setup.docx, training-plan.docx/.pdf). · `runbooks/stage-7-episode-test.md` — the live episode-test runbook. · `ui-mocks/` — 10 design previews (DERIVED).

### `docs/_handoff/` (252 files — the handoff layer)
- **Read-first (5):** `HANDOFF.md`, `CONTEXT-README.md`, `CRITICAL-FILES.md`, `GSR-WORKFLOW-CANON.md`, `VERIFIED-FACTS.md` — **SoT**.
- **System reference (4):** `2026-06-04-SYSTEM-EVOLUTION.md` (full authority), `2026-06-04-CONFLICT-REGISTER.md`, `2026-06-04-tools-curriculum-timeline.md`, `2026-06-05-distribution-research.md`.
- **Mission/build records (7):** `2026-06-11-pipeline-build-plan.md`, `-mission-run-notes.md`, `-fable5-mission-prompt.md`, `-next-prompts.md`, `-superstore-lookup-spec.md`, `-claim-ledger.json` (289 KB), `2026-06-08-review-decisions.md`.
- **Data/guests:** `GUEST-CORRECTIONS.md` (do-not-contact / deceased / corrections — guest-safety authority), `2026-06-08-s3-ep1-16-dataset.md`, `2026-06-08-segment-publishing-schedule.md`.
- **Generated/derived:** `LANES.md` + `lanes.html` (from `lanes.json` via `tools/build_lanes.mjs`), `gsr-automation-v2-course.html` (the course deliverable), `sessions-snapshot.json`, the `*-preview.html` mocks, `gsr-flight-worksheet.html` — **DERIVED**.
- **transcript-pull-kit/ (198 files):** YouTube research transcripts/VTT for the research mission. **Not GSR scripts** — irrelevant to the parser. Skip.
- `transcripts/2026-06-14-pipeline-planning-conversation.md` — this week's planning dialogue (added 2026-06-14).
- `transcript.txt` (522 KB) — raw archaeology of 879 prior conversations; the primary source VERIFIED-FACTS was distilled from.

### `scripts/` and `tools/`
- `scripts/`: `basecamp_token.py` (mints the Basecamp token — entry point for every Basecamp read), `extract_email_voice.py`, `check-critical-files.sh`, `check-course-freshness.sh`.
- `tools/`: `build_lanes.mjs`, `build_flight_worksheet.mjs`, `build_review.mjs`, `nightly_lanes_update.mjs`, `sessions_snapshot.mjs` — generators for the derived docs.

### `agents/` (root)
- `gsr-editorial.md` — **AGENT** the copy/voice reviewer.

---

## 4. Branch Map — what still lives only on side branches

**38 side branches; everything reaches `main` by squash merge, so git shows none as a
literal ancestor.** Content analysis (not `--merged`) says the large majority were
absorbed into `main` and are dead. The short list below is the only context that is
genuinely un-merged and relevant to the parser / lower-thirds focus.

### MUST-READ before parser planning/building (un-merged, focus-relevant)
1. **`fix/lt-merge-blockers`** (73 ahead / 4 behind, 2026-06-12) — the most important parser branch. Holds refinements NOT on `main`:
   - `api/scripts/confirm-extraction/route.ts` — preserves the AI alternate phrasings (`var_1`/`var_2`) into `lower_thirds_variations` (slots 2/3) instead of discarding them.
   - `migrations/...rename_graphics_to_production_lower_thirds.sql` — adds a pre-drop safety snapshot before the irreversible `DROP COLUMN`, and defers the Title→Intro rename to a follow-up.
   - `lower-thirds/graphic-card.tsx` — character rule tuned to **target 60-65, soft-warn over 65, 70 as ceiling**.
2. **`claude/vigilant-ramanujan-kt4fdc`** (145 ahead / **0 behind**, 2026-06-14 — newest branch, the natural continuation base):
   - `lower-thirds/[episode_id]/page.tsx` + `episode-workspace.tsx` — wires the episode-workspace front door, repointed to `production_lower_thirds`.
   - `lower-thirds/graphic-card.tsx` — **hard-block over 70** (approve disabled) + inline Primary | Var1 | Var2. **This conflicts with lt-merge-blockers' soft-warn — a plan must pick one.**
   - `GSR-WORKFLOW-CANON.md` canon s19 (+174 lines), `2026-06-12-dashboard-redesign-plan.md`, `DESIGN-TASTE.md`.
3. **`claude/gsr-monologue-graphics-cues-252cu5`** (26 ahead, 2026-06-12) — the monologue→graphics-cue parser knowledge, nowhere on `main`:
   - `docs/2026-06-09-monologue-graphics-extraction-spec.md` — trained SSOT for how David signals graphics in monologues (validated 9/9 on S03 Ep024). Read first for any monologue work.
   - `.claude/agents/gsr-monologue-graphics.md`, `.claude/skills/gsr-graphics-sourcing/SKILL.md`, worked examples for all 5 June monologues.
4. **`feat/propresenter-txt-export`** (1 ahead / 0 behind, 2026-06-13) — downstream of the L3 pipeline, not on `main`: `lib/propresenter-export.ts` + `lower-thirds/ready/ready-output.tsx` export approved lower thirds as a ProPresenter-ready `.txt`.
5. **`claude/codebase-handoff-review-M9Aia`** (70 ahead, 2026-06-12) — episode/segment + guest context if the data spine is in scope: the S3 Ep1-16 dataset, segment publishing schedule, GUEST-CORRECTIONS, ADRs 0004-0006 (much already on `main`).
6. **`claude/focused-keller-5fgo7`** — only if guest-model provenance is needed: `docs/archive/GUEST_PROFILES.md` (the 168-person roster; not on `main`; the derived seed already is).

### Dead / stale (recommend delete; nothing unique or already on `main`)
`chore/build-status-dashboard`, `chore/basecamp-integration-note`, `claude/gallant-bell-7eow75`, `claude/exciting-newton-osc974`, `claude/sharp-cori-sUXpH`, and the whole squash-absorbed parser/schema family: `feat/extract-pipeline-clean`, `feat/script-extract-pipeline`, `feat/comprehensive-schema-v2`, `feat/stage-6.5-and-audit-fixes`, `feat/guests-workflow-episodes-clean`, `feat/dashboard-nav-guests-workflow-episodes`, `feat/toolkit-page`, `feat/prompt-library`, `feat/gsr-voice-profile`, `claude/happy-goldberg-dwWNd`, `claude/ecstatic-mccarthy-jJ7Ei`, `feat/dashboard-facelift`, `fix/password-reset-recovery-redirect`, `chore/nav-all-pages`, `docs/lower-thirds-style-guide` (main's 514-line guide supersedes the 261-line one), `claude/repo-audit-consolidate-opbXB`, `claude/wonderful-ptolemy-wps731`, `chore/session-start-hook`, `chore/health-check-automation`, `claude/determined-edison-4ceK9` (its RBAC migration was never applied), `feat/ui-build`, `claude/pipeline-ui-design-strategy-Nzivm`.

### Medium-relevance, situational
`chore/stage-7-runbook` (Stage 7 test runbook + a v2 extraction prompt), `chore/two-account-dispatch`, `claude/verify-basecamp-credentials-aqs9vi` (Basecamp/Isaac board), `feat/lower-thirds-table` (superseded by lt-merge-blockers).

---

## 5. Known discrepancies / conflicts

Cross-references the live Conflict Register (`docs/_handoff/2026-06-04-CONFLICT-REGISTER.md`,
extended 2026-06-14). Confirmed during this snapshot:
- **Migration count:** docs (CLAUDE.md, HANDOFF.md) say "48 migrations"; disk has **50 `.sql` files**. Reconcile (some may be unapplied; state it precisely).
- **Lower-thirds character limit:** two un-merged branches disagree — soft-warn-over-65/ceiling-70 (`fix/lt-merge-blockers`) vs hard-block-over-70 (`vigilant-ramanujan`). The live extract prompt still says the **stale** "55-65, never over 65"; canon s13 says **55-70, sweet spot 60-65, hard block over 70**.
- **Destination of lower thirds:** last night's planning note said "tracker + Rundown Creator"; canon s0/s9c is firm that **lower thirds never go to Rundown Creator** (only graphics do). Daniel to confirm; his word updates canon either way.
- The full code-health and parser-correctness findings are filed in the Conflict Register
  and the 5-day plan's "fix-first" list.

> Per `CRITICAL-FILES.md`, no Tier-0/1/2 carry-list file is missing, and no listed file is
> phantom. The discrepancies above are content conflicts, not missing files.
