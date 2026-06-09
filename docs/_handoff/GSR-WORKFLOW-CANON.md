# GSR Workflow Canon (Daniel's answers, do not re-ask)

**Date:** 2026-06-04 · **Status:** Authoritative record of how Daniel actually runs GSR. If a future session is about to ask Daniel something here, the answer is in this file. Sourced from Daniel directly + the live Google Drive (the Drive MCP works, owner `danielallen.tn@gmail.com`) + the repo schema. Cite Drive IDs below before re-reading.

> **Standing rule (see CLAUDE.md > Authority):** Daniel's stated input is gospel and supersedes any repo doc, code, or prior assumption when resolving a question or conflict. **Append every new thing Daniel says to this file, dated, so it is never re-asked.** This file grows over time; it is the running memory of his decisions.

---

## 0. The hard rule: Lower Thirds and Graphics are two separate systems

They are never mixed, never share a workflow, always referred to by those exact names.

| | **Lower Thirds** | **Graphics** |
|---|---|---|
| What | Text chyrons (TOPIC L3, GUEST CHYRON, DISCUSSION L3s) | Designed visual assets (title cards, b-roll, screenshots, montages, propres quotes) |
| Source | The **LOWER THIRDS section inside Daniel's script docs** | Generated ideas, approved, then designed by the team |
| Lives in | The script document | The **Graphics Tracker** (monthly Google Sheet) |
| Pushed to Rundown Creator? | **No** | **Yes** |
| ProPresenter | Their **own** presentations | **Separate** presentations |
| DB table | currently `graphics` (should be renamed `lower_thirds`) | `production_graphics` |

---

## 1. Intake model (Phase 0, works off the bat)

- Daniel keeps his **own** process for research, guest pairing, email drafting, and writing scripts + lower thirds. He does **not** trust AI to write scripts to standard yet. Script generation is a **later phase**; build the hooks now, do not turn it on.
- The workflow **starts by uploading**: a **script per segment** (monologue, interviews, ministry report, etc.) as teleprompter text. Some segments are **prerecorded** and come in as **transcripts** standing in for the script.
- **Lower thirds are a separate, optional file**, never required at script upload, importable **any time** for **any** already-uploaded segment. Parsing the LT document into rows is deterministic (not AI): upload, preview counts, type YES, it lands.
- Real script + LT format (from Drive, e.g. "S03 Ep022 Interview 1 Tim Clarey", doc ID `17N9JfyN3P3CKGqB7llgNGWa8UNiv6xwpJ2MPrTBgmcE`): the doc has INTERVIEW SET UP, INTERVIEW QUESTIONS, RESOURCE TAG, then a `LOWER THIRDS` block with `TOPIC L3`, `GUEST CHYRON`, `DISCUSSION L3s` (each with a char count). That block is the LT source.

## 2. The maturity dial (how automation phases in)

Every generative task has three stages; flip the dial per task as trust grows. **Automation is the end goal, stated from day one**, but enabled gradually.
1. **Manual** — Daniel does it, system stores it.
2. **Prompt handoff** — system hands a context-loaded prompt with a strict output spec, Daniel pastes it into Claude Desktop, pastes the result back, and it flows through the **same dry-run + type-YES gate** before any DB write. A bad paste cannot corrupt anything.
3. **Auto** — system makes the Claude call itself. Identical output spec and gate.

Store each task's stage in `app_config`; defaults start at Manual/Handoff. Tasks that fit the handoff mold: lower-thirds extraction, **graphics idea generation**, metadata, title-shortening, guest enrichment/verification, outreach drafts, social/clips, rundown tease copy, source-of-truth fills. Deterministic tasks (LT parsing, imports, status toggles, RC mapping, transcription, uploads) just automate, no prompt.

## 3. Pre-production sequence + the gates

1. Upload script (+ optional LT file)
2. **Generate graphic ideas → Daniel approves** (graphics, not lower thirds)
3. Approved graphics drop into the **Graphics Tracker** for the design team
4. Approve lower thirds (text)
5. **Build the rundown** in Rundown Creator (only after graphics approved); **graphics push to RC, lower thirds do not**
6. **ProPresenter gate:** a graphic is pulled from its folder and pushed to ProPresenter **only once its Graphics Tracker status flips to "Created" and the filename is entered.** The system surfaces a "ready to load" signal; a human does the push (ProPresenter stays off-limits to automation per the David Rule until David approves a tested path).

## 4. The Graphics Tracker (matches Daniel's live Google Sheet exactly)

**Do not invent a new layout. Interns must not have to learn a new workflow.** Match this:

