# ProPresenter Library Conventions (SSD backup scan)

<!-- Source: /Volumes/Misc Storage Volume/ProPresenter (local APFS backup, /dev/disk11s1). Read-only metadata scan. Single source = propres_ssd. Parser: generic PP7 protobuf wire-walk + RTF strip; all 231 .pro decoded via protobuf (zero strings-fallback). Verbatim text; nothing fabricated. -->

## Naming conventions

GSR presentations follow a strict, machine-parseable token grammar (underscore-joined, mostly UPPER):

```
{MONTH?}_SHOW_{LETTER}_{SEGMENT}_{TYPE}
```

- **MONTH** (optional) — `FEBRUARY`, etc. PRESENT only on dated/archived sets. The current-season working presentations carry NO month prefix (e.g. `SHOW_A_INTERVIEW_1_L3RDS`). Month-prefixed = a past taping kept for reference.
- **SHOW_{LETTER}** — `SHOW_A` … `SHOW_E`. This is the **recording-slot letter for a taping block**, NOT an episode number. Multiple shows are taped per session (A–E). There is no reliable in-file mapping from SHOW letter to `S03E0NN`; that join must come from the scheduling sheet (T-DRIVE) during reconciliation. **Every inventory row therefore has `episode_uid` blank + `needs_human=true` by design** — a wrong guess would poison the import.
- **SEGMENT** — observed tokens and their GSR meaning:
  - `OPENING_MONOLOGUE` → segment `monologue`
  - `INTERVIEW_1`, `INTERVIEW_2` → `interview_1` / `interview_2`
  - `GSM` (Genesis Science Minute), `HEAVENS_DECLARE`, `MINISTRY_UPDATE` → `ministry`
  - `FEATURED_RESOURCE`, `KIDDY_CORNER`, `COMMERCIAL_PROMO`, `CLOSING` (Closing_Comments) → `other`
- **TYPE** — the presentation's role:
  - `L3RDS` / `L3RD` / `LOWER_THIRDS` — the aired lower-third text slides (the key deliverable)
  - `SPLITSCREEN` — host/guest split layout for interviews
  - `TITLE` — segment title card (`Title Graphic` in GSR/RC parlance)
  - bare videos: `BUMBER_IN`/`BUMBER_OUT` (sic — spelled "BUMBER" in-library), `Intro_Video`, `Outro`, `Outro_loop`, `*_COMMERCIAL_PROMO_*`

Shared/global assets use `ALL_SHOWS_SHARED_ASSETS`, `SHARED_SHOW_AD_SEGMENT`, `GSR_L3RD_BACKGROUND`, `L3 BG`. Generic legacy presentations also exist with title-case names (`Lower Thirds`, `Lower Thirds Alt 1..5`, `LOWER THIRD`) — these predate the SHOW_x grammar.

A trailing `-N` suffix (`...-1`, `Splitscreen-3`, `TRANSITION_INTERVIEW_1-6`) is ProPresenter's auto-rename for a duplicate import, NOT an intentional variant. 18 such files exist.

## Library / playlist organization

Seven top-level libraries under `Libraries/` (231 .pro total):

| Library | .pro | Role |
|---|---|---|
| GSR_LIBRARY | 201 | **The show.** All GSR segment presentations, L3RDS, splitscreens, titles, bumpers. Priority for aired lower-thirds. |
| GAP26 | 10 | "GAP '26" event/conference graphics (state ambassadors, QR-code book offers). Avenir font family. |
| UNWRAPPED_LIBRARY | 6 | "UNW" show — separate program (UnderWorld font, UNW_L3RDS/UNW_OPENER). |
| WWN_LIBRARY | 6 | Separate program. |
| CTN_LIBRARY | 4 | "CTN" show assets/L3RDs (Atlanta-Book / MuskegonCF fonts). |
| THD_GSN_FAILOVER_LIBRARY | 2 | GSN broadcast failover content (THD = The Heavens Declare). |
| Default | 1 | ProPresenter default/empty. |

One stray `.pro` lives under `Playlists/` (not a library). Media is stored separately under `Media/{Assets,Downloads,Imported}` (2,488 files on disk); presentations reference media by `file:///…` URL or relative path.

## Text encoding (for the importer)

L3 RTF text inside the `.pro` is stored in **Windows-1252 (CP1252)**, using RTF `\'XX` hex escapes for typographic characters: em-dash `\'97` (—), en-dash `\'96` (–), smart single quotes `\'91`/`\'92` (' '), smart double quotes `\'93`/`\'94` (" "), ellipsis `\'85` (…). 134 such escapes appear across GSR L3RDS files. **These are already decoded to real UTF-8 characters in `propres_aired_lower_thirds.csv`** (the parser resolves `\'XX`→CP1252→UTF-8 and any `\uN` escapes before stripping RTF), so the CSV is clean UTF-8 — no further transcode needed on import. 114 L3 fields carry these real characters. (If a future re-scrape skips the decode step, the artifact looks like `PURPOSE'97CREATION` — a literal `'97` — which is the tell.)

## Lower-third & title template patterns

The aired GSR lower-third is a **two-line stack** built from a looping video background:

- **Line 1** — brand/segment header in **Colaborate-Bold**, smaller point size (~fs29 RTF half-points → ~29pt). Examples seen verbatim: `GENESIS SCIENCE REPORT`, `GSR One-on-one`, `Genesis Science Report`.
- **Line 2** — the actual lower-third copy in **Colaborate-Regular**, larger (~fs49–58). ALL-CAPS, cable-news cadence. Verbatim examples pulled from `SHOW_A_INTERVIEW_1_L3RDS` / `SHOW_A_GSM_L3RDs`:
  - `WHAT LIVING ANIMALS SUGGEST ABOUT GIANT REPTILES`
  - `SLOWER GROWTH FITS LARGE BODY SIZE PATTERNS`
  - `LOOKING AT HOW SCRIPTURE AND SCIENCE POINT TO THE SAME TRUTH`
  - `TOOLS AND RESOURCES THAT HELP US THINK CLEARLY`

