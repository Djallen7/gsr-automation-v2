# GSR Export Archaeology — Consolidated Report

**Date:** 2026-06-08
**Author:** Lead synthesis analyst (consolidation pass)

**Method note.** This is the single authoritative consolidation of a 19-agent archaeology sweep over Daniel Allen's Claude history: 15 chronological conversation shards (~407 conversations, late April through early June 2026), two project-knowledge sweeps (his Claude projects plus uploaded docs), a design-chats-plus-saved-memories sweep, and a low-signal sweep of 115 short conversations. The ~9,400 lines of raw findings were deduplicated and reconciled against the live `gsr-automation-v2` repo: `CLAUDE.md`, `config/production.json`, the 46 Supabase migrations, the dashboard routes, `docs/AUTOMATION_ROADMAP.md`, and the prior `2026-06-04-CONFLICT-REGISTER.md`. Where the export contradicts the repo, the repo's live code and DB win and the item is flagged for Daniel rather than silently resolved. The goal is a gap-free view of every automation, dashboard, pipeline, or workflow idea Daniel proposed or endorsed that has been lost, overwritten, or never built.

**Status legend.** ALREADY-BUILT (in the live repo/DB) · PARTIAL (schema or design exists, UI/automation does not) · FORGOTTEN (proposed/endorsed, no repo trace) · CONFLICT (export contradicts the repo or itself).

**Relationship to the 2026-06-04 Conflict Register.** That register catalogs doc-vs-code drift inside the repo and is the authority for items it covers (YouTube category, Next.js version, the `lower_thirds` phantom, email tiering, etc.). This report does not re-litigate those; it cites them and adds the conflicts and forgotten items the export surfaces that the register did not capture.

---

## Executive summary

The highest-value forgotten or endorsed items, as one-liners:

1. **Three-Column Comparison L3 view (Primary | Var 1 | Var 2 side by side)** — designed in the old Notion doctrine, never built in the dashboard; editors need it to pick a variant before approving.
2. **Review-Queue Kanban + Gallery Browser + Production-Schedule Timeline L3 views** — three designed views, none built.
3. **"Create Episode L3 Package" bulk action** — one click to generate all ~61 L3 rows for an episode; designed, never built.
4. **Voice DNA as a versioned Supabase table, not just Claude Skills** — so the dashboard can draft in David's voice server-side. Endorsed in concept, never built.
5. **`archaeology.py` Claude/GPT-history analyzer** (INSIGHTS.md + AI_PRIMER.json + patterns.json) — Daniel said "build it" (option 1); never built or run.
6. **Season 3 backfill subagent team** (drive/youtube/podcast/correspondence harvesters + reconciler-writer) — designed, "ready to deploy," never run; blocked on a data-location survey.
7. **AppleScript that turns the outreach file into ready-to-send Mac Mail drafts** — proposed, blocked on three open guest fields, never built.
8. **STATUS.md + CLAUDE.md session-start/stop auto-trigger** — Daniel endorsed ("yes, but it has to trigger automatically because I won't remember"); built as downloads, never committed to repos.
9. **Email cross-reference agent team against `GSR-Email-Threads.numbers`** — 13-agent prompt written, never run; outreach emails were never checked against the real archive.
10. **`<gfx>`-cue dashboard pipeline (8-phase: upload → AI graphics+L3 → side-by-side approve → tracker → Sheet → guest brief → RC)** — designed in detail, endorsed, not built.
11. **507-contact universe vs 175 guests in Supabase** — 332 known contacts never imported.
12. **RC API token was pasted in chat (in an image) and should be rotated** — open security item.
13. **HTML/PDF guest topic brief as a standard per-guest deliverable** — endorsed as standard, lives only in skills/chats, not in the dashboard.
14. **`gsr-research` repo is the booking source of truth but has no STATUS.md / LANES.md / HANDOFF.md** — and its branch-and-PR default was never set.
15. **Six attribution-sensitive interview panels held from commit `a43498b`** in `gsr-research`, plus an unintended "angle expansion" to all 13 outreach emails — both pending Daniel's review, never pushed.
16. **Static-HTML tools sprawl** — GSN Outreach Dashboard, RLN Metadata Upload Hub, GSR Hub, guest-picker, Monday Tasks, Session Recovery tracker, Operator Runbook — all built, all living outside the repo in localStorage/Drive, none folded into the dashboard.
17. **`creationsuperstore.com` product lookup** — fabricated plugs are a recurring on-air credibility risk; a real lookup is in the roadmap (item 6) but not built.
18. **Per-guest "communication styles" tone calibration (outreach v3)** — proposed, never built.
19. **Pre-air heads-up email must NOT mention YouTube** — a hard rule easy to break with automation; lives in MASTER_CONTEXT, not yet enforced in any built workflow.
20. **No master ledger of previously-featured Featured-Resource books** — the only history lives in Rundown Creator scripts; a no-repeat check has to re-scrape RC every cycle.

---

## Conflicts to resolve

Each is phrased as a one-tap decision. Items already settled by the 2026-06-04 Conflict Register are marked "(register: …)" and need only confirmation.

