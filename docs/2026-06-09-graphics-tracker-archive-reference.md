# Graphics Tracker Archive — Location + Reusable-Pattern Library (for Pass 2)

Date: 2026-06-09. Read-only. Source: Google Drive, folder **"Graphics Tracking"**
(`18RZ8UNF2nN67G6as-Uj5o5O3BbNFChoR`), owner danielallen.tn@gmail.com.

## Tracker file inventory (Season 3)
| Month | Drive file ID | Size | State |
|---|---|---|---|
| **May (Ep021–025)** | `1GmdVDOP4h0k6FmOdZLMJNroz7_x4xDcErBYmdGU0890` | **2.3 MB** | **Fully populated — the historical archive** |
| March | `1iGx1vQGKd1saSQuIBkBkc9IIT8oDwUZuOFH1jv5PHew` | 28 KB | Populated (lighter) |
| **June (Ep026–030)** | `13_PQdT3RKCodjA_FzRxwpQR6yA1Kn8E5sKxN9VWPAJs` | 32 KB | **Blank template — Pass-2 target** |
| July–December (07–12) | templates in same folder | 32 KB ea. | Blank |
**Correction (2026-06-11):** an `04_`/April Season-3 sheet DOES exist
(`1-m8RQe8yTvmlWOkCytB6Hd5BGpkIXMj-I8gXLHHgcSQ`, owner accounts@davidrives.com).
And Season 2 survives as fully-populated `.xlsx` trackers — folder
**"Season 2 - Graphics Tracking"** (`18bTNHG-X7PNdzWarJ7gkQA77Qdol1XuQ`, under
`GSR-Archive/season_2/`): Aug `1Gs66EWCIHnOmEgeTsGBnzWxOyH2fDsvC`, Sep
`17hNrfrym4JbayceyKg6Agz4MruLpG5jc`, Oct `1XF98MU8AK3MUeQpbk_YB1Uz_BoXJmzzz`,
Nov `1LzHw9dmC58HetsSa4K_GgbFVQgib25Hb` — not just the `gold_corpus` text dumps.
The full ~1,700-graphic archive is the union of these monthly trackers across both
seasons; there is no single consolidated master file. Read any with the Drive MCP
`read_file_content(fileId)` (handles `.xlsx` and Sheets), not `download`/openpyxl.

Tab/column shape (matches GSR-WORKFLOW-CANON §4): one tab per show; each segment block
is `Segment | Graphic # | Graphic Type | Description | Status | Assigned To | Notes`.
Opening Monologue runs up to 20 numbered rows; #1 is the Title Graphic. (The sheet's
last tab is reserved for `=CLAUDE…` functions — do not edit.)

## How Isaac actually expanded David's Pass-1 cues to 8–15 (observed in May)
This is the Pass-2 playbook, verbatim from the archive:
1. **Title Graphic is always #1** ("Intro Graphic: '<monologue title>'").
2. **Keep the most iconic clip(s) David linked as `Clip w/audio` — but PRUNE the rest.**
   Ep023 is the tell: David linked 3 movie clips (Moonraker, Despicable Me, Simpsons);
   Isaac kept only the Simpsons clip and replaced the other two with generic reusable
   loops. Don't slavishly use every link.
3. **Convert topic beats into named, REUSABLE B-roll loops** (generic over specific,
   reusable over one-off — the §4 philosophy).
4. **Sourced `Picture` for specific named people/places/objects;** `Article Screenshot`
   for cited studies/headlines; `Propres Quote` for scripture and quoted authorities;
   `Pre-made: B-roll`/`Pre-made: Graphic` pulled from the ProPresenter library as filler.
5. **Never leave an empty slot.**

## Reusable B-roll loop library (already built/used in May — reuse, don't re-source)
Generic, CC0 (Pexels/Mixkit, no attribution) unless noted:
- **Money & business** loop (cash, stock tickers, boardrooms, skyline) — used Ep023 + Ep024
- **Government & policy** loop (flags, gov buildings, signed docs, hearings, gavels) — Ep023
- **Earth & weather** loop (earth from space, weather patterns, global maps) — Ep023
- **Climate science & research** loop (lab work, charts, climate data) — Ep024
- **Ice & glaciers** loop — Ep024
- **Energy & infrastructure** loop (wind turbines, solar panels, power plants, grids) — Ep024
- **Wealth & lifestyle** loop (private jets, luxury homes, oceanfront) — Ep024
- **Sun & space radiation** loop (solar flares, solar wind, aurora) — Ep025
- **Earth's interior & magnetic field** loop — Ep025
- **Earth–moon system** loop — Ep022
- **Sky & atmosphere** loop — Ep023

## ProPresenter "PM" pre-made library (pull from ProPres, ZERO sourcing time)
PM Astronomy · PM lunar surface · PM moon · PM galaxy · PM galaxy 2 · PM Earth from
space · PM Scientist in lab · PM Microscope · PM Bacteria · PM Geology · PM Post-Flood ·
PM Protest · PM Earth's magnetic field (Pre-made: Graphic).

## License discipline (carry into every Pass-2 suggestion)
- **CC0 (Pexels, Mixkit):** no attribution — default for generic B-roll loops.
- **Public domain (NASA, USGS, NIH/NEI):** on-screen credit (e.g. "NASA/JPL-Caltech").
- **CC BY / CC BY-SA (Wikimedia):** ON-SCREEN CREDIT REQUIRED (photographer / Wikimedia / license).
- **Fair use editorial:** article screenshots, book covers, film posters.

## Ready for Pass 2
With this archive + the §B teleprompter/cue list from
`2026-06-09-june-monologues-pass1-reformat.md`, I can fill Ep026–030 to 8–15 graphics
each: reusable loops and PM library first, sourced public-domain/Wikimedia pictures and
article screenshots next, and motivated AI-generation only where stock/public-domain
genuinely can't deliver (Ep027's three extinct creatures — Kostensuchus, Daeodon,
Foskeia — being the clearest case).
