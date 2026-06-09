# GSR Dashboard Component Catalog

**Date:** 2026-06-07
Compact, composite, low-text components mapped to the actual GSR pipeline. Each is buildable on shadcn/ui + Tailwind v4. Marked **(have it)** for a primitive already in the repo, or **(adopt)** for a library to add. Visual references live in `gsr-dashboard-mockup.html`.

The criteria every entry meets: compact, elegant, communicates a lot with little text, tailored to a real pipeline need, not a generic widget.

---

## Foundation libraries worth adopting

| Library | What it gives GSR | URL |
|---|---|---|
| **TanStack Table v8** (adopt) | Headless rows/sorting/filtering/column-pinning under shadcn cells. Powers the dense Graphics Tracker. Stays on-brand because it is headless. | https://tanstack.com/table/latest |
| **cmdk** (have it, via shadcn `command`) | The command-palette engine behind Linear/Raycast. Quick-jump to any episode/guest, run actions. | https://ui.shadcn.com/docs/components/radix/command |
| **vaul** (have it, via shadcn `drawer`) | Bottom/side sheets for detail panes and the mobile "More" nav without leaving the page. Supports snap points (peek to full). | https://vaul.emilkowal.ski/ |
| **Motion** (adopt) | Micro-animations, `AnimatePresence` for approve/reject reflow, `AnimateNumber` (2.5kb) for stat tiles and the char meter. | https://motion.dev |
| **dnd-kit** (adopt, optional) | Accessible (keyboard + screen reader) drag, if a board view is ever wanted. | https://dndkit.com |
| **Tremor** (adopt, only if charts are needed) | Copy-paste chart blocks matching shadcn. KPI sparklines. Verify Tailwind v4 rendering after install. | https://www.tremor.so/ |
| **sonner** (have it) | The single toast surface. Success/undo on approve, error on failed save. | already installed |
| **tw-animate-css** (have it) | Entrances/exits/skeletons with Tailwind utility classes. No new dep. | https://github.com/Wombosvideo/tw-animate-css |

---

## Episode pipeline

- **StageRail** *(have it: flex + Tailwind)* — horizontal segmented bar of pipeline stages (Script -> Extract -> Lower-thirds -> Approve -> Upload -> Distribute). Current stage filled gold, done checked green, blocked amber. Communicates "where is this episode" in one glance, no prose. Build: flex row of segments with `after:` connectors; `Tooltip` per segment. Doubles as the constellation motif on the dark theme.
- **EpisodeRowCard** *(have it: `Card`)* — one compact card per episode: title, air date, an inline StageRail, and the single next-action button. Low text, high signal.

## Graphics Tracker (the dense board)

- **MasterShowBar** *(have it: flex + Tailwind)* — per-show horizontal band: one **segmented status bar** (gray/blue/amber/green = Not Started/In Progress/Created/Loaded In), a big "ready/total" fraction, and a per-segment chip row (red at 0-done, amber partial, green complete). Five stacked = the month at a glance.
- **GraphicsGrid** *(adopt: TanStack Table)* — dense table: Segment | Graphic # | Type | Description | Status pill | Assignee avatar | Approve-idea Switch | Notes. Row click opens a `Drawer` detail. Matches Daniel's Google Sheet column-for-column.
- **StatusPill** *(have it: styled `Badge`/button)* — inline, click-to-edit, color-keyed to the status vocabulary. Used identically in table, rail, and board so a color always means the same thing.
- **ApproveToggle** *(have it: needs `switch`)* — optimistic switch with an inline spinner on pending, reverts + toast on error. Until approved, the row is dimmed and status is locked at Not Started (enforces "approve before design").
- **PushGate** *(have it: `Button` + `AlertDialog` + `Input`)* — the ProPresenter Push button: disabled until status is Created and a filename is entered, then lights up as a visually distinct human-only control (hand icon). Click opens a confirm dialog naming file + target playlist + slide. Never auto-fires (David Rule). Reused for any irreversible live action.
- **FilenameField** *(have it: `Input`)* — appears inline when a row is set to Created; Created is not committed until a filename is entered (the linking key that arms PushGate).
- **SourceShortcuts** *(have it: icon links)* — Storyblocks / Dreamstime / Envato icon-links that appear only on B-roll, Picture, and Article rows, inside the Description cell so they cost zero column width.

