# ADR-0013: Mission Control = Adopt Built-ins + Extend Lanes (No Parallel Tracker)

**Date:** 2026-06-11
**Status:** Accepted (decided under Daniel's lead-agent directive, canon 2026-06-11)
**Relates to:** ADR-0012 (Supabase + Next.js architecture of record)

---

## Context

Daniel runs 5-10 parallel Claude Code sessions and has no single view of what each is
doing (the named pain in the Fable 5 mission, answers 11A + 12B). The 2026-06-11
verification swarm checked the official tooling and five third-party candidates against
current reality (claim ledger CL-010 through CL-017, CL-030, CL-035). Two findings
changed the picture from the mission doc's first guess: ccusage removed its live monitor
in v18 (burn rate survives only in `blocks --active` output), and the official Agent View
covers most of the need but only shows sessions after they are backgrounded.

## Decision

**Adopt, zero build:**
- **Agent View** (`claude agents`, built in since v2.1.139) as the live layer, plus the
  small habit of backgrounding working sessions (`/bg` or left-arrow) so they register.
- **ccusage** (`npx ccusage@latest`) as the weekly cost lens, not a live monitor (CL-013).
- **claude-devtools** (brew cask, MIT, zero outbound network per its SECURITY.md) for
  after-the-fact session forensics (CL-010).

**Extend, one small build (plan items 2.1 + 2.2):**
- `tools/sessions_snapshot.mjs` on the Mac merges `claude agents --json` with the Agent
  SDK session list (which already carries per-session summaries) into
  `docs/_handoff/sessions-snapshot.json`.
- `tools/build_lanes.mjs` renders that snapshot as a sessions panel in `lanes.html`, the
  phone view Daniel already trusts. Shipped 2026-06-11.

**Skip:** claude-squad (AGPL launcher that only tracks sessions it starts; its `autoyes`
auto-accept mode conflicts with the David Rule, CL-014) and the builderz-labs
mission-control platform (replaces the workflow instead of extending lanes; anti-churn,
CL-017).

**Watch (amended 2026-06-12):** c9watch is now the named fallback if the /bg habit
fails: MIT, no telemetry, OS-level auto-discovery of ALL sessions including interactive
ones (CL-220/CL-221, verified against the repo). claude-view drops to second fallback
(telemetry-on-by-default, CL-016). Still watching: claude-code-log (CL-011),
claude-self-reflect (passed install-safety, solves memory not oversight, CL-012/CL-038). The ergut remote transcript
MCP is deferred separately (canon, 2026-06-11): the Mac pull makes it redundant unless
coverage falls under ~60%.

## Consequences

- One tracker (lanes) stays the single shared brain; sessions appear next to lanes, not
  in a second app. No new always-on service, no new credentials.
- The live layer depends on the backgrounding habit; if that fails in practice, claude-view
  is the named fallback (with telemetry disabled) rather than a new build.
- `cleanupPeriodDays: 90` must be set on the Mac so session history survives long enough
  to analyze (CL-008; applied by the Mac setup prompt).
