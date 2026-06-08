---
description: Pick a GSR work lane and resume it, auto-loading all of its context first.
argument-hint: [optional lane number, name, or keyword]
---

You are resuming a GSR work lane. Follow these steps exactly. Plain English, no em-dashes. Honor the David Rule and never touch production infra (ProPresenter, ATEM, Companion, QNAP, Tailscale).

1. Read `docs/_handoff/lanes.json` (the living lane tracker; it holds each lane's status, summary, done list, to_finish list, blocked_on, files, and resume_prompt). If it is missing, read `docs/_handoff/LANES.md` instead.

2. Choose the lane:
   - If the user passed an argument below, match it to a lane by id, name, or keyword and use that lane.
   - Otherwise present the lanes as a ONE-TAP choice using the AskUserQuestion tool: one option per lane that is not done, each labeled with the lane name and a short status + summary. Order the most actionable first (open and in_progress before blocked and paused). Let the user pick one.

3. Before doing any work, GATHER ALL CONTEXT for the chosen lane:
   - Always read `CLAUDE.md` and `docs/_handoff/GSR-WORKFLOW-CANON.md`.
   - Read every file listed in that lane's `files`, plus any docs or sources its `resume_prompt` names.
   - Pull live context appropriate to the lane:
     - Episode/data lanes: use the Supabase MCP (project `lafkbxypmciopebentxp`, READ ONLY first) to read current rows; reference `docs/_handoff/2026-06-08-s3-ep1-16-dataset.md`.
     - Rundown Creator lane: use the RC API recipe in that lane (env `RUNDOWN_CREATOR_API_KEY`/`RUNDOWN_CREATOR_API_TOKEN`, trim whitespace, url-encode; actions getRundowns/getRows/getScript).
     - Basecamp lane: read `docs/_handoff/2026-06-08-basecamp-map.md` if present; use the Basecamp env vars if set.
     - UI lanes: open the relevant mocks in `docs/ui-mocks/` and the UI strategy/bake-off docs in `docs/_handoff/`.
     - Course lane: read `docs/_handoff/gsr-automation-v2-course.html`.
   - Note explicitly what the lane is blocked on.

4. Mark the lane IN PROGRESS: set its status to `in_progress` with today's date in `docs/_handoff/lanes.json`, regenerate the board with `/opt/node22/bin/node tools/build_lanes.mjs`, then `git add -A`, `git pull --rebase origin <current branch>`, commit `lanes: start <lane name>`, and push.

5. Tell the user, briefly: which lane, what context you loaded, what (if anything) it is blocked on, and the immediate next action. Then carry out that lane's `resume_prompt`. Do not start a write that the lane describes as gated without the user's go.

Lane requested by the user: $ARGUMENTS
