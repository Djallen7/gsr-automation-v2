# RC Structure Map

Source: rundown-creator MCP (David Rives Ministries account, slug `davidrives`). Read-only. Captured 2026-05-30.

## Source & method

- `rc_list_columns` — the 10 custom columns (ColumnID + name). Returned full, no timeout.
- `rc_list_rundowns` — 68 rundowns enumerated. Returned full, no timeout (the known `rc_list_*` timeout did not occur this session).
- `rc_get_rows(RundownID 10)` — the GSR template (empty skeleton), 56 rows.
- `rc_get_rows(RundownID 79)` — a real populated episode ("May Show 1 | S03_Ep021"), 63 rows.
- `rc_get_script(RowID 5003)` HTML + plainText, and `rc_get_script(RowID 5028)` HTML + plainText — to resolve where `<gfx>` cues live.

All structural values copied verbatim. No writes to RC. Companion files: `rc_columns_map.json`, `rc_rundown_map.json`.

## Column ID table (the renamed-columns trap)

ColumnID is the stable write key. Display names were renamed in this account; the IDs did not change. `rc_get_rows` READS columns back under lowercase aliases; the WRITE endpoint (`rc_update_row` / `setRowProperties`) accepts **ColumnID numeric keys only** — passing the alias name silently drops the write.

| ColumnID | Live name (rc_list_columns) | Read alias | Write key | Used | Role |
|---|---|---|---|---|---|
| 1 | Graphics | graphics | `"1"` | yes | Cue description / simplified `<gfx>` text |
| 2 | Format | format | `"2"` | yes | Asset type, verbatim from Tracker Graphic Type |
| 3 | Segment | segment | `"3"` | yes | Repeats parent segment name |
| 4 | Last Line | lastline | `"4"` | yes | Phrase that cues the NEXT row's graphic |
| 5 | Camera | camera | `"5"` | no | Unused in current layout |
| 6 | Effect | effect | `"6"` | no | Unused |
| 7 | Graphic | graphic | `"7"` | no | Legacy/unused, distinct from ColumnID 1 |
| 8 | Source | source | `"8"` | no | Unused |
| 9 | Notes | notes | `"9"` | yes | Sentence count (`~N sentences`) + notes |
| 10 | File | file | `"10"` | no | Unused |

FLAG (discrepancy): the `rundown-creator` skill documents the API-DEFAULT names for IDs 1/2/4/9 as Writer/Editor/Talent/VTR. The LIVE `rc_list_columns` `Name` field returns the DRM display names (Graphics/Format/Last Line/Notes) directly. The ColumnIDs are the invariant either way; the skill's default-name table is the pre-rename API baseline, not what the account returns today. Reconciler should key on ColumnID, not name.

## Row object shape (structural / column-field / flag keys)

Each row object from `rc_get_rows` carries:

- Structural: `RowID`, `RundownID`, `Position`, `PageNumber`, `StorySlug`
- Column fields (lowercase read aliases of ColumnIDs 1-10): `graphics`, `format`, `segment`, `lastline`, `camera`, `effect`, `graphic`, `source`, `notes`, `file`
- Flags / durations: `Break`, `ScriptHasContent`, `Approved`, `Floated`, `Locked`, `Following`, `EstimatedDuration`, `ActualDuration`, `Deleted`

`Position` increments by 10. `PageNumber` is the block grid (B0..B17, C0..C14, D0..D4, E0..E13, F0..F9, G0). `EstimatedDuration`/`ActualDuration` are seconds. Built-in fields (`StorySlug`, `PageNumber`, `EstimatedDuration`, `Break`, `Approved`, `Floated`, `Locked`) are keyed by NAME on writes; only the custom columns hit the trap.

## Template segment flow (RundownID 10 — empty skeleton)

`GSR Season 3 Run Of Show (1 Show)`, Template=1, Archived=0, 56 rows. New monthly shows are copies of this. Block layout, each block ending in a 2 Minute Black Hole break:

