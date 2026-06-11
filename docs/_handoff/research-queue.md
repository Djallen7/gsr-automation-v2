# GSR Research & Design Queue (autonomous loop)

This file is the brain for a self-paced, multi-session research/design loop.
A looping session reads this file, does the next task, commits and PUSHES the
result, marks it done, and repeats until out of tokens. A scheduled wake-up
resumes it in a fresh session after the token cap resets. Because looping
sessions start with NO memory of prior chats, every task below is written to be
self-contained from the repo plus web research.

Seeded 2026-06-07 from session context (the UI bake-off and the broader course plan).

## How the loop operates (read every iteration)
1. Pick the FIRST task marked `[todo]` (skip `[blocked-needs-daniel]` and `[done]`).
2. Do it fully. Research and drafting only.
3. Write the deliverable to the exact path named in the task.
4. Mark the task `[done]` here with today's date, a one-line result, and the output path.
5. `git add` + `git commit` + **`git push -u origin claude/codebase-handoff-review-M9Aia`**. Pushing is mandatory every iteration: the container is ephemeral, unpushed work is lost.
6. Repeat. When all tasks are `[done]` or `[blocked-needs-daniel]`, stop and report.

## Guardrails (non-negotiable)
- Work ONLY inside `/home/user/gsr-blueprint` (this staging repo). `gsr-automation-v2` is READ-ONLY (mine for reference, never write).
- NEVER: merge any PR, push to `gsr-automation-v2`, touch ProPresenter / ATEM / QNAP / Notion / Tailscale or any production infra, delete files, or take any outward-facing/irreversible action.
- NEVER make a decision that is Daniel's. If a task needs his input (e.g. which UI direction to use), mark it `[blocked-needs-daniel]` and move on. Do not pick a UI direction for him.
- Date-prefix net-new top-level files (`YYYY-MM-DD-name`). Plain English, no jargon, no em-dashes.
- Keep a scheduled wake-up armed for after the token reset so the loop resumes itself.

## Context the loop should ground in (read-only)
- `/home/user/gsr-automation-v2/CLAUDE.md` and `docs/_handoff/GSR-WORKFLOW-CANON.md` (the system: weekly show, batches of 5, 9 stages, roles Daniel/Myriam/Isaac/interns, distribution stack).
- This repo: `docs/2026-06-07-gsr-ui-strategy.md`, `docs/2026-06-07-gsr-ui-bakeoff-research.html`, and `mock/preview-1..7-*.html` (the 7 UI directions and their consolidated insights).

## Tasks

### [done] T1 - Build-plan optimization report ("agent army")
Done 2026-06-07: prioritized optimization report (architecture, agent layer, distribution, fragile points, cost) -> docs/2026-06-07-build-optimization-report.md
Daniel asked for a broad sweep for objective improvements to the GSR build plan: better tools, advice, efficiencies, fragile points. Research across platforms (Claude Code/Anthropic best practices, Supabase + Next.js, video/broadcast distribution tooling, agent orchestration, security/fragility, cost) grounded in the v2 repo's reconciled tool registry (GSR-WORKFLOW-CANON.md). Deliver a prioritized report.
Output: `docs/2026-06-07-build-optimization-report.md`

### [done] T2 - Per-stage tool suggestions
Done 2026-06-07: best tool options per category for all 9 stages, reconciled to the v2 registry -> docs/2026-06-07-tool-suggestions-by-stage.md
For each of the 9 pipeline stages, list the best 2-3 tool options per relevant category (with a recommended pick and why), reconciled to the v2 repo's current tool registry. This supports the course requirement that each stage surface opt-in tool suggestions.
Output: `docs/2026-06-07-tool-suggestions-by-stage.md`

### [todo] T3 - Module 0 draft: Orientation + GitHub training
Draft the course's orientation module content: how the course works; what is already set up in GitHub; the GitHub terms/concepts a non-technical new user needs (repo, branch, commit, PR, merge); and how to spot an issue and prompt Claude Code to fix it. Plain English. Theme-agnostic content (no visual design committed yet).
Output: `docs/course/module-0-orientation.md`

### [todo] T4 - Finish-the-Build handoff spec + paste-ready prompts
Draft the end-of-course handoff: detailed instructions plus copy-paste AI prompts that tell a fresh Claude Code session to complete the system build from the repo plus the course's enriched export file. Include a spec for a "Pipeline Review" interactive HTML that flags weak/fragile points. Theme-agnostic.
Output: `docs/course/finish-the-build.md`

### [todo] T5 - Per-direction UI research docs (7 sub-deliverables, one per loop pass)
For EACH of the 7 directions (calm-minimalism, editorial-density, material3, neo-brutalist, bento, humanist, mission-control-ops), write a focused research doc: defining principles, color tokens, type, layout, components, motion, accessibility/mobile, and GSR-fit. Re-research from the web as needed; ground in the repo. Do one direction per iteration so each is committed before the next.
Output: `docs/ui-research/<slug>.md` (e.g. `docs/ui-research/calm-minimalism.md`)

### [blocked-needs-daniel] T6 - Build the chosen UI direction into a full working mock
Blocked until Daniel picks a direction (or two) from the bake-off. Do NOT choose for him. Once chosen, build the full multi-screen mock + screenshots in that direction.
Output: (TBD after the decision)

## Done log
(empty)
