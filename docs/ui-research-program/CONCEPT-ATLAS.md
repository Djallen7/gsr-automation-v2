# GSR Dashboard Concept Atlas

**Session 1 output.** Eight radically different design paradigms for the GSR production dashboard, each a distinct EXPERIENCE rather than a variation on a card grid. Each was researched against real-world precedent (product docs, Awwwards/Dribbble/CodePen, community threads, YouTube talks). The brief: violet + black, masculine, cosmic/science/broadcast, for an ADHD non-developer whose north star is "open it any day and instantly know where I am in the monthly cycle of 5 episodes."

All eight share one spine: 5 episodes, six stages (planned, in_prep, shot, in_post, scheduled, aired), three deadlines (shoot day, YouTube Mon, TV Tue). They differ in the organizing metaphor and the felt experience. Full agent reports and sources are in `dossiers/` and `SOURCES-LEDGER.md`.

---

## 1. THE ORRERY (astronomical instrument)
A working brass-and-violet orrery in deep space. The month is the sun; the 5 episodes are planets; stages are concentric orbital rings; the episode spirals inward toward "aired." **Where am I:** radius = stage, so a glance reads the batch as a cluster converging on air; a straggler on the outer ring is the obvious problem. **Wow:** when an episode advances, its planet spirals inward one ring with Keplerian easing; at month's end all 5 fall into the sun and a fresh batch is flung out. **Risk:** radial encodings lose to linear for precision, so it is paired with an exact "ephemeris" table; angle carries no data (radius only). **Best for:** a single owner reading state; a beautiful daily ritual. Deeply on-brand.

## 2. THE BROADCAST CONTROL SURFACE
A refined master-control console. The 5 episodes are sources on a program bus with real tally lights; stages are signal flow; a transport bar is the month timeline with the deadlines as cue points. **Where am I:** tally semantics borrowed from ATEM (red = on air, green = on deck, amber = needs you). **Wow:** a true on-air tally for the episode currently airing, so on a Monday the whole console is lit by the show going out right now. **Risk:** broadcast jargon and skeuomorphic kitsch; mitigated by plain-English labels and flat "grammar not texture" styling. **Best for:** the most literally on-brand option (GSR is a TV show); maps the 5-episode batch to a 5-source bus perfectly.

## 3. THE NEWSROOM BROADSHEET (living front page)
The dashboard as the front page of your own newspaper, set to press today. Masthead, one lead story (the episode that most needs you), a column grid for the rest, a run-of-show rundown rail, a deadline ticker. Type IS the interface. **Where am I:** front-page hierarchy is the status language; the lead headline plus the ticker tell the whole month. Stage = kicker; deadline = ticker; needs-me = byline. **Wow:** "putting the issue to bed" — one keystroke flips the live page into a printed-edition state with a press stamp (GO / HOLD). **Risk:** becoming a text wall (solved with fragments, not prose) and looking empty at 5 items (solved by the "quiet edition" degradation). **Best for:** GSR is a news show, so masthead/rundown/ticker are literal; Daniel already lives in Rundown Creator.

## 4. THE SPATIAL STAR-MAP CANVAS
An infinite, zoomable star chart (Figma/tldraw meets a planetarium). The month is a nebula; the 5 episodes are star systems you fly between; drilling in is literally zooming (galaxy to system to surface) via semantic zoom. Position becomes memory. **Where am I:** the galaxy view shows 5 orbs (color = stage, ring = deadline, pulse = needs-me) read in two seconds; a minimap and a one-press Home prevent getting lost. **Wow:** on shoot morning the camera auto-flies into that episode and draws a comet trail through the day's path. **Risk:** the classic "lost in space" failure, and the honest weakness is mobile (no one has solved canvas on phones; mobile becomes the minimap promoted to the whole UI). **Best for:** highest ceiling, highest build cost; prototype the galaxy view alone first.

## 5. THE COMMAND DECK (TUI-inspired)
A keyboard-first, monospace ops console in the spirit of lazygit/k9s/Superhuman, but driven by a natural-language intent bar, not bash, so a non-coder feels fast, not intimidated. Fixed panels give spatial muscle memory; a live status panel reads the batch like htop. **Where am I:** the status panel shows 5 episodes with progress bars, plain-English deadlines, and the one "needs me" item rendered as the brightest thing on screen. **Wow:** type "where am I" and the deck prints a three-line spoken-style briefing and offers to jump you to the single next action. **Risk:** monospace can read "developer tool"; the natural-language layer plus on-focus suggestions keep it non-intimidating and it degrades to a menu, never a dead end. **Best for:** speed and single-focus; strong ADHD fit (it names the one next move).

