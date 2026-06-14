---
name: rundown-creator
description: Operating manual for editing the David Rives Ministries Rundown Creator account, scripts, and Graphics Tracker. Load whenever a task touches Rundown Creator (rc_* tools), the monthly Graphics Tracker Google Sheet, or the gfx cue pipeline. Documents the renamed-columns trap that makes name-keyed writes silently fail, the GSR template structure, the Tracker-to-script-to-Rundown workflow, and the full API surface for ad-hoc edits beyond the MCP wrapper.
---

# Rundown Creator skill (David Rives Ministries account)

This skill is account-specific. Column names, ColumnID mappings, the default layout, the template rundown, and the production conventions below are all snapshots of how DRM's Rundown Creator is set up. They will be wrong for any other account.

## The three systems

1. **Rundown Creator** — the production cue list. Every cue point (including reuses) gets a row.
2. **Graphics Tracker** — a monthly Google Sheet that drives ProPresenter asset creation. Only unique graphics that need to be built go here (no reuses).
3. **The `<gfx ...>` pipeline** — graphics are authored inline in the monologue/ministry-report scripts. They get extracted into the Tracker, simplified for the teleprompter, then mirrored as cue rows in the rundown.

Reach for this skill on any task involving these systems, not just the strict RD-GT prompts. Those prompts encode the same conventions captured here; this skill lets you reason about partial edits and ad-hoc requests too.

```
              monologue script (with <gfx ...> tags inline)
                         │
        ┌────────────────┴───────────────────┐
        ▼                                    ▼
  Graphics Tracker                     Rundown Creator
  (Google Sheet, Show N tab)           (rundown rows B4+)
  - one row per UNIQUE graphic         - one row per CUE POINT
  - reuses skipped                     - reuses included with (reuse) tag
  - drives ProPresenter creation       - drives on-air cueing
  - "Graphic Type" column =            - format field copies the
    canonical Format value             Tracker's Graphic Type verbatim
```

Tracker first. Then simplify. Then rundown. Step 3's format field depends on step 1.

# Part 1 — DRM account specifics (read this first)

These two facts cause more than half of the "Success but didn't save" failures with this account:

## The renamed-columns trap

The Rundown Creator API ships with 10 default custom columns:
```
1 Writer   2 Editor   3 Segment   4 Talent
5 Camera   6 Effect   7 Graphic   8 Source
9 VTR      10 File
```

DRM renamed columns **1, 2, 4, and 9** to match the production workflow. The ColumnIDs stayed the same, only the display names changed:

| ColumnID | Default API name | DRM display name | Notes |
|---|---|---|---|
| 1 | Writer | **Graphics** | Cue description |
| 2 | Editor | **Format** | Graphic type from Tracker, verbatim |
| 3 | Segment | Segment | Repeats parent segment name |
| 4 | Talent | **Last Line** | Cues the NEXT row's graphic |
| 5 | Camera | Camera | Unused in current layout |
| 6 | Effect | Effect | Unused in current layout |
| 7 | Graphic (singular) | Graphic | Legacy/unused — distinct from ColumnID 1 |
| 8 | Source | Source | Unused in current layout |
| 9 | VTR | **Notes** | Sentence count + production notes |
| 10 | File | File | Unused in current layout |

**The trap:** `rc_update_row` (and the underlying API endpoint `setRowProperties`) accepts custom columns as parameters keyed by **ColumnID**, not by display name. From the API docs: `&3=VO` sets ColumnID 3. So `{"graphics": "..."}` becomes `&graphics=...` in the URL and gets silently dropped because the API doesn't know `graphics` as a parameter name. `{"1": "..."}` works because it maps to `&1=...`.

This is documented at https://www.rundowncreator.com/api/setrowproperties/ as the `(ColumnID)` optional parameter.

**Field-key rules:**

| Field | Pass as | Notes |
|---|---|---|
| Graphics | `"1"` | ColumnID required |
| Format | `"2"` | ColumnID required |
| Segment | `"3"` | ColumnID required |
| Last Line | `"4"` | ColumnID required |
| Notes | `"9"` | ColumnID required |
| StorySlug | `"StorySlug"` | Built-in field, name works |
| PageNumber | `"PageNumber"` | Built-in field, name works |
| EstimatedDuration | `"EstimatedDuration"` | Built-in field, name works |
| Break, Approved, Floated, Locked | by name | Built-in, name works (producer perms required) |

