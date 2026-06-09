# Build Spec: Isaac's GSR Editing Board + Per-Role "My Tasks" (2026-06-08)

**Status:** build spec, not yet built. These are the two NEW surfaces named in
`docs/2026-06-08-basecamp-dashboard-integration.md` Section 7. Everything else in
that integration plan attaches to existing pages; these two need building. Grounded
in the canon (`docs/_handoff/GSR-WORKFLOW-CANON.md` section 12) and the
integration doc. Sequenced behind the roadmap preconditions (system designed,
tested on mock episodes, real system imported).

**Anti-churn:** deliverable = these two pages wired to Basecamp via two-way sync;
ship target = after the per-role auth + Basecamp write layer exist (see
dependencies in section 0 and 3). Until then this is the spec, not a build.

---

## 0. Shared foundations (both features depend on these)

### 0.1 Stack and conventions
- Next.js 16 App Router (read `apps/dashboard/AGENTS.md` first), Supabase SSR
  (`@supabase/ssr`), shadcn/ui, Tailwind v4, deployed on Vercel.
- All Basecamp calls are server-side only (API route or server action); the token
  never reaches the browser. Run `npx tsc --noEmit` and `npx eslint src/` clean
  before committing.

### 0.2 Basecamp server client (new: `src/lib/basecamp/`)
- Account `5805529`, project "02_ Production" bucket `37738136`, User-Agent header
  required, OAuth refresh-token flow (POST to launchpad token endpoint).
- **Defensive trim:** strip whitespace from all Basecamp + RDC creds at call time
  (a leading space has bitten both before; see env-diagnosis doc).
- Reads are verified working. **Writes are NOT yet built or tested** — build and
  test the write path against a non-production target first (David rule).
- Operations needed (verify exact bc4 API endpoints/payloads during build):
  - read card table lists + cards (GET card_tables/lists/{id}/cards.json)
  - move a card between columns (card-table card move endpoint)
  - read + toggle a card's checklist/steps completion
  - read to-dos in a todoset + toggle a to-do's completion

### 0.3 Data model / linking (one owner per fact)
- Add `episodes.basecamp_card_id` (text/bigint) via a migration
  (`YYYYMMDDHHMMSS_add_basecamp_card_id.sql`, idempotent, keep RLS). This is the
  only link the dashboard stores; it does NOT keep a competing production-status
  column.
- **Basecamp card = system of record for production stage + tasks.** Supabase owns
  dashboard-only data (lower thirds, metadata, distribution).
- A stage-vocabulary mapping (small constant or table) translates the GSR columns
  `Triage/Not now/Recorded/In Progress/Editing/Rendering/Done` to the dashboard's
  episode status, so each side reads the other correctly.
- **OPEN DECISION (Daniel):** whether Basecamp or the dashboard owns production
  stage. Recommend Basecamp. The spec assumes Basecamp; flip the mapping direction
  if Daniel chooses the dashboard.

### 0.4 User -> Basecamp person mapping (dependency)
- "Per-role, each sees only their own" requires mapping the logged-in dashboard
  user to a Basecamp person id (the assignee). This ties to the DEFERRED per-role
  login work. Interim: a small config/table mapping dashboard user -> Basecamp
  person id for Daniel, Isaac, Myriam.

### 0.5 Sync model
- Read from Basecamp on page load, cache server-side with a visible "last synced"
  timestamp + a manual Refresh. Do not poll aggressively (API rate limits).
- Writes are optimistic with a visible "synced to Basecamp" state and an Undo.

### 0.6 Write safety (David rule interpretation — needs Daniel's nod)
- Card moves and to-do check-offs are **reversible, low-stakes** writes (move the
  card back, re-open the to-do). Proposal: optimistic update + Undo + a clear
  "synced" indicator, NOT a blocking "Type YES" gate. The Type-YES gate stays
  reserved for irreversible bulk writes like `/api/import`.
