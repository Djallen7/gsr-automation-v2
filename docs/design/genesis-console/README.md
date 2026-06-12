# Genesis Console — dashboard visual design (source of truth)

**What this is:** the realized visual design for the GSR producer dashboard — "The Genesis
Console," a single-screen production command surface for David Rives' Genesis Science Report.
Reconstructed faithfully from an exported Claude.ai design-system session (2026-05-31 → 06-02),
by replaying the build's `write_file` + `str_replace_edit` operations in order (25 edits, 0 missed).

**Files**
- `The Genesis Console.html` — the complete, self-contained dashboard mock (inline CSS + JS, no
  build step). Renders standalone; only needs internet for Google Fonts. Open it in a browser.
- `DESIGN-BRIEF.md` — the original brief: the full aesthetic spec, the calm-under-high-volume
  techniques, the layout, and the sample data set.
- `colors_and_type.css` — the design tokens (color + type CSS vars).
- `ui_kits/console/` — React recreation of the console: `primitives.jsx`, `modules.jsx`,
  `app.jsx`, `lowerthirds.jsx`, `kit.css`. These are the reusable components to port into the
  real Next.js dashboard.
- `preview/_card.css` — design-system preview card styling.

**Status (important):** the source session was cut off by a 5-hour usage limit mid-build. The
last unfulfilled request was: **split the information across multiple pages, and add tweakable
controls.** Those two asks are NOT done here.

**Relationship to the real build:** this is a static mock with fake data. The real dashboard
(`apps/dashboard`, Next.js 16, live Supabase) should adopt this design language over real data —
the Fable build prompt's "turn the review HTML into a real dashboard route" step targets exactly
this. The `ui_kits/console` JSX is the head start.

**Aesthetic in one line:** "cosmic liquid glass" — deep-space near-black (#06070B), pure-CSS
nebula + starfield, cool palette only (ice-blue #5BD0FF, teal #36D6C3, gold hairline #C9A84C),
liquid-glass panels with pointer-tracked specular highlights, Saira Condensed / IBM Plex Mono /
Saira type, one hero countdown, progressive disclosure, bullet graphs, opacity-as-pipeline-stage.
(Daniel's stated rule: no purple/magenta/pink/pastel.)
