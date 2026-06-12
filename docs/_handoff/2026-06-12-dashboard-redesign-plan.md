# Dashboard Redesign Build Plan — Liquid Glass (2026-06-12)

**Directive (Daniel, gospel 2026-06-12, canon s19):** scrap the current dashboard UI; it was
designed from outdated information. Rebuild with (1) only the features and elements Daniel
has been talking about recently (canon s12–s15 + the 2026-06-11 pipeline build plan), (2) an
elegant liquid glass theme combining the most intuitive and elegant aspects of his supplied
example mocks (worlds 01, 05–10 + the older pipeline/bake-off/worksheet files), and (3)
navigation that matches and fits the actual workflow.

**Anti-churn declaration:** deliverable = this plan + a phone-openable liquid glass theme
preview, shipping today (2026-06-12). The build itself lands as the redesign PRs below,
absorbing build-plan slice 5 (Lane 1) and the UI half of slice 1, finishing by Jun 25.

This plan does not change any gate. Type-YES import, dry-run-first, held extraction,
ProPresenter human-push, QNAP read-only: all unchanged. The redesign treats every gate as a
first-class UI moment (a styled confirm panel), not friction to hide.

---

## 1. The Phase-1 lower-thirds workflow (verified against canon s0/s1/s2/s3/s9b/s13/s14)

The navigation is built around this flow. Stated for Daniel's confirmation:

1. **Daniel writes** scripts + lower thirds himself (AI does not write scripts in Phase 1).
   Each script doc carries a LOWER THIRDS block: TOPIC L3, GUEST CHYRON, DISCUSSION L3s,
   each with a char count.
2. **Upload is per segment** (teleprompter text; prerecorded segments arrive as transcripts
   standing in for the script). The lower-thirds file is **separate and optional**, never
   required at upload, importable **any time** for **any** already-uploaded segment.
3. **Import is deterministic and gated** (never AI): parse → dry-run preview showing
   episode / graphic / rejected counts → Daniel types YES → rows land in
   `production_lower_thirds`. The YES token is now enforced server-side (shipped
   2026-06-12); omitting it can never produce a live write.
4. **AI-assisted extraction is held for confirmation**: saving a script may extract
   candidates, but `auto_extract_apply` defaults false; nothing lands until the explicit
   confirm (`/api/scripts/confirm-extraction`). Regenerate produces 3 variations.
