# GSR Automation — Tools, Curriculum & Implementation Timeline
_Created 2026-06-04 · now maintained in `gsr-automation-v2/docs/_handoff/` · source: handoff §0–§19, system blueprint, build-here checklist_

> **What this is.** A single planning document that does two jobs:
> 1. **Tool shopping list mapped to the timeline** — every tool, service, MCP, and learning resource you need, dropped in at the exact build step where it first matters.
> 2. **Implementation depth per stage** — what to actually do, what to set up, what each tool is for, and where the fragile parts are.
>
> Built for a non-developer building through Claude. Read top to bottom once; then use Part 3 (the timeline) as your checklist. No tool appears before you need it.

---

## Part 0 — How to read this

The build has **8 stages** (handoff §15). Each stage in Part 3 lists:
- **Tools introduced here** — only the new ones for that stage
- **What you're building**
- **Setup / how to wire it**
- **Fragile parts** — where this breaks and what to watch
- **Done when** — the finish line

Two kinds of tools run through everything:
- **Project tools** — the pipeline itself (Dropbox, Whisper, Claude API, YouTube, Supabase…)
- **Workflow tools** — what lets *you* build it (Claude Code, MCPs, the GSR Architect agent, 1Password, GitHub)

Both are tagged in the master table below.

---

## Part 1 — Master tool inventory

### A. Workflow tools (how you build)

| Tool | What it does for you | When introduced | Notes |
|---|---|---|---|
| **Claude Code** (local, on Mac) | The thing you build with. Reads the repo, writes code, runs commands. | Stage 0 (setup) | The real build runs LOCALLY on your Mac, not the web app (build-here checklist). |
| **`ed3d-plan-and-execute` skill chain** | Turns the handoff design into a task-by-task implementation plan + a branch. | Stage 0 | Local plugin only. Command: `/ed3d-plan-and-execute:start-implementation-plan @docs/2026-06-03-gsr-handoff.md .` (trailing dot matters). |
| **GSR Architect agent** (`.claude/agents/gsr-architect.md`) | A subagent that boots already knowing the whole system, scores features, owns the Source-of-Truth map, launches builder sub-agents. | Stage 0 | Ships in this repo; Claude Code loads it automatically (no install step). |
| **GitHub** | Sync between the web app and your Mac; version history; PRs. | Stage 0 | Rule: **pull before you start, push when you stop.** Web work lives on GitHub until you pull it down. |
| **1Password CLI** (`op`) | Pulls every credential (Dropbox, YouTube, Supabase, Claude) at runtime. | Stage 0 | **Hard rule: credentials via `op item get …` only, never pasted.** |
| **Supabase MCP** | Lets Claude read/write your database, list migrations, deploy edge functions during the build. | Stage 2+ | Always `list_migrations` before writing SQL. |
| **Basecamp skill + CLI** | Pulls monologue Scripture/graphics instructions later. | Stage (later) | For monologue ingestion (§11). |
| **Google Drive + Gmail MCPs** | Drive inventory, the airing-schedule Sheet, the email archive for DNC. | Stage 8 | Gmail = the DNC fragile part. |
| **Rundown Creator MCP** | Reads `rc_*_map.json` rundown/column maps. | Stage 8 (verification) | Corroboration source. |
| **Desktop Commander** | Local file ops on the Mac (Whisper watch folder, ffmpeg). | Stage 3 | Ties to `~/Productions`. |

### B. Project tools (the pipeline itself)

| Tool | Role in pipeline | Stage | Cost |
|---|---|---|---|
| **Dropbox API** (full scope) | Where broadcast masters land; folder-watch is the trigger. | 2 | none (no egress fees) |
| **Supabase** | Database (project `lafkbxypmciopebentxp`, 45 migrations) + **Edge Functions** (the public webhook endpoint) + SSR auth. | 2 | free tier likely fine |
| **ffmpeg** | Extracts audio from the master so you never transcribe full video. | 3 | free |
| **Whisper** (local) | Transcription at `~/Productions` via `fswatch + ffmpeg + whisper`. | 3 | $0 |
| **OpenAI Whisper API** | Cloud transcription fallback. | 3 | ~$0.36/hr |
| **Anthropic Claude API** | Generates metadata (video + podcast profiles). | 4 | pennies/episode |
| **YouTube Data API v3** | `videos.insert` to publish, `search.list` to read recent uploads. | 5 | quota-cheap |
| **Rumble** | Auto-mirrors YouTube via channel sync (near-zero build). | 6 | none |
| **Fireside** | Podcast host. Read-only API → handoff card, manual MP3 upload. | 7 | none |
| **GSN on-demand** | Proprietary OTT/Roku. No API → handoff card. | 7 | none |
| **Vercel** | Hosts the Next.js 16 dashboard. | runs throughout | free tier |

