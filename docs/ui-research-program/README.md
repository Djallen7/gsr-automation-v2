# GSR Dashboard UI Research Program

A multi-session, agent-driven program to find a radically different, elegant UI for the GSR production dashboard, run across roughly ten ~5-hour windows. Each window is a fresh session that reloads state from this folder, does the next chunk, stores findings, and hands off, so the work compounds and survives any usage-window reset.

## Read in this order
1. **MASTER-PLAN.md** - the north star, the thoroughness bar, the reporting cadence, the 10-session map, and scope-shift authority.
2. **CONCEPT-ATLAS.md** - the payoff so far: 8 radically different design paradigms from Session 1, each a distinct experience (Orrery, Broadcast Control Surface, Newsroom Broadsheet, Spatial Star-Map Canvas, Command Deck, Ambient Instrument, Mission Control, Signal/Spectrum), with a comparison and a Session-2 recommendation.
3. **SESSION-LOG.md** - live state; the last entry says exactly what the next tick does.
4. **SOURCES-LEDGER.md** - every verified URL with a one-line takeaway.

## Run it across sessions
- **AUTOMATION-SETUP.md** - how to ping a fresh session every 5 hours: a GitHub Actions cron (no phone needed) and/or an iPhone Shortcut, plus honest caveats.
- **RESUME-PROMPT.md** - the exact instruction each tick runs.
- **.github/workflows/ui-research-loop.yml** - the loop (inert until you add a secret and put it on `main`).
- Create a file named **STOP** in this folder to halt the loop.

## How this differs from docs/ui-design and docs/ui-design-v2
Those earlier packages (navy/gold, then violet/black "Command Deck") stayed close to a conventional dashboard. This program throws that out and explores genuinely different experiences, then prototypes and validates them over multiple sessions before recommending one to build.
