# GSR Automation — System Evolution & Full Pipeline Reference
**Date:** 2026-06-04
**Purpose:** One document that explains how the GSR automation system has changed and morphed from first idea to today, and lays out every point in the pipeline (inputs, outputs, tools, integrations, external software). Built to support full-plan development by capturing both the past versions and the current understanding.
**Method:** Synthesized from a 14-agent sweep of all 7 repositories, cross-checked against the live Supabase project (`lafkbxypmciopebentxp`, 45 migrations verified via `list_migrations`/`list_tables`), the dashboard source code, and the full GitHub PR/commit history (2026-05-15 → 2026-06-04).

> Plain-English note for Daniel: this is the "where we've been and where we are" map. Part 1 is the short version. Part 2 is the story of how the plan changed three times. Parts 3–6 are the working reference — every pipeline stage with what goes in, what comes out, and which tools touch it. Part 7 is the honest list of things that still contradict each other, with exact file locations so they can be fixed. Skim the headers; dive where you need detail.

---

## Part 1 — The Short Version

In roughly three weeks (May 15 → June 4, 2026) the system was redesigned twice and now sits on its third architecture. Each pivot was a real, dated decision — but the decisions never fully propagated to every file, which is why some docs still describe dead infrastructure. This document states what is true *now* and preserves what each earlier era was, so nothing is lost.

| Era | Dates | Core idea | Database | Orchestration | Status |
|-----|-------|-----------|----------|---------------|--------|
| **Era 1 — Self-hosted** | May 15–20 | n8n on QNAP NAS, file-watchers, local SQLite | SQLite on NAS | Self-hosted n8n (Docker on QNAP) | Superseded |
| **Era 2 — Cloud-first / Notion** | May 20–23 | Security incident kills QNAP admin; go cloud | Notion databases | n8n.cloud + Mac Mini sync client | Superseded |
| **Era 3 — Supabase / Next.js** | May 23 → now | Real app: dashboard + Postgres + AI | Supabase (Postgres) | Next.js server actions + API routes; Supabase pg_cron/pg_net | **Current** |

**The single throughline:** every era was about the same job — take an episode from script to graphics to multi-platform distribution with less manual work — but the *how* got progressively simpler and more cloud-native, moving away from hardware Daniel would have to maintain.

**Where it actually stands today (verified against the live DB):** the Supabase backend has **18 tables, 45 migrations, 2 views, 3 functions, 3 triggers, 1 storage bucket**. `episodes` = 48 rows, `guests` = 175 rows, and **`graphics` = 0 rows**. That last number is the real story of "Stage 7": the lower-thirds pipeline is fully built but **no graphics row has ever landed in production yet** — the first real-episode import has not been completed. It is an operational milestone, not a code defect (see the phantom-blocker note below).

---

## Part 2 — The Evolution Story (how it changed and why)

### Era 1 — Self-hosted automation on the QNAP (May 15–20)

**The original plan.** Build a central automation system for GSR post-production: multi-platform uploads, transcription, AI metadata generation, approval workflows. The architecture was infrastructure-first, defined in the original `gsr-automation` repo (which to this day contains **only documentation — every code folder is a `.gitkeep` placeholder; nothing was ever built there**):

- **n8n** self-hosted in **Docker on QNAP3** (NAS at 10.2.2.3) as the workflow orchestrator
- **SQLite** (`better-sqlite3`) as the status database on the NAS
- **Docker services** on the NAS: Chokidar (file watcher), faster-whisper (transcription), Playwright (browser automation), BullMQ+Redis (job queue), ntfy (notifications)
- **Two-NAS topology** (QNAP3 automation host + QNAP5 storage) — ADR-0009
- **Tailscale** for remote access (no custom auth layer — ADR-0006)
- **1Password Teams** for secrets, **UptimeRobot** for monitoring
- A phased **Phase 1–4 plan** with hard exit criteria (Phase 1: 10 consecutive episodes hands-off, Miryam independent, <5% error rate, <1hr/wk maintenance, all runbooks cold-start tested)

