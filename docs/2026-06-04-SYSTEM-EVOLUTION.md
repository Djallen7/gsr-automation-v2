# GSR Automation — System Evolution & Full Pipeline Reference
**Date:** 2026-06-04
**Purpose:** One document that explains how the GSR automation system has changed and morphed from first idea to today, and lays out every point in the pipeline (inputs, outputs, tools, integrations, external software). Built to support full-plan development by capturing both the past versions and the current understanding.
**Method:** Synthesized from a 14-agent sweep of all 7 repositories, the live Supabase database, the dashboard source code, and the full GitHub PR/commit history (2026-05-15 through 2026-06-04).

> Plain-English note for Daniel: this is the "where we've been and where we are" map. The first half is the story of how the plan changed three times. The second half is the working reference — every pipeline stage with what goes in, what comes out, and which tools touch it. Skim the headers; dive where you need detail.

---

## Part 1 — The Short Version

In roughly three weeks the system was redesigned twice and now sits on its third architecture. Each pivot was a real decision, but the decisions never fully propagated to every file — which is why some docs still describe dead infrastructure. This document states what is true *now* and preserves what each earlier era was, so nothing is lost.

**The three eras at a glance:**

| Era | Dates | Core idea | Database | Orchestration | Status |
|-----|-------|-----------|----------|---------------|--------|
| **Era 1 — Self-hosted** | May 15–20 | n8n on QNAP NAS, file-watchers, local SQLite | SQLite on NAS | Self-hosted n8n (Docker on QNAP) | Superseded |
| **Era 2 — Cloud-first / Notion** | May 20–23 | Security incident kills QNAP admin; go cloud | Notion databases | n8n.cloud + Mac Mini sync client | Superseded |
| **Era 3 — Supabase / Next.js** | May 23–now | Real app: dashboard + Postgres + AI | Supabase (Postgres) | Next.js server actions + API routes; Supabase cron | **Current** |

**The single throughline:** every era was about the same job — take an episode from script to graphics to multi-platform distribution with less manual work — but the *how* got progressively simpler and more cloud-native, moving away from hardware Daniel would have to maintain.

---

## Part 2 — The Evolution Story (how it changed and why)

### Era 1 — Self-hosted automation on the QNAP (May 15–20)

**The original plan.** Build a central automation system for GSR post-production: multi-platform uploads, transcription, AI metadata generation, approval workflows. The architecture was infrastructure-first:

- **n8n** (open-source workflow automation) self-hosted in **Docker on QNAP3** (NAS at 10.2.2.3)
- **SQLite** database living on the NAS
- **Docker services** on the NAS: Chokidar (file watcher), faster-whisper (transcription), Playwright (browser automation)
- **Two-NAS topology** (QNAP3 + QNAP5) for storage — documented in ADR-0009
- **Tailscale** for remote access to the NAS and dashboard
- **1Password Teams** for secrets, **UptimeRobot** for monitoring

**Inputs:** raw footage and graphics landing on the NAS; episode metadata typed by hand.
**Outputs (planned):** uploaded videos across 6 platforms, generated metadata, a tracking dashboard.
**Decision records:** ADR-0001 (n8n as orchestrator), ADR-0002 (defer high-risk platforms — Rumble, Fireside, Signiant, StreamHoster to Phase 2+), ADR-0003 (dashboard as tracking system with optional per-platform automation), ADR-0009 (two-NAS topology), ADR-0010 (file-watcher source of truth — left "proposed/deferred").

**Why it died:** On **2026-05-19** a security incident exposed QNAP admin credentials in a Claude session. IT rotated all passwords. Daniel lost (and no longer needed) QNAP admin. Self-hosting n8n on the NAS was no longer viable, and — more importantly — the whole "Daniel maintains server infrastructure" premise was wrong for a non-developer running a ministry production schedule.

### Era 2 — Cloud-first pivot, Notion as the database (May 20–23)

**ADR-0011 (accepted 2026-05-20)** recorded the first pivot and superseded ADR-0009 and ADR-0010:

- **n8n.cloud** (managed) replaces self-hosted n8n — no server to maintain
- **Notion** replaces SQLite — team-visible, GUI-first, no DB administration
- **QNAP3 + QNAP5** become **read-only SMB file sources only** — no admin, no installed software
- A **sync client** (Dropbox or Google Drive) on the Edit Bay Mac Mini watches the QNAP share and triggers cloud automation
- All heavy processing (transcription, AI, uploads) happens in the cloud

