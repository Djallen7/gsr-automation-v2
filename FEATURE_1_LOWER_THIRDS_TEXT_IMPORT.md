# Feature 1: Lower-Thirds Text Import — Canonical Path

**Status:** Canonical (as of 2026-05-27 decision: lower-thirds are text-only forever).
**Supersedes:** `FEATURE_1_BOOTSTRAP_IMPORT.md` (kept for historical reference).
**Goal:** Ingest lower-third text from script Google Docs into the dashboard. Operators review, regenerate, approve, and tweak font settings before reading the text into ProPresenter (where the background slide template already lives).

## Why text-only forever

The lower-third visual = a ProPresenter slide template that holds the background. The dashboard's only job is to supply:

1. **The text string** for each lower-third (e.g. "DR. JOHN SMITH / GEOLOGIST")
2. **Optional font overrides** per graphic (family, size in pt, color)

PNG rendering and image upload are not part of this workflow. The legacy `/upload` page and image-related columns stay in the codebase for now as scaffolding; they will be retired in a follow-up PR once the text path has shipped two episodes successfully.

## Architecture

```
Script Google Doc
       │
       │ (1) extraction prompt run in Claude.ai with Drive connector
       ▼
   JSON payload
       │
       │ (2) operator pastes/uploads at /import
       ▼
   POST /api/import   ──►  episodes upsert + graphics insert + variation_1 insert
       │
       │ (3) review at /lower-thirds: approve / reject / regenerate
       ▼
   /approved page
       │
       │ (4) tweak font, copy text, paste into ProPresenter
       ▼
   live show
```

## Ingest contract (authoritative)

The zod schema in `apps/dashboard/src/app/api/import/route.ts` is the **single source of truth** for what `/api/import` accepts. The extraction prompt below is locked to match this exact shape.

```jsonc
{
  // 1+ episodes; required.
  "episodes": [
    {
      "season":         3,                       // int, 1..99, required
      "episode_number": 12,                      // int, 1..999, required
      "title":          "John Smith Interview",  // string | null
      "air_date":       "2026-06-04",            // "YYYY-MM-DD" | null
      "guest_name":     "Dr. John Smith"         // string | null
    }
  ],
  // 0+ graphics. Each must reference an episode by (episode_season, episode_number).
  "graphics": [
    {
      "episode_season":  3,                                          // int, required
      "episode_number":  12,                                         // int, required
      "segment":         "interview_1",                              // enum, required
      "beat_number":     1,                                          // int, 1..999, required
      "initial_text":    "DR. JOHN SMITH",                           // string, 1..200 chars, required
      "source_doc":      "S3 EP12 - John Smith Interview/Script.gdoc" // string | null, provenance only
    }
  ],
  // Optional. Defaults to false. When true, the route validates everything
  // and returns a report without writing a single row.
  "dry_run": false
}
```

### Segment enum (must match `graphic_segment` Postgres enum exactly)

```
opening_monologue
interview_1
interview_2
kids_corner
genesis_science_qa
ministry_report
viewer_voices
featured_resource
heavens_declare
genesis_science_minute
other
```

### Field notes

- `episodes[]` is upserted by `(season, episode_number)` — repeat-imports of the same episode update `title`, `air_date`, `guest_name` to the latest values.
- `graphics[]` must NOT include rows that conflict with existing `(episode_id, segment, beat_number)`. Live submit refuses with a 409 and lists the conflicts; dry-run reports them so you can fix the source JSON.
- Font fields (`font_family`, `font_size_pt`, `font_color`) are set in the dashboard UI per-graphic. They are intentionally NOT in the ingest schema — script docs don't carry font intent.
- Each new graphic gets `variation_number=1` in `graphics_variations` with `text_content=initial_text` and `generated_by='human'`.

## Dry-run response

```jsonc
{
  "dry_run": true,
  "episodes":  { "total": 1, "new": 1, "updated": 0 },
  "graphics":  { "total": 2, "new": 2, "conflicts": 0 },
  "conflicts": []   // populated when there are conflicts
}
```

## Live-submit response

```jsonc
{
  "success":   true,
  "episodes":  { "total": 1, "new": 1, "updated": 0 },
  "graphics":  { "total": 2, "new": 2 }
}
```

