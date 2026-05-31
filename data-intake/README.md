# data-intake/ — GSR pre-build data collection

Staging area for data we collect **before** building, so the first Supabase import is a
clean one-shot. Everything here is shaped to map directly onto Supabase tables.

This folder **is tracked in git on purpose.** Each collection sweep is a commit, so you
can diff sweep-over-sweep and literally watch the data converge (conflicts shrink, blanks
fill in). Raw source pulls are never hand-edited — corrections go in `overrides/` (below).

---

## Golden rules (every collection session obeys these)

1. **Read-only at the source.** Never write to YouTube, Drive, RC, any platform, or
   production Supabase. Output is files in this folder only.
2. **Verbatim.** Titles, descriptions, quotes, cell values are copied byte-for-byte. Add
   a normalized column *alongside* the raw one; never overwrite the raw.
3. **Triangulate, don't trust.** Every fact that can come from ≥2 sources must be pulled
   from each source independently, then reconciled. Sources disagreeing is expected and
   useful — it gets logged, not silently averaged.
4. **Never guess into a key field.** If you can't determine an episode number or match a
   guest, mark `needs_human=true` and move on. A blank is recoverable; a wrong guess
   poisons the import.
5. **Idempotent.** Re-running a source scraper overwrites only that source's file. Re-running
   the reconciler regenerates the merged + conflicts + needs_human files. Sweeps converge.

---

## Directory layout

```
data-intake/
  README.md                     ← this file (schemas + protocol + prompt library)
  sources/                      ← raw, per-source pulls. One file per (entity, source).
    episodes_youtube.csv
    episodes_fireside.csv
    episodes_rumble.csv
    episodes_rln.csv
    episodes_gsn_schedule.csv
    guests_contact_sheet.csv
    guests_youtube.csv
    appearances_schedule.csv
    appearances_youtube.csv
    appearances_scripts.csv
    ...
  overrides/                    ← human decisions, highest-priority "source". Hand-edited.
    episodes.csv
    guests.csv
    episode_guests.csv
  episodes.csv                  ← RECONCILED deliverables (regenerated each sweep)
  episodes.conflicts.csv
  episodes.needs_human.csv
  distributions.csv  distributions.conflicts.csv  distributions.needs_human.csv
  guests.csv         guests.conflicts.csv         guests.needs_human.csv
  episode_guests.csv episode_guests.conflicts.csv episode_guests.needs_human.csv
  shoot_sessions.csv
  premade_library.csv
  rc_columns_map.json  rc_rundown_map.json  rc_sample_structure.md
  voice/  (INDEX.md, kill_list.md, <samples>)
  propres_inventory.csv  propres_aired_lower_thirds.csv  propres_templates.csv
  propres_media.csv  propres_fonts.csv  propres_conventions.md
  drive_inventory.csv
```

---

## Canonical keys & normalization (identical across every agent)

- **episode_uid** — `S{season:02d}E{episode:03d}`, e.g. `S03E021`. The join key for everything.
  If the episode number is unknown, leave `episode_number` blank, set `episode_uid` blank,
  and key provisionally on `air_date` + `title_slug` (flag `needs_human`).
- **title_slug** — lowercase, ASCII, non-alnum → single hyphen, trimmed. e.g.
  `"Dinosaurs & the Flood!"` → `dinosaurs-the-flood`.
- **guest_key** — `first-last`, lowercased, accents stripped, ASCII, hyphen-joined. Collisions
  get a `-2` suffix and `needs_human=true`.
- **Dates** — store ISO `YYYY-MM-DD` in the canonical column **and** keep the original string
  in a `*_raw` column. Never silently reformat; if a date is ambiguous (e.g. `3/4/26`), keep
  raw and flag.