Background video element: `GSR_2025_L3rd_Curved_Text_Box_FULL_Looping_v09_…_4K_2997_PreMultiplied.mov` (current) / `GSR_2024_L3rd_Text_Box_Looping_v05…` (prior year). Transitions: `Fade` / `Dissolves`.

Standing "house" lower thirds (the give/credentials slides) also appear: `GENESIS SCIENCE REPORT` / `Davidrives.com/give | 931-212-7990 | 501C3 Non-Profit`.

**Caveat on template geometry:** `position` (x/y/anchor) and `safe_area` are NOT recoverable from string-level protobuf parsing — those live in numeric layout sub-messages this read-only string-walk doesn't decode. `propres_templates.csv` therefore carries `position=x=;y=;anchor=lower_third` (placeholder) with `needs_human=true`; font / font_size / color / line_count ARE captured verbatim and are high-trust. If exact geometry is needed, it requires the official PP7 .proto schema or opening the file in the app (out of scope here).

## Old / archived vs current-season (flagged)

- **CURRENT-SEASON working templates:** bare `SHOW_A..E_*` (no month prefix). Use these as clone sources.
- **DATED / archived:** the 11 `FEBRUARY_*` presentations — a past taping block, kept for reference. Do NOT clone these for a new episode.
- **TEST artifacts:** `TEST_SHOW_QA_SPLITSCREENS`, `TEST_SHOW_VIEWER_VOICES_SPLITSCREEN`, `TEST_Closing_Comments_L3RDs`, `TestWonders001` — scratch/test, exclude from production clone.
- **Duplicate-import artifacts (`-N` suffix):** 18 files. 7 presentation "stems" have >1 copy on disk. Candidates for cleanup; treat the un-suffixed (or lowest-suffix current-season) copy as canonical.
- **Legacy generic L3s:** `Lower Thirds`, `Lower Thirds Alt 1..5`, `LOWER THIRD` — predate the SHOW_x grammar; likely superseded by the per-segment `*_L3RDS` presentations.

## RECOMMENDATION — new-episode build clone

For a new GSR episode taping (one SHOW slot), clone the **current-season, un-prefixed `SHOW_A_*` set** from `GSR_LIBRARY` as the template skeleton:

1. `SHOW_A_OPENING_MONOLOGUE_TITLE` + `_L3RD` + `_SPLITSCREEN` (monologue)
2. `SHOW_A_INTERVIEW_1_L3RDS` + `_SPLITSCREEN`
3. `SHOW_A_INTERVIEW_2_L3RDS` + `_SPLITSCREEN`
4. Ministry block: `SHOW_A_GSM_L3RDs` / `SHOW_A_HEAVENS_DECLARE` / `SHOW_A_MINISTRY_UPDATE_L3RD`
5. `SHOW_A_FEATURED_RESOURCE_L3RDS`, `Closing_Comments_L3RDs`
6. Shared: `ALL_SHOWS_SHARED_ASSETS`, `GSR_BUMBER_IN`/`OUT`, `GSR_L3RD_BACKGROUND`

Keep font = **Colaborate-Bold (line 1) / Colaborate-Regular (line 2)** to match aired look — both confirmed installed-matching. Reuse the existing `GSR_2025_L3rd_Curved_Text_Box_FULL_Looping_v09` background loop. Replace only the line-2 RTF text per the approved graphics list; leave geometry untouched (clone preserves it). Do NOT base a new build on `FEBRUARY_*`, `TEST_*`, or `-N` duplicate files.

## Convergence / gaps report

- **Presentations (.pro) scanned:** 231 across 7 libraries + 1 stray playlist file. **100% decoded via protobuf** (0 required strings-fallback).
- **Inventory rows:** 231. Types: 75 lower_third, 65 presentation, 59 splitscreen, 26 video, 6 title.
- **Aired lower-third line-pairs (GSR_LIBRARY L3RDS only):** 462 rows, text captured verbatim.
- **Templates profiled:** 70 (L3RD/LOWER/TITLE presentations with text elements).
- **Media:** 324 unique referenced files — 304 located + SHA-256 hashed on the SSD (high), 20 referenced from an external volume (`/Volumes/T7 ProTools/…`) not present on this backup (low / needs_human). 64 framing-byte ref artifacts collapsed to canonical files; 10 content-duplicates deduped by hash.
- **Fonts:** 14. Colaborate family (Bold/Regular/Medium/Thin) confirmed as dashboard-matching; HelveticaNeue, Avenir, Atlanta-Book, MuskegonCF, UnderWorld, Futura, Satoshi, Helvetica-Bold flagged `needs_human=true` to verify installation in the dashboard font-editor.

**Gaps / could-not-map (for reconciler):**
1. **episode_uid unmapped on ALL 231** — by design. SHOW letter ≠ episode number; needs the scheduling-sheet join (T-DRIVE). Reconciler should key SHOW-letter + month + air_date.
2. **Template geometry (x/y/anchor, safe_area)** — not recoverable from string-level parse; placeholder + needs_human. Requires PP7 .proto or the app.
3. **20 external-volume media refs** — live on `T7 ProTools`, absent from this SSD backup; flagged, not hashed.
4. **18 `-N` duplicate-import files / 7 duplicated stems** — candidates for library cleanup.
5. **TEST_* presentations** — scratch; exclude from production.
