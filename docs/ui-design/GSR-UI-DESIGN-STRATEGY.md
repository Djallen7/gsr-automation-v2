# GSR Dashboard UI Design Strategy

**Date:** 2026-06-07
**For:** Daniel Allen
**Author:** A 12-agent UI design team (brand, density, data-viz, IA, components, mobile, lower-thirds, graphics tracker, distribution, motion, sources, accessibility)
**Companion files in this folder:** `COMPONENT-CATALOG.md`, `SOURCES.md`, `gsr-dashboard-mockup.html` (open it in a browser, it is mobile-friendly and brand-styled)

---

## 0. The one-paragraph answer

You do not get a "stunning, not generic" dashboard from cool widgets. You get it from three moves: **(1) a distinct brand skin** that no other dashboard has, taken straight from the GSR look (deep-space navy lit by broadcast gold, a faint starfield, a lower-third bar motif); **(2) ruthless reduction** so each screen leads with one bold number and one obvious next action while everything else recedes or hides one tap away; and **(3) a small set of clever, purpose-built components** that each carry a lot of meaning in a tiny footprint (a pipeline rail, a status bar that shows a whole show's progress in one strip, a character-count meter that doubles as a quality gauge). Beauty is the brand skin plus restraint. Function is the reduction plus the purpose-built parts. You can have both, and the mockup proves it.

---

## 1. The distinct look: a GSR design language

The brand research confirmed the real David Rives / GSR identity: **deep blue plus gold/tan, over real Hubble and NASA deep-space imagery**, anchored by "The Heavens Declare the Glory of God." Your current dashboard already uses a navy primary (`oklch(0.28 0.07 243)`); the only thing missing is the other half of the brand, the **gold**. Adding gold and a cosmos surface is what turns a generic shadcn app into something unmistakably GSR.

### Vibe statement
> A control room cut from the night sky. Deep navy space lit by broadcast gold, where every screen feels like the heavens quietly declaring the work.

Three adjectives: **cosmic, authoritative, refined.**

### Color system (OKLCH, drops into your Tailwind v4 theme)

The **dark "cosmos" theme is the hero.** Light theme is the daytime fallback.

**Dark (hero):**
```
--background  oklch(0.16 0.035 250)   /* deep space */
--surface     oklch(0.21 0.04 248)    /* panel */
--surface-2   oklch(0.25 0.045 247)   /* raised */
--border      oklch(0.32 0.04 247)    /* hairline */
--foreground  oklch(0.95 0.01 250)
--muted-fg    oklch(0.70 0.02 250)
--primary     oklch(0.62 0.14 248)    /* navy lifted for dark bg */
--accent      oklch(0.80 0.14 85)     /* GSR gold ~ #E3B23C */
--success     oklch(0.74 0.15 150)
--warn        oklch(0.82 0.15 85)
--danger      oklch(0.64 0.20 25)
--info        oklch(0.70 0.12 235)
```
**Light:**
```
--background  oklch(0.985 0.004 250)
--surface     oklch(1 0 0)
--foreground  oklch(0.22 0.05 248)
--primary     oklch(0.28 0.07 243)    /* your existing navy */
--accent      oklch(0.62 0.13 80)     /* gold darkened for contrast */
--success     oklch(0.55 0.14 150)
--warn        oklch(0.70 0.14 80)
--danger      oklch(0.55 0.20 27)
--info        oklch(0.50 0.12 240)
```

**Rule: gold is for brand, active, and primary calls to action only. Never for danger.** Gold always reads "GSR," never "alert."

### Typography
- **Headings:** `Saira` or `Saira Semi Condensed` (Google Fonts). Condensed, broadcast-news authority, perfect for the ALL-CAPS section titles that echo your lower thirds.
- **Body / UI:** keep **Geist Sans** (already installed). No churn.
- **Mono:** keep **Geist Mono** for episode IDs, timecodes, and the character counts (mono makes the count visually trustworthy).

### Five signature motifs (each is one cheap CSS layer)
1. **Starfield surface** — faint, slowly twinkling stars behind the dark UI at ~5 to 8 percent opacity. The "cosmic wonder" anchor. Off under reduced-motion.
2. **Broadcast lower-third bar** — a gold left-accent rail on cards, page titles, and active rows. Ties the product to its job (making on-air bars).
3. **Scripture-margin rule** — a thin gold vertical rule on callouts and empty states, evoking a verse margin.
4. **Constellation connector** — the pipeline stages linked by a faint dotted line with small star nodes, turning your workflow into a sky map.
5. **Gold focus glow** — focus and active states use a soft gold ring instead of generic blue, so every interaction is branded.

This is **additive**: navy stays, Geist stays. You are adding gold, a cosmos surface, and one display font.

---

## 2. The design principles (how to carry a lot without overwhelming)

From the density, accessibility, and ADHD research, in priority order:

1. **Interaction density, not pixel density.** Every screen answers "what is mine, and what do I do next" before it shows anything else.
2. **One primary action per screen.** Exactly one filled gold button. Everything else is ghost or text. (Import page: the primary is "Run dry-run check"; the live Import button only appears after review.)
3. **Lead with one bold number.** The role-relevant count is the biggest thing on the page; metadata recedes to muted gray.
4. **Whitespace groups, borders do not.** Delete most card borders and dividers; let spacing do the work.
5. **Color only for meaning.** Gray carries structure; gold flags the one thing needing you; status colors mean status. Routine rows stay neutral.
6. **Two disclosure levels, never three.** Overview card to drill-in list, full stop. No modals inside modals.
7. **Icon plus count over sentences.** A dot and a number beats a label phrase. "12 awaiting your approval," not a paragraph.
8. **Role-scope by default.** Showing only one person's slice is the single biggest reduction. Filter every query server-side by role so the page arrives pre-pruned.
9. **Max five primary items per landing page.** Today's one focus, three or four status cards, one action. Everything else lives behind drill-in.
10. **Empty states are onboarding, not errors.** Since graphics is at 0 rows, every empty tracker says the next real action with the button inline ("No graphics yet. Import a script to start tracking lower thirds.").

**Anti-patterns to avoid (the generic-dashboard traps):** cramming every metric because you have it; cards inside cards with borders on borders; rainbow status systems where nothing reads as urgent; three-plus disclosure levels; multiple equally-weighted primary buttons; decorative KPI rows that are not role-relevant; vague "Details / More" links with no count.

---

## 3. The status vocabulary (one consistent language everywhere)

Every status uses **color plus shape plus a text label**, so it survives a grayscale print and a colorblind viewer (never color alone, a WCAG requirement). Use this exact set in the tracker, the pipeline rail, and the distribution board so a color always means the same thing.

| State | Shape | Color family | Label |
|---|---|---|---|
| Not Started | hollow ring | neutral gray | "not started" |
| In Progress | half-filled / dashed | blue (info) | "in progress" |
| Created | filled square | amber (warn) | "created" |
| Loaded In / Done | filled check | green (success) | "loaded in" |
| Blocked / Failed | filled X | red (danger) | "blocked" |

Pipeline stages reuse the shape language: pending = hollow gray, current = bold gold ring (`aria-current`), complete = green check.

---

## 4. Information architecture: per-role home pages

The dashboard is role-scoped (canon, 2026-06-07). Each landing page answers "what is mine to do right now," capped at five cards, ordered highest-priority first.

**Daniel (owner/producer) — the whole board without drowning:**
1. **Needs My Decision** (the ADHD anchor): approvals queue, graphic-idea toggles, final title call, extraction confirmations. One list of "only you can clear these."
2. **This Week's Episode**: one card, pipeline rail, blockers, who is stalled.
3. **Crew Task Board**: per-person roll-up (Isaac/Jakob/Jeremiah/Gabe/Myriam), red where stalled.
4. **Distribution & Air Status**: published / scheduled / aired across the established stack.
5. **System Health**: quiet unless something is wrong (failed import, RC error body, advisor warning).
- Primary action: clear the next approval.

**Myriam (metadata & post lead) — narrow, publish-focused:**
1. **Ready to Publish** — episodes exported, awaiting metadata/thumbnail/upload.
2. **In Progress** — episodes she started.
3. **Recently Aired** — confirmation log + mark-aired.
- Primary action: open the next episode's metadata + upload sheet. Sees nothing about graphics build, editing, or internals.

**Isaac (graphics & edit lead):**
1. **My Graphics Tracker** — this episode's rows by status.
2. **Edit & Export** — ready to edit / in review / ready to export to Dropbox.
3. **ProPresenter Load** — graphics marked Created, awaiting load (test-machine badge).
4. **Approved Ideas Feed** — newly approved ideas to start building.
- Primary action: advance the next tracker row.

**Intern (Isaac minus editing/export):**
1. **My Assigned Graphics** — their rows, with the script-highlight context inline.
2. **B-roll To Source** — rows needing clips, with Storyblocks / Dreamstime / Envato shortcuts.
3. **ProPresenter / Rundown** — load + rundown tasks.
- Primary action: open the next graphic to source.

### Navigation
**Hybrid: persistent left sidebar on desktop + a thin top context bar.** The sidebar renders only the role's permitted routes (filtered from the same RBAC that gates data). Daniel sees grouped sections (Pipeline / Crew / Distribution / System); Myriam and interns see a short flat list, so a 3-link nav never looks like a stripped-down version of Daniel's.

**Mobile: a fixed bottom tab bar** of the role's top four or five destinations, thumb-reachable, with overflow in a "More" sheet. This matters: your current `nav.tsx` is one top bar of 8 text links that wraps and overflows below ~500px, and crew approve from phones. First nav change: split into `hidden md:flex` desktop bar plus a `md:hidden` bottom tab bar with 48px targets; move Toolkit, Guests, Workflow, Upload into a vaul "More" sheet.

### One page template (so it all feels like one product)
1. **Header zone** — page title + one-line purpose; role avatar top-right.
2. **Context bar** — active-episode selector + breadcrumb + status pills, persistent across pages so "which episode" is never ambiguous.
3. **Primary content** — cards/table/queue; single column on mobile, responsive grid on desktop.
4. **Action zone** — the primary action as a fixed bottom-right button (full-width sticky on mobile). Irreversible/live actions (any `/api/import`, ProPresenter push) carry the mandated Type-YES confirm here.

---

## 5. The high-value screens (purpose-built, not generic)

These are the screens where clever components earn their keep. Full build notes in `COMPONENT-CATALOG.md`; visuals in the mockup.

**Episode pipeline rail.** A horizontal segmented chain: Script -> Extract -> Lower-thirds -> Approve -> Upload -> Distribute. Current stage filled gold, done stages checked green, blocked amber. "Where is this episode" in one glance, zero prose. On the dark theme it doubles as the constellation motif.

**Graphics Tracker, Master view.** Five stacked show cards, one per show of the month. Each is a single horizontal band: show + air date, then **one segmented progress bar** (gray/blue/amber/green for the four statuses) and a big fraction ("31 / 44 ready"), then a per-segment chip row where a chip turns red at 0-done, amber partial, green complete. Spotting a bottleneck: scan the left edge for the grayest bar, then its red chip. Color does the work.

**Graphics Tracker, single show.** A dense table (not a board) that matches Daniel's Google Sheet exactly (Segment | Graphic # | Type | Description | Status | Assigned To | Notes) so interns learn nothing new. Inline-editable status pill and assignee picker, an Approve-idea toggle at row-left that locks design until approved, source-shortcut icons that appear only on B-roll/Picture/Article rows, and the **ProPresenter Push** action that stays disabled until status is Created and a filename is entered, then lights up as a clearly human-only, confirm-gated button (David Rule).

**Lower-thirds review card.** A row-card per beat that visually echoes an on-air bar (gold left rail). Beat chip, a color-keyed `l3_type` pill, and the three variations (Primary / Var 1 / Var 2) stacked as selectable rows in a tracked ALL-CAPS face. Each variation has a live **character-count meter**: a 2px bar that fills toward 65 with a marked good band, **amber under 55, green 55 to 65, red and blocked over 65** (the over-65 variation cannot be the chosen one and blocks Send). Regenerate calls `/api/regenerate`, gets 3 variations in one call, shows all three with their meters; pick one. Keyboard flow: 1/2/3 pick a variation, A approve and advance, R reject, G regenerate, Enter = approve and next.

**Side-by-side script + highlight.** Script left, the beat's anchor line highlighted (gold band, auto-scrolled into view); variation deck right. Bidirectional: selecting a card scrolls the script, clicking a highlight selects the card. On mobile it stacks into a swipeable two-pane strip with a "jump to highlight" pill.

**Distribution board.** A responsive grid of platform cards for the established stack (YouTube, Rumble, Fireside/Transistor, Genesis Science Network, Real Life Network, StreamHoster, Dropbox, Social clip). Each card: identity + what it carries, an Auto vs Manual badge, a status pill (pending/ready/in-progress/done/failed), last action, and the per-platform requirement chips surfaced before action (RLN: 1200x1800 thumbnail, -20 LKFS; YouTube: category 28, private until audit). Auto cards self-resolve; Manual cards open a guided checklist drawer and only allow "Mark done" once every required chip is checked. Every outward, irreversible publish routes through the Type-YES gate (David Rule: the board surfaces Ready, the human ships).

---

## 6. Motion and delight (stunning, but calm)

Purposeful only, fast (feedback 150 to 200ms, entrances 250 to 350ms), and `prefers-reduced-motion` is a hard rule. Routine actions get quiet feedback; save the "wonder" beats for genuine wins so they stay rare (important for an ADHD user).

- Status pill color crossfade; approve = card lifts 2px, gold-to-green check draws in, settles into the approved list; reject = desaturate + slide out.
- Number count-ups on stat tiles (only when the value changes).
- Progress-ring fill on import/extract jobs (doubles as the cosmic orbit motif).
- Skeletons crossfade into content (matching layout, no shift).
- Native View Transitions for route changes (200ms crossfade, zero JS).
- Signature moments, used sparingly, at most one visible per screen: the **ambient starfield** (dark theme only), the **broadcast lower-third slide-in** when a graphic preview appears, and the **scripture-tick divider** that fills left-to-right once on reveal.

Implementation: `tw-animate-css` is already installed for entrances and skeletons (no new dep). Add **Motion** only for shared-layout/presence (approve-reject reflow, count-ups, rings). Wrap the app in `<MotionConfig reducedMotion="user">` and add the reduced-motion CSS safety net to `globals.css`.

**Anti-patterns:** looping/infinite animation on data (pulsing tiles, bouncing arrows), motion that blocks a click, row-by-row stagger on every render, parallax, confetti on routine saves, animating `box-shadow`/`width`/`top`/`filter`.

---

## 7. Accessibility and microcopy guardrails (non-negotiable)

- Text contrast 4.5:1 (3:1 for large text); UI components and focus rings 3:1; visible 2px focus ring everywhere (the gold glow); tap targets 24px minimum, 44px on mobile; status never by color alone; honor reduced-motion.
- Plain English, action-first labels, no jargon, **no em dashes**. Errors lead with the fix.

Microcopy, before and after:
| Before | After |
|---|---|
| "Import failed: 422 Unprocessable Entity" | "Couldn't import. 3 episodes are missing a title. Fix those and run the check again." |
| "No records found." | "No graphics yet. Import a script to start tracking lower thirds." + button "Import a script" |
| "Are you sure you want to proceed?" | "Approve these 12 lower thirds? They move to the Ready list." Buttons: "Approve 12" / "Cancel" |
| "Submit" | "Save guest" / "Run check" / "Send to ProPresenter (test)" |
| "Operation completed successfully." | "Done. 12 lower thirds approved." with an "Undo" link |

### Ten-item per-page self-audit
1. Exactly one obvious primary action? 2. Five or fewer primary items? 3. One H1, consistent placement of title/action/status? 4. Text 4.5:1, controls/focus 3:1, both themes? 5. Visible focus ring, keyboard order logical? 6. Targets 24px (44px mobile), non-overlapping? 7. Status uses icon + text, not color alone? 8. Respects reduced-motion, no autoplay? 9. Plain-English, action-first copy, no jargon, no em dashes, errors lead with the fix? 10. Helpful empty state with a next step, and undo/confirm on anything irreversible?

---

## 8. Recommended build order (anti-churn: named deliverables)

This is a strategy doc, so per the Anti-Churn Rule these are proposed deliverables, not a started build. Sequenced for ROI:

1. **The brand skin** (ship: gold + cosmos tokens in `globals.css`, Saira heading font, gold focus ring, the dark theme). Smallest change, biggest visible payoff. Touches one file.
2. **The nav fix** (ship: desktop sidebar/top bar + mobile bottom tab bar + "More" sheet). Unblocks mobile.
3. **The one page template + role-scoped landing pages** (ship: Daniel's owner dashboard first, the four-card layout).
4. **The lower-thirds review workspace** (ship: the variation card + char meter + regenerate + Type-YES gate). Canon notes `/lower-thirds/[episode_id]` is currently unreachable and the existing workspace has a weak (one-click) import gate; this fixes both.
5. **The Graphics Tracker** (ship: single-show dense table first, then the Master 5-show glance bars). ProPresenter Push ships as a lit-up, confirm-gated shell; wire the action after the slide/playlist mapping is defined with Daniel at his computer.
6. **The Distribution board** (ship: per-episode platform cards + Type-YES publish gate). Daniel's biggest time-saver.

Each step is independently shippable and leaves the app better than before.
</content>
</invoke>