Errors return either 400 (validation), 401 (no session), 409 (conflicts), or 500 (DB failure). 207 is returned when graphics inserted but `variation_1` rows failed — surface to the operator so they can retry manually.

## The extraction prompt

Paste this into Claude.ai with the Google Drive connector enabled. Output is locked to the ingest schema above.

````
You are extracting GSR (Genesis Science Report) lower-third graphics from
script documents stored in Google Drive.

INPUT: A Google Drive folder, one folder per episode, named like
"S3 EP12 - John Smith Interview". Inside is a script Google Doc, plus
optionally a sub-folder of standalone lower-third docs.

YOUR JOB: Read every script doc and any lower-third doc in the folder.
Extract every lower-third (LT) copy line. Group them by segment. Return
JSON in the exact schema given at the end.

SEGMENT ENUM (use these exact values, no others):
opening_monologue, interview_1, interview_2, kids_corner,
genesis_science_qa, ministry_report, viewer_voices, featured_resource,
heavens_declare, genesis_science_minute, other

HOW TO IDENTIFY LOWER-THIRDS IN THE SCRIPT:
- Lower-thirds are written in ALL CAPS, broadcast style.
- They typically appear inline as a standalone line, sometimes prefixed
  with "LT:", "LOWER THIRD:", "GRAPHIC:", or similar.
- A name + role pattern is common: "DR. JOHN SMITH / GEOLOGIST".
- Episode segments are usually marked by headers like "INTERVIEW 1",
  "KIDS CORNER", "MINISTRY REPORT".
- If a segment header is ambiguous, map it to the closest enum value
  and put the original header in source_doc.

EXTRACTION RULES:
- Preserve the LT text exactly as written, including capitalization
  and slashes.
- Never use em dashes. If the source uses one, replace with a forward
  slash or hyphen.
- beat_number is the order of the LT within its segment, starting at 1.
- initial_text MUST be 1..200 characters. Reject longer lines and
  put them in a top-level "rejected" notes block at the end (do not
  emit them in the graphics array).
- If episode metadata is missing, leave the field as null. Do not
  invent values.
- title and air_date can be inferred from the folder name when not
  explicit in the doc.

OUTPUT: Return ONLY valid JSON matching this exact schema. No prose,
no markdown fences, no commentary.

{
  "episodes": [
    {
      "season":         <int 1..99>,
      "episode_number": <int 1..999>,
      "title":          <string or null>,
      "air_date":       <"YYYY-MM-DD" or null>,
      "guest_name":     <string or null>
    }
  ],
  "graphics": [
    {
      "episode_season":  <int>,
      "episode_number":  <int>,
      "segment":         <segment enum value>,
      "beat_number":     <int 1..999>,
      "initial_text":    <string 1..200 chars>,
      "source_doc":      <string or null>
    }
  ]
}
````

## Operator workflow (Stage 7 test plan)

1. Open Claude.ai → enable Google Drive connector → paste extraction prompt → point at one episode folder.
2. Copy the JSON output.
3. Open the dashboard → `/import` → paste JSON → leave dry-run on → click "Run dry-run validation".
4. If conflicts/errors: fix source JSON. If clean: uncheck dry-run, click "Submit for real".
5. Navigate to `/lower-thirds` → review each card. For each: Approve, Reject, Regenerate, or Adopt.
6. (Optional) Click "Font" on any card to set family/size/color overrides per graphic.
7. On show day: open `/approved` → for each row, click "Copy" → paste into ProPresenter slide.
8. Click the "In ProPresenter" checkbox once added.

## Out of scope for this feature

- Image rendering / PNG upload (legacy `/upload` page, kept as scaffolding)
- ProPresenter API push (Phase 2 — see architect-reviewer design)
- Asset tracking for non-LT graphics (clips, b-roll, pictures, propres quotes — see Sheet at https://docs.google.com/spreadsheets/d/1OyxgdNXKRQmX3m5HPh2jR9VMfDctcvPgdKZ7HDuSn58/edit, planned as PR2)

## Done criteria

1. Extraction prompt produces JSON that imports cleanly through `/import` dry-run on at least one real episode folder.
2. Live submit creates rows visible at `/lower-thirds`.
3. Each row can be approved, rejected, regenerated, and have its font set.
4. `/approved` shows approved rows with copy-text button and font display.
5. No PNG upload or image storage was involved end-to-end.