**Decision records (Era 1):** ADR-0001 (n8n orchestrator + Next.js dashboard + SQLite + Docker on NAS), ADR-0002 (defer Rumble/Fireside/Signiant/StreamHoster to Phase 2+), ADR-0003 (dashboard is a *tracking system* that sometimes automates, not the reverse), ADR-0009 (two-NAS topology), ADR-0010 (file-watcher source of truth — left "Proposed/deferred", never resolved).

**Open-source stack specified:** Chokidar, BullMQ+Redis, better-sqlite3, faster-whisper, Vercel AI SDK, youtubeuploader (porjo), dropbox-sdk-js, Kiranism/next-shadcn-dashboard-starter, ntfy; Playwright (Phase 2, Signiant + Rumble fallback); basic-ftp (Phase 3, StreamHoster). Considered and rejected: tokland/youtube-upload (GPL), whisper.cpp, WhisperX, LangChain.js, Temporal.io, lowdb.

**Why it died:** On **2026-05-19** a security incident exposed QNAP admin credentials in a Claude session and transmitted them to Anthropic's servers. IT rotated all credentials across 40+ connected devices. Daniel lost (and no longer needs) QNAP admin. Self-hosting on the NAS was no longer viable, and — more importantly — the whole "Daniel maintains server infrastructure" premise was wrong for a non-developer running a ministry production schedule. David imposed a security framework: isolated connections only, nothing that can cascade to production broadcast gear.

### Era 2 — Cloud-first pivot, Notion as the database (May 20–23)

**ADR-0011 (accepted 2026-05-20)** recorded the first pivot and superseded ADR-0009 and ADR-0010:

- **n8n.cloud** (managed) replaces self-hosted n8n — no server to maintain
- **Notion** replaces SQLite — team-visible, GUI-first, no DB administration
- **QNAP3 + QNAP5** become **read-only SMB file sources only** — no admin, no installed software
- A **sync client** (Dropbox or Google Drive) on the Edit Bay Mac Mini watches the QNAP share and triggers cloud automation
- All heavy processing (transcription, AI, uploads) happens in the cloud

This era produced a real burst of work, all of which is now dead weight in the v2 repo (see Part 5):
- **10 `scripts/notion_*.py`** that bootstrapped a Notion workspace: `notion_setup.py` (6 core DBs + seeds), schema-update/add-DB scripts (Platform Uploads, Metadata Drafts, Graphics Tracking), `notion_add_relations.py`, seeders, `notion_cleanup_duplicates.py`, `notion_health_check.py` — all hitting the Notion REST API with `NOTION_TOKEN`.
- **7 n8n workflow templates** (`workflows/templates/*.json`): basecamp-task-sync, dropbox-asset-sync, episode-checklist-create, episode-status-sync, graphics-reminder, weekly-report, youtube-upload-log. **None were ever deployed** — they carry unresolved `$vars` placeholders and a `_gsr_notes` setup TODO block, and landed in a single "Notion foundation build" commit with no activation.
- The **`notion-import/`** payload: setup guide, `database_ids.json` (9 Notion DB UUIDs), 6 CSVs (only Guests.csv with 20 contacts and ADRs.csv have real data), and a Production Wiki ZIP + extracted copy.

**Why it pivoted again:** Notion is a fine wiki but a weak application backend — no real relational integrity, no row-level security, no server-side validation, awkward for the lower-thirds approval workflow that was becoming the actual first feature. Within days the decision was made to use Notion only as a wiki and move the real data layer to Supabase.

### Era 3 — Supabase + Next.js dashboard (May 23 → today)

**ADR-0012 (accepted 2026-05-23)** is the current architecture of record and supersedes everything before it:

- **Supabase** (hosted Postgres + Auth + Storage + Row-Level Security + Edge Functions) is the database
- **Next.js 16** App Router dashboard (React 19, shadcn/ui, Supabase SSR), deployed on **Vercel**
- **Claude API** for lower-thirds generation and script extraction
- **Notion** demoted to wiki-only (CLAUDE.md: "do not extend the pre-pivot `scripts/notion_*.py` code")
- **QNAP** stays read-only; **ProPresenter / ATEM / Companion / Tailscale** stay off-limits to automation

