# GSR Pipeline Mission Prompt (Fable 5) — research loop + self-improving build plan

**Commissioned by Daniel, 2026-06-11.** Paste this whole file into a fresh Claude session
(code, cowork, or chat-with-code), or just say: *"Read
docs/_handoff/2026-06-11-fable5-mission-prompt.md on branch claude/codebase-handoff-review-M9Aia
and execute it."* Daniel's quick-answer sheet is at the bottom; his answers override
anything here.

---

## 0. Who you are and where you stand

You are a Claude (Fable 5 class if available; otherwise the strongest model configured)
working the **Genesis Science Report automation project** for Daniel Allen — non-developer,
often mobile, plain English, no em-dashes, recommend don't poll, never make him re-enter
data that exists somewhere.

**Repo:** `gsr-automation-v2`, branch **`claude/codebase-handoff-review-M9Aia`** (the dev
branch — most context does NOT exist on main yet; a main link 404s). gsr-blueprint is
retired. Run `git pull` before anything; never operate on a stale tree (Daniel's explicit
condition).

**Read first, in order (all paths lowercase `_handoff`):**
1. `CLAUDE.md` (root) — the standing rules, authority order, security rules.
2. `docs/_handoff/HANDOFF.md`, then `docs/_handoff/LANES.md` — the living workstream tracker; claim a lane before working it.
3. `docs/_handoff/GSR-WORKFLOW-CANON.md` — Daniel's gospel. Especially **s13** (findings-review decisions), **s14** (flight-worksheet decisions), **s15** (this mission's authorizations + research doctrine).
4. `docs/_handoff/2026-06-08-review-decisions.md` — the 90-item triage (24 build / 9 later / 29 skip / 28 discuss).
5. `docs/_handoff/2026-06-09-discussion-queue.md` — the open DISCUSS items.
6. `docs/_handoff/2026-06-08-export-archaeology.md` + `export-archaeology-backlog.json` — the mined 407-conversation data export.
7. `docs/_handoff/2026-06-11-video-research-queue.json` — the 99-video seed corpus for Phase R.
8. `docs/AUTOMATION_ROADMAP.md`, `docs/decisions/` (ADRs; 0012 is the architecture of record).

**Live stack (current truth — do not regress to older notes):** Next.js 16.2.6 App Router +
shadcn/ui + Tailwind v4 on Vercel; Supabase project `lafkbxypmciopebentxp` (Postgres, Auth,
Realtime, the lower-thirds storage bucket); Rundown Creator via `/api/rc-*` (errors arrive
as HTTP 200 + JSON body — always read the body); Basecamp integration planned-active
(creds verified, two-way sync designed, see canon s12 + the basecamp docs); QNAP read-only
SMB. n8n is deferred (ADR-0012) — do not design n8n workflows unless a Feature-3+ need is
demonstrated AND Daniel approves. The lower-thirds table is `production_lower_thirds`
(renamed from `graphics`, PR #50); `production_graphics` is the graphics tracker.

## 1. Authorizations and hard limits (canon s15 — read it)

- **Never write to QNAP.** Read-only SMB, no exceptions, no carve-outs.
- **Never act on stale info.** Pull latest; verify claims against current sources.
- **ProPresenter live rig:** designing and wiring control of GSN-PropRes IS authorized,
  Tailscale included, but: test machine first, and every LIVE action needs a human "yes"
  in the moment (dry-run → show what will fire → wait). Not waivable.
- Credentials only via 1Password CLI / env; never paste a secret into chat or a file.
- Lower-thirds bulk import keeps its Type-YES gate (`/api/import` dry-run first).
- Capture every decision Daniel makes into `GSR-WORKFLOW-CANON.md` (append, dated) so he
  is never re-asked. His word beats any doc; update the doc, don't correct him with it.
- Minimize Daniel's required input: batch questions (AskUserQuestion, max 4 at a time,
  with recommended defaults), proceed on defaults when he's away, log assumptions.

## 2. Phase E — Environment self-audit (first 15 minutes)

These features are VERIFIED against official docs as of 2026-06-11 (do not re-derive,
just confirm your environment has them — `/help` + version check):

