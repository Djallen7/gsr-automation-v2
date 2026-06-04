# GSR Automation - System Evolution (how the architecture got here)

*Date: 2026-06-04. Purpose: so a future session understands why the stack is what it is, and does not re-propose something already killed for a good reason.*

## The one-line story

Google Sheets app -> self-hosted n8n + SQLite + Docker on a QNAP NAS -> (a security incident burned that down) -> cloud-first with Notion as the database -> Notion can't be an app backend, so -> **Supabase + Next.js on Vercel**, building one small feature at a time. That last state is where we are (ADR-0012).

## Timeline of pivots

| When | What was tried | Why it died |
|---|---|---|
| 2026-05-05 | Google Apps Script web app + Google Sheets as the database (free, no hosting) | Too limited for a real app; abandoned for a proper stack. |
| 2026-05-15 (ADR-0001, 0009) | Self-hosted **n8n + Next.js + SQLite + Docker on QNAP3**, Tailscale for remote access, open-source parts (Chokidar file-watch, youtubeuploader, better-sqlite3). Deferred the 4 hard upload platforms (ADR-0002). | Superseded after the security incident below. |
| **2026-05-19/20** (ADR-0011) | **Security incident.** QNAP admin credentials were exposed in a Claude session; IT rotated credentials across 40+ devices. A ProPresenter-automation command over Tailscale had also helped shut down production servers. | **Tailscale / SSH / direct-server access and file-watchers permanently barred.** Self-hosted stack abandoned. Pivot to cloud-first; Notion chosen as the database (Airtable was disqualified because it excludes religious nonprofits from nonprofit pricing). |
| 2026-05-21 | Notion workspace actually built (6 databases, `scripts/notion_setup.py`) | Same day, reversed: Notion's MCP only works in Claude.ai chats, not in Projects, so Notion can't serve as the app backend. Adopted a flat two-array JSON ingest shape instead. |
| 2026-05-22/23 (ADR-0012, `DECISION_LOG_2026-05-22.md`) | **Supabase chosen as the single source of truth** ($25 Pro tier); Next.js + shadcn on Vercel; Notion demoted to wiki only (seed data treated as sunk cost, not migrated); n8n deferred until 3+ workflows need orchestration; **first feature = lower-thirds approval only**. | This is the current architecture of record. |
| Late May -> 2026-06-04 | Feature 1 built out well past the original "approval only" scope: episodes/guests/workflow pages, Rundown Creator in-app integration, and an automatic script -> lower-thirds extraction pipeline (DB trigger + `pg_net` + Edge Function). Next.js upgraded 15 -> **16.2.6**. | Current. The handoff docs lagged behind this build; this folder corrects that. |

## ADR ledger

| # | Title | Status | Decision |
|---|---|---|---|
| 0001 | n8n orchestrator + Next.js dashboard + Docker on NAS | Historical (only the Next.js choice survives) | Self-hosted n8n + Next.js + SQLite + Docker on QNAP, Tailscale access. |
| 0002 | Defer Rumble/Fireside/Signiant/StreamHoster automation | Still valid in spirit | Auto-post YouTube + Dropbox first; other platforms manual with copy/mark-done buttons. |
| 0003 | Dashboard is a tracking system that sometimes automates | Foundational, still valid | Manual workflows are first-class; only `uploaded_by` differs. Graceful degradation by design. |
| 0004-0008 | (do not exist) | - | Numbering gap, no files. |
| 0009 | Two-NAS topology, QNAP3 as automation host | Superseded by 0011 | QNAP3 (10.2.2.3) automation host, QNAP5 (10.2.2.5) storage, both on Tailscale. |
| 0010 | File-watcher source-of-truth | Superseded by 0011 (was never resolved) | Mooted by the pivot away from local servers. |
| 0011 | No QNAP admin - cloud-first with Notion DB | Superseded by 0012 | Post-incident: Notion DB, sync-client file detection, n8n.cloud, QNAP read-only. |
| 0012 | **Supabase backend, Next.js frontend** | **Accepted - current ADR of record** | Supabase (Postgres + Realtime + Storage + Auth + Edge Fns) + Next.js/shadcn on Vercel; n8n deferred; Notion demoted to wiki; feature-at-a-time. |

## What survived every pivot (the load-bearing constraints)

These never changed and must not be quietly re-litigated:

- **QNAP is a read-only archive.** No write access, no admin, no watchers.
- **No Tailscale, no SSH, no direct server tools.** Permanent, set by the 2026-05-20 incident. Cloud APIs or read-only SMB only.
- **ProPresenter production machine is off-limits** ("The David Rule"). Test machine only, and only after David Rives explicitly approves a pathway.
- **ATEM / Bitfocus Companion** are production hardware, off-limits.
- **Notion is wiki-only** after ADR-0012. Do not extend the pre-pivot `scripts/notion_*.py`.
- **Lower-thirds import is gated** by a dry-run + explicit "Type YES" in the manual path. (Note: the new automatic Edge-Function path bypasses this; it lands rows as `pending_review` only. See `HANDOFF.md` section 4 - this needs a decision.)
- **Build one small feature at a time.** No big-bang schema, no half-built scaffolding (the Anti-Churn rule). This rule exists because archaeology of 879 prior conversations showed repeated design cycles that never shipped.

## Why this matters for a fresh session

The biggest trap is the **stale docs that describe dead architecture**: `PROJECT_PLAN.md` (n8n/SQLite/Tailscale), `MASTER_CONTEXT.md` (Notion-as-DB), the design bibles (Notion data layer), `CONTEXT_BOOTSTRAP.md` (wrong repo name, "Phase 1"). They were never deleted. If you boot from any of them you will propose something that was already tried and abandoned, often for a security reason that is non-negotiable. Boot from `HANDOFF.md` and `VERIFIED-FACTS.md` instead.
