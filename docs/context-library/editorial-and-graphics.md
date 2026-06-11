# Editorial & graphics

**Load when:** placing graphics on a script, Pass-1/Pass-2 graphics, b-roll/sourcing, lower-thirds, the graphics page, monologue cues, voice/copy.
**Authoritative sources:** `.claude/skills/gsr-graphics-sourcing/SKILL.md` (the method), `docs/2026-06-09-monologue-graphics-extraction-spec.md` (Pass-1), `docs/2026-06-09-graphics-tracker-archive-reference.md` (libraries/sourcing), the Drive `GSR_Lower_Thirds_Worksheet` + `GSR_Ministry_Report_Lower_Thirds`.

## Entries
### 2026-06-11 — Graphics archive is distributed, not consolidated (durable map)  [status: active]
Finding: there is NO single master graphics file. The full corpus (~1,700 graphics — the "1000+ entries" Daniel remembers) is the union of monthly trackers across TWO Drive folders. Read any of them — `.xlsx` or Google Sheet — with the Drive MCP `read_file_content(fileId)` (returns all cells as text); do NOT use `download_file_content`/openpyxl.
- **Season 2 — Graphics Tracking** (folder `18bTNHG-X7PNdzWarJ7gkQA77Qdol1XuQ`, in `GSR-Archive/season_2/`). **FROZEN — Season 2 is closed, these are stable:** Aug `1Gs66EWCIHnOmEgeTsGBnzWxOyH2fDsvC`, Sep `17hNrfrym4JbayceyKg6Agz4MruLpG5jc`, Oct `1XF98MU8AK3MUeQpbk_YB1Uz_BoXJmzzz`, Nov `1LzHw9dmC58HetsSa4K_GgbFVQgib25Hb`. Each holds ~5 shows + bonus interview tabs (.xlsx).
- **Season 3 — Graphics Tracking** (folder `18RZ8UNF2nN67G6as-Uj5o5O3BbNFChoR`). **LIVE — re-list the folder to see current state; do NOT trust a cached blank/filled flag.** Known IDs: Mar `1iGx1vQGKd1saSQuIBkBkc9IIT8oDwUZuOFH1jv5PHew`, Apr `1-m8RQe8yTvmlWOkCytB6Hd5BGpkIXMj-I8gXLHHgcSQ` (owner accounts@davidrives.com), May `1GmdVDOP4h0k6FmOdZLMJNroz7_x4xDcErBYmdGU0890`.
- **Pre-made / reusable-asset catalog:** `17SCo5bqAcPEGl5dyWpNI6b3WlET0YbFhfzu-wrdeUZM` (GSR Pre-made Library, Jan–May ref).
**Volatile (do not cache as fact):** which Season 3 months are blank vs. populated, and exact row/graphic counts. **Durable:** the two folder IDs, the Season 2 file IDs, and the read method.
Why it matters: the scattered state is the gap the dashboard closes — Supabase `graphics` = 0 rows; consolidating this corpus into it is the Stage-7 milestone.
Source: live Drive scan (2026-06-11)
Decision: the whole script is covered by contiguous graphic spans; each graphic owns sentences from its cue to the one before the next; that last sentence = the RDC "Last Line"; deadspace is the TD's call, not the default. Choose broad, recyclable b-roll that holds 4+ sentences; a one-sentence graphic isn't worth it; for a named subject, hold a dedicated graphic only if the next 3-4 sentences sustain it. Provide SPECIFIC asset links, not site-search links; keywords for b-roll.
Source: Daniel (2026-06-11)

### 2026-06-09 — "Intro Graphic" is the standard cue-#1 type  [status: active]
Decision: standardize the first graphic's type as "Intro Graphic" (not "Title Graphic") across the pipeline.
Source: Daniel (2026-06-09)

### 2026-06-09 — No-audio clip = B-roll  [status: active]
Decision: a clip with no audio is classified B-roll (note "silent/under VO"); priority is one standardized vocabulary. Set: Intro Graphic, Clip w/audio, B-roll, Pre-made: B-roll, Picture, Article Screenshot, Propres Quote, Propres Graphic, Graphic, Book Cover, Roll-in.
Source: Daniel (2026-06-09)

### 2026-06-09 — Pass-1 cue rules  [status: active]
Decision: extract David's cues from the Basecamp vault doc (not RDC, which strips them); parse `<a href>` first (links hide mid-sentence); "Picture this:" is a cue ONLY if a marker/link follows; scripture+ref = Propres Quote; FACT/section headers = Graphic; never invent a cue.
Source: Daniel (2026-06-04..09)

### 2026-05-20 — Lower thirds are a SEPARATE system from graphics  [status: active]
Decision: lower thirds live on their own page/worksheet, NOT the graphics page. Structure: per monologue, a fixed "DAVID'S TAKE: ___" flag + 15 named beats, each with 3 variations (A/B/C); headlines 55-65 chars, flags ≤32. Graphics may need to align to these same 15 beats. (Open question below.)
Source: GSR_Lower_Thirds_Worksheet (2026-05-20)

## Open questions (need Daniel)
- **The "key rule from the decision worksheet" I missed (graphics-relevant).** Found both lower-thirds worksheets; could not locate a separate graphics decision worksheet. Strongest candidate: graphics spans should map to the worksheet's 15 named beats. Awaiting Daniel to confirm the rule or point to the doc.