**The build blitz (verified via GitHub MCP):** the new `gsr-automation-v2` repo was spun up around May 21–22, and from May 26–30 the dashboard was built stage-by-stage — roughly 30+ PRs merged in ~48 hours: dashboard shell + auth (May 26) → upload, review/regenerate/approve, text import, tooling (May 27) → the full relational schema, 175 guest profiles, prompt library, voice profile, UI polish (May 28) → health checks, editorial agent, script-to-lower-thirds extraction, guests/workflow/episodes pages (May 30).

**PR accounting (v2, verified):** **41 PRs total — 31 merged, 8 closed-without-merging (superseded experiments), 2 open drafts** (#40 "foundation cleanup", #41 "cross-repo audit and recovery roadmap" — this document's sibling). 85 commits on `main` since May 15. Earlier docs claiming "54 PRs / 4 drafts in a merge queue" are wrong.

**Where it is now (June 2026):** Feature 1 — Episode Graphics & Asset Tracker — is at **Stage 7 (real episode test)** with S03 Ep021–025 filmed May 28–29. All 48 Season 3 episodes are in the database; `graphics` is still empty.

> **The phantom blocker (resolved).** Several current docs say Stage 7 is "blocked by a `lower_thirds` table schema mismatch." This is a **phantom**, and the fresh sweep pinned the exact cause. **There is no `lower_thirds` table and there never has been.** The first migration's *filename* is `feature_1_lower_thirds_schema.sql`, but its body creates a table named **`graphics`**. All 13 dashboard query sites use `.from('graphics')`; zero use `lower_thirds`. The contradiction lives only as aspirational prose in `docs/SUPABASE_SCHEMA_DESIGN.md` (lines 14, 87-89, 121, 215, 538-540) describing a `graphics → lower_thirds` rename as "pending." That doc is also stale at "43 migrations" (live is 45). **The fix is documentation, not code:** either perform the rename for real (one migration + the 13 call sites together) or delete the "pending rename" language. Any import failure is operational, not a column mismatch.

---

## Part 3 — The Current System: Full Pipeline Reference

Two halves: the **production pipeline** (script → approved graphics → ProPresenter — largely built) and the **distribution pipeline** (finished episode → platforms — designed in gsr-blueprint, largely future).

### 3.0 Pipeline at a glance

```
SCRIPT (Claude Desktop / Rundown Creator)
   │  inputs: script text per segment
   ▼
EXTRACT (Claude API, /api/extract-lower-thirds)  ──►  lower-thirds JSON {graphics, rejected}
   │
   ▼
IMPORT (/api/import, Zod + dry-run, "Type YES")  ──►  Supabase: episodes + graphics + variations
   │
   ▼
REVIEW (/lower-thirds)  approve / reject / regenerate (Claude, 3 variations) / adopt
   │
   ▼
APPROVED (/approved, /lower-thirds/ready)  ──►  copy text into ProPresenter BY HAND
   │
   ▼  ── future (gsr-blueprint design) ──
DISTRIBUTION: Dropbox master (+audio companion) ► Whisper transcript ► Claude metadata ►
   YouTube (auto) / Rumble (YouTube sync) / Fireside + GSN (manual handoff cards)
```

### 3.1 Script intake
- **Inputs:** scripts drafted in Claude Desktop, or pulled from **Rundown Creator** (`rundowncreator.com/davidrives/API.php`). Season 3 May rundown IDs: Show 1 = 79, Show 2 = 81, Show 3 = 83, Show 4 = 82, Show 5 = 84.
- **Tools:** `/api/rc-explore` (passthrough: getRundowns / getRows / getScript) and `/api/rc-import` (maps RC segment names → 12 internal segments via `RC_SEGMENT_MAP`, fixes Latin-1→UTF-8 mojibake). RC quirk: errors return HTTP 200 with a JSON `error` body.
- **Outputs:** `/api/scripts` upserts script text per `(episode_id, segment)` into the `scripts` table; this fires the `on_script_save` trigger → `notify_script_extract()` → the `extract-on-script-save` Edge Function (auto-extraction loop).

### 3.2 Lower-thirds extraction (Claude API)
- **Route:** `POST /api/extract-lower-thirds`. Inputs: `episode_id`, `segment` (12-value enum), `script_text` (10–60,000 chars). For interview segments with a booked guest it pre-builds the chyron (`NAME | ORG | FIELD`, truncated at 65). Model: `ANTHROPIC_REGENERATE_MODEL` (default `claude-opus-4-7`), `max_tokens: 4096`. **No DB write** — returns a payload shaped for `/api/import`.

### 3.3 Import (validated, dry-run-first)
- **Route:** `POST /api/import` — the single source of truth for the ingest contract (Zod). Auth required (401 otherwise).
- **Schema:** `{ episodes[], graphics[], rejected[], dry_run }`. Episodes keyed by `(season, episode_number)`. Graphics carry `segment` (12-enum), `l3_type` (15-value CHECK), `beat_number`, `primary`/`initial_text` (1–200, at least one required), `var_1`, `var_2`, `source_doc`.
- **Validation:** orphan graphics (episode not in payload) → 400; dry-run reports new/updated/conflicts; **live refuses on any `(season, episode_number, segment, beat_number)` conflict → 409** (operator resolves in source first).
- **Writes (live):** upsert `episodes`; insert `graphics` (`status='pending_review'`, `current_image_url='__text_only__'`, `uploaded_by=user.id`); insert `graphics_variations` (variation 1, `generated_by='human'`). Partial variation failure → 207.
- **Guardrail (mandatory):** dry-run first, show the summary, require "Type YES to import" before live, in the same session.

### 3.4 Review & approval
- **Pages:** `/lower-thirds` (episode list with `N/12 scripts` + pending/approved badges); the per-episode workspace component (RC pull + 12 segment slots + extraction + GraphicCard review).
- **Actions (server actions):** `approveGraphic` (copies latest variation → `approved_text`), `rejectGraphic`, `adoptVariation`, `setFont`.
- **Regeneration:** `POST /api/regenerate` calls Claude for **3 variations per call**, rate-limited **20/user/hour** (tracked in `regenerate_attempts`), feeding the last 8 prior texts to avoid repetition.

### 3.5 Approved queue → ProPresenter (manual handoff)
- **Pages:** `/approved` (copy button, ProPresenter toggle, per-graphic font editor — default `Collaborate Medium 55pt #FFFFFF`) and `/lower-thirds/ready` (final operator queue).
- **Atomic state:** `togglePropresenter` → SQL RPC `toggle_propresenter_added` (no read-modify-write race).
- **Hard boundary:** copying approved text into ProPresenter is done **by hand**. The production ProPresenter machine (GSN-PropRes, 100.98.215.7) is off-limits to automation until David explicitly approves a test-machine pathway ("The David Rule").

### 3.6 Episodes, guests, workflow (supporting data)
- **`/episodes`:** episode CRUD — production status (planned → in_prep → shot → in_post → scheduled → aired), shoot/air dates, RC rundown ID, YouTube/Rumble URLs.
- **`/guests`:** 175-row guest directory — expertise, credentials, YEC flag, deceased flag, do-not-contact, sensitivity flags. Appearance count (from `episode_guests`) drives outreach tier.
- **`/workflow`:** per-guest email lifecycle on the `v_episode_workflow` view — 6 timestamped stages (confirmation, zoom link, day-before, post-shoot, pre-air, post-air YouTube).
- **`/toolkit`:** the 20-prompt library with live guest roster + today's date injected.

### 3.7 Distribution pipeline (designed in gsr-blueprint; partly future)
- **Trigger:** broadcast master MP4 lands in Dropbox (`/GSR Production/...`, flat per-show folders; a filename convention is still an open question). An **audio-only companion file** (~30 MB vs multi-GB master) is the recommended fix so transcription is cheap/fast — this is the key design decision still pending.
- **Transcription:** local Whisper at `~/Productions` (existing fswatch+ffmpeg+whisper, $0) or Whisper API (~$0.36/hr) → `transcripts` table.
- **Metadata (Claude):** two profiles — **video** (YouTube title with the 30%-shorter rule, description, tags, transcript-timecode chapters) and **podcast** (Fireside title/description/show notes).
- **Platforms:** YouTube (Data API, auto-publish Monday 4 PM ET, category 28, scheduled); Rumble (mirror via YouTube channel sync — no upload API); Fireside (no upload API — manual handoff card); GSN on-demand (no public API — handoff card); Signiant Media Shuttle → Real Life Network; StreamHoster (FTP → Roku/Apple TV/iOS/LG). Tracked in `distributions`.
- **External blockers:** YouTube API audit (new projects locked to private until Google clears it); Rumble/Fireside have no upload APIs; audio companion needed to control cost.

---

## Part 4 — The Database Layer (verified against the live project)

**Project:** `lafkbxypmciopebentxp`. **45 migrations**, built in three waves between May 26–28.

- **Wave 1 (May 26) — Feature 1 MVP:** `episodes`, `graphics`, `graphics_variations`; the 2 enums; RLS; the `lower-thirds` storage bucket; `propresenter_added`; `regenerate_attempts`; the `toggle_propresenter_added` RPC.
- **Wave 2 (May 27) — hardening + v2 extraction:** font fields; `(season, episode_number)` unique; audit fixes (indexes, plpgsql RPC, status NOT NULL); `show_intro` segment added; `l3_type` (15-value CHECK) + `var_1`/`var_2`.
- **Wave 3 (May 28) — full production hub:** `guests`, `episode_guests`, `interview_prep`, `distributions`, `transcripts`, `content_clips`, `social_posts`, `premade_library`, `shoot_sessions`, `articles` (8-dimension scoring + generated `total_score`), `production_graphics`, `outreach_drafts`, `booking_pipeline`, `email_threads`; the two views; advisor cleanup (views set `security_invoker`, RLS auth calls wrapped in `(select auth.uid())` for performance). Later same-cycle: `scripts` table, `pg_cron`+`pg_net`, and the `app_config` + `notify_script_extract()` + `on_script_save` auto-extraction trigger.

**Final live schema:** 18 tables (all RLS-enabled), 2 enums (`graphic_status` 4 values; `graphic_segment` 12 values), 2 views (`v_episode_master`, `v_episode_workflow`, both `security_invoker`), 3 functions (`toggle_propresenter_added`, `set_updated_at`, `notify_script_extract`), 3 triggers, extensions `pg_cron`/`pg_net`, 1 storage bucket (`lower-thirds`, 5 MB, image/png — now vestigial after the text-only pivot, 0 objects).

**RLS posture:** enabled everywhere, but uniformly **permissive-for-authenticated** (USING true) — no producer-vs-crew row scoping yet (the original migration notes "tightened producer-only policies come later"). No DELETE policies anywhere. Exceptions: `regenerate_attempts` is owner-scoped; `app_config` has RLS on with **zero policies** (service-role-only — holds the extract webhook secret).

**Live row counts:** `episodes` 48, `guests` 175, **`graphics` 0**, all other tables empty.

---

## Part 5 — The AI / Writing Layer (the editorial engine)

A **rules-based system derived from production data** (879 Claude sessions, 1,991 sent emails, 200 real lower-thirds from S3 Ep16–24, 25 analyzed YouTube episodes) — not invented preferences.

- **Voice profile** (`GSR_VOICE_PROFILE.md`, 503 lines): 5 narrative modes (Breaking News, Wonder, Stakes, Curiosity, Narrative) that must rotate — never the same mode twice in one episode; 7th-grade level; ≤20-word teleprompter sentences; tension-first hooks; Scripture never before the monologue midpoint. Locked verbatim lines: the show open ("Good evening and welcome to The Genesis Science Report…"), the sign-off ("…keep looking up. I'm David Rives. Truly, the heavens declare the glory of God."), the THD/GSM toss closer ("Let's take a look, right now."), and the donation phone close (**931-212-7990**).
- **Lower-thirds style** (`LOWER_THIRDS_STYLE_GUIDE.md`, 509 lines): ALL CAPS, 65-char target, no commas/em dashes/sentence periods/slashes/brackets; pipe `|` only in chyrons and the ministry CTA; colon for label:claim beats. The **2+15 standard** (topic banner + guest chyron + 15 progressing discussion beats). Fixed ministry CTA: `SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990`.
- **Prompt library** (`PROMPT_LIBRARY.md`, 908 lines; surfaced at `/toolkit`): 20 production prompts — research, scripts, lower-thirds (interview/monologue/ministry), YouTube metadata, the full guest-email lifecycle, graphics assignment/sourcing, distribution checklist, RC population, episode metadata JSON.
- **Email voice system** (`EMAIL_VOICE_SYSTEM_PROMPT.md`): 4 relationship tiers where warmth is signaled by **compression** (recurring guests get shorter emails, not chattier); banned AI tells ("I hope this email finds you well", em dashes, fact-dump openers); sign-off almost always "Best,"; always signed Daniel Allen, never David Rives.
- **YouTube metadata pattern** (`GSR_METADATA_PATTERN.md`): Monday 4 PM ET publish, 9 anchor tags + 10–18 topical, Cedarville sponsor line through Ep024 only.
- **Subagent:** `gsr-editorial` (`agents/gsr-editorial.md`) enforces the above for any on-air copy task. (`gsr-pipeline` and `gsr-supabase` are referenced in CLAUDE.md but live in `~/.claude/agents/`.)

**Documented AI failure modes the system actively guards against (10):** statement-driven (not tension-driven) hooks; triplet-rhythm overuse; producing multiple options when one was asked for; long preamble before copy; fabricated credentials; context contamination across episodes; repeating a toss device; lower-thirds character-count drift; pastoral warmth bleeding outside the Ministry Report; topic-list teases.

---

## Part 6 — Repositories & External-Software Inventory

| Repo | Role | State |
|------|------|-------|
| **gsr-automation-v2** | The live system — dashboard, Supabase, all current docs | **Active** (Era 3) |
| **gsr-blueprint** | Staging workspace for the FUTURE distribution pipeline + the GSR Architect agent | Active (design; `mock/` and `agent/` folders not yet created) |
| **gsn-subchannel-campaign** | Station-outreach campaign placing GSN on Christian-TV subchannels (73 stations, 4 tiers) | Active (pre-launch) |
| **skills** | Anthropic skills monorepo + `export_shows.py` (Rundown Creator export) | Active (utility) |
| **davidrives-mail** | Stdlib-only IMAP/SMTP CLI for `dallen@davidrives.com` | Active (shipped, never passed a live Dovecot smoke test) |
| **gsr-automation** | The original Era-1/Era-2 repo (docs only, no code) | **To archive** |
| **gsrguestportal** | Static guest-onboarding site (Bootstrap 4.4.1, single commit Feb 2025) | **To archive / dormant** |

**gsr-blueprint** designs two things: the distribution pipeline above, and the **GSR Architect agent** (the "keystone deliverable") that holds system knowledge and owns a **Source-of-Truth Map** — a per-field strategy for where each fact's truth lives (air date → Google Sheet; deceased → live internet sweep; DNC → email archive, the hard one; guest data → contact sheet + CSVs) plus fallback order, so the agent prefills and only interrupts Daniel when every source is silent. A `reconcile.py` (in the real repo's `data-intake/`, not blueprint) is described as splitting `.conflicts` / `.needs_human` / `.s02_parked` — design-stage, not verified.