This era produced a real burst of work: a full Notion workspace build script (`notion_setup.py` / `notion_build_hub.py`) bootstrapping 6–7 databases (Episodes, Guests, Rundown Cues, Topics & Research, Team, Home Dashboard), CSV import bundles, n8n workflow templates, and several hub UI mockups.

**Why it pivoted again:** Notion is a fine wiki but a weak application backend — no real relational integrity, no row-level security, no server-side validation, awkward for the lower-thirds approval workflow that was becoming the actual first feature. Within days the decision was made to use Notion only as a wiki and move the real data layer to Supabase.

### Era 3 — Supabase + Next.js dashboard (May 23 → today)

**ADR-0012 (accepted 2026-05-23)** is the current architecture of record and supersedes everything before it:

- **Supabase** (hosted Postgres + Auth + Storage + Row-Level Security) is the database
- **Next.js 16** App Router dashboard (shadcn/ui, Supabase SSR), deployed on **Vercel**
- **Claude API** for lower-thirds generation and script extraction
- **Notion** demoted to wiki-only
- **QNAP** stays read-only; **ProPresenter / ATEM / Companion** stay off-limits to automation

From May 26–30 the build moved fast: 31 PRs merged in gsr-automation-v2, the dashboard shell + auth, upload, import, review/approve, regenerate, the full relational schema (45 migrations), 168 guest profiles, the prompt library, voice profile, and the script-to-lower-thirds extraction pipeline all landed.

**Where it is now (June 2026):** Feature 1 — Episode Graphics & Asset Tracker — is at **Stage 7 (real episode test)** with S03 Ep021–025 filmed May 28–29. All 48 Season 3 episodes are in the database.

> **Important correction captured in the audit:** Several current docs say Stage 7 is "blocked by a `lower_thirds` table schema mismatch." That blocker is a **phantom**. There is no `lower_thirds` table — the real table is `graphics`, and the `/api/import` Zod schema matches it correctly. The phantom traces to one stale line in `SUPABASE_SCHEMA_DESIGN.md` describing a `graphics → lower_thirds` rename as "pending." The blocker is operational (run the real test), not a code defect.

### Drift this evolution left behind (named, so the plan can fix it)

Decisions changed in one place but not everywhere. The notable contradictions still living in the repos:

- **QNAP admin password** (`admin1 / QnAp7627`) still sits in `MASTER_CONTEXT.md` in two repos plus a notion-import copy — even though admin access was revoked. **Critical: rotate, then strip.**
- **Hardcoded Rundown Creator key + token** in `skills/export_shows.py`. **Critical: rotate, then move to env vars.**
- **Notion-as-database** language still in both `MASTER_CONTEXT.md` files and all of the old `gsr-automation` repo.
- **Tailscale/SSH/server** setup steps still in `PROJECT_PLAN.md` and `INFRASTRUCTURE_INVENTORY.md`, though that path is permanently off-limits.
- **`config/production.json`** says `episode_count: 25` (DB has 48) and lists an old 4-platform set.
- **Broken macOS paths** (`/Users/claudefix/...`) in `gsr-blueprint/CLAUDE.md` and `davidrives-mail/README.md` silently disable the "don't write into v2" guardrail on this Linux environment.
- **ADRs 0001 / 0009 / 0010** lack SUPERSEDED banners pointing to 0012.

(The remediation for all of these lives in the cleanup plan; this document only records them as part of the evolution.)

---

## Part 3 — The Current System: Full Pipeline Reference

