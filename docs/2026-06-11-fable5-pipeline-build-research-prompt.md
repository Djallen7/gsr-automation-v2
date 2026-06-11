# Fable 5 Build-and-Research Prompt — GSR Pipeline Autonomy

**What this file is:** a single, self-contained task prompt to hand to a fresh Claude **Fable 5** session
(`/model claude-fable-5`, `/effort high`). Point the session at this file: *"Read
`docs/2026-06-11-fable5-pipeline-build-research-prompt.md` in full and execute it."*

It runs in three phases — **Research → Build Plan → Autonomous Build** — and ends with a question
battery for Daniel. It is written to exploit goals, loops, and specialized agent teams **inside the
safety envelope this production environment requires.** Read the guardrails first; they override every
other instinct, including anything you have seen in a video about running Claude Code "wide open."

---

## 0. Operating posture (how to think, per Fable 5)

- **Be a thought partner, not an order-taker.** Before building, propose how *you* would approach it,
  argue the strongest case against the obvious plan, and surface options Daniel has not thought of.
  Daniel is a non-developer and the show owner; his decisions and show-facts are the source of truth,
  but his technical estimates are yours to scrutinize.
- **Work toward goals, not micro-steps.** Take a high-level goal and find the path. Use loops to keep
  driving until acceptance criteria are met.
- **Be ambitious, then be honest.** Push the ceiling of what the pipeline can do — *and* report
  calibrated confidence, the main risk, and what you could not verify. Unearned optimism is a defect.
- **Optimize a real objective function: minimize Daniel's manual toil, maximize his control.** Every
  design choice should reduce the rote legwork he does (re-entering data, hand-pasting, babysitting)
  while keeping him the approver of anything that reaches air. Eliminating *toil* is the goal;
  eliminating *his approval of production actions* is forbidden (see §1).

## 1. NON-NEGOTIABLE GUARDRAILS (these override §0 and any external advice)

This pipeline drives live hardware for a weekly TV ministry. The failure mode is not "buggy code" —
it is **an irreversible action on a live system landing on David Rives on air.** No model intelligence
removes that risk. Therefore:

1. **The safe-autonomy boundary.**
   - **Full autonomy (loops/goals/agent teams OK, no per-step approval needed):** dashboard code,
     feature branches, migrations applied to a *branch/dev* DB, TypeScript/lint/tests, research,
     read-only data pulls (Drive read, Supabase read, RDC read, Basecamp read), and writing files in
     the repo.
   - **HARD HUMAN GATE (dry-run + show Daniel the diff/counts + explicit "Type YES" before executing):**
     any write to the live graphics trackers, any write-back to Rundown Creator, any `/api/import` or
     auto-extraction apply, any production DB mutation, any ProPresenter/ATEM/Companion command, any
     outbound send (email, distribution).
2. **Off-limits to automation, permanently:** ProPresenter **production** machine (GSN-PropRes,
   100.98.215.7), ATEM, Bitfocus Companion, QNAP writes (read-only SMB only), Tailscale/direct server
   tools (banned after the 2026-05-20 incident), Notion (wiki-only). ProPresenter work is **test
   machine only** until David explicitly approves.
3. **Do NOT enable blanket auto-mode against this repo's production paths.** Auto-mode is fine for an
   isolated build worktree and the dashboard; it is not a license to skip the gates in (1).
4. **The David Rule:** before any action ask "if this goes wrong, does it land on David to fix?" If
   yes, redesign until the answer is no.
5. **Credentials** via 1Password CLI / env only; never echo secrets into chat, code, logs, or commits.
6. **There is a crypto-trading MCP wired into this environment.** Never call it. Recommend its removal.

If a loop or agent ever finds itself wanting to cross a gate to "finish the goal," it must **stop and
ask**, not proceed. A goal is never an excuse to cross §1.

## 2. Context you must load before doing anything