| # | Conflict | Value A (source) | Value B (source) | One-tap decision |
|---|---|---|---|---|
| C-1 | **YouTube category** | 24 Entertainment (export memory: shard-06 F-06-YT-03; MASTER_CONTEXT F-35) | **28 Science & Tech** (live `config/production.json`; register H-03) | Repo already locked **28**. Confirm 28 and treat the export's "24" as stale. |
| C-2 | **L3 standard line length** | 55 char hard max (projectsA LT-02; memories F-009) | 59–65 / 60–65 band, "aim for band, 65 ceiling" (shard-10 #10; register M-02) | Confirm the band: **55–65, 65 ceiling**, with the Topic L3 / chyron exceptions below. |
| C-3 | **Topic L3 length** | 60–65 chars (projectsA LT-02; memories F-009) | 65-char generic / "exactly 65" in code (register M-02) | Confirm **Topic L3 = 60–65**; remove "exactly 65" from code so it stops overshooting. |
| C-4 | **First monologue graphic name** | "Intro Graphic" (memories block 019e1e68; Show 1 legacy, shard-06 F-06-G-02) | "Title Graphic" (06_MONOLOGUE GRAPHICS project, F-22; shard-09 F37) | Confirm **"Title Graphic" for Shows 2–5; leave Show 1's "Intro Graphic" as-is** (Daniel said "ignore Show 1"). |
| C-5 | **Chyron field order** | NAME \| TITLE \| WHY THIS PERSON MATTERS (projectsA LT-13) and NAME \| DISCIPLINE \| AFFILIATION (guide) | NAME \| ORG \| FIELD (live extract route; shard-15 LT-1; register M-03) | Confirm the live code order **NAME \| ORG \| FIELD** and align the guide. |
| C-6 | **GSN content figure** | "nearly 1,000 hours" (original GSN project 019deb33; OTA pitch shard low-score) | **270 hours long-form + hundreds of short-form** (shard-06 F-06-D-04; F-65; F-54) | Confirm **270 + short-form**; purge every "1,000 hours" remnant (some stale David-signed docs may still carry it). |
| C-7 | **Next.js version** | 15 (ADR-0012 text) | **16.2.6** (live; register H-12) | Repo locked **16.2.6**. Confirm and fix ADR-0012. |
| C-8 | **Lower-thirds table name** | `lower_thirds` (old doctrine, projectsA LT-10) | **`graphics`** (live; bucket is the only `lower-thirds`; register H-04) | Confirm **`graphics`**; no rename pending. |
| C-9 | **Season 3 episode count** | 50 (filming starts Feb, incl. Aug/Dec) / old 60-ep numbering | **48** (Jan start, no Aug/Dec; Nov has 3) (shard-12) | Confirm **48**. (Live `production.json` already says 48.) |
| C-10 | **Phantom ADRs** | projectsB F-39 treats ADR-0004/0005/0007 as active and authored | shard-09 F38 says ADR-0004–0008 referenced but files never existed | Decide: **author the missing ADRs** or strike the references. The content (master-metadata, Dropbox-no-metadata, AI-metadata-needs-approval) is real even if the files are not. |
| C-11 | **THD = which show** | "That's a Fact" (shard-02) | "Truly, He Designs" / "The Heavens Declare" used interchangeably for the THD segment (shard-01, shard-07) | Confirm what "THD" stands for as a source corpus vs the on-air segment name; they are being conflated. |
| C-12 | **Ming Wang interview slot June 15** | 10:00 AM arrival / 10:30 filming (design_memories F-34; low-score) | "morning in-person" with afternoon Zoom guests at 2:00/2:30/3:00 (shard-14 F09) | Confirm Wang's exact June 15 time. |
| C-13 | **"GSR has no graphics/chyron support"** | True in one memory block (019dbbea) — copy must stand on the ear | False everywhere else — full L3 package exists | This is a **legacy script-writing rule** (the on-air monologue copy must not depend on graphics), not a claim that the show lacks graphics. Confirm it is scoped to monologue copy only. |
| C-14 | **Run-of-show interview tease rows** | E10 = Interview 2 tease (shard-01 RC-5); E12 = interview tease (shard-10 #13) | F-08 / F-075 give a different letter map | Confirm the canonical run-of-show letter/number map (B/C/D/E/F) for the current cycle. |

---

## Findings by stage

Deduplicated. Each row: TITLE | STATUS | what it is | source conv ids | recommended action.

### Intake / Scripts

| Title | Status | What it is (concrete) | Sources | Recommended action |
|---|---|---|---|---|
| 11 locked verbatim phrases | ALREADY-BUILT (doc) | Greeting, host ID, "But first" pivot, monologue closer, "Welcome back," THD/GSM toss closers, interview welcome, MR intro/close, 5-line closing block. Never auto-edit. | projectsB F-03; projectsA RD-01; design F-072/077 | Ensure any AI script pass is told to skip these verbatim. |
| Voice DNA: 4 Claude Skills (gsr-voice, gsr-structure, gsr-antislop, gsr-episode-writer) | FORGOTTEN | Two-pass draft+critique; target 85% parity on monologue; <15 min/script. | shard-02 voice DNA; shard-03 F10/11; projectsB F-07 | Decide build vs park; if parked, log in roadmap. |
| Voice DNA as versioned Supabase table | FORGOTTEN | Store approved scripts + tags, retrieve semantically, inject to system prompt so the dashboard can draft in voice without Daniel driving Claude. | shard-09 F24 | High-value if dashboard ever drafts; add to roadmap. |
| THD voice corpus scan (239 commentary scripts + 12 THD) | PARTIAL | 239 scripts recovered from .indd; some suspected AI/team-written (Polaris, etc.) and would contaminate the profile. Score-by-authorship then rebuild from clean set. | shard-07 F8/F10; design F-068; projectsB F-73 | Resume the authorship scoring; Daniel offered folder access. |
| Episode-intro Playbook v2.2 (6 tease formats) | ALREADY-BUILT (doc) | Triple Headlines Stack, Wait-What, Stakes Ladder, Cold Clip, The Thread, Hybrid. ~35s, no guest names unless "big time," retire old "preview both + But first." | shard-10 #22/23; projectsA IS-06 | Confirm v2.2 is the live playbook reference. |
| Interview segment skill (cold open → 10–12 Q → resource tag) | ALREADY-BUILT (skill) | `gsr-interview-segment` locked structure; lower thirds 3 variations each. | shard-14 F44 | Keep; fold into repo skills if not already. |
| gsr-featured-resource skill | ALREADY-BUILT (skill) | "Hey David!" opener, [CORRESPONDENT] placeholder, no-repeat rule, approval gate, RC quirks. | shard-13 F-13–F-21 | Keep; note FR has no history ledger (see Misc). |
| gsr-viewer-voices skill | ALREADY-BUILT (skill) | "Thanks, David." opener, 4 locked E6 tosses, rotating correspondent, no-complaints rule, approval gate. | shard-13 F-22–F-30; design F-073 | Keep. |
| gsr-interview-source-compiler skill | ALREADY-BUILT (skill) | Raw verbatim source doc per month (no Claude-written scripts), with Season 3 Drive folder IDs. | shard-01 IW-9/10 | Keep. |
| Intro-writing rules (introduce the topic before the term) | FORGOTTEN (doc) | Establish phenomenon → name/explain → reveal hook → guest. Never use a term ("dead zone") without explaining it. Exported as a writing-techniques doc Daniel asked to make a portable skill. | shard-08 intro rules; shard-11 SCRIPT-06 | Capture as a skill; it is only in chat. |
| "Points to make, not answers to rehearse" | ALREADY-BUILT (principle) | Governing rule for guest talking points. | shard-11 SCRIPT-05/ENDORSED-04 | Keep in guest-prep prompts. |
| GSR Script Automation Word doc ("drag-and-drop AI template") | FORGOTTEN | Daniel wanted a downloadable template; chat ran out of space, context lost. | low-score Conv 99 | Decide if still wanted; likely superseded by skills. |
| GSR task-trigger files (GSR_Task_01–08) | FORGOTTEN | 10 task files uploaded as project knowledge; only 2 ever visible to Claude. | low-score Conv 93 | Abandoned config; ignore unless Daniel wants task triggers. |
| Script-aware cue placement via NLP sentence splitting | FORGOTTEN | Auto-place `<gfx>` cues in scripts. | design F-032 | Park; depends on extraction pipeline maturity. |

### Lower Thirds

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| L3 schema + extraction + import | ALREADY-BUILT | `graphics` table, 15-value `l3_type` enum, 3-column variants, char-count warning (<55 amber, >65 red), dry-run + YES import gate. | shard-09 F26–F34; roadmap items done | Run Stage 7 (first real import). |
| Standard package (3 Graphics Titles + Topic L3 P+2 + chyron + 15 discussion incl. 5 safety nets) | ALREADY-BUILT (rule) | ~20 L3s/interview; 61 rows/episode; ~1,342/season. | shard-07 F1; projectsA LT-03/08; shard-09 F28 | Confirm counts match `graphics` import expectations. |
| 5 quality tests before approval (Cover-the-video, Progression, Chyron, Variation, Two-topic Staple) | FORGOTTEN (doc only) | Approval gate from the old doctrine; not enforced in the dashboard. | projectsA LT-06 | Consider adding as a review checklist in the UI. |
| 4-state status workflow (Draft→In Review→Approved→Recorded) | PARTIAL | "Recorded" confirms it actually aired, not just approved. Dashboard has Approved; "Recorded" likely missing. | projectsA LT-09 | Decide whether to add the Recorded state. |
| Monologue Flag L3 (4–6 word opener, 1×3/episode) | ALREADY-BUILT (enum) | New L3 type added. | shard-09 F32 | Confirm in enum. |
| Discussion Safety Net as its own L3 type (DISCSN) | ALREADY-BUILT (enum) | 5×3 per interview, filterable mid-segment. | shard-09 F33 | Confirm. |
| Opening Monologue 5-beat arc (Setup→Tension→Implication→Challenge→Worldview Landing) | FORGOTTEN (doc) | Narrative arc for monologue L3s. | projectsA LT-04 | Bake into the monologue L3 generation prompt. |
| MR CTA L3 fires BEFORE the verbal CTA | FORGOTTEN (doc) | Counterintuitive timing rule; people respond 2–3x when they see+hear together. | shard-03 F45; projectsA LT-05 | Note in ProPresenter timing / graphics brief. |
| No commas in L3s (use AND, de-comma numbers) | ALREADY-BUILT (rule) | 1700 not 1,700; validated by a Python script. | shard-10 #10 | Confirm extraction enforces it. |

### Graphics

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| Graphics Tracker conventions | ALREADY-BUILT (doc/skill) | Clear C3:G300 never C2:G300; never touch Claude Cache tab; status "Created" only for "PM" prefix; reuses in rundown not tracker. | shard-06 G-01/03/05; projectsB F-21–F-26 | Keep; these are data-safety rules. |
| Graphic Type controlled vocabulary (7 values) | ALREADY-BUILT (rule) | Title Graphic / B-roll / Pre-made: B-roll / Clip w/audio / Picture / Article Screenshot / Propres Quote. Format field = verbatim type. | projectsB F-22; shard-06 F-06-R-08 | Confirm against extraction. |
| AI graphic-generation rules from 1,737-graphic archive | FORGOTTEN (research) | Interview pattern: Title → Article Screenshot (~90%) → B-roll/Picture. ~40% of all graphics are B-roll loops; clips w/audio ~2.4%. | shard-11 GFX-05 | Bake into AI graphic-suggestion feature. |
| Multi-agent scan of graphics archive for "graphic philosophy" | FORGOTTEN | Daniel asked to be reminded to run it; never done. | shard-11 GFX-07/OPEN-05 | Run or formally drop. |
| Graphics request template / AI image feasibility | FORGOTTEN | Structured intake form; Midjourney/DALL-E prompt generation. No tool chosen. | shard-04 G-01/02 | Park until image-gen tool decided. |
| MOGRT template set (lower third, location, resource card, donation CTA, 4-up Ken Burns) | FORGOTTEN (Jakob task) | Build-once After Effects templates; variable-width name boxes. MOGRTs come from Motion Array/Mixkit/Pond5, not GitHub. | shard-03 F57/ES-10; design F-065 | Track as a Jakob deliverable, not automation. |

### Rundown Creator (RC)

One consolidated entry per gotcha — these recur across nearly every shard.

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| **RC errors return HTTP 200 with JSON body** | ALREADY-BUILT (rule) | Always read the body, never trust the status code. | shard-01 RC-4; shard-15 RUN-1; CLAUDE.md | Live `/api/rc-*` honors this. |
| **rc_update_row needs numeric column IDs** | ALREADY-BUILT (rule) | "1"=graphics, "2"=format, "4"=lastline, "9"=notes. String keys silently no-op. EstimatedDuration is the lone by-name exception. | shard-06 F-06-R-01; shard-11 RC-01; projectsB F-27; design F-015/022 | Keep in skill + adapter. |
| **isPlainText=false mandatory on saveScript** | ALREADY-BUILT (rule) | true HTML-escapes `<gfx>` and converts `\n\n`→`<br>`, wrecking the teleprompter. | shard-06 F-06-R-02; shard-10 #2; design F-016/017 | Keep. |
| **lastline is a FORWARD cue (row N triggers row N+1)** | ALREADY-BUILT (rule) | The last spoken line before the NEXT graphic fires; min 5 words (3 if a complete sentence); chosen by topical relevance not exact cue location. | shard-03 F16; shard-06 F-06-R-10/11; projectsB F-23; shard-11 GFX-02 | Keep. |
| **Frozen rundown silently blocks writes** | ALREADY-BUILT (rule) | API returns success; nothing persists. Unfreeze in UI. | shard-06 F-06-R-04; design F-020 | Keep. |
| **Template:1 / Archived flags trap copies** | ALREADY-BUILT (rule) | Copies inherit Template/Archived; sidebar hides them; archived copies resist edit. Set Template=0 / unarchive first. | shard-12 §2; shard-13 F-08 | Keep. |
| **createRundown "Start/Date must be an integer" bug** | ALREADY-BUILT (workaround) | createRundown fails; copy a non-archived rundown instead, then setRundownProperties. | shard-04 R-01/O-03; shard-13 F-06; design F-018 | Keep. |
| **rc_insert_row never populates on insert** | ALREADY-BUILT (rule) | Insert blank then rc_update_row; clear StorySlug (blank on all graphic rows). Same-anchor inserts stack in reverse. | shard-06 F-06-R-05; projectsB F-29; design F-019/021 | Keep. |
| **Read-after-write returns stale cache** | ALREADY-BUILT (rule) | Verify in browser, not by immediate re-read. | shard-06 F-06-R-06; design F-039 | Keep. |
| **RC list endpoints crash the MCP server** | ALREADY-BUILT (rule) | `rc_list_folders`/`rc_list_rundowns` hang the server; even rc_ping times out after. Use targeted rc_get_rows with known IDs. | shard-10 #3 | Keep in skill failure-modes. |
| **RC MCP timeouts → use raw API** | PARTIAL | rc_get_rows/get_full_rundown hang 4 min; raw `API.php` (APIKey=danielallen) is responsive. Diagnostic prompt written, never run. | shard-11 RC-02/OPEN-02; shard-12 §2; shard-13 F-05/F-33 | Run the diagnostic OR fold RC behind a single adapter (see Data model). |
| RC is a fragile single-vendor dependency → adapter pattern | FORGOTTEN (design) | Never bake rc_* into many workflows; one-adapter swap. | shard-09 F19 | Adopt before building more RC automation. |
| RC ReadRate parameter required on saveScript | ALREADY-BUILT (rule) | MCP omitted it; raw API needs ReadRate (15 safe default). | shard-04 R-02; shard-12 §2 | Keep. |
| Segues live in main show rundown (E6/E8), reads in batch rundown | ALREADY-BUILT (rule) | VV/FR batch rundowns hold reads only; segues go to the episode rundown. | shard-13 F-03/F-17 | Keep. |
| 58:00 runtime calc (both interviews 780s + 30s outro, balance to exactly 58:00) | FORGOTTEN (scoped) | Dashboard button to compute episode timing; scoped, not built. | design F-004/023 | Add to roadmap if useful. |

### ProPresenter

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| Production machine off-limits (GSN-PropRes, 100.98.215.7) | ALREADY-BUILT (rule) | Test-machine only; David must approve; no Tailscale post-incident. | shard-06 PP-03; CLAUDE.md | Permanent. |
| ProPresenter MCP server (9 tools) built May 19 | CONFLICT/SUPERSEDED | A FastMCP server (pp_show_message etc.) over Tailscale was built — then Tailscale/direct-server tools were permanently barred by the 2026-05-20 incident the next morning. | shard-08 (full build); CLAUDE.md off-limits | Treat as historical; the live path is read-only/test-only via Companion. Do not resurrect the Tailscale MCP. |
| ProPresenter thumbnail trust-verification (preview Isaac's slides before tape) | FORGOTTEN (scoped) | Dashboard pulls per-slide thumbnails via the 7.9+ API for pre-tape QA. The safe, David-Rule-compliant first use case. | shard-06 PP-01; shard-09 F16; design F-003 | Strong Phase-2 candidate; add to roadmap. |
| Live ASR → ProPresenter lower thirds | FORGOTTEN (research) | MacWhisper/BlackHole or obs-localvocal → Claude → push styled text. No packaged tool exists; custom build, 20–30% confidence. | shard-06 PP-04; shard-07 F5/F48; design F-029; projectsB F-58 | Keep parked; explicitly a long-term exploratory item. |
| Bitfocus Companion is the strongest active integration path | FORGOTTEN (research) | ProPresenter ecosystem is small/aging; Companion module is best. | design F-029 | Note for the eventual ProPresenter feature. |
| ProPresenter pre-pop from Graphics Tracker | FORGOTTEN | Playlist/location-tag creation from the tracker, pre-production only. | design F-031; projectsB F-57 | Roadmap, pre-production only. |
| Lower thirds currently copied into ProPresenter by hand | ALREADY-BUILT (current state) | From the /approved route, manually. | shard-15 PP-1 | This is the accepted current state. |

### Shoot

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| gsr-filming-schedule HTML skill | ALREADY-BUILT (skill) | One-page printable schedule; badge classes (LIVE/PRE-REC/date/TBD); default crew call 8:30, film 9:30. | shard-10 #19; projectsA SH-01–04 | Keep. |
| Tape-day flow: skip THD/KC/Q&A/promos, drop in post; reverse-count timers | ALREADY-BUILT (decision) | Improved pacing on the April 30 shoot. | shard-03 F41/ES-07 | Operational; keep in production notes. |
| 13-minute Zoom interview format, 15-min early A/V check | ALREADY-BUILT (rule) | Standard remote interview spec + tech brief sent to guests. | low-score Conv 262/170; shard-06 SH-02 | Keep. |
| Pre-filming checklist from Apple Notes | ALREADY-BUILT (one-off) | Color-coded stateful checklist built from 3 shoot weeks. | low-score Conv 363 | Lives in a chat artifact; consider repo capture. |
| ADR-flub list during tape day | FORGOTTEN (process) | Mark flubs live, fix same/next day. | shard-03 F52 | Process note, not automation. |

### Transcription

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| Local transcription already runs at ~/Productions (fswatch+ffmpeg+whisper) | ALREADY-BUILT | base/small faster-whisper, CPU. | projectsA OI-06; design F-027 | Check its output before triggering new jobs. |
| Decision A: buy vs build transcription | FORGOTTEN (open) | Gates the local-runner seam for Phase 2. Unresolved. | shard-12 §4; design F-026 | Make the call; it blocks pipeline design. |
| Vercel cannot run hour-long Whisper / GB uploads | ALREADY-BUILT (fact) | Structural seam → local Mac worker pattern (queue flag in Supabase). | shard-12 §4; design F-028 | Keep in architecture. |
| WhisperX diarization (David vs Guest1 vs Guest2) | FORGOTTEN | Phase 2; pyannote, manual approval. | projectsB F-55/56 | Park to Phase 2. |
| Standard light transcription corrections | ALREADY-BUILT (rule) | "David Reeves"→"David Rives", "Dixon"→"Dickson", etc. | shard-08 transcription | Keep. |

### Metadata

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| YouTube metadata spec (title/desc/tags/chapters/category/playlists) | ALREADY-BUILT (doc) | Title `[Hook] \| Genesis Science Report - S03, Ep##`; category **28**; 3 playlists incl. PLsNop94Wb7fl22pdaKRY0BZpm1vIjf6Cr; Monday 4PM ET. | shard-06 YT-03; projectsB F-35; design F-047 | See conflicts C-1, C-10 anchor-tag sets. |
| YouTube title rule: 30% shorter / ~40–50 chars / single hook / ampersand | PARTIAL | Daniel saved this to memory after Ep013/014; AI repeatedly forgot it (59+ conversations). Roadmap item 4 bakes it in; not built. | shard-01 YT-1; shard-09 F46; design F-049 | Build the timecode+title pipeline (roadmap #4). |
| Timecode + title pipeline (transcript → segment cues → titles → Drive sheet) | FORGOTTEN/PARTIAL | Highest-volume repeated manual task. | shard-01 YT-3; roadmap #4 | Roadmap #4; high leverage. |
| RLN description hard cap 300 chars + 1200×1800 portrait thumbnail + -20 LKFS | ALREADY-BUILT (config) | Distinct from YouTube specs. | shard-07 F20–F22; projectsA DI-03/10; projectsB F-36 | In production.json; keep. |
| Distribution file-naming convention | ALREADY-BUILT (doc) | `GSR_S03_EpNNN_YYYY_MM_DD_[Guest]_[Runtime]_[Res]_[FPS]_[Bitrate]_H264.mp4`. | shard-07 F19; projectsA IS-02; projectsB F-46 | Keep. |
| Castmagic / Descript in the metadata+clip workflow | ALREADY-BUILT (vendors) | Castmagic ($39) show notes/social; Descript ($24) transcript-edit/clip pick. | projectsA MD-02/03 | Capture in vendor registry if missing. |
| Kilauea "Episode 48" perishable count | FORGOTTEN (edit) | Replace hard count with record-breaking framing in the Austin segment. | shard-15 META-1 | Apply the edit; unclear if done. |

### Distribution

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| 9-platform distributions enum | ALREADY-BUILT | youtube, rumble, dropbox, fireside_podcast, real_life_network, streamhoster, genesis_science_network, social_clip, other. | migration ...003000; production.json | Authoritative; note register M-06 (docs say 6). |
| Full stack facts (StreamHoster FTPS→Roku/AppleTV/iOS/LG; Signiant→RLN=RightNow Media; Dropbox partner; Fireside RSS→Spotify/Apple) | ALREADY-BUILT (canon) | Matches GSR-WORKFLOW-CANON §11. | shard-02 §9; projectsA DI-01–11; projectsB F-34 | Keep. |
| Pre-air heads-up email must NOT mention YouTube | FORGOTTEN (rule) | YouTube goes in a separate Tuesday email; pre-air lists Roku/FireTV/Rumble/GSN site only. Easy to break with automation. | projectsB F-16/F-38 | Enforce in any email-workflow build (risk: surfacing a pre-release link). |
| Push-once / upload-everywhere | FORGOTTEN (goal) | One approval fans out to all platforms; each gets a status enum. "Send" stays manual. | shard-09 F21 | The distributions table is the foundation; UI not built. |
| YouTube + Dropbox are the only Phase-1 auto platforms; rest deferred | ALREADY-BUILT (decision) | Rumble (API partner-gated, bounced), Fireside (read-only API), Signiant, StreamHoster all Phase 2/manual. | shard-07 F13–F18/E1 | Keep. |
| Rumble API request to bd@rumble.com | PARTIAL | Sent ~May 15; 2–4 week clock; production.json notes it bounced. | shard-07 F17; production.json | Follow up or treat manual. |
| CBN + Daystar blocked (no specs) | FORGOTTEN (blocked) | Onboarding but no delivery specs collected. | projectsA DI-07; projectsB F-37 | Mark "BLOCKED — specs pending," not "not started." |
| Signiant metadata Google Form auto-fill | FORGOTTEN (deferred) | Daniel wants the RLN form auto-filled (not Phase 1). | shard-07 F16; shard-06 YT-09 | Roadmap, Phase 2+. |
| CCB Marketing single-location metadata ingestion | FORGOTTEN (external) | Richard Groves: moving to one-location automated ingestion; spreadsheet method ending. | shard-09 F23 | Determine what "one location" means for GSR. |
| Pending vendor swaps (Fireside→Transistor, StreamHoster→Cloudflare Stream) need David approval | FORGOTTEN (decision) | Plus add Langfuse for prompt mgmt. | shard-09 F20; design F-051 | Surface to David before any swap. |

### Dashboard / UI

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| Three-frontend / role-scoped dashboards (Daniel / Miryam / Isaac) | PARTIAL (deferred) | Per-role views off one data layer. Explicitly deferred in roadmap until system tested + real data imported. | shard-09 F01–F04; roadmap deferred | Keep deferred; precondition is real-data import. |
| Cosmic Liquid Glass aesthetic | ALREADY-BUILT (direction) | Hubble bg, glass cards, star-lifecycle phase colors, Command-K. Mock in gsr-blueprint/mock. | shard-09 F05/F07; design F-001 | UI-strategy work continues in repo. |
| Three-Column Comparison L3 view | FORGOTTEN | Primary \| Var 1 \| Var 2 side by side to pick a variant before approving. | projectsA LT-11/DU-01 | Build; production-critical review tool. |
| Review-Queue Kanban view | FORGOTTEN | Draft→In Review→Approved→Recorded board. | projectsA DU-02 | Build. |
| Gallery Browser L3 view | FORGOTTEN | Visual card QA for Jakob. | projectsA DU-03 | Build. |
| Production-Schedule Timeline view | FORGOTTEN | "What L3s are due this week" by air date. | projectsA DU-04 | Build. |
| "Create Episode L3 Package" bulk action | FORGOTTEN | One click → all ~61 L3 rows pre-populated. | projectsA LT-12/DU-05; projectsB F-20 | Build; big time-saver. |
| Jakob approve/regenerate per-L3 buttons (same context) | FORGOTTEN | Regenerate keeps episode/segment context, not just reword; approve-all after review. | shard-09 F09; design F-002 | Build into the L3 review UI. |
| Daniel homepage: Gmail inbox panel + production-urgency tracker + rolling to-do synced to Apple Notes | FORGOTTEN | Items check off and rotate off end-of-day; sync to Apple Notes Monday checklist. | shard-09 F03/F10 | Roadmap; depends on Gmail integration. |
| Production tracker as the primary dashboard | ALREADY-BUILT (intent) | Operational pipeline tracker, not analytics. | shard-11 UI-01/02 | Matches current direction. |
| 8-phase `<gfx>`-cue dashboard pipeline | FORGOTTEN (design) | upload → AI graphics+L3 → side-by-side approve (inserts `<gfx>` tags) → tracker → Sheet → guest brief → RC. | shard-11 GFX-04/ENDORSED-05 | High-value design; fold into roadmap. |
| Interactive automation course / SSOT builder (12 modules, circuit board) | ALREADY-BUILT (artifact) | Course that also emits a pipeline spec + ADRs; linked to v2. | shard-15 UI-1/UI-2/UI-3 | Lives as artifacts; the course HTML is in docs/_handoff. |

### Data model

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| Core tables (episodes, graphics, guests, episode_guests, distributions, transcripts, content_clips, social_posts, articles, shoot_sessions, booking_pipeline, outreach_drafts, email_threads, premade_library, scripts) | ALREADY-BUILT | All have applied migrations; register H-05 corrected the false "PENDING" labels. | shard-09 F26; migrations | Build the UIs (most schema is done, UI is not). |
| L3 ordering fields (Segment Order, L3 Type Order, Line #) | PARTIAL/CHECK | Old Notion doctrine required them; verify `graphics` preserves ordering on export. | projectsA LT-10/DM-03 | Verify ordering survives export. |
| Episode + Guest FKs on every L3 | ALREADY-BUILT | episode_id + guest_id required for chyrons/discussion L3s. | projectsA DM-05 | Confirm. |
| 507 contacts vs 175 guests | FORGOTTEN (gap) | 332 known participants never imported. | projectsA GU-01/DM-06 | Decide on a bulk import for booking. |
| RC adapter abstraction | FORGOTTEN | One swap point for the fragile RC vendor. | shard-09 F19; design F-024 | Adopt before more RC automation. |
| YouTube RSS poller + pg_cron + vault secret | ALREADY-BUILT | Hourly RSS parse, flips youtube_url/published_at where null. | shard-11 DB-04/05/06; roadmap #8 | Confirm it actually flipped Ep16 on publish (the real test). |
| webstream_scheduled_publish_at expand/contract | PARTIAL | New column added+backfilled; old youtube_scheduled_publish_at drop pending post-deploy. | migration ...161640; roadmap follow-up | Do the contract migration after the deploy. |

### Ops / Infra

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| Supabase + Next.js + Vercel locked (ADR-0012) | ALREADY-BUILT | n8n+Docker+Redis+SQLite era dead. | shard-09 F12/F22; design F-055 | Don't revisit old stack. |
| QNAP read-only SMB; no Tailscale/server tools post-2026-05-20 | ALREADY-BUILT (rule) | Permanent after the incident. | shard-08 ops-incident; design F-056/057; CLAUDE.md | Permanent. |
| STATUS.md + CLAUDE.md session auto-trigger | FORGOTTEN | Auto-read STATUS.md at session start, rewrite at stop, per repo. Built as downloads, never committed. | shard-15 OPS-3/EC-4 | Commit a STATUS.md + hook per active repo. |
| "GSR Production" Claude Project with pinned STATUS.md | FORGOTTEN | Chat-side continuity equivalent. | shard-15 OPS-8 | Create if Daniel wants chat continuity. |
| Operator Runbook + Session Recovery tracker (which tool runs what) | FORGOTTEN (artifacts) | Maps chat vs Claude Code vs Terminal vs Cowork. | shard-15 OPS-2 | Persist in repo; routing confusion is recurring. |
| Cline .clinerules (autonomy-first, git+scoped-workspace safety) | FORGOTTEN | Full auto-approve on a throwaway branch; never open v2 or ProPresenter. | shard-15 OPS-1 | Commit .clinerules if Cline is still used. |
| Git training for Daniel | FORGOTTEN (request) | He asked for basic git training; never delivered. | shard-07 F32 | Schedule a session. |
| gsr-research repo lacks STATUS/LANES/HANDOFF; PR default not set | FORGOTTEN | Booking source of truth, direct-pushed, no handoff docs. | shard-15 OPS-6/7 | Add the standard docs; set branch-and-PR. |
| Static-HTML tools sprawl (GSN Outreach Dashboard, RLN Metadata Hub, GSR Hub, guest-picker, Monday Tasks) | PARTIAL | All built, all in localStorage/Drive, none in the dashboard or repo. | shard-05; shard-06 OI-01/YT-01; shard-14 F17 | Decide which to fold into the dashboard. |
| RESOURCES.md tool registry + 23 Batch-01 tools | ALREADY-BUILT (doc) | WhisperX, Companion, MediaCMS, etc., status-tagged. | shard-07 F31/F47 | Keep; 14 open research gaps tracked. |
| 1Password "GSR Automation" vault (15 items), shared w/ Miryam | ALREADY-BUILT | Bus-factor + OAuth expiry alerts. | projectsB F-48 | Keep. |
| Google Sheets cell-level MCP gap | FORGOTTEN (gap) | No reliable write tool; Composio unreliable. | low-score Conv 376; shard-11 blockers | Switch to native Sheets MCP. |
| HTML hub in Drive for all artifacts | FORGOTTEN | Navigation HTML linking all Claude-built HTML; prompt drafted, not built. | low-score Conv 183 | Optional. |
| Claude Code SessionStart hook malformed | FORGOTTEN (bug) | hooks.SessionStart.0.hooks = undefined; prints errors. | low-score Conv 241 | Fix Daniel's settings.json. |

### Guests

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| guests + episode_guests tables (expertise, is_yec, comm notes, booking_status, filming history) | ALREADY-BUILT | Roadmap item 1 done. | roadmap #1 | Build the guest email workflow UI (Phase 1A). |
| Guest mix 40/40/15/5 + Five-Point Stakes + 4 hook types + Barentine Test + accessibility tiers | FORGOTTEN (doc only) | Booking policy + topic-evaluation framework; lives in interview-research project context, not the repo. | shard-04 I-02/03/04/05; projectsB F-08/09/11 | Move into GSR-WORKFLOW-CANON or a reference doc. |
| Guest routing gatekeepers | ALREADY-BUILT (canon) | ICR→Mary Clair Kelly; Discovery→Tom Winkler / Rob Crowther; RTB→Melanie Martell; Mahoney→Jane Bjork; Metaxas→Christine Johnson; UK→Nadina; Tom Rogers→Derek. | projectsB F-15; design F-042; shard-14 F43 | Confirm in canon. |
| Do-not-book / deceased / correction list | FORGOTTEN (no store) | Bechly deceased (Jan 2025), Fuz Rana do-not-book (David's veto), Tim Mulgrew DO NOT BOOK, Bradley/Anderson deceased, Labedz is a cryoseismologist not volcanologist, Rana=CEO not VP, Gabrielse not HQI founder, Puchala not "Wernette." | shard-04 V-01; shard-05 §3; shard-14 F16 | Build a guest blacklist/correction field; these live only in chat. |
| Confirmed ≠ booked (manual accept only) | ALREADY-BUILT (rule) | Dashboard selection is not a booking. | shard-14 F18; design F-036 | Keep. |
| Questions never sent verbatim; talking points after confirmation | ALREADY-BUILT (rule) | Preserves on-air spontaneity; Stripling explicitly wants none in advance. | design F-040/041/043 | Keep. |
| Per-guest "communication styles" tone calibration (outreach v3) | FORGOTTEN | Calibrate email tone per guest. | design F-046 | Roadmap. |
| Guest fit scoring 0–100 with bands | ALREADY-BUILT (in gsr-research) | 90+ bullseye etc.; on guest cards. | shard-14 F06/F39 | Keep. |
| HTML/PDF topic brief per guest (GSR blue #1e4d8c) | FORGOTTEN (standard, no repo) | Reusable designed brief with clickable sources, <5 min read. | shard-11 BRIEF-01/02/ENDORSED-01 | Make a real deliverable/skill. |
| Email cross-reference agent team vs GSR-Email-Threads.numbers | FORGOTTEN | 13-agent prompt for voice/structure consistency vs the real archive; written, never run. | shard-15 INT-7 | Run before next outreach batch. |
| AppleScript → Mac Mail drafts from outreach file | FORGOTTEN | Build 14 ready-to-send drafts (To prefilled / routing note). Blocked on Austin address, Neal angle, Luskin issue. | shard-15 DIST-2 | Resolve blockers then build. |

### Social / Clips

| Title | Status | What it is | Sources | Recommended action |
|---|---|---|---|---|
| content_clips + social_posts tables | ALREADY-BUILT | FKs to episodes; UI not built. | migrations; roadmap | Build clips UI then social UI (roadmap). |
| Short-form repurposing (OpusClip) as top-priority growth | FORGOTTEN (priority) | Alongside email-list growth, affiliate revenue, cross-platform analytics. | design F-066 | Roadmap; not built. |
| Buffer (social scheduling) + Canva Pro (free nonprofit) | ALREADY-BUILT (vendors) | Social posts route to Buffer queue; Canva for thumbnails/RLN poster. | projectsA SC-01/02 | Add to vendor registry if missing. |
| Two thumbnail sizes (1280×720 YT, 1200×1800 RLN) | ALREADY-BUILT (spec) | Portrait RLN poster differs from YT. | projectsB F-61 | Keep. |
| Post-air analytics feedback loop missing | FORGOTTEN | Daniel writes "in the dark" on retention/comments; wants analytics access. | shard-03 F62 | Roadmap; "cross-platform analytics dashboard." |

---

## Endorsed Claude suggestions never built

Things Daniel explicitly said yes to (or acted toward) that have no repo trace:

1. **archaeology.py** — Daniel chose "1" (build); never built or run. (shard-11 ENDORSED-03)
2. **Season 3 backfill 5-agent team** — "ready to deploy"; never run, blocked on data-location survey. (design ES-6; shard-12 §4)
3. **STATUS.md + CLAUDE.md auto-trigger** — endorsed; built as downloads, never committed. (shard-15 EC-4)
4. **Email cross-reference agent team** — prompt written, never run. (shard-15 INT-7)
5. **Three-Column Comparison + Kanban + Gallery + Timeline L3 views** and **Create Episode L3 Package** — endorsed in the doctrine, never built. (projectsA LT-11/12)
6. **Jakob approve/regenerate L3 buttons** — endorsed as "the correct first feature," never built. (shard-09 F09)
7. **8-phase `<gfx>` dashboard pipeline** — "all of it needs to be in a doc"; designed, not built. (shard-11 ENDORSED-05)
8. **HTML/PDF guest topic brief as the standard for every guest** — endorsed; lives only in chats. (shard-11 ENDORSED-01)
9. **B-roll context-doc self-improvement rewrites** — Daniel said he'd apply them "in batch"; unconfirmed whether the actual file was updated. (shard-04 B-04)
10. **GSR Interview Research project context sheet + 22-task menu** — approved for upload; uncertain it ever landed in a persistent project. (shard-04 I-06/I-07)
11. **Voice DNA in Supabase** — endorsed in concept. (shard-09 F24)
12. **Preferred-name/credit + social-clip-permission asks in every outreach email** — Daniel said "yes"; unclear they made it into the email template rebuild. (shard-15 GUESTS-1/2)

---

## Forgotten / abandoned tools & automations

- **archaeology.py** — designed (SQLite index + Anthropic API + INSIGHTS.md/AI_PRIMER.json/patterns.json). Status: never built. (shard-11 OPS-01)
- **AppleScript Mail-draft generator** — proposed; blocked, never built. (shard-15 DIST-2)
- **GSR task-trigger files (GSR_Task_01–08)** — uploaded, never accessible; abandoned. (low-score Conv 93)
- **STATUS.md auto-trigger + Operator Runbook + Session Recovery tracker** — built as artifacts/downloads, not committed. (shard-15 OPS-2/3)
- **Season 3 backfill subagent team** — designed, not run. (design F-058)
- **GSR Script Automation Word doc** — context lost mid-build; abandoned. (low-score Conv 99)
- **Multi-agent graphics-archive "philosophy" scan** — Daniel asked to be reminded; never done. (shard-11 GFX-07)
- **RC MCP timeout diagnostic prompt** — written, never run. (shard-11 OPS-03)
- **HTML artifact hub in Drive** — prompt drafted, hub not built. (low-score Conv 183)
- **Notion CLI (ntn) + Notion workspace build** — installed then abandoned for Supabase (ADR-0012). (shard-09 F18)
- **ProPresenter Tailscale MCP server (9 tools)** — built, then permanently superseded by the security incident. (shard-08)
- **Gemini hybrid evaluation** — 8-week test proposed; no follow-up. (shard-09 F44)
- **B-roll self-improvement loop rewrites** — converged in simulation; unclear if applied to the real file. (shard-04 B-04)

---

## Separate projects surfaced (live only in Claude projects, not the repo)

- **Wonders Center Curriculum Program** — complete 6-doc teacher packet, "Earth, Flood, and the God They Reveal" (Abeka 8th-grade), pricing ($18/student proposed), TN Christian-school prospect list + outreach kit + curriculum poll, planned "Space & Sky" companion module. A full distinct project. (shard-14 F21–F32; projectsB F-71/72)
- **GSN Subchannel / OTA outreach campaign** — 73-station, 4-tier campaign; live partners WGGS (Greenville SC) + WGGN (Sandusky OH); dossier prompts; `gsn-subchannel-campaign` repo. Distinct from GSR automation. (shard-05/06; projectsB F-64/66)
- **CTN (Changing the Narrative)** and **WWN (Wonders Without Number)** — separate shows needing their own schema; deferred in the roadmap. (projectsB F-69/70; roadmap CTN/WWN)
- **Genesis Apologetics film partnership ("Operation Cold Bones")** — single-film, late-2026/early-2027; Logan Kiesewetter; $7–10K sponsorship ask. (shard-03 F28–F35; shard-09 F43)
- **C21C render backlog** (100+ episodes, Isaac) — explicitly out of scope for GSR automation. (projectsB F-69)
- **DRM color-pipeline / DaVinci calibration**, **F&B side business** — out of scope. (design F-067; projectsB F-74)

These should each have their own workspace/handoff; they currently live only in Claude.ai projects or separate repos.

---

## Security / hygiene action items

- **Rotate the Rundown Creator API token.** It was pasted in chat (in an uploaded image) to unblock work and used ephemerally; rotate it via the refresh icon. Do not store it in files/skills. (shard-13 F-34) Reference by name only: the "Rundown Creator API token."
- **The RC token also appears in a sample `claude_desktop_config.json` in the export.** Treat any RC token value seen in chat or config samples as compromised and rotate. (shard-08)
- **507-contact vs 175-guest gap.** 332 known participants are not in Supabase; decide on a vetted bulk import. (projectsA GU-01/DM-06)
- **GSN carriage integrity.** Claude correctly refused the "carried on stations including WGGS and WGGN" framing when those two are the whole list (deceptive implicature). The honest framing ("carried on WGGS-TV in Greenville and WGGN-TV in Sandusky") is the locked standard. Keep it. (shard-15 GSN-5)
- **Stale "1,000 hours" GSN figure** may still exist in David-signed docs / project knowledge; purge to 270 + short-form. (shard-15 GSN-6)
- **Fake DMCA scam email** flagged from a Gmail address to comments@genesissciencenetwork.com — no action needed beyond awareness. (low-score Conv 398)
- **Credential vault** is shared with Miryam (bus-factor); keep OAuth-expiry alerts active. (projectsB F-48)

No secret values are reproduced in this report; credentials are referenced by name only.

---

## Excluded (out of scope)

A **personal/legal research track** surfaced in the export — a ProPublica/financial dossier on David Rives Ministries and family members, plus a related lawsuit, pursued through multiple AI channels (shard-12 §8). This is deliberately excluded from this build report. It is not part of the GSR automation/dashboard scope and should not be folded into any production spec, schema, or roadmap. It is noted here only so the omission is intentional and visible.

---

## Recommended phased rollout

Grouping the FORGOTTEN and PARTIAL items along the Manual → Prompt-handoff → Auto maturity dial. This complements (does not replace) the existing `AUTOMATION_ROADMAP.md`.

### Phase 1 — manual-first, high-value, low-effort
- **Run Stage 7** (first real episode import; graphics still 0 rows). *(unblocks everything)*
- **YouTube RSS poller** — confirm it flips youtube_url on Ep16 publish.
- **Three-Column Comparison + Create Episode L3 Package + Jakob approve/regenerate** in the L3 review UI.
- **Guest email workflow UI (Phase 1A)** off `v_episode_workflow`.
- **HTML/PDF guest topic brief** turned into a real skill/deliverable.
- **creationsuperstore.com product lookup** (roadmap #6) — kills fabricated plugs.
- **Commit STATUS.md + handoff docs to gsr-research; set branch-and-PR.**
- **Rotate the RC API token; fix the malformed SessionStart hook.**
- **Move the 40/40/15/5 mix, Five-Point Stakes, accessibility tiers, do-not-book/correction list into canon.**

### Phase 2 — prompt-handoff / semi-automated
- **Timecode + YouTube title pipeline** (bakes in the 30%-shorter rule).
- **Content clips UI → social posts UI.**
- **8-phase `<gfx>`-cue dashboard pipeline** (upload → AI graphics+L3 → side-by-side approve → tracker → Sheet → guest brief).
- **RC adapter abstraction** + resolve the MCP-timeout diagnosis.
- **Email cross-reference agent team** run before each outreach batch; **AppleScript Mail-draft generator** once blockers clear.
- **ProPresenter thumbnail trust-verification** (test machine, read-only) — the David-Rule-safe first ProPresenter feature.
- **Resolve Decision A** (buy vs build transcription); add diarization.
- **Bulk-import the remaining 332 contacts** (vetted).
- **Review-Queue Kanban + Gallery + Timeline L3 views; 58:00 runtime button.**

### Phase 3 — auto / exploratory
- **Push-once / upload-everywhere** distribution fan-out (Signiant form auto-fill, Rumble, StreamHoster), with "Send" still manual.
- **Season 3 backfill subagent team** (after the data-location survey).
- **Voice DNA in Supabase** + the 4 voice skills, if dashboard-side drafting is wanted.
- **Live ASR → ProPresenter lower thirds** (explicitly low-confidence; evaluate-then-defer).
- **Role-scoped per-user logins** (already deferred until the system is proven on real data).
- **Cross-platform analytics dashboard** + short-form (OpusClip) repurposing.

Hard constraints across all phases: ProPresenter production machine, ATEM/Companion, QNAP writes, and Tailscale/direct-server tools remain off-limits; the lower-thirds import dry-run + "Type YES" gate and the "Send"-stays-manual rule are non-negotiable; the David Rule governs every step.
