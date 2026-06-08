# Basecamp to Dashboard: Data Inventory by Role (2026-06-08)

**Status:** design input, not yet built. Sequenced with the deferred per-role
dashboards (see `docs/AUTOMATION_ROADMAP.md`).

**Daniel's directive (2026-06-08):** keep Basecamp. The team already lives in it,
so it stays a first-class, reliable source. The dashboard should integrate as
much of the existing Basecamp system as practical, using **two-way sync** so
Basecamp and the dashboard stay in agreement and anyone can work from either
side. We do not ditch Basecamp.

**Scope of this doc:** this lists only *what* Basecamp information feeds *which*
role dashboard, and which direction it syncs. It deliberately does NOT say where
on a page it appears or how it is displayed. Those are open and decided later.

---

## 1. Basecamp source inventory (account 5805529, David Rives Ministries)

Confirmed by read-only API check, 2026-06-08.

| Project | Tools present | Production relevance |
|---|---|---|
| **02_ Production** | Message Board, To-dos, Docs & Files, Chat, Card Table, **"Genesis Science Report" card table**, **"WWN" card table** | Primary. The live show pipeline. |
| **01_DRM Staff** | Message Board, To-dos, Docs & Files, Chat, **Schedule**, Card Table | Secondary. Staff scheduling + admin tasks. |
| **Aquarium** | Message Board, To-dos, Docs & Files, Chat, Schedule | Out of scope (not the show). |
| **Prayer Request - Donors and Staff** | Chat only | Out of scope (donor/ministry). |

The **"Genesis Science Report" card table** is the real episode pipeline. Its
columns (live as of 2026-06-08): `Triage -> Not now -> Recorded -> In Progress ->
Editing -> Rendering -> Done`. The **"WWN" card table** mirrors it for Wonders
Without Number: `Triage -> Not now -> In Queue -> Currently Editing -> Awaiting
Approval -> Done`. (WWN is a real distribution target per workflow canon
section 11.)

---

## 2. Data elements available to integrate

| # | Data element | Source in Basecamp | Sync direction |
|---|---|---|---|
| D1 | GSR episode pipeline cards (card + its column/stage, title, assignees, due, checklist) | 02_ Production -> "Genesis Science Report" card table | two-way |
| D2 | WWN pipeline cards | 02_ Production -> "WWN" card table | two-way |
| D3 | Generic production cards | 02_ Production -> Card Table | two-way |
| D4 | Production to-dos (task, assignee, due date, done state) | 02_ Production -> To-dos | two-way |
| D5 | Staff/admin to-dos | 01_DRM Staff -> To-dos + Card Table | two-way |
| D6 | Schedule entries (shoot dates, air dates, staff dates) | 01_DRM Staff -> Schedule | two-way (read at minimum) |
| D7 | Monologue Scripture + David's graphics-instruction docs | 02_ Production -> Docs & Files / Message Board | read-only (David owns these) |
| D8 | Message board headlines / announcements | 02_ Production + 01_DRM Staff -> Message Board | read-only (link out) |
| D9 | Activity signals (cards stuck in a column, overdue to-dos, recent changes) | derived from D1-D6 | read-only |

---

## 3. Per-role data inventory

Roles and their scope are fixed in `docs/_handoff/GSR-WORKFLOW-CANON.md`
section 12. The principle: one shared pipeline, each role gets only their stretch
of it plus only the to-dos with their name on them.

### Daniel (owner / producer) - sees everything
- D1 GSR pipeline cards, all columns.
- D2 WWN pipeline cards, all columns.
- D3 generic production cards.
- D4 + D5 all to-dos, grouped by assignee.
- D6 full schedule (shoot, air, staff).
- D7 monologue + graphics-instruction docs.
- D8 message board headlines (all production + staff).
- D9 activity/health signals (stuck cards, overdue to-dos).

### Myriam (metadata, thumbnails, uploads, mark-aired) - successor to Daniel
- D1 GSR cards in **Rendering** and **Done** only (post-edit, ready for metadata + upload).
- D2 WWN cards in **Awaiting Approval** and **Done**.
- D4 + D5 only to-dos assigned to Myriam.
- D6 schedule, publish/air dates only.
- D7 only metadata-relevant docs (titles, descriptions, links).
- Excludes: graphics build, editing internals, anything earlier in the pipeline.

### Isaac (graphics + edit lead) - owns Graphics Tracker, ProPresenter, edit, export
- D1 GSR cards in **Recorded, In Progress, Editing, Rendering** (the build/edit zone).
- D2 WWN cards in **In Queue, Currently Editing, Awaiting Approval**.
- D4 + D5 only to-dos assigned to Isaac, plus graphics/edit card checklists.
- D7 David's monologue Scripture + graphics-instruction docs (his pre-production input).
- Excludes: uploads, metadata, distribution, staff scheduling.

### Interns (graphics + b-roll sourcing; no post-production editing)
- D1 GSR cards in **Recorded** and **In Progress** only (graphics + b-roll stage). Excludes Editing / Rendering / Done.
- D4 their assigned graphics/b-roll to-dos, plus unassigned graphics/b-roll tasks.
- D7 David's graphics-instruction docs (so they know what to build).
- Excludes: editing, rendering, uploads, distribution, staff schedule, metadata.

---

## 4. Out of scope for the role dashboards

- **Prayer Request - Donors and Staff** (Chat only, donor/ministry, not production).
- **Aquarium** (not the show).
- Raw Chat/Campfire streams (ephemeral; link out rather than sync).

These are listed so it is explicit they were considered and set aside, not
missed. They can be linked for Daniel only if he ever wants them.

---

## 5. Write-side guardrail (because sync is two-way)

Two-way means the dashboard can write back into Basecamp, which the whole team
uses live. So every dashboard-to-Basecamp write is a live-team action and follows
the same discipline as other production writes: confirm before writing, and the
David rule (if a wrong write would land on David or the team to clean up,
redesign so it cannot). Reads from Basecamp carry no such risk.