## Lower-thirds review

- **VariationStack** *(have it: `Card` + radio rows)* — Primary / Var 1 / Var 2 stacked as selectable full-row targets; the chosen one is opaque with the gold accent rail, the others at ~0.62 opacity. Rendered in a tracked ALL-CAPS face so it reads like a chyron. One-tap "cycle" button for phones.
- **CharMeter** *(have it: 2px bar + `AnimateNumber`)* — under each variation, a track that fills toward 65 with a marked good band. Amber under 55, green 55 to 65, red over 65. The over-65 variation gets a red ring, cannot be chosen, and blocks Send. Live recount on edit. Amber means "fine, consider longer," never an error (AI variations skew short).
- **RegenerateButton** *(have it: `Button`)* — calls `/api/regenerate`, returns 3 variations in one call; a dialog shows all three with their meters, pick one, "Use selected." Shows the live rate-limit budget (20/hour) so a regenerate is never wasted.
- **SpotlightScript** *(have it: `ScrollArea` + `ResizablePanelGroup`)* — two-pane read view: script left with the beat's anchor line highlighted (gold band, auto-scrolled), variation deck right. Bidirectional select/scroll. Stacks to a swipeable strip on mobile.

## Distribution

- **DistributionBoard** *(have it: `Card` grid)* — responsive grid of platform cards (YouTube, Rumble, Fireside/Transistor, GSN, Real Life Network, StreamHoster, Dropbox, Social clip). Each card: identity + what it carries, Auto vs Manual badge, status pill, last action, and requirement chips surfaced before action (RLN 1200x1800 + -20 LKFS; YouTube category 28, private until audit; Rumble verify 58-min HD).
- **HandoffChecklist** *(have it: `Drawer` + checkboxes)* — a manual card expands into a guided, ordered checklist with files and deep links pre-staged; "Mark done" only unlocks once every required chip is checked, then timestamps and attributes the person.
- **DistributionMatrix** *(have it: table of status dots)* — cross-episode overview: episodes down rows, platforms across, each cell a status dot. A "Lagging" filter surfaces episodes aired more than N days ago with any platform still pending or failed. Failed cells are the loudest thing on the page.

## Glanceable summary

- **StatTile** *(have it: `Card` + `AnimateNumber`)* — big animated number, one-word label, optional tiny trend caret/sparkline. "Episodes in flight 6," "Awaiting approval 3," "Graphics 0."
- **TileRow** *(have it)* — a single band of 3 to 4 StatTiles as the dashboard header: whole-pipeline health in one strip.

## Global / system

- **QuickJump** *(have it: `command` + `CommandDialog`)* — Cmd-K palette: jump to any episode/guest, run "regenerate lower thirds," "open distribution board." Low-text power navigation.
- **DetailDrawer** *(have it: vaul `Drawer`)* — any row's full detail without navigating away.
- **ConfirmYesDialog** *(have it: `AlertDialog` + `Input`)* — the reusable "type YES" gate for every irreversible live/import action (lower-thirds import, ProPresenter push, distribution publish).
- **EmptyState** *(have it: `Card`)* — centered icon + one line + one primary action. The graphics table at 0 rows shows "No graphics yet. Import a script to extract lower thirds." (the 0 is expected, not a bug).
- **Skeletons** *(have it: needs `skeleton`)* — shaped to each component (StageRail bars, table rows, tiles), so loading mirrors the real layout, not a generic spinner.
- **BottomTabBar** *(have it: fixed grid, `md:hidden`)* — mobile primary nav, role's top 4 to 5 destinations, 48px targets, overflow in a "More" sheet. Replaces the current 8-link top bar on phones.

---

## shadcn primitives still to add

The repo currently has: `button`, `card`, `dialog`, `input`, `select`, `sonner`, `textarea`. To build the above, add via the shadcn CLI: `switch`, `badge`, `tabs`, `drawer`, `command`, `alert-dialog`, `tooltip`, `skeleton`, `scroll-area`, `resizable`, `avatar`, `progress`, `dropdown-menu`, `sheet`.
</content>