- **FLAG:** confirm this interpretation with Daniel before building the write path,
  since it touches a tool the whole team uses live.

---

## 1. Isaac's GSR editing board (new page)

**Route:** new page in Isaac's view (e.g. `/board`). Also visible to Daniel
(sees everything). Not for Myriam or interns as a board.

**Layout (fixed by Daniel):** a Kanban that mirrors the Basecamp "Genesis Science
Report" card table closely: same columns in the same order
(`Triage -> Not now -> Recorded -> In Progress -> Editing -> Rendering -> Done`)
and the same card feel. Close mirror rendered API-native; not pixel-identical.

**Card contents:** title, assignee, due date, checklist steps, details/notes.

**Interactions:**
- Drag a card to another column -> two-way move (writes the new column to Basecamp).
- Check/uncheck a checklist step -> two-way completion toggle.
- Card details + assignee + due are read-only (display only).

**Data source:** Basecamp card table `8045898587`, its lists `8045898589` (Triage),
`8045898593` (Not now), `8803574354` (Recorded), `8045898598` (In Progress),
`8045903905` (Editing), `8045905130` (Rendering), `8045898599` (Done).

**Scope:** Isaac acts primarily on Recorded -> Rendering, but the full board is
shown for familiarity. Excludes uploads, metadata, distribution.

**Acceptance (EARS):**
- WHEN Isaac opens the board, the system SHALL display the GSR cards grouped into
  the seven Basecamp columns in Basecamp order, with a last-synced timestamp.
- WHEN Isaac drags a card to a new column, the system SHALL write the move to
  Basecamp and reflect it optimistically, with an Undo and a synced indicator.
- IF a Basecamp write fails, the system SHALL revert the card to its prior column
  and surface the error (Basecamp returns errors as HTTP 200 with a body — read
  the body).
- WHEN Isaac toggles a checklist step, the system SHALL write the completion state
  to Basecamp and reflect it optimistically.

---

## 2. Per-role "My Tasks" view (new surface)

**Route:** new page (e.g. `/tasks`) or a panel on each role's landing. For Daniel,
Isaac, Myriam only. Interns: not rendered (no Basecamp to-dos for them now).

**Contents:** the to-dos assigned to the logged-in person, each person seeing only
their own. Per to-do: title, due date, source project + list, completion state.

**Data source:** To-dos in "02_ Production" (todoset `7454771948`) and "01_DRM
Staff" todoset, filtered to the user's Basecamp person id (section 0.4).

**Interactions:**
- Check off a to-do -> two-way completion write to Basecamp.
- Un-check -> reopen the to-do in Basecamp.
- Title/due/assignee are read-only.

**Acceptance (EARS):**
- WHEN Daniel, Isaac, or Myriam opens My Tasks, the system SHALL list only the
  to-dos assigned to that person, across the in-scope todosets, with due dates.
- WHEN the user checks off a to-do, the system SHALL mark it complete in Basecamp
  optimistically, with Undo; IF the write fails it SHALL revert and show the error.
- WHERE the signed-in user is an intern, the system SHALL NOT render My Tasks.

---

## 3. Build order and dependencies

1. **Prereqs:** clean Basecamp + RDC creds; the Basecamp write path built and
   tested against a safe/non-production target first (David rule); per-role auth +
   user->person mapping (section 0.4).
2. Migration: `episodes.basecamp_card_id`.
3. Basecamp server client (reads, then guarded writes).
4. Isaac's board (read-only render first, then enable two-way moves).
5. My Tasks (read-only list first, then enable two-way check-off).
6. Sequenced after the roadmap preconditions (tested on mock episodes, real import).

---

## 4. Open decisions for Daniel
1. Production-stage owner: Basecamp (recommended) or the dashboard.
2. Write-confirmation model: optimistic + Undo (recommended) vs a Type-YES gate.
3. How the dashboard user maps to a Basecamp person (interim config vs wait for
   per-role auth).