- B-block (cold open + monologue): B0 SHOW 1 (break), B1 Opener Bumper In, B2 Show Intro (LIVE), B3 Opening Monologue (LIVE, segment=Monologue, est 360), B4-B14 monologue graphic rows (blank in template), B15 Bumper out, B16 WC Promo (est 30).
- C-block (Interview 1 + THD): C0 2 Minute Black Hole (break, 120), C1 Bumper In, C2 Interview 1 (LIVE, est 780), C3-C7 interview graphic rows, C8 Segway To THD (LIVE), C9 The Heavens Declare (pre-rec, 210), C10 Africa Promo (30).
- D-block (Kids Corner + Q&A): D0 2 Minute Black Hole (break, 120), D1 Bumper In, D2 Pitch to Kids Corner & Q&A (Live), D3 Kids' Corner (pre-rec, 180), D4 Genesis Science Q&A (pre-rec, 120).
- E-block (Ministry + correspondents + GSM + tease): E0 2 Minute Black Hole (break, 120), E1 Bumper In, E2 Ministry Report (LIVE, segment=Ministry Report, est 180), E3-E5 ministry graphic rows, E6 Segway To Viewer Voices (LIVE), E7 Viewer Voices (pre-rec, 120), E8 Segway To Featured Resource (LIVE), E9 Featured Resource (pre-rec, 90), E10 Segway To GSM, E11 Genesis Science Minute (pre-rec, 60), E12 Interview Tease (LIVE, 30), E13 Bumper out.
- F-block (Interview 2 + close): F0 2 Minute Black Hole (break, 120), F1 Bumper In, F2 Interview 2 (LIVE, est 780), F3-F7 interview graphic rows, F8 Closing Remarks (LIVE, segment=Show Outro), F9 Show Outro (pre-rec, segment=Show Closer, 30).
- G0 END OF SHOW 1 (break).

In the template, the B4-B14 / C3-C7 / E3-E5 / F3-F7 graphic rows exist but `graphics`/`format`/`lastline`/`notes` are all blank — the skeleton, not the fill.

## Real populated episode (RundownID 79 — May Show 1 | S03_Ep021)

Template=0, Archived=0, FolderID=2, 63 rows, TotalRunningTime 1625s. Same block layout as the template, now FILLED. Full verbatim rows are in `rc_rundown_map.json` (`sample_rows`). What changes between template and real show:

- The B4+ monologue graphic rows are populated: `graphics` = cue name, `format` = asset type, `lastline` = the trigger phrase, `notes` = `~N sentences`.
- This episode's monologue overflowed past B14 — graphic rows run B4-B15 (a B17 WC Promo now exists; rows were inserted, RowIDs are non-contiguous e.g. 5325, 5292, 5296 interleaved with the original 50xx).
- LIVE rows carry real `ActualDuration` (Show Intro 45, Segway To THD 25, Ministry Report 177, Closing Remarks 13).
- `Floated=1` appears on real rows (pre-records, breaks, and the unused Interview 2 graphic rows F3-F7) — a live-production toggle absent from the template.
- Interview 1 graphic rows (C3-C11) and Interview 2 (F2) are populated here, unlike the template.

Asset-type (`format`) values observed in this real episode: `LIVE`, `Live`, `Pre-Recorded w/audio`, `Title Graphic`, `Article Screenshot`, `B-roll`, `Picture`, `Propres Quote`, `Clip w/audio`, `Pre-made: B-roll`, `Graphic`, and blank (on break/structural rows). Note `Graphic` (E4/E5) and `Live` (D2) appear alongside the canonical set — see uncertainties.

## How graphics cues appear in live rows

RESOLVED definitively by reading BOTH forms of the script:

