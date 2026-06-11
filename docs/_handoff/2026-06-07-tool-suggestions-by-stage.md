# GSR Tool Suggestions by Pipeline Stage

Loop task T2. For each of the 9 stages, the best 2-3 tool options per relevant
category, with a recommended pick, reconciled to the v2 repo's current tool
registry (GSR-WORKFLOW-CANON.md). These are opt-in suggestions for the course
to surface per stage. Generated 2026-06-07. No production changes; advice only.

Legend: **Pick** = recommended. "Honorable" = viable alternative. Items marked
OFF-LIMITS stay human/manual by canon (David Rule, production hardware).

---

## Stage 1 - Script
- Intake / file-watch: **LOCAL Mac watcher (fswatch / Hazel / Automator)** on the export folder. Honorable: Chokidar (local only), native `fs.watch`. NOT a NAS file-watcher (barred).
- Script source: **Google Docs / Drive** (already the workflow); Mac watcher triggers on the saved script.
- Lower-thirds extraction (from the script): **`@anthropic-ai/sdk`** server-side, gated by dry-run + Type-YES. Honorable: Vercel AI SDK.

## Stage 2 - Guests
- Guest record: **Supabase `guests` + `episode_guests`** (already live: expertise, is_yec, comms notes, booking status).
- Outreach drafting: **templated email + `@anthropic-ai/sdk` for drafts only** (human sends). Honorable: a saved prompt in the toolkit.
- Credential verification: human review (a credibility/David-Rule step); surface an "unverified, verify before air" flag rather than auto-trust.

## Stage 3 - Graphics
- Tracker: **Supabase `production_graphics` + the dashboard Graphics page** (mirrors the monthly sheet).
- B-roll sourcing: **Storyblocks** (Pick for stock), **Dreamstime**, **Envato** as the source shortcuts per row.
- Lower-thirds copy: the `graphics` table + the 55-65 char gate + regenerate via `@anthropic-ai/sdk`.
- Push to ProPresenter: human-gated, only when status = Created + filename. NOT automated to the production machine.

## Stage 4 - ProPresenter load
- OFF-LIMITS to automation: production machine (GSN-PropRes) is test-machine-only until David approves. No tool here; the dashboard only shows a "ready to load" signal a human acts on.
- Rundown Creator: in-app via `/api/rc-*` (remember RC returns errors as HTTP 200, parse the body). RC API setup is a deferred TODO.

## Stage 5 - Record
- Capture hardware (ATEM / Bitfocus Companion): OFF-LIMITS to automation (production hardware). Human-operated.
- Raw footage to Dropbox: **`dropbox-sdk-js`** (chunked over 150MB). Runs on the Mac, not Vercel.

## Stage 6 - Edit / Review / Export
- Editing: human NLE (Premiere / Resolve / FCP). Not automated.
- Loudness compliance: **`ffmpeg` loudnorm to -20 LKFS** as an automated pre-send gate. Honorable: a dedicated loudness CLI.
- Final export delivery: **`dropbox-sdk-js`** to the agreed Dropbox folder.

## Stage 7 - Metadata + Thumbnail
- Metadata: **TEMPLATED, not AI** (canon decision). Variable title hook is Daniel's call; the rest is template fill.
- Thumbnail: human design (Canva / Photoshop). Surface a "thumbnail done" checkbox, do not auto-generate.
- Category: YouTube category 28 (Science), templated.

## Stage 8 - Distribute (7 targets)
- YouTube: **official `googleapis` resumable client** on the Mac. NOT `youtubeuploader` (dormant). Add a publish-time audit guard.
- Rumble: **manual web upload (Phase 1)**; pursue the official Upload API token. NOT browser automation; the YouTube sync is dead.
- StreamHoster (feeds Roku/Apple TV/iOS/LG): **`basic-ftp` (FTPS)**. Honorable: `ssh2-sftp-client` if SFTP.
- Real Life Network (via Signiant): **`api_client_media_shuttle_node`** official SDK, -20 LKFS.
- Dropbox network partners: **`dropbox-sdk-js`** drop, no metadata.
- GSN: **Roku Direct Publisher JSON feed** (PROPOSED; confirm the channel is Direct Publisher before building).
- Podcast: **migrate Fireside to Transistor.fm publish API** (+301); Spotify/Apple ride the RSS. NOT Fireside browser automation (API is read-only).
- Captions/transcripts: **WhisperKit + SpeakerKit** (Mac-native, speaker labels). Honorable: faster-whisper, whisper.cpp, WhisperX.

## Stage 9 - Aired
- Mark aired: **dashboard action** writing to the episodes/distributions records.
- Archive: keep the aired registry in Supabase; no new tool needed.

---

## Cross-cutting (apply across stages)
- Orchestration / queue: **Supabase Cron -> Edge Function** for scheduled jobs + **the Mac polls a Supabase `jobs` table** (consider native **pgmq/Queues**, see the optimization report) for heavy media. NOT BullMQ/Redis unless a real worker queue is later needed.
- Notifications (auth-failure alerts on unattended jobs): **ntfy** (or email). Honorable: Apprise, Gotify.
- AI: **`@anthropic-ai/sdk`** server-side, lower-thirds extraction + regenerate only. Metadata stays templated.
- Status DB / dashboard: **Supabase Postgres + Next.js 16 + shadcn/ui + Tailwind v4** (already built).

## Sources
- gsr-automation-v2 GSR-WORKFLOW-CANON.md (reconciled tool registry, section 11, distribution stack).
- gsr-automation-v2 CLAUDE.md (project state, off-limits infra, David Rule).
- Companion detail in docs/2026-06-07-build-optimization-report.md.