`rc_get_rows` returns these custom columns under lowercase aliases (`graphics`, `lastline`, `notes`). That is what the READ endpoint returns. The WRITE endpoint does not accept those names. The asymmetry is the trap.

**Mandatory verification:** after any `rc_update_row` touching a custom column, re-fetch with `rc_get_rows` and confirm the value persisted. Built-in fields (`EstimatedDuration` etc.) are reliable by name — verifying once at session start is enough.

## The Default Layout (LayoutID 1)

DRM has one group layout. Column order on screen:
```
StorySlug → Format → Graphics → Segment → Last Line → Notes →
EstimatedDuration → ActualDuration → FrontTime → BackTime
```
Sizes (pixels): `220, 93, 206, 155, 259, 132, 61, 59, 90, 90`

Columns 5–8 and 10 exist in the data model but aren't displayed. Don't write to them — they won't be visible and won't get used.

## The Template Rundown (RundownID 10)

`GSR Season 3 Run Of Show (1 Show)` is the working template. New monthly rundowns are copies of this. Default `EstimatedDuration` values from the template (use as fallback when no actual times exist):

| Row | Slug | Default est |
|---|---|---|
| B3 | Opening Monologue | 360 |
| C2 | Interview 1 | 780 |
| C9 | The Heavens Declare | 210 |
| C10 | Africa Promo | 30 |
| D3 | Kids' Corner | 180 |
| D4 | Genesis Science Q&A | 120 |
| E2 | Ministry Report | 180 |
| E7 | Viewer Voices | 120 |
| E9 | Featured Resource | 90 |
| E11 | Genesis Science Minute | 60 |
| E12 | Interview Tease | 30 |
| F2 | Interview 2 | 780 |
| F9 | Show Outro | 30 |
| 2 Minute Black Hole rows | — | 120 |
| WC Promo | — | 30 |

## Script templates (`<gfx>` is built-in)

DRM's script template list includes templates that use `<gfx>` tags as the canonical CG/graphic markup:

| ScriptTemplateID | Name | Content |
|---|---|---|
| 4 | 1 Line | `<gfx id="" filename="1line" line1="">` |
| 5 | 2 Line | `<gfx id="" filename="2line" line1="" line2="">` |
| 6 | Graphic | `<gfx id="" filename="">` |
| 7 | Audio Clip | `<audio id="" filename="" duration="0">` |
| 8 | Video Clip | `<video id="" filename="" duration="0">` |

So when scripts use `<gfx ...>` (even with informal descriptions inside the tag instead of `id=""`/`filename=""`), this is conforming to the system's own markup convention — not a free-form annotation. Treat the tag as the canonical machine-readable cue marker.

# Part 2 — Rundown Creator MCP and API

## MCP tools available

```
rc_list_rundowns           rc_list_folders        rc_list_layouts
rc_list_columns            rc_list_script_templates  rc_list_users
rc_get_rundown             rc_get_full_rundown    rc_get_rows
rc_get_script              rc_search_scripts      rc_rundown_timing_report
rc_create_rundown          rc_copy_rundown        rc_update_rundown
rc_delete_rundown          rc_insert_row          rc_update_row
rc_duplicate_row           rc_reorder_rows        rc_delete_row
rc_save_script             rc_ping
```

## Underlying API endpoints (when MCP is insufficient)

