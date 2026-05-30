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

## Anti-Churn Rule

Before designing, scoping, or building any automation in a session:

**Name the deliverable and the ship date out loud first.**

- What file, feature, or working output will exist when this session ends?
- What is the target date for it to be in use?

If you can't answer both, the session is planning — not building. Planning sessions end with a named task added to the queue, not code in the repo. Do not let a planning conversation drift into half-built scaffolding.

If Daniel starts describing an automation idea without a named deliverable, prompt him: *"What ships at the end of this, and when does it need to be working?"* Then build toward that answer, or close the loop as a documented future task in `docs/AUTOMATION_ROADMAP.md`.

This rule exists because archaeology of 879 conversations showed repeated cycles of automation design that never shipped. The fix is naming the thing before building it.

## Operational Rules

**Scope**
- Only touch the one folder explicitly designated for the current session
- Never access parent directories, adjacent shares, or broader network paths
- If scope is unclear, ask before doing anything

**Blast radius check**
- Before running any command: could this affect anything other than what we're working on?
- If yes, or if uncertain — stop and ask first

**Lower-thirds import confirmation (mandatory)**
- Before importing any lower thirds to the dashboard, always run a dry-run first
- Show Daniel a summary: episode count, graphic count, any rejected items
- Ask for explicit confirmation ("Type YES to import") before executing the live import
- Never call `/api/import` in live mode without that confirmation in the same session

**ProPresenter**
- All ProPresenter automation work happens on a test machine only
- Never connect to or send commands to the production ProPresenter machine via any automated process until explicitly approved by David

**The David rule**
- Before any action, ask: if this goes wrong, does it fall on David to fix it?
- If yes — redesign the approach until the answer is no

## Off-limits to automation (non-negotiable)

- **ProPresenter production machine** (GSN-PropRes, Tailscale 100.98.215.7) — covered by "The David rule" above.
- **ATEM, Bitfocus Companion** — production hardware.
- **QNAP write access** — read-only SMB only; admin doesn't exist.
- **Notion workspace** — wiki-only after ADR-0012 (Supabase pivot, 2026-05-23); do not extend the pre-pivot `scripts/notion_*.py` code.

---

## Project State (updated 2026-05-30)

**Active app:** `apps/dashboard` — Next.js 16, shadcn/ui, Supabase SSR, deployed on Vercel
**Supabase project:** `lafkbxypmciopebentxp`
**Active feature:** Feature 1 — Episode Graphics & Asset Tracker
**Current stage:** Stage 7 (real episode test) — S03 Ep021-025 filmed May 28-29; lower thirds import blocked by JSON schema mismatch vs actual `lower_thirds` table columns
**Architecture decision of record:** ADR-0012 (Supabase pivot, accepted 2026-05-23). ADRs 0001 and 0011 are sunk-cost / historical.

**Episodes in DB:** All 48 Season 3 episodes upserted. Ep1-15 have real air dates + YouTube URLs; Ep16-48 have extrapolated Tuesday air dates through 2027-01-05. YouTube channel: `UCNZS3IEQaAfwofwltbEBwuw` (David Rives Ministries).

**Active external tools:**
- **Rundown Creator MCP** — in daily use; frequent timeouts, requires periodic restart
- **Google Sheets (Composio)** — unreliable as of May 28 (went down mid-session); prefer native Google Sheets MCP when available
- **QNAP SMB** — read-only mirror only; no write access, no chokidar watchers

**Hard constraints added May 2026:**
- **No Tailscale or direct server tools** — server incident May 20 put this permanently off-limits. All automation must go through cloud APIs or read-only SMB.
- **ProPresenter still blocked** — "The David Rule" applies. No live connection to GSN-PropRes until David Rives explicitly approves a test machine pathway.

**What is built (main branch):**
- `/login` — magic link auth
- `/upload` — PNG upload (legacy, being phased out after 2 text-only episodes)
- `/import` — text-only bulk ingest via JSON paste
- `/lower-thirds` — review grid (approve / reject / regenerate)
- `/approved` — approved queue with ProPresenter copy button and toggle
- `/api/regenerate` — Claude API route (`claude-opus-4-7`), rate-limited, deduped
- `/api/import` — bulk ingest route, dry-run + live modes, Zod-validated

**43 migrations applied** to Supabase. Always run `list_migrations` before writing new SQL to check current state.

**BUILD_STATUS.html** at repo root — open in browser for visual build overview.

---

## Next.js 16 caveat (read this before writing route handlers, server actions, or App Router code)

This is **not** the Next.js your training data knows. See `apps/dashboard/AGENTS.md`. Read `apps/dashboard/node_modules/next/dist/docs/` for the relevant guide before writing code. Heed deprecation notices in the build output.

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

**Database conventions**
- `snake_case` for tables and columns; PKs are `bigint generated always as identity` unless documented otherwise.
- **RLS enabled on every table** before any policy is written. Service role used only in Edge Functions or server actions, never in client code.
- Atomic state mutations (graphics approval, etc.) go through SQL RPC, not read-modify-write from a route handler.
- After every schema change: regenerate TS types, run advisors, commit together.

**Claude API**
- Called only from server actions or API routes, never from the client. The Anthropic key must never reach the browser.

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
- Custom Claude Code subagents (`gsr-editorial`, `gsr-pipeline`, `gsr-supabase`) live in `~/.claude/agents/` — invoke via the Agent tool for GSR-specific copy review, pipeline domain questions, or Supabase schema work.

<!-- headroom:learn:start -->
## Headroom Learned Patterns
*Auto-generated by `headroom learn` on 2026-05-26 — do not edit manually*

### Skills Installation
*~3,000 tokens/session saved*
- The `npx skills add <pkg>` command requires `skills@latest` (not bare `skills`) — use `npx -y skills@latest add <pkg>` from a directory that is NOT a Node project, or pass `--global`.
- Running `npx skills` from this repo root fails with ENOENT (no package.json). Either `cd ~` first or use `--global` flag.

<!-- headroom:learn:end -->