### C. Learning resources (woven into the timeline)

| Resource | Why / when |
|---|---|
| **Latent Space** (podcast) | AI coding tools, agents, the Claude ecosystem. Start during Stage 0 — it gives you the vocabulary for everything below. |
| **The Cognitive Revolution** (podcast) | Agentic/autonomous AI workflows — exactly the agent + builder-subagent pattern you're using. Stage 0–1. |
| **Anthropic docs — Claude Code, MCP, Agent SDK** | Reference when wiring MCPs and the GSR Architect agent. Stage 0 + Stage 2. |
| **Supabase docs — Edge Functions, migrations** | Stage 2, when you build the webhook endpoint. |
| **YouTube Data API docs — audit/verification** | Stage 5, before you can publish public. |

---

## Part 2 — Off-limits (never touch without an explicit "yes, do X to Y")

These are non-negotiable. They are not in the build at any stage.

- **ProPresenter production machine** — GSN-PropRes, Tailscale `100.98.215.7`
- **ATEM / Bitfocus Companion** hardware
- **QNAP write access** — read-only SMB only
- **Notion workspace** — wiki-only
- (Retired) Earlier drafts treated `gsr-automation-v2` as read-only and staged new files in `gsr-blueprint`. That is reversed: **build directly in `gsr-automation-v2`**. This repo is the active target, not off-limits.

---

## Part 3 — The timeline (tools dropped in where they matter)

### Stage 0 — Setup & foundation _(before any pipeline code)_

**Tools introduced:** Claude Code (local), `ed3d-plan-and-execute`, GSR Architect agent, GitHub, 1Password CLI · **Learning:** Latent Space, The Cognitive Revolution, Anthropic Claude Code docs

**What you're building:** the workbench, not the product. A working local build environment where Claude can plan and execute against the real repo.

**Setup:**
1. On your Mac: `cd ~/Documents/GitHub/gsr-automation-v2 && git pull && claude`
2. The GSR Architect agent already ships in this repo at `.claude/agents/gsr-architect.md` and loads automatically (no install step).
3. Confirm 1Password CLI works: `op item get "Dropbox"` (etc.) — every later credential flows through this.
4. Generate the implementation plan: `/ed3d-plan-and-execute:start-implementation-plan @docs/2026-06-03-gsr-handoff.md .`
5. Listen to 1–2 episodes of Latent Space while this is happening — it makes the next 8 stages legible.

**Fragile parts:** building on stale local files. Always `git pull` before you start, `git push` when you stop.

**Done when:** `claude` opens with the GSR Architect agent available, the plan + branch exist, and `op` returns a credential.

---

### Stage 1 — Script upload + trailer-block parser

**Tools introduced:** none new (pure parsing) · **Input you must supply:** the real `gsr-interview-segment` skill output + one sample script

**What you're building:** upload an interview script → deterministically parse out the fenced `===GSR-META===` / `===LOWER-THIRDS===` block → episode metadata + 15 lower thirds. No generation; scripts are drafted in Claude Desktop.

**Setup:**
1. Get the real skill sample from yourself first — **this is the blocker.** The parser contract can't be finalized without it.
2. Build the parser against the fixed block format (handoff §10).
3. Strip the existing `/lower-thirds` page to: upload → see parsed LTs → review/approve.

**Fragile parts:** the trailer-block format is currently a strawman. If the real skill output differs, the parser breaks. Lock the sample before writing code.

**Risk card:** Weight 1 · Fragility 2 · Cost none.

**Done when:** you upload a real script and see the correct 15 lower thirds + episode IDs, zero manual entry.

---

### Stage 2 — Dropbox folder-watch trigger (+ audio companion)

