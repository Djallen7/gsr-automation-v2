# Pipeline & dashboard

**Load when:** the production pipeline stages, Supabase schema, the dashboard app, the graphics page UI/UX, ADR-0012, RDC↔dashboard.
**Authoritative sources:** `docs/_handoff/GSR-WORKFLOW-CANON.md`, `docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md`, `decisions/` ADRs, `apps/dashboard`.

## Entries
### 2026-06-11 — Graphics review artifact → dashboard UI/UX  [status: active]
Decision: the graphics review HTML should become the real dashboard graphics page (interactive: master view, click-to-show, script highlights tied to graphics). To let Daniel see the interactive version reliably, deploy it as a dashboard route (Vercel preview URL) rather than mailing a JS file — that doubles as the integration path. Static HTML is the offline fallback (mobile file viewers don't run JS).
Source: Daniel (2026-06-11)

### standing — Architecture of record: ADR-0012 (Supabase + Next.js)  [status: active]
Decision: Supabase is the source of truth; Next.js 16 dashboard on Vercel. RDC and the Google Sheet trackers are upstream/external surfaces the system READS, not the datastore. The dashboard graphics page (Stage-7) is NOT built yet — that's the missing piece that would make "push graphics" a real gated action.
Source: ADR-0012 / canon

### standing — Confirm gate on tracker/RDC writes  [status: active]
Decision: never push to the live tracker or RDC unattended; dry-run + Type-YES. With current tools I CANNOT edit the existing Google Sheet (no cell-write); RDC write-back has no supported path. Pre-staged paste-ready Pass-1 payloads instead (see `docs/2026-06-09-june-pass1-prestaged-push.md`).
Source: Daniel (2026-06-09)
