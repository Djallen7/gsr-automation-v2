# Basecamp to Dashboard: Data Inventory by Role (2026-06-08)

**Status:** design input, not yet built. Sequenced with the deferred per-role
dashboards (see `docs/AUTOMATION_ROADMAP.md`).

**Daniel's directive (2026-06-08):** keep Basecamp. The team already lives in it,
so it stays a first-class, reliable source. **Every element we import syncs**
(stays current from Basecamp). **Two-way editing** (the dashboard writes back to
Basecamp) is enabled ONLY for items meant to be checked off / marked complete:
post-production episode status, to-dos, and card checklist items. Everything else
is read-only. The specific element list is under review in
`docs/2026-06-08-basecamp-import-review-sheet.md`.

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

## 2. Data elements to integrate (Daniel 2026-06-08)

All imported elements sync. Edit mode follows the rule: two-way only for
check-off / complete items, everything else read-only. Pending Daniel's review
sheet (`docs/2026-06-08-basecamp-import-review-sheet.md`).

| # | Data element | Source in Basecamp | Edit mode |
|---|---|---|---|
| D1 | GSR episode production status (card stage/column) | 02_ Production -> "Genesis Science Report" | two-way (check-off) |
| D2 | To-dos, per person (each member sees only their own). Synced for **Daniel, Isaac, Myriam** | 02_ Production + 01_DRM Staff -> To-dos | two-way (check-off) |
| D3 | Card checklist steps | GSR cards | two-way (check-off) |
| D4 | Card details (title, assignee, due date, notes) | GSR cards | read-only |
| D5 | Scripts + monologue docs (incl. David's graphics instructions) | 02_ Production -> Docs & Files | read-only *(Daniel earlier asked two-way; confirm)* |
| D6 | Calendar events tagged **`PROD \|`** (shoot + air dates) | 01_DRM Staff -> Schedule | read-only |

**Deferred to future phases (Daniel 2026-06-08):** ALL WWN elements (the "WWN"
card table and its status). Not in the current build.

**Explicitly dropped (Daniel 2026-06-08):** message boards, chats/Campfire, the
generic "Card Table", activity/headline feeds, calendar events without the
`PROD |` tag, and any other non-essential content. Not imported.

**Isaac's GSR editing page (Daniel 2026-06-08, layout specified by request):**
Isaac gets a dedicated GSR editing page built as a board that mirrors his
Basecamp "Genesis Science Report" card table as closely as possible: same columns
(`Triage -> Not now -> Recorded -> In Progress -> Editing -> Rendering -> Done`)
and the same card feel, so it is instantly familiar and adds no learning curve.
Moving a card advances the post-production status two-way (writes back to
Basecamp). This is the one place where layout is fixed, at Daniel's direction;
everything else stays open.

---

## 3. Per-role data inventory

Roles and scope are fixed in `docs/_handoff/GSR-WORKFLOW-CANON.md` section 12.
Principle: one shared pipeline, each role gets only their stretch of it, plus only
the to-dos with their name on them.

### Daniel (owner / producer) - sees everything
- GSR production status, all columns.
- Card details + checklist steps.
- His own to-dos.
- Scripts + monologue docs.
- Calendar: all `PROD |` events.

### Myriam (metadata, thumbnails, uploads, mark-aired)
- GSR status in **Rendering** and **Done** only (ready for metadata + upload).
- Her own to-dos.
- Calendar: `PROD |` events (publish/air).
- Excludes: graphics build, editing internals, earlier pipeline.

### Isaac (graphics + edit lead)
- **GSR editing page** that mirrors his Basecamp card board (see above): covers
  **Recorded, In Progress, Editing, Rendering**, two-way status moves.
- Card details + checklist steps for those cards.
- His own to-dos.
- Scripts + David's graphics-instruction docs (his pre-production input).
- Calendar: `PROD |` events (shoot dates).
- Excludes: uploads, metadata, distribution.

### Interns (graphics + b-roll sourcing; no post-production editing)
- GSR status in **Recorded** and **In Progress** only. Excludes Editing / Rendering / Done.
- David's graphics-instruction docs (read, so they know what to build).
- No Basecamp to-dos synced for now (to-do sync is Daniel/Isaac/Myriam only).
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
