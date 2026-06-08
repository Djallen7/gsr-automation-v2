# Basecamp to Dashboard: Data Inventory by Role (2026-06-08)

**Status:** design input, not yet built. Sequenced with the deferred per-role
dashboards (see `docs/AUTOMATION_ROADMAP.md`).

**Daniel's directive (2026-06-08):** keep Basecamp. The team already lives in it,
so it stays a first-class, reliable source. The dashboard integrates the existing
Basecamp system via **two-way sync**, but only the parts you would otherwise have
to open the Basecamp app to edit. Sync should be lean, not a mirror of everything.

**Scope of this doc:** lists only *what* Basecamp information feeds *which* role
dashboard, and which direction it syncs. It deliberately does NOT say where on a
page it appears or how it is displayed.

---

## 1. Basecamp source inventory (account 5805529, David Rives Ministries)

Confirmed by read-only API check, 2026-06-08.

| Project | Tools present | Used by this integration |
|---|---|---|
| **02_ Production** | Message Board, To-dos, Docs & Files, Chat, Card Table, **"Genesis Science Report" card table**, **"WWN" card table** | Yes: the two named card tables, to-dos, scripts in Docs & Files. |
| **01_DRM Staff** | Message Board, To-dos, Docs & Files, Chat, **Schedule**, Card Table | Yes: Schedule + admin to-dos. |
| **Aquarium** | Message Board, To-dos, Docs & Files, Chat, Schedule | No (not the show). |
| **Prayer Request - Donors and Staff** | Chat only | No (donor/ministry). |

The **"Genesis Science Report" card table** is the live episode pipeline. Columns
(2026-06-08): `Triage -> Not now -> Recorded -> In Progress -> Editing ->
Rendering -> Done`. The **"WWN" card table** mirrors it for Wonders Without
Number: `Triage -> Not now -> In Queue -> Currently Editing -> Awaiting Approval
-> Done`.

---

## 2. Data elements to integrate (narrowed, Daniel 2026-06-08)

Only data that would otherwise require leaving the dashboard to edit in Basecamp.

| # | Data element | Source in Basecamp | Sync |
|---|---|---|---|
| D1 | GSR pipeline cards (stage/column, title, assignee, due, checklist) | 02_ Production -> "Genesis Science Report" | two-way |
| D2 | WWN pipeline cards | 02_ Production -> "WWN" | two-way |
| D3 | To-dos you would otherwise edit/check off in Basecamp (task, assignee, due, done) | 02_ Production + 01_DRM Staff -> To-dos | two-way |
| D4 | Scripts + monologue docs (incl. David's graphics instructions) | 02_ Production -> Docs & Files | two-way edit |
| D5 | Calendar / schedule entries (shoot dates, air dates) | 01_DRM Staff -> Schedule | two-way edit |

**Explicitly dropped (Daniel 2026-06-08):** message boards, chats/Campfire, the
generic "Card Table", activity/headline feeds, and any other non-essential
content. Not synced, not shown.

---

## 3. Per-role data inventory

Roles and scope are fixed in `docs/_handoff/GSR-WORKFLOW-CANON.md` section 12.
Principle: one shared pipeline, each role gets only their stretch of it, plus only
the to-dos with their name on them.

### Daniel (owner / producer) - sees everything
- D1 GSR cards, all columns.
- D2 WWN cards, all columns.
- D3 all to-dos, grouped by assignee.
- D4 scripts + monologue docs.
- D5 full calendar (shoot + air).

### Myriam (metadata, thumbnails, uploads, mark-aired)
- D1 GSR cards in **Rendering** and **Done** only (ready for metadata + upload).
- D2 WWN cards in **Awaiting Approval** and **Done**.
- D3 only to-dos assigned to Myriam.
- D5 calendar: publish/air dates.
- Excludes: graphics build, editing internals, earlier pipeline.

### Isaac (graphics + edit lead)
- D1 GSR cards in **Recorded, In Progress, Editing, Rendering**.
- D2 WWN cards in **In Queue, Currently Editing, Awaiting Approval**.
- D3 only to-dos assigned to Isaac.
- D4 scripts + David's graphics-instruction docs (his pre-production input).
- D5 calendar: shoot dates.
- Excludes: uploads, metadata, distribution.

### Interns (graphics + b-roll sourcing; no post-production editing)
- D1 GSR cards in **Recorded** and **In Progress** only. Excludes Editing / Rendering / Done.
- D3 their assigned graphics/b-roll to-dos, plus unassigned graphics/b-roll tasks.
- D4 David's graphics-instruction docs (read, so they know what to build).
- Excludes: editing, rendering, uploads, distribution, calendar, metadata.

---

## 4. Integration approach (recommended)

### A. Embed the data, not Basecamp's pages
Basecamp blocks its own screens from being iframed (frame headers), and a frame
would need a separate Basecamp login, so a true page-embed is not viable. Instead
pull D1-D5 through the Basecamp API and render them with the dashboard's own
components; edits write back through the API. Users never leave the dashboard and
no "go to Basecamp" link is needed on the main flow. Keep a single "Open in
Basecamp" escape hatch only for what the API cannot cover (attachments, comment
threads), kept off the main flow.

### B. One owner per fact (resolves the conflicting-databases risk)
Never keep two editable copies of the same field. Recommended ownership:
- **Basecamp card = system of record for production stage + tasks.** The episode
  row stores the card's id, not a competing status column. (Recommended because
  the team already uses the card table and it holds the history. Open decision: the
  dashboard could own stage instead. Everything else follows from this choice.)
- **Supabase = owner of dashboard-only data:** lower thirds, metadata, distribution.

This makes the sync two-way at the *system* level but single-owner at the *field*
level, so no field is ever written from both sides and the two episode databases
stop competing.

### C. Stage vocabulary mapping
A single mapping table translates the GSR card columns
(`Triage/Not now/Recorded/In Progress/Editing/Rendering/Done`) to the dashboard's
episode status, so a move on either side reads correctly on the other.

**Caveat:** Basecamp docs are rich text; keep two-way script editing to simple
structured text to avoid formatting loss.

---

## 5. Out of scope for the role dashboards

- **Prayer Request - Donors and Staff** (donor/ministry, Chat only).
- **Aquarium** (not the show).
- Message boards, chats/Campfire, generic card table, activity feeds.

Listed so it is explicit these were considered and set aside, not missed.

---

## 6. Write-side guardrail (because sync is two-way)

Two-way means the dashboard can write back into a tool the whole team uses live.
Every dashboard-to-Basecamp write follows confirm-before-write + the David rule
(if a wrong write would land on David or the team to clean up, redesign so it
cannot). Reads carry no such risk.
