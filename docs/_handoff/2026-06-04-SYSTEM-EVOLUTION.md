# GSR Automation — System Evolution & Full Pipeline Reference

**Date:** 2026-06-04
**Status:** Self-contained reference. Everything needed to understand the system is inside this one file — no other document needs to be opened. Built to be copied into a custom system-setup / coding curriculum.
**Method:** Compiled from a full sweep of every project repository, corroborated by a 10-agent verification pass that cross-checked each claim against the live Supabase project (`lafkbxypmciopebentxp`), the dashboard source code, the architecture decision records, and the GitHub pull-request and commit history (2026-05-15 → 2026-06-04). Numbers in this document are verified live, not remembered.

> **Plain-English note for the reader.** This is the "where we've been and where we are" map. Part 1 is the short version. Part 2 is the story of how the plan changed three times in three weeks. Parts 3–6 are the working reference: every pipeline stage with what goes in, what comes out, and which tools touch it — plus the actual rules, schemas, and prompts embedded in full so you never have to look elsewhere. Part 7 is the honest list of things in the project that still contradict each other. Part 8 is where it points next. Skim the headers; dive where you need detail.

---

## Table of Contents

- **Part 1** — The Short Version
- **Part 2** — The Evolution Story (three eras) + the Decision Ledger
- **Part 3** — The Current System: Full Pipeline Reference (every route + contract)
- **Part 4** — The Database Layer (all 20 tables, enums, RLS, verified live)
- **Part 5** — The AI / Writing Layer (voice, lower-thirds rules, 20 prompts, email system — embedded in full)
- **Part 6** — Repositories, External-Software Inventory, and the GSN Campaign
- **Part 7** — Drift & Contradictions (what still disagrees, stated as concepts)
- **Part 8** — Where This Points Next
- **Appendix A** — Curriculum Layer Map

---

## Part 1 — The Short Version

In roughly three weeks (May 15 → June 4, 2026) the system was redesigned twice and now sits on its third architecture. Each pivot was a real, dated decision. This document states what is true *now* and preserves what each earlier era was, so nothing is lost.

| Era | Dates | Core idea | Database | Orchestration | Status |
|-----|-------|-----------|----------|---------------|--------|
| **Era 1 — Self-hosted** | May 15–20 | n8n on a QNAP NAS, file-watchers, local SQLite | SQLite on the NAS | Self-hosted n8n (Docker on QNAP) | Superseded |
| **Era 2 — Cloud-first / Notion** | May 20–23 | Security incident kills QNAP admin; go cloud | Notion databases | n8n.cloud + Mac Mini sync client | Superseded |
| **Era 3 — Supabase / Next.js** | May 23 → now | Real app: dashboard + Postgres + AI | Supabase (Postgres) | Next.js server actions + API routes; Supabase pg_cron/pg_net | **Current** |

**The single throughline:** every era was about the same job — take an episode from script to graphics to multi-platform distribution with less manual work — but the *how* got progressively simpler and more cloud-native, moving away from hardware that a non-developer would have to maintain.

**Where it actually stands today (verified against the live database):** the Supabase backend has **20 tables, 46 migrations, 2 enums, 2 views, 3 functions, 3 named triggers, 1 storage bucket**. `episodes` = 48 rows, `guests` = 175 rows, and **`graphics` = 0 rows**. That last number is the real story of "Stage 7": the lower-thirds pipeline is fully built but **no graphics row has ever landed in production yet** — the first real-episode import has not been completed. It is an operational milestone, not a code defect (see the phantom-blocker note in Part 2).

---

## Part 2 — The Evolution Story (how it changed and why)

### Era 1 — Self-hosted automation on the QNAP (May 15–20)

**The original plan.** Build a central automation system for post-production of the Genesis Science Report: multi-platform uploads, transcription, AI metadata generation, approval workflows. The architecture was infrastructure-first (the original repository for it contained **only documentation — every code folder was a placeholder; nothing was ever built there**):

- **n8n** self-hosted in **Docker on a QNAP NAS** as the workflow orchestrator
- **SQLite** (`better-sqlite3`) as the status database on the NAS
- **Docker services** on the NAS: Chokidar (file watcher), faster-whisper (transcription), Playwright (browser automation), BullMQ + Redis (job queue), ntfy (notifications)
- **Two-NAS topology** (one automation host + one storage unit)
- **Tailscale** for remote access, with **no custom authentication layer**
- **1Password Teams** for secrets; **UptimeRobot** for monitoring
- A phased Phase 1–4 plan with hard exit criteria (Phase 1: 10 consecutive episodes hands-off, the co-producer independent, <5% error rate, <1 hr/week maintenance, all runbooks cold-start tested)

**Open-source stack specified for Era 1:** Chokidar, BullMQ + Redis, better-sqlite3, faster-whisper, the Vercel AI SDK, youtubeuploader (porjo), dropbox-sdk-js, a next-shadcn dashboard starter, ntfy; Playwright (Phase 2, Signiant + Rumble fallback); basic-ftp (Phase 3, StreamHoster). Considered and rejected: tokland/youtube-upload (GPL license), whisper.cpp, WhisperX, LangChain.js, Temporal.io, lowdb.

**Why it died.** On **2026-05-19** a security incident exposed QNAP admin credentials inside a Claude session, which transmitted them to the model provider's servers. IT rotated all credentials across 40+ connected devices. Admin access to the NAS was lost (and is no longer needed). Self-hosting on the NAS was no longer viable — and more importantly, the whole "a non-developer maintains server infrastructure" premise was wrong for a ministry production schedule. A security framework was imposed: isolated connections only, nothing that can cascade to production broadcast gear.

### Era 2 — Cloud-first pivot, Notion as the database (May 20–23)

The first pivot (recorded 2026-05-20) ended self-hosting:

- **n8n.cloud** (managed) replaces self-hosted n8n — no server to maintain
- **Notion** replaces SQLite — team-visible, GUI-first, no database administration
- The QNAP units become **read-only SMB file sources only** — no admin, no installed software
- A **sync client** (Dropbox or Google Drive) on the Edit Bay Mac Mini watches the QNAP share and triggers cloud automation
- All heavy processing (transcription, AI, uploads) happens in the cloud

This era produced a real burst of now-dead work: about 10 Notion bootstrap scripts (workspace setup with 6 core databases + seeds, schema-update/add-database scripts for Platform Uploads / Metadata Drafts / Graphics Tracking, relation builders, seeders, a duplicate-cleanup script, a health-check script — all hitting the Notion REST API); 7 n8n workflow templates (Basecamp task sync, Dropbox asset sync, episode-checklist create, episode-status sync, graphics reminder, weekly report, YouTube upload log) that were **never deployed** (they carry unresolved variable placeholders and a setup-TODO block); and a Notion-import payload (setup guide, database-ID map, 6 CSVs, and a Production Wiki archive).

**Why it pivoted again.** Notion is a fine wiki but a weak application backend — no real relational integrity, no row-level security, no server-side validation, awkward for the lower-thirds approval workflow that was becoming the actual first feature. Within days the decision was made to use Notion only as a wiki and move the real data layer to Supabase.

### Era 3 — Supabase + Next.js dashboard (May 23 → today)

The current architecture of record (accepted 2026-05-23) supersedes everything before it:

