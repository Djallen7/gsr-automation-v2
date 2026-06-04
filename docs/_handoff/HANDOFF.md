# GSR Automation - Codebase Handoff (verified against code)

*Date: 2026-06-04 - Author: codebase-handoff-review session - Status: current and code-verified.*

> Read this first. It describes the project as the **code actually is on this branch**, not as older docs imagine it. Where this file and any other doc disagree, this file and `VERIFIED-FACTS.md` win, because they were checked against the running code and live database on 2026-06-04. The older docs (`README.md`, `docs/PROJECT_PLAN.md`, `docs/MASTER_CONTEXT.md`, `docs/CONTEXT_BOOTSTRAP.md`, `ROADMAP_VISUAL.md`, `docs/SESSION_HANDOFF.md`, `BUILD_STATUS.html`) are stale in specific ways listed in `VERIFIED-FACTS.md`.

---

## 1. What this is

The Genesis Science Report (GSR) is a weekly creation-science TV show (~58 min, Season 3) for David Rives Ministries / Genesis Science Network. Daniel Allen is the solo producer and a non-developer who builds everything through Claude Code. This repo is the automation that removes repetitive manual work across two pipelines: pre-production (guest research, scripts, lower thirds, outreach) and post-production / distribution (transcription, metadata, posting).

The live deliverable today is **Feature 1: Episode Graphics and Asset Tracker** - a dashboard for ingesting scripts, extracting and reviewing lower-thirds graphics, and tracking episodes, guests, and distribution.

## 2. Stack (verified 2026-06-04)

- **App:** `apps/dashboard` - Next.js **16.2.6**, React **19.2.4**, shadcn/ui (`shadcn ^4.8.0`), Tailwind v4, deployed on Vercel.
- **Backend:** Supabase (project `lafkbxypmciopebentxp`), SSR via `@supabase/ssr ^0.10.3`.
- **AI:** `@anthropic-ai/sdk ^0.98.0`. Model is **`claude-opus-4-7`** in all three call sites (`/api/regenerate`, `/api/extract-lower-thirds`, and the `extract-on-script-save` Edge Function), overridable via env `ANTHROPIC_REGENERATE_MODEL`.
- **No root `package.json`** (this is why `npx skills` throws ENOENT from repo root; run it from `~` or use `--global`).
- **Next.js 16 caveat:** this is not the Next.js in your training data. Read `apps/dashboard/AGENTS.md` and `apps/dashboard/node_modules/next/dist/docs/` before writing route handlers, server actions, or App Router code.

## 3. Routes that exist (20, verified by reading the files)

**Pages (`apps/dashboard/src/app/**/page.tsx`):**

| Route | Purpose | In top nav? |
|---|---|---|
| `/` | Redirects to `/lower-thirds` | n/a |
| `/login` | Magic-link **and** password auth (mode toggle) | n/a |
| `/update-password` | Password recovery form | n/a |
| `/upload` | Legacy PNG upload (being phased out) | yes |
| `/import` | Text-only bulk JSON ingest UI | yes |
| `/extract` | Pick episode + segment, paste script, run AI extraction | no (reachable) |
| `/lower-thirds` | Review grid (approve / reject / regenerate) | yes (Review) |
| `/lower-thirds/ready` | Approved-graphics output, grouped by episode/segment | no (reachable) |
| `/approved` | Approved queue, ProPresenter copy button, font editor | yes |
| `/episodes` | Episode CRUD with production-status badges | yes |
| `/guests` | Guest CRUD (full guest schema) | yes |
| `/workflow` | Per-episode guest email-cadence tracker (`v_episode_workflow`) | yes |
| `/toolkit` | Prompt library; builds a guest-roster string from Supabase | yes |

**API + auth routes (`route.ts`):**

| Route | Purpose | Calls |
|---|---|---|
| `/api/regenerate` | Regenerate 3 L3 variations for one graphic; rate-limited 20/hr/user | Anthropic (`claude-opus-4-7`) |
| `/api/import` | Bulk ingest episodes + graphics; Zod-validated; **dry-run + live**; refuses on conflict | Supabase |
| `/api/extract-lower-thirds` | Script -> L3 JSON shaped for `/api/import`; does **not** write the DB itself | Anthropic |
| `/api/scripts` | Upsert one script per `(episode_id, segment)` | Supabase |
| `/api/rc-explore` | Proxy to Rundown Creator API (list rundowns/rows, fetch a script) | Rundown Creator |
| `/api/rc-import` | Pull RC rundown segments -> upsert `scripts`; dry-run default | RC + Supabase |
| `/auth/callback` | OAuth / magic-link code exchange; routes recovery to `/update-password` | Supabase |

## 4. The script -> lower-thirds extraction pipeline (the big new subsystem)

This is the most important thing the older docs do **not** mention. It exists in two parallel forms that share one prompt design:

1. **Manual / synchronous (safe path):** `/extract` page -> `/api/extract-lower-thirds`. Input is `{episode_id, segment, script_text}`. It pulls the episode + guests, builds the guest chyron, prompts Claude, and returns **JSON pre-shaped for `/api/import`**. It does **not** touch the database. The operator still runs that JSON through `/api/import` (which has the dry-run -> "Type YES" -> live discipline). This path honors the lower-thirds import confirmation rule.

2. **Automatic / trigger-driven:** saving a script (via `/api/scripts` or `/api/rc-import`) writes the `scripts` table -> trigger `on_script_save` -> `notify_script_extract()` -> `pg_net` HTTP POST to the Edge Function `extract-on-script-save` (auth via `x-webhook-secret` from the `app_config` table). The Edge Function runs the same prompt, then **deletes existing `pending_review` graphics for that episode+segment and inserts the new ones** with the service role.

