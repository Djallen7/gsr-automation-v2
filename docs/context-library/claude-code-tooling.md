# Claude Code tooling & session orchestration

**Load when:** Claude Code capabilities (goals, loops, specialized agent teams, hooks, plan mode,
skills, plugins, MCP servers, output styles), Fable 5 usage patterns, **multi-session management /
continuity tooling**, the capabilities playbook, or any decision to adopt/drop a tool/skill/plugin.
**Authoritative sources:** official Claude Code docs (code.claude.com/docs — verify, never answer from
memory), the `claude-code-guide` agent, `docs/2026-06-11-fable5-pipeline-build-research-prompt.md`, and
`docs/2026-06-11-claude-capabilities-playbook.md` (to be produced by the Fable research phase).

> **This file is the rendezvous for the parallel work tracks.** Any session researching Claude Code
> tooling — including the multi-session-management track Daniel dispatched separately — must append its
> findings HERE so the build session inherits them. Within this repo the INDEX is auto-loaded, so a
> session whose topic touches the triggers above will be routed here automatically. (Cross-repo/
> cross-workspace sessions only converge if they also work in gsr-automation-v2 — note that limit.)

## Open / in-flight
### OPEN — Multi-session management research (companion track)
Daniel runs ~10 concurrent Claude Code/desktop sessions on the GSR web app and loses his place when he
steps away. A separate session is researching a third-party/centralized way for one session to review
the state of all the others. **That session: append findings here** — the tool(s) evaluated, the
keep/skip call, install + security cost, and how the build session should consume it. The Fable build
prompt (§3.6) is told to consume this rather than redo it.

## Entries
### 2026-06-11 — Fable 5 build-and-research prompt created  [status: active]
Decision: `docs/2026-06-11-fable5-pipeline-build-research-prompt.md` is the launch prompt for the
pipeline-autonomy build. Three phases (Research → Build Plan → Autonomous Build), goals/loops/agent
teams encoded inside a hard safe-autonomy boundary (full autonomy on code/branches/tests/read-only
data; human gate on every production write or hardware action). Source protocol weights official docs
above influencer videos. Ends with a question battery for Daniel.
Why: give a Fable session a production-safe way to build the dashboard + adjacent systems with minimal
toil from Daniel.
Source: Daniel (2026-06-11) + built this session
See also: pipeline-and-dashboard.md, working-rules.md

### 2026-06-11 — Safe-autonomy boundary for loops/agent teams  [status: active]
Decision: Claude Code loops/goals/agent teams may run unattended ONLY on the safe surfaces (dashboard
code, branches, dev/branch migrations, tests, research, read-only data); every production write
(trackers, RDC, /api/import, prod DB, ProPresenter/ATEM/Companion, outbound sends) stays a dry-run +
Type-YES human gate. Blanket auto-mode against production paths is rejected — contradicts the David
Rule. Enforce via a PreToolUse hook where possible, not just discipline.
Why: a goal is never an excuse to take an irreversible action on a live system that lands on David.
Source: Daniel (2026-06-11)
See also: infrastructure-and-security.md, working-rules.md