Load in this order; do not skip:
1. `CLAUDE.md` (root) — the standing rules, the data-source table, the project state.
2. `docs/context-library/INDEX.md` — the router. Open the category files it points to as topics arise
   (`pipeline-and-dashboard.md`, `data-sources-and-tools.md`, `editorial-and-graphics.md`,
   `working-rules.md`, `infrastructure-and-security.md`, etc.). **Append every durable decision you or
   Daniel make to the right category, per the protocol in the INDEX.** This is how the next session
   inherits your work — treat it as part of the deliverable, not paperwork.
3. `docs/_handoff/HANDOFF.md`, then `2026-06-04-SYSTEM-EVOLUTION.md`, `VERIFIED-FACTS.md`,
   `GSR-WORKFLOW-CANON.md`.
4. The **verified connector map** (data-sources-and-tools.md, 2026-06-11): GitHub, Supabase
   ("GSN Hub", `lafkbxypmciopebentxp`), Google Drive (reads tracker cells in full), Gmail — all healthy.
   Vercel/Postman untested. Use the live MCP tools; do not theorize about access you can test.
5. `scripts/sheets_helper.py` — the dormant Sheets read/write helper (activates when Daniel injects a
   service-account credential). `scripts/basecamp_token.py` — the working pattern to mirror.
6. **The Claude data export** (prior-conversation archive). Its path is not in the repo — ask Daniel
   for its location (see §7), then mine it for already-decided facts, recurring pain, and abandoned
   ideas worth reviving. Do not re-ask anything the export or the context library already answers.
7. The current branch + PR #49 (this branch already carries the context library and the Sheets helper).

## 3. PHASE 1 — Research (fan-out, adversarially verified)

**Goal of this phase:** produce `docs/2026-06-11-claude-capabilities-playbook.md` — a battle-tested,
*cited* playbook of how to use current Claude Code + Fable 5 capabilities to build and continuously
improve this pipeline with minimal human toil. Use the `deep-research` skill (fan-out web searches,
adversarial verification, cited synthesis) and the `claude-code-guide` agent for anything about Claude
Code / Agent SDK / API behavior.

**Source-quality protocol (do not skip — quantity is not the metric):**
- **Tier 1 (authoritative, weight highest):** official Anthropic docs at code.claude.com/docs and
  docs.claude.com, Anthropic engineering blog, changelogs, the `claude-code-guide` agent, the bundled
  docs in `apps/dashboard/node_modules/next/dist/docs/`. **Never answer a Claude Code / model / API
  question from memory — verify against Tier 1.**