**Tools introduced:** Dropbox API (full scope), Supabase Edge Functions, Supabase MCP · **Decision pending:** audio companion (settles cloud vs local run mode)

**What you're building:** a new master file landing in a flat per-show Dropbox folder fires a webhook into a Supabase Edge Function, which kicks off the pipeline.

**Setup:**
1. Create a Dropbox app (full-dropbox scope — masters live in existing show folders). Credentials → 1Password.
2. Deploy a Supabase Edge Function as the public HTTPS webhook endpoint (free). Cursor polling `/files/list_folder` is the fallback.
3. Define the **filename → episode mapping**: mostly `show_season_episode`. **GSM is the exception** — needs a manual transcript cross-reference (GSR vs GSM transcripts + upload date) to pair the episode.
4. **Recommended:** have whatever drops the master also drop a small **audio-only companion** beside it → stream ~30 MB not ~30 GB.

**Fragile parts:** large-file streaming is the failure-prone step. The audio companion fixes it. Webhook needs the public endpoint to be reachable.

**Risk card:** Weight 2 · Fragility 3 · Cost none.

**Done when:** dropping a file in the watched folder reliably creates/links an episode record.

---

### Stage 3 — Transcription

**Tools introduced:** ffmpeg, local Whisper (`~/Productions`), OpenAI Whisper API (fallback), Desktop Commander

**What you're building:** the master (or its audio companion) → audio extract → transcript attached to the episode.

**Setup:**
1. Extract audio with ffmpeg — never transcribe full video.
2. Route to local Whisper at `~/Productions` ($0) where the `fswatch + ffmpeg + whisper` watch already runs, OR the Whisper API (~$0.36/hr) if running in the cloud.
3. The audio companion from Stage 2 makes this fast/cheap/reliable regardless of run mode.

**Fragile parts:** without the companion, this inherits Stage 2's multi-GB pull problem.

**Risk card:** Weight 2 · Fragility 2 · Cost $0 local / ~$0.36-hr API.

**Done when:** a new master produces a transcript with no manual step.

---

### Stage 4 — Metadata generation (video + podcast profiles)

**Tools introduced:** Anthropic Claude API

**What you're building:** transcript → two metadata sets.
- **Video** (YouTube/Rumble/GSN): title with the **30%-shorter rule**, description, tags, chapters from transcript timecodes.
- **Podcast** (Fireside): separate audio-tuned title/description/show-notes.

**Setup:**
1. Reuse the repo's `PROMPT_LIBRARY.md` and `GSR_METADATA_PATTERN.md` for the prompt shape.
2. Bounded prompt → pennies per episode.

**Fragile parts:** low. Keep the two profiles genuinely separate, not one reused for both.

**Risk card:** Weight 1 · Fragility 2 · Cost ~pennies/ep.

**Done when:** each episode auto-shows a video metadata set and a podcast metadata set, both editable.

---

### Stage 5 — YouTube auto-publish

**Tools introduced:** YouTube Data API v3 · **Action you must clear:** the Google API audit

**What you're building:** approved episode → `videos.insert` publishes to YouTube; `search.list` reads recent uploads (feeds cadence + old-episode logic).

**Setup:**
1. Create the YouTube Data API project. Credentials → 1Password.
2. **Clear the Google audit.** New/unverified projects are locked to private-only until Google approves. **Only you can do this; do it early** — it has lead time.

**Fragile parts:** the audit gate is the whole risk. Until cleared, uploads land private.

**Risk card:** Weight 2 · Fragility 3 · Cost none (quota).

**Done when:** an approved episode publishes public on YouTube automatically.

---

### Stage 6 — Rumble via YouTube sync

**Tools introduced:** Rumble (channel sync, no API build)

**What you're building:** essentially nothing to code — turn on Rumble's "YouTube channel sync" so it auto-mirrors uploads.

**Setup:**
1. Enable channel sync in Rumble settings.
2. Skip the partner upload API (gated via `bd@rumble.com`) unless you need same-minute posting.

**Fragile parts:** depends on Stage 5 being live. That's it.

**Risk card:** Weight 1 · Fragility 2 · Cost none.

**Done when:** a YouTube publish shows up on Rumble without action.

---

### Stage 7 — Fireside + GSN handoff queue

