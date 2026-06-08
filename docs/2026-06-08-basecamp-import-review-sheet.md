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

## Proposed to import

| # | Element | What it is | From (Basecamp) | Edit mode | Recommend |
|---|---|---|---|---|---|
| 1 | Episode post-production status | The card's stage on the GSR pipeline (Recorded -> In Progress -> Editing -> Rendering -> Done) | 02_ Production -> "Genesis Science Report" | **Two-way** (advance the stage) | Keep |
| 2 | WWN production status | Same stage tracking for the WWN show | 02_ Production -> "WWN" | **Two-way** | Keep |
| 3 | To-dos | Production + staff task lists, checked off when done | 02_ Production + 01_DRM Staff -> To-dos | **Two-way** (check off) | Keep |
| 4 | Card checklist steps | The sub-steps inside a pipeline card | GSR / WWN cards | **Two-way** (check off) | Keep |
| 5 | Card details | Title, assignee, due date, notes on a card | GSR / WWN cards | Read-only | Keep |
| 6 | Scripts + graphics instructions | David's monologue Scripture + his graphics notes | 02_ Production -> Docs & Files | Read-only *(flag)* | Keep |
| 7 | Calendar | Shoot dates + air dates | 01_DRM Staff -> Schedule | Read-only *(flag)* | Keep |

**(flag)** You earlier asked for two-way editing on scripts and the calendar.
Under the new rule (two-way = check-off items only) these come in as read-only.
Tell me if you want them two-way instead.

---

## Proposed to exclude (opt any back in)

| Element | Why excluded |
|---|---|
| Message boards | You said not needed |
| Chats / Campfire | You said not needed |
| Generic "Card Table" (02_ Production) | Redundant with the GSR + WWN boards |
| Aquarium project | Not the show |
| Prayer Request - Donors and Staff | Donor/ministry, not production |

---

## Your call
1. Cross out any row in the import table you want to **Drop**.
2. For rows 6 and 7, write **read-only** or **two-way**.
3. Tick any excluded element you actually want imported.

Then I will update the integration design doc, the canon, and the roadmap to match.