**Governance note (read this):** the automatic path bypasses the `/api/import` dry-run + "Type YES" step that the mandatory "Lower-thirds import confirmation" rule in `CLAUDE.md` was written around. It is **not** an on-air risk on its own, because new rows land as `status = 'pending_review'` (verified at `supabase/functions/extract-on-script-save/index.ts:259`) and approved rows are preserved (only pending rows are replaced) - so nothing reaches ProPresenter or air without the human approve step in `/lower-thirds`. But it does mean graphics get created and silently replaced without an explicit import. **Decision needed from Daniel:** keep the auto-path as-is (pending-only, human approves later), or add a confirmation/notification step. Until decided, treat the trigger as live behavior, not a draft.

## 5. Database (verified via `list_migrations`, 2026-06-04)

- **45 migrations applied** to project `lafkbxypmciopebentxp`, matching 45 files in `supabase/migrations/`. (Older docs say 28 or 43; both wrong. Remote version timestamps differ cosmetically from filenames because of how they were pushed, but count and content match.)
- **Core tables:** `episodes`, `graphics` (the lower-thirds table - there is **no** table literally named `lower_thirds`), `graphics_variations`, `regenerate_attempts`.
- **Workflow/data tables:** `guests`, `episode_guests`, `interview_prep`, `transcripts`, `distributions`, `content_clips`, `social_posts`, `premade_library`, `shoot_sessions`, `articles`, `production_graphics`, `outreach_drafts`, `booking_pipeline`, `email_threads`, `scripts`, `app_config` (RLS on, no policies = service-role-only secret store).
- **Views:** `v_episode_master` (flat joined "spreadsheet", `security_invoker=on`), `v_episode_workflow` (computed email due-dates; powers `/workflow`).
- **RPCs / functions:** `toggle_propresenter_added(uuid)` (atomic, hardened), `set_updated_at()`, `notify_script_extract()`.
- **Triggers:** `set_scripts_updated_at`, `on_script_save`.
- **Extensions:** `pg_cron` + `pg_net` (so the trigger can POST to the Edge Function).
- **Conventions:** snake_case; RLS enabled on every table; service role only server-side; atomic mutations via RPC; regenerate TS types + run advisors after schema changes. GSR tables use `uuid` PKs (not the repo-default `bigint`).

## 6. The blocker in CLAUDE.md is already resolved

`CLAUDE.md` says Stage 7 is "blocked by JSON schema mismatch vs actual `lower_thirds` table columns." That is **stale**:
- There is no `lower_thirds` table; the table is `graphics`.
- The columns the importer needs (`l3_type`, `var_1`, `var_2`) were added in migration `20260527050100_add_l3_type_and_variants.sql`.
- `/api/import` is fully built: Zod validation, dry-run + live modes, conflict detection, text-only sentinel handling.

So the import path the blocker referred to has been migrated and built. Confirm a clean end-to-end run on a real episode, then mark Stage 7 done.

## 7. Where things actually are vs. blocked

- **Live and working:** the whole dashboard in section 3, the extraction pipeline in section 4, 45 applied migrations.
- **Off-limits infrastructure (non-negotiable):** ProPresenter production machine `GSN-PropRes` (Tailscale `100.98.215.7`), ATEM / Bitfocus Companion, QNAP write access (read-only SMB only), Notion workspace (wiki-only after ADR-0012). No Tailscale / SSH / file-watchers - permanently barred after the 2026-05-20 server incident. All automation goes through cloud APIs or read-only SMB.
- **Credentials:** never in chat. 1Password CLI only (`op item get "<item>" --fields password --reveal`). Vault `GSR Automation`.

## 8. Config gaps worth fixing (found during this review)

- `config/production.json` says `episode_count: 25` and `season_3_start_date: 2024-09-02`. CLAUDE.md says 48 episodes with 2026 air dates. The production.json values are stale and should be reconciled.
- `.env.example` is missing vars that newer code requires: Rundown Creator API key (used by `/api/rc-*`), and the Edge Function's `EXTRACT_WEBHOOK_SECRET` / service-role key. Document these.
- `.mcp.json` configures `supabase`, `playwright`, `vercel` only. CLAUDE.md calls Rundown Creator MCP and Google Sheets MCP "active," but RC is now an in-app integration (`/api/rc-*`), not an MCP here, and no Sheets MCP is configured.
- Subagents: only `agents/gsr-editorial.md` exists in-repo. CLAUDE.md references `gsr-pipeline` and `gsr-supabase`; those live in `~/.claude/agents/` (user scope), not in this repo.

## 9. What to do next (recommended order)

1. **Decide the auto-extraction governance question** (section 4) - this is the one item that needs Daniel.
2. **Run one real episode end-to-end** through script -> extract -> import -> review -> approved, to formally close Stage 7.
3. **Refresh the stale docs** so a future session is not misled: update `CLAUDE.md` "What is built" + blocker line, fix the migration/route counts in `BUILD_STATUS.html` and `SESSION_HANDOFF.md`, and reconcile `config/production.json`. (See `VERIFIED-FACTS.md` for the exact corrections.)
4. **Continue the roadmap** (`docs/AUTOMATION_ROADMAP.md`): YouTube RSS poller Edge Function, then content clips + social, then the timecode/title pipeline.

See `VERIFIED-FACTS.md` for the conflict-by-conflict resolution, `2026-06-04-SYSTEM-EVOLUTION.md` for how the architecture got here, and `2026-06-04-tools-curriculum-timeline.md` for the tool inventory and build order.
