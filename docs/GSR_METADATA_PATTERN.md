# GSR YouTube Metadata Pattern

**Source:** Analysis of the most recent 25 Genesis Science Report episodes on the David Rives Ministries YouTube channel (channel ID `UCNZS3IEQaAfwofwltbEBwuw`).
**Last updated:** 2026-05-15
**Purpose:** Reference document for AI metadata generation. All GSR uploads should follow these patterns unless explicitly overridden.

---

## Channel & Playlist IDs

- **Channel:** David Rives Ministries — `UCNZS3IEQaAfwofwltbEBwuw`
- **Main GSR playlist:** `PLsNop94Wb7fl22pdaKRY0BZpm1vIjf6Cr` (81 episodes as of analysis)
- **Related playlists** (every new GSR episode should be added to all three):
  - Genesis Science Report with David Rives
  - Genesis Science Network
  - Most Inspirational

---

## Posting Cadence

- **Day:** Every Monday — 100% consistent across last 25 episodes
- **Time:** 4:00 PM Eastern Time (publishes as 20:00 or 21:00 UTC depending on DST)
- **Duration:** ~58 minutes per episode
- **Scheduling rule for automation:** Default to next available Monday at 4:00 PM ET unless explicitly overridden

---

## Locked YouTube Settings (Every Episode)

These are identical across all 25 analyzed episodes — automation can hardcode them:

| Field | Value |
|-------|-------|
| Category | 28 (Science & Technology) |
| Privacy | Public |
| Made for Kids | No |
| License | Standard YouTube |
| Language / Audio | English |

---

## Title Format

**Current format (Season 3):**
`[Topical Hook] | Genesis Science Report - S03, Ep##`

**Examples:**
- `The Heavens Declare His Glory | Genesis Science Report - S03, Ep13`
- `Origins of Life Explored | Genesis Science Report - S03, Ep12`

**Rules:**
- The topical hook should reflect the episode's most compelling theme
- Season and episode number always present, always in this format
- Pipe character `|` with spaces on both sides
- No emoji, no all-caps

---

## Description Anatomy (every episode follows this structure)

```
[1] Lede paragraph: "On this episode of The Genesis Science Report…"
[2] 1-2 paragraphs describing the segments/topics
[3] Tagline: "Watch The Genesis Science Report for…"
[4] Chapter timestamps (see segment order below)
[5] Sponsor line (rule below)
[6] Hashtag block (~10-15 tags)
```

### Standard Segment Order for Chapter Timestamps

Chapters appear in this order when present:

1. Opening Monologue
2. Interview 1
3. The Heavens Declare
4. Kids Corner
5. Genesis Science Q&A *(sometimes omitted)*
6. Ministry Report
7. Genesis Science Minute
8. Interview 2

### Sponsor Line Rule

**Standing sponsor:** Cedarville University

**Active for:** Season 3, Ep1 through Ep24
**Removed starting:** Season 3, Ep25 (sponsorship ends)
**Line format:** `This episode is sponsored by Cedarville University.`

**Automation logic:**
```
IF season == 3 AND episode_number <= 24:
    include sponsor_line
ELSE:
    omit sponsor_line
```

---

## Tag Strategy

### Anchor Tags (always present on every GSR episode)

These 9 tags are non-negotiable — every episode includes all of them:

1. `Genesis Science Report`
2. `David Rives`
3. `Creation Science`
4. `Intelligent Design`
5. `Biblical Creation`
6. `Science and Faith`
7. `Genesis Science Network`
8. `Biblical Worldview`
9. `Christian Apologetics`

### Topical Tags (generated per episode)

10–18 additional tags specific to that episode's content. AI should extract these from the transcript focusing on:
- Guest names (Interview 1 and Interview 2)
- Scientific topics covered
- Bible passages referenced
- Apologetics themes
- Notable terms or proper nouns

**Total tag count per episode:** Approximately 19–27 tags (9 anchor + 10–18 topical)

---

## Hashtag Block (in description, not the tags field)

Approximately 10–15 hashtags at the end of the description. Substantial overlap with the tag list but formatted as hashtags. Examples seen in past episodes:

```
#GenesisScienceReport #DavidRives #CreationScience #IntelligentDesign
#BiblicalCreation #ScienceAndFaith #ChristianApologetics #Apologetics
#BiblicalWorldview #ChristianTV
```

---

## Episode Numbering State (as of 2026-05-15)

- **Latest published:** Season 3, Episode 13 (video ID `Ugme2VWDHcM`)
- **Next to upload:** Season 3, Episode 14
- **Sponsor ends after:** Season 3, Episode 24
- **Total episodes in playlist:** 81

---

## AI Metadata Generator — Input Requirements

When generating metadata for a new episode, the system needs:

1. **Transcript** (full episode transcript, ideally with speaker labels)
2. **Episode number** (or default to next sequential)
3. **Video file location**
4. **Thumbnail location**
5. **Special notes** (optional): guest of note, sponsor swap, holiday week, etc.

## AI Metadata Generator — Output Specification

The AI should produce a structured JSON object:

```json
{
  "title": "[Generated topical hook] | Genesis Science Report - S03, Ep##",
  "description": "[Full description following anatomy above]",
  "tags": ["anchor tag 1", "...", "topical tag 1", "..."],
  "category_id": 28,
  "privacy_status": "private",
  "made_for_kids": false,
  "language": "en",
  "license": "youtube",
  "scheduled_publish_time": "2026-MM-DDT20:00:00Z",
  "playlists": [
    "PLsNop94Wb7fl22pdaKRY0BZpm1vIjf6Cr",
    "[Genesis Science Network playlist ID]",
    "[Most Inspirational playlist ID]"
  ],
  "chapters": [
    {"time": "00:00", "title": "Opening Monologue"},
    {"time": "MM:SS", "title": "Interview 1 - [Guest Name]"},
    {"time": "MM:SS", "title": "The Heavens Declare"},
    {"time": "MM:SS", "title": "Kids Corner"},
    {"time": "MM:SS", "title": "Ministry Report"},
    {"time": "MM:SS", "title": "Genesis Science Minute"},
    {"time": "MM:SS", "title": "Interview 2 - [Guest Name]"}
  ],
  "sponsor_included": true
}
```

**Default privacy is `private`** for safety. Human approves in dashboard before privacy is changed to `public` and upload fires.

---

## Validation Checklist Before Upload

Automated upload workflow should validate these before pushing to YouTube:

- [ ] Title matches format `[Hook] | Genesis Science Report - S03, Ep##`
- [ ] Description contains all 6 anatomy sections
- [ ] All 9 anchor tags present
- [ ] Total tags between 19 and 27
- [ ] Sponsor rule correctly applied (present Ep1–24, absent Ep25+)
- [ ] Chapter timestamps present and properly formatted
- [ ] Hashtag block present at end of description
- [ ] Scheduled publish time is a Monday at 20:00 UTC (or 21:00 UTC during DST)
- [ ] All three playlists configured
- [ ] Category ID is 28 (Science & Technology; never 24 or 27)
- [ ] Privacy is `private` initially (changed to `public` only after human approval)

---

## Future Extensions (Phase 3 candidates)

When multi-variant metadata is added in Phase 3, this document expands to cover:

- **Rumble:** Likely similar to YouTube but no chapter timestamps support, hashtag differences
- **Dropbox:** No metadata needed (file-only)
- **Signiant:** Google Form fields — title, description, contact info (separate spec document)
- **Fireside.fm:** Audio-only podcast description, may differ from video description
- **StreamHoster:** Filename conventions and folder structure

Until then, the master description used for YouTube is used (with minor manual edits as needed) for all other platforms.
