# Session Handoff — 2026-05-23

**For the next Claude session, contractor, or future Daniel reading this cold.**
**Project owner:** Daniel Allen (GitHub: Djallen7)
**Active repo:** [github.com/Djallen7/gsr-automation-v2](https://github.com/Djallen7/gsr-automation-v2)

V1 (`gsr-automation` without the v2 suffix) is being archived. Do not use the old name.

---

## Current state

Architecture pivoted again on 2026-05-22/23: **Supabase replaces Notion** as the backend (see ADR-0012, supersedes ADR-0011). The Notion workspace from 2026-05-21 is sunk cost — kept as wiki, not used as DB.

**Stack now:**
- Backend: Supabase (Postgres + Realtime + Storage + Auth + Edge Functions)
- Frontend: Next.js 15 + shadcn/ui
- AI: Claude API
- Servers (QNAP3/QNAP5): read-only archive, unchanged
- n8n: deferred until Feature 3+

**First feature:** Jakob lower-thirds approval workflow. Three weeks of focused work. Nothing else gets built until Feature 1 is in production for one real episode cycle.

The four documents that define current state — `START_HERE.md`, `ROADMAP_VISUAL.md`, `FEATURE_1_LOWER_THIRDS.md`, `DECISION_LOG_2026-05-22.md` — are at the repo root. Read them in that order.

---

## What's been decided (short version)

- **Backend:** Supabase. Not Notion. (ADR-0012)
- **Frontend:** Next.js 15 + shadcn/ui. Not low-code platforms.
- **First feature:** Jakob lower-thirds approval workflow. Not the dashboard shell, not YouTube upload.
- **Servers:** Read-only. Working data in Supabase. Server is the archive.
- **Tool swaps from the audit:** all deferred. None get swapped as part of foundation work.

---

## What hasn't been decided yet

- Whether Miriam gets her own dashboard role or shares Daniel's during Feature 1 testing
- When to introduce Daniel-2 (correspondent) and other team members
- Final GSR brand assets (waiting on Jakob: lower-third designs, logo, color palette)
- David Rives buy-in on Supabase (Feature 1 doesn't require it; distribution features will)

---

## What to build first

Feature 1: lower-thirds approval. Full spec in `FEATURE_1_LOWER_THIRDS.md` at repo root. Stack: Supabase + Next.js + Claude API. Nothing else.

Do NOT add features outside this scope until Feature 1 is in production for one real episode cycle.

---

## How to start a productive session

1. Read this file.
2. Read `docs/CONTEXT_BOOTSTRAP.md` for the project context.
3. Read `FEATURE_1_LOWER_THIRDS.md` if Daniel is asking about the lower-thirds build.
4. Read `docs/decisions/0012-supabase-backend.md` if Daniel is asking why Supabase over Notion.
5. Only read older docs (`MASTER_CONTEXT.md`, the tooling audit, the research charter) when the conversation requires them. They are reference, not roadmap.
6. Anything in older docs that conflicts with the decision log: the decision log wins.

---

## Things to NOT do

- Don't propose new tool swaps unless Daniel explicitly asks. The audit is reference, not a TODO list.
- Don't redesign the data model "to be more complete." Schemas grow as features demand them.
- Don't suggest building the dashboard shell before the first feature exists.
- Don't write Notion-as-backend solutions. That decision is closed (ADR-0012).
- Don't add Notion, ClickUp, Airtable, or similar "one-stop shop" recommendations. Considered and rejected.

---

## Context for any session

- Daniel is a non-developer. He uses Claude Code for actual building. Planning/architecture happens in Claude.ai sessions.
- Daniel works at David Rives Ministries (501(c)(3), Christian creation-science TV). Show: The Genesis Science Report (GSR). Weekly, ~58 min, Season 3.
- Team: Daniel + Miriam as core producers, ~7-8 studio crew on shoot days.
- Production cadence: 10-11 taping cycles/year, 2 shoot days per cycle, 5 episodes per session.
- Working email: `dallen@davidrives.com`. Personal Tailscale account: `danielallen.tn@gmail.com`.

---

## Carryover from 2026-05-21 (Notion track) — for reference, not action

The previous session set up a Notion workspace with 6 databases (Episodes, Guests, Tasks, Assets, ADRs, Drive Files) via `scripts/notion_setup.py`. Per ADR-0012 these are no longer the active path. Decisions still relevant from that work:

- Notion integration token rotation still needed — token was exposed in chat
- The 6 Notion DBs remain in the workspace and can be repurposed as wiki/documentation views or deleted
- Account map (1Password Teams, GitHub, Tailscale tailnet) unchanged
