# Stage 7 Runbook — First Real Episode Test

**Goal:** Run one full episode through the complete workflow:
extract → import → review → approve → ProPresenter copy.

---

## Step 0 — Verify the import flow works (do this first, takes 2 minutes)

Before using a real episode, confirm the system is working with this
sample JSON. Paste it into the dashboard right now.

**Sample JSON (Season 3, Episode 30 — test data, not a real episode):**

```json
{
  "episodes": [
    {
      "season": 3,
      "episode_number": 30,
      "title": "TEST EPISODE — Stage 7 Dry Run",
      "air_date": "2026-06-04",
      "guest_name": "Dr. Test Guest"
    }
  ],
  "graphics": [
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "show_intro",
      "l3_type": "episode_intro_l3",
      "beat_number": 1,
      "primary": "GENESIS SCIENCE REPORT",
      "var_1": "GENESIS SCIENCE",
      "var_2": "GSR",
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "opening_monologue",
      "l3_type": "monologue_beat",
      "beat_number": 1,
      "primary": "DNA ENCODES INFORMATION",
      "var_1": null,
      "var_2": null,
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "opening_monologue",
      "l3_type": "monologue_beat",
      "beat_number": 2,
      "primary": "DARWIN COULDN'T EXPLAIN THE CELL",
      "var_1": null,
      "var_2": null,
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "interview_1",
      "l3_type": "guest_chyron",
      "beat_number": 1,
      "primary": "DR. TEST GUEST / GENETICIST",
      "var_1": null,
      "var_2": null,
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "interview_1",
      "l3_type": "topic_l3",
      "beat_number": 2,
      "primary": "MITOCHONDRIAL EVE",
      "var_1": "MITOCHONDRIAL EVE",
      "var_2": "MT. EVE",
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "interview_1",
      "l3_type": "discussion_l3",
      "beat_number": 3,
      "primary": "THE Y CHROMOSOME POINTS TO ADAM",
      "var_1": null,
      "var_2": null,
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "kids_corner",
      "l3_type": "segment_graphics_title",
      "beat_number": 1,
      "primary": "KIDS CORNER",
      "var_1": "KIDS CORNER",
      "var_2": "KIDS",
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "genesis_science_qa",
      "l3_type": "qa_topic_l3",
      "beat_number": 1,
      "primary": "HOW OLD IS THE EARTH?",
      "var_1": null,
      "var_2": null,
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "ministry_report",
      "l3_type": "mr_cta_l3",
      "beat_number": 1,
      "primary": "SUPPORT GENESIS SCIENCE REPORT",
      "var_1": null,
      "var_2": null,
      "source_doc": null
    },
    {
      "episode_season": 3,
      "episode_number": 30,
      "segment": "featured_resource",
      "l3_type": "resource_l3",
      "beat_number": 1,
      "primary": "TRACED / DR. TEST GUEST",
      "var_1": null,
      "var_2": null,
      "source_doc": null
    }
  ],
  "rejected": []
}
```

**Instructions:**

1. Open the dashboard → `/import`
2. Paste the JSON above into the textarea
3. Leave "Dry run" checked → click **Run dry-run validation**
4. You should see: Episodes: 1 new, Graphics: 10 new, Conflicts: 0
5. Uncheck dry-run → click **Submit for real**
6. You'll be redirected to `/lower-thirds` — you should see 10 cards for S3E30
7. Approve 2-3 of them → go to `/approved` → confirm copy button works

If all of that works, the system is ready for a real episode.

> **Clean up:** After the test, the S3E30 rows will sit in the DB. That's fine —
> they won't affect real episodes (different episode numbers). Delete them via
> Supabase dashboard if you want a clean slate.

---

## Step 1 — Extract lower-thirds from the episode script

1. Open **Claude.ai** (claude.ai, not Claude Code)
2. Enable the **Google Drive connector** (click the Drive icon in the chat bar)
3. Paste the extraction prompt from `FEATURE_1_LOWER_THIRDS_TEXT_IMPORT.md`
4. In the same message, say: "Process this episode folder: [paste the Drive folder name or link]"
5. Claude will read the script doc and return a JSON object
6. Copy the entire JSON output

> **Tip:** If Claude's output has markdown fences (```json ... ```), remove them
> before pasting into the dashboard. The textarea expects raw JSON.

---

## Step 2 — Import into the dashboard

1. Open the dashboard → `/import`
2. Paste the JSON (or use the file upload if you saved it as a .json file)
3. Leave "Dry run" checked → click **Run dry-run validation**
4. Review the report:
   - **Episodes**: should show 1 new episode
   - **Graphics**: total count should match what's in the script
   - **Conflicts**: should be 0 for a new episode
   - **Rejected**: review any lines the prompt flagged as too long or unclassifiable
5. If the dry-run is clean, uncheck dry-run → click **Submit for real**
6. You'll be automatically redirected to `/lower-thirds`

### Troubleshooting dry-run errors

| Error | Fix |
|---|---|
| `segment` enum value not recognized | Claude used a wrong segment name — edit the JSON to use an exact enum value from the list |
| `primary` or `initial_text` missing | A graphic row has no text — add the text or delete the row |
| Conflict on graphics[N] | That segment + beat_number already exists for this episode — delete the duplicate |
| Episode not in episodes[] | A graphic references a season/episode that isn't in the episodes array |

---

## Step 3 — Review at /lower-thirds

For each card:

| Action | When to use |
|---|---|
| **Approve** | Text is correct as-is |
| **Reject** | Text is wrong and you don't want to use it |
| **Regenerate** | Text needs a Claude-generated alternative — click and wait ~5s |
| **Font** (optional) | Override font family, size, or color for this card only |

Work through all cards before moving to the approved queue.

---

## Step 4 — Copy to ProPresenter

1. Open `/approved`
2. For each row: click **Copy** → paste into the ProPresenter slide for that segment
3. Check **In ProPresenter** once it's added
4. Repeat for all rows

---

## Done criteria (Stage 7 complete)

- [ ] Step 0: Dry-run test with sample JSON passes clean
- [ ] Step 0: 10 test cards appear in `/lower-thirds` after live submit
- [ ] Step 0: Approved cards appear in `/approved` with working copy button
- [ ] Step 1–4: At least one real episode extracted, imported, reviewed, and copied to ProPresenter
- [ ] No PNG upload or image storage was involved end-to-end

Once one real episode completes Step 4, mark Stage 7 done in BUILD_STATUS.html.