## 6. THE AMBIENT INSTRUMENT (living watchface)
Calm-tech: one slow-breathing generative visualization that IS the dashboard, like a watch complication or a weather hero. Five orbs orbit a now-line; angular position = stage, color = health, motion = urgency, a comet tail = needs-me. **Where am I:** read pre-attentively from across the room before you consciously read anything; a thin monospace line ("3 in post, 1 at risk, 2 need you") is the exact backstop, and tapping any orb gives precise detail. **Wow:** the physics of the art changes with the show's state — a healthy batch settles into a serene balanced orbit; an at-risk episode visibly destabilizes (reddens, speeds up, throws a tail). **Risk:** too abstract to act on (mitigated by the tap-for-exact layer and honest data-to-visual mapping). **Best for:** mobile, lock-screen widgets, and an Apple Watch complication; the calmest option.

## 7. MISSION CONTROL (flight-deck telemetry)
A launch range: each episode is a vehicle counting down to its launches (shoot, YouTube Mon, TV Tue); stages are flight phases; your approval gates are go/no-go polls. Three layers: the Range (5 capsules with T-minus clocks), the Flight Plan (timeline with the deadlines as ignition lines), and the Pad (a vehicle's systems-status board). **Where am I:** one calm row of T-minus clocks; green nominal, amber needs-me, red past-margin. **Wow:** clicking GO on a final gate runs a restrained ignition and the vehicle lifts off into an "Aired / In Orbit" shelf — one earned dopamine payoff per published episode. **Risk:** metaphor strain and retro-futurism kitsch; use only the clean mappings (T-minus, phase, go/no-go) in modern flat styling. **Best for:** a space-science show; the go/no-go poll is a natural home for GSR's existing "Type YES" approval gates.

## 8. SIGNAL / SPECTRUM
A calibrated instrument panel. The 5 episodes are five live traces on one multi-trace scope; progress is signal strength; a sweep bar is the deadline beam; at-risk shows as noise/jitter; needs-me lights a VU-style peak indicator. **Where am I:** read level and motion, not text — which traces are above, at, or trailing the sweep. **Wow:** click a channel and it expands into a persistence spectrogram/waterfall of that episode's whole history, with hot color where time pooled (a "spectral fingerprint," tying to the "heavens declare" spectroscopy idea). **Risk:** spectacle over precision (mitigated by mandatory numeric labels and a real deadline graticule; motion limited to the single sweep). **Best for:** broadcast-signal language is literally GSR's domain; reads premium and masculine.

---

## Comparison (lead's read)

| Concept | Distinctiveness | "Where am I" speed | ADHD-calm | On-brand | Build cost | Mobile |
|---|---|---|---|---|---|---|
| Orrery | very high | high (after learn) | high | very high | high | table-first |
| Broadcast Surface | high | very high | high | highest | medium | strong |
| Newsroom Broadsheet | high | high | medium-high | very high (news) | medium | strong |
| Star-Map Canvas | very high | high | medium | high | very high | weak |
| Command Deck | high | very high | high | medium | medium | strong |
| Ambient Instrument | very high | very high (gestalt) | very high | very high | medium | strongest |
| Mission Control | high | very high | high | very high (space) | medium-high | strong |
| Signal/Spectrum | high | high | medium-high | high | medium-high | medium |

## Recommendation for Session 2
Prototype the **three** with the best blend of distinctiveness, glance-speed, and buildability into live violet/black HTML mockups, then pressure-test them on the 5-second test and sparse-data behavior:
1. **Ambient Instrument** (calmest, best mobile/widget, most novel, strong glance).
2. **Mission Control** (on-brand, the go/no-go maps to real gates, earned wow).
3. **Broadcast Control Surface** (most literally GSR, fastest read) OR **Orrery** (most beautiful daily ritual).

These are deliberately far from the earlier safe, Linear-style direction. The point of Sessions 2+ is to build them enough to feel, not just read about.