**Tools introduced:** Fireside (read-only API), GSN (no API) — both as **handoff cards**

**What you're building:** the conveyor belt's manual half. Each becomes a card with the file + final metadata pre-staged and a "mark done" button. The manual half is a designed feature, not a gap.

**Setup:**
1. Fireside card: audio companion + podcast metadata profile pre-staged; you upload the MP3 via the web UI, click done.
2. GSN card: file + video metadata pre-staged; manual upload, click done.

**Fragile parts:** none technical — pure UI + pre-staged files. (Reminder: GSN shared infra stays off-limits.)

**Risk card:** Weight 1 · Fragility 1 · Cost none.

**Done when:** finished episodes show ready-to-post cards for Fireside and GSN with everything attached.

---

### Stage 8 — Source-of-Truth map + auto-fill

**Tools introduced:** Google Sheets (airing schedule), Gmail MCP (DNC), Rundown Creator MCP, web search (deceased sweep) · plus the `data-intake/` CSVs + `reconcile.py` already in the repo

**What you're building:** the verification model. The agent knows the authoritative source + fallback order for each field, prefills, and only interrupts you when even the top source is silent.

| Field | Primary | Rule |
|---|---|---|
| Air date | 2026 Airing Schedule Google Sheet | sheet wins |
| Cadence | YouTube (last 5 of each type) | inferred |
| Old episode | aired-segments registry | auto-tag + manual override |
| Deceased | live internet sweep | surface if ambiguous |
| **DNC** | email archive | **deferred — manual field + "unverified" marker** |
| Guest details | contact sheet + data-intake | auto-fill |
| Episode facts | data-intake CSVs + Supabase | reconcile.py splits |

**Setup:**
1. Wire each field to its primary source via the relevant MCP.
2. Reuse `reconcile.py`'s existing conflict/needs_human splits.
3. **DNC stays manual for now** (your call) — full email parse is the fragile sub-part, deferred.

**Fragile parts:** DNC-from-email. Everything else is resolvable from a clean source.

**Risk card:** Weight 3 · Fragility 3 · Cost low (web sweeps).

**Done when:** opening an episode shows fields prefilled from their authoritative sources, with the rare genuine gap flagged for you.

---

## Part 4 — Later phases (score when scoped)

| Feature | Tools it'll need | Note |
|---|---|---|
| Monologue / Basecamp ingestion | Basecamp skill + CLI | Needs a sample monologue with the link/graphics format first. Episode assignment stays manual. |
| Content clips + social posts | Claude API; existing `content_clips` / `social_posts` schema | Written from transcripts. |
| Outreach tracking | — | v1 = just track which guests were contacted. |
| Local research → dashboard sync | an intake route like existing `/import` | Sync Claude Desktop research in. Feasible, deferred. |

---

## Part 5 — What you still need to supply (unblocks the build)

1. **`gsr-interview-segment` skill output + one real sample script** → unblocks Stage 1.
2. **Audio-companion decision** → settles Stage 2/3 run mode.
3. **YouTube API audit cleared** → unblocks Stage 5 (start early, it has lead time).
4. **Sample monologue with Basecamp links/format** → unblocks the later monologue phase.
5. **Credentials in 1Password** for Dropbox, YouTube, Supabase, Basecamp.

---

## Part 6 — One-page sequence

```
Stage 0  Setup: Claude Code + agent + 1Password + GitHub + plan      [workflow]
Stage 1  Script upload + trailer-block parser                        [needs sample]
Stage 2  Dropbox watch + Supabase Edge Function (+ audio companion)  [decision pending]
Stage 3  Transcription: ffmpeg + Whisper                             [$0 local]
Stage 4  Metadata: Claude API, video + podcast profiles              [pennies/ep]
Stage 5  YouTube auto-publish                                        [clear audit first]
Stage 6  Rumble via YouTube sync                                     [near-zero build]
Stage 7  Fireside + GSN handoff cards                                [UI only]
Stage 8  Source-of-Truth map + auto-fill                             [DNC deferred]
─────────────────────────────────────────────────────────────────
Later    Monologue · Content/Social · Outreach · Research sync
```

Pull before you start. Push when you stop. Build directly in `gsr-automation-v2`. Honor the prime directives.