This is the working state as of 2026-06-04. The pipeline has two halves: the **production pipeline** (getting an episode made and its graphics approved — what's largely built) and the **distribution pipeline** (getting the finished episode onto platforms — largely designed, partly future).

### 3.0 Pipeline at a glance

```
SCRIPT (Claude Desktop / Rundown Creator)
   │  inputs: script text per segment
   ▼
EXTRACT (Claude API)  ──►  lower-thirds JSON (graphics + rejected)
   │
   ▼
IMPORT (/api/import, Zod + dry-run)  ──►  Supabase: episodes + graphics + variations
   │
   ▼
REVIEW (/lower-thirds)  approve / reject / regenerate / adopt
   │
   ▼
APPROVED (/approved, /lower-thirds/ready)  ──►  copy text into ProPresenter (manual, by hand)
   │
   ▼  ── future ──
DISTRIBUTION: Dropbox master ► transcription (Whisper) ► metadata (Claude) ►
   YouTube (auto) / Rumble (sync) / Fireside + GSN (handoff cards)
```

### 3.1 Script intake

- **Inputs:** Interview/segment scripts drafted in Claude Desktop, or pulled from **Rundown Creator** (the show's rundown tool, accessed via its API at `rundowncreator.com/davidrives/API.php`). Season 3 May-cycle rundown IDs: Show 1 = 79, Show 2 = 81, Show 3 = 83, Show 4 = 82, Show 5 = 84.
- **Tools/integrations:** Rundown Creator API (key + token); the dashboard's `/api/rc-import` and `/api/rc-explore` routes map RC segment names to the 12 internal segment values and handle RC's quirks (errors returned as HTTP 200 with a JSON `error` body; mis-decoded Latin-1 → UTF-8 fixes).
- **Outputs:** script text saved per `(episode, segment)` via `/api/scripts` into the `scripts` table.
- **Storage:** `scripts(episode_id, segment, script_text)`.

### 3.2 Lower-thirds extraction (Claude API)

- **Route:** `POST /api/extract-lower-thirds`.
- **Inputs:** `episode_id`, `segment` (12-value enum), `script_text` (10–60,000 chars). If an interview segment has a booked guest, the route pre-builds the guest chyron (`TITLE LASTNAME | ORGANIZATION | EXPERTISE`, ≤65 chars) and instructs Claude to use it as beat 1.
- **Model:** Claude (`ANTHROPIC_REGENERATE_MODEL`, default `claude-opus-4-7`), max 4096 tokens.
- **Outputs:** JSON `{ graphics[], rejected[] }`, wrapped into an `/api/import` payload returned to the client.
- **Rules enforced downstream:** ALL CAPS, ~65 char target, no commas/em dashes/periods, segment-specific beat patterns (see Part 4).

### 3.3 Import (validated, dry-run-first)

- **Route:** `POST /api/import` — the single source of truth for the ingest contract (Zod schema).
- **Inputs:** `{ episodes[], graphics[], rejected[], dry_run }`. Episodes keyed by `(season, episode_number)`; graphics carry `segment`, `l3_type` (15-value enum), `beat_number`, `primary`/`initial_text`, `var_1`, `var_2`, `source_doc`.
- **Validation:** Zod schema → every graphic must reference an episode in the payload → every graphic needs `primary` OR `initial_text` → dry-run reports new/updated/conflicts → **live mode refuses if any `(episode_id, segment, beat_number)` conflict exists** (operator resolves in source first).
- **Outputs (live):** upsert `episodes`, insert `graphics` (`status='pending_review'`), insert `graphics_variations` (variation 1, `generated_by='human'`).
- **Guardrail (mandatory):** dry-run first, show Daniel the summary, require "Type YES to import" before live. Never live-import without that confirmation in the same session.

### 3.4 Review & approval

- **Pages:** `/lower-thirds` (episode list + per-episode workspace), `/lower-thirds/[episode_id]` (segment slots, script save, extract, preview, existing graphics as cards).
- **Actions (server actions, RLS-protected):** `approveGraphic` (copies latest variation text → `approved_text`, sets approver + timestamp), `rejectGraphic`, `adoptVariation`, `setFont`.
- **Regeneration:** `POST /api/regenerate` calls Claude for 3 fresh variations at once, rate-limited to **20/user/hour**, feeding the last 8 prior texts to avoid repetition; inserts `graphics_variations` rows and tracks attempts in `regenerate_attempts`.
- **Outputs:** graphics flipped to `approved` / `rejected`; variations accumulate as history.

### 3.5 Approved queue → ProPresenter (manual handoff)

- **Pages:** `/approved` (copy button, ProPresenter toggle, per-graphic font editor) and `/lower-thirds/ready` (final operator queue grouped by episode/segment).
- **Atomic state:** `togglePropresenter` goes through SQL RPC `toggle_propresenter_added` (no read-modify-write race).
- **The hard boundary:** copying approved text into ProPresenter is **done by hand**. The production ProPresenter machine (GSN-PropRes) is off-limits to any automated connection until David explicitly approves a test-machine pathway. "The David Rule" governs this.

### 3.6 Episodes, guests, workflow (supporting data)

- **`/episodes`:** full episode CRUD — production status (planned → in_prep → shot → in_post → scheduled → aired), shoot/air dates, RC rundown ID, YouTube/Rumble URLs.
- **`/guests`:** 168-profile guest directory — expertise, credentials, YEC flag, deceased flag, do-not-contact, sensitivity flags, communication notes. Appearance count (from `episode_guests`) drives the outreach tier.
- **`/workflow`:** per-guest email lifecycle tracker built on the `v_episode_workflow` view — 6 timestamped email stages (confirmation, zoom link, day-before, post-shoot, pre-air, post-air YouTube) toggled via `markEmailSent` / `clearEmailSent`.
- **`/toolkit`:** the 20-prompt library rendered with live guest roster + today's date injected.
- **`/extract` and `/import`:** UI entry points to the extraction and import routes.

### 3.7 Distribution pipeline (designed; partly future)

This is the half that the **gsr-blueprint** workspace is for. The intended flow:

- **Trigger:** a broadcast master MP4 lands in Dropbox (`/GSR Production/...`, filename encodes show + episode). An audio-only companion file (~30 MB vs multi-GB master) is recommended to keep transcription cheap/fast.
- **Transcription:** stream audio to Whisper (local fswatch+ffmpeg+whisper already runs at `~/Productions`, or Whisper API ≈ $0.36/hr) → `transcripts` table.
- **Metadata:** Claude generates two profiles — **video** (YouTube title with the 30%-shorter rule, description, tags, chapters) and **podcast** (Fireside title/description/show notes).
- **Platforms (6 real distribution targets):** YouTube (auto-publish Monday 4 PM ET, category 28, scheduled), Rumble (syncs from YouTube — no API), Fireside (podcast, no upload API — handoff card), Signiant Media Shuttle → Real Life Network, StreamHoster (FTP feeding Roku/Apple TV/iOS/LG), Genesis Science Network (internal). Dropbox is the file-distribution root.
- **Tracking:** `distributions` table (one row per episode × platform × file version × status).
- **Known external blockers:** YouTube API audit (new projects locked to private until Google approves); Rumble and Fireside have no upload APIs (browser/manual or handoff); audio companion file needed to control transcription cost.

---

## Part 4 — The AI / Writing Layer (the editorial engine)

This is what makes the generated copy sound like the show rather than like generic AI. It is a **rules-based system derived from production data** (879 Claude sessions, ~1,991 sent emails, 200 real lower-thirds, 25 analyzed YouTube episodes), not invented preferences.

- **Voice profile** (`GSR_VOICE_PROFILE.md`): 5 narrative modes (Breaking News, Wonder, Stakes, Curiosity, Narrative) that must rotate — never the same mode twice in one episode; 7th-grade reading level; ≤20-word teleprompter sentences; tension-first hooks; Scripture never before the monologue midpoint; locked verbatim show open and sign-off.
- **Lower-thirds style** (`LOWER_THIRDS_STYLE_GUIDE.md`): ALL CAPS, 65-char target, no commas/em dashes/sentence periods/slashes/brackets; pipe `|` only in chyrons and the ministry CTA; colon for label:claim beats. The "2+15" interview package = topic banner + guest chyron + 15 progressing discussion beats. Fixed ministry CTA: `SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990`.
- **Prompt library** (`PROMPT_LIBRARY.md`, surfaced at `/toolkit`): 20 production prompts spanning research, scripts, lower-thirds, YouTube metadata, the full guest-email lifecycle (cold outreach → booking → reminders → thank-you → follow-up), graphics assignment/sourcing, distribution checklist, RC population, and episode metadata JSON.
- **Email voice system** (`EMAIL_VOICE_SYSTEM_PROMPT.md`): 4 relationship tiers where warmth is signaled by *compression* (recurring guests get shorter emails, not chattier); banned AI tells ("I hope this email finds you well", em dashes, fact-dump openers); sign-off almost always "Best,".
- **YouTube metadata pattern**: Monday 4 PM ET publish, category 28 (Science & Tech), 9 anchor tags + 10–18 topical, Cedarville sponsor line through Ep024 only.
- **Subagent:** `gsr-editorial` enforces the above for any on-air copy task.

**Documented AI failure modes the system actively guards against:** statement-driven (not tension-driven) hooks, triplet-rhythm overuse, producing multiple options when one was asked for, long preamble before copy, fabricated credentials, context contamination across episodes, repeating a toss device, undershooting character counts, and pastoral warmth bleeding outside the Ministry Report.

---

## Part 5 — The Repositories (roles in the system)

| Repo | Role | State |
|------|------|-------|
| **gsr-automation-v2** | The live system — dashboard, Supabase, all current docs | **Active** (Era 3) |
| **gsr-blueprint** | Staging workspace for designing the distribution pipeline & GSR Architect agent | Active (design) |
| **gsn-subchannel-campaign** | Station-outreach campaign to place GSN on Christian-TV subchannels (73 stations, 4 tiers) | Active (pre-launch) |
| **skills** | Anthropic skills monorepo + `export_shows.py` (Rundown Creator export) | Active (utility) |
| **davidrives-mail** | Stdlib-only IMAP/SMTP CLI for `dallen@davidrives.com` | Active (untested live) |
| **gsr-automation** | The original Era-1/Era-2 repo (docs only, no code) | **To archive** |
| **gsrguestportal** | Static guest-onboarding site (Bootstrap, last touched Feb 2025) | **To archive / dormant** |

**gsn-subchannel-campaign** in brief: a hand-crafted, plaintext-from-webmail cold-email campaign. Cowork drafts; Daniel sends personally. Locked barter offer (270 hours of programming + free receiver/IP feed + one subchannel slot, $0 fee, non-exclusive, 30-day cancel). Social proof anchored on WGGS-TV and WGGN-TV (always phrased "including…", never bounding the count at two). Warm intros first (30%+ reply) before cold (5–8%). Landing page at `davidrivesministries.org/stations`.

**davidrives-mail** in brief: Python 3.11 stdlib (`imaplib`/`smtplib`), IMAP 993 SSL + SMTP 465 TLS, password pulled live from 1Password every invocation. Shipped but **never passed its live Dovecot smoke test** — don't rely on it until retested.

---

## Part 6 — External Software & Integrations Inventory

**Current (Era 3):**
- **Supabase** — Postgres + Auth + Storage + RLS (project `lafkbxypmciopebentxp`, 45 migrations)
- **Next.js 16 / React 19 / shadcn-ui** — dashboard, deployed on **Vercel**
- **Anthropic Claude API** (`@anthropic-ai/sdk`) — `claude-opus-4-7` for regenerate/extract
- **Zod** — runtime validation in every API route
- **Rundown Creator API** — script/rundown source
- **Whisper** (local fswatch+ffmpeg+whisper at `~/Productions`; or API) — transcription
- **1Password CLI (`op`)** — all credential retrieval
- **QNAP SMB** — read-only file mirror
- **GitHub** — source control (org `Djallen7`)
- **MCP servers in use:** Supabase, Rundown Creator (flaky), Vercel, GitHub; Google Sheets via Composio (unreliable — prefer native)

**Distribution targets (real):** YouTube (API, auto), Rumble (no API, sync), Dropbox, Fireside.fm (no upload API), Signiant Media Shuttle → Real Life Network, StreamHoster (FTP → Roku/Apple TV/iOS/LG), Genesis Science Network (internal).

**Superseded / historical (Era 1–2):** n8n (self-hosted then n8n.cloud), Notion as database, SQLite, Tailscale, Chokidar, Playwright, faster-whisper-on-NAS, two-NAS topology, UptimeRobot. n8n workflow templates and Notion setup scripts remain in the repo as dead weight slated for removal.

**Off-limits to automation (non-negotiable):** ProPresenter production machine (GSN-PropRes), ATEM, Bitfocus Companion, QNAP write/admin, Notion workspace (wiki-only), Tailscale/direct-server access.

---

## Part 7 — Where This Points Next

The current system has the **production-side** lower-thirds pipeline essentially built and sitting at its first real-episode test. The **distribution-side** pipeline (Dropbox → transcription → metadata → multi-platform) is designed in gsr-blueprint but not yet built. The natural next deliverables, per the roadmap and blueprint handoff:

1. Run the real Stage-7 episode test (the only thing "blocking" it is operational, not code).
2. Build the distribution slice: Dropbox watch → Whisper transcript → Claude metadata → YouTube scheduled publish, with Fireside/GSN as handoff cards.
3. Stand up the Source-of-Truth Map + GSR Architect agent in gsr-blueprint so data prefills from authoritative sources and only interrupts Daniel when every source is silent.
4. Clean up the drift (rotate the two live secrets, strip them, reconcile the stale docs, archive the two dead repos) so the map stays trustworthy.

---

*Compiled 2026-06-04 from a 14-agent sweep across gsr-automation-v2, gsr-automation, gsr-blueprint, gsn-subchannel-campaign, skills, davidrives-mail, and gsrguestportal, plus the live Supabase schema, dashboard source, and full GitHub history.*
