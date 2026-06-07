# GSR Dashboard UI Strategy (v2: Violet/Black, Monthly Cycle)

**Date:** 2026-06-07
**For:** Daniel Allen
**Method:** A fresh research-and-design effort, 5 teams of 6 agents (30 total): Pipeline Discovery, Brand (violet/black), Dashboard Inspiration, Custom-Element Invention, and Synthesis/Validation. Grounded in the repo and real web research; the prior navy/gold package in `docs/ui-design/` is superseded.
**Companion files:** `COMPONENT-CATALOG-V2.md`, `SOURCES-V2.md`, `gsr-dashboard-v2.html` (the violet/black mockup, mobile-friendly, with a 3-direction comparison).

---

## 0. The brief, restated

You operate on a **monthly cycle** with **5 episodes in pre-production at once**, and the dashboard must let you **open it any day and instantly know where you are in the cycle**. It has to be tuned to your work, sleek, not overwhelming, with custom UI elements that show a lot in a little space. Brand is **violet and black, and it must not read feminine**. Everything below is grounded in research and pulled from how the best teams (Linear, Vercel, Stripe, Sentry, Frame.io, Basecamp, status-page tools) actually build.

The honest north-star answer the whole team converged on: a stunning, non-generic result comes from three things working together. A **distinct violet-black skin** with Linear-grade restraint. A **monthly-cycle spine** that organizes everything around your batch of 5. And a **small set of custom components** that each carry a lot of meaning in a tiny footprint. The mockup proves it.

---

## 1. The spine: your monthly cycle of 5

This is the organizing idea of the entire product. One cycle = the lifespan of one monthly batch of 5 episodes (Show 1 to Show 5), each carrying a stage: `planned -> in_prep -> shot -> in_post -> scheduled -> aired`.