- **Enums** —
  - `platform` (audience-facing destination) ∈ `youtube | rumble | fireside | rln | gsn_broadcast | gsn_ondemand | cbn | other`
  - `delivery_mechanism` (how content gets there) ∈ `direct_upload | fireside_hub | signiant | masterplay | streamhoster | dropbox | other`

  **Distribution map (confirmed by Daniel 2026-05):** the two axes pair like this —
  | platform | what it is | delivery_mechanism |
  |---|---|---|
  | `youtube` | YouTube channel | `direct_upload` |
  | `rumble` | Rumble (confirm if still active) | `direct_upload` |
  | `fireside` | podcast hub → fans out to Spotify / Apple Podcasts / etc. | `fireside_hub` |
  | `rln` | Real Life Network | `signiant` (Signiant portal) |
  | `gsn_broadcast` | GSN weekly **live broadcast** channel | `masterplay` (the playout service GSN runs on) |
  | `gsn_ondemand` | GSN **on-demand** iOS / Apple TV app | `streamhoster` |
  | `cbn` | CBN pulls episodes | `dropbox` (CBN reads from a shared Dropbox folder) |

  `gsn_broadcast` and `gsn_ondemand` are deliberately split — same network, two separate
  upload workflows (MasterPlay vs StreamHoster). For `fireside`, record the hub row and
  capture the downstream audio services in `downstream_platforms` (JSON) when discoverable.
  `masterplay`, `signiant`, and `dropbox` are **delivery portals, not public catalogs** —
  for those, distribution is tracked as a "was this episode delivered?" record (from Drive /
  email / the portal), not a public scrape.
  - `segment` ∈ `monologue | interview_1 | interview_2 | ministry | other`
  - `asset_type` ∈ `b_roll_loop | title_graphic | graphic | clip_with_audio | other`

---

## Provenance columns (on EVERY reconciled row)

| column | meaning |
|---|---|
| `sources` | pipe-list of sources that contributed, e.g. `youtube\|gsn_schedule` |
| `source_count` | integer count of agreeing sources |
| `confidence` | `high` (≥2 sources agree, or an override exists) · `medium` (1 authoritative source) · `low` (1 weak source or a fuzzy match) |
| `conflict_fields` | pipe-list of fields where sources disagreed (also expanded in `*.conflicts.csv`) |
| `needs_human` | `true` if any key field is `low`/conflicting after overrides applied |

---

## The reconciliation + override protocol (how it self-refines)

This is the mechanism that lets the data clean itself over a few sweeps with **minimal**
human effort:

1. **Source scrapers** (run in parallel, one per source) write `sources/<entity>_<source>.csv`.
   Each row carries the canonical key + that source's observed values. Nothing else.
2. **The reconciler** joins all `sources/<entity>_*.csv` on the canonical key and produces:
   - `<entity>.csv` — one row per entity, best value per field, with provenance columns.
   - `<entity>.conflicts.csv` — one row per `(key, field)` where sources disagree, with a
     column per source showing each value. This is the audit trail.
   - `<entity>.needs_human.csv` — the **only** file you review: unmatched rows, low-confidence
     matches, new entities, unresolved conflicts on key fields.
