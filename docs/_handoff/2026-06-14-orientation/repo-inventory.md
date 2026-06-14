# GSR Repo Inventory + Read-Order — snapshot 2026-06-14

> **What this is:** an auto-generated orientation map of the whole repo, written for a
> non-developer owner, so you (and any fresh session) can stop loading files you don't
> need. It is a CONVENIENCE map, not an authority. When any specific fact here conflicts
> with `GSR-WORKFLOW-CANON.md`, `CRITICAL-FILES.md`, `config/production.json`, or the live
> Supabase schema, **those win.** Counts and dates are point-in-time.
>
> **2026-06-14 note:** a 10-row TEST import (episode **S99E001**, "TEST - Pipeline Demo")
> was made this day to prove the review UI renders real rows, so `production_lower_thirds`
> is no longer at 0 — it holds those test rows, pending cleanup (delete S99E001 to reset).
> Verified live: the repo has **50** migrations (note: `CLAUDE.md` still says 48 — stale).

---

## 1. Inventory by Area

### a) Source-of-truth handoff docs in `docs/_handoff/`

Read in this order when starting work:

| File | Purpose |
|------|---------|
| **HANDOFF.md** | The crash course: what was built, how to continue. Start here. |
| **GSR-WORKFLOW-CANON.md** | How Daniel actually runs GSR; gospel facts never to re-ask (Lower Thirds vs Graphics hard rule, intake model, team roster, the operating mandates). Append-only. |
| **2026-06-04-SYSTEM-EVOLUTION.md** | Full live-verified system reference: the three eras, schema snapshot, every live route + API contract. |
| **VERIFIED-FACTS.md** | Facts confirmed against the live system; cite before web research. |
| **CRITICAL-FILES.md** | The carry-forward list of irreplaceable files. The authority for "what not to lose." |
| **DESIGN-TASTE.md** | The ONLY visual design guidance (Daniel's reactions; append-only). Older mocks in `docs/_archive/2026-06-12-ui-fresh-start/` are NOT guidance. |
| **LANES.md** / **lanes.json** | The living workstream tracker (status + resume prompt per lane). Generated from lanes.json. |
| **PRODUCER-JOURNAL.md** | Raw brain-dump intake (producer-model lane parked 2026-06-13); durable findings promoted to canon. |
| **2026-06-11-pipeline-build-plan.md** | The build plan of record; slices 0-10 + addenda. Slice 1 = the lower-thirds pipeline ("phase one"). |
| **2026-06-12-dashboard-redesign-plan.md** | Dashboard nav/IA + build sequence (visual sections retired by the 2026-06-12 fresh start). |
| **GUEST-CORRECTIONS.md** | Do-not-contact / deceased / title corrections; guest-facing safety authority. |

Historical/reference (archaeology, not re-asking): `2026-06-04-tools-curriculum-timeline.md`, `2026-06-05-distribution-research.md`, `2026-06-08-review-decisions.md`, `2026-06-04-CONFLICT-REGISTER.md`, `2026-06-11-superstore-lookup-spec.md`, `2026-06-08-basecamp-map.md`, `2026-06-11-claim-ledger.json`, `transcript.txt`.

### b) Other `docs/` — branded guidance

`GSR_VOICE_PROFILE.md` (the on-air voice; protects David) · `EMAIL_VOICE_SYSTEM_PROMPT.md` · `EMAIL_TEMPLATES.md` · `LOWER_THIRDS_STYLE_GUIDE.md` (ALL CAPS, 55-65 char band, chyron NAME | ORG | FIELD) · `GSR_METADATA_PATTERN.md` · `GSR_Research_Charter.md` · `PROMPT_LIBRARY.md` · `PROJECT_INSTRUCTIONS_CLAUDE_DESKTOP.md` · `OPEN_SOURCE_STACK.md` · `INFRASTRUCTURE_INVENTORY.md` (machines, IPs, off-limits hardware) · `FAILURE_MODES.md` · `AUTOMATION_ROADMAP.md` (named-task backlog) · `SUPABASE_SCHEMA_DESIGN.md` · `decisions/` (the ADRs; 0012 = Supabase backend).

### c) Dashboard app — `apps/dashboard/src/`

Next.js 16.2 (App Router only) + Supabase SSR + shadcn/ui + Tailwind v4, on Vercel.

**Pages:** `/login`, `/import` (dry-run bulk ingest), `/lower-thirds` + `/lower-thirds/[episode_id]` (the per-episode workspace) + `/lower-thirds/ready` + `/approved` (review/output), `/extract` (AI extraction), `/episodes`, `/guests`, `/workflow`, `/toolkit`, `/upload` (legacy PNG), `/distribution` (platform status board), `/auth/callback`, `/update-password`.

**API:** `/api/import` (Zod + Type-YES gate), `/api/extract-lower-thirds` (Claude call, no DB write), `/api/regenerate` (3 variations), `/api/scripts` + `/api/scripts/confirm-extraction`, `/api/rc-explore`, `/api/rc-import`.

**Load-bearing files:** `src/lib/segments.ts` (the 12-value segment list — add here AND in a migration if extending) · `src/lib/import-mode.ts` (server-side Type-YES gate: no token, no write) · `src/app/api/import/route.ts` (the gated import heart) · `src/lib/supabase/server.ts` + `client.ts` (`@supabase/ssr`) · `src/middleware.ts` (auth guard) · `src/app/lower-thirds/[episode_id]/episode-workspace.tsx` (the per-episode editor) · `src/app/lower-thirds/graphic-card.tsx` (review card + char band + variation comparison) · `src/app/distribution/*` (tracker) · `apps/dashboard/AGENTS.md` (Next.js 16 caveats — READ before route code).

### d) Supabase backend — `supabase/`

**50 migrations.** Key ones: the lower-thirds schema; baseline RLS; guests; distributions + platform enum; the 2026-06-09 rename `graphics` → `production_lower_thirds` (child → `lower_thirds_variations`); the 2026-06-12 advisor/security hardening; the server-enforced Type-YES gate.

**Schema facts:** ~20 core tables (episodes, production_lower_thirds, lower_thirds_variations, production_graphics, guests, episode_guests, scripts, distributions, transcripts, content_clips, social_posts, booking_pipeline, outreach_drafts, articles, interview_prep, premade_library, …) + 2 views (`v_episode_master`, `v_episode_workflow`) + functions/triggers (script-save → extraction) + 1 storage bucket (`lower-thirds`). Enums: `graphic_segment` (12 values), `graphic_status` (pending_review/approved/rejected/needs_revision). RLS on every table; authenticated read/insert/update. **The lower-thirds "phantom":** there is NO `lower_thirds` table — only `production_lower_thirds` (and the storage bucket). Live rows: 48 episodes, 175 guests, production_lower_thirds = the 10 test rows noted above.

### e) Scripts — `scripts/`

`check-critical-files.sh` (carry-list presence + audit; runs in CI + session-start) · `check-course-freshness.sh` · `basecamp_token.py` · `extract_email_voice.py`.

### f) Build tools — `tools/`

`build_lanes.mjs` (renders LANES.md + lanes.html from lanes.json) · `nightly_lanes_update.mjs` · `sessions_snapshot.mjs` · `build_flight_worksheet.mjs` · `build_review.mjs`.

### g) Claude Code harness — `.claude/`

Agents: `gsr-architect.md` (system-aware planner), `gsr-editorial.md` (copy/voice), `gsr-health.md` (repo-health auditor). Commands: `lanes.md`, `resume-lane.md`. Skills: `rundown-creator/SKILL.md`. Hooks: `session-start.sh`, `pre-commit-check.sh`. `settings.json` wires it together.

### h) Config + root

`CLAUDE.md` (mandatory operating rules + live route list) · `config/production.json` (show facts, segments, platform enum — source-of-truth #3) · `.env.example` · `.mcp.json` · `requirements.txt`.

---

## 2. Read-order matrix (stop loading what you don't need)

**Planning a feature:** CLAUDE.md → GSR-WORKFLOW-CANON.md (§0-2 + the mandates) → SUPABASE_SCHEMA_DESIGN.md → HANDOFF.md → LANES.md → AUTOMATION_ROADMAP.md → CRITICAL-FILES.md (skim Tier 0) → config/production.json → the relevant build-plan slice.

**Building / coding:** apps/dashboard/AGENTS.md → src/lib/segments.ts → src/lib/import-mode.ts → src/app/api/import/route.ts → SUPABASE_SCHEMA_DESIGN.md → CLAUDE.md (Development Conventions) → config/production.json → LOWER_THIRDS_STYLE_GUIDE.md (if touching L3s).

**Writing a prompt for a fresh session:** HANDOFF.md → CLAUDE.md → GSR-WORKFLOW-CANON.md (§0-3 + mandates) → LANES.md (grab the lane's resume prompt) → CRITICAL-FILES.md (Tier 0) → config/production.json → AUTOMATION_ROADMAP.md → apps/dashboard/AGENTS.md.

---

## 3. Facts never to re-ask

1. **Lower Thirds ≠ Graphics** — two separate systems, tables, workflows.
2. **The table is `production_lower_thirds`** (not `lower_thirds`; only the bucket is `lower-thirds`).
3. **Type-YES is the live-write gate** — dry-run, counts shown, explicit YES; server-enforced in `import-mode.ts`.
4. **Segment enum = 12 values** — extend in `segments.ts` AND a migration together.
5. **The David Rule** — automation talks to cloud APIs only; never the ProPresenter machine / QNAP admin / ATEM / Companion without David's explicit approval.
6. **Daniel is the authority** — his word supersedes any doc; append his decisions to canon, dated.
7. **Next.js 16 is different** — async cookies/params; App Router only; `@supabase/ssr`. Read AGENTS.md before route code.