**gsn-subchannel-campaign:** a hand-crafted, plaintext-from-Roundcube cold-email campaign. Cowork drafts; Daniel sends personally. Locked barter offer (270 hours of programming + free receiver/IP feed + one subchannel slot, $0 fee, non-exclusive, 30-day cancel). Social proof anchored on WGGS-TV and WGGN-TV (always phrased "including…", never bounding the count at two). Warm intros first (~30–50% reply) before cold (5–15%). Tools: Roundcube, FCC public files, RabbitEars.info, a WordPress/Elementor landing page at `davidrivesministries.org/stations`, the prospect `.xlsx`. NRB 2027 (Feb 23–26) is the in-person hub.

**External software & integrations — current (Era 3):** Supabase (Postgres/Auth/Storage/RLS/Edge Functions/pg_cron/pg_net), Next.js 16 + React 19 + shadcn/ui on Vercel, Anthropic Claude API (`@anthropic-ai/sdk` ^0.98.0, `claude-opus-4-7`), Zod ^4, Rundown Creator API, Whisper (local or API), 1Password CLI, GitHub. MCP servers in use: Supabase, Rundown Creator (flaky), Vercel, GitHub; Google Sheets via Composio (unreliable — prefer native).

**Distribution targets (real):** YouTube (API, auto), Rumble (no API, sync), Dropbox, Fireside.fm (no upload API), Signiant → Real Life Network, StreamHoster (FTP), Genesis Science Network (internal).

