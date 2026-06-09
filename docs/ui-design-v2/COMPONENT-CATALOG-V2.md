# GSR Component Catalog (v2: Violet/Black, Monthly Cycle)

**Date:** 2026-06-07
Custom, compact components invented for the monthly 5-episode dashboard, each buildable on shadcn/ui + Tailwind v4. Violet is rationed to interaction; status hues live away from violet; near-black violet-tinted surfaces; tabular numerals. Visuals in `gsr-dashboard-v2.html`.

---

## Hero options (choose one organizing metaphor)

- **HealthList (Direction A, recommended)** — 5 rows, one per show. Each row = identity + guest avatar, a 6-segment stage track (current segment is the only violet), four readiness cells (GFX / LT / GUEST / DIST as StatusChips), a schedule-health ring, and a blocked-on-person avatar. Re-ranks to the top + brightens under stress; nothing is added. Build: CSS grid rows, no lib.
- **PipelineRail (Direction B, deferred to /pipeline)** — 5 stacked horizontal lanes sharing a left-to-right stage axis; a vertical today/on-pace line makes lag a broken diagonal; click a lane to expand its readiness in place. Build: flex rows + width-based fills; lazy-load detail on expand.
- **CycleDial (Direction C, optional widget)** — a near-black ring = the month, a violet sweep hand = today, 5 pucks (6-segment micro-arcs) at their air dates, center reads NEXT milestone + countdown. Build: SVG arcs; keep an accessible text table beside it. Honest caveat: prettier than it is legible; never the sole channel.

## The orientation layer

- **VerdictLine** — one Space Grotesk sentence + a cycle-% ring + the next-deadline countdown. Default calm ("on track"); flips to a count ("3 things need you") when gated items exist. The whole dashboard if you read nothing else.
- **NeedsYouLane** — a stack of at most 3 action cards, only Daniel-gated decisions (approve ideas, approve lower thirds, confirm rundown, trigger distribution), ranked by deadline then blocking-others. One-tap deep links with pre-applied filters. Calm empty state. Build: `Card` + scored server query.
- **CycleRibbon** — a thin static 5-segment month bar; current phase filled violet, "Day 12 of 30, 1 day to YouTube." Rhythm context without a dial. Build: flex segments, no motion.
- **NextActionLine** — one recommend-dont-poll sentence ("Next: approve Show 3 ideas so Isaac can start today"). Always agrees with the top Needs-You card.

## The status system (one vocabulary everywhere)

- **StatusChip `{domain, state, health, blockedBy}`** — glyph (shape bound to family: circle = progress, square = artifact, diamond = approval gate, triangle = attention/fail) + label + color, so meaning survives grayscale. Build: one component, token-driven.
- **HealthRing (layer on any chip)** — schedule health as border style, not a new color: none = on track, dashed = at-risk, solid + clock + "-Nd" = overdue. Overdue borrows danger only as a desaturated border, never a fill, so "late" never looks like "failed."
- **BlockedAvatar** — a 20px avatar + badge (pause = waiting on them, inbound arrow = your turn). Distinct from behind-schedule by construction (who vs when). Hover reveals "Waiting on David since Jun 3."
- **Token boundary rule:** status tokens (`--st-*`, hues 25/85/150/210 + neutral) are lint-separated from interaction tokens (`--ui-*`, violet 287), so no status chip can be mistaken for something clickable.

## Micro-widget kit (the building blocks)

- **ProgressRing** — % toward a whole; SVG two-stroke, 40/56/72px, tabular % centered. Binds: cycle %, episode completion.
- **FractionMeter** — "22 / 30" + a thin fill bar; numerator bold, denominator muted. Binds: graphics ready, guests confirmed.
- **SegmentedBar** — composition across stages in one 8px pill; only the current stage is violet. Binds: the 6-stage track, batch histogram.
- **CharCountMeter (signature)** — the lower-thirds 55 to 65 band: a track with a shaded good band and a moving tick, amber under 55, green 55 to 65, red over 65 and blocked from send. Nothing off-the-shelf does this.
- **CountdownPill** — tabular "3d 04h"; calm grey > 48h, violet < 24h, amber outline overdue. No ticking seconds.
- **StatusBeacon** — 8px dot + glyph; status hue only, never violet; soft pulse only on red.
- **Sparkline / BulletGraph / HeatStrip / CountTile / DeltaChip** — trend, value-vs-target, activity-over-days, big number, change indicator. Raw SVG/divs; no chart lib needed at this size.

## Navigation and shell

- **LeftRail** — slim, role-filtered (max 5 items; Isaac never sees Distribution, Myriam never sees Graphics). The only thing that changes page.
- **ContextBar** — persistent breadcrumb-zoom `Cycle: June > Show 3 > Interview 1`; each crumb a popover picker. Cycle/Episode are page state; Segment/Row are in-page filters. This keeps the whole zoom on one screen.
- **CommandPalette (Cmd-K)** — two modes: Jump (episodes, guests, graphics, saved views, recents/pins) and Do (`>` verbs: import lower-thirds, regenerate, mark approved, "jump to next unfinished segment"). Scoped to the current context first. Build: shadcn `command` / cmdk.
- **CycleCompassChip** — `June, 3 of 5` with a 5-dot strip; the constant "where am I in the month."
- **DetailDrawer / ConfirmYesDialog / EmptyState / Skeleton** — vaul drawer for in-place detail; the reusable "type YES" gate for any irreversible live action; dashed "not tracking yet" empty states (never a red zero); layout-matched skeletons.

## Mobile

- **BottomTabBar** — role's top 4-5 destinations, 48px targets, violet only when active, "More" sheet for overflow.
- **ContextPillSheet** — a tappable pill opens a vaul sheet that is itself a mini-zoom (Cycle -> Episodes -> Segments), each tap one level deeper.
- **SwipeReviewCard** — for graphics/lower-thirds: full-bleed card, swipe right approve / left reject, with visible buttons as the accessible fallback and a sticky bottom action bar (safe-area inset). One card at a time, char meter under it.
- Hero reflows: HealthList -> accordion rows; PipelineRail -> vertical lanes; CycleDial -> a 180deg arc + pace card with the list below.

## shadcn primitives to add
`card, badge, tabs, progress, tooltip, hover-card, skeleton, separator, scroll-area, command`. Adopt **cmdk**, **vaul**, **motion** (transitions only); **TanStack Table** when the full episode grid lands; skip **Tremor** until real metrics exist (Phase 4).