3. **You** resolve items by adding rows to `overrides/<entity>.csv` (e.g. "episode_uid=S03E021,
   field=guest_name, value=Dr. Jane Smith"). You touch nothing else.
4. **Next sweep**, the reconciler treats `overrides/` as the highest-priority source, so your
   decision sticks forever and is never re-surfaced. Resolved conflicts drop out of
   `needs_human`. Each sweep the review file gets shorter.

**Convergence target:** by sweep 3, `needs_human.csv` should be near-empty and `episodes.csv`
should import to Supabase with zero hand-editing.

---

## Deliverable schemas

Columns below are the *intake* shape. At import time, confirm against the live schema
(`list_tables`) — column names may differ slightly; the mapping is 1:1 in spirit.

### `episodes.csv` → table `episodes`
`episode_uid, season, episode_number, title, title_slug, description, tags, chapter_markers(JSON), air_date, air_date_raw, youtube_published_at, runtime_sec, status, + provenance`

### `distributions.csv` → table `distributions` (one row per episode × platform)
`episode_uid, platform, delivery_mechanism, url, platform_title, platform_description, published_at, published_at_raw, view_count, is_published, downstream_platforms(JSON), + provenance`

### `guests.csv` → table `guests`
`guest_key, title, first_name, last_name, full_name, credentials, organization, expertise, bio, email, phone, website, social_handles(JSON), + provenance` *(PII columns — `guests.needs_human.csv` only, never paste contact info into prompts)*

### `episode_guests.csv` → table `episode_guests` (one row per guest × episode)
`episode_uid, guest_key, guest_full_name, segment, topic, role, + provenance`

### `shoot_sessions.csv` → table `shoot_sessions`
`production_month, shoot_date, shoot_date_raw, shoot_time, guest_full_name, guest_key, topic, article_url, status, + provenance`

### `premade_library.csv` → table `premade_library`
`name, description, asset_type, is_loop, duration_sec, source, source_url, license_type, server_file_path, resolution, tags, + provenance`

### `rc_columns_map.json` / `rc_rundown_map.json`
RC column display-name → numeric ID map; cycle rundown IDs by episode + template ID. See Prompt E.

### `voice/`
`INDEX.md` (scored sample list), `kill_list.md` (regex-ready banned patterns), individual verbatim samples. See Prompt F.

---

## Collection prompt library

Paste any of these into a fresh Claude Code session. They are designed to **fan out across
sources in parallel and cross-check each other** per the protocol above. Launch A, C, E first
(C and E often need an auth handshake). B depends on A + C outputs. D and F are independent.

### Prompt A — Episode & Distribution triangulation
```
Build GSR's episode + distribution catalog by TRIANGULATING across every platform, per
data-intake/README.md. Cover Season 2 and Season 3.

HOW GSR ACTUALLY DISTRIBUTES (Daniel's notes — use this to set platform + delivery_mechanism):
  - YouTube — direct upload.
  - Rumble — direct upload (confirm it's still active before scraping).
  - Fireside — the podcast hub; it syndicates out to Spotify / Apple Podcasts / all the
    music+podcast services. Record one fireside row and list the downstream services.
  - RLN = Real Life Network — we deliver to them through the SIGNIANT portal (not a public
    upload; it's a delivery record, not a scrape).
  - GSN = Genesis Science Network, and it has TWO separate destinations, keep them distinct:
      * gsn_broadcast — the LIVE broadcast channel; we upload episodes WEEKLY to MASTERPLAY
        (the playout service GSN runs on). Delivery record, not a scrape.
      * gsn_ondemand — the GSN on-demand iOS / Apple TV app, served via STREAMHOSTER. This
        one may have a public catalog to scrape.
  - CBN — pulls episodes from a shared DROPBOX folder (delivery record, not a scrape).

Use the Agent tool to launch these source-scrapers IN PARALLEL (one subagent each), so they
work simultaneously and we can compare their results. Set BOTH platform and delivery_mechanism
columns per the notes above:
  PUBLIC CATALOGS (scrape for url + metadata):
  - YouTube (API key if present, else yt-dlp) -> sources/episodes_youtube.csv +
    sources/distributions_youtube.csv  (platform=youtube, delivery_mechanism=direct_upload)
  - Fireside podcast pages -> sources/episodes_fireside.csv +
    sources/distributions_fireside.csv (platform=fireside, mechanism=fireside_hub; capture
    downstream Spotify/Apple Podcasts links in downstream_platforms)
  - Rumble (confirm still active) -> sources/distributions_rumble.csv (direct_upload)
  - GSN on-demand app catalog (StreamHoster-served) -> sources/distributions_gsn_ondemand.csv
    (platform=gsn_ondemand, mechanism=streamhoster)
  - The GSN airing-schedule sheet from Drive -> sources/episodes_gsn_schedule.csv
  DELIVERY RECORDS (not public — record "delivered? when?" from Drive/email/portal, no scrape):
  - gsn_broadcast (mechanism=masterplay, weekly), rln (mechanism=signiant), cbn
    (mechanism=dropbox) -> sources/distributions_delivery_records.csv
Each scraper writes ONLY the canonical key (episode_uid via README rules) + its observed
fields, verbatim. Read-only everywhere.

Then run ONE reconciler pass that joins all sources/episodes_*.csv and sources/distributions_*
.csv on episode_uid (applying overrides/ as top priority) and emits episodes.csv,
episodes.conflicts.csv, episodes.needs_human.csv, distributions.csv, distributions.conflicts
.csv per the schemas + provenance columns in the README.

Cross-check explicitly: where YouTube and Fireside titles/air-dates disagree, log both in
conflicts (do NOT pick silently). Where a platform has an episode the schedule doesn't,
flag needs_human. End with a one-paragraph convergence report: episodes found per source,
how many matched across ≥2 sources, conflict count, needs_human count.
```

### Prompt B — Guest & Appearance triangulation  *(run after A + C)*
```
Build GSR's guest roster + appearance history by triangulation, per data-intake/README.md.
Inputs already in data-intake/: sources/episodes_*.csv (Prompt A) and the Drive sheets
(Prompt C).

Launch IN PARALLEL via the Agent tool:
  - Guest Contact List sheet -> sources/guests_contact_sheet.csv (roster + PII)
  - YouTube descriptions (from sources/episodes_youtube.csv) -> sources/guests_youtube.csv
    (names/credentials inferred) + sources/appearances_youtube.csv
  - Scheduling sheet -> sources/appearances_schedule.csv
  - Script index (Prompt C) -> sources/appearances_scripts.csv
Each writes canonical keys (guest_key, episode_uid) + observed fields, verbatim.

Then ONE reconciler pass: fuzzy-match guest_key across sources AND against the live `guests`
table (Supabase MCP, read-only). Emit guests.csv, episode_guests.csv and their .conflicts /
.needs_human files. Apply overrides/ first.

Cross-check rules: NEVER auto-merge a fuzzy name match or auto-create a guest — every
new/low-confidence guest goes to guests.needs_human.csv. Where the schedule says a guest
appeared but no platform confirms (or vice-versa), that appearance is needs_human. Compute
per-guest last_aired_date + days-since for the 40-day cooldown. End with a convergence report.
```

### Prompt C — Drive harvest (feeds A & B)
```
Inventory the GSR Google Drive (Drive MCP, read-only) and extract the production sheets the
other intake sessions depend on, per data-intake/README.md.

First: broad search -> data-intake/drive_inventory.csv (file_name, type, folder_path,
last_modified, url, why_it_matters).

Then fan out one subagent per HIGH-VALUE target IN PARALLEL:
  - 2026 monthly interview schedule -> sources/episodes_gsn_schedule.csv +
    sources/appearances_schedule.csv + data-intake/shoot_sessions.csv (schemas in README)
  - Graphics Tracker (tabs Show 1..5) -> sources/graphics_tracker.csv (verbatim cells)
  - Guest Contact List -> sources/guests_contact_sheet.csv
  - Scripts folder -> sources/appearances_scripts.csv (INDEX ONLY: season, episode, segment,
    file_name, url — do not dump full scripts)
Keep raw date strings in *_raw columns plus an ISO column. Read-only. End with a gaps report:
sheets found but unparseable, ambiguous tabs, suspected newer/older duplicates.
```

### Prompt D — Premade / B-roll library inventory  *(independent)*
```
Catalog GSR's reusable visual assets into data-intake/premade_library.csv (schema in
data-intake/README.md). Scan the ProPresenter root folder ON THE SSD COPY ONLY — never the
networked GSN-PropRes machine (100.98.215.7) — plus any stock/B-roll folders.

Fan out one subagent per top-level asset folder IN PARALLEL. Each emits rows: name,
description, asset_type, is_loop, duration_sec, source, source_url, license_type,
server_file_path, resolution, tags. Inventory metadata only — do NOT copy or move files.
Bias toward generic reusable loops (ocean, farmland, earth-from-space, moon, milky way,
city, archival observatory) and tag for findability. End with a gaps report: assets missing
a license or duration.
```

### Prompt E — Rundown Creator structure snapshot  *(read-only; run early)*
```
Snapshot the Rundown Creator structure per data-intake/README.md. Use the RC REST API
(APIKey+APIToken, server-side only, never print secrets). READ-ONLY endpoints only.
  1. rc_list_columns -> data-intake/rc_columns_map.json (display name -> numeric ID; confirm
     Graphics=1, Format=2, Segment=3, Last Line=4, Notes=9, exact-cased "EstimatedDuration").
  2. rc_list_rundowns -> data-intake/rc_rundown_map.json (this cycle's rundown IDs by
     episode + the template RundownID 10). If a list endpoint times out, retry w/ backoff,
     then fall back to probing known IDs; record which path worked.
  3. One representative rundown: rc_get_rows + rc_get_script -> data-intake/rc_sample_structure
     .md (row labels, which rows carry last lines, where <gfx> sits; confirm \n\n + literal
     <gfx> survive). End noting whether column IDs are stable across monthly template clones.
```

### Prompt F — Voice-DNA corpus  *(independent)*
```
Assemble the GSR Voice DNA corpus per data-intake/README.md into data-intake/voice/. Gather
David's strongest THD scripts + opening monologues (Drive) and the best YouTube descriptions
(sources/episodes_youtube.csv). Fan out one subagent per source/batch IN PARALLEL, each
scoring samples 1-5 on hook/specificity/rhythm/economy/landing and EXCLUDING anything that
smells AI-authored (generic abstract closes, "Overall", stacked-noun endings). Output top ~12
THD + ~8 monologue samples verbatim as individual files + voice/INDEX.md (scores) +
voice/kill_list.md (regex-ready banned patterns). Note which voice types are thin and need
Daniel's co-creation. Do NOT stage raw samples anywhere they'd be fed wholesale into a prompt.
```

### Prompt G — ProPresenter backup library scan  *(SSD backup drive plugged in; independent)*
```
Scan the ProPresenter BACKUP library on the plugged-in SSD and turn it into structured
intake, per data-intake/README.md. This is the richest single source we have for how GSR's
lower thirds ACTUALLY aired — treat it as ground-truth and key everything to episode_uid.

HARD GUARDRAILS:
- Operate ONLY on the SSD backup library. NEVER touch the networked GSN-PropRes machine
  (Tailscale 100.98.215.7). Do NOT open the ProPresenter app. Read-only; never copy/move/
  modify a file. Inventory metadata only.
- .pro files are ProPresenter 7 protobuf bundles. Parse with a real parser if one is
  available (e.g. a python-protobuf / pro-parser lib); otherwise fall back to extracting
  text via `strings`/regex and mark those rows confidence=low. Never fabricate slide text.

Use the Agent tool to fan out IN PARALLEL — one subagent per top-level library/playlist
folder — and produce these deliverables (the ones most useful for building, in priority
order):

1. data-intake/propres_inventory.csv — every .pro file:
   type (presentation|template|playlist), name, library, rel_path, slide_count,
   arrangement_names, last_modified, episode_uid (parse from name if per-episode; else blank
   + needs_human). + provenance.

2. data-intake/propres_aired_lower_thirds.csv — THE KEY DELIVERABLE. One row per slide of
   each per-episode presentation: episode_uid, slide_order, slide_label, l3_line1, l3_line2
   (VERBATIM aired text), template_used, segment (infer monologue/interview_1/etc.),
   media_refs. This is what validates the graphics generator, seeds Voice DNA for real L3
   phrasing, and cross-references YouTube/RC/script data. + provenance + confidence.

3. data-intake/propres_templates.csv — lower-third + title templates: template_name,
   text_element_count, font, font_size, color, position (x/y/anchor), safe_area, line_count,
   which L3 type/segment it serves, source_library. This is what the build-presentation
   automation will CLONE — capture it precisely.

4. data-intake/propres_media.csv — every referenced media file, shaped to the
   premade_library schema (README): name, asset_type, is_loop, duration_sec, resolution,
   server_file_path, file_hash (for dedup), reuse_count (how many presentations reference
   it), source (infer). Dedup by hash. Metadata only — do NOT copy media.

5. data-intake/propres_fonts.csv — fonts used across templates + where, so the dashboard
   font-editor can match.

6. data-intake/propres_conventions.md — observed naming conventions (presentation + playlist
   names per episode/show-day), playlist structure for a show day, and YOUR RECOMMENDATION of
   the canonical template set a new-episode build should clone. Flag old/archived vs current-
   season presentations.

End with a convergence/gaps report: presentations you couldn't map to an episode_uid,
.pro files that needed strings-fallback (low confidence), and any templates that look
duplicated or stale.
```

---

## Agent Teams LEAD prompt — runs A–G as one orchestrated sweep

Paste this into a single Claude Code session with **Agent Teams enabled** (experimental;
v2.1.32+, off by default — enable it first). The lead spawns teammates that COLLECT in
parallel, then the lead RECONCILES centrally and commits. Splitting collect from reconcile is
deliberate: it keeps two agents from ever writing the same merged file.

```
You are the LEAD of a Claude Code Agent Team running a parallel data-collection sweep for GSR.
Goal: populate data-intake/ with reconciled, import-ready CSV/JSON.

FIRST, read data-intake/README.md IN FULL — it defines the canonical keys, schemas, provenance
columns, and the reconciliation+override protocol. Every teammate and you obey it.

DIVISION OF LABOR (critical for Agent Teams — prevents file-write conflicts):
- TEAMMATES only COLLECT. Each writes ONLY its own raw files under data-intake/sources/ plus the
  standalone deliverables listed below. A teammate NEVER edits another teammate's file and NEVER
  writes a merged/reconciled file.
- YOU (lead) own ALL reconciliation: every <entity>.csv, <entity>.conflicts.csv,
  <entity>.needs_human.csv, plus the final commit.

Each teammate executes its task EXACTLY as written in data-intake/README.md (Prompts A–G), with
ONE override: SKIP the "reconciler pass" step inside that prompt — produce only the raw/source
+ standalone files. Read-only at every external source; values copied verbatim.

SKIM GUARD — every teammate must clear these three gates (this is non-negotiable; a teammate
that hasn't cleared a gate is not allowed to proceed to the next one):
  GATE 1 — Read-back BEFORE collecting. The teammate re-reads its exact README section and
    messages the lead a restatement: (a) the precise list of files it will write, (b) the exact
    column header for each CSV (copied from the README schema), and (c) the three hard rules in
    its own words — read-only at source, values verbatim, and "flag needs_human, never guess a
    key field". The LEAD compares this against the README; if anything is missing, vague, or
    wrong, the lead sends it back to re-read. Collection does not start until the read-back matches.
  GATE 2 — Header-first. The teammate writes ONLY the header row of each output file first and
    shows it to the lead. Wrong/missing columns are caught here, before any data is gathered.
  GATE 3 — Self-audit BEFORE reporting done. The teammate re-opens its README spec and returns a
    checklist: every required deliverable exists, every required column is present, a sample of
    values is confirmed copied verbatim (not paraphrased), and every unresolved item was written
    to needs_human rather than guessed. No "done" without this checklist.
Then the LEAD spot-checks: pull 3-5 random rows from each teammate's output and verify against
the real source that titles/quotes are verbatim and keys (episode_uid/guest_key) are correct,
not invented. If a paraphrase or a guessed key is found, REJECT that teammate's output and have
it re-run the task. Do not reconcile from unverified collection.

CREATE this shared task list with dependencies, and keep <=5 teammates active at once (token
cost scales per teammate; free a slot as each reports done):

  WAVE 1 (launch in parallel):
    T-DRIVE    = Prompt C. Owns: drive_inventory.csv, sources/episodes_gsn_schedule.csv,
                 sources/appearances_schedule.csv, sources/graphics_tracker.csv,
                 sources/guests_contact_sheet.csv, sources/appearances_scripts.csv,
                 shoot_sessions.csv
    T-PLATFORMS = Prompt A (collection only). Owns: sources/episodes_youtube.csv,
                 sources/episodes_fireside.csv, sources/distributions_*.csv
    T-RC       = Prompt E. Owns: rc_columns_map.json, rc_rundown_map.json, rc_sample_structure.md
    T-PROPRES  = Prompt G. Owns: propres_inventory.csv, propres_aired_lower_thirds.csv,
                 propres_templates.csv, propres_media.csv, propres_fonts.csv,
                 propres_conventions.md
  WAVE 1b (start when a slot frees; independent):
    T-STOCK    = Prompt D. Owns: sources/premade_stock.csv
    T-VOICE    = Prompt F. Owns: voice/*
  WAVE 2 (BLOCKED until T-DRIVE and T-PLATFORMS both report complete):
    T-GUESTS   = Prompt B (collection only). Owns: sources/guests_youtube.csv,
                 sources/appearances_youtube.csv. Reads sources/episodes_youtube.csv + the Drive
                 sheets; does NOT edit them.

WHEN ALL COLLECTION TASKS ARE DONE, you (lead) reconcile per the README protocol, applying
data-intake/overrides/ as the HIGHEST-priority source:
  1. episodes.csv (+ .conflicts + .needs_human) — join sources/episodes_*.csv on episode_uid.
  2. distributions.csv (+ .conflicts) — join sources/distributions_*.csv on (episode_uid, platform).
  3. guests.csv + episode_guests.csv (+ .conflicts + .needs_human) — fuzzy-match guest_key across
     sources AND vs the live `guests` table (Supabase MCP, READ-ONLY). NEVER auto-merge a fuzzy
     match or auto-create a guest — those go to needs_human.
  4. premade_library.csv — concat + dedup sources/premade_stock.csv + propres_media.csv by file_hash.
Cross-check rule throughout: when sources disagree on a field, log BOTH values in conflicts —
never pick silently.

THEN write data-intake/SWEEP_REPORT.md: per-entity row counts, how many rows matched across >=2
sources, total conflicts, total needs_human, and the DELTA vs the previous SWEEP_REPORT if one
exists (so we see convergence sweep-over-sweep).

FINALLY: commit everything under data-intake/ to the CURRENT branch with message
"data-intake sweep N: <one-line summary>" and push (-u origin <current-branch>, retry on network
error). Do NOT push to main. Do NOT touch the networked GSN-PropRes machine (100.98.215.7).
Never print API secrets.

End your run by telling me ONE thing: the total rows across all *.needs_human.csv files, and how
much smaller that is than last sweep — that is the only pile I have to review.
```