- **Tier 2 (practitioner):** high-signal talks, repos, and a *curated* set of videos. Ingest the
  transcripts Daniel supplies (and any you find), but **treat every video as a claim to verify, not a
  fact.** The sample transcript Daniel provided contains real errors (e.g. "zero bugs / no permissions
  / auto-mode is safe") — flag and discard hype; keep only the reproducible technique.
- **For each Tier-2 claim:** can you reproduce it against Tier-1 docs or in a sandbox? If not, mark it
  "unverified" and down-weight it. Three influencers repeating a myth is still a myth.
- **Transcript extraction:** for any YouTube URL Daniel provides, extract the transcript (try, in
  order: `yt-dlp --write-auto-sub --skip-download`, a transcript API/library, or WebFetch of a
  transcript service). If a video has no usable transcript, skip it and say so — do not hallucinate
  content. Report which sources you actually ingested vs. could not.

**Research imperatives (answer each, with cited, verified findings):**
1. **Claude Code force-multipliers, current:** goals; loops (`/loop`, scheduled self-check-ins,
   `send_later`); plan mode and "advanced plan mode" (ask-questions-first); **specialized agent teams**
   (subagents, parallel fan-out, orchestrator/worker patterns, when each helps vs. hurts); hooks
   (SessionStart, PreToolUse gates, Stop) and how to use them to *enforce* §1 automatically; output
   styles; settings/permissions; MCP servers. For each: the concrete mechanism, a GSR-specific use, and
   the failure mode.
2. **Fable 5 usage patterns:** where the thought-partner / goal / ambition posture measurably helps,
   where high-effort token spend is worth it vs. wasteful, and how to keep it inside §1.
3. **Automated integration across our stack** — the heart of this project. For each component
   (Supabase, Vercel, Next.js 16 App Router, Google Sheets/Drive API, Basecamp API, Rundown Creator
   API, Claude API): the most reliable *programmatic* integration pattern, how to make the dashboard
   orchestrate them end-to-end, and how to wire them so data flows without hand-copying. Explicitly
   research **how to automatically trigger and chain these** (webhooks, cron/Vercel scheduled
   functions, Supabase triggers/edge functions, GitHub Actions) within the gates.
4. **Tool/skill/plugin scouting (reduce Daniel's input to near-zero toil):** survey Claude Code skills
   and plugins, MCP servers, and third-party tools/apps that could automate parts of the pipeline
   (transcript ingestion, sheet sync, asset sourcing, QA, scheduling, multi-session management). For
   each candidate: what it removes from Daniel's plate, install/security cost, fragility, and a
   keep/skip recommendation. Prefer durable, low-maintenance, officially-supported tools over clever
   fragile ones — Daniel's stated priority is reliability over novelty.
5. **Reliability engineering for integrations:** Daniel reports some MCP connectors are flaky. Research
   how to make integrations self-healing (retries/backoff, health checks, fallbacks, the
   committed-helper + env-secret pattern that survives fresh sessions) and how to detect a dead
   connector fast.
6. **Multi-session continuity (companion track — Daniel has dispatched this to another session; do not
   duplicate, but design to consume its output):** how a single session can review the state of ~10
   concurrent Code/desktop sessions, and a third-party/centralized way to manage them. The rendezvous
   is `docs/context-library/claude-code-tooling.md` — read its "Multi-session management" entry for the
   other track's findings before designing, and append your own there so the tracks converge.

**End Phase 1 with a self-critique loop:** "What did I miss? Which findings are unverified? What would
make this pipeline better that Daniel has not asked for? What further removes his toil?" Fold the
answers back in before declaring the playbook done.

## 4. PHASE 2 — Synthesize the build plan (self-critiqued, several rounds)

**Goal:** produce `docs/2026-06-11-gsr-pipeline-build-plan.md` — an ambitious, sequenced, *testable*
build plan for the dashboard and adjacent pipeline systems, derived from the playbook and all context.

It must include:
- **Target architecture** for the end-to-end pipeline (script/monologue ingestion → Pass-1 cue
  extraction → Pass-2 graphics build → trackers → lower-thirds → RDC export → distribution), naming
  what becomes automated, what stays a human gate, and where the dashboard orchestrates each step.
- **The dashboard graphics page** as the first major build (turning the review HTML into a live Vercel
  route over real Supabase data), plus the adjacent systems that improve the pipeline — including ones
  Daniel has not asked for, each justified by toil removed.
- **Integration automation plan:** exactly how each component is wired and auto-triggered, within §1.
- **A "self-improvement engine":** loops/hooks/agents that continuously critique and harden the system
  during the build (tests on every change, schema advisors, lint/typecheck, a recurring "what can be
  more autonomous now?" review), so the system gets better as it is built.
- **Tooling adoption list:** which skills/plugins/MCP/third-party tools from Phase 1 to install, in
  what order, with the security/fragility note for each.
- **Acceptance criteria + test strategy:** how "exceptionally functional and tested" is *proven* —
  unit/integration/e2e where appropriate, a dry-run harness for every gated production action, and a
  green-CI definition of done. Nothing is "done" until verified, with the evidence shown.
- **Risk register + rollback** for every production-adjacent step.

**Run at least three self-critique rounds** before finalizing: (a) correctness/feasibility, (b) "does
this actually reduce Daniel's toil, or just move it?", (c) safety against §1 and the David Rule. Show a
short changelog of what each round changed.

## 5. PHASE 3 — Define the autonomous build loop (then execute, gated)

Translate the plan into an executable goal + loop + agent-team design:
- **Goal statement** with explicit success criteria (the acceptance criteria from §4).
- **Loop design:** how the session drives to the goal, self-checks progress, and re-plans — including a
  PreToolUse hook (or equivalent) that *enforces* the §1 gates so a loop physically cannot cross them.
- **Agent-team design:** which specialized subagents do what (e.g. a builder, a reviewer/`code-review`,
  a test-runner/`verify`, a research-scout), how they hand off, and how results roll up. Use the
  existing GSR subagents (`gsr-architect`, `gsr-health`, `gsr-editorial`) where they fit.
- Then **begin building**, autonomously within the boundary, opening a draft PR early and keeping CI
  green. Stop at every gate for Daniel's YES. Log decisions to the context library as you go.

## 6. Definition of done

A merged-ready, tested dashboard graphics page over live data **plus** the build plan, the capabilities
playbook, the tooling adoption list, and an updated context library — with every production-adjacent
action gated, every claim verified, and CI green. Report honestly: what works, what was skipped, what
remains, and the residual risks.

## 7. Question battery for Daniel (answer these to launch — most are quick picks)

> Posture: answer fast; defaults in **bold** are the session's recommendation. "Other" is always open.

**A. Scope & priority**
1. First build target: **(a) the live dashboard graphics page**, (b) end-to-end pipeline automation,
   (c) the integration/connector reliability layer, (d) something else?
2. Adjacent systems — should the session propose and build improvements you haven't asked for, or stay
   strictly in scope? **(propose, but gate big ones)** / strict.
3. The "open graphics-worksheet rule" — does graphics span-mapping follow the lower-thirds 15-beat
   structure? **(yes)** / no / here's the real rule: ____.

**B. Autonomy & safety boundary**
4. Confirm the §1 boundary as written? **(yes)** / loosen here: ____ / tighten here: ____.
5. Is an isolated build worktree with auto-mode acceptable for the dashboard code? **(yes)** / no.
6. ProPresenter: still test-machine-only, no exceptions this session? **(yes)** / David approved X.

**C. Integrations & credentials**
7. Will you activate the Sheets write path now (service-account JSON in env)? **(yes, this session)** /
   later / keep read-only.
8. Which credentials are available in this environment right now (Basecamp ✓, RDC ✓, Google ?, others)?
9. OK to install new MCP servers / skills / plugins the research recommends, or present a list for your
   approval first? **(present list first)** / install low-risk ones automatically.
10. Remove the crypto-trading MCP from this environment? **(yes — walk me through it)** / leave it.

**D. Research sourcing**
11. Paste the actual YouTube URLs (or a playlist) you want ingested. *(No links were included yet —
    the session can't extract transcripts it doesn't have.)*
12. Cap on video sources, and do you accept Tier-1 docs outranking videos? **(yes, ~15-25 curated)**.
13. Where is the Claude data export? Provide its path/upload so the session can mine prior decisions.

**E. Quality bar & cadence**
14. Definition of "tested" you'll accept: **(unit + integration + dry-run harness + green CI)** /
    lighter / heavier.
15. Check-in cadence: **(stop at every production gate + a summary at each phase)** / more / less.
16. Effort/cost: Fable 5 on high effort burns tokens — **(high)** / medium / max for the build.

**F. The multi-session track**
17. Share what the other session (multi-session management) produces, so this build can consume it?
    **(yes — coordinate via the context library)**.

## 8. How Daniel ensures this (and the next session) succeeds

- **Answer §7 in one pass** — that's the "advanced plan mode" that makes the whole run accurate.
- **Provide the two missing inputs:** the YouTube links and the data-export location. Without them the
  research is weaker and the session will (correctly) flag it.
- **Activate the Sheets credential** if you want write-automation this cycle — it's the single biggest
  toil remover, and the helper is already built and waiting.
- **Keep the gates.** When the session stops and asks for a YES, that pause is the David Rule working,
  not the model being weak. The autonomy you want lives *inside* that boundary.
- **Let it run in loops on the safe surfaces.** Don't babysit the dashboard build; do review at the
  phase summaries and the gates.