5. **Review + approve**: per beat, pick among Primary / Var 1 / Var 2. Char band: under 55
   amber, 60–65 green ideal, 66–70 amber, over 70 blocked; Topic L3 stays 60–65. Monologue
   = 15 approved lower thirds. Guest chyron = 3 topic-relevant variations (the affiliation
   relevant to that episode's topic). Lower thirds = ALL non-graphic on-screen text
   including CTAs; Featured Resource reuses a set rotation show to show. Location tags are
   NOT lower thirds (ATEM super-source, TD's domain).
6. **Send to ProPresenter is the only destination**: ALL CAPS, band validated, dry-run +
   type YES, into the dedicated Lower Thirds presentation. Lower thirds are **never pushed
   to Rundown Creator** (graphics go to RC; lower thirds do not). Today the send is still
   hand-paste; the gated Send button is the build target (slice 10 proves the path on the
   test machine first).
7. **The hard wall (canon s0):** Lower Thirds and Graphics are two separate systems —
   separate sources, tables (`production_lower_thirds` vs `production_graphics`),
   ProPresenter presentations, and workflows. The UI never mixes them.

## 2. What is wrong with the current dashboard (why scrap)

13 pages named after tools, not workflow stations: `/import`, `/extract`, `/upload`,
`/approved`, `/lower-thirds`, `/lower-thirds/ready` are six pages that are all facets of ONE
flow (the lower-thirds line above), forcing navigation hops mid-task. `/workflow` and
`/episodes` split one mental model (the season pipeline) across two flat tables. There is no
Today view, no distribution surface, no urgency surface, no decision-card surface — the
things recent canon actually asks for. Theme is default shadcn light gray with no identity.

## 3. The new information architecture (recent-canon features only)

Primary navigation (desktop: glass sidebar; phone: bottom tab bar), role-ready per canon
s12 (Daniel sees all; per-role logins stay deferred):

1. **Today** (`/`) — the per-role queue (answer 3A): approvals waiting (variation picks,
   held extractions, dry-runs awaiting YES), air-date urgency (canon s13 urgency tracker),
   batched one-tap decision cards (canon s12, 2026-06-12 ruling), upcoming tapings
   (e.g. Ming Wang Jun 15, 9:30/10:00).
2. **Episodes** (`/episodes`) — the Pipeline Matrix (answer 3A): every episode × stage at a
   glance, then drill into one episode's workspace: script, lower thirds, guests, webstream
   + distribution status in one place. Absorbs `/workflow`.
3. **Lower Thirds** (`/lower-thirds`) — the section-1 flow as ONE hub, staged left to
   right: Intake (upload script / import LT file / extraction holds, all behind the
   existing gates) → Review (segment tabs, beat rows, 3 variations, char bands, approve)
   → Ready/Send (the s9b send gate; ProPresenter push stays human until slice 10 proves
   it). Absorbs `/import`, `/extract`, `/upload`, `/approved`, `/lower-thirds/ready`.
4. **Distribution** (`/distribution`) — the webstream release hub (canon s12 umbrella):
   per-platform status cards from the s11 registry (YouTube private-first flip, **Rumble
   prep card** with copy-everything fields (4.1a, ships here ~Jun 20), Dropbox,
   StreamHoster, RLN/Signiant, GSN, podcast, CTN/WWN at low cadence), per-episode Monday
   4PM ET milestone tracking.
5. **Guests** (`/guests`) — existing data reskinned; chyron 3-variation surface;
   corrections / do-not-book flags from GUEST-CORRECTIONS.md.

**Pipeline stations (one list, canonized):** the older mocks carried three competing stage
lists (a 9-column matrix, a 10-node course diagram, a 12-row superset) — the 9-column
matrix silently dropped Lower Thirds, Rundown, and Transcript, all real gated steps.
Recommended canonical list = the 12-station superset with owners (canon s8/s12):
Script (Daniel) → Guests (Daniel) → Lower Thirds (Daniel approves) → Graphics (Isaac +
interns) → Rundown (Daniel confirms the preview) → ProPresenter (human load) → Record
(crew, no automation) → Edit/Review/Export (Isaac) → Transcript (Mac, automated) →
Metadata + Thumbnail (Myriam) → Distribution (Myriam) → Aired (Myriam). The matrix shows
each role its relevant columns; the phone shows a 12-segment bar per episode.

Reserved slots (appear when their slices land, greyed glass tiles until then): **Graphics**
(the locked s9 side-by-side design; builds after the graphics decision cards), **Schedule**
(6.5 Basecamp read-only season calendar), **System** (gear menu: jobs heartbeat, maturity
dial per task, import history; absorbs `/toolkit`). Mac Mail / Apple Notes surfaces stay
feature-flagged OFF until role auth (7.5 red-team gate).

Old routes 301/redirect to their new stations so nothing Daniel bookmarked breaks.

## 4. The liquid glass theme (synthesis of Daniel's examples)

Requirements that bound the synthesis:
- **Legibility first (the David Rule applied to UI):** status, counts, and gate confirms
  must read at a glance on a phone in a control room. Glass never sits under body text at
  under 4.5:1 contrast (WCAG 2.2 AA, per the ui-research briefs); blur is for surfaces,
  not for information.
- **Performance:** `backdrop-filter` layers are expensive; cap nested blur layers at 2,
  use composited transforms only, respect `prefers-reduced-motion`, and keep ambient
  animation off the phone profile.
- **One theme, dark, space-grade:** matches the show's identity (creation-science /
  astronomy) without cosplay; data surfaces stay neutral so status colors carry meaning.
- **Anti-slop guardrails (from Daniel's uploaded skill pack, 2026-06-12):** no
  centered-everything layouts, no purple gradients, no uniform rounded corners, no Inter
  font; KPI-row-first dashboard anatomy (headline numbers, then work surfaces, then
  detail).
- **Adjust pass (2026-06-12, Daniel's "Adjust first" tap):** preview audited against the
  `redesign-skill` + `taste-skill` in Daniel's taste-skill repo and the official
  `frontend-design` skill in his skills repo. Fixes applied: 10px label floor enforced
  everywhere, two-tier radius rule (containers 10px / controls 6px), shadows tinted to
  the navy instead of pure black, pressed states + keyboard focus rings added, hero
  headline given display presence (tighter tracking, balanced wrap), countdown gets the
  one permitted glow. The exact ui-ux-pro-max pack on the Mac stays un-synced (cloud
  cannot read Mac paths); its uploaded members (design-system, web-artifacts-builder,
  build-dashboard) are absorbed above.

**Donor map (the most intuitive + elegant aspect of each example, combined):**
- **World 01 Deep Field:** the palette discipline (ONE warm accent on deep teal blacks; amber
  reads "tally light," not toy) and the System integrations tile (it already names the real
  stack: Rundown Creator, Supabase, Lower Thirds 0/15).
- **World 05 Event Horizon:** the clearest status ramp (ok/warn/danger/hold/draft as five
  distinct hues; **hold = blue, "waiting on a person," never red**) and the big-number
  summary triptych form.
- **World 06 Cassini Rings:** the Alloc/Actual/Delta timing data model, the document-flow
  band layout (the only example that degrades gracefully to a phone), and the cheap
  one-listener specular highlight.
- **World 07 Heliophysics:** the progress instrument panel (linear gauges animating to value:
  L3s locked, script rows confirmed, booking fill) and per-row completion micro-bars.
- **World 08 Celestial Nav:** the circular runtime gauge with an over-run arc and the brand
  mark idea (the star chart and fantasy RA/Dec readouts are dropped: decoration posing as
  data is a credibility risk).
- **World 09 Aurora Signal:** THE glass recipe (neutral white-alpha borders so status colors
  keep their meaning), the row anatomy (title + context subtitle), and the only example with
  honest time semantics ("Headroom +3:35" positive, never alarming an under-target show).
- **World 10 Cosmic Telemetry:** the app shell (sticky glass header, normally scrolling body,
  sticky status bar — the only phone-viable skeleton), the 6-cell KPI strip, explicit
  OK/OVER flags, count-up numbers (the FUI costume — particles, scanlines, glitch,
  crosshair — is dropped).
- **Pipeline v3 (Daniel's earlier favorite):** the hard color rule (**RED = needs you /
  GREEN = done / GOLD = brand + active only, never a warning / VIOLET = deferred**), glass
  reserved for chrome + hero while data sits on quiet surfaces, near-flat background behind
  data, the air-date alarm, colorblind-safe glyphs (shape + color, never color alone),
  phone segment-bars, the designed empty state.
- **Flight worksheet:** the pre-filled tap-to-change decision pattern ("Pre-filled (my
  suggestion) — tap to change", "Show only what I changed"), 40px touch targets.

**Token set (the R1 deliverable, as CSS custom properties):**

```css
--bg-void:#04080f;                      /* W01 deep teal-black */
--surface-1:rgba(6,14,22,0.58);         /* panels (W09) */
--surface-2:rgba(8,14,26,0.72);         /* dense/mobile panels (W10: opaque = legible) */
--text-hi:#c8dde8; --text-mid:rgba(200,221,232,0.55); --text-dim:rgba(200,221,232,0.28);
--accent:#E8A84C;                       /* brand / active / primary action ONLY */
--ok:#34D07A; --warn:#FFD234; --danger:#FF3B5C; --hold:#4A9EFF; --draft:#8A9BB5;
/* glass: blur(12px) saturate(130%); border rgba(255,255,255,.10), top edge .16;
   inset top catch-light + deep double shadow tinted to the navy (never pure black);
   radius rule: containers 10px, controls 6px (documented two-tier scale);
   one full-screen grain layer at 0.028 opacity (never per-panel) */
```

Type: Archivo Narrow 600/700 for titles (tracked caps) + Archivo body at 13px +
JetBrains Mono with `tabular-nums` for every number, count, and timecode; labels never
under 10px. Motion budget: entrance fade-up stagger (60ms), gauges animate to value once,
one heartbeat dot, hover = border brighten; all behind `prefers-reduced-motion`; **no
perpetual canvas/animation layers**; specular = one root-level listener behind
`(pointer: fine)`. Background: near-flat deep-space gradient + scrim, no starfield behind
data, never `background-attachment: fixed` (breaks on iPhone). Accessibility floor: 4.5:1
body contrast on glass, status triple-encoded (color + glyph + word), 40px touch targets.

## 5. Screen blueprints

- **Today:** hero strip (this week on air + on-track chip + countdown), the W10 KPI strip
  (6 cells: next air, L3s approved, held extractions, YES gates waiting, guests confirmed,
  webstream), then the v3 queue in three tiers — **"Blockers - needs you now"**, **"Due
  before Tuesday"**, **"FYI"** (collapsed) — items verb-first with exactly one button and
  the evidence on the gate itself ("Type YES to import 14 lower thirds — dry-run: 14 rows,
  0 rejected"). Decision cards use the flight-worksheet pattern (recommendation pre-filled,
  tap to change). Designed empty state: "Nothing needs you right now. Next air Tue 8:00p,
  on track."
- **Episodes / Pipeline Matrix:** rows = episodes (S03EPxxx + title, frozen column),
  columns = the 12 stations; glyph cells (shape + color); per-column "n cleared" counters;
  **"In post" / "In production"** bands; per-row on-track / watch / behind chip; the
  **air-date alarm** (a row flags red within ~7 days of air if not yet at Distribute —
  the David Rule as UI). Tap a row → episode workspace (script, lower thirds, guests,
  distribution in one place, one "current stage needs attention" card with one primary
  action). Phone swaps the table for per-episode 12-segment bars. Realtime via the
  broadcast-from-database pattern (CL-018), no polling.
- **Lower Thirds hub:** three stages as glass panels — Intake (drop zone + episode/segment
  picker + held-extraction list), Review (s9b: segment tabs, beat rows, Primary/Var1/Var2
  selectable, char-band pill colored 55/60–65/70, cycle-variation button, 15-count meter on
  monologue), Send (approved set, ALL-CAPS preview, dry-run → counts → type YES). The gate
  modal is a styled liquid-glass moment: counts huge, YES field centered.
- **Distribution hub:** webstream milestone header per episode (Mon 4PM ET countdown);
  platform cards in registry order with per-platform status + the action that platform
  actually supports in Phase 1 (YouTube: flip-public check; Rumble: prep card with
  copy buttons for file/title/description/tags/thumbnail/schedule; Dropbox: drop confirm;
  StreamHoster: FTPS handoff status; RLN: Signiant + the -20 LKFS note; GSN: handoff card;
  podcast: episode MP3 status). Nothing fires uploads from the dashboard in Phase 1; cards
  track + prep.
- **Guests:** searchable glass list, guest sheet drawer: affiliations (multi, topic-relevant
  chyron picker), appearances, do-not-book / correction flags surfaced loudly.

## 6. Build sequencing (PR-sized, each mock-tested + screenshotted before report)

- **R1 — Theme foundation (Jun 13–14):** design tokens as CSS custom properties, glass
  primitives (GlassPanel, GlassCard, StatusChip, GateConfirm), nav shell (sidebar + bottom
  tabs), background system. No data-logic changes. Screenshots desktop + phone.
- **R2 — Today + Pipeline Matrix (Jun 15–16):** both screens on real episode/guest data,
  realtime status. View-only = safe inside the Daniel-light window (the only thing he taps
  before Jun 16 is nothing — these need no input).
- **R3 — Lower Thirds hub (Jun 16–18):** consolidate the six pages into the staged hub;
  all existing gates wired through unchanged (server YES token already enforced); the
  slice-1 items (first real import 1.4, variations flow 1.5, three-column comparison 1.6)
  ride on this hub instead of the old pages.
- **R4 — Distribution hub v1 + Rumble prep card (Jun 19–20):** registry cards + the 4.1a
  prep card for a mock episode (its standing ship date holds).
- **R5 — Guests reskin + episode workspace polish + redirects (Jun 21–23):** old routes
  redirect; screenshots embed into course m13 (5.3); urgency tracker (5.2) and the
  decision-card surface land on Today.
- **Slice-5 close (by Jun 25):** sweep, mobile pass, `tsc`/`eslint` clean, LANES + canon
  updated, course facts reconciled.

## 7. Supersedes / does not touch

- **Supersedes:** the 7-direction bake-off as a decision frame (preview-1..7 files stay in
  git history); the unthemed "one on-brand theme" placeholder in 3A; the tool-named page
  set. Lane 1 is updated to carry this plan.
- **Stands (recent canon, unchanged):** the operational structure (Today queue + Pipeline
  Matrix + mobile-first, answer 3A); every locked page design (s9 graphics side-by-side,
  s9b lower-thirds spreadsheet + send, s9c rundown preview grid) — they get the glass skin
  when their slices build; all gates; the maturity dial; role scopes (auth deferred).
- **Not in scope here:** graphics page build (awaits decision cards), Basecamp schedule
  view (6.5), ProPresenter push (slice 10), Mac-worker surfaces (slice 7).

## 8. One-tap confirms for Daniel — RESOLVED (one-tap cards, 2026-06-12 late session)

1. Section 1 workflow statement: **CONFIRMED correct.**
2. Navigation set (Today, Episodes, Lower Thirds, Distribution, Guests + reserved):
   **CONFIRMED.**
3. The 12-station pipeline list as the one canonical stage vocabulary: **CONFIRMED.**
4. Theme preview: direction accepted, **adjustments pending** — Daniel will specify what
   to change; structural build (R1 scaffolding, R2 screens) proceeds meanwhile and his
   adjustments land in the token layer. More example files remain welcome; the synthesis
   absorbs them.
