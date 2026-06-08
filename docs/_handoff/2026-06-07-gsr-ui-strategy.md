# GSR Dashboard UI Strategy (2026-06-07)

Synthesized from a 10-agent research sweep (industry production tools, editorial
calendars, kanban, data-grids, timelines, progressive disclosure, action-queues,
cognitive load, status-visualization, mobile-first). This supersedes the
widget-heavy v2 mock. Aesthetic decisions are deliberately secondary here; this
is about how information is organized, placed, and surfaced.

## The core principle

The dashboard's job is two things, not "show all the status":
1. Tell each person WHAT NEEDS THEM NOW.
2. Show whether the two batches (5 in pre-production + 5 in post) will MAKE THEIR AIR DATES.

Everything else is reference, one tap away. A wall of widgets is the wrong
primitive for 10 concurrent episodes; it forces the user to re-assemble "where
does everything stand" in their head every time.

## The widget test (rule of thumb)

- More than ~5 of a thing is a GRID/MATRIX, not N widgets.
- Something earns the home screen only if it answers "what do I do next, or what
  is about to go wrong?" for THIS person THIS week.
- A single critical number can be a widget (next air date, approvals count).
  Status across many items is a matrix. Telemetry (system health) stays silent
  until it breaks.

## Information architecture (a queue + 3 drill levels)

- DEFAULT LANDING = "Today / Your Move": an exception queue. Three tiers,
  Blockers then Due-before-Tue then FYI. Each item is a verb + the episode +
  why it is here + an inline action. Empty state is a feature:
  "Nothing needs you. Next air Tue 8p, on track."
- SCHEDULE = the Pipeline Matrix (the single oversight visual, below).
- EPISODE (drill): one episode's 9-stage pipeline.
- WORKING SURFACES (drill): Graphics Tracker, Lower-thirds, Distribution,
  Metadata, Edit. Dense, role-scoped, reached by a tap, never on the home screen.

## The Pipeline Matrix (the one oversight visual)

- Rows = episodes, in two labeled bands: "In production" (5) and "In post" (5).
- Columns = the 9 real stages: Script, Guests, Graphics, ProPresenter, Record,
  Edit/Review/Export, Metadata + Thumbnail, Distribute, Aired.
  (The v2 mock wrongly showed only 7; Record and Mark-aired were dropped.)
- Cell vocabulary, shape AND color so it is colorblind-safe: done = filled green
  disc; in progress = gold ring (the only motion on screen); not started =
  hollow outline; blocked / at risk = RED SQUARE; deferred = violet dashed.
- Per-row chip = on track / watch / behind (stages remaining vs days to air).
- Per-column "n / 10 cleared" = the team's current bottleneck at a glance.
- Air date drives the sort, and turns a row label red automatically when an
  episode is within 7 days of air and not yet at Distribute. This is the David
  Rule made automatic: air-date slippage is the loudest signal.
- Mobile: each row collapses to a 9-segment color-only bar + air date + the
  status chip; tap to expand a vertical stepper.

## Navigation (mobile-first, Daniel lives on his phone)

Bottom tab bar, 4 destinations: Today, Episodes (a swipeable pager of the 10),
Approvals (with a badge count), More. No hamburger. Push notifications are the
real front door and deep-link straight to the exact task, not the home menu.

## Per role (each role's home obeys the 5-element cap)

- Daniel (owner): the Today queue (approvals + anything at risk) + the Schedule
  matrix (both bands) + one "this week on air" hero. Crew board, distribution
  detail, and system health move behind More or a drill.
- Myriam (metadata, thumbnails, uploads, mark-aired; successor): the Today queue
  for her tasks + the matrix filtered to the back stages of the post band.
  Roughly three things, never graphics or scripts.
- Isaac (graphics + ProPresenter + edit/export): the Today queue for his tasks +
  the matrix filtered to Graphics/ProPres/Edit; drills into the Graphics Tracker.
- Interns: Isaac's view minus editing (graphics + b-roll + ProPresenter/Rundown).

## Hard rules (anti-overwhelm, from the cognitive-load research)

- Max ~5 primary elements per screen; exactly ONE focal point.
- Color means one thing: a single RED = needs attention / at risk; GREEN = done;
  neutral ink for everything else. The brand color must NOT double as a warning
  (v2's gold meant both brand and "warn", so color stopped being trustworthy).
- No ambient motion behind data. Drop the drifting nebula and twinkle behind
  content; keep the brand restrained. Motion only on a state change the user caused.
- One shipped theme. No theme switcher in production (that was lab scaffolding).
- Telemetry (system health) is silent when green and only appears as an alert.
- Never show one fact in multiple encodings (v2 showed graphics progress four
  ways inside a single card: a ring, a fraction, mini-rows, and tags).

## What stays a widget (the only survivors)

- This-week air target + countdown (the hero).
- Approvals waiting on you (a count + the Type-YES entry point).
- Distribution fan-out for the in-flight episode (parallel topology, and one
  target, Rumble, is a standing manual/broken case).
- Optional and demoted: a weekly throughput sparkline.

## Aesthetic (serves the information, not the reverse)

Keep a restrained, on-brand astronomy navy + gold, but the cosmic background
becomes a near-flat surface behind data, and glass/refraction is reserved for at
most one hero element. Legibility and calm first.
