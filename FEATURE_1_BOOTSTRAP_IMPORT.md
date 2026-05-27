# Feature 1 Bootstrap Import: Text-only Lower-Thirds from Script Docs

**Status:** Historical. Superseded by `FEATURE_1_LOWER_THIRDS_TEXT_IMPORT.md` (2026-05-27 — lower-thirds are text-only forever; this is no longer a "bootstrap" path, it's the canonical one).
**Goal (original):** Make the lower-thirds approval dashboard useful from day one by ingesting existing lower-third copy from Google Docs scripts, without waiting for Jakob to migrate his PNG render workflow.
**Out of scope:** Image rendering, ProPresenter push, episode metadata beyond what's needed to anchor a graphic to a season + episode_number.

---

## Why this exists

The canonical Feature 1 workflow is: Jakob uploads a rendered PNG, Daniel approves it, the graphic queues for ProPresenter. That requires Jakob to change his workflow.

In parallel, lower-third copy is already being written in Google Docs (typically inside the script doc for each episode, sometimes in a sibling sub-folder). The dashboard can run against that text immediately, even before any PNG has been rendered. Daniel approves the text copy, and the approved row sits in the queue awaiting a placeholder-to-real image swap once Jakob renders.

This means we get a working approval queue on real content the same week the dashboard ships, instead of waiting for the upstream tool change.

---

## The two pieces

### Piece 1: `/import` page in the dashboard

A second ingest path next to `/upload`. Accepts a JSON document (paste or file upload) and bulk-creates rows.

### Piece 2: Extraction prompt

A copy-paste prompt run against Claude.ai with the Google Drive connector enabled. Reads an episode folder, parses any script docs inside it, and emits ingest-ready JSON.

---

## Ingest JSON format

```json
{
  "episodes": [
    {
      "season": 3,
      "episode_number": 12,
      "title": "John Smith Interview",
      "air_date": null,
      "guest_name": "Dr. John Smith"
    }
  ],
  "graphics": [
    {
      "episode_season": 3,
      "episode_number": 12,
      "segment": "interview_1",
      "beat_number": 1,
      "initial_text": "DR. JOHN SMITH",
      "source_doc": "S3 EP12 - John Smith Interview/Script.gdoc"
    },
    {
      "episode_season": 3,
      "episode_number": 12,
      "segment": "interview_1",
      "beat_number": 2,
      "initial_text": "DR. JOHN SMITH / GEOLOGIST",
      "source_doc": "S3 EP12 - John Smith Interview/Script.gdoc"
    }
  ]
}
```

### Field notes

- `episodes[].guest_name` is not in the canonical `episodes` schema yet. Either add a nullable `guest_name text` column for now, or store it in a separate `episode_metadata` JSON column. Recommend the dedicated column; it's the kind of field that gets queried.
- `graphics[].source_doc` is provenance only. Stored verbatim in `graphics_variations.generation_context.source_doc` for traceability. No FK.
- `beat_number` is the order of the LT within its segment, starting at 1.

---

## `/import` page spec

### Layout

- One file-upload zone for a `.json` file, OR a paste-into-textarea fallback
- A "Dry run" toggle, on by default
- A "Submit" button

### Dry-run behavior

1. Validates JSON against schema
2. Reports: N episodes (M new, K existing), N graphics, list of segment values it'll insert
3. Lists any rows that would be rejected and why (bad enum value, missing required field, etc.)
4. Nothing is written

### Live submit behavior

1. For each `episodes[]` entry: `INSERT ... ON CONFLICT (season, episode_number) DO UPDATE SET title = COALESCE(EXCLUDED.title, episodes.title)`, returning `id`
2. For each `graphics[]` entry:
   - Resolve `episode_id` from `(episode_season, episode_number)`
   - Insert into `graphics` with `status='pending_review'`, `current_image_url='<bucket>/placeholder.png'`, `uploaded_by = auth.uid()`
   - Insert into `graphics_variations` with `variation_number=1`, `text_content=initial_text`, `generated_by='human'`, `generation_context = {"source_doc": "..."}`
3. Report row counts and any failures
4. Redirect to `/lower-thirds` filtered to the imported episode(s)

### Placeholder image

One PNG uploaded once to the `lower-thirds` Storage bucket as `placeholder.png`. Generic "LT pending render" graphic. The `/lower-thirds` grid displays it for any row that has not had its image swapped in by Jakob yet.

### Image attachment (later, not part of bootstrap)

When Jakob renders the actual PNG for an approved row, the canonical PNG upload flow uses an existing graphic row instead of creating a new one. Either: a dropdown on `/upload` to "attach to existing", or a per-card "attach image" button on `/lower-thirds`. Out of scope for the bootstrap doc; capture it in Feature 1 phase 2 work.

---

## Build sequence (additive on top of `FEATURE_1_LOWER_THIRDS.md`)

Insert between Stage 6 (Approved queue) and Stage 7 (Real episode test):

### Stage 6.5: Bootstrap import (~2-3 days)

1. Upload `placeholder.png` to the `lower-thirds` Storage bucket
2. Add `guest_name text` column to `episodes` table
3. Build `/import` page (paste + file upload, dry-run toggle)
4. Wire ingest endpoint: validate, dedupe episodes, bulk insert graphics + variations
5. Test with hand-written JSON (no prompt yet) covering one real episode
6. Run the extraction prompt against this month's episode folders, paste output into `/import`, dry-run, submit
7. Approve a few rows in `/lower-thirds` to verify end-to-end

---

## The extraction prompt

Paste this into Claude.ai with the Google Drive connector enabled, then point it at the episode folder.

````
You are extracting GSR (Genesis Science Report) lower-third graphics from
script documents stored in Google Drive.

INPUT: A Google Drive folder, one folder per episode, named like
"S3 EP12 - John Smith Interview". Inside is a script Google Doc, plus
optionally a sub-folder of standalone lower-third docs.

YOUR JOB: Read every script doc and any lower-third doc in the folder.
Extract every lower-third (LT) copy line. Group them by segment. Return
JSON in the exact schema given at the end.

SEGMENT ENUM (use these exact values):
opening_monologue, interview_1, interview_2, kids_corner,
genesis_science_qa, ministry_report, viewer_voices, featured_resource,
heavens_declare, genesis_science_minute, other

HOW TO IDENTIFY LOWER-THIRDS IN THE SCRIPT:
- Lower-thirds are written in ALL CAPS, broadcast style
- They typically appear inline as a separate line, sometimes prefixed
  with "LT:", "LOWER THIRD:", "GRAPHIC:", or similar
- A name + role pattern is common: "DR. JOHN SMITH / GEOLOGIST"
- Episode segments are usually marked by headers like "INTERVIEW 1",
  "KIDS CORNER", "MINISTRY REPORT"
- If a segment header is ambiguous, map it to the closest enum value
  and note the original header in source_doc

EXTRACTION RULES:
- Preserve the LT text exactly as written, including capitalization
  and slashes
- Never use em dashes; if the source uses one, replace with a forward
  slash or hyphen
- beat_number is the order of the LT within its segment (1, 2, 3...)
- If episode metadata is missing, leave fields as null

OUTPUT: Return ONLY valid JSON matching this schema. No prose, no
markdown fences, no commentary.

{
  "episodes": [
    {
      "season": <int>,
      "episode_number": <int>,
      "title": <string or null>,
      "air_date": <YYYY-MM-DD or null>,
      "guest_name": <string or null>
    }
  ],
  "graphics": [
    {
      "episode_season": <int>,
      "episode_number": <int>,
      "segment": <enum value>,
      "beat_number": <int>,
      "initial_text": <string>,
      "source_doc": <string, relative path in Drive>
    }
  ]
}
````

---

## Assumptions and known limitations

1. **LTs are visually distinguishable in the script** via ALL CAPS + standalone-line formatting, with or without an "LT:" prefix. If script convention is different (LTs in a table column, in margin comments, inside parentheticals), the prompt needs revision.
2. **Segment headers are present and roughly consistent.** Without them the segment enum mapping is a guess.
3. **One script doc per episode folder** is assumed. If multiple drafts exist ("Script v1", "Script v2", "Final"), Claude is told to read every doc, which may produce duplicates. Resolve manually in the dry-run review, or amend the prompt with "use the most recently modified doc only".
4. **No image is ingested.** Every imported graphic gets the placeholder until Jakob renders the real PNG.

---

## Retirement criteria

Bootstrap import goes from "primary" to "secondary" once Jakob has used the canonical PNG upload flow for two consecutive episodes without falling back. The `/import` page stays in the dashboard indefinitely for ad-hoc backfills and historical-episode ingestion.

---

## Definition of done

Bootstrap import is done when:

1. The extraction prompt produces valid JSON against one real episode folder
2. The JSON imports cleanly through `/import` in dry-run mode (no rejections)
3. Imported rows appear in `/lower-thirds` with the placeholder thumbnail and the correct segment grouping
4. Daniel approves at least three rows end-to-end
5. The extraction prompt is captured in this doc, runnable by copy-paste with no out-of-band setup beyond "open Claude.ai, enable Drive connector, paste"
