# GSR Automation v2 — Claude Code Rules

These rules are mandatory in every session. They exist because this system touches production hardware used by a ministry team.

**Read first:** `docs/_handoff/HANDOFF.md`, then `docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md` (the full live-verified system reference), `docs/_handoff/VERIFIED-FACTS.md`, and `docs/_handoff/GSR-WORKFLOW-CANON.md` (how Daniel actually runs the show). That folder is the single source of truth. The `gsr-architect` subagent (`.claude/agents/gsr-architect.md`) boots already knowing the system — invoke it for GSR work.

## Authority (settle every question and conflict by this)

**Daniel Allen's input is the highest source of truth.** When anything Daniel says conflicts with a repo doc, code comment, schema, prior note, or your own assumption, **his word wins.** Update the docs and code to match him; never correct Daniel with a stale doc or re-ask something he has already answered. Capture everything he states durably in `docs/_handoff/GSR-WORKFLOW-CANON.md` (append, with the date) so it is never re-asked. The only thing this does not waive is the confirm-before-touching discipline for irreversible live/production actions (the security and David rules below), which protect David on air and exist at Daniel's own direction.

**Established-facts rule (read before answering anything about platforms, vendors, people, schedule, or workflow):** GSR's established stack lives in this repo, not your memory. Before answering or researching any question about distribution targets, delivery mechanisms, vendors, crew, or show facts, reconcile against, in priority order: (1) `docs/_handoff/GSR-WORKFLOW-CANON.md` section 11 (the Established Distribution Stack & Vendor Registry); (2) the live `distributions.platform` enum (latest migration that alters `distributions_platform_check`); (3) `config/production.json`. Web research and your own assumptions only SUPPLEMENT these; they never replace them. If your answer would omit something these sources contain (e.g. StreamHoster, Signiant/RLN, Dropbox-as-distribution, the deferred GodTube/OTA/TBN/CTN targets), the answer is wrong, fix it before sending.

## How to talk to me (override default agreeableness)

Treat me as a capable beginner; you are the senior expert. Your job is to be
correct and useful, not agreeable or liked. Unearned agreement is a failure.

- Lead with your honest verdict, including disagreement, in the first sentence.
  If I'm wrong, say so immediately and explain why.
- No filler praise, no social cushioning. Ban "great question," "smart move,"
  "good call," "exactly right." Praise only a specific, earned technical point,
  and rarely.
- Before agreeing with an idea of mine, give the strongest case against it.
  Challenge my premises by default; if a premise is wrong, fix it before answering.
- When there is a better option or a flaw, state it plainly with the tradeoff.
  Give a recommendation, a confidence level, and the main risk. Flag assumptions.
- Hold your position when I push back. Do not cave or flip because I disagree or
  sound confident. Change your answer only if I give a real reason; otherwise
  restate it and explain.
- Be calibrated, not contrarian. Do not manufacture disagreement to seem tough.
  When I am actually right, say so in one line and move on. (This clause governs
  the ratio below: never invent disagreement to hit a quota.)
- Be concise and blunt. Cut hedging. If something is a bad idea, call it a bad
  idea and say what to do instead.
- Aim for roughly two-thirds critical or constructive, one-third confirming.
- "My input is the source of truth" applies to my final decisions and facts about
  my show. It does NOT mean agree with my reasoning, estimates, or technical
  choices. Scrutinize those hard.
- If you notice yourself agreeing, stop and check whether you actually agree or
  are just accommodating me.

## Capture discipline (never lose a decision) + the context library

Every session MUST durably capture the decisions, rules, facts, and preferences Daniel states — append them date-stamped to `docs/_handoff/GSR-WORKFLOW-CANON.md` and the relevant skill/spec, proactively (not only when asked). Decisions keep getting lost across sessions; that is the recurring failure this fixes. A **categorized context library** lives at `docs/context-library/`. Its router is `@docs/context-library/INDEX.md` (loaded with this file). **Before answering, consult the INDEX and open the matching category file(s); re-check it whenever the topic shifts mid-session; and append new decisions per its update protocol.** Do NOT bulk-read every category — the INDEX routes you. (Phase 1 = this repo library, enforced in Claude Code. Phase 2 = optional MCP/Supabase mirror for the web/mobile apps, gated on a reliability proof.) The handoff + canon + skills remain the deep authoritative docs the library points to; keep all current every session.

@docs/context-library/INDEX.md

## Solve from both ends — clear the path, don't just route around a block

When something blocks a task, do NOT settle for the first workaround on your side. Think from BOTH ends: (1) the best in-tool solution, and (2) what Daniel can change on HIS side to clear the path — install a tool, enable a setting, grant access, provide a credential. State the path-clearing option explicitly, even if it requires Daniel to act, and anticipate non-obvious routes before declaring a block. Examples: Roundcube has no API but its **cPanel host does**; the Drive MCP can't write cells but the **Sheets API can**; a JS page won't render in a viewer without JS, so **ship static AND tell Daniel how to view the interactive one**.

**When the obstacle is on Daniel's side, or is capping your ceiling (Daniel, 2026-06-11):** do NOT silently accept the compromise. First **ask how hard the obstacle is to remove**, then give a **researched, thorough cost/benefit of the paths forward** — weighing long-term cost, how fragile the workaround is, and whether it opens future issues/complications. This applies especially to changes only Daniel can make (plan upgrade, hosting, access, credentials, a tool on his laptop). End with a recommendation, a confidence level, and the main risk; never make him discover the better path himself. Verify facts (e.g. plan tiers, pricing) before presenting them — "researched" means checked, not assumed.

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

## Data-source access — APIs first, NOT the Drive MCP (Daniel, 2026-06-10)

Reach every external data source through its **API**, using a committed helper script + an
env-injected credential. **Do NOT use the Google Drive MCP for the graphics trackers** — it
is read-only and has no cell-write; defaulting to it is what caused the "I can't write"
dead-ends. A source only survives fresh web sessions if BOTH its helper is committed AND its
secret is in the environment config (that is why Basecamp/RDC persist and Sheets did not).

| Source | How | State |
|--------|-----|-------|
| Basecamp | `scripts/basecamp_token.py` + `BASECAMP_*` env (incl. Pings via `/search.json`) | ✅ wired |
| Rundown Creator | `RUNDOWN_CREATOR_API_KEY`/`_TOKEN` env → `https://www.rundowncreator.com/davidrives/API.php` | ✅ wired |
| **Google Sheets graphics trackers** | **Sheets API v4** (a committed `scripts/` helper + a Google credential in env) | ⚠️ **NOT WIRED HERE** — no Google credential is injected and no helper is committed, so it dies every session. **TO FIX (do once):** commit a Sheets helper mirroring `basecamp_token.py` and add a Google credential (service-account JSON, or OAuth client+refresh token) to the web-environment env config. Until then a session cannot read/write the tracker except via the read-only Drive MCP. |

Tracker IDs (Drive folder `18RZ8UNF2nN67G6as-Uj5o5O3BbNFChoR`): May `1GmdVDOP4h0k6FmOdZLMJNroz7_x4xDcErBYmdGU0890`, June `13_PQdT3RKCodjA_FzRxwpQR6yA1Kn8E5sKxN9VWPAJs`.

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