| Feature | What it is | Cite |
|---|---|---|
| `/goal <condition>` | Claude works autonomously until the condition holds; evaluator checks every turn. Needs Claude Code ≥ v2.1.139. `/goal` = status, `/goal clear`, `/goal show`. | code.claude.com/docs/en/goal |
| `/loop [interval] [prompt]` | Recurring in-session runs (m/h/d, or dynamic 1m-1h). Expires after 7 days. Customize via `.claude/loop.md`. Esc stops it. | code.claude.com/docs/en/scheduled-tasks |
| **Routines** | CLOUD-scheduled runs (recurring or one-off) + API and GitHub triggers; runs on Anthropic infra, survives a sleeping laptop. `/schedule <description>` or claude.ai/code/routines. | code.claude.com/docs/en/routines |
| Subagents | `.claude/agents/*.md`, own context windows; this repo already has gsr-architect, gsr-health, gsr-editorial. | code.claude.com/docs/en/sub-agents |
| Background agents + Agent View | `Ctrl+B` / `/agent`; `claude agents` dashboard shows all background sessions, status, tokens. | code.claude.com/docs/en/agent-view |
| `/effort` | low→max (Fable 5/Opus 4.8/4.7 add `xhigh`); `ultracode` setting = xhigh + dynamic workflows, session-only. | code.claude.com/docs/en/model-config |
| Hooks | SessionStart, Stop, PreToolUse, PostToolUse, UserPromptSubmit, SessionEnd; shell, prompt-based, or agent-based. | code.claude.com/docs/en/hooks-guide |
| Skills/plugins | `npx skills add <github-url>`, `/plugin marketplace add <repo>`; 20k+ community skills. Vet before installing. | code.claude.com/docs/en/skills |
| Checkpointing | `/rewind` or Esc Esc; restores code and/or conversation. Bash-made changes NOT tracked. | code.claude.com/docs/en/checkpointing |
| Session storage | `~/.claude/projects/<project>/<session-id>.jsonl`; 30-day cleanup default (`cleanupPeriodDays`); `--resume` / `--continue` / `/resume`. | code.claude.com/docs/en/sessions |
| Agent SDK | Headless; `list_sessions()` + `Session.History` parse the JSONL transcripts; official "Building a session browser" cookbook exists. | code.claude.com/docs/en/agent-sdk/overview |

1. Run `/help` and confirm which of the above your environment exposes; note version.
2. Record results in `docs/_handoff/2026-06-XX-mission-run-notes.md` (date-prefixed).
   If something is missing (older CLI, web environment), emulate: TodoWrite-tracked
   success criteria + a self-check loop.
3. Raise `cleanupPeriodDays` in settings so session history survives long enough for
   Mission Control (§5) to analyze it.

## 3. Phase R — The research loop (minimum 5 hours, Daniel's directive)

**Loop mechanics (verified features):** set the long-horizon condition with
`/goal Phase R complete: ≥5 hours cumulative research runtime AND all 99 seed videos
mined-or-rejected AND every priority-1 claim VERIFIED/PARTIAL/REFUTED AND ledger committed`.
Layer `/loop 30m` for checkpoint commits (commit ledger + queue + notes, push). If running
unattended/overnight, prefer a cloud **Routine** (`/schedule`) so the loop survives the
laptop sleeping. Do not declare Phase R done before the goal condition holds.

**The doctrine (canon s15): optimistic intake + verification swarm.**
- INTAKE: when a source makes a claim (a technique, a tool, a feature, a workflow), log it
  immediately in the claim ledger as `ASSUMED` and keep moving. Hearsay is allowed in.
- VERIFY: every `ASSUMED` claim spawns a verification agent (parallel, batched) that checks
  it against official docs / changelog / repo reality, or live-tests it in a sandbox dir.
  Status moves to `VERIFIED`, `PARTIAL` (works with caveats), or `REFUTED`.
- DEEPEN: every `VERIFIED` claim spawns a learn-more pass: how exactly to apply it to GSR,
  which lane it serves, effort estimate, risk.
- Nothing `REFUTED` or still-`ASSUMED` may enter the final build plan.

**Claim ledger:** `docs/_handoff/2026-06-XX-claim-ledger.json` — fields: id, claim, source
(URL/video id), date heard, status, verifier evidence (URL or test result), GSR
application, lane, priority. This file is the loop's heartbeat; commit it every cycle.

