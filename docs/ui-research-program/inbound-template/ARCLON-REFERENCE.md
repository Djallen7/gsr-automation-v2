# Arclon v1.0 - design reference

The template Daniel purchased on Envato and shared. Extracted and studied 2026-06-08. The full 33 MB source was pulled into scratch space for study; it is not committed (it would bloat the repo, and its stack differs from the app, see below). This file captures what we need.

## What it is
- **Arclon v1.0** by CoderThemes (coderthemes.com/arclon). A "fully responsive Bootstrap web application UI kit" / admin dashboard template.
- **Stack:** Bootstrap 5.3.3, jQuery 3.7, SCSS compiled with gulp. Charts via ApexCharts 4; tables via Gridjs + DataTables; icons via Iconify / Remix / Solar; extras (flatpickr, choices.js, simplebar, sweetalert2, fullcalendar, quill, dragula, leaflet, jsvectormap).
- **Scope:** ~225 prebuilt HTML pages (dashboards, auth, error, apps like chat/email/invoice/calendar, UI components, forms, charts, tables, maps), light and dark themes, RTL build.
- **License:** Daniel owns an Envato license for it, so using it in his end product is within terms.

## Design tokens (from its SCSS)
**Brand / status**
- Primary: `#1478f0` (blue) | Secondary: `#5b69bc` (indigo-violet) | Success: `#30cf46` | Info: `#4bbee1` (cyan) | Warning: `#faae37` | Danger: `#f83f32` | Pink: `#ff8acc` | Orange: `#fd7e14`
- Note: its accent is BLUE with an indigo-violet secondary, not our violet/black. To match the GSR brand we recolor primary to our violet `oklch(0.64 0.19 287)` and keep status hues.

**Light theme:** body bg `#f0f4f7`, body text `#4c4c5c`, cool gray ramp (`#f6f7fb` -> `#313a46`).
**Dark theme:** body bg `#1c1d27`, tertiary surface `#242425`, body text `#b8c1c9`, secondary text `#8391a2`, subtle borders from the gray-800 range. (A cool blue-gray dark, close in spirit to our near-black; we shift the hue toward violet `287`.)

**Type:** base font is the Bootstrap sans stack; a secondary display face of **Atkinson Hyperlegible Next**. Border radius is tight (`.2rem`), so it reads crisp/compact.

## The fork in the road (important)
Arclon is **Bootstrap + jQuery + gulp/SCSS**. The GSR app is **Next.js 16 + React + shadcn/ui + Tailwind v4**. These do not mix cleanly: you cannot drop Arclon's jQuery/Bootstrap pages into the React app, and porting all 225 pages is not worth it. So the useful moves are:
1. **Adapt its look in our stack (recommended).** Take Arclon's layout grammar (sidebar + topbar + dense cards), spacing, tight radius, typography, and component inventory, recolor to violet/black, and build it with Tailwind/shadcn. Keeps our stack and our three concepts, gains its polish and breadth.
2. **Faithful Bootstrap prototype.** Rebuild one concept (Mission Control / Ambient / Broadcast) inside Arclon's real shell as a standalone Bootstrap page, to feel the template exactly. Throwaway, not app code.
3. **Re-base the app on Arclon.** Switch the GSR app toward Bootstrap/Arclon, or systematically port its design system into Tailwind tokens. A significant architectural decision.
4. **Reference only.** Keep building our direction; use Arclon as a polish benchmark.

## Components worth lifting (conceptually)
Its KPI/stat cards, the dense data tables (Gridjs/DataTables styling), ApexCharts theming, the calendar (fullcalendar) for the monthly-cycle view, the timeline page, the chat/email app shells, and the auth screens are all directly relevant to GSR and worth matching.
