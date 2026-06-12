# Dashboard Redesign Build Plan (2026-06-12)

**Directive (Daniel, gospel 2026-06-12, canon s19):** scrap the current dashboard UI; it was
designed from outdated information. Rebuild with (1) only the features and elements Daniel
has been talking about recently (canon s12–s15 + the 2026-06-11 pipeline build plan), and
(2) navigation that matches and fits the actual workflow.

> **STATUS (2026-06-12, late — fresh start):** the VISUAL half of this plan is reopened.
> Daniel rescinded the liquid glass pick, archived every mock and UI-advice doc to
> `docs/_archive/2026-06-12-ui-fresh-start/`, and set the only live visual guidance as
> `docs/_handoff/DESIGN-TASTE.md`. Former sections 4–5 of this plan (theme synthesis,
> donor map, token sheet, screen blueprints) are retired with that archive. Sections 1–3
> below (workflow, why-scrap, navigation/IA) remain CONFIRMED by Daniel and unchanged.

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

Primary navigation (desktop sidebar; phone bottom tab bar), role-ready per canon
s12 (Daniel sees all; per-role logins stay deferred):

1. **Today** (`/`) — route stays; **CONTENT REOPENED (Daniel, 2026-06-12 second
   message):** the per-role queue concept is NOT confirmed content. The only confirmed
   seed is Daniel's daily todo list synced from his notes. Priority queues, urgency
   trackers, and decision cards wait until the producer month map exists and the
   trust-by-evidence mechanisms are in place (see canon, "the centralization problem").
   The home page is composed LAST, from the tracks Daniel actually uses.
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
Canonical list = the 12-station superset with owners (canon s8/s12, Daniel CONFIRMED):
Script (Daniel) → Guests (Daniel) → Lower Thirds (Daniel approves) → Graphics (Isaac +
interns) → Rundown (Daniel confirms the preview) → ProPresenter (human load) → Record
(crew, no automation) → Edit/Review/Export (Isaac) → Transcript (Mac, automated) →
Metadata + Thumbnail (Myriam) → Distribution (Myriam) → Aired (Myriam). The matrix shows
each role its relevant columns; the phone shows a 12-segment bar per episode.

Reserved slots (appear when their slices land, greyed tiles until then): **Graphics**
(the locked s9 side-by-side design; builds after the graphics decision cards), **Schedule**
(6.5 Basecamp read-only season calendar), **System** (gear menu: jobs heartbeat, maturity
dial per task, import history; absorbs `/toolkit`). Mac Mail / Apple Notes surfaces stay
feature-flagged OFF until role auth (7.5 red-team gate).

Old routes 301/redirect to their new stations so nothing Daniel bookmarked breaks.

## 4. Visual direction — REOPENED (fresh start, 2026-06-12 late)

The former contents of this section (liquid glass synthesis, donor map of the ten example
mocks, CSS token sheet, type/motion spec) are retired to the archive and are not guidance.

What governs now:
- `docs/_handoff/DESIGN-TASTE.md` — Daniel's reactions, the only visual rulebook. Current
  laws: no walls of numbers on front screens (visuals tell the story; numbers one tap
  deep); cleaner beats richer (Soft Structural felt best of the four mocks, on phone, not
  approved); every element needs a stateable reason; not generic either (character from
  real show content); phone first.
- Next step (R0, awaiting Daniel's go): a research + planning pass on calm visual-story
  status surfaces, then a words-first brainstorm with Daniel about the story each screen
  tells — especially Today. No mockups until he says go after that conversation.
- Accessibility and safety floors carry over as engineering constraints (not styling):
  WCAG 2.2 AA contrast for body text, status triple-encoded (color + shape + word),
  40px touch targets, `prefers-reduced-motion` respected, no perpetual animation layers.

## 5. Screen blueprints — RETIRED

The detailed blueprints (KPI strips, big-number triptychs, count-first queues) were built
on the number-grid idiom Daniel has now rejected. Screen content gets redesigned in the R0
design pass around stories, not stats. The structural decisions in section 3 (which
screens exist, what each absorbs, the gates each carries) are unchanged.

## 6. Build sequencing (revised for the fresh start)

- **R0 — Month map + design pass (BLOCKS visual work; starts on Daniel's go):** FIRST
  map the producer month: Claude drafts the recurring responsibility tracks from repo
  knowledge (booking/guest pipeline, per-episode script + lower-thirds line, taping
  days, post + weekly distribution rhythm, the monthly research/guest-selection cycle,
  plus whatever has no home yet), Daniel corrects it the way he corrects a mockup; the
  result becomes a canon doc. THEN the words-first screen-story brainstorm, one screen
  at a time, home page LAST. Research on calm, glanceable, visual-story products feeds
  both. Log every reaction in DESIGN-TASTE.md; only then mock ONE screen, on real data,
  phone first.
- **Structural work that may proceed during/before R0 (visually quiet, default styling):**
  route consolidation + redirects, nav shell (five places + reserved slots), data wiring
  for Today/Matrix queries, realtime via the broadcast-from-database pattern (CL-018).
  Nothing visual gets polished before R0 lands.
- **R1–R5 (re-dated after R0):** theme foundation → Today + Pipeline Matrix → Lower
  Thirds hub (gates unchanged; slice-1 items 1.4/1.5/1.6 ride on it) → Distribution hub
  v1 + Rumble prep card (4.1a keeps its ~Jun 20 ship target) → Guests reskin + episode
  workspace + redirects + m13 screenshots. Each step mock-tested + screenshotted
  (desktop + phone) before reporting, `tsc`/`eslint` clean.

## 7. Supersedes / does not touch

- **Supersedes:** the 7-direction bake-off as a decision frame; the unthemed "one
  on-brand theme" placeholder in 3A; the tool-named page set; the liquid glass theme
  synthesis and its preview (archived 2026-06-12).
- **Stands (recent canon, unchanged):** the operational structure (Today queue + Pipeline
  Matrix + mobile-first, answer 3A); every locked page design (s9 graphics side-by-side,
  s9b lower-thirds spreadsheet + send, s9c rundown preview grid) — they get the new skin
  when their slices build; all gates; the maturity dial; role scopes (auth deferred).
- **Not in scope here:** graphics page build (awaits decision cards), Basecamp schedule
  view (6.5), ProPresenter push (slice 10), Mac-worker surfaces (slice 7).

## 8. One-tap confirms for Daniel — status

1. Section 1 workflow statement: **CONFIRMED correct.**
2. Navigation set (Today, Episodes, Lower Thirds, Distribution, Guests + reserved):
   **CONFIRMED.**
3. The 12-station pipeline list as the one canonical stage vocabulary: **CONFIRMED.**
4. Theme: **REOPENED.** The one-tap A · Liquid Glass pick (2026-06-12) was rescinded by
   Daniel later the same day in the fresh-start message. No mock is approved; visual
   direction runs through DESIGN-TASTE.md and the R0 design pass. Items 1–3 are
   unaffected.
5. Today-screen content: **REOPENED** (2026-06-12 second message). Only confirmed
   content: Daniel's daily todo list synced from his notes. Home-page composition is
   decided LAST, after the month map and the responsibility tracks exist.
