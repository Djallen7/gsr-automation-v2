# GSR Automation v2 — Claude Code Rules

These rules are mandatory in every session. They exist because this system touches production hardware used by a ministry team.

**Read first:** `docs/_handoff/HANDOFF.md`, then `docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md` (the full live-verified system reference), `docs/_handoff/VERIFIED-FACTS.md`, and `docs/_handoff/GSR-WORKFLOW-CANON.md` (how Daniel actually runs the show). That folder is the single source of truth. The `gsr-architect` subagent (`.claude/agents/gsr-architect.md`) boots already knowing the system — invoke it for GSR work.

## Authority (settle every question and conflict by this)

**Daniel Allen's input is the highest source of truth.** When anything Daniel says conflicts with a repo doc, code comment, schema, prior note, or your own assumption, **his word wins.** Update the docs and code to match him; never correct Daniel with a stale doc or re-ask something he has already answered. Capture everything he states durably in `docs/_handoff/GSR-WORKFLOW-CANON.md` (append, with the date) so it is never re-asked. The only thing this does not waive is the confirm-before-touching discipline for irreversible live/production actions (the security and David rules below), which protect David on air and exist at Daniel's own direction.

**Established-facts rule (read before answering anything about platforms, vendors, people, schedule, or workflow):** GSR's established stack lives in this repo, not your memory. Before answering or researching any question about distribution targets, delivery mechanisms, vendors, crew, or show facts, reconcile against, in priority order: (1) `docs/_handoff/GSR-WORKFLOW-CANON.md` section 11 (the Established Distribution Stack & Vendor Registry); (2) the live `distributions.platform` enum (latest migration that alters `distributions_platform_check`); (3) `config/production.json`. Web research and your own assumptions only SUPPLEMENT these; they never replace them. If your answer would omit something these sources contain (e.g. StreamHoster, Signiant/RLN, Dropbox-as-distribution, the deferred GodTube/OTA/TBN/CTN targets), the answer is wrong, fix it before sending.

## Security Rules

**Credentials**
- Never paste or expose credentials in chat.
- Always retrieve via 1Password CLI: `op item get "[item name]" --fields password --reveal`.
- Reference credentials by their 1Password item name only.

**SSH & Remote Access**
- Never SSH into any production machine without the user explicitly saying "yes, SSH into [machine name]".

**Before any command touching a network resource, server, or shared drive**
- State exactly what it does and what else it could affect. Wait for confirmation.

## Anti-Churn Rule

Before designing or building any automation: **name the deliverable and the ship date out loud first.** If you can't answer both, it is planning, not building — add a named task to `docs/AUTOMATION_ROADMAP.md` rather than scaffolding half a feature. (This rule exists because archaeology of 879 prior conversations showed repeated design cycles that never shipped.)

## Operational Rules

- **Scope:** only touch what the session is about. If scope is unclear, ask.
- **Blast radius:** before any command, ask whether it could affect anything beyond the task. If yes or uncertain, stop and ask.
- **Lower-thirds import confirmation (mandatory):** before importing lower thirds, run a dry-run, show Daniel the episode/graphic/rejected counts, and require an explicit "Type YES" before any live `/api/import`. The auto-extraction path is gated the same way: `app_config.auto_extract_apply` defaults to `false`, so a saved script holds its extraction for human confirmation via `/api/scripts/confirm-extraction`.
- **ProPresenter:** all ProPresenter work is test-machine only; never command the production machine via automation until David explicitly approves.
- **The David Rule:** before any action, ask "if this goes wrong, does it land on David to fix?" If yes, redesign until the answer is no.

## Off-limits to automation (non-negotiable)

- **ProPresenter production machine** (GSN-PropRes, Tailscale 100.98.215.7).
- **ATEM, Bitfocus Companion** — production hardware.
- **QNAP** — read-only SMB only; no admin, no writes, no file-watchers.
- **No Tailscale or direct server tools** — permanently off-limits after the 2026-05-20 security incident. All automation goes through cloud APIs or read-only SMB.
- **Notion** — wiki-only after ADR-0012.

