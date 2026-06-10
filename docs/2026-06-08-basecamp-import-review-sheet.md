# Basecamp Import Review Sheet (2026-06-08)

**For Daniel to review.** Mark each row **Keep** or **Drop**. For the two flagged
rows, tell me read-only or two-way. I will lock the final list into the design
docs once you decide.

**The rule (Daniel, 2026-06-08):**
- Everything we import **syncs** (stays current from Basecamp).
- **Two-way editing** (the dashboard writes back to Basecamp) is ONLY for items
  meant to be checked off / marked complete: post-production episode status,
  to-dos, and checklist items. Everything else is read-only.

---

## Import list (RESOLVED, Daniel 2026-06-08)

| # | Element | What it is | From (Basecamp) | Edit mode | Status |
|---|---|---|---|---|---|
| 1 | Episode post-production status | The card's stage on the GSR pipeline (Recorded -> In Progress -> Editing -> Rendering -> Done) | 02_ Production -> "Genesis Science Report" | **Two-way** (advance the stage) | Keep |
| 2 | WWN production status | Stage tracking for the WWN show | 02_ Production -> "WWN" | -- | **DEFERRED to future phases** |
| 3 | To-dos (per person, own only) | Each member sees only their own tasks. Synced for **Daniel, Isaac, Myriam** (interns: none for now) | 02_ Production + 01_DRM Staff -> To-dos | **Two-way** (check off) | Keep |
| 4 | Card checklist steps | The sub-steps inside a GSR card | GSR cards | **Two-way** (check off) | Keep |
| 5 | Card details | Title, assignee, due date, notes on a card | GSR cards | Read-only | Keep |
| 6 | Scripts + graphics instructions | David's monologue Scripture + his graphics notes | 02_ Production -> Docs & Files | Read-only *(open: two-way?)* | Keep |
| 7 | Calendar, **`PROD \|` events only** | Shoot + air dates tagged `PROD \|` | 01_DRM Staff -> Schedule | Read-only | Keep |

**Isaac's GSR editing page:** Isaac gets a dedicated GSR editing page built to
mirror his Basecamp "Genesis Science Report" card board as closely as possible
(same columns, same card feel), so it adds no learning curve. Card moves advance
post-production status two-way.

---

## Excluded / deferred

| Element | Reason |
|---|---|
| All WWN elements | Deferred to future phases |
| Message boards | Not needed |
| Chats / Campfire | Not needed |
| Generic "Card Table" (02_ Production) | Redundant with the GSR board |
| Calendar events without `PROD \|` | Out of scope |
| Aquarium project | Not the show |
| Prayer Request - Donors and Staff | Donor/ministry, not production |

---

## Remaining open question
- Row 6 (scripts + graphics instructions): read-only (current default) or two-way?
  Everything else is decided.

Final design + per-role inventory now lives in
`docs/2026-06-08-basecamp-dashboard-integration.md`.