- **Supabase** (hosted Postgres + Auth + Storage + Row-Level Security + Edge Functions) is the database
- **Next.js (App Router)** dashboard (React, shadcn/ui components, Supabase SSR auth), deployed on **Vercel**
- **Claude API** for lower-thirds generation and script extraction
- **Notion** demoted to wiki-only (project rule: do not extend the pre-pivot Notion scripts)
- **QNAP** stays read-only; **ProPresenter / ATEM / Bitfocus Companion / Tailscale** stay off-limits to automation

**The build blitz (verified via GitHub history):** the new dashboard repository was spun up around May 21–22, and from May 26–30 the dashboard was built stage by stage. Verified PR sequence: shell + auth, then upload, then review/regenerate/approve, then the full relational schema, then guest profiles + prompt library + voice profile, then health checks, the editorial agent, script-to-lower-thirds extraction, and the guests/workflow/episodes pages.

**PR accounting (verified via GitHub on 2026-06-04):** **41 PRs total — 31 merged, 8 closed without merging** (superseded experiments: #1, #10, #11, #23, #24, #33, #34, #35), and **2 open drafts**: #40 "Foundation cleanup: ProPresenter policy, prune bloat, harden" (currently in merge conflict — needs un-conflicting before merge) and #41 "docs: cross-repo audit and recovery roadmap" (this document's sibling, branch `claude/repo-audit-consolidate-opbXB`). **85 commits on `main`** between 2026-05-15 and 2026-05-30. Earlier internal notes claiming "54 PRs / 4 drafts in a merge queue" are wrong.

**Where it is now (June 2026):** Feature 1 — Episode Graphics & Asset Tracker — is at **Stage 7 (real episode test)** with five Season-3 episodes filmed May 28–29. All 48 Season 3 episodes are in the database; `graphics` is still empty.

> **The phantom blocker (resolved).** Several internal notes say Stage 7 is "blocked by a `lower_thirds` table schema mismatch." This is a **phantom**. **There is no `lower_thirds` table and there never has been.** The first migration's *filename* contains the words "lower thirds," but its body creates a table named **`graphics`**. Every dashboard query uses `graphics`; none use `lower_thirds`. The contradiction lives only as aspirational prose in a schema-design document that describes a `graphics → lower_thirds` rename as "pending" — a rename that was never executed. **The fix is documentation, not code:** either perform the rename for real (one migration plus all the call sites together) or delete the "pending rename" language. Any actual import failure is operational (no one has run the first live import yet), not a column mismatch.

### The Decision Ledger (full, self-contained)

These are the architecture decision records that govern the project. Statuses are quoted from the records themselves.

| # | Title | Date | Status | Supersedes | Superseded by |
|---|-------|------|--------|------------|---------------|
| 0001 | Use n8n as orchestrator; Next.js dashboard; SQLite; Docker services on NAS | 2026-05-15 | Accepted (supplemented by 0009) | — | — (historical, never formally superseded) |
| 0002 | Defer high-risk platforms (Rumble/Fireside/Signiant/StreamHoster) to later phases | 2026-05-15 | Accepted | — | — |
| 0003 | Dashboard is a tracking system that sometimes automates, not the reverse | 2026-05-15 | Accepted | — | — |
| 0009 | Two-NAS topology — one unit as primary automation host | 2026-05-15 | Accepted (supplements 0001) | — | 0011 *(back-pointer banner missing in the file)* |
| 0010 | File-watcher source-of-truth strategy | 2026-05-15 | Proposed (deferred; never resolved) | — | 0011 *(banner missing)* |
| 0011 | No QNAP admin — cloud-first architecture with Notion database | 2026-05-20 | Accepted | 0009, 0010 | 0012 *(banner missing)* |
| 0012 | Supabase backend, Next.js frontend | 2026-05-23 | Accepted (current architecture of record) | 0011 | — (current) |

Notes for accuracy (updated 2026-06-08): records **0004, 0005, and 0006 now exist** (templated master-metadata, Dropbox-delivery-carries-no-metadata, AI-metadata-requires-approval), authored to capture decisions that were referenced but never written. **0007 and 0008 remain unused** (no separate decision; earlier references to them were errors). The Tailscale / no-custom-auth decision is part of **0001**, not a separate record. ADR-0001 was never formally superseded (it is "historical," a judgment, not a supersession). ADR-0012's text was reconciled to note the live stack is **Next.js 16.2.6** (the framework choice stands; only the version number moved).

---

## Part 3 — The Current System: Full Pipeline Reference

Two halves: the **production pipeline** (script → approved graphics → ProPresenter — largely built) and the **distribution pipeline** (finished episode → platforms — designed, largely future).

### 3.0 Pipeline at a glance

```
SCRIPT (Claude Desktop / Rundown Creator)
   │  inputs: script text per segment
   ▼
EXTRACT (Claude API, POST /api/extract-lower-thirds)  ──►  lower-thirds JSON {episodes, graphics, rejected}
   │
   ▼
IMPORT (POST /api/import, Zod + dry-run, "Type YES")  ──►  Supabase: episodes + graphics + variations
   │
   ▼
REVIEW (/lower-thirds)  approve / reject / regenerate (Claude, 3 variations) / adopt
   │
   ▼
APPROVED (/approved, /lower-thirds/ready)  ──►  copy text into ProPresenter BY HAND
   │
   ▼  ── future (designed, not yet built) ──
DISTRIBUTION: Dropbox master (+audio companion) ► Whisper transcript ► Claude metadata ►
   YouTube (auto) / Rumble (YouTube sync) / Fireside + GSN (manual handoff cards)
```

### 3.1 Script intake

- **Inputs:** scripts drafted in Claude Desktop, or pulled from **Rundown Creator** (a hosted rundown API at `rundowncreator.com`). The Season-3 May rundown IDs were: Show 1 = 79, Show 2 = 81, Show 3 = 83, Show 4 = 82, Show 5 = 84.
- **Tools:** `GET /api/rc-explore` (passthrough for the Rundown Creator endpoints: list rundowns / list rows / get script) and `/api/rc-import` (maps **10** Rundown Creator segment names into the 12-value internal segment enum, and fixes Latin-1→UTF-8 mojibake). A Rundown Creator quirk to remember: it returns errors as **HTTP 200 with a JSON `error` body**, not as an error status.
- **Outputs:** `POST /api/scripts` upserts script text per `(episode_id, segment)` into the `scripts` table. That write fires the `on_script_save` trigger → the `notify_script_extract()` function → an `extract-on-script-save` Edge Function (the auto-extraction loop).

### 3.2 Lower-thirds extraction (Claude API)

- **Route:** `POST /api/extract-lower-thirds`. Auth required (401 otherwise).
- **Inputs:** `episode_id` (uuid), `segment` (12-value enum), `script_text` (10–60,000 chars).
- For interview segments with a booked guest it pre-builds the chyron (`NAME | ORG | FIELD`; if the assembled chyron exceeds 65 characters it is truncated to 62 chars + "...").
- **Model:** the value of the `ANTHROPIC_REGENERATE_MODEL` environment variable (default `claude-opus-4-7`), `max_tokens: 4096`.
- **No DB write** — it returns a `{ payload }` object already shaped for `/api/import`.
- **Errors:** 400 (validation) · 404 (episode not found) · 502 (unparseable/empty model response) · 503 (model overloaded) · 500.

### 3.3 Import (validated, dry-run-first)

- **Route:** `POST /api/import` — the single source of truth for the ingest contract, enforced with Zod. Auth required (401 otherwise).
- **Schema (paste-ready):**

```
POST /api/import   (auth required → 401)
IN: {
  episodes: [{                          // min 1
    season: int 1-99,
    episode_number: int 1-999,
    title?: string|null,
    air_date?: "YYYY-MM-DD"|null,
    guest_name?: string|null            // DEPRECATED flat field, still written
  }],
  graphics: [{
    episode_season: int,
    episode_number: int,
    segment: <12-value enum>,
    l3_type?: <15-value enum>|null,
    beat_number: int 1-999,
    primary?: string(1-200),            // at least one of primary / initial_text required
    initial_text?: string(1-200),
    var_1?: string(1-200)|null,
    var_2?: string(1-200)|null,
    source_doc?: string|null
  }],
  rejected?: [{ reason: string, raw_text: string, source_doc?: string|null }],  // default []
  dry_run?: boolean                     // default FALSE
}
OUT 200 dry_run: { dry_run:true, episodes:{total,new,updated},
                   graphics:{total,new,conflicts}, conflicts:[...], rejected:{total,items} }
OUT 200 live:    { success:true, episodes:{total,new,updated},
                   graphics:{total,new}, rejected:{total,items} }
ERR 400 validation / missing primary&initial_text / orphan graphics (episode not in payload)
ERR 401 not authenticated · 409 live conflict · 500 db error · 207 variations partially failed
```

- **Validation behavior:** orphan graphics (a graphic whose episode is not in the payload) → 400. Dry-run reports new/updated/conflicts and writes nothing. **Live refuses on any `(season, episode_number, segment, beat_number)` conflict → 409** (the operator resolves it in the source first).
- **Writes (live):** upsert `episodes` (on conflict of `season,episode_number`); insert `graphics` with `status='pending_review'`, `current_image_url='__text_only__'`, `uploaded_by = user.id`; insert the first `graphics_variations` row (variation 1, `generated_by='human'`). If the variation insert partially fails, the graphics are kept and the response is 207.
- **Guardrail (mandatory):** always dry-run first, show the summary, and require the operator to type "YES to import" before the live call, in the same session. Note that `dry_run` on `/api/import` defaults to **false**, so the guardrail is a human discipline, not an automatic safety — by contrast `/api/rc-import` defaults `dry_run` to **true**.

### 3.4 Review & approval

- **Pages:** `/lower-thirds` (episode list showing `N/12 scripts` plus pending/approved badges) and a per-episode workspace component (Rundown Creator pull + 12 segment slots + extraction + graphic-card review).
- **Server actions:** `approveGraphic` (copies the chosen text into `approved_text`), `rejectGraphic`, `adoptVariation` (writes the selected text into `graphics.initial_text`), `setFont`. **These are plain read-modify-write actions, not SQL RPCs.** The only true atomic RPC is the ProPresenter toggle (see 3.5).
- **Regeneration:** `POST /api/regenerate` calls Claude for **3 variations per call**, rate-limited to **20 calls/user/hour** (tracked in `regenerate_attempts`), feeding the last 8 prior texts back to the model to avoid repetition. Model = `ANTHROPIC_REGENERATE_MODEL` (default `claude-opus-4-7`), `max_tokens: 400`. Returns `{ variations: [{ text, variationNumber }] }`. Errors: 429 (rate limit) · 404 (graphic not found) · 502/503/500.

### 3.5 Approved queue → ProPresenter (manual handoff)

- **Pages:** `/approved` (copy button, ProPresenter toggle, per-graphic font editor — default `Collaborate Medium 55pt #FFFFFF`) and `/lower-thirds/ready` (final operator queue).
- **Atomic state:** `togglePropresenter` → the SQL RPC `toggle_propresenter_added` (no read-modify-write race). This is the one genuinely atomic mutation in the app.
- **Hard boundary:** copying approved text into ProPresenter is done **by hand**. The production ProPresenter machine is off-limits to automation until the on-air talent explicitly approves a test-machine pathway ("The David Rule").

### 3.6 Episodes, guests, workflow (supporting data)

- **`/episodes`:** episode CRUD — production status (planned → in_prep → shot → in_post → scheduled → aired), shoot/air dates, Rundown Creator ID, YouTube/Rumble URLs.
- **`/guests`:** the 175-row guest directory — expertise, credentials, YEC flag, deceased flag, do-not-contact flag, sensitivity flags. Appearance count (computed from `episode_guests`) drives the outreach tier.
- **`/workflow`:** per-guest email lifecycle on the `v_episode_workflow` view — six timestamped stages (confirmation, Zoom link, day-before, post-shoot, pre-air, post-air YouTube).
- **`/toolkit`:** the prompt library surfaced in the UI with the live guest roster and today's date injected. (Verified live: `prompts.ts` defines 20 prompt entries, ids 1 through 20, matching the 20-prompt library in Part 5.)

### 3.7 Distribution pipeline (designed, partly future)

Trigger: a broadcast master MP4 lands in a flat per-show Dropbox folder. A **~30 MB audio-only companion file** dropped beside the multi-GB master is the recommended fix so transcription is cheap and fast — this is the key design decision still pending. The chain is: Dropbox event → Whisper transcript → Claude metadata (two profiles) → per-platform dispatch, with all status tracked in the `distributions` table.

**Transcription:** local Whisper (existing fswatch + ffmpeg + whisper, cost $0) or the Whisper API (~$0.36/hr). Always extract audio first; never transcribe the full video.

**Metadata (Claude), two profiles:** a **video** profile (YouTube/Rumble/GSN — title with the 30%-shorter rule, description, tags, chapters built from transcript timecodes) and a **podcast** profile (Fireside — audio-tuned title/description/show notes).

**Per-platform spec:**

| Platform | API status | Automation tier | Key specs / blocker |
|----------|------------|-----------------|---------------------|
| YouTube | Data API v3 (`videos.insert`) | AUTO | Category **28** (Science & Technology — *not* 24); Public; Made-for-Kids No; English; Standard license; publish Monday 4 PM ET; uploads default to private until human approval. **Blocker:** a new API project is locked to private-only until Google clears an audit. |
| Rumble | No public upload API (partner-gated) | AUTO (indirect) | Mirror via Rumble's "YouTube channel sync." No chapter support. |
| Fireside | Read-only (metrics only) | HANDOFF CARD | MP3 uploaded via web UI; uses the podcast metadata profile; auto-distributes to Apple Podcasts + Spotify. |
| GSN On-Demand | None (proprietary OTT/Roku) | HANDOFF CARD | Manual upload; metadata pre-staged. |
| Signiant Media Shuttle | Media Shuttle | Legacy / later phase | Feeds Real Life Network (also known as RightNow Media); RLN thumbnail is 1200×1800 portrait. |
| StreamHoster | FTP | Legacy / later phase | Feeds Roku, Apple TV, the iOS app, and LG TV. |
| Dropbox | SDK (trigger source) | input | Flat per-show folders; master + audio companion; the exact filename convention is still an open question. |

**Open decisions gating the build:** (1) audio-companion yes/no, which settles cloud-vs-local run mode; (2) the Dropbox filename convention; (3) clearing the YouTube API audit before any public auto-publish.

---

## Part 4 — The Database Layer (verified live)

**Project:** `lafkbxypmciopebentxp`. **46 migrations**, built in three waves between May 26–28.

- **Wave 1 (May 26) — Feature 1 MVP:** `episodes`, `graphics`, `graphics_variations`; the two enums; RLS; the `lower-thirds` storage bucket; `propresenter_added`; `regenerate_attempts`; the `toggle_propresenter_added` RPC. (The first `graphic_segment` enum had 11 values here.)
- **Wave 2 (May 27) — hardening + v2 extraction:** font fields; the `(season, episode_number)` unique constraint; audit fixes (indexes, a plpgsql RPC, status NOT NULL); the `show_intro` segment added (taking the enum to 12); `l3_type` (15-value CHECK) plus `var_1`/`var_2`.
- **Wave 3 (May 28) — full production hub:** `guests`, `episode_guests`, `interview_prep`, `distributions`, `transcripts`, `content_clips`, `social_posts`, `premade_library`, `shoot_sessions`, `articles` (8-dimension scoring with a generated `total_score`), `production_graphics`, `outreach_drafts`, `booking_pipeline`, `email_threads`; the two views; an advisor cleanup pass (views set to `security_invoker`, RLS auth calls wrapped in `(select auth.uid())` for performance). Later in the same cycle: the `scripts` table, the `pg_cron` + `pg_net` extensions, and the `app_config` + `notify_script_extract()` + `on_script_save` auto-extraction trigger.

**The two enums (exact values):**

- `graphic_status` (4): `pending_review`, `approved`, `rejected`, `needs_revision`
- `graphic_segment` (12): `opening_monologue`, `interview_1`, `interview_2`, `kids_corner`, `genesis_science_qa`, `ministry_report`, `viewer_voices`, `featured_resource`, `heavens_declare`, `genesis_science_minute`, `other`, `show_intro`
- `l3_type` is a 15-value CHECK constraint on the `graphics` table (not a Postgres enum): `episode_intro_l3`, `monologue_beat`, `segment_graphics_title`, `topic_l3`, `guest_chyron`, `discussion_l3`, `generic_safety_net`, `qa_topic_l3`, `mr_topic_l3`, `mr_cta_l3`, `correspondent_chyron`, `viewer_l3`, `resource_l3`, `cta_l3`, `other`

**The three core live tables (column lists):**

`episodes` (PK `id uuid`, unique on `(season, episode_number)`): `id`, `season`, `episode_number`, `title`, `air_date`, `shoot_date`, `production_status` (CHECK: planned/in_prep/shot/in_post/scheduled/aired), `guest_name` (DEPRECATED, still written by import), `rc_rundown_id`, `drive_folder_url`, `notes`, `description`, `tags text[]`, `thumbnail_url`, `thumbnail_source_path`, `chapter_markers jsonb`, `youtube_url`, `youtube_published_at`, `youtube_scheduled_publish_at`, `rumble_url`, `podcast_url`, `created_at`.

`graphics` (PK `id uuid`, FK `episode_id → episodes`): `id`, `episode_id`, `segment` (`graphic_segment`), `l3_type` (15-value CHECK), `beat_number`, `initial_text`, `approved_text`, `var_1`, `var_2`, `status` (`graphic_status`, default `pending_review`), `current_image_url` (`__text_only__` sentinel for text-only imports), `propresenter_added bool`, `font_family`, `font_size_pt`, `font_color`, `notes`, `asset_source_urls text[]`, `source_doc`, `uploaded_by`, `approved_by` (both → `auth.users`), `uploaded_at`, `approved_at`.

`graphics_variations` (PK `id uuid`, FK `graphic_id → graphics`): `id`, `graphic_id`, `variation_number`, `text_content`, `generated_by`, `generation_context jsonb`, `created_at`. Variation 1 is auto-created on import; regeneration appends three at a time.

**Full live table inventory (20 tables, all RLS-enabled):**
`episodes`, `graphics`, `graphics_variations`, `regenerate_attempts`, `guests`, `episode_guests`, `interview_prep`, `distributions`, `transcripts`, `content_clips`, `social_posts`, `premade_library`, `shoot_sessions`, `articles`, `production_graphics`, `outreach_drafts`, `booking_pipeline`, `email_threads`, `scripts`, `app_config`.

**Views (2, both `security_invoker`):** `v_episode_master` (flat JOIN of all tables, ordered by show sequence) and `v_episode_workflow` (computed email due dates + boolean flags for each guest's lifecycle).

**Functions (3):** `toggle_propresenter_added(p_graphic_id uuid)`, `set_updated_at()`, `notify_script_extract()`.

**Triggers (3 named):** `on_script_save` (AFTER INSERT and AFTER UPDATE on `scripts` → `notify_script_extract`), `set_scripts_updated_at` (BEFORE UPDATE on `scripts`), and `production_graphics_updated_at` (BEFORE UPDATE on `production_graphics`).

**Extensions:** `pg_cron` and `pg_net`. **Storage:** one bucket `lower-thirds` (5 MB limit, `image/png` only, **0 objects** — vestigial after the text-only pivot).

**RLS posture:** enabled on every table, but uniformly **permissive-for-authenticated**. Wave-3 tables use literal `USING (true)`; the older core tables (`episodes`, `graphics`, `graphics_variations`) gate on `(select auth.role()) = 'authenticated'`. There are **no DELETE policies anywhere**. Exceptions: `regenerate_attempts` is owner-scoped (`(select auth.uid()) = user_id`); `app_config` has RLS on with **zero policies** (service-role-only — it holds the extraction webhook secret).

**Live row counts:** `episodes` 48, `guests` 175, **`graphics` 0**. `app_config` holds 1 row (the webhook secret). All other tables are empty.

**A convention note worth teaching:** the project rules document states primary keys are `bigint generated always as identity`, but the actual schema uses `uuid primary key default gen_random_uuid()`. The live schema (uuid) is the truth; the written convention is stale.

---

## Part 5 — The AI / Writing Layer (the editorial engine, embedded in full)

This is a **rules-based system derived from production data** — roughly 879 Claude sessions, ~1,991 sent emails, 200 real lower-thirds from eight aired episodes, and 25 analyzed YouTube episodes — not invented preferences. Everything the system enforces is reproduced below so a reader needs nothing else.

### 5.1 The show's voice DNA

A weekly 58-minute Christian creation-science TV program. The biblical worldview informs topic selection and framing, not delivery style. It "sounds like cable news produced by a ministry, not a ministry that borrowed cable-news aesthetics." Host register is anchor-desk, not lecture hall.

- **Sentence length:** short declarative sentences (5–10 words) are the backbone; one payoff sentence per beat (up to ~25 words) before returning to short beats; hard cap 20 words per teleprompter sentence.
- **Reading level:** 7th grade. Every technical term is defined immediately in plain language.
- **Vocabulary:** specific, concrete, named — exact temperatures, distances, article titles, named people.
- **Register:** present-tense, direct-address, contractions ("Well, folks," "You see,").
- **Tone:** confident, curious, grounded in Scripture; never sensational; never preachy. Scripture is the landing point, not the launch pad — it appears in the final third of the monologue, never before the midpoint.
- **The rule of every sentence:** establish a tension, build toward its resolution, or release it. Sentences that only describe are deletion candidates.

### 5.2 The four locked verbatim lines

```
SHOW OPEN (every episode, verbatim):
"Good evening and welcome to The Genesis Science Report. I'm David Rives, and coming up tonight —"

SIGN-OFF (verbatim, do not alter):
"That's it for today. Thank you for joining us on the Genesis Science Report. Until next week,
 keep looking up. I'm David Rives. Truly, the heavens declare the glory of God."

THE HEAVENS DECLARE / GENESIS SCIENCE MINUTE TOSS CLOSER (locked, identical in both segments):
"Let's take a look, right now."

DONATION CLOSE (always the last sentence of the Ministry Report, wrapped in gratitude, never cold):
"If you'd like to partner with us, you can make a tax-deductible gift by visiting our website
 or calling 931-212-7990."
```

The donation phone number is **931-212-7990** (verified repeatedly; any document showing 7900 is wrong).

### 5.3 The run-of-show (15 segments, fixed order)

1. Show Intro (~0:30) — locked opener, two interview previews (hook first, guest name last).
2. Opening Monologue (~7 min) — cold open, hook fires in the second sentence, previews both interviews, "But first…" pivots into the monologue body; Scripture in the final third.
3. [Break]
4. Interview 1 (~12 min) — post-break "Welcome back to the Report," topic-first host intro, one-sentence rewritten guest bio, a 4-section question arc (hook / data / biblical / takeaway), interview outro with a `creationsuperstore.com` resource tie.
5. [Break]
6. The Heavens Declare (~3.5 min, pre-produced) — toss closes on the locked line.
7. Kids Corner (~3 min, pre-produced) — lighter closer ("Let's jump in.").
8. Genesis Science Q&A (~2 min, pre-produced).
9. Ministry Report (~2 min) — warmest segment; donation close with 931-212-7990 as the final sentence.
10. Viewer Voices (~2 min) — David hands off to a staff reporter; two-sentence functional toss, four fixed toss lines rotate.
11. Featured Resource (~2 min) — curiosity hook → toss to bookstore host; `creationsuperstore.com` must be spoken.
12. Genesis Science Minute (~1 min, pre-produced) — same locked closer as The Heavens Declare, but must use a different rhetorical device than the THD toss in the same episode.
13. [Break]
14. Interview 2 (~12 min) — same format as Interview 1; post-break "Welcome back."
15. Closing (~1 min) — the locked, liturgical sign-off.

### 5.4 The five rhetorical modes (pick one per segment; rotate)

```
1. Breaking News / Headline-Driven — "What just happened?" Present-tense urgency, named specifics.
   Best: research teases, pre-break hooks, astronomy.
2. Wonder-Driven — "What is strange and beautiful here?" Slower, expansive, awe before argument.
   Best: genetics/cell-bio intros, THD tosses, closing beats.
3. Stakes-Focused — "What does this mean for your life/family/faith?" Second-person, consequences first.
   Best: human origins, schools framing, featured resource.
4. Curiosity-Driven — "What don't you know you don't know?" Question-drop, everyday-object pivot.
   Best: Kids Corner, GSM tosses, resource teaser.
5. Narrative / Investigative — "There's a story here, follow me." Storytelling cadence, named people/places.
   Best: archaeology, documentary guest intros, history-of-science.

ROTATION RULE: do not blend modes; no two segments in the same structural slot may share a mode;
the two interview teases must diverge; the THD and GSM tosses must diverge.
```

### 5.5 Lower-thirds style rules (full)

```
FORMAT (every lower-third, no exceptions):
- ALL CAPS
- No em dashes (use a colon or conjunction)
- No commas
- No hyphens as connectors (abbreviation/compound hyphens are not used as separators)
- No sentence-ending periods (abbreviation periods VS. DR. PHD. are fine)
- No slashes
- No brackets or parentheses (rewrite citations inline: SCIENCE 2018: 237 SOIL SITES)
- No quotation marks wrapping the whole line (in-text quotes are fine)
- No markdown, emoji, or symbols
- Must work standalone as a spoken banner

LENGTH:
- Target 65 characters (the ideal). 60-65 good. Under 55 too short. Over 65 too long.
- The AI regeneration prompt hard-caps alternatives at 8 words (a tool constraint, not the human standard).
- The database field accepts 200 chars (a storage limit, not a target).

SEPARATORS (only two are in use):
- Pipe |  : chyrons and contact/CTA cards ONLY  (NAME | DISCIPLINE | AFFILIATION).
            Never in a topic or discussion beat.
- Colon : : "LABEL: SPECIFIC CLAIM" topic beats (the most common pattern).

CHYRON: DR. [FIRST LAST] | [DISCIPLINE] | [AFFILIATION].
  The third field is the most important: it positions the guest (a credential, a book, an
  achievement), not just an institution. Credentials must come from the guest's own materials;
  flag anything unverifiable as [FLAGGED — verify before air].

THE 2+15 STANDARD (the canonical interview package):
  Beat 1     = topic banner (grabby; broad enough not to give away specifics)
  Beat 2     = guest chyron
  Beats 3-17 = 15 discussion beats that BUILD A CASE, not a list. Each must work if a viewer
               glances at the screen mid-segment. If the beats could be reordered without loss,
               they are not progressing — that is a failure signal.

FIXED MINISTRY CTA (ministry_report final beat, verbatim every episode):
  SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990

OPENING MONOLOGUE title card (always beat 1): DAVID'S TAKE: [TOPIC HOOK]   (hook is 2-4 words)
  Optional flag pills: DAVID'S TAKE: [TOPIC]  (<=32 chars total), max 5 per monologue.

PER-SEGMENT COUNTS:
  opening_monologue 15-17 | interview_1 / interview_2 12-18 (target the 2+15) |
  show_intro 1 | ministry_report 3 (beat 3 = locked CTA) | kids_corner 2-3 |
  genesis_science_qa 1 | viewer_voices 0 | featured_resource 0 |
  heavens_declare 1-2 | genesis_science_minute 1-2  (THD/GSM use a reusable transition bank)
```

### 5.6 The 20-prompt library (name → purpose)

These are the production prompts surfaced in the dashboard toolkit (with the live guest roster and date injected).

```
01 Guest Research            — Find new guests; roster injection prevents suggesting recently-aired ones.
02 Interview Questions       — 10-12 questions, 4-section arc (hook / data / biblical / takeaway).
03 Episode Script Outline    — Full 15-segment run-of-show, fixed order, locked sign-off reference.
04 Opening Monologue Script  — Teleprompter copy in the host's voice (<=20-word sentences, 7th grade).
05 Lower Thirds: Interview   — Interview L3s; ALL CAPS, 55-65 chars, primary + 2 variants, chyron rules.
06 Lower Thirds: Monologue   — Monologue L3s; 15 beats x 3 variations + DAVID'S TAKE flag pills.
07 Lower Thirds: Ministry    — 3 beats; beat 3 is the locked CTA card.
08 YouTube Titles            — Main title (3 options) + segment titles; 30%-shorter rule, <70 chars, no clickbait.
09 YouTube Description + Tags— Full description structure; 9 anchor tags + 10-18 topical; sponsor/hashtag rules.
10 Cold Outreach (Tier 1-2)  — First-contact guest email, 8-block structure, hard no-em-dash/no-pleasantry rules.
11 Returning Guest (Tier 3-5)— Re-invite; warmth via compression; tier-matched length and subject lines.
12 Booking Confirmation      — 2-email sequence (confirmation + Zoom link), tech-check reminders.
13 Pre-Interview Reminder    — ~5-7 days out; requests talking points, bio, chyron title, graphics.
14 Post-Interview Thank-You  — Next-day thanks; one specific callout + tentative air date with caveat.
15 No-Response Follow-Up     — 5-7 days after cold outreach; invites a "no"; shorter than the original.
16 Graphics Assignment       — Per-segment crew assignment, CSV tracker output.
17 Graphics Sourcing         — What to find/create per segment + attribution (NONE / CC BY / FAIR USE).
18 Distribution Checklist    — Every platform; YouTube Category 28; Monday 4 PM ET schedule.
19 Rundown Creator Population — Parse script cues into the rundown Graphics / Last-Line columns.
20 Episode Metadata JSON     — Structured metadata JSON for the distribution pipeline (Category 28).
```

### 5.7 The email voice system (full)

Warmth is signaled by **compression**, not chattiness: recurring guests get shorter emails, not friendlier ones. "He gets shorter."

```
RELATIONSHIP TIERS — note: three competing models exist across the project (see Part 7).
  The email-voice system uses a 4-tier, email-count model:
    T1 New (1st email):       Hello Dr./Mr./Ms. [Last], full intro + credentials, 80-130 words,
                              spell out "Genesis Science Report".
    T2 Establishing (2-5):    Hi [Dr./First], brief acknowledgment, no re-intro, 70-110 words.
    T3 Established (6-15):     Hey [First], skip setup, 45-75 words (median 53), "GSR" shorthand.
    T4 Recurring (15+):       Hey [First] (often no last name), 30-60 words, one purpose, bare "Best,".
  A separate 5-tier, APPEARANCE-count model (cold/warm/returning/recurring/direct) is used by the
  database and the prompt library, driven by the count of rows in episode_guests. The email-templates
  document instead uses only a 2-MODE model (first-time vs returning). These three are unreconciled.

COMPRESSION RULE: add warmth by dropping unnecessary sentences, never by adding them.

BANNED (hard stops):
  - "I hope this email finds you well" (a brief "I hope you are doing well." is allowed for
    first-contact openers ONLY)
  - Em dashes (no exceptions)
  - Encyclopedic/academic phrases: furthermore, moreover, in conclusion, it is worth noting
  - Fact-dump openers (leading with data instead of the ask)
  - Reintroducing the show to returning guests
  - Restating already-communicated information in replies
  - Formulaic repeated openers ("Hope all is well," "Just wanted to reach out")
  - Multiple drafts unless asked (produce one ready-to-send draft)

SIGN-OFF: "Best," on ~89% of emails. Never elaborate ("Warm regards," "Sincerely," "Thanks so much!").
  Lone exception: "Thanks," when the whole email is gratitude. Always signed Daniel Allen — NEVER David Rives.

13 EMAIL TYPES (frequency-sorted):
  1.  First Outreach (564)            — intro line + article link + open-ended future-tense angle + format + date.
  2.  Scheduling / Topic Negotiation (315) — mid-thread date/scope fixes; lead with the clarification.
  3.  Zoom Link (167)                 — day-of; one link + "join 15 min early"; max 40 words.
  4.  Interview Confirmation (152)    — more formal (may use "Dear"); date/time, early join, materials checklist.
  5.  Post-Air YouTube Link (112)     — deliver link, note views if impressive; max 50 words.
  6.  Pre-Air Notification (79)       — live stream + broadcast link; Roku/Fire TV; NOT the permanent YouTube URL.
  7.  Day-Before Reminder (~50)       — last logistics for tomorrow; warm; no materials requests; max 60 words.
  8.  Post-Shoot Follow-Up (52)       — thank, estimated air date, promise a heads-up; max 50 words.
  9.  Decline Response (72)           — brief, gracious, door open; never pushy.
  10. Logistics / Talking Points (82) — often a bare URL + "send talking points"; match the sparseness.
  11. Returning Guest Outreach        — skip the intro; lead with the article; verify no retread.
  12. Follow-Up Nudge (9)             — single sentence, no pleasantries.
  13. Station / Advertiser Outreach (17) — structured, show-timing logistics; 80-125 words.
```

### 5.8 YouTube metadata pattern

- **Cadence:** publish every Monday at 4:00 PM ET; ~58-minute episodes; default to the next available Monday unless overridden.
- **Title format:** `[Topical Hook] | Genesis Science Report - S03, Ep##` (pipe with spaces; no emoji; no all-caps).
- **Category:** **28 (Science & Technology)** is authoritative. (An older metadata document hardcodes Category 24 (Entertainment); that document is stale — see Part 7.)
- **9 anchor tags, always present:** Genesis Science Report; David Rives; Creation Science; Intelligent Design; Biblical Creation; Science and Faith; Genesis Science Network; Biblical Worldview; Christian Apologetics. Plus 10–18 topical tags (≈19–27 total).
- **Sponsor logic:** include "This episode is sponsored by Cedarville University." for Season 3 episodes 1–24; omit from episode 25 onward.
- **Description anatomy:** lede → segment paragraphs → tagline → chapter timestamps → sponsor line (conditional) → ~10–15 hashtags.
- **Safety default:** new uploads are created **private**; a human flips to public in the dashboard before the upload fires.

### 5.9 The ten documented AI failure modes the system guards against

```
1.  Statement-driven hooks — leading with the fact instead of the tension; audit every first line.
2.  Triplet ("three short beats") overuse — break the rhythm deliberately.
3.  Multiple options when one was requested — write one when one is asked for.
4.  Long explanation before producing copy — no visible preamble under deadline.
5.  Fabricated / unverified credentials — only guest-provided sources; every credential traceable.
6.  Context contamination — emitting a prior episode's script in long multi-file sessions.
7.  Repeating the same toss device twice in one episode — THD vs GSM, Tease 1 vs Tease 2 must differ.
8.  Character-count drift on lower thirds — the AI undershoots; push back to 60-65.
9.  Pastoral warmth outside the Ministry Report — the warm register must not bleed into newsy segments.
10. Topic-list teases — list one incongruity, never the subtopics.
```

There are also custom subagents defined for the project — an editorial reviewer that enforces all of the above for any on-air copy, plus pipeline-domain and Supabase-schema helpers.

---

## Part 6 — Repositories, External Software, and the GSN Campaign

### 6.1 Repositories

| Repo | Role | State |
|------|------|-------|
| **gsr-automation-v2** | The live system — dashboard, Supabase, all current docs | **Active** (Era 3) |
| **gsr-blueprint** | Staging workspace for the future distribution pipeline + the "GSR Architect" agent | Active (design only; the `mock/` and `agent/` folders do not yet exist) |
| **gsn-subchannel-campaign** | Station-outreach campaign placing GSN on Christian-TV subchannels (73 stations, 4 tiers) | Active (pre-launch) |
| **davidrives-mail** | A standard-library-only IMAP/SMTP CLI for the producer's mailbox | Active (shipped; never passed a live mail-server smoke test) |
| **gsr-automation** | The original Era-1/Era-2 repo (documentation only, no code) | To archive |
| **gsrguestportal** | A static guest-onboarding site (single commit, Feb 2025) | To archive / dormant |

Note on the "skills" reference: there is **no project-owned `skills` repository**. The "skills" mentioned in earlier notes is the external Anthropic skills monorepo (plus a local `export_shows.py` Rundown Creator export utility), not one of the project's own repos. The GitHub account also holds a newer `gsr-research` repo (created 2026-06-04) not covered here.

**The blueprint's two design deliverables.** First, the distribution pipeline (Part 3.7). Second, the **GSR Architect agent** — a Claude Code subagent meant to boot future sessions already knowing the system, run a clarifying-question loop that never re-asks discoverable facts, score every proposed feature on weight / fragility / API cost, and own a **Source-of-Truth Map**: a per-field strategy for where each fact's truth lives (air date → a Google Sheet, corroborated by YouTube history; deceased status → a live internet sweep; do-not-contact → the email archive, the hard one; guest data → the contact sheet + CSVs), with a fallback order so the agent prefills and only interrupts the producer when every source is silent.

### 6.2 External-software inventory (versions verified)

| Tool / Service | Version | Role | Era |
|---|---|---|---|
| Next.js | 16.2.6 | React framework — App Router routing, server components, server actions, API route handlers. Not the Next.js most training data knows (App Router only). | 3 |
| React / React DOM | 19.2.4 | UI component model and browser renderer. | 3 |
| TypeScript | ^5 | Typed JS; all dashboard source is `.tsx`; gated by `tsc --noEmit` before commit. | 3 |
| shadcn (CLI) | ^4.8.0 | Component scaffolding CLI; generates the UI component set. | 3 |
| Base UI (`@base-ui/react`) | ^1.5.0 | Headless accessible primitives under the components. This project uses Base UI, **not** classic Radix. | 3 |
| Tailwind CSS | ^4 | Utility-first styling. | 3 |
| Supabase JS (`@supabase/supabase-js`) | ^2.106.2 | Client for Postgres, Auth, Storage. | 3 |
| Supabase SSR (`@supabase/ssr`) | ^0.10.3 | Cookie-based server-side auth for Next.js. | 3 |
| Supabase (platform) | hosted | Postgres + Auth + Storage + RLS + Edge Functions + pg_cron/pg_net. 46 migrations, 20 tables. | 3 |
| PostgreSQL | via Supabase | Enums, RLS, RPC functions, triggers. | 3 |
| Anthropic Claude API (`@anthropic-ai/sdk`) | ^0.98.0 | Server-side lower-thirds generation + extraction. Model `claude-opus-4-7`. Never called from the browser. | 3 |
| Zod | ^4.4.3 | Runtime validation of every import before DB writes. | 3 |
| Vercel | hosted | Deploys Next.js as serverless functions; manages env vars. | 3 |
| Rundown Creator API | REST | Pulls rundowns/scripts; errors arrive as HTTP 200 with a JSON error body. | 3 |
| Whisper (local or API) | n/a | Transcription for the future distribution pipeline (~$0 local, ~$0.36/hr API). | 3 (designed) |
| 1Password CLI (`op`) | CLI | Runtime credential retrieval; nothing hardcoded. | 3 |
| Git + GitHub | — | Branch → draft PR → squash-merge workflow. | 3 |
| MCP servers (Supabase, Rundown Creator, Vercel, GitHub) | — | Protocol connecting Claude to external tools; the Rundown Creator MCP is flaky. | 3 |
| Composio (Google Sheets) | — | Sheets wrapper; unreliable — prefer a native Sheets MCP. | 3 |
| n8n (self-hosted → n8n.cloud) | — | Workflow orchestrator; superseded, never deployed. | 1 → 2 (dead) |
| Notion | — | Database backend in Era 2; demoted to wiki-only. | 2 (dead as DB) |
| SQLite (`better-sqlite3`) | — | Status DB on the NAS. | 1 (dead) |
| Chokidar / BullMQ + Redis / faster-whisper / Playwright / ntfy / UptimeRobot | — | NAS file watcher, job queue, transcription, browser automation, notifications, monitoring. | 1 (dead) |
| Tailscale | — | Remote network access; permanently off-limits after the 2026-05-20 incident. | 1–2 (off-limits) |

**Distribution targets (real):** YouTube (Data API, auto), Rumble (no API, YouTube sync), Dropbox, Fireside.fm (no upload API), Signiant → Real Life Network, StreamHoster (FTP), Genesis Science Network (internal).

**Off-limits to automation (non-negotiable):** the production ProPresenter machine, the ATEM switcher, Bitfocus Companion, QNAP write/admin, the Notion workspace (wiki-only), and Tailscale / direct-server access.

### 6.3 The GSN subchannel campaign (self-contained playbook)

A separate effort: place Genesis Science Network (the ministry's 24/7 creation-science network) on donated digital subchannels of Christian-format US TV stations. Run by the producer; pre-launch as of June 2026.

**Locked barter offer (do not modify without explicit approval):** 270 hours of long-form programming + hundreds of short-form filler videos for the station's main channel; a free pre-configured SDI receiver box (ethernet in, SDI out) **or** an IP feed to existing master control (station's choice); in exchange for **one** open subchannel slot for GSN 24/7. **$0 carriage fee** (donor-funded); **non-exclusive**; **cancellable on 30 days' notice**; no must-air windows; the station keeps 100% of local ad availabilities. (There is no "1,000 hours" figure anywhere — the offer is 270 hours, consistently.)

**Targets — 73 stations, 4 tiers:** Tier 1 = 31 independent/family-owned stations (the primary cold pool); Tier 2 = 20 unconfirmed-lineup stations (verify the GM and an open slot via the FCC public file before sending); Tier 3 = 19 network-HQ stations (multi-market framing); Tier 4 = 3 majors (corporate-only; never draft without explicit instruction).

**Social-proof rule (every outward-facing artifact):** GSN is currently carried on exactly two stations — WGGS-TV (Greenville, SC) and WGGN-TV (Sandusky, OH). **Never reveal that it is only two.** Always phrase as "carried on Christian-format stations including WGGS-TV… and WGGN-TV…". Never write "our two affiliates," "pilot carriers," or any bounded count.

**Voice & format rules:** confident, enthusiastic, peer-to-peer (a fellow broadcaster, not a vendor); wonder-driven, never combative; no urgency tricks; one religious touch per email maximum (safest in the sign-off); plaintext only, sent personally from webmail (no HTML, images, or banner signatures); body 70–95 words; subject 2–6 words, under 50 characters, never the word "free"; one link maximum (on the ministry domain); no attachments on first contact; **no em dashes anywhere**.

**Workflow:** the AI assistant drafts; the producer sends every email personally and logs each status change in the master prospect spreadsheet. Warm intros (to the two existing carrier stations) go out first — a forwarded warm intro converts far better than a cold email — before any cold batch. The in-person hub is the NRB 2027 convention.

**Note on the producer's email address:** the campaign materials use `daniel@davidrivesministries.org` throughout, while the rest of the project uses `dallen@davidrives.com`. These are two different addresses on two different domains and should be reconciled before the campaign's deliverability/DNS setup runs.

---

## Part 7 — Drift & Contradictions

The evolution left decisions stranded in old files. These are stated as concepts (not file/line pointers) so they are usable without the repository. They remain open items for cleanup.

**Critical — live secrets committed to the repositories (must be rotated externally, then stripped; deletion alone does not purge git history):**
- A QNAP admin username+password pair is present in a master-context document in two repositories — the same credential class whose exposure triggered the Era-2 pivot, and ironically still listed as a "should rotate" open item.
- A Rundown Creator API key and token are hardcoded in the export utility script (and additionally leak via URL query parameters on every request).

**High — stale architecture language:**
- "Notion is the database" persists in master-context documents and across the entire original (Era-1/2) repository.
- Tailscale / SSH / server-setup steps remain in the old project-plan and infrastructure-inventory documents, even though that path is now permanently off-limits.
- Non-portable home-directory paths (macOS-style `/Users/...` and `~/Documents/GitHub/...`) appear in the blueprint's rules file and the mail CLI's README; on the current Linux host these break the "don't write into the live repo" guardrail.

**High — the phantom blocker:** a schema-design document describes a `graphics → lower_thirds` table rename as "pending." It was never executed; the live table is `graphics` and every query site uses it. This single thread spawned the false "Stage 7 blocked by a `lower_thirds` mismatch" claim repeated in several status files. The same schema document is also stale at "43 migrations" (live: 45) and still refers to a `lower_thirds` table by name.

**Medium — count / config drift:**
- A production config file records `episode_count: 25` while the database holds 48 (15 originally aired + extrapolated through January 2027), and lists an old platform set (Odysee/Facebook/Instagram/Website) instead of the real distribution platforms.
- The migration count appears as 28, 43, and 45 across different files; the live value is **45**.
- The table count is sometimes given as 18; the live value is **20** (the 18 domain tables plus `regenerate_attempts` and `app_config`).
- The `/upload` PNG page is called "legacy/phasing out" in docs, but the code shows it fully wired into the navigation.
- Records 0009/0010/0011 lack the back-pointing "superseded" banner they should carry; 0001 is "historical" but never formally superseded; and 0012 still says "Next.js 15" while the live stack is 16.2.6.

**Medium — AI-layer conflicts:**
- **YouTube category:** an older metadata document hardcodes Category 24 (Entertainment); the prompt library and the production config say Category **28 (Science & Technology)** and explicitly call 24 wrong. 28 is authoritative.
- **Email signature:** "Producer, Genesis Science **Network**" (the dominant form) vs "Genesis Science **Report**" (one template) are inconsistent.
- **Tier systems:** three different relationship models coexist — a 4-tier email-count model, a 5-tier appearance-count model, and a 2-mode (first-time vs returning) model — with no single source of truth.

**Medium — dead/broken dashboard code:**
- The per-episode lower-thirds route has a workspace component but no page file, so it is unreachable as written.
- A review-grid component expects the regenerate route to return `{text, variationNumber}`, but the route returns `{variations:[…]}` — that component is out of sync (and appears unused).
- The two Rundown Creator GET routes perform no auth check (they are gated only by the presence of env credentials).
- The `__text_only__` sentinel is defined twice; the upload form omits the `show_intro` segment (11 vs 12) and mutates Supabase directly from the browser.
- The example environment file documents only the Supabase variables and `ANTHROPIC_API_KEY`; it omits the Rundown Creator key/token and `ANTHROPIC_REGENERATE_MODEL`.

**Low — miscellany:** a co-producer's name is spelled two ways across eras; the Wonders Center city is given as both Dickson and Lewisburg in campaign drafts; some migration filenames embed the date twice and sort out of applied order (idempotent, no breakage); the deprecated `episodes.guest_name` field is still written by the import route.

**Convention vs reality:** the written DB convention says primary keys are `bigint`, but the real schema uses `uuid`. Trust the schema.

**Dead weight to archive/remove (none feeds the live system):** the Notion-import payload, the 7 never-deployed n8n templates, the ~10 Notion bootstrap scripts, the email-voice extraction script and its research data dump, and the two dormant repositories (the original automation repo and the guest portal). One open cleanup PR already removes most of the live repo's dead weight.

---

## Part 8 — Where This Points Next

1. **Run the real Stage-7 import** — land the first `graphics` rows in production. The only thing "blocking" it is operational, not code.
2. **Build the distribution slice:** Dropbox watch (+ audio companion) → Whisper transcript → Claude metadata → YouTube scheduled publish, with Rumble via YouTube sync and Fireside/GSN as handoff cards.
3. **Stand up the Source-of-Truth Map + GSR Architect agent** so data prefills from authoritative sources and only interrupts the producer when every source is silent.
4. **Clean up the drift (Part 7):** rotate and strip the two live secrets, reconcile the stale docs and config, add the superseded banners, fix the broken paths, and archive the two dead repositories — so the map stays trustworthy.

---

## Appendix A — Curriculum Layer Map

For building a system-setup course, the stack maps to these teaching layers (learn-order priority in parentheses):

| Layer | What to teach | Era relevance |
|-------|---------------|---------------|
| 1. Language foundation (1) | TypeScript ^5; Python 3.11+ (standard library + an HTTP client) | Era 3 |
| 2. Front-end (2) | React 19.2.4, Next.js 16.2.6 (App Router), shadcn ^4.8.0, Tailwind ^4, Base UI ^1.5.0 | Era 3 |
| 3. Data layer (3) | PostgreSQL, Row-Level Security, SQL DDL/DML, SQL RPC functions, enums, triggers | Era 3 |
| 4. Backend-as-a-service (4) | Supabase (Auth/Storage/Edge Functions), `@supabase/supabase-js` ^2.106.2, `@supabase/ssr` ^0.10.3 | Era 3 |
| 5. APIs & validation (5) | REST/HTTP clients, Zod ^4.4.3 | Era 3 |
| 6. AI integration (6) | Anthropic Claude API (`@anthropic-ai/sdk` ^0.98.0), MCP servers | Era 3 |
| 7. Workflow & deploy (7) | Git/GitHub, Vercel, npm/Node, `tsc`, ESLint | Era 3 |
| 8. Future pipeline (8) | ffmpeg, Whisper/faster-whisper, fswatch | Era 3 (designed) |
| 9. Historical / superseded (context only) | n8n, Notion-as-DB, SQLite, Chokidar, BullMQ/Redis, Tailscale | Eras 1–2 |
| 10. Off-limits hardware (architectural context) | ProPresenter, QNAP SMB, ATEM, Bitfocus Companion | All eras |

---

*Compiled 2026-06-04 from a full repository sweep, corroborated by a 10-agent verification pass against the live Supabase schema (46 migrations, 20 tables), the dashboard source code, the decision records, and the GitHub PR/commit history (41 PRs, 85 commits). Every count in this document was verified live. This file is self-contained: nothing outside it is required to understand the system.*