**Superseded / historical (Era 1–2):** n8n (self-hosted → n8n.cloud), Notion as database, SQLite, Tailscale, Chokidar, Playwright, faster-whisper-on-NAS, two-NAS topology, BullMQ/Redis, ntfy, UptimeRobot. The 7 n8n templates and 10 Notion scripts remain in the repo as dead weight (Part 7).

**Off-limits to automation (non-negotiable):** ProPresenter production machine (GSN-PropRes), ATEM, Bitfocus Companion, QNAP write/admin, Notion workspace (wiki-only), Tailscale/direct-server access.

---

## Part 7 — Drift & Contradictions (with exact locations, for the cleanup plan)

The evolution left decisions stranded in old files. The fresh sweep verified each of these:

**Critical — live secrets in committed files (rotate, then strip; deletion alone won't purge git history):**
- QNAP admin username+password pair — `gsr-automation-v2/docs/MASTER_CONTEXT.md:113` and `gsr-automation/docs/MASTER_CONTEXT.md:112` (also referenced as a known "should rotate" open item in both). Same credential class whose exposure triggered ADR-0011.
- Rundown Creator `API_KEY` + `API_TOKEN` — `skills/export_shows.py:5-6` (also leaked via URL query params on every request).

**High — stale architecture language:**
- "Notion = database" persists in both `MASTER_CONTEXT.md` files and across the entire `gsr-automation` repo.
- Tailscale/SSH/server-setup steps remain in `gsr-automation` `PROJECT_PLAN.md`, `INFRASTRUCTURE_INVENTORY.md`, `SESSION_HANDOFF.md` (the path is now permanently off-limits).
- Broken macOS paths (`/Users/claudefix/...`, `~/Documents/GitHub/...`) disable the "don't write into v2" guardrail on this Linux host: `gsr-blueprint/CLAUDE.md:7,17,19`, `gsr-blueprint/docs/2026-06-03-gsr-handoff.md:10,31,41,119,265`, the build-here checklist, and `davidrives-mail/README.md:18,19,21`.

**High — the phantom blocker:** `docs/SUPABASE_SCHEMA_DESIGN.md:14,87-89,121,215,538-540` describes a `graphics → lower_thirds` rename as "pending"; this single thread spawned the false "Stage 7 blocked by lower_thirds mismatch" claim repeated in `CLAUDE.md`, `SESSION_HANDOFF.md`, `AUTOMATION_ROADMAP.md`, `BUILD_STATUS.html`. No such table exists. The schema doc is also stale at "43 migrations" (live: 45).

**Medium — count/config drift:**
- `config/production.json:8` says `episode_count: 25` (DB has 48); its platform list (lines 31-38: Odysee/Facebook/Instagram/Website) is the old set, not the real 6.
- Migration count appears as 28 (`BUILD_STATUS.html:249`), 43 (`SESSION_HANDOFF.md`, `SUPABASE_SCHEMA_DESIGN.md`), and 45 (`CLAUDE.md`, audit docs). Live = 45.
- Guest count: 175 (live DB and `SESSION_HANDOFF.md:29`) vs 168 (an earlier draft of this doc). Live = 175.
- `/upload` is called "legacy/phasing out" in docs but the code shows it fully wired into nav.
- ADRs **0001 / 0009 / 0010 / 0011** lack the back-pointing SUPERSEDED banner they should carry (0009/0010 → 0011; 0011 → 0012; 0001 historical). CLAUDE.md calls them historical but the ADR files still read "Accepted".

**Medium — AI-layer conflicts:**
- **YouTube category:** `GSR_METADATA_PATTERN.md` (older) hardcodes **Category 24 (Entertainment)** and a Title-Case anchor-tag set; `PROMPT_LIBRARY.md` + `CLAUDE.md` (newer, authoritative) say **Category 28 (Science & Technology)** is correct and "24 is wrong," with a different lowercase tag list. Unreconciled.
- **Email signature:** "Producer, Genesis Science **Network**" vs "Genesis Science **Report**" inconsistent across `EMAIL_TEMPLATES.md`.
- Two different tier systems (email-count 4-tier vs appearance-count 5-tier) and two char ranges (60–65 vs 55–65) across the editorial docs.

**Medium — dead/broken dashboard code:**
- `/lower-thirds/[episode_id]` has **no `page.tsx`** — only `episode-workspace.tsx`; the workspace is wired but unreachable as the route is written.
- `review-grid.tsx` expects `/api/regenerate` to return `{text, variationNumber}`, but the route returns `{variations:[…]}` — its regenerate is broken against the current contract (component appears unused).
- `GET /api/rc-explore` and `GET /api/rc-import` perform no auth check (env-cred-gated only).
- `__text_only__` sentinel defined twice (lib + inline in `/api/import`); `upload-form.tsx` omits `show_intro` (11 vs 12 segments) and mutates Supabase directly from the browser.
- `.env.example` documents only the 2 Supabase vars + `ANTHROPIC_API_KEY`; it omits `RUNDOWN_CREATOR_API_KEY`, `RUNDOWN_CREATOR_API_TOKEN`, and `ANTHROPIC_REGENERATE_MODEL`.

**Low — misc:** "Miryam" (v2) vs "Miriam" (v1) spelling; Wonders Center city "Dickson" vs "Lewisburg" across campaign docs; migration filename timestamps out of applied order (`005000`–`005800` sort before `010000` but applied after — idempotent, no breakage); `episodes.guest_name` marked DEPRECATED but still written by `/api/import`.

**Dead weight to archive/remove (none feeds the live system):** `notion-import/**`, `workflows/templates/*.json` (7 n8n templates, never deployed), `scripts/notion_*.py` (10 scripts), `scripts/extract_email_voice.py` + `archaeology_data.json` (research residue), and the entire `gsr-automation` repo + `gsrguestportal` (approved for archiving). PR #40 already removes most of the v2 dead weight.

---

## Part 8 — Where This Points Next

1. **Run the real Stage-7 import** — land the first `graphics` rows in production. The only thing "blocking" it is operational, not code.
2. **Build the distribution slice** (gsr-blueprint build #1): Dropbox watch (+audio companion) → Whisper transcript → Claude metadata → YouTube scheduled publish, with Rumble via YouTube sync and Fireside/GSN as handoff cards.
3. **Stand up the Source-of-Truth Map + GSR Architect agent** so data prefills from authoritative sources and only interrupts Daniel when every source is silent.
4. **Clean up the drift** (Part 7): rotate + strip the two live secrets, reconcile the stale docs and config, add the SUPERSEDED banners, fix the broken paths, archive the two dead repos — so the map stays trustworthy.

---

*Compiled 2026-06-04 from a 14-agent sweep across gsr-automation-v2, gsr-automation, gsr-blueprint, gsn-subchannel-campaign, skills, davidrives-mail, and gsrguestportal, cross-checked against the live Supabase schema (45 migrations, 18 tables), the dashboard source, and the full GitHub PR/commit history.*
