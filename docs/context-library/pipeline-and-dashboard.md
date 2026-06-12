# Pipeline & dashboard

**Load when:** the production pipeline stages, Supabase schema, the dashboard app, the graphics page UI/UX, ADR-0012, RDC↔dashboard.
**Authoritative sources:** `docs/_handoff/GSR-WORKFLOW-CANON.md`, `docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md`, `decisions/` ADRs, `apps/dashboard`.

## Entries
### 2026-06-11 — Genesis Console is the dashboard's visual source of truth  [status: active]
Decision: the dashboard's realized visual design is "The Genesis Console" — staged at `docs/design/genesis-console/` (complete self-contained HTML mock + `DESIGN-BRIEF.md` + `colors_and_type.css` tokens + a React `ui_kits/console/` kit). Reconstructed from an exported Claude.ai design-system session (2026-05-31→06-02). Aesthetic: "cosmic liquid glass" — near-black #06070B, pure-CSS nebula/starfield, cool-only palette (ice-blue #5BD0FF, teal #36D6C3, gold hairline #C9A84C), liquid-glass panels w/ pointer-tracked specular, Saira Condensed/IBM Plex Mono/Saira, one hero countdown, progressive disclosure, bullet graphs, opacity-as-pipeline-stage. Daniel's rule: NO purple/magenta/pink/pastel.
Status: the source session was cut off by a usage limit; the unfinished asks are **split into multiple pages** + **add tweakable controls** — fold these into the real build. The real dashboard (`apps/dashboard`, Next.js + live Supabase) should adopt this language over real data; the `ui_kits/console` JSX is the head start. This is the concrete target for the Fable prompt's "turn the review HTML into a real dashboard route" step.
Source: Daniel-supplied export (2026-06-11)

### 2026-06-11 — Graphics review artifact → dashboard UI/UX  [status: active]
Decision: the graphics review HTML should become the real dashboard graphics page (interactive: master view, click-to-show, script highlights tied to graphics). To let Daniel see the interactive version reliably, deploy it as a dashboard route (Vercel preview URL) rather than mailing a JS file — that doubles as the integration path. Static HTML is the offline fallback (mobile file viewers don't run JS).
Source: Daniel (2026-06-11)

### standing — Architecture of record: ADR-0012 (Supabase + Next.js)  [status: active]
Decision: Supabase is the source of truth; Next.js 16 dashboard on Vercel. RDC and the Google Sheet trackers are upstream/external surfaces the system READS, not the datastore. The dashboard graphics page (Stage-7) is NOT built yet — that's the missing piece that would make "push graphics" a real gated action.
Source: ADR-0012 / canon

### standing — Confirm gate on tracker/RDC writes  [status: active]
Decision: never push to the live tracker or RDC unattended; dry-run + Type-YES. With current tools I CANNOT edit the existing Google Sheet (no cell-write); RDC write-back has no supported path. Pre-staged paste-ready Pass-1 payloads instead (see `docs/2026-06-09-june-pass1-prestaged-push.md`).
Source: Daniel (2026-06-09)
