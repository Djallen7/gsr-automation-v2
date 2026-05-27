# GSR Automation — Claude Code Rules

These rules are mandatory in every session. They exist because this system touches production hardware used by a ministry team.

## Security Rules

**Credentials**
- Never paste or expose credentials in chat
- Always retrieve via 1Password CLI: `op item get "[item name]" --fields password --reveal`
- Reference credentials by their 1Password item name only — never ask the user to paste a password

**SSH & Remote Access**
- Never SSH into any production machine without the user explicitly saying "yes, SSH into [machine name]"
- Never attempt login to any server, NAS, or network device without that exact confirmation

**Before any command touching a network resource, server, or shared drive**
- State exactly what the command will do
- State what else is connected to or could be affected by it
- Wait for confirmation before running

## Operational Rules

**Scope**
- Only touch the one folder explicitly designated for the current session
- Never access parent directories, adjacent shares, or broader network paths
- If scope is unclear, ask before doing anything

**Blast radius check**
- Before running any command: could this affect anything other than what we're working on?
- If yes, or if uncertain — stop and ask first

**ProPresenter**
- All ProPresenter automation work happens on a test machine only
- Never connect to or send commands to the production ProPresenter machine via any automated process until explicitly approved by David

**The David rule**
- Before any action, ask: if this goes wrong, does it fall on David to fix it?
- If yes — redesign the approach until the answer is no

---

## Project State (updated 2026-05-27)

**Active app:** `apps/dashboard` — Next.js 16, shadcn/ui, Supabase SSR, deployed on Vercel
**Supabase project:** `lafkbxypmciopebentxp`
**Active feature:** Feature 1 — Episode Graphics & Asset Tracker
**Current stage:** Stage 7 (real episode test) — all code complete, awaiting first real episode run

**What is built (main branch):**
- `/login` — magic link auth
- `/upload` — PNG upload (legacy, being phased out after 2 text-only episodes)
- `/import` — text-only bulk ingest via JSON paste
- `/lower-thirds` — review grid (approve / reject / regenerate)
- `/approved` — approved queue with ProPresenter copy button and toggle
- `/api/regenerate` — Claude API route (`claude-opus-4-7`), rate-limited, deduped
- `/api/import` — bulk ingest route, dry-run + live modes, Zod-validated

**13 migrations applied** to Supabase. Always run `list_migrations` before writing new SQL to check current state.

**BUILD_STATUS.html** at repo root — open in browser for visual build overview.

---

## Development Conventions

**Branching**
- All feature work on a new branch off `main`
- Branch names: `feat/short-description`, `chore/short-description`, `fix/short-description`
- Never push directly to `main`
- Always create a draft PR immediately after first push

**Merging**
- Use squash merge to keep main history clean
- PR title becomes the commit message — make it descriptive

**Migrations**
- One concern per migration file
- Filename format: `YYYYMMDDHHMMSS_snake_case_description.sql`
- All DDL statements must be idempotent (`IF NOT EXISTS`, `OR REPLACE`, etc.)
- After applying a migration remotely, verify with `list_migrations`

**TypeScript**
- Run `cd apps/dashboard && npx tsc --noEmit` before committing any dashboard changes
- Run `npx eslint src/` to check for lint errors
- Both must be clean before a PR is opened

**When you add a new page or API route**
- Add it to the Routes section of `BUILD_STATUS.html`
- Update `LAST_UPDATED` in `BUILD_STATUS.html`

**When you complete a stage or planned item**
- Update the status badge in `BUILD_STATUS.html`
- Update `LAST_UPDATED`

**When you apply a migration**
- Add it to the Migrations section of `BUILD_STATUS.html`

---

## Session Orientation

At the start of any session:
1. Run `git status` and `git log --oneline -5` to see current state
2. Run `git fetch origin main && git log --oneline origin/main -3` to check if main has moved
3. Check for open PRs if continuing existing work
4. Read `BUILD_STATUS.html` for a visual overview of what's built

Read `docs/SESSION_HANDOFF.md` for historical context if needed (note: may be outdated — BUILD_STATUS.html is more current).

---

## Context

- Daniel Allen is the project owner and a non-developer. He uses Claude Code for all building.
- Show: Genesis Science Report (GSR), Christian creation-science TV, ~58 min, weekly, Season 3
- Team: Daniel + Miryam (core producers), ~7-8 crew on shoot days
- David Rives is the on-screen talent and ministry director — don't break anything that affects him
