# Session 2 Report - Prototypes of the top three concepts

**Date:** 2026-06-08
**Built:** three self-contained, mobile-friendly, violet/black HTML prototypes in `../prototypes/`, all sharing one mock batch of 5 June episodes so they are directly comparable. All three pass `node --check` on their inline JS. Open `prototypes/index.html` to launch them.

The two tests applied to each:
- **5-second test:** can you answer "where am I in the cycle / what needs me" in one glance, cold?
- **Sparse-data test:** with today's real data (only episodes + guests populated, status stale), does it look calm and intentional rather than broken?

---

## 1. Mission Control (`mission-control.html`)
A launch board: 5 vehicles, T-minus clocks, a flight-plan timeline, go/no-go systems boards, and a liftoff when you publish.
- **5-second test: PASS (strongest of the three).** The master countdown answers "what is next" and the Range answers "what needs me" before any detail loads. The single NEEDS YOU capsule (Show 3) is the brightest thing; the two at-risk shows carry red edges. Status is always glyph + text, never color alone.
- **Sparse-data test: PASS.** Empty subsystems read as neutral STANDBY; a planned show (Show 5) still shows a valid phase; graphics show as "22/30" sublabels, not a gauge wall. Never an error state.
- **Wow:** clicking GO runs a ~700ms ignition (reduced-motion safe) and slides the vehicle into an "In Orbit / Aired" shelf, clearing its Needs You items. The go/no-go poll is a natural home for the real "Type YES" approval gates.
- **Honest gap:** the flight-plan trailing positions are illustrative (hardcoded percentages), not yet computed from real dates.
- **Read:** the most operational and the calmest under pressure. Best fit for "I need to know what to do today."

## 2. Ambient Instrument (`ambient-instrument.html`)
One breathing orbital watchface: angle = stage, color = health, motion = urgency, comet tail = needs-me, with a monospace truth-line and tap-for-detail.
- **5-second test: PARTIAL PASS.** The alarm states read instantly across a room (one coral fast-pulsing orb + one comet tail), which is exactly the ADHD win. But exact stage is encoded in angle with small labels, so reading precise position from afar leans on label legibility; the bottom status line and tap cards carry the exact truth.
- **Sparse-data test: PASS (best of the three).** Degrades into a quiet cosmos: a dim "Guest TBC" orb plus a dashed unlit orbit say "room for an episode" with zero error states.
- **Wow:** the physics change with state. A healthy batch settles into a serene balanced orbit; an at-risk episode visibly destabilizes. It is the most beautiful and the best on a phone / lock-screen / watch.
- **Honest gap (per the agent): the biggest abstraction risk of the three.** Health is a hand-authored scalar here, not a real progress-vs-deadline computation, and two orbs at the same stage can look ambiguous. The metaphor trades precision for feeling, so the exact layer must always back it.
- **Read:** the most distinctive and the calmest to live with; the one to use as an ambient/peripheral view, paired with a precise screen for real work.

## 3. Broadcast Surface (`broadcast-surface.html`)
A modern vision-mixer console: a program bus of 5 sources with tally lights, a signal-flow lane, a transport bar for the month.
- **5-second test: PASS.** Tally semantics do the work: the on-air show is red, on-deck green, needs-you amber, idle dim. One glance reads the bus. (Committed and validated first; see the file.)
- **Sparse-data test: PASS.** Parked/empty sources render as a calm "powered-on console at rest," not an error.
- **Wow:** the on-air source glows red with a soft pulse and an "ON AIR" sign lights the corner, so on air day the room is lit by the show going out now. The most literally on-brand (GSR is a TV show).
- **Honest gap:** the tally metaphor is fast to read but carries the least episode-internal detail on the surface itself (detail lives a click in).
- **Read:** the most native to a TV operation and a very fast glance; slightly more "tool," less "art," than the other two.

---

## Lead recommendation for Session 3
All three clear the bar; they serve different moods. The strongest pairing for GSR is likely **Mission Control as the working home view** (calm, operational, go/no-go maps to real gates) with the **Ambient Instrument as the ambient/mobile/lock-screen companion** (the thing you glance at from the couch). Broadcast Surface is the strong third if Daniel wants the most TV-native feel.

**Next action (Session 3):** get Daniel's gut reaction to the three, then do precedent teardowns + a real data-binding pass (compute stage and deadlines from actual Supabase fields so the timeline/health stop being illustrative) for the one or two he favors, and prototype the chosen wow moment with real reduced-motion handling. Log the choice in `SESSION-LOG.md`.
