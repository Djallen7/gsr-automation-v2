# ADR-0012: Supabase Backend, Next.js Frontend

**Date:** 2026-05-23
**Status:** Accepted
**Supersedes:** ADR-0011 (Notion as cloud database)

---

## Context

ADR-0011 (2026-05-20) selected Notion as the database for the cloud-first pivot following the 2026-05-19 QNAP security incident. The Notion workspace was set up with 6 databases on 2026-05-21 (`scripts/notion_setup.py`, `notion-import/database_ids.json`).

Subsequent design work (captured in `DECISION_LOG_2026-05-22.md`, source-of-record for this decision) re-evaluated the backend choice against the actual features being built. The first feature — Jakob's lower-thirds approval workflow — requires:

- A real relational schema with foreign keys and constraints
- Realtime updates between Jakob, Daniel, and Miriam
- Authenticated role-based access
- A bespoke approval UI, not a generic database table view

Notion's strengths (team-editable docs, no-code views, wiki) do not map to these requirements. Its limitations as an application backend (no real relations, weak query semantics, rate-limited API, no realtime to non-Notion clients) make it the wrong foundation for the feature surface area now planned.

## Decision

**Backend:** Supabase (Postgres + Realtime + Storage + Auth + Edge Functions). Single integrated platform covers DB, auth, file storage, and serverless functions for the workflow.

**Frontend:** Next.js 15 + shadcn/ui. Server components for data fetching, shadcn for the component library, deployed on Vercel.

**Orchestration:** n8n is deferred. Feature 1 does not need workflow orchestration — direct Supabase Edge Functions and Claude API calls handle automation. Revisit n8n when Feature 3+ requires multi-step orchestration.

**Servers (QNAP3/QNAP5):** Read-only, unchanged from ADR-0011. Working data lives in Supabase. The server remains the archive of finished media.

**Notion:** Demoted from "backend" to "wiki." The Notion workspace stays as team documentation surface only. Database rows currently in Notion are not migrated — they were seed data, not production records.

**First feature scope:** Lower-thirds approval workflow only. Full spec in `FEATURE_1_LOWER_THIRDS.md`. No dashboard shell, no YouTube upload, no other features until this one ships through one real episode cycle.

## Consequences

- Notion setup work from 2026-05-21 (`scripts/notion_setup.py`, the 6 live databases, `notion-import/database_ids.json`) is sunk cost. Script and seed data remain in the repo as historical reference but are no longer the active path.
- Supabase introduces a new recurring cost but eliminates the Notion+n8n.cloud cost stack.
- Next.js + shadcn means actual frontend code, not low-code dashboards. Aligns with Claude Code as the build tool.
- All tool swaps proposed in the prior tooling audit remain deferred. None get swapped as part of foundation work. Revisit when features that use them get built.
- ADR-0011's cloud-first principle survives. The database choice changes; the QNAP-as-archive-only stance, the security framework, and the "no local server" rule all carry forward.

## Open Questions

- Whether Miriam gets her own dashboard role or shares Daniel's during Feature 1 testing
- When to introduce Daniel-2 (correspondent) and other team members to the dashboard
- Final GSR brand assets for the dashboard (waiting on Jakob to deliver lower-third designs, logo, color palette)
- David Rives buy-in on Supabase (Feature 1 doesn't require it; distribution features will)