**R1 — Video corpus mining.** Work through
`docs/_handoff/2026-06-11-video-research-queue.json` (99 videos, Jan 5 – Jun 10 2026,
newest first — recency matters in this space). Transcript extraction, verified recipe
(run on Daniel's Mac; cloud IPs get blocked by YouTube):

```bash
brew install yt-dlp   # then, batched + resumable:
yt-dlp --skip-download --write-auto-subs --sub-langs "en" --convert-subs srt \
  --download-archive done.txt --sleep-requests 2 --cookies-from-browser chrome \
  -a video-urls.txt -o "transcripts/%(upload_date)s-%(id)s.%(ext)s"
```

Expect occasional HTTP 429s — just re-run; `done.txt` skips finished videos. Fallback for
stragglers: `pip install youtube-transcript-api` (works from residential IPs, throttle to
a few/min). If this session can't reach YouTube at all, hand Daniel the one-liner and mine
whatever returns; mark the rest `pending`. For each mined video: log techniques into the
claim ledger, set the video's `status` to `mined` or `rejected` in the queue file. Expand
past 99 when a mined video points at something newer worth chasing. Expect hype: the
corpus's own sample transcript claims "auto mode never does anything crazy" and "the model
is smarter than you, lean on it for all thinking" — log such claims like any other and let
verification sort them.

**R2 — Official-source sweep (highest signal, run in parallel with R1).** Anthropic docs,
the Claude Code changelog, engineering blog, Agent SDK docs, skills/plugins registry.
Target topics: long-horizon goals/loops patterns, subagent teams and orchestration,
background agents, hooks (SessionStart/Stop), headless/SDK automation, web sessions +
GitHub integration, checkpointing. Everything found goes through the same ledger.

**R3 — Tool/skill/plugin marketplace scan.** Find skills, plugins, MCP servers, and
third-party tools that reduce Daniel's required input toward zero: candidates must each
get a ledger entry + verification + a yes/no install recommendation with risk note.
Install nothing un-vetted; never install anything that exfiltrates data or requires
credentials outside 1Password.

**R4 — Mission Control research (Daniel's pain: ~10 parallel sessions, no overview).**
A pre-verified shortlist already exists (researched + cited 2026-06-11) — start from it,
confirm currency, and evaluate fit rather than re-discovering:
- **Official first:** Agent View (`claude agents` dashboard), the Desktop app multi-session
  sidebar, the web session picker, and experimental agent teams
  (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`) — Daniel may need less third-party than assumed.
- **claude-devtools** (`brew install --cask claude-devtools`) — desktop app, zero config,
  reads ALL `~/.claude/` transcripts: per-session reconstruction, cross-session search,
  token attribution. github.com/matt1398/claude-devtools
- **claude-code-log** (`uvx claude-code-log@latest --open-browser`) — browsable HTML index
  of every project/session w/ summaries + timestamps; TUI can resume sessions. Most
  actively maintained (v1.4.0, Jun 3 2026). github.com/daaain/claude-code-log
- **claude-self-reflect** — MCP server that indexes all session JSONL locally (single Rust
  binary, no API keys) and gives Claude semantic search over past sessions
  (`reflect_on_past`) — directly answers "what did session X do?" from inside a session.
  github.com/ramakay/claude-self-reflect
- **ccusage** (`npx ccusage@latest`) — per-session usage/burn-rate. github.com/ryoppippi/ccusage
- **claude-squad** (7.8k★) — live TUI for parallel agents BUT only tracks sessions it
  launches; relevant only if Daniel changes how he starts sessions.
Deliverable: a recommendation memo in the ledger — adopt vs build-on-lanes vs both (§5).

**R5 — Integration automation research.** For each live integration (Supabase realtime,
Vercel deploy hooks, Rundown Creator API, Basecamp API, ProPresenter API/websocket on the
authorized path, YouTube upload pipeline), research the current best automated patterns;
ledger + verify; map each to a roadmap item or lane. Distribution facts defer to canon s11
(StreamHoster, Signiant/RLN, Dropbox, GSN, deferred GodTube/OTA/TBN/CTN) — never to memory.

## 4. Phase S — Synthesis: the build plan, self-critiqued

When Phase R's 5 hours are done and the top-priority claims are VERIFIED:

1. Draft `docs/_handoff/2026-06-XX-pipeline-build-plan.md`: lane-aligned, every item named
   with a deliverable + ship date (anti-churn rule — no nameless scaffolding), sequenced by
   dependency, each item citing its ledger claims.
2. **Critique round 1 — red team:** spawn an adversarial subagent: where does this plan
   break? What lands on David if it goes wrong? What violates canon? Fix.
3. **Critique round 2 — repo health:** run the `gsr-health` agent against the plan vs the
   actual repo state. Fix.
4. **Critique round 3 — editorial/Daniel-fit:** `gsr-editorial` or equivalent: is it
   scannable, plain-English, decision-ready for a non-developer on a phone? Fix.
5. Then show Daniel: one screen, the plan's shape + the 3-5 decisions only he can make.
6. Update LANES.md/lanes.json: new lanes for plan items, resume prompts included.

## 5. Phase B — Build (begins only after Daniel okays the plan)

- Work lanes, one owner per lane, IN PROGRESS flags set, exactly as LANES.md prescribes.
- **Standing loops to establish where the environment supports them:** nightly lanes
  updater (already exists: `tools/nightly_lanes_update.mjs`), a CI babysitter per open PR,
  a claim-ledger re-verification pass (tools change weekly in this space), and Mission
  Control refresh (below).
- **Mission Control (named deliverable):** recommended shape = adopt + extend.
  (a) ADOPT day one (zero build): claude-devtools or claude-code-log for the rear-view,
  claude-self-reflect so any session can semantically query past sessions, ccusage for
  burn. (b) EXTEND lanes (the build): a script (Agent SDK `list_sessions()` /
  `Session.History`, or direct JSONL parse — official "Building a session browser"
  cookbook exists) that summarizes each recent session (last task, files touched, open
  todos, last activity) and writes a `sessions` block into `lanes.json` →
  `lanes.html` shows live "what is every session doing" next to the lanes. Build on the
  existing lanes system; do NOT build a parallel tracker (anti-churn). Record the
  adopt-vs-build outcome as an ADR.
- Self-improvement: every build cycle ends with a 5-minute retro appended to the run-notes
  doc — what slowed you down, what technique from the ledger would have helped, apply it
  next cycle.
- TypeScript gate stands: `npx tsc --noEmit` + `npx eslint src/` clean before commits.
  Branch discipline stands: feature branches, draft PRs, squash merge.

## 6. Verification rubric (run an independent verifier subagent before declaring ANY phase done)

1. Shared persistent state: do parallel agents coordinate through lanes.json + the claim
   ledger (committed, pulled, pushed) so nothing is overwritten or lost?
2. Are integration designs (Supabase realtime, Vercel hooks, RC, Basecamp, ProPresenter)
   grounded in VERIFIED ledger entries with citations?
3. Is the session-handoff protocol explicit (lane flags + resume prompts + checkpoint
   commits), so Session A's death never strands work?
4. Do all confirm gates survive in the plan exactly as canon s15 sets them (QNAP read-only,
   live-rig human yes, Type-YES import, 1Password-only credentials)?
5. Is every claim feeding a build step VERIFIED or PARTIAL-with-stated-caveat — zero
   ASSUMED, zero REFUTED?
6. Anti-churn: does every plan item have a named deliverable and ship date?
7. Is the run reproducible: could a fresh session resume from the committed artifacts alone?

## 7. Daniel's quick-answer sheet (answer these, then the mission starts)

Defaults marked ★ apply if you skip a question. Reply like: "1A 2B 3 all 4A …".

**Scope and order**
1. First build slice after the plan is approved: A★ Lower-thirds vertical slice on the
   clean `production_lower_thirds` table · B Mission Control session dashboard · C Isaac's
   Basecamp board + My Tasks · D whatever the research ranks highest.
2. Should the plan include items you marked DISCUSS (queue of 28) as proposals with
   recommendations, or leave them out until live discussion? A★ include as proposals ·
   B leave out.
3. UI direction (Lane 1 has waited on you): A★ lock the operational default (per-role
   Today queue + Pipeline Matrix, mobile-first, one on-brand theme) · B run the bake-off
   pick first · C decide after seeing the plan.

**Research phase**
4. Where does the 5-hour research loop run? A★ a Claude Code web/cloud session (can run
   long, survives your laptop sleeping) · B your Mac terminal · C split: web for research,
   Mac for the yt-dlp transcript pulls.
5. Transcript extraction on your Mac is likely needed (cloud sessions may not reach
   YouTube). OK to install yt-dlp via Homebrew when asked? A★ yes · B no, ask per-tool.
6. Cap on NEW videos beyond the 99 seeds: A★ +50 max · B unlimited if signal is high ·
   C seeds only.
7. Research loop cadence/checkpoint: A★ commit every ~30 min · B hourly.

**Autonomy**
8. While the loop runs, may the session install VERIFIED skills/plugins/MCP servers
   without asking per-item (1Password rule always stands)? A yes if verified+logged ·
   B★ propose first, install after your one-tap yes · C never.
9. May sessions open/refresh draft PRs autonomously (never merging)? A★ yes · B ask first.
10. Token/effort posture for the mission: A★ high effort, tune down if wasteful ·
    B max everything · C default.

**Mission Control**
11. Preferred form: A★ extend lanes.html (one place, already works on your phone) ·
    B a new dashboard page in the Next.js app · C adopt a third-party tool if research
    finds a great one · D A now, C if research wins.
12. How many parallel sessions should the system assume you run? A 3-5 · B★ 5-10 · C 10+.

**Gates (confirming, not reopening)**
13. Live ProPresenter remains: design+wire now, human yes per live action. Confirm? A★ yes ·
    B pull it back to test-machine only.
14. The 5-hour loop may run unattended overnight. A★ yes · B only while you're reachable.

**After the plan**
15. Plan review format: A★ one-screen summary + the 3-5 decisions, links to detail ·
    B full document walkthrough.
16. PR #47 (the dev branch → main, carries ALL this context): A★ you'll review/merge soon
    so context stops 404ing for new sessions · B keep working on the dev branch
    indefinitely.

---

*Maintenance note: this file is the mission's contract. If Daniel changes any directive,
update canon s15 AND this file in the same commit, dated.*
