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
| DB table | `production_lower_thirds` (renamed from `graphics` 2026-06-09; variations child table `lower_thirds_variations`) | `production_graphics` |

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
6. **ProPresenter gate:** a graphic is pulled from its folder and pushed to ProPresenter **only once its Graphics Tracker status flips to "Created" and the filename is entered.** The system surfaces a "ready to load" signal; a human does the push (ProPresenter write commands stay off-limits to automation per the David Rule until David approves a tested path).

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
- **Team / roles:** Daniel Allen (owner/producer, non-dev); David Rives (on-air talent, ministry director); Isaac (edit/export, owns the Graphics Tracker, monologue + both interviews); Jakob (roll-in segments THD/KC/Q&A/Featured Resource/GSM) -- NOT the same person as Jacob (footage/THD); Jeremiah (b-roll, raw footage to Dropbox); Gabe (GSM roll-ins); Miryam (metadata, thumbnails, uploads, mark-aired; Daniel's successor); interns (use the tracker, unrostered).

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
- Chain: master -> local Mac (transcription + YouTube resumable upload) -> templated metadata -> Rumble (manual; vendor confirmed no working API as of 2026-06-12) + Transistor + Roku feed + Vizard clips; dashboard tracks every platform's status.
- **>> REMINDER (Daniel TODO):** (1) clear the YouTube/Google API audit; (2) ANSWERED 2026-06-12: no working API at the moment per Rumble; ambition ladder adopted (prep card -> assisted filler -> hold full auto; monthly API-watch), see registry row; (3) verify Rumble's 58-min resolution tier; (4) verify Fireside allows a 301; (5) confirm GSN's Roku channel is Direct Publisher.

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
| Rumble | `rumble` | Secondary full episode | **Manual web upload (Phase 1)** | YouTube->Rumble sync is BROKEN; Rumble support says NO working API at the moment (2026-06-12) and their own Upload API doc page (player.rumble.com/developers/Rumble-Upload-API.html) currently 503s, so the product exists but is down/paused. Ambition ladder (2026-06-12): rung 1 dashboard Rumble prep card (all metadata + file ready to paste, ships first); rung 2 Mac-side assisted form-filler, human reviews + presses publish; rung 3 unattended upload HOLD (ToS/account risk needs Daniel's explicit yes); rung 0 automated monthly re-check of the API doc URL + Sep re-ask. Verify 58-min HD (720p risk) |
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

**Established facts to preserve (surfaced 2026-06-06; full detail cited in SYSTEM-EVOLUTION / config / style guide):** sponsor rule (S3 Ep1-24 carry a 60-sec sponsor, "Cedarville University"; Ep25 onward sponsor-free); the four locked verbatim lines + donation number **931-212-7990**; episode label format `S03EPxxx` and Dropbox file naming `{episode_label}_{descriptor}_{version}.{ext}`; the 14-task episode checklist with assignees (Daniel, Isaac, Jeremiah, Miryam); `creationsuperstore.com` as the spoken resource tie; the as-built `production_graphics.status` CHECK order is wrong in the DB (`Not Started, Created, In Progress, Loaded In`) vs the canon order `Not Started -> In Progress -> Created -> Loaded In`; producer email conflict (`dallen@davidrives.com` vs `daniel@davidrivesministries.org`); automation off-limits: GSN-PropRes 100.98.215.7 (write/control commands only); QNAP admin dashboard is off-limits via any method (the 2026-05-20 incident was caused by admin dashboard access, not Tailscale -- confirmed by David and Daniel, 2026-06-11); Tailscale read-only SMB to QNAP3 10.2.2.3 and QNAP5 10.2.2.5 is permitted; b-roll source enum is missing Dreamstime.

**Crew (never re-ask):** Daniel Allen (owner/producer, non-dev); David Rives (on-air talent, ministry director); Isaac (edit/export, owns the Graphics Tracker, monologue + both interviews); Jakob (roll-in segments THD/KC/Q&A/Featured Resource/GSM) -- NOT the same person as Jacob (footage/THD); Jeremiah (b-roll, raw footage to Dropbox); Gabe (GSM roll-ins); Miryam (metadata, thumbnails, uploads, mark-aired; Daniel's successor); interns (use the tracker, unrostered).

## 12. Build decisions (Daniel, gospel 2026-06-06)

- **Dropbox folder structure: FLAT, one folder per show** (resolves the long-standing flat-vs-per-episode conflict; the per-episode tree in `production.json` is NOT how it works today). **A separate folder for web-stream episodes still needs to be created.** The transcription + distribution watchers target the flat per-show folder.
- **Mac <-> dashboard job transport: the Mac/worker POLLS a Supabase `jobs` table.** The dashboard (Vercel) writes a job row to trigger heavy work; the Mac polls every few seconds, runs pending jobs, and writes status back. No inbound connection to the Mac needed (the Mac polls outbound). Tailscale is only restricted when writing to a server; read-only access via Tailscale is fine (Daniel, 2026-06-11). No extra queue service. This is the control plane for all heavy media (uploads, transcription).
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

**Basecamp = keep it, integrate it, two-way sync (Daniel, 2026-06-08).** Basecamp stays a first-class live source the team already uses; we do NOT ditch it. The dashboard integrates the existing Basecamp system. **Sync rule (Daniel, 2026-06-08):** every element we import SYNCS (stays current from Basecamp); TWO-WAY editing (writes back to Basecamp) is enabled ONLY for items meant to be checked off / marked complete: post-production episode status, to-dos, and card checklist items. Everything else is read-only (scripts and calendar are therefore read-only unless Daniel says otherwise; he earlier mentioned two-way for those, flagged for confirmation). **Out of scope (not imported):** message boards, chats/Campfire, the generic card table, activity feeds, and the Prayer Request + Aquarium projects. **Decisions locked (Daniel, 2026-06-08):** (a) ALL WWN elements are DEFERRED to future phases, out of the current build; (b) to-dos sync per person, each sees only their own, for **Daniel, Isaac, Myriam** only (interns get none for now); (c) calendar imports only events tagged **`PROD |`**; (d) **Isaac gets a GSR editing page built to mirror his Basecamp "Genesis Science Report" card board as closely as possible** (same columns `Triage -> Not now -> Recorded -> In Progress -> Editing -> Rendering -> Done`, same card feel) so it is instantly familiar with no learning curve, moving a card advances post-production status two-way. Full design + per-role inventory: `docs/2026-06-08-basecamp-dashboard-integration.md` (the review sheet `docs/2026-06-08-basecamp-import-review-sheet.md` captured the choices). **Embed the DATA, not Basecamp's pages:** Basecamp blocks iframing its own screens, so pull cards/to-dos/scripts/schedule through the API and render them in the dashboard's own UI with API write-back, so users never leave the dashboard and no "go to Basecamp" link is needed on the main flow (keep one escape-hatch link only for attachments/comments). **Conflicting episode databases are resolved by one owner per fact:** recommended = the Basecamp card is the system of record for production stage + tasks (the episode row stores the card id, not a competing status column), while Supabase owns dashboard-only data (lower thirds, metadata, distribution); two-way at the system level, single-owner at the field level. Production-stage owner is DECIDED (Daniel, 2026-06-08): **Basecamp owns stage** — stages stay linked and two-way, one stored value (the card column), Basecamp wins any tie. Full per-role data inventory + approach: `docs/2026-06-08-basecamp-dashboard-integration.md`. The live pipeline is the **"Genesis Science Report"** card table in **"02_ Production"** (account **5805529**; columns `Triage -> Not now -> Recorded -> In Progress -> Editing -> Rendering -> Done`) plus the **"WWN"** card table; calendar + admin to-dos live in **"01_DRM Staff"**. Write-back is a live-team action: confirm-before-write + the David rule. This SUPERSEDES the earlier "Basecamp = read-only, later monologue-ingestion only" framing (e.g. handoff §11, tools-curriculum timeline); monologue ingestion is now one slice. Credentials verified working 2026-06-08 (`docs/2026-06-08-basecamp-env-diagnosis.md`).

**"Webstream" = the weekly online-release umbrella (Daniel, 2026-06-08):** Webstream is the weekly online-release milestone, the Monday 4PM ET drop, that fans out to ALL platforms: YouTube, Rumble, StreamHoster, GSN, and the podcast. YouTube is just ONE target under it, not the milestone itself. Term-collision note: this is a DIFFERENT idea from the canon's existing "web stream / web-stream" (the StreamHoster/GSN OTT target and the "web-stream episodes" folder). Keep them distinct: write the new umbrella as "webstream publish" or "webstream release" (no hyphen), and keep the OTT target as "web-stream / OTT (StreamHoster/GSN)". Consequence: the generic publish-date column `episodes.youtube_scheduled_publish_at` is being renamed to `webstream_scheduled_publish_at` via expand-contract. The new column was ADDED and BACKFILLED on 2026-06-08 (migration `20260608161708_add_webstream_scheduled_publish_at`); the old `youtube_scheduled_publish_at` column stays until a later contract migration drops it, AFTER this branch is deployed to main, so production never references a missing column. KEPT as genuine YouTube-platform fields (not renamed): `youtube_url`, `youtube_published_at`, the YouTube `publishAt` scheduled-upload, category 28, the ~100/day quota, the playlists, the YouTube RSS poller, and the m10 "YouTube anchor" (YouTube is the canonical URL the other platforms point at).

**Guest affiliations are topic-relevant per episode (Daniel, 2026-06-08):** A guest may have more than one valid affiliation. The on-screen chyron uses the affiliation relevant to that episode's specific interview topic, not a fixed default. Example: Dan Janzen is both Executive Director of Fellowship of Christian Farmers International and a UFO/biblical-theology researcher; on the S3 Ep15 UFO episode his chyron shows the UFO-researcher affiliation, not the farming one. Storage note (2026-06-08): the schema has no per-episode chyron-affiliation field (`guests` holds a single affiliation via `job_title`/`organization`; `episode_guests` has no affiliation/role column). DEFERRED enhancement: add an affiliation/chyron override on `episode_guests` so each appearance can carry its own topic-relevant affiliation cleanly. Interim handling for Ep15: both Janzen affiliations are preserved on his `guests` row, his primary `job_title` was set UFO-researcher-first (Ep15 is his only Season 3 appearance and is UFO-themed), the multi-affiliation rule is recorded in his `guests.notes`, and the intended Ep15 chyron is noted in that link's `episode_guests.appearance_notes`.

**Context economy (Daniel, 2026-06-12):** keep sessions lean proactively, not just at capacity: compact/trim context at clean milestones, batch file reads, keep tool output tight, and drop context that is no longer needed when the risk of losing it is insignificant. Cost/benefit governs every retained token. Never trim at the expense of correctness or the context needed to perform the task.

**Obstacles get an ambition pass, never a shrug (Daniel, gospel 2026-06-12):** when a vendor, tool, or platform blocks the plan (no API, gated feature, broken sync), NEVER close the item with "stays manual" or "nothing to do." Required before any such verdict: a bounded workaround pass (official alternates, assisted/semi-automated routes, community-proven techniques, watch-for-change automation), each route scored effort-vs-benefit, with a recommendation. Bring Daniel the problem only together with candidate solutions and an eager-to-solve posture (the Rundown Creator integration is the model: awkward vendor surface, still automated). Twin rule: every involved action weighs token/usage cost against benefit; be efficient everywhere except where quality actually counts.

**Approvals: standing go-ahead for finished work (Daniel, gospel 2026-06-12):** Daniel delegates the sign-off button. Claude folds its own finished, gate-checked, tested work into the official version (merging its reviewed batches) without asking each time, then reports in client terms what changed. STILL requires Daniel's in-the-moment yes, unchanged by this grant: anything touching the live show or broadcast chain, the team's real production data (including applying schema/database changes to the live database), money, accounts or credentials, deletions, or anything not easily reversible. The Type-YES bulk-import gate, the live-rig in-the-moment yes, and QNAP read-only stand exactly as before.

**Show decisions arrive as tap cards, not meetings (Daniel, 2026-06-12):** the two proposed working sessions (graphics decisions; segment timing) are replaced by batched one-tap question cards sent when a build slice actually needs the answer. Daniel was confused by the meeting framing; do not schedule meetings for decision-gathering.

**Interaction: report developer-to-client, and test with mock content first (Daniel, gospel 2026-06-12):** Daniel is the client, not a fellow developer. Every report to him must read like a developer updating a client: "this feature works now, here is the part of your workflow you can do with it", "I hit an issue, here is what it means for you, it is fixed / will be fixed by [date]", "here is the one thing I need from you, in plain words". NO developer jargon (no "squash", "rebase", "PR diff", "conflict markers", "migration" etc. without a plain-English translation; prefer dropping the term entirely). Git/infrastructure mechanics are the developer's problem and stay out of client reports unless Daniel asks. Claude is RESPONSIBLE for issues: own them, fix them, state the impact and the timeline; never hand Daniel a problem without a plan. And BEFORE reporting any feature as working: test it with mock content (run a fake script / fake episode through it) wherever access allows; where a test physically requires Daniel's logins or machine, say so and hand him a 30-second check instead of an untested claim.

**Interaction: present confirmations as one-tap choices (Daniel, 2026-06-08):** When Claude has items for Daniel to confirm or address, present them as one-tap choices (tappable options with the recommended option pre-marked), never open-ended homework. Daniel is often on mobile; the goal is to save his time. Recommend, do not poll.

## 13. Findings-review decisions (Daniel, gospel 2026-06-08)

From the export-archaeology triage (full record in `docs/_handoff/2026-06-08-review-decisions.md`; backlog in `export-archaeology-backlog.json`). These supersede any earlier conflicting note.

**Settled facts (now canon):**
- **Lower-thirds length band is 55 to 70 characters, 60-65 sweet spot.** This RAISES the old 65 hard ceiling to 70. The char-count checker should read: under 55 short (amber), 60-65 ideal (green), over 70 blocked (red). **Topic L3 stays 60-65.** Replaces the prior "55-65, 65 ceiling" wherever it appears, including m2 of the course and the live `graphic-card.tsx` validator.
- **"Intro Graphic" is the standard term system-wide; "Title Graphic" is eliminated.** Same meaning. Move the Graphics Tracker, the `production_graphics.graphic_type` list, PROMPT_LIBRARY, and the course to "Intro Graphic." This overrides the earlier canon note that said use "Title Graphic."
- **The guest chyron is 3 topic-relevant variations**, each highlighting whatever credential/affiliation adds the most relevance and credibility for that episode's specific interview topic. Build the 3 from past examples. Not a single fixed `NAME | ORG | FIELD` order. Extends the 2026-06-08 topic-relevant-affiliation rule.
- **"THD" = The Heavens Declare** (the on-air pre-produced roll-in segment). Do not read it as "That's a Fact."
- **GSN content figure = 270 hours long-form + hundreds of short-form interstitial fillers.** Purge every "nearly 1,000 hours" / "1,000 hours" remnant in docs and pitch materials.
- **"GSR has no graphics" is a legacy monologue-copy rule only** (monologue spoken copy must stand on the ear, not depend on a graphic). It is NOT a claim the show lacks graphics; the full lower-thirds + graphics systems exist.
- **Lower thirds get their own table, separate from the graphics tracker** (`production_graphics`). The two systems must not be conflated in the schema. Plan a clean migration (the current `graphics` table actually holds lower thirds; design the separation before touching data).
- **Monologue = 15 approved lower thirds total.**
- **Ming Wang interview, June 15: 9:30 AM arrival, 10:00 AM film time.**
- Confirmed as-live: **YouTube category 28** (one category only per video), **Season 3 = 48 episodes**, **Next.js 16.2.6** (fix the ADR-0012 text that still says 15), the lower-thirds data table is named `graphics` today.
- **Author the missing ADRs 0004 through 0008** (master-metadata, Dropbox-no-metadata, AI-metadata-needs-approval, and the rest); their content is real even though the files were never written.

**Build-scope refinements (Daniel):**
- **Voice DNA** work is scoped to **GSR interview segments only**, specifically improving the interview setup; pulls from the same voice sources.
- **Title + timecode pipeline outputs to the Supabase DB, not a Google Drive sheet.**
- **Diarization must label the 2 correspondent segments** (Viewer Voices, Featured Resource) in addition to David and guests.
- **Guest profiles become the source of tone adaptation** for outreach.
- **The dashboard must include** (not necessarily on the homepage): email via the **Mac Mail app** (not Gmail), a **production-urgency tracker**, and a **rolling Apple Notes to-do**.
- A monologue 5-beat L3 arc is acceptable **only if it leaves room for flexibility and exceptions.**

**Needs a working session before building (Daniel asked to schedule):**
- A dedicated **graphics-decisions session**: the AI graphic-suggestion rules (combine the 1,737-graphic archive with the graphics-tracking archive for past monologue + interview graphics), the AI graphics request template, the MOGRT set, and the multi-agent philosophy scan.
- A **segment-timing breakdown** session for the 58:00 runtime calculator (interview 780s + 30s outro, balance to 58:00).
- Confirm the **run-of-show interview-tease row map** (C-14, undecided).

**Correction, Rumble Upload API outreach (verified in Gmail 2026-06-08):** Earlier notes (canon section 9d, the distribution research) said "bd@rumble.com BOUNCED," implying the Rumble addresses are dead. That is WRONG. On 2026-05-15 Daniel emailed BOTH `bd@rumble.com` and `support@rumble.com` from `dallen@davidrives.com`, and both bounced with the same Google diagnostic: "The account dallen@davidrives.com is disabled" (SMTP 5.2.1). The failure was sender-side; the messages never reached Rumble, so Rumble never received the request and the `support@rumble.com` / `bd@rumble.com` addresses are NOT proven invalid. Action (2026-06-08): a fresh Upload API request was drafted in Daniel's Gmail to `support@rumble.com`, to be sent from a working account (not the disabled `dallen@davidrives.com`). Backup channel: Rumble Partner Program (ads.rumble.com) web form or live chat. The request also asks Rumble to confirm 58-minute long-form uploads stay 1080p (the historical 720p-downgrade risk).

**Guest corrections, do-not-book & routing (started 2026-06-08):** A protective reference now lives at `docs/_handoff/GUEST-CORRECTIONS.md`: who not to contact (deceased: Bechly; vetoed: Fuz Rana per David, Tim Mulgrew), title/affiliation corrections for chyrons (Labedz = cryoseismologist, Rana = President/CEO RTB, Hugh Ross left Liberty, etc.), org routing gatekeepers (ICR -> Mary Clair Kelly, RTB -> Melanie Martell, Discovery -> Winkler/Crowther, RLN "Alexa" = Alexa Gerbrands, UK -> Nadina, Tom Rogers -> Derek), and the booking frameworks (40/40/15/5 mix, Five-Point Stakes, four hook types, Barentine Test, accessibility tiers), now captured IN FULL in `GUEST-CORRECTIONS.md` section 5 (recovered from the interview-research project on 2026-06-08). Entries flagged "(confirm)" came from chat history and must be verified by Daniel before they drive any automated action. Check this file before any guest outreach or chyron build.

## 14. Flight-worksheet decisions (Daniel, gospel 2026-06-09)

From the offline flight worksheet (answers pasted 2026-06-09). Full open-discussion list in `docs/_handoff/2026-06-09-discussion-queue.md`.

**Graphics:**
- Monologue: 8-15 graphics, one every 2-5 sentences. #1 is an Intro Graphic, with occasional exceptions when David includes a graphic cue during or right after the "but first" line.
- Interviews: 5-9 is the average. **Hard constraint: in-studio interviews use ONLY the article screenshot + the intro graphic; you CANNOT trigger graphics mid-interview in the in-studio format.** More graphics are only possible on remote/Zoom interviews.
- First-two interview order: Intro Graphic + Article Screenshot; which is cued first depends on when David mentions the study/article. If within the first ~30 seconds, the Article Screenshot goes first.
- AI graphic suggestions (interviews): graphic #1 = a visual suggestion to accompany the interview title, generated together with the lower thirds; #2 = the article screenshot the interview is anchored in; if no article is mentioned in the script, the system confirms with Daniel whether to skip it. Suggestions must be based on a comprehensive analysis of patterns in past Graphics Trackers. Provide a "copy prompt" secondary option when the suggestions miss. **All dashboard prompts must be thorough, comprehensively informed by these conversations, and easy to edit + refresh in the dashboard.**
- Graphics Tracker / request-template columns: ADD a graphic display-DURATION column (so Rundown Creator pulls it directly); STANDARDIZE the Rundown Creator column names to match the Graphics Tracker (reduce confusion); ADD a LAST LINE column to the tracker, auto-populated once all graphics for the monologue / interview-setup scripts are approved.
- Multi-agent graphics-philosophy scan: combine the 1,737-graphic archive WITH the graphics-tracking archive (overlap is fine), paying specific attention to monologue and interview graphics.
- Graphic Type: standardize "Intro Graphic" (no "Title Graphic").

**Lower thirds (expanded definition):**
- Lower thirds = ALL non-graphic on-screen text, including CTAs and any textual info not assigned a graphic in the tracker, not only discussion/script-based L3s.
- Featured Resource uses a set rotation of select recycled lower thirds, reused show to show.
- Lower thirds are currently text slides in ProPresenter, hand-pasted each show; limited layers mean no animate-on/off unless they are video files on a timer. Daniel is open to AE/MOGRT templates if it streamlines or opens options.
- **Location tags are NOT lower thirds:** they live in the super-source box, in a separate file on the ATEM / mix-effect computer (controlled by the TD, not the ProPres graphics operator). Daniel is open to streamlining this.

**Segment timing (58:00 calculator):** the per-segment target times need adjustment; the current values do NOT account for segues/transitions, and the calculator must include a segue/transition budget. Baseline he gave totals 3000s; about 480s remains for segues/transitions/breaks toward the 3480s (58:00) target.

**ProPresenter:**
- QA / thumbnail verification: build a review screen so that when anything is pushed to ProPresenter, the system pulls and displays the slide screenshots next to the linked graphic / lower-third info for verification (if it is not too heavy a task).
- The ProPresenter / Tailscale MCP is **preproduction only, never live production**. The one exception is live lower-thirds generation, if that path is ever built. Future idea: a live photo/b-roll sourcing program using live transcription to pull topic-relevant visuals from permitted sources during interviews.

**Distribution / data:**
- YouTube category 28 (confirmed again).
- 507-contact import: first use the email correspondence to classify which contacts were reached out to AS GSR GUESTS vs for other reasons, before importing.

**Confirms:**
- Run-of-show map (canon 9c) confirmed.
- Kilauea: Daniel believes "Episode 48" is a count of past volcanic events in the article (not an episode number), to be reframed as a record-breaking figure; he asked to be fact-checked, so VERIFY against the article before using it on air. **RESOLVED (verified vs USGS, 2026-06-11): Daniel was right.** "Episode 48" = USGS's numbered lava-fountaining episodes in the current Halemaumau eruption; episode 48 (June 1, 2026) set "a new record number of fountaining episodes in any one Kilauea eruption" (old mark: 47, Puu Oo 1983-86). On-air-safe wording (re-check the live count on record day, episode 49 was forecast mid-June; scope stays "any Kilauea eruption", never "biggest eruption ever"): "Kilauea has just set an all-time record. Since this eruption began in December 2024, its summit has now produced more lava-fountaining episodes than any Kilauea eruption on record, 48 and counting as of June 1, passing the old mark of 47 set back in the 1980s." Lower third: "KILAUEA SETS ALL-TIME RECORD: MOST FOUNTAINING EPISODES OF ANY KILAUEA ERUPTION ON RECORD". Full citations: ledger CL-048. The Austin/Kilauea episode has no DB row yet (Austin is in guests, unlinked); wording moves to the row when Lane 3 creates it.

**Worksheet decision snapshot:** BUILD = monologue 5-beat arc, graphics-philosophy scan, ProPresenter QA-verification screen, ProPres MCP (preprod-only), 507-contact import (after email classification), Operator Runbook (pending Daniel seeing its value), fix the SessionStart hook, YouTube cat 28, Intro Graphic standardization. LATER = Signiant/RLN form auto-fill, OpusClip short-form. SKIP = "Create Episode L3 Package" bulk action, the 8-phase gfx-cue pipeline. DISCUSS (queue) = the rest.

## 15. Pipeline-mission authorizations + research doctrine (Daniel, gospel 2026-06-11)

Stated in the 2026-06-11 session while commissioning the Fable 5 pipeline mission prompt (`docs/_handoff/2026-06-11-fable5-mission-prompt.md`).

**Authorizations (supersede earlier, narrower framings where they conflict):**
- For the pipeline mission, Daniel authorizes working beyond the default rule set, with two absolute conditions: **(1) never write to the QNAP server** (read-only SMB stands, no carve-out), and **(2) never operate on stale information** — always pull latest branch state and verify claims against current sources before acting on them.
- **ProPresenter live rig:** Daniel authorizes designing AND wiring control of the live production ProPresenter (GSN-PropRes), including Tailscale for that path. Build and prove on the test machine first; every action against the LIVE rig requires a human "yes" in the moment (dry-run, show what will fire, wait). This extends s14's "preproduction only" line; the in-the-moment confirm is NOT waived.
- Prompt-hygiene ruling: instructions that suppress the agent's visible reasoning or that "reframe safety constraints into executable commands" are rejected; strip them from any prompt before use.

**Research doctrine (for the mission's research phases):**
- **Optimistic intake:** community/video/hearsay claims may be provisionally assumed true so work keeps moving, BUT every claim adopted into a plan must immediately spawn a verification agent (official docs, changelog, or live test) and carry a status: ASSUMED -> VERIFIED / PARTIAL / REFUTED. Nothing REFUTED or still-ASSUMED ships in a final build step.
- The research phase runs as a **continuous loop with a minimum 5-hour runtime**, checkpoint-committing findings as it goes.
- Seed corpus: `docs/_handoff/2026-06-11-video-research-queue.json` (99 curated videos, Jan-Jun 2026, from Daniel's Q1/Q2 sheets).

**Lead-agent directive (Daniel, gospel 2026-06-11, spoken while reviewing the mission run):**
Claude is the lead on the pipeline project. Wherever Claude holds a researched
recommendation, it makes the call and records it here, dated, without re-asking; it asks
Daniel only when it genuinely lacks the information for the right call, and batches those
questions. Usage preservation: heavy mechanical work (transcript pulls, bulk file
processing) routes to a separate local session on Daniel's other account whenever it can
run without project context; outputs flow back via the mission branch. NOT waived, ever:
merges need Daniel's yes, the Type-YES import gate, the live-rig in-the-moment yes, QNAP
read-only, 1Password-only credentials.

**Decisions exercised under that directive (Claude as lead, 2026-06-11):**
- Install batch: YES to ccusage, claude-devtools, jkawamoto local transcript MCP,
  supabase/agent-skills, vercel-labs/next-skills, commit-commands (all run on the Mac
  prompt). The ergut REMOTE transcript MCP is DEFERRED, not installed: the Mac pull makes
  cloud mining redundant; revisit only if the Mac run covers under ~60% of the queue.
- Rundown Creator adapter (plan P1/decision 3): YES, build in slice 6 before any further
  RC automation.
- Transcription (P2/decision 4): BUILD local (WhisperKit + SpeakerKit per the canon
  registry); revisit only if correspondent-segment diarization fails on the first episode.
- Decision 6 taps: YES to all three - P7 five quality checks as soft warnings only, P14
  gsr-research repo hygiene, and the jobs-queue internals on Supabase Queues (pgmq; same
  Mac-polls-Supabase shape s12 locked, better plumbing).
- Proposal dispositions locked as recommended in plan v3 section 6: P3 runbook after
  slice 7; P4 fold guest-picker + Monday Tasks into the dashboard, keep lanes.html
  standalone; P5 no separate STATUS.md; P6 skip extra L3 views for now; P11 live-ASR
  deferred behind 10.3/10.4; P13 skip Cline rules. P16 stays exactly as Daniel ruled
  (skip), with the standing exposure flag on record.
- Still Daniel-only: decision 1 (merge the PR stack - his yes, two lanes offered),
  decision 5 (calendar for the two working sessions; default Tue Jun 24 morning stands),
  the Rumble send, and the physical Mac runs.

## 16. Security incident correction (Daniel + David, confirmed 2026-06-11)

The 2026-05-20 security incident was caused by accessing the QNAP admin dashboard (tweaking server settings). **Tailscale was not the issue** -- David confirmed this explicitly. Prior docs that said "No Tailscale or direct server tools -- permanently off-limits" were wrong.

Correct restrictions (as of 2026-06-11):
- **QNAP admin dashboard** is off-limits via any access method (web UI, app, API).
- **Tailscale for read-only SMB access to QNAP is permitted** from home, work, or anywhere.
- Read-only SMB means you can browse and open files; no settings changes, no writes, no admin.
- **NAS file-watchers are still barred** -- a persistent process sitting on shared NAS hardware creates unpredictable load regardless of read/write mode. Use a local Mac watcher instead (fswatch/Hazel watching a local folder after files arrive there).
- **SYSTEM-EVOLUTION.md** contains outdated Tailscale restriction language throughout. It is superseded on these points by this canon (sections 16-17). A full doc-pass to correct SYSTEM-EVOLUTION is needed but not blocking.

## 17. Infrastructure restriction updates (Daniel, 2026-06-11)

- **ProPresenter (GSN-PropRes, Tailscale 100.98.215.7):** Read access is now permitted for mapping and testing. Daniel is enabling read access to map out and test the ProPresenter setup. Write and control commands require David's explicit approval; treat ProPresenter writes with caution. Not a hard ban on automation -- a caution gate.
- **ATEM / Bitfocus Companion:** Hard blocker removed. Not a prohibited system. Treat as production hardware requiring care; confirm with David before any live broadcast-chain automation.
- **QNAP:** Sensitive shared hardware. The rule is strict no write access and no admin dashboard access. Proceed with caution on anything touching QNAP. Tailscale for read access is always fine.
- **Tailscale:** Only restricted when it would write to a server. Tailscale for read access is always permitted.
- **Notion:** Wiki-only after ADR-0012 remains correct and unchanged.

## 18. Booking + topic-evaluation frameworks (Daniel, promoted to canon 2026-06-11)

Recovered verbatim from the GSR Interview Research project on 2026-06-08 (full text:
`GUEST-CORRECTIONS.md` section 5); promoted here per Lane 8 so they govern every monthly
slate. Use them when building or vetting guests and topics.

- **Guest mix 40/40/15/5**, enforced at the 30-topic shortlist (not the 100-topic
  longlist): 40% explicit creationists / ID proponents (ICR, Discovery, AiG, Logos),
  40% neutral practitioners (NASA engineers, university researchers, field scientists,
  medical researchers), 15% faith-friendly, 5% science communicators.
- **Five-Point Stakes Assessment, all five or kill/reframe:** personal impact; visual
  potential; novelty + universality; emotional payload (wonder, justice, awe,
  understanding); accessibility ladder (teenager AND PhD).
- **Four hook types (use what the story already has):** universal anchor; incongruity;
  numbers made personal; consequence before cause.
- **Tags:** accessibility tier BROAD / MID / SPECIALIST; worldview fit CLEAN / NEEDS
  FRAMING / RISKY; guests carry a 0-100 fit score (90+ = bullseye).
- **The Barentine Test:** the template is the John Barentine interview (Reflect Orbital's
  50,000 mirrors): extremely fascinating or a clear "so what" for the average viewer,
  universal anchors, real stakes, visible impact. A topic does NOT need a creationist
  angle to qualify.

Cross-reference, not duplicated here: confirmed is not booked; talking points only, never
verbatim questions; chyron = 3 topic-relevant variations (s13).

## 19. Dashboard redesign directive (Daniel, gospel 2026-06-12)

Stated 2026-06-12 with example files attached (his "world" liquid-glass mocks 01, 05, 06,
07, 08, 09, 10, plus the older pipeline v3 / bake-off research / course overview / flight
worksheet HTML files).

- **The current dashboard UI is rejected** ("atrocious") and was being designed from
  outdated information. Scrap it.
- **Feature scope = recent context only:** the redesign carries only the features and
  elements Daniel has been talking about recently (canon s12-s15 + the 2026-06-11 pipeline
  build plan), not older mock-era concepts.
- **Visual direction = an elegant liquid glass theme**, designed by combining the most
  intuitive and elegant aspects of all the supplied examples into one new design (not a
  copy of any single file). More example files may arrive; fold them in.
- **Navigation must match and fit the actual workflow** (the phase-one lower-thirds flow
  and the wider pipeline), not tool-named pages.
- **Supersedes:** the 7-direction bake-off as a decision frame, and the unstyled
  "one on-brand theme" placeholder in answer 3A. The operational structure from 3A
  (per-role Today queue + Pipeline Matrix, mobile-first) stands; the visual treatment
  applied to it is governed by `docs/_handoff/DESIGN-TASTE.md` (see the fresh-start
  entry below).
- Plan of record: `docs/_handoff/2026-06-12-dashboard-redesign-plan.md`.

**Confirmations (Daniel, one-tap cards, 2026-06-12 late session):**
- The 7-step Phase-1 lower-thirds workflow statement (redesign plan section 1): **CONFIRMED correct.**
- The five-station navigation, Today / Episodes / Lower Thirds / Distribution / Guests,
  with Graphics + Schedule reserved: **CONFIRMED.**
- The 12-station pipeline vocabulary (Script, Guests, Lower Thirds, Graphics, Rundown,
  ProPresenter, Record, Edit, Transcript, Metadata, Distribution, Aired): **CONFIRMED
  canonical.** Each role sees its relevant columns.
- claude.ai/design sync: **build the real components first, then sync from the Mac**
  (this cloud session has no claude.ai/design connection; a skills folder is not a
  component library). CONFIRMED.
- Liquid glass look: one-tap approval **RESCINDED later the same day** (see the
  fresh-start entry below, which governs).
- Note for the record: an earlier identical card round returned opposite answers on three
  items; the later, clarified round above governs (his latest word wins).

**UI FRESH START (Daniel, 2026-06-12, latest word — governs over everything above):**
- After living with the four mocks on his phone, Daniel rescinded the Liquid Glass pick.
  Of the three alternates, **Soft Structural** felt best ("cleaner"), but **no mock is
  approved** and he wants **no new mockups yet**.
- Core design law, his words: he cannot look at walls of numbers without getting
  overwhelmed. **Visual elements must tell the story on the dashboard's behalf; numbers
  are detail, one tap deep.** Every element must exist for a stateable reason and the
  whole must be cohesive. A generic/ugly template dashboard is equally rejected.
- He declared a **fresh start on design guidance**: every mock and UI-advice doc was
  archived to `docs/_archive/2026-06-12-ui-fresh-start/` (12 mock HTML files + the 4
  ui-research briefs) and none of it is guidance anymore. The ONLY live visual guidance
  is `docs/_handoff/DESIGN-TASTE.md` (his reactions, append-only). Redesign-plan
  sections 4–5 (theme synthesis, donor map, token sheet, screen blueprints) are retired
  with the archive.
- Process, per Daniel: he cannot spec a look in words and question batteries don't work;
  he specs by reacting ("no, I don't like that" is the data). Required loop: research +
  planning first, then a words-first brainstorm with him, mockups only after that, one
  screen at a time, on his real data, phone first, every reaction logged in
  DESIGN-TASTE.md so nothing is re-asked.
- Unchanged by the fresh start: the five-place navigation, the 12-station pipeline, all
  gates, and the build-then-sync answer on claude.ai/design. Those are structure, not
  styling, and remain CONFIRMED.

**THE CENTRALIZATION PROBLEM (Daniel, 2026-06-12, second message — read with the fresh-start entry):**
- The Today screen as previously conceived is NOT confirmed content. The only thing Daniel
  knows he wants from a "today" surface is **his daily todo list synced from his notes**
  (Apple Notes). A status grid of the five preproduction episodes on the home page:
  probably not helpful either (the Episodes screen itself still stands; this is about
  home-page content). His words: he has been going with "whatever makes the most sense to
  have on the home page" instead of "what would actually be the most useful," and he has
  NOT decided what he wants to see. Do not presume home-screen content.
- Trust gap, stated plainly: Daniel does not yet trust Claude-built priority lists,
  because Claude has not demonstrated understanding of his monthly work cycle, and has a
  track record of **missing things in his email and getting confused tracking
  communication and booking.** Treat this as a standing constraint: never build a feature
  whose correctness depends on Claude silently reading email correctly. Trust is earned by
  being checkable (evidence shown inline, one-tap correctable, corrections remembered),
  not by claiming smartness.
- The chicken-and-egg he named: a zoomed-out monthly view needs the system to track all
  the moving parts, but the larger trackable tasks are not yet established anywhere (not
  articulated in his head, not in the system). Establishing that model is the
  prerequisite for any home screen and for any trustworthy priority list.
- Direction proposed in reply (pending his reaction): (1) map the producer month FIRST:
  Claude drafts the recurring responsibility tracks from repo knowledge, Daniel corrects
  it like a mockup, result becomes a canon doc; (2) give each responsibility an explicit
  trackable home (e.g. a booking board with states, where emails are attached evidence,
  never the source of truth); (3) the home page is designed LAST, composed from the
  tracks he actually uses; day-one home content = things Daniel authors himself (the
  daily note).

**THE ENABLEMENT PLAN (Daniel, 2026-06-12, third message — he agreed with the direction above and refined it):**
- **Crew tracks first.** Isaac, Myriam, and the intern only need the big things tracked
  (post-production, graphics tracking, distribution phases), and their information
  "exists on paper instead of in their heads." These are the right early automation
  targets: high volume but checkable against documents (Graphics Tracker, Rundown
  Creator, the distribution registry, export artifacts).
- **Daniel's own tracking is the long road, by his explicit choice.** Many moving
  parts; the ORDER shifts month to month, so no single stored order can be right. His
  chosen path: conversations every day, multiple times a day, where Claude extracts
  tasks and ordering from his long rambles. He expects a long ramp and accepts it.
- **His commitment + risk preference (governing value):** months more of his time if
  needed; he would rather take two months of zero return than force a faster finish and
  own a system he cannot fully trust. He invests ONLY against a method both sides agree
  on. Method proposed: `docs/_handoff/2026-06-12-rant-to-model-method.md` (raw journal,
  three-layer picture with receipts, contradictions held as data, echo receipts,
  never-asked-twice, loss-proof capture). Awaiting his go.
- **The contradiction warning (his words, standing constraint):** his style produces
  apparent self-contradictions in long rambling paragraphs and will not change; careless
  interpretation/logging would poison the records. Conflict handling per the method doc
  is therefore mandatory whenever processing his dumps: raw first, receipts always,
  conflicts flagged and held open, never argued, never silently resolved.
- Raw intake lives in `docs/_handoff/PRODUCER-JOURNAL.md` (append-only). A dictation
  was lost to an incoming call on 2026-06-12; its recovered fragment is Entry 1.

**THE EXPERT-IN-THE-ROOM MANDATE + METHOD PIVOT (Daniel, 2026-06-13 08:49 UTC — latest word, governs):**
- Daniel stopped the process to correct the working dynamic itself: he has been "jumping
  at his own suggestions" and watching Claude build them, and he does not want that. His
  words: "I need you to come up with your own ideas... you are better at this than me and
  I need you to be the expert in the room. I'm a little child who's never done this... the
  client who is super wishy-washy and doesn't necessarily know what they want and you're
  supposed to give me clarity... you're not supposed to just go with every whim that I
  have, you're supposed to give me clarity and keep me grounded." Binding rule now in
  CLAUDE.md (Expert-in-the-room mandate): Claude leads on HOW (method/craft), recommends
  ONE path not a menu, names churn, keeps him grounded; Daniel owns WHAT (goals/facts).
- He also rejected the daily-rant journal as the ENGINE: it would force him to keep
  re-reading and correcting his own entries, too much to sustain over two months. Fair,
  and it is the same churn pattern (glass -> rescind -> month-map -> journal, each needing
  a big lift from him).
- METHOD PIVOT (Claude's expert call, his to veto): stop trying to MODEL Daniel's brain
  before building anything. Build the surfaces that stand on facts that already exist on
  paper (crew tracks: distribution, graphics, post; then booking as a visible state-board
  with email as attached evidence, never the source of truth). Daniel's own workflow model
  then ACCRETES by the system observing his actions (order, timing, what sits where),
  surfaced back as occasional 5-second "I noticed X, right?" confirmations, never daily
  homework. The journal survives only as an OPTIONAL zero-pressure inbox. Honest limit:
  the system learns what it can see; off-system decisions get rare quick confirmations.
  Daniel's burden becomes "use the tools, correct them when wrong (seconds)," not "narrate
  and review your life." Full method: `docs/_handoff/2026-06-12-rant-to-model-method.md`
  (revised 2026-06-13).
- FIRST BUILD (Claude's reasoned pick): the Distribution tracker. It stands entirely on
  existing facts (the s11 platform registry, air dates, the Monday 4PM ET webstream
  rhythm), it is Myriam's crew lane so there is zero on-air risk to David, and it is the
  cleanest proof that the dashboard can show true status with nothing narrated. Booking
  board is second, because that is where Claude's email-tracking failures have hurt
  Daniel, and making it visible + checkable attacks the trust wound head-on.

