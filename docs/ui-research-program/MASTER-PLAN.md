# GSR Dashboard UI Research Program (Master Plan)

A multi-session, agent-driven research and design program to find a radically different, elegant, intentional UI for the GSR production dashboard. Designed to run across roughly ten ~5-hour work windows ("ticks"), each a fresh session that reloads state from this repo, does the next chunk, stores findings, and hands off. See `AUTOMATION-SETUP.md` for the 5-hour scheduling, `RESUME-PROMPT.md` for what each tick runs, and `SESSION-LOG.md` for live state.

## North star and constraints (do not drift)
- **North star:** open the dashboard any day and instantly know where you are in the monthly cycle of 5 episodes.
- **Owner:** Daniel, ADHD, non-developer, GUI-first, hates jargon, no em dashes.
- **Brand:** violet + black, masculine, cosmic/science/broadcast. Not feminine.
- **Spine:** monthly batch of 5 episodes; stages planned->in_prep->shot->in_post->scheduled->aired; deadlines shoot day, YouTube Mon 4pm ET, TV air Tue 8pm CST.
- **Stack:** Next.js 16, React, shadcn/ui, Tailwind v4, Supabase, Vercel.
- **Mandate from Daniel:** push OUTSIDE the box; do not hug the repo's defaults or a generic dashboard. Multiple distinct directions, each its own experience.

## Thoroughness bar (every agent, every tick)
1. **Cite or label.** Every factual claim carries a real, verified URL; anything else is marked opinion. No fabricated sources. If a source cannot be reached (e.g. Reddit is often blocked to the fetcher), say so and find an equivalent.
2. **Primary sources first.** Product docs, Awwwards/Dribbble/CodePen, real community threads (Reddit/forums), and YouTube talks (summarize what the video actually teaches). At least one community thread and one talk per concept deep-dive.
3. **Answer the brief.** Every concept must answer the north star, respect the brand, and serve an ADHD non-developer. State the honest risk and the sparse-data behavior (today: only `episodes`+`guests` are populated; `production_status` is stale).
4. **No corner-cutting.** If a lead is thin, dig further before concluding. Prefer one well-evidenced finding over five shallow ones.
5. **Store everything.** Append to the right dossier, the Concept Atlas, the Sources Ledger, and the Session Log so research compounds and never repeats.

## Reporting cadence
- After **every agent** returns, append its key findings + verified URLs to its dossier and to `SOURCES-LEDGER.md`.
- At the **end of each tick**, write a session report in `reports/` and a new `SESSION-LOG.md` entry: what was done, key findings, open threads, and the exact next action.
- Cadence tightens over the program: early ticks (broad research) checkpoint per agent; later ticks (prototyping/spec) checkpoint per component so nothing is lost when a window closes.

## Session map (about ten ticks)
- **S1 - Divergent concepts (DONE).** 8 radical paradigms, each researched and written up. Output: `CONCEPT-ATLAS.md`, dossiers.
- **S2 - Prototype the top 3.** Build live violet/black HTML mockups of the three shortlisted concepts; run the 5-second test and sparse-data test on each. Output: 3 mockups + a critique.
- **S3 - Precedent teardowns.** For the shortlist, transcribe specific YouTube talks, pull real community threads (on an unrestricted fetch path), and dissect Awwwards/product case studies into a reusable pattern library. Output: `reports/precedent-teardowns.md`.
- **S4 - Motion and the "wow."** Study and prototype the signature moments (orbit advance, ignition/liftoff, press-check, shoot-day fly-through) with restraint and reduced-motion safety. Output: motion specs + clips/code.
- **S5 - Data binding reality.** Map each surviving concept to real Supabase fields; define the derived views (e.g. `v_episode_cycle_status`); separate buildable-now from later. Output: `reports/data-binding.md`.
- **S6 - Accessibility and ADHD lab.** Contrast/colorblind/motion tests on the violet-black system; first-run learnability of each metaphor. Output: `reports/a11y-adhd.md` + pass/fail.
- **S7 - Mobile, watch, widgets.** Responsive and container-query specs; the ambient/watchface and lock-screen widget studies. Output: mobile specs + mockups.
- **S8 - Brand system finalize.** Violet/black tokens, type, motifs, iconography as a `tokens.css` + Tailwind theme draft. Output: brand kit.
- **S9 - Converge.** Pick one primary + one alternate direction; full component catalog + phased build plan. Output: `reports/recommendation.md`.
- **S10 - Buildable spec and handoff.** Production-ready spec + a reference implementation skeleton + the named first PR. Output: build spec.

## Scope-shift authority
The lead (each tick) may reassign agents, reorder sessions, drop a concept that fails the 5-second or sparse-data test, or promote a surprise finding into its own track, as long as it serves the north star and the program records the decision in `SESSION-LOG.md`. Quality and the brief outrank the plan.

## Stop / pause
Create `docs/ui-research-program/STOP` to halt the loop. Remove it to resume.