- **One Google Sheet per month**, named like `05_GSR Graphics Tracking: May` (also `04_...April`, `12_...December`). Tabs = **Show 1 ... Show 5** (the five episodes shot that cycle). May sheet ID `1GmdVDOP4h0k6FmOdZLMJNroz7_x4xDcErBYmdGU0890`. Folder path: `GSR Shared Folder` (`1GrznCTkm28mWSN_JMRMi0OlopqpR2HpM`) -> `03_Graphics` (`1GPapO_ezhAZBSjgoejj2usMQRWfUVGs4`) -> `Season 3` (`18RZ8UNF2nN67G6as-Uj5o5O3BbNFChoR`). There is also an `01_Templates` folder (`1vzDS5noM1e9vgRPBVQB63cJfi87MdFJw`).
- **Columns (exact):** `Segment | Graphic # | Graphic Type | Description | Status | Assigned To | Notes`
- **Segment order in a show tab:** Opening Monologue (up to ~20 rows), The Heavens Declare, Kids Corner, Q&A, Ministry Report (1-4), Viewer Voices, Featured Resource, GSM, Interview 1 (up to 15), Interview 2 (up to 15), occasionally Interview 3.
- **Status values (canonical, Daniel's order):** `Not Started -> In Progress -> Created -> Loaded In`. ("Created" = file made + filename entered, triggers the ProPresenter pull; "Loaded In" = it is in ProPresenter.) NOTE: the DB CHECK currently lists these in a different order and PROMPT_LIBRARY drops "In Progress" — fix both to this set.
- **Graphic Type values:** Title Graphic, B-roll, Pre-made: B-roll, Pre-made: Graphic, Clip w/audio, Article Screenshot, Picture, Propres Quote, Propres Graphic, Roll-in, Graphic, **Book Cover** (Book Cover is used in the sheet but missing from the DB CHECK; add it).
- **Assigned To (real people in the sheet):** Isaac (monologue + both interviews), Jakob (roll-in segments: THD, KC, Q&A, FR, GSM), Jeremiah (b-roll), Gabe (GSM roll-ins), Daniel (article screenshots he sources). Roll-in rows name the prerecorded file, e.g. `THD 390 - DAY YOM`, `KC S02 Ep21 - Bobcats`, `GS Minute 085 - The Kings Astronomer`.
- **Graphics generation philosophy** (Drive doc `GSR_Graphic_Philosophy_AI_Rules.md`, ID `1fC9YoLGcUi8lZKf_2QqRGvGMkYfO-27xTNd2a9x3GwU`, derived from ~1,737 logged graphics): quantity over quality, generic over specific, reusable over one-off; monologue 8-15 graphics (one every 2-5 sentences), graphic #1 almost always a Title Graphic; interview 5-9, #1 Title then #2 Article Screenshot ~90%; ministry report 2-4, no title card. Never leave an empty cue slot.

## 5. Graphics page UX Daniel requires

- **Side-by-side view: the script on one side, and the spot in the script where each graphic should display is highlighted**, so Daniel sees both when approving and interns get context for a graphic (e.g. a b-roll loop) before sourcing clips.
- **B-roll library services the team sources from:** Storyblocks, Dreamstime, Envato.

## 6. Files and ProPresenter

- **Graphics files live in a folder on the "Videoedit" server.** Build and **test the system locally first**, then link to the server. The **filename is the key** that links a tracker row to its file.
- **ProPresenter uses preset 5x show playlist templates that are reset every month.** Lower thirds and graphics live in **separate presentations**. Pushing a graphic requires mapping it to the **right slide / presentation / playlist / location** (real work, gated and human-pushed for now).
- **>> REMINDER (Daniel TODO, deferred): the ProPresenter slide/presentation/playlist mapping must be defined with Daniel at his computer.** Defer the ProPresenter push design until then.

## 7. Source documents in Drive (for future re-reading, not re-asking)

- Graphics Tracker (May): `1GmdVDOP4h0k6FmOdZLMJNroz7_x4xDcErBYmdGU0890`
- 2026 GSR Airing Schedule (the authoritative air-date sheet, weekly Tuesdays): `1aYol4UttD8tS2qln0BjC3S0Hw-rRGSRQ`
- 2026 GSR Episode Titles/Timecodes: `125k40g56CEhYnggEnRWIy9zh5mbs7GCdXwctQ1qJnHA`
- 2026 Monthly Interview Schedule (guest pairings per show/episode): `18PkpvkjYcLY3ZYTkXA3s0-t31ORhv8e0Di8SiTi6PY8`
- Graphic Philosophy / AI rules: `1fC9YoLGcUi8lZKf_2QqRGvGMkYfO-27xTNd2a9x3GwU`
- Interview script + LT example (Tim Clarey): `17N9JfyN3P3CKGqB7llgNGWa8UNiv6xwpJ2MPrTBgmcE`

_The Drive MCP can read Google Sheets/Docs/PDF directly. Use it to match real structures instead of asking Daniel again._

---

## 8. Repo cross-check (verified 2026-06-04) + the only real open gaps

**Confirmed already in the repo (do not re-ask):**
- **VideoEdit server** is where pre-made assets live: `premade_library.server_file_path`, example `/GSR/Broll/Space/galaxy_flythrough_01.mp4` (`SUPABASE_SCHEMA_DESIGN.md:246,259`). Drive holds copies.
- **B-roll source enum** today: `envato, storyblocks, nasa_svs, creation_com, own_production, other` (`migrations/20260528005100_add_premade_library.sql`). One-off finds also use Unsplash/Pixabay/Pexels/NASA public domain.
- **Run-of-show** (15 segments) with prerecorded ones tagged: The Heavens Declare, Kids Corner, Q&A, Genesis Science Minute are **pre-produced roll-ins** (`SYSTEM-EVOLUTION.md:311-327`). Roll-in files named like `THD_390_DayYom`, `KC_S02_Ep021_Bobcats`; matched to the episode by filename pattern (`AUTOMATION_ROADMAP.md:128`).
- **Team / roles:** Isaac (monologue + both interviews + owns the graphics tracker + edit/export), Jakob (roll-in segments), Jeremiah (b-roll + raw footage to Dropbox), Gabe (GSM roll-ins / edit list), Miryam (metadata, thumbnails, uploads, mark aired; Daniel's successor), David (on-air talent, writes graphics instructions into monologue scripts), Daniel (owner, scripts). **Jakob (editor) is NOT Jacob (footage transfer/THD)** - two people.

**The only genuine gaps still needing Daniel (everything else is captured):**
1. **VideoEdit server address / SMB share path.** The logical name and an example path exist, but no hostname/IP/mount path. Not needed until we link off local testing.
2. **Dropbox structure conflict.** `config/production.json` specifies a per-episode tree (`Season 3/{episode_label}/Raw|Edit|Graphics|...`); the older blueprint says keep folders **flat, one per show**. These disagree; pick one before the master-intake step.
3. **Interns.** Daniel's design team includes interns who use the tracker, but no one is rostered as an intern in any doc. Names above are the known crew.

## 9. Graphics page design (locked 2026-06-04, from the preview review)

- **Master view + 5 show tabs.** A "Master" tab shows all 5 shows of the month at once with a status progress bar and per-segment "ready" counts, so Daniel sees where graphics stand at a glance. Each show also has its own tab.
- **Drill in:** pick a show, then a segment, to see that segment's graphics with the script **side by side**. Both panes are always visible at once; the page never scrolls (desktop = segment rail | script | graphics; phone = swipeable segment strip on top, then script above graphics, each scrolling on its own).
- **Script highlights span 2-3 sentences** = the context that tells an intern what a b-roll clip is for before they source it. Highlight color tracks the graphic's status.
- **Click a graphic -> the script auto-scrolls to its highlight** (works both directions).
- **Tracker matches the live monthly Google Sheet:** columns `Segment | Graphic # | Graphic Type | Description | Status | Assigned To | Notes`; statuses `Not Started -> In Progress -> Created -> Loaded In`; the real graphic types (incl. Book Cover); assignees (Isaac/Jakob/Jeremiah/Gabe/Daniel). B-roll/Picture/Article rows get **source shortcuts (Storyblocks / Dreamstime / Envato)**. Each graphic has an **Approve idea** toggle (approval happens before design).
- **The ProPresenter gate:** when a row hits **Created** and a **filename** is entered, a **Push to ProPresenter** action lights up (a human triggers it, David Rule), targeting that month's **5x show playlist template** at the segment's presentation/slide. "Loaded In" = it is in ProPresenter.
- **Graphics only.** Interview segments show a reminder that the guest chyron is a lower third handled elsewhere.
- Preview file: `docs/_handoff/2026-06-04-graphics-page-preview.html` (static mock; open in a real browser).

## 9b. Lower Thirds page design (locked 2026-06-04)

Deliberately simple, a polished spreadsheet (not the intricate graphics page):
- Segment tabs; one row per lower third (beat), grouped by segment. Often 15 per segment, but "however many."
- Each row shows beat #, `l3_type`, and the **three variations (Primary / Var 1 / Var 2)** as selectable options. Daniel picks one (the highlighted one is chosen); a real build adds a one-tap "cycle variation" button. Each variation shows a **char count colored 55-65 good / under 55 short / over 65 blocked.**
- One **Send button** sends the chosen lower thirds to ProPresenter: format ALL CAPS, validate the char band, dry-run + "type YES", then push to the **Lower Thirds presentation** (separate from graphics, never to Rundown Creator), mapping each row to its slide and on-screen position by beat (guest chyron to the chyron slot).
- Preview file: `docs/_handoff/2026-06-04-lower-thirds-page-preview.html` (static, no JavaScript, renders anywhere including a phone).

## 9c. Rundown build (locked 2026-06-04)

Source of truth = the **approved graphics** from the Graphics Tracker. Lower thirds never go to Rundown Creator. **Each graphic gets its own row/cue** in RC.

**Columns written** (RC column IDs are fixed):
- **Graphics** = COL `1`: the graphic itself.
- **Last Line** = COL `4`: the final script line before the **next** graphic. Read it as "the last line this graphic can stay up before we switch to the next one." (Refines the older spec, which only marked segment transitions; Daniel's rule is per-graphic.)
- **Notes** = **graphic duration in sentences**: the number of sentences from when this graphic is triggered to when the next graphic is due.
- Both Last Line and Duration are **auto-derivable** from each graphic's script anchor (the highlight on the Graphics page) plus the next graphic's anchor. So once graphics are placed in the script, the build computes them.

**Mapping:**
- Segment -> fixed RC row codes (Show Intro B2, Opening Monologue B3, Interview 1 B11 tease then C2, THD C8, Kids Corner D2, Q&A D2, Ministry Report E2, Viewer Voices E4, Featured Resource E6, GSM E8, Interview 2 E10 tease then F2, Closing F8).
- Per-show RundownID via `rc-explore` (they change each cycle). **Daniel has already created the rundowns for the rest of the year, organized in monthly folders**, so map all of them up front from those folders.
- Graphics fill rows in tracker/beat order within each segment.

**Fluid reconciliation (must be automatic, no hand-holding):** the year's rundowns were pre-built with a **default ~10 graphic rows per monologue and per interview**, but real counts vary. After populating from the Graphics Tracker, the build **deletes unused default rows and adds rows when there are more graphics, inserting/deleting in the correct place.** If Daniel later adds or removes a graphic, the build adjusts the rows automatically. **Update in place** (keyed by segment + beat), never duplicate.

**Confirm gate (David Rule, the TD runs from this):** manual confirm before any update. The dashboard shows a **preview that mirrors the Rundown Creator column layout** (row, segment, Graphics, Last Line, Notes) populated from our data, so Daniel can eyeball each column before clicking Update. Script text need not be attached. Embedding RC directly is a maybe (RC may block being iframed); the reliable path is our own column-accurate preview grid plus a deep-link into RC. Dry-run, then Update.

**RC write API (pulled from the public docs 2026-06-04; base `https://www.rundowncreator.com/[channel]/API.php`, auth `APIKey` + `APIToken`, JSON responses, errors arrive as HTTP 200 so always read the body):**
- `getRows` / `getColumns` / `getScript` - read.
- `insertRow` - insert a new row before/after a given row (use to ADD graphics beyond the default rows).
- `setRowProperties` - set a row's column values (Graphics col `1`, Last Line col `4`, Notes = sentence-duration, StorySlug, etc.).
- `duplicateRow` - copy a row.
- `deleteRow` - move a row to trash (use to DELETE unused default rows); `permanentlyDelete` to purge from trash.
- `reorderRows` - reorder. `saveScript` - update script versions.
These cover the fluid insert/update/delete reconciliation Daniel described. Today's `/api/rc-import` only reads and `/api/rc-explore` lists; the build adds the write/push path on top of these actions.

**>> REMINDER (Daniel TODO, deferred): set up Rundown Creator API access (APIKey + APIToken in 1Password) before the live rundown push can run.** The archived `GSR-Archive_mcp-rundown-creator` skill (not in these repos) may have extra wiring but is not required now since the action spec is captured above.

## 9d. Post-shoot: transcription + metadata (locked 2026-06-04)

**Transcription audio source (no Dropbox clutter):** Daniel will NOT have the team drop an audio-only file in Dropbox just for transcription (clutter + an unnecessary step for everyone). Get the audio locally instead: a macOS automation (Automator Folder Action / Hazel / fswatch) watches the editor's finished-master export folder and auto-extracts a small audio file (ffmpeg, ~16kHz mono) into a local working folder (e.g. `~/Productions/Audio`). The team does nothing new; nothing extra lands in Dropbox. A LOCAL watcher on the Mac is fine; NAS/QNAP file-watchers stay barred.

**Speaker differentiation = REQUIRED** (it drives metadata, data, and social content), but via ONE tool, not a separate service per speaker. Choice: **WhisperKit + SpeakerKit** (Mac-native, local, single pipeline = transcript + speaker labels). Output a speaker-tagged transcript + SRT/VTT into Supabase. (Hedge from VERIFIED-FACTS: WhisperKit's 2.2% WER is a vendor number; sanity-check the diarization on a real two-person interview.)

**Metadata = manually triggered, template-based, NOT a Claude prompt-handoff.** Descriptions and tags are **templated and consistent across episodes** (a stored template filled with episode-specific fields), so there is no per-episode AI writing for those. The only variable bits are the **title hook** (Daniel keeps that call) and **chapters** (derivable from segment/rundown timecodes). Daniel clicks a button to generate. Bake in: YouTube category 28, TV airs Tuesday 8 PM CST, YouTube publishes Monday 4 PM ET.

**Distribution = THE priority build (Daniel's single biggest time-saver). Build it now**, start at the manual-trigger stage, and move to Auto as fast as trust allows. Even though it sits "post" in the pipeline, sequence it early in the build for ROI. Backed by the 4-agent research pass in `docs/_handoff/2026-06-05-distribution-research.md` (verdicts + sources). Design:
- **Heavy media runs on the Mac/worker, NOT Vercel** (Vercel caps 4.5 MB / 15 min per function). The dashboard only triggers and tracks; the local uploader does the resumable upload + transcription.
- **YouTube (the anchor)** via the official `googleapis` Node client (`videos.insert`, resumable). NOT `youtubeuploader` (dormant since Aug 2024). **The unlock is Daniel clearing the Google API audit** (his TODO; until cleared, every API-uploaded video is locked **private, irreversibly per video**). Phase 1: upload **private + human flips public** (or scheduled `publishAt`, which itself requires privacy=private). Templated metadata + chapters from rundown timecodes. **Start the audit form now (no SLA).**
- **Rumble:** the YouTube->Rumble auto-sync is **structurally broken** (Google throttled/blocked it in late 2023, per Rumble's own blog) — Daniel's flag was right; do NOT depend on it. The automatable path is the **official Rumble Upload API** (`simple-upload.php`, server-side POST) and it is legitimate (Rumble's own help.rumble.com redirects to its docs), BUT the documented token contact **bd@rumble.com BOUNCED for Daniel (2026-06-06)** and the dev portal is intermittently 503 — a lightly-maintained, partner-gated path. **Phase 1 = MANUAL web upload (the real path).** Pursue the API token via `support@rumble.com` / Rumble live chat / the Partner Program (ads.rumble.com), not the bounced bd@ address; build the API path only once a token is in hand. Also **verify the 58-min resolution tier** — Rumble historically drops long videos to 720p (an on-air credibility risk).
- **Podcast:** Fireside API is **read-only (no publish)** — migrate to **Transistor.fm** (real upload API, no per-hour cap). **301-redirect the Fireside feed** to keep Apple/Spotify subscribers, but **verify Fireside permits the 301 first.**
- **GSN (Roku/OTT):** generate a **Roku Direct Publisher JSON feed** from the episodes table (Next.js route or Edge Function); Roku polls it. Requires each episode MP4 at a stable public HTTPS URL (Roku-spec H.264/HLS). **Verify GSN's Roku channel is Direct Publisher (feed-driven), not a custom SDK channel.**
- **Social clips:** **Vizard** (public API + scheduler, handles 58-min inputs) with a human review-before-publish gate at first. Opus Clip's API is enterprise-gated (manual only). A per-platform **upload tracker** shows status.
- **Orchestration:** Supabase Cron -> Edge Function for scheduled jobs (on-stack, sub-minute). **Secrets:** a 1Password Service Account (`op run`/`op read`) — but **1Password does NOT refresh OAuth tokens**; the code must do the refresh exchange + write back the rotated token, with an **alert on auth failure** or unattended publishing dies silently.
- Chain: master -> local Mac (transcription + YouTube resumable upload) -> templated metadata -> Rumble (API token or manual) + Transistor + Roku feed + Vizard clips; dashboard tracks every platform's status.
- **>> REMINDER (Daniel TODO):** (1) clear the YouTube/Google API audit; (2) pursue the Rumble Upload API token via support@rumble.com / live chat / Partner Program (bd@rumble.com bounced); (3) verify Rumble's 58-min resolution tier; (4) verify Fireside allows a 301; (5) confirm GSN's Roku channel is Direct Publisher.

**Phase 1 distribution scope (Daniel, locked 2026-06-06):** build triggers for **all four** — YouTube (private-first), Rumble (manual upload now), Transistor (podcast, migrate off Fireside), and Vizard (clips, human review gate). Rumble Upload API token contact bd@rumble.com bounced; the API is real but partner-gated, so manual is the Phase-1 Rumble path while the token is pursued through monitored channels.

## 10. Course build rules (Daniel, locked 2026-06-04)

- **Intake questions are multiple-choice (select), not open text.** Daniel is ADHD and time-pressed; give him options to tap, not blanks to fill. Use open text only when an answer genuinely cannot be enumerated.
- **Lay the automation groundwork for every feature, even the ones shipping manual first.** Bake in the maturity dial (Manual -> Prompt-handoff -> Auto) per task, stored in `app_config`, and wire the auto path + schema + UI hooks now so enabling automation is a one-switch flip, not a rebuild. The Distribution module (M11) is the worked example of this.
- Automation is the stated end goal from day one; the dial just controls how fast each feature gets there.

**Queued fixes (align code/docs to this canon, on a build pass, not the live DB now):**
- Add **Dreamstime** to the b-roll source enum (Daniel sources from Storyblocks, Dreamstime, Envato; only Storyblocks + Envato are in the enum today).
- Add **Book Cover** to the `production_graphics.graphic_type` CHECK (used in the sheet, missing from the DB).
- Reorder the `production_graphics.status` CHECK to the canon set `Not Started -> In Progress -> Created -> Loaded In`, and restore "In Progress" in PROMPT_LIBRARY (it was dropped).
- Rename the `graphics` table to `lower_thirds` (it holds lower thirds, not graphics) and keep `production_graphics` as the Graphics Tracker.

## 11. Established Distribution Stack & Vendor Registry (locked 2026-06-06)

This registry is the durable, never-re-ask record of WHERE GSR episodes go and HOW. It was reconciled against the live `distributions.platform` enum, `config/production.json`, and the migrations after a full repo + history sweep on 2026-06-06 (the sweep that caught Signiant and StreamHoster missing from a web-only research brief). **Any platform/vendor answer must be reconciled against this registry + the live enum + `config/production.json` first; web research only supplements, never replaces, what is here.**

**Authoritative live `distributions.platform` enum** = the 9 values in migration `20260528003000_correct_distributions_platforms.sql` (the LAST migration that alters `distributions_platform_check`; it supersedes the 20-value `..002000`):

| Target | enum id | What it carries | Delivery mechanism | Special requirement |
|---|---|---|---|---|
| YouTube | `youtube` | Full episode; the anchor + canonical URL | YouTube Data API v3 (googleapis, resumable, on Mac/worker) | Category 28; Mon 4 ET scheduled; private until Google audit cleared (irreversible per-video) |
| Rumble | `rumble` | Secondary full episode | **Manual web upload (Phase 1)** | YouTube->Rumble sync is BROKEN; official Upload API is partner-gated (bd@rumble.com bounced); verify 58-min HD (720p risk) |
| Dropbox | `dropbox` | Broadcast master to unnamed partner stations; **also the source for OTA broadcast**; also the input trigger | Dropbox API (REST + OAuth) | No metadata required; do not name specific stations; 150MB single-request cap -> chunk |
| Fireside (podcast) | `fireside_podcast` | Audio-only MP3 podcast | Web-UI upload (API is read-only) | **Feeds Spotify + Apple Podcasts automatically via RSS.** Migrate to Transistor.fm (real publish API); 301 the feed (verify Fireside allows it) |
| Real Life Network | `real_life_network` | Broadcast master to RLN | **Signiant Media Shuttle** (`api_client_media_shuttle_node` SDK) | **RLN = RightNow Media (one and the same target).** Metadata via Google Form; thumbnail 1200x1800 portrait; **-20 LKFS audio normalization** (this requirement currently lives ONLY in superseded migration `..002000:32-33` -- recapture it when RLN delivery is built) |
| StreamHoster | `streamhoster` | Web-stream / OTT master; one upload that fans out | **FTPS** | **One StreamHoster upload feeds Roku, Apple TV, the iOS app, and LG TV** -- it replaces YouTube TV/app embeds because YouTube v3/tvOS caps embeds at 480p |
| Genesis Science Network | `genesis_science_network` | genesissciencenetwork.com 24/7 web stream / on-demand | Manual handoff card; proposed Roku Direct Publisher JSON feed | No public API; verify the GSN Roku channel is Direct Publisher (feed-driven) not a custom SDK channel |
| Social clip | `social_clip` | Episode-level short-form status flag | Tracked here; real per-clip tracking in `content_clips` / `social_posts` | Placeholder only |
| Other | `other` | Catch-all | -- | -- |

**Fed automatically by a listed platform (NOT separate upload targets):** Spotify and Apple Podcasts (via Fireside RSS); Roku, Apple TV, iOS app, LG TV (via the one StreamHoster FTPS upload); RightNow Media (= Real Life Network via Signiant).

**Short-form / social** lives in the `social_posts` enum (migration `..003200`), separate from `distributions`: `youtube_shorts, instagram, tiktok, facebook, x_twitter`. Clip tooling: **Vizard** (recommended, public API + scheduler) vs **Opus Clip** (API enterprise-gated, manual). Multi-post by URL: Upload-Post / Blotato (cover YT/TikTok/IG/FB/X, NOT Rumble).

**Status of the pruned targets (Daniel, gospel 2026-06-06, CTN/WWN corrected same day):** 
- **GodTube: RETIRED, not used anymore.** Drop it.
- **OTA broadcast is fed FROM Dropbox** -- Dropbox is the source for OTA; OTA is not a separate upload target, it is downstream of the Dropbox network-partner drop.
- **TBN "Creation in the 21st Century" (c21c) is a finished show ARCHIVE** -- no longer filmed, every episode is already uploaded to Dropbox, no other action needed. Not an active GSR distribution target.
- **CTN (Creation TV Network) and WWN (Wonders Without Number): INCLUDE in the build.** They are filmed/uploaded much less often than the weekly shows and segments, but they are still real distribution targets that must be implemented (do NOT treat as out-of-scope; that earlier call was wrong). Add `creation_tv_network` (CTN) and `wwn` (Wonders Without Number) to the live `distributions.platform` enum as a prereq, and build their delivery/handoff path at a lower cadence.

**Purge audit + verification (2026-06-06):** A full git-history audit confirmed the V3 prune was safe -- no table was ever dropped, the blueprint repo lost nothing, and substantive facts survived into this canon + `config/production.json`. Real outstanding items surfaced: (1) the CTN/WWN enum gap above (prereq migration named, not yet written); (2) RLN's -20 LKFS spec survives only in canon/config with nothing enforcing it (make it a real validation when RLN delivery is built); (3) ADR-0002 (phased manual->auto distribution) was deleted with the Notion wiki -- substance survives via per-platform `upload_auto` flags + this canon, but no ADR of record (optional: author a fresh one). Parked-but-still-wanted (Daniel confirmed keep, 2026-06-06): YouTube RSS poller, guest-email workflow UI, content-clips + social-posts UIs, the larger CTN/WWN separate-show schema, and RLN -20 LKFS enforcement. Import-gate verification: the main `/import` flow is safe (dry-run-first, shows counts, two-step commit); the only weak gate is `lower-thirds/[episode_id]/episode-workspace.tsx` (extract-preview then one-click live `/api/import`, no literal YES) and it is currently UNREACHABLE (no `page.tsx`) -- when that per-episode workspace is built, its confirm must call `/api/import` dry-run first + require explicit confirm, and the route should require a confirm token rather than defaulting to a live write.

**Stale claims to purge wherever they appear (all WRONG):** "Rumble mirrored via YouTube channel sync" (in `config/production.json`, `.env.example`, older SYSTEM-EVOLUTION/ADR text) -- the sync is broken; Rumble is manual. Fireside browser-automation via Playwright (Fireside is read-only -> handoff card / migrate). Odysee / the old Facebook/Instagram/Website "v1 platform" set (`production.json` admits it "was not the current plan").

**Established facts to preserve (surfaced 2026-06-06; full detail cited in SYSTEM-EVOLUTION / config / style guide):** sponsor rule (S3 Ep1-24 carry a 60-sec sponsor, "Cedarville University"; Ep25 onward sponsor-free); the four locked verbatim lines + donation number **931-212-7990**; episode label format `S03EPxxx` and Dropbox file naming `{episode_label}_{descriptor}_{version}.{ext}`; the 14-task episode checklist with assignees (Daniel, Isaac, Jeremiah, Miryam); `creationsuperstore.com` as the spoken resource tie; the as-built `production_graphics.status` CHECK order is wrong in the DB (`Not Started, Created, In Progress, Loaded In`) vs the canon order `Not Started -> In Progress -> Created -> Loaded In`; producer email conflict (`dallen@davidrives.com` vs `daniel@davidrivesministries.org`); off-limits addresses GSN-PropRes 100.98.215.7, QNAP3 10.2.2.3, QNAP5 10.2.2.5; the 2026-05-20 security incident; b-roll source enum is missing Dreamstime.

**Crew (never re-ask):** Daniel Allen (owner/producer, non-dev); David Rives (on-air talent, ministry director); Isaac (edit/export, owns the Graphics Tracker, monologue + both interviews); Jakob (roll-in segments THD/KC/Q&A/Featured Resource/GSM) -- NOT the same person as Jacob (footage/THD); Jeremiah (b-roll, raw footage to Dropbox); Gabe (GSM roll-ins); Miryam (metadata, thumbnails, uploads, mark-aired; Daniel's successor); interns (use the tracker, unrostered).

## 12. Build decisions (Daniel, gospel 2026-06-06)

- **Dropbox folder structure: FLAT, one folder per show** (resolves the long-standing flat-vs-per-episode conflict; the per-episode tree in `production.json` is NOT how it works today). **A separate folder for web-stream episodes still needs to be created.** The transcription + distribution watchers target the flat per-show folder.
- **Mac <-> dashboard job transport: the Mac/worker POLLS a Supabase `jobs` table.** The dashboard (Vercel) writes a job row to trigger heavy work; the Mac polls every few seconds, runs pending jobs, and writes status back. No inbound connection to the Mac (Tailscale stays off-limits), no extra queue service. This is the control plane for all heavy media (uploads, transcription).
- **Course direction (locked):** FULL redesign of the crash-course, built around an always-visible pipeline diagram that traces ONE mock episode end-to-end, activity/predict-first per module, every game mapped 1:1 to a real pipeline decision. The course's EXPORT must be an agent-runnable build spec per module (status exists/new, depends-on, blocked-by, DB/route/API contracts, EARS acceptance criteria, verify commands, inlined locked UI design) plus a "Decisions & Setup" track that collects the remaining human-only inputs (credentials, Google audit, ProPresenter mapping, VideoEdit address, real YouTube playlist IDs) so a Claude agent team can build without stopping to ask.
- **Course must surface TOOL SUGGESTIONS per stage (Daniel, 2026-06-06):** at each pipeline stage the course offers the best tool options per category (from the repo's tool list in `docs/OPEN_SOURCE_STACK.md`, RECONCILED to current truth below), which Daniel can opt INTO the exported build plan.
- **Course must be genuinely ADAPTIVE (Daniel, 2026-06-06):** later modules must PROCESS earlier decisions and open/close lessons and sections accordingly (real gating, not cosmetic carryover). A decision/answer state object drives conditional rendering; choosing X in an early module unlocks/closes specific later content.

**Reconciled tool registry (current truth; supersedes the Era-1 picks in `OPEN_SOURCE_STACK.md`):**
- File-watch / intake trigger: **LOCAL Mac watcher (fswatch / Hazel / Automator)** on the editor's master-export folder. NOT Chokidar-on-NAS (NAS file-watchers are barred). Honorable: Chokidar (local only), native `fs.watch`.
- YouTube upload: **official `googleapis` Node client** (resumable). NOT `youtubeuploader` (dormant since Aug 2024). Runs on the Mac/worker, not Vercel.
- Rumble: **manual web upload (Phase 1)**; pursue the official Upload API token. NOT Selenium/Playwright browser automation; the YouTube sync is dead.
- Dropbox: **official `dropbox-sdk-js`** (REST + OAuth, chunked >150MB). Current and correct.
- Fireside -> podcast: **migrate to Transistor.fm publish API** (+301). NOT Playwright browser automation (Fireside API is read-only).
- Signiant -> RLN: **`api_client_media_shuttle_node`** official SDK (-20 LKFS). Correct.
- StreamHoster: **`basic-ftp`** (FTPS, active Apr 2026). Honorable: `ssh2-sftp-client` (if SFTP).
- Transcription: **WhisperKit + SpeakerKit** (Mac-native, single tool, speaker labels), local on the Mac. Honorable: faster-whisper, whisper.cpp, WhisperX (diarization).
- AI (lower-thirds extraction / regenerate only; metadata is TEMPLATED not AI): **`@anthropic-ai/sdk`** server-side (already in app). Honorable: Vercel AI SDK.
- Dashboard UI: **already built** -- Next.js 16 + shadcn/ui + Tailwind v4 on Vercel.
- Approval workflow: **in-app dry-run + Type-YES gate + `app_config` maturity dial**. NOT n8n (superseded by ADR-0012).
- Orchestration / job queue: **Supabase Cron -> Edge Function** for scheduled jobs + **the Mac polls a Supabase `jobs` table** for heavy work. NOT BullMQ/Redis. Honorable (only if a real worker queue is later needed): BullMQ, hosted Inngest/QStash.
- Notifications (auth-failure alerts for unattended jobs): **ntfy** (or email). Honorable: Apprise, Gotify.
- Status database: **Supabase Postgres** (the project DB). NOT better-sqlite3 (Era-1).

**Role / dashboard scopes (Daniel, 2026-06-07):** the dashboard is per-role. Each person logs in and sees only their view.
- **Daniel** = owner/producer. Sees everything: full pipeline, the crew task board, distribution, approvals, system health. Owns scripts, guests, recording, approvals, final title call.
- **Myriam** = metadata & post-production lead, and Daniel's successor. Owns metadata, thumbnails, YouTube + Rumble uploads, and marking episodes aired. Does NOT see graphics build, editing, or system internals.
- **Isaac** = graphics & edit lead. Owns the Graphics Tracker, ProPresenter load, editing, the review pass, and final export to Dropbox.
- **Interns** = same as Isaac MINUS post-production editing: Graphics Tracker + b-roll sourcing + ProPresenter / Rundown Creator only.
- **Jakob (roll-ins), Jeremiah (b-roll / raw footage), Gabe (Genesis Science Minute)** do NOT get distinct dashboards. A generic landing page with role-specific info may be added later if needed (Daniel, 2026-06-07).
- **DEFERRED task: per-role login credentials.** Build real auth so each user logs in and lands on only their view. This is sequenced for AFTER the system is designed, tested across multiple mock episodes, and the current real system is fully imported. Tracked in `docs/AUTOMATION_ROADMAP.md`.

**Operating cadence + dashboard brand (Daniel, gospel 2026-06-07):**
- **The operation runs on a MONTHLY cycle, not a weekly one.** Production happens in monthly batches: **5 episodes are in pre-production at once** ("the 5 shows of the month"), moving through the pipeline in parallel. The repo's "weekly" framing describes only the staggered AIR dates (Tue 8pm CST air, Mon 4pm ET YouTube); the OPERATIONS cadence Daniel plans and tracks against is the monthly batch of 5. The dashboard's organizing spine is this monthly cycle of 5 parallel episodes.
- **The dashboard's north star:** open it on any given day and instantly know WHERE WE ARE in the cycle (which of the 5 episodes are at which stage, what is due, what needs Daniel today). Intuitive, efficient, sleek, not overwhelming, tuned to Daniel's specific needs.
- **GSR dashboard brand colors are VIOLET and BLACK** (this supersedes any earlier navy/gold direction, which was derived from the old `globals.css` and web research, not from Daniel). It must NOT look feminine: indigo-edge violet (hue ~285-290), violet rationed to interactive signals on a near-black violet-tinted surface, Linear-grade restraint. Avoid lavender/pastel/pink/neon-glow.
- **Design package:** the full fresh research-and-design effort (5 teams, 30 agents) lives in `docs/ui-design-v2/`; it supersedes the earlier `docs/ui-design/` navy/gold package.