---

## Project State (current)

**Active app:** `apps/dashboard` — Next.js 16.2, React, shadcn/ui, Tailwind v4, Supabase SSR, deployed on Vercel.
**Supabase project:** `lafkbxypmciopebentxp` — 20 tables, 46 migrations, 2 enums, 2 views, 3 functions, 3 triggers, 1 storage bucket (`lower-thirds`). Rows: episodes 48, guests 175, **graphics 0** (no live import yet — the real Stage 7 milestone, an operational step not a code defect).
**Architecture of record:** ADR-0012 (Supabase + Next.js, accepted 2026-05-23). Eras 1 (self-hosted n8n/SQLite) and 2 (Notion) are superseded; their docs were pruned (recoverable in git history). See `docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md`.
**Model:** Claude via `@anthropic-ai/sdk`, `ANTHROPIC_REGENERATE_MODEL` (default `claude-opus-4-7`), server-side only.

**Live routes:** pages `/import`, `/lower-thirds`, `/lower-thirds/ready`, `/approved`, `/upload`, `/extract`, `/episodes`, `/guests`, `/workflow`, `/toolkit`, `/login`, `/update-password`; API `/api/import`, `/api/extract-lower-thirds`, `/api/regenerate`, `/api/scripts`, `/api/scripts/confirm-extraction`, `/api/rc-explore`, `/api/rc-import`, `/auth/callback`.

**The lower-thirds table is `graphics`.** There is no `lower_thirds` table (the first migration's filename misleads; every query uses `graphics`). The storage bucket is the only thing named `lower-thirds`.

**Active external tools:** Rundown Creator (in-app via `/api/rc-*`; returns errors as HTTP 200 with a JSON body, so always read the body), QNAP SMB (read-only).

---

## Next.js 16 caveat

This is **not** the Next.js your training data knows. Read `apps/dashboard/AGENTS.md` and `apps/dashboard/node_modules/next/dist/docs/` before writing route handlers, server actions, or App Router code. App Router only; `@supabase/ssr` (not the deprecated `@supabase/auth-helpers-nextjs`).

---

## Development Conventions

**Branching:** all feature work on a new branch off `main` (`feat/`, `chore/`, `fix/`); never push directly to `main`; open a draft PR after the first push.
**Merging:** squash merge; the PR title becomes the commit message.
**Migrations:** one concern per file; `YYYYMMDDHHMMSS_snake_case.sql`; idempotent DDL (`IF NOT EXISTS`, `OR REPLACE`); after applying remotely, verify with `list_migrations`.
**Database:** snake_case; RLS enabled on every table before any policy; service role only server-side; atomic mutations via SQL RPC; after a schema change, regenerate TS types and run advisors, committed together. GSR tables use `uuid` PKs.
**Claude API:** server actions or API routes only; the key never reaches the browser.
**TypeScript:** run `cd apps/dashboard && npx tsc --noEmit` and `npx eslint src/` before committing dashboard changes; both must be clean.

---

## Session Orientation

1. `git status` and `git log --oneline -5`.
2. `git fetch origin main && git log --oneline origin/main -3` to see if main moved.
3. Read `docs/_handoff/HANDOFF.md` (and the SYSTEM-EVOLUTION reference for depth).
4. Check open PRs if continuing existing work.

---

## Context

- Daniel Allen is the project owner and a non-developer; he builds everything through Claude Code. Plain English, no jargon, no em-dashes, recommend don't poll, never make him re-enter data that exists somewhere.
- Show: Genesis Science Report (GSR), Christian creation-science TV, ~58 min, weekly, Season 3, for David Rives Ministries.
- David Rives is the on-screen talent and ministry director — protect anything that affects him on air.
- Subagents: `gsr-architect` (`.claude/agents/`, the system-aware planner), `gsr-editorial` (`agents/gsr-editorial.md`, copy/voice review), and `gsr-health` (`.claude/agents/`, repo-health auditor).
