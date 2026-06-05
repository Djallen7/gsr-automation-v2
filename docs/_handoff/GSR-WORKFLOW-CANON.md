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

**Queued fixes (align code/docs to this canon, on a build pass, not the live DB now):**
- Add **Dreamstime** to the b-roll source enum (Daniel sources from Storyblocks, Dreamstime, Envato; only Storyblocks + Envato are in the enum today).
- Add **Book Cover** to the `production_graphics.graphic_type` CHECK (used in the sheet, missing from the DB).
- Reorder the `production_graphics.status` CHECK to the canon set `Not Started -> In Progress -> Created -> Loaded In`, and restore "In Progress" in PROMPT_LIBRARY (it was dropped).
- Rename the `graphics` table to `lower_thirds` (it holds lower thirds, not graphics) and keep `production_graphics` as the Graphics Tracker.