- `rc_get_script(RowID 5003)` HTML (default) — the Opening Monologue body contains 14 literal inline `<gfx ...>` tags, each placed immediately before the spoken text it accompanies. Examples (verbatim): `<gfx UAP montage Broll clip (0:00-0:18)>`, `<gfx Title Graphic: Eyes Fixed on Things Above>`, `<gfx war.gov/ufo screenshot>`, `<gfx Colossians 3:1-2 propres>`, `<gfx war.gov/ufo screenshot (reuse)>`.
- `rc_get_script(RowID 5003)` plainText=true — the SAME prose with EVERY `<gfx>` tag STRIPPED OUT. This is why an initial plainText-only read looked tag-free.
- Confirmed again on the Ministry Report (RowID 5028): HTML body has `<gfx WONDERS OF CREATION CONFERENCE>`, `<gfx AMERICA'S GOSPEL MUSIC | SUNDAYS 6 AM | WSM 650 NASHVILLE>`, `<gfx DONATE: DAVIDRIVES.COM | 931-212-7990>`; plainText strips them.

Conclusion: `<gfx ...>` tags live in the SCRIPT HTML BODY of the parent LIVE rows (Opening Monologue B3, Ministry Report E2). They are NOT in the plainText form, and they are NOT stored in a row field. Each `<gfx>` tag is then MIRRORED as its own cue row beneath the parent (B4+, E3+), where the simplified tag text goes in the row's `graphics` field, the asset type in `format`, the cueing phrase in `lastline`, the sentence count in `notes`. So cues are BOTH authored inline in the HTML script AND reflected in row fields — the script is the source, the rows are the on-air cue mirror.

Practical implication (matches CLAUDE.md "only modify text inside `<gfx...>` tags"): edits to cue names happen in the HTML script via `rc_save_script` (preserving literal `<gfx>` and `\n\n`; HTML-escaping to `&lt;gfx&gt;` is a known failure), and the row fields are set separately via `rc_update_row` keyed by ColumnID.

## Field-key write guidance (use column IDs, not names)

- Custom columns → numeric ColumnID string keys: Graphics `"1"`, Format `"2"`, Segment `"3"`, Last Line `"4"`, Notes `"9"`. Passing `"graphics"`/`"lastline"`/`"notes"` returns success but silently drops the value.
- Built-in fields → name keys: `StorySlug`, `PageNumber`, `EstimatedDuration` (exact casing), `Break`, `Approved`, `Floated`, `Locked` (last four need producer+ perms).
- Scripts (including `<gfx>` bodies) → `rc_save_script`, never `rc_update_row`.
- Mandatory: after any custom-column write, re-fetch with `rc_get_rows` and confirm persistence.

## Timeouts / gaps / uncertainties

- TIMEOUTS: none this session. `rc_list_columns` and `rc_list_rundowns` both returned full. (The README/CLAUDE.md warn `rc_list_*` frequently times out — it just didn't today. Reconciler should not assume the list endpoints are always reliable.)
- `format` value variants flagged, NOT normalized (verbatim capture): the skill's canonical Graphic Type set is Title Graphic / B-roll / Pre-made: B-roll / Clip w/audio / Picture / Article Screenshot / Propres Quote. Real RID 79 ALSO contains `Graphic` (rows E4 5036, E5 5035) and `Live` lowercase (D2 5057), plus `LIVE` and `Pre-Recorded w/audio` on structural rows. `Graphic` is not in the canonical Tracker set — left verbatim for the reconciler to decide (do not guess a remap).
- `current_season3_episodes` id-vs-title ordering anomaly (verbatim, flagged): RundownID 82 is titled "May Show 4 | S03_Ep024" and 83 is "May Show 3 | S03_Ep023" — the id order (82<83) is inverted vs show/episode order. Captured as-is.
- RundownIDs 77 and 78 have `DefaultLayoutID = -1` (verbatim) where others have 1 — captured, not interpreted.
- Trailing whitespace preserved verbatim where present in source (e.g. RID 79 row 5034 graphics = "Wonders of Creation Conference ").
- Did NOT enumerate folders/layouts/users/script-templates via their `rc_list_*` endpoints (out of scope for Prompt E and to avoid the timeout risk). The skill documents FolderID 1 and 2 are in use, LayoutID 1 is the default group layout, and ScriptTemplateIDs 4-8 define the `<gfx>`/`<audio>`/`<video>` markup — recorded here for reference but not independently verified this session.
- Read only the May Show 1 monologue (5003) and ministry (5028) scripts as samples; other shows' scripts not read (Prompt E = structure map, not script dump).