If the MCP wrapper is missing a capability, the raw API is at `https://www.rundowncreator.com/davidrives/API.php` with key/token auth. The account slug is `davidrives` (NOT `danielallen` — that's the APIKey value, easy to confuse). Don't store the APIToken in this skill or any persisted file. Read it from a session-only source (chat upload or a temp file the user deletes after) when raw API calls are needed.

Full method list:

**Folders:** getFolders, createFolder, renameFolder, deleteFolder
**Rundowns:** getRundowns, createRundown, **setRundownProperties** (rename/archive/lock/freeze/etc.), copyRundown, deleteRundown
**Rows:** getRows, insertRow, **setRowProperties** (the underlying call for `rc_update_row`), duplicateRow, deleteRow, reorderRows, startTimingRow
**Scripts:** getScript, saveScript (requires `ReadRate`)
**Objects:** getObjects, setObjectStatus (for the Objects column — graphic/clip status tracking)
**Chat:** getChatMessages, sendChatMessage
**Following:** amFollowing, followScript, unfollowScript
**Columns:** getColumns, **createColumn**, **renameColumn**, deleteColumn
**Layouts:** getLayouts, createLayout, setLayoutProperties, deleteLayout
**Users:** getUsers, createUser, setUserProperties, deleteUser
**Script Templates:** getScriptTemplates, createScriptTemplate, setScriptTemplateProperties, deleteScriptTemplate
**Search:** search (scripts for keywords)
**Trash:** getDeletedStuff, restore, permanentlyDelete, emptyTrash

Useful capabilities not currently exposed via MCP:
- `createColumn` / `renameColumn` — could rename the unused ColumnID 7 ("Graphic" singular) to something meaningful, or add a new column without leaving the account.
- `createLayout` / `setLayoutProperties` — could create an alternate layout (e.g. an Editor view that hides Bumper rows).
- `setObjectStatus` — could mark graphics/clips as ready/missing for production tracking.
- `createScriptTemplate` — could codify the simplified `<gfx>` cue style as a template (e.g. `<gfx category - subject>`).
- `search` — text search across all scripts for `<gfx Title Graphic>` / etc.

Reference: https://www.rundowncreator.com/api/

## `rc_update_row` / `setRowProperties` reference

Required: `RowID`.
Optional built-in (passed by name): `PageNumber`, `StorySlug`, `Break`, `Approved`, `Floated`, `Locked`, `EstimatedDuration`.
Optional custom column (passed as numeric key): any `(ColumnID)` from `rc_list_columns`.

Permissions: writer+ for most fields, producer+ for Break/Approved/Floated/Locked.

## `rc_save_script` / `saveScript` reference

Required: `RowID`, `Script`, `ReadRate` (talent's chars/sec — the MCP wrapper supplies a default; you don't typically need to pass it).

**Save rule for scripts containing `<gfx>` tags:** preserve literal `<gfx>` characters and `\n\n` paragraph breaks. The MCP returns a `ScriptID` for each save and prior versions stay in script history (recoverable from the UI). If you see `&lt;gfx&gt;` in the teleprompter after a save, the script was HTML-escaped — revert from history.

## `rc_insert_row` / `insertRow` reference

Required: `RowID` (the anchor).
Optional: `Mode` (`"Before"` or `"After"`, defaults to `"After"`).
Returns: new RowID.

After inserting, immediately follow with `rc_update_row` to set fields. Insert + update is two calls.

# Part 3 — GSR show structure

Every monthly episode follows the same block layout (matches Template RundownID 10). Each block ends with a 2-Minute Black Hole break.

```
B-block (Cold open + Monologue)
  B1  Opener Bumper In         pre-recorded
  B2  Show Intro               LIVE, ~45s
  B3  Opening Monologue        LIVE, parent script row, ~5-7 min
  B4-B14+  monologue graphics rows (add past B14 if needed)
  B15 Bumper out
  B16 WC Promo

C-block (Interview 1 + THD)
  C0  2 Minute Black Hole      break
  C1  Bumper In
  C2  Interview 1              LIVE, est 13 min, runs longer due to Q&A
  C3-C7  interview graphics rows
  C8  Segway To THD            LIVE, ~25-30s, (Ad Lib)
  C9  The Heavens Declare      pre-recorded
  C10 Africa Promo

D-block (Kids Corner + Q&A)
  D0  2 Minute Black Hole
  D1  Bumper In
  D2  Pitch to Kids Corner & Q&A    LIVE, ~20-30s
  D3  Kids' Corner             pre-recorded
  D4  Genesis Science Q&A      pre-recorded

E-block (Ministry + correspondents + GSM + tease)
  E0  2 Minute Black Hole
  E1  Bumper In
  E2  Ministry Report          LIVE, parent script row
  E3-E5  ministry graphics rows
  E6  Segway To Viewer Voices  LIVE, ~8-15s
  E7  Viewer Voices            pre-recorded (Gabe or Daniel reads)
  E8  Segway To Featured Resource   LIVE, ~15-25s, (Ad Lib)
  E9  Featured Resource        pre-recorded (Morgan or Ben presents)
  E10 Segway To GSM            LIVE, ~20-30s, (Ad Lib)
  E11 Genesis Science Minute   pre-recorded
  E12 Interview Tease          LIVE, ~30s — often blank until guest locked
  E13 Bumper out

F-block (Interview 2 + close)
  F0  2 Minute Black Hole
  F1  Bumper In
  F2  Interview 2              LIVE
  F3-F7  interview graphics rows
  F8  Closing Remarks          LIVE, ~13s
  F9  Show Outro               pre-recorded

G0 END OF SHOW                  break
```

## Graphics row convention

A parent live-script row (Opening Monologue, Ministry Report, occasionally interviews) carries the full script. Each `<gfx ...>` tag in the script gets its own row beneath it:

- **Graphics (col 1)**: simplified cue name from inside the `<gfx>` tag. Append `(reuse)` for reused graphics. Append `(ask david about audio)` for clip-audio uncertainty.
- **Format (col 2)**: VERBATIM copy of the Graphics Tracker's "Graphic Type" value. Never abbreviate or remap. For a reuse, copy the ORIGINAL graphic's Graphic Type.
- **Segment (col 3)**: repeat the parent segment name (`Monologue`, `Ministry Report`).
- **Last Line (col 4)**: see cardinal rule below.
- **Notes (col 9)**: sentence count as `~N sentences`.
- **EstimatedDuration**: 0 for static graphics; for `Clip w/audio` set to clip length so it's counted in show total. Parent row only counts the live read.
- **StorySlug stays BLANK** on graphic rows. Only the parent row (B3, E2) carries the segment name.

## The cardinal rule for `lastline`

**The lastline on row N is the spoken phrase that triggers the graphic on row N+1.** Every lastline is a cue for the NEXT row's graphic.

- **B3 / E2** (segment header): script lives here, no graphic fires → `lastline = blank`.
- **B4 / E3** (first graphic): `lastline` = phrase cueing **B5 / E4**'s graphic.
- **Final graphic row**: `lastline` = end-of-segment transition (often the sign-off like "I'm David Rives, and THIS is the Genesis Science Report").

Common error: writing the lastline for the CURRENT row's graphic. Always cue forward.

### Lastline shape

- 5-word minimum, unless it's a complete short sentence ("It's in the file." / "But here we are." — both fine).
- Fragments under 5 words: extend backward into the previous sentence to reach 5.
- Mid-sentence pickups: prefix with `...` (rare).
- Skip throat-clearing connectors at the start ("And so", "But", "Now", "Well") unless the line is a full short sentence ending in one.
- Match the script verbatim — punctuation, quotes, capitalization.

### Topical relevance beats B-roll air time

`<gfx>` positions in scripts are approximate; lastlines should be precise. Fire the next graphic when David starts talking about whatever motivates that visual. Cut a B-roll short if needed to keep the cue topically anchored. Split a sentence between two rows when a cue should fire mid-sentence.

### Notes (sentence count)

For row N: count from the moment row N's graphic fires (first sentence after its `<gfx>` tag) through and including the sentence ending with row N's lastline. Write as `~N sentences`.

# Part 4 — Graphics Tracker (Google Sheet)

## Where it lives

- Drive folder: `18RZ8UNF2nN67G6as-Uj5o5O3BbNFChoR`
- Naming pattern: `MM_GSR Graphics Tracking: [MONTH]` (e.g. `05_GSR Graphics Tracking: May`)
- One file per month, one tab per show (`Show 1`–`Show 5`), plus a `Claude Cache` tab (never touch).

## Sheet layout

| Col | Field | Notes |
|---|---|---|
| A | Segment | Pre-populated. Never touch. |
| B | Graphic # | Pre-populated. Never touch. |
| C | Graphic Type | One of the canonical Format values. |
| D | Description | Short. Include URLs and timestamps here (NOT in the script). No em dashes. Single quotes inside descriptions. |
| E | Status | `Not Started` by default. `Created` only when description begins with `PM` (pre-made). |
| F | Assigned To | `Isaac` for every monologue row. |
| G | Notes | Usually blank. |

- Headers on row 2. Data starts at row 3.
- Writes via Composio `GOOGLESHEETS_VALUES_UPDATE`, range `Show N!C2:G{end}` (include header row).
- Re-template clearing: clear `C3:G300` only. Never `C2:G300` — that wipes the headers.

## Canonical Graphic Type values

```
Title Graphic
B-roll
Pre-made: B-roll
Clip w/audio
Picture
Article Screenshot
Propres Quote
```

These are the only valid values. The rundown's `format` field (ColumnID 2) must copy whatever's in the Tracker's `Graphic Type` column verbatim.

## Tracker vs. Rundown

- **Tracker**: every UNIQUE graphic that needs to be created, in script order. Skip reuses.
- **Rundown**: every CUE POINT in script order, INCLUDING reuses (which still need to be triggered on air). For a reuse, populate `Graphics` with the cue name + `(reuse)` and copy the ORIGINAL graphic's Graphic Type into `Format`.

## Script order is the only criterion

First non-reuse `<gfx>` in the script → Tracker row 3. Second → row 4. And so on. Never reorder by type or importance. Title Graphic placement isn't fixed — David may open with a different cue. Whatever the script does, the Tracker mirrors. Same for the rundown.

## Title Graphic naming (when it's the opener)

- Graphic Type: `Title Graphic` (never `Intro Graphic`).
- Description: `Intro Graphic: '<episode title>'` (single quotes around title).

# Part 5 — Cue-name simplification (script-side)

`<gfx ...>` tags double as teleprompter cues. Simplification rules:

- `B-roll loop` / `Broll loop` / `B-roll` → `broll`
- `Propres Quote graphic` / `KJV propres graphic` → `propres`
- `Intro Graphic - X` / `Intro Graphic X` → `Title Graphic: X`
- Verbose subject lists → category name only (`Money & business broll`)
- Movie clips → film name + scene tag (`E.T. Flying Bike clip`, `2001: A Space Odyssey clip (Moon Monolith)`)
- `(reusable from earlier)` / `(reusable from prior segments)` → `(reuse)`
- Article screenshots → source + short tag (`BBC article screenshot: Geomagnetic reversal kill us all?`)
- Strip URLs entirely (URLs live in the Tracker, not on teleprompter)
- Strip long timestamps; keep short ones only if essential (e.g. `(0:00-0:18)`)
- No em dashes inside tags
- Target 5–8 words

Editing rules:
- Edit ONLY text inside `<gfx ...>` tags. Spoken text stays byte-for-byte identical.
- Preserve every paragraph break, blank line, whitespace.

# Part 6 — The canonical workflow (RD-GT prompts)

The user keeps three strict prompts in `RD-GT.zip` for monthly setup. Encoded conventions match this skill. When the user invokes one by name or pastes the prompt, follow it exactly.

1. **Populate Graphics Tracker** — extract unique `<gfx>` graphics from each show's B3 script and write to `Show N` tab. One row per unique graphic in script order, reuses skipped.
2. **Simplify Cue Names in Rundown Creator** — rewrite every `<gfx ...>` tag inside each B3 script using the simplification rules. Spoken text unchanged.
3. **Populate Monologue Row Fields** — for every monologue graphic row (B4+), set `graphics` (ColumnID 1), `format` (ColumnID 2, verbatim from Tracker), `lastline` (ColumnID 4, cues NEXT row), `notes` (ColumnID 9, `~N sentences`). Add rows past B14 if a monologue overflows.

Order matters: step 3's `format` depends on step 1's Graphic Type values being locked.

## Per-show vs. all-five

Default = "Do all 5 shows." If a single chat risks context limits — especially Task 3, the most tool-heavy — fall back to one show per chat: "Do only Show N of [MONTH]."

# Part 7 — Operations cookbook

```js
// List rundowns / find IDs
rc_list_rundowns()

// Read full state (every field on every row)
rc_get_rows({ rundownID: 82 })

// Re-confirm ColumnID map once per session
rc_list_columns()

// Read a script
rc_get_script({ rundownID: 82, rowID: 5120 })

// Save a script — <gfx> tags and \n\n breaks preserved
rc_save_script({ rundownID: 82, rowID: 5120, script: "..." })

// Set the four graphic-row fields (ColumnID keys!)
rc_update_row({
  rowID: 5151,
  fields: {
    "1": "GSR Now on iOS and Apple TV",
    "2": "Title Graphic",
    "4": "streaming live at genesissciencenetwork.com.",
    "9": "~5 sentences"
  }
})

// EstimatedDuration uses the name (built-in field)
rc_update_row({ rowID: 5267, fields: { "EstimatedDuration": 45 }})

// Clear a stale note
rc_update_row({ rowID: 5080, fields: { "9": "" }})

// Insert a new graphic row past B14
rc_insert_row({ rundownID: 79, afterRowID: <last current monologue rowID> })
// then immediately:
rc_update_row({ rowID: <newID>, fields: {
  "1": "...", "2": "...", "3": "Monologue", "4": "...", "9": "..."
}})

// Approve / freeze / lock rows (producer+ permission required)
rc_update_row({ rowID: 5145, fields: { "Approved": 1 }})

// Mandatory: verify dynamic-column writes
rc_get_rows({ rundownID: 82 })
```

# Part 8 — Failure-mode quick reference

| Symptom | Cause | Fix |
|---|---|---|
| `Success: 1` returned but field stays empty | Used column name instead of ColumnID for a custom column | Re-push with `{"1": "..."}` / `{"4": "..."}` / `{"9": "..."}` |
| Script body won't update | Used `rc_update_row` instead of `rc_save_script` | Use `rc_save_script` |
| `<gfx>` tags rendered as `&lt;gfx&gt;` in teleprompter | Script saved HTML-escaped | Revert from script history; re-save preserving literal `<gfx>` |
| `\n\n` showing up as `<br><br>` | Same — script was HTML-escaped on save | Same fix |
| EstimatedDuration won't update | Wrong casing | Must be exactly `EstimatedDuration` |
| Format value disagrees with Tracker | Skipped Tracker population or guessed | Look up Tracker's Graphic Type, copy verbatim into ColumnID 2 |
| Reuse missing from rundown | Treated rundown like the Tracker | Rundown includes reuses with `(reuse)` tag — only Tracker skips them |
| Lastline reads as if it cues current row's graphic | Conceptual error | Each lastline cues the NEXT row's graphic |
| Interview est duration looks way off vs actual | ActualDuration captured only the read, not Q&A | Don't sync; leave the planned ~780s |
| Stale "Time unknown / Gabe needs to edit" notes | Not cleared after edit landed | `rc_update_row(rowID, {"9": ""})` and verify |
| Tracker headers wiped | Cleared `C2:G300` instead of `C3:G300` | Repaste row 2 headers |

# Part 9 — Recommended workflow for any RD/Tracker task

1. Decide which system the task touches — Rundown (cueing), Tracker (creation), script (between).
2. If Tracker → Rundown: do the Tracker first so `format` values are authoritative.
3. `rc_list_rundowns` to find the rundown. `rc_get_rows` to read state.
4. If touching a custom column and column mapping isn't fresh in mind, call `rc_list_columns` once.
5. Make edits. **Custom columns → ColumnID keys. Built-in fields → name keys. Scripts → `rc_save_script`.**
6. `rc_get_rows` and visually verify every custom-column write.
7. Report results: rows touched, fields set, verification status, any edge cases flagged.

# Edge cases — flag, don't silently decide

- Back-to-back graphics with shared voiceover (no spoken text between two `<gfx>` tags): use the prior cue line on the earlier row, flag the pair.
- Graphic at the very start of the script before any spoken text: no preceding line exists — flag it.
- Ambiguous audio status: append `(ask david about audio)` to the graphics field and flag it.
- Graphic in the script but not in the Tracker: flag it. Don't guess a format value.