- **The shoot collapses the batch, post and air spread it.** Early cycle, all 5 sit in prep. The shoot day(s) snap all 5 to `shot` at once. Then they fan out as editing and weekly air dates stagger them. The dashboard should expect a tight cluster at the shoot and a widening spread afterward.
- **Cycle progress** is a real, computable number: treat each stage as an ordinal 0 to 5, then `cycle % = sum of the 5 stages / 25`. Pair it with the status histogram ("2 aired, 1 scheduled, 2 in post") and the min/max stage so you see both the laggard and the leader.
- **The deadlines that drive "today":** the shoot day (the cycle's center of gravity), **YouTube publish Monday 4pm ET**, **TV air Tuesday 8pm CST**. "Today" = the soonest unmet milestone across the 5, as a countdown. Overdue is the alarm condition.
- **Cycles are grouped by air-date month** (the `production_month` airing cycle, not the calendar shoot month, since overflow shoots spill across months).

---

## 2. The data reality (this shapes everything)

A live read of the schema found the uncomfortable truth the design must respect: **only `episodes` (48) and `guests` (175) hold real data.** Graphics, distributions, shoot_sessions, episode_guests are all 0 rows, and `production_status` is **stale** (every episode still reads `planned`, even ones already on YouTube). There is no per-episode assignee column and no tasks table.

So the design rule is: **derive stage from signals, never trust the stale status field, and make empty states look intentional.**

- Derive stage: `youtube_url` present or `air_date` past => aired; `youtube_scheduled_publish_at` present or air within 7 days => scheduled; `shoot_date` past => in_post; `shoot_date` future => in_prep; else planned. This gives believable stages for all 48 episodes today and self-updates as dates pass, with zero manual status churn.
- Real readiness today comes from columns that are actually populated: `youtube_url`, `rumble_url`, `podcast_url` (a real 3-of-N distribution chip), and the legacy `guest_name` (a real "has a guest" signal) until `episode_guests` fills.
- Everything else (graphics counts, per-platform distribution, the 14-step checklist) renders as a labeled "not tracking yet" affordance, never a red zero.

A one-file view, `v_episode_cycle_status`, does all the derivation and cycle grouping with no schema change. Full phased plan in section 7.

---

## 3. The distinct look: violet + black, masculine

The single most important rule, confirmed by studying Linear, Sentry, Vercel, Discord, and Twitch: **what keeps violet from reading feminine is hue discipline, saturation, restraint, and sharp geometry, not the color itself.**

### Color system (OKLCH, drops into Tailwind v4)

Dark is the hero. Violet is **rationed to interactive signals only** (CTAs, links, focus rings, the active item, the "you are here" marker). Roughly 90% of the screen stays neutral.

```
/* Dark (hero) - violet-tinted near-black, NOT pure black */
--background  oklch(0.16 0.018 287)   /* near-black, faint violet bias */
--surface     oklch(0.19 0.022 287)   /* card */
--surface-2   oklch(0.23 0.028 287)   /* raised / active row */
--border      oklch(0.30 0.02 287)    /* 1px hairline */
--foreground  oklch(0.95 0.008 287)   /* off-white, not pure white */
--muted-fg    oklch(0.70 0.018 287)
--primary     oklch(0.62 0.19 287)    /* indigo-edge violet, the brand */
--primary-hi  oklch(0.67 0.20 287)    /* hover */
--ring        oklch(0.62 0.19 287)
/* status hues live FAR from violet so none reads as a violet tint or as clickable */
--success     oklch(0.72 0.16 150)    /* green */
--warning     oklch(0.80 0.14 85)     /* amber (the only warm, used sparingly) */
--danger      oklch(0.64 0.20 25)     /* red-orange */
--info        oklch(0.72 0.13 210)    /* cyan */
```

A light theme keeps the same hue identity and only flips lightness (primary deepens to ~`oklch(0.52 0.21 287)` for AA on white).

### The rules that keep violet masculine
1. **Hue 278 to 290 (indigo-edge).** Past ~305 toward magenta/orchid is where feminine lives. Never go there for the brand.
2. **Saturated, not pastel.** Chroma 0.18 to 0.21 at mid lightness. Lavender = low chroma + high lightness; that is the trap.
3. **Pair only with near-black and cool slate**, never warm beige or blush.
4. **Ration it (60-30-10).** Most of the UI is monochrome; violet is the single chromatic voice for brand and action; cyan is a rare spark.
5. **Sharp geometry.** Small radii, 1px hairlines, tight tracking. Soft pills + heavy glow + bubbly cards pull toward cutesy.

### Type, material, motifs
- **Type:** Space Grotesk (display, squared, control-room), Inter (body/UI), JetBrains Mono (IDs, counts, timecodes). **Tabular numerals everywhere data moves** so numbers do not jitter. Uppercase 11px micro-labels are the single biggest "instrument-panel" signal.
- **Material:** depth from **lightness elevation + hairline borders** (the workhorses), one **fixed violet radial glow** behind the header, and a near-invisible **grain** layer to kill banding. Glassmorphism only on one floating element (the command palette). No per-card glow.
- **Motifs (subtle, behind the data):** a faint **observatory grid**, a **broadcast lower-third bar** for headers (literally on-brand, you make lower thirds), and **spectral/waveform ticks** as accents. A minimal starfield is for the login screen only. Avoid nebulae, lens flares, devotional clip-art.

---

## 4. Three design directions (your options)

The team specced three distinct directions so you can choose a feel. All share the same spine, brand, data logic, and component kit; they differ in the hero and the organizing metaphor.

### Direction A: "Command Deck" (recommended)
A calm status-page for your month. **One master verdict line** at the top ("Cycle 06 is on track, next gate: YouTube Mon 4pm") over a quiet 5-row episode health list. When something needs you, the line becomes a count and the relevant rows **re-rank to the top and brighten, nothing is added**. A "Needs You" lane shows only your gates (approve ideas, approve lower thirds, confirm rundown, trigger distribution); other people's work is dimmed or hidden.
- **Strength:** answers "where am I" in one sentence, before you read anything. Calmest, most ADHD-friendly, degrades best on sparse data, easiest to make accessible.
- **Weakness:** deep per-episode work lives on drill-in pages, not the home view. The derivation math must be visible on hover so you trust the green dot.

### Direction B: "Pipeline Rail"
Process-first. The hero is a **5-lane horizontal rail**, one lane per show, sharing a left-to-right stage axis, with a vertical "today / on-pace" line so lead and lag read as a **broken diagonal**. The whole app is a spatial zoom: cycle -> episode -> segment -> row. Clicking a lane expands its readiness in place.
- **Strength:** once a cycle is genuinely in motion with real data, the broken diagonal makes "which show is behind" pre-attentive. Best at showing flow and bottlenecks.
- **Weakness:** asks you to parse a spatial metaphor every visit, and a half-drawn rail on today's sparse data reads as "broken," not "early." Best deferred to a `/pipeline` deep-dive page for later.

### Direction C: "Cycle Observatory"
Rhythm-first and the most distinctive. The hero is a **month dial**: a near-black ring is the month, a violet sweep hand is today, 5 episode pucks sit on the ring at their air dates, each a 6-segment micro-arc that fills as the show advances; the center reads the next milestone and countdown.
- **Strength:** the most beautiful and on-brand, the strongest "where in the month" feel, the cosmic motifs earn their place by encoding data.
- **Weakness:** the honest risk is pretty-over-legible. Angles and small arcs are slow to read and hard for low vision; a sweep hand implies live motion you do not have. It demos well and can live poorly.

### The recommendation: A, with one borrowed element from C, B deferred
Ship **Command Deck** as the core. Borrow **a small, static, text-labeled cycle ribbon** from C (a thin 5-segment month bar showing the current show and days left) for rhythm, but **not the dial**. Defer the full **Pipeline Rail** to a `/pipeline` deep-dive once per-segment data exists. This passes the 5-second test on a bad day with bad data, stays calm for an ADHD owner, and is the cleanest to make WCAG-compliant. The mockup is built as this hybrid, and also lets you flip the hero to B and C so you can feel the difference.

---

## 5. The custom components (what makes it non-generic)

Full build notes in `COMPONENT-CATALOG-V2.md`; visuals in the mockup. The signature pieces:

- **Master verdict line + Needs-You lane.** One sentence, one implied action; a lane of only your gates with one-tap deep links; a calm empty state ("Nothing needs you. The batch is moving.") that feels like a reward.
- **5-row episode health list (the hero).** Each row: identity + guest, a 6-segment stage track (current segment is the only violet), four readiness cells (graphics / lower-thirds / guests / distribution as status chips), a schedule-health ring, and an avatar when blocked on a person. Re-ranks under stress, never piles up.
- **Static cycle ribbon.** A thin 5-segment month bar, current phase filled, "Day 12 of 30, 1 day to YouTube." Rhythm without a clock to read.
- **The status system.** One `StatusChip {domain, state, health, blockedBy}`: glyph (shape) + label + color, so a meaning reads in grayscale. Schedule health is a separate layer (ring style: none / dashed / solid + clock), never a new color. Blocked-on-person is an avatar + badge, distinct from behind-schedule. Motion only on transitions; failed and overdue never pulse.
- **The micro-widget kit.** ProgressRing, FractionMeter ("22/30"), SegmentedBar, Sparkline, BulletGraph, StatusBeacon, CountdownPill, HeatStrip, and the GSR-specific **CharCountMeter** (the lower-thirds 55 to 65 band). All on a 4px grid, tabular numerals, violet only for the active element.
- **Navigation.** A slim role-filtered left rail (what app area) + a persistent **Context Bar** (Cycle > Episode > Segment, the zoom) + **Cmd-K** (teleport to any episode/guest/graphic and run actions). A cycle progress chip is the constant compass. Mobile: bottom tab bar + a tappable Context Pill that opens a drill-in sheet.

---

## 6. Principles and guardrails (so it stays calm and accessible)

From the inspiration, ADHD, and accessibility research:

1. **One primary action per screen**, one bold number, one verdict sentence. No hedging paragraphs.
2. **Re-rank, never add.** A calm month looks calm; a busy one self-prioritizes by reordering and brightening the same elements.
3. **Three states max on the home view:** Needs You / On Track / No Data. Treat **stale as "No Data," never green** (the real trap today).
4. **Stable spatial order by default**, so ADHD spatial memory holds; only float an item up when it has a real attention reason, and animate that only if reduced-motion is off.
5. **Violet for fills, borders, and accents only; text stays near-white at 4.5:1.** Status never by color alone (always glyph + label). Focus ring is a high-contrast neutral or cyan, 2px, visible.
6. **Near-black, not pure black** (L ~0.16) to avoid halation and violet vibration. Desaturate large violet areas; keep saturated violet under ~10% of the screen.
7. **Hide other people's work** from your view; surface it only when it is blocked on you.
8. **Respect prefers-reduced-motion** as a hard rule; nothing loops on data.

Microcopy stays plain, action-first, no jargon, no em dashes. Errors lead with the fix. Empty states name the next step.

---

## 7. Build reality and phased plan (anti-churn: named deliverables)

This is a strategy. Per the Anti-Churn Rule, these are proposed, sequenced deliverables, each independently shippable.

- **Phase 1, "Cycle Status, Live" (ships now):** the `v_episode_cycle_status` view (derived stage + cycle grouping + real readiness booleans) plus the Command Deck home rendering real data on all 48 episodes today, the 3 real distribution chips, and a null-based "needs me" gate. Deliverable: an honest, working home view.
- **Phase 2, "Ownership and Gate":** add an `episodes.assignee` column so "needs ME" filters by user, and a cycle owner on the hero.
- **Phase 3, "Checklist Progress":** add an `episode_tasks` table (seeded from the config 14-step checklist) for real per-episode readiness percentages and the deferred Pipeline Rail.
- **Phase 4, "Live Distribution and Graphics":** as the graphics and distributions tables populate from the real workflow, the platform board and graphics tracker switch from skeleton to live, reaching full Command Deck (and optional Observatory) fidelity.

**Component shopping list:** add shadcn `card, badge, tabs, progress, tooltip, hover-card, skeleton, separator, scroll-area, command`. Adopt **cmdk** (palette), **vaul** (mobile drawers), and **motion** (sparingly, transitions only). Adopt **TanStack Table** when the full 48-episode grid lands. Skip **Tremor** until Phase 4 (no real metrics yet; shadcn charts cover later needs).

The brand skin (violet/black tokens, Space Grotesk, gold-free) is the smallest change with the biggest visible payoff and is the right first commit.
