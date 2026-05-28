# GSR Supabase Schema Design
*Synthesized from 879 conversation sessions, all applied migrations, and full Drive archive review. Updated 2026-05-28.*
*31 migrations applied. Supabase project: `lafkbxypmciopebentxp`.*

---

## The Central Idea

Everything lives under the **episode umbrella**. An episode is the unit of work — it has a shoot date, an air date, guests, graphics, research, distribution records, transcripts, content clips, and social posts. Every other entity links back to it.

```
episodes
  ├── lower_thirds (graphics)          text chyrons → ProPresenter
  │     └── lower_thirds_variations (graphics_variations)   AI regeneration history
  ├── production_graphics  [PENDING]   visual assets → Rundown Creator + Drive
  │     └── premade_library [PENDING]  reusable pre-made asset catalog
  ├── episode_guests                   booking records — one row per slot per episode
  │     └── guests                     person roster, reused across episodes
  │           └── filming_schedule [PENDING]  ALT slot scheduling
  ├── interview_prep                   article sourcing + angle development
  ├── articles [PENDING]               standalone article candidates (8-dim scored)
  │     └── article_guest_recommendations [PENDING]   link articles to guest candidates
  ├── outreach_drafts [PENDING]        email template library by tier
  ├── email_threads [PENDING]          log of actual sent emails
  ├── distributions                    platform delivery tracking
  ├── transcripts                      Whisper/Deepgram or manual
  ├── content_clips                    30–60s soundbites for social
  │     └── social_posts               posted content — clip-based
  └── social_posts                     episode-level posts (promos, quote graphics)
```

**[PENDING]** = designed, not yet migrated. All other tables have applied migrations.

Two views centralize operational data:
- **`v_episode_master`** — flat JOIN of all tables, ordered by show sequence.
- **`v_episode_workflow`** — computed email due dates + boolean flags for both guests' lifecycle.

---

## Episode Label Format

Canonical display string: **`S03 Ep021`**
- `S` + 2-digit zero-padded season number
- space
- `Ep` (capital E, lowercase p)
- 3-digit zero-padded episode number

Examples: `S03 Ep021`, `S03 Ep025`, `S03 Ep060`
Rundown Creator title format: `May Show 1 | S03_Ep021` (underscores in the RC title, spaces in display labels)

---

## Tables

### `episodes` (applied — 31 migrations)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| season | int | e.g. 3 |
| episode_number | int | e.g. 21; UNIQUE with season |
| title | text | Episode topic hook |
| air_date | date | Tuesday broadcast date |
| shoot_date | date | Recording day (often weeks before air) |
| production_status | text CHECK | planned → in_prep → shot → in_post → scheduled → aired |
| guest_name | text | **DEPRECATED.** Legacy flat field kept for Feature 1 compatibility — use episode_guests + guests instead |
| rc_rundown_id | text | Rundown Creator numeric ID (e.g. "79" = May Show 1) |
| drive_folder_url | text | Google Drive episode folder URL |
| notes | text | |
| description | text | YouTube/social description |
| tags | text[] | Episode topic tags |
| thumbnail_url | text | Rendered thumbnail (Storage or CDN URL) |
| thumbnail_source_path | text | Drive path to raw thumbnail source asset |
| chapter_markers | jsonb | `[{"label":"...", "timecode":"HH:MM:SS"}]` |
| youtube_url | text | Live YouTube link once published |
| youtube_published_at | timestamptz | Actual publish time |
| youtube_scheduled_publish_at | timestamptz | Target publish time (default Monday 4PM ET) |
| rumble_url | text | Rumble video link |
| podcast_url | text | Fireside.fm episode link |
| created_at | timestamptz | |

**RC IDs for Season 3 May cycle:** Show 1=79, Show 2=81, Show 3=83, Show 4=82, Show 5=84
**Drive folder pattern:** `05_May (Ep 21-25)/[subfolder]`

---

### `graphics` → future rename: `lower_thirds`

**Current table name is `graphics`.** A rename migration is pending — all dashboard code must be updated simultaneously. Until then, `graphics` and `lower_thirds` refer to the same table.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| segment | graphic_segment enum | 12 values — see below |
| l3_type | text CHECK | 15 type values — see below |
| beat_number | int | Order within segment, starts at 1 |
| initial_text | text | Primary L3 text (55–65 chars, ALL CAPS) |
| var_1, var_2 | text | Alternate copy lines from 3-column extraction |
| status | graphic_status enum | pending_review → approved / rejected / needs_revision |
| current_image_url | text | `__text_only__` sentinel for text-only imports |
| propresenter_added | boolean | Toggled via atomic RPC after copy to ProPresenter |
| font_family, font_size_pt, font_color | text/int/text | Per-graphic font overrides |
| notes | text | |
| asset_source_urls | text[] | Candidate footage/image source URLs |
| source_doc | text | Source script/doc reference |
| uploaded_by, approved_by | uuid FK → auth.users | |
| uploaded_at, approved_at | timestamptz | |

**`graphic_segment` enum values (12):**
`opening_monologue`, `interview_1`, `interview_2`, `kids_corner`, `genesis_science_qa`, `ministry_report`, `viewer_voices`, `featured_resource`, `heavens_declare`, `genesis_science_minute`, `show_intro`, `other`

**`l3_type` check values (15):**
`episode_intro_l3`, `monologue_beat`, `segment_graphics_title`, `topic_l3`, `guest_chyron`, `discussion_l3`, `generic_safety_net`, `qa_topic_l3`, `mr_topic_l3`, `mr_cta_l3`, `correspondent_chyron`, `viewer_l3`, `resource_l3`, `cta_l3`, `other`

**Character limit:** 55–65 chars, ALL CAPS, target 65. Never over 65.
**Chyron format:** `DR. JOHN SMITH | ICR | ASTROPHYSICS` (pipe-separated, built from guest fields)

---

### `graphics_variations` → future rename: `lower_thirds_variations`

Tracks every AI-generated and human-written alternative text for a graphic. Variation 1 is auto-created on import.

---

### `guests` (applied)

One row per person. Reused across episodes.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| title | text | Dr., Mr., Ms. |
| first_name, last_name | text | Full names required |
| email, phone | text | |
| expertise | text | e.g. "Astrophysics, Cosmology" |
| job_title | text | |
| organization | text | |
| is_yec | boolean | Young Earth Creationist; false = apply science-first framing, avoid age/cosmology topics |
| communication_notes | text | Responsiveness, on-air performance, scheduling ease |
| notes | text | |
| created_at | timestamptz | |

**Appearance count is computed:** `SELECT COUNT(*) FROM episode_guests WHERE guest_id = ?` — used to determine outreach tier (0=cold, 1=warm, 2=returning, 3-4=recurring, 5+=direct).

---

### `episode_guests` (applied)

Links a guest to an episode + interview slot. One row per slot per episode.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes CASCADE | |
| guest_id | uuid FK → guests | |
| segment | text | interview_1 or interview_2 |
| booking_status | text | outreach → confirmed → shot → aired (or declined / no_show) |
| filming_datetime | timestamptz | Confirmed Zoom time (primary slot) |
| zoom_location | text | Zoom link or 'in-studio' |
| resource_verified | boolean | creationsuperstore.com product confirmed |
| resource_url | text | URL if found; null = offer website plug instead |
| appearance_notes | text | Post-appearance notes |
| interview_confirmation_sent_at | timestamptz | |
| zoom_link_sent_at | timestamptz | shoot day |
| day_before_reminder_sent_at | timestamptz | |
| post_shoot_followup_sent_at | timestamptz | shoot_date + 1 day |
| pre_air_notification_sent_at | timestamptz | air_date − 1 day |
| post_air_youtube_sent_at | timestamptz | youtube_published_at + 2 days |
| created_at | timestamptz | |

UNIQUE on `(episode_id, segment)` — one guest per slot.

---

### `interview_prep` (applied)

Article sourcing and angle development per episode-guest.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| episode_guest_id | uuid FK → episode_guests | Nullable — can exist before guest is booked |
| article_url | text | |
| article_title | text | |
| source_publication | text | |
| article_summary | text | |
| angle_notes | text | |
| talking_points | text | |
| lane | text | creation_science / astronomy / biology / genetics / geology / archaeology / other |
| status | text | researching → angle_approved → questions_drafted → questions_sent → complete |
| created_at | timestamptz | |

---

### `production_graphics` [PENDING — not yet migrated]

**Separate workflow from lower_thirds.** These are visual assets (b-roll, title cards, images) that appear in Rundown Creator rows, assigned to Isaac's graphics queue. NOT text chyrons.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes CASCADE | |
| rc_row_label | text | RC rundown row letter+number, e.g. "B3", "B7" |
| rundown_position | int | Row position 1–15 in the show skeleton |
| graphic_type | text CHECK | See 11 type values below |
| description | text | What should appear / what's needed |
| status | text CHECK | Not Started / Created / In Progress / Loaded In |
| drive_file_url | text | Link to the rendered asset in Drive |
| rc_rundown_id | text | Mirrors episodes.rc_rundown_id; denormalized for fast RC queries |
| lastline_trigger | boolean | If true, this row's "lastline" triggers the graphic on the next row |
| assigned_to | uuid FK → auth.users | Isaac's user ID |
| premade_library_id | uuid FK → premade_library | If sourced from premade catalog |
| notes | text | |
| created_at, updated_at | timestamptz | |

**`graphic_type` check values (11, exact from Isaac's tracker):**
`Title Graphic`, `B-roll`, `Pre-made: B-roll`, `Pre-made: Graphic`, `Clip w/audio`, `Article Screenshot`, `Picture`, `Propres Quote`, `Propres Graphic`, `Roll-in`, `Graphic`

**`status` check values (4, exact from Isaac's tracker):**
`Not Started`, `Created`, `In Progress`, `Loaded In`

**RC show skeleton:** B1–B15. The "lastline" rule: row N's lastline text triggers the graphic cued on row N+1. `isPlainText=false` always.

---

### `premade_library` [PENDING — not yet migrated]

Catalog of reusable pre-made graphics and b-roll. Production graphics rows reference this when they use a pre-made asset.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text NOT NULL | Short identifier |
| description | text | What it is / when to use it |
| asset_type | text CHECK | b_roll / title_graphic / graphic / clip_with_audio / other |
| source | text | storyblocks / nasa_svs / creation_com / own_production / other |
| source_url | text | Origin URL (Storyblocks catalog link, NASA SVS page, etc.) |
| drive_file_url | text | Stored copy in GSR Drive |
| tags | text[] | Searchable tags e.g. `{"stars", "galaxy", "creation"}` |
| notes | text | Usage restrictions, quality notes |
| created_at | timestamptz | |

---

### `articles` [PENDING — not yet migrated]

Standalone article candidates for the research pipeline. Different from `interview_prep` (which ties to a specific episode+guest). Articles exist independently and get matched to guests and episodes.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| url | text UNIQUE | Source article URL |
| title | text NOT NULL | |
| source_publication | text | e.g. "Nature", "ICR.org", "Science Daily" |
| published_date | date | |
| summary | text | |
| lane | text | creation_science / astronomy / biology / genetics / geology / archaeology / other |
| score_scientific_clarity | int | 0–10 |
| score_biblical_alignment | int | 0–10 |
| score_production_viability | int | 0–10 |
| score_guest_fit | int | 0–10 |
| score_story_originality | int | 0–10 |
| score_audience_engagement | int | 0–10 |
| score_research_depth | int | 0–10 |
| score_timeliness | int | 0–10 |
| total_score | int GENERATED | Sum of all 8 scores (0–80) |
| yec_stance | text | yec_friendly / neutral / hostile |
| status | text | candidate → approved → used → archived |
| added_by | uuid FK → auth.users | |
| created_at | timestamptz | |

**Scoring rubric** (from GSR Interview Tracker): each dimension 0–10, max total 80. A score ≥ 60 is broadcast-ready. Score ≥ 40 with strong guest fit warrants development.

---

### `article_guest_recommendations` [PENDING — not yet migrated]

Junction table linking article candidates to guest candidates. Built from the GSR Interview Tracker's article scoring + guest matching system.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| article_id | uuid FK → articles NOT NULL | |
| guest_id | uuid FK → guests NOT NULL | |
| episode_id | uuid FK → episodes | Nullable — set when article is assigned to an episode |
| christian_worldview | boolean | Guest holds biblical/Christian worldview (from Interview Tracker field) |
| recommendation_notes | text | Why this guest + article pair works |
| created_at | timestamptz | |

UNIQUE on `(article_id, guest_id)`.

---

### `filming_schedule` [PENDING — not yet migrated]

ALT slot scheduling for interviews. `episode_guests.filming_datetime` is the confirmed primary slot — this table stores the negotiation slots including alternates.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes NOT NULL | |
| episode_guest_id | uuid FK → episode_guests NOT NULL | |
| slot_type | text CHECK | primary / alt_1 / alt_2 |
| proposed_datetime | timestamptz NOT NULL | |
| timezone | text | Guest's local timezone (e.g. "America/Chicago") |
| confirmed | boolean DEFAULT false | |
| notes | text | |
| created_at | timestamptz | |

---

### `outreach_drafts` [PENDING — not yet migrated]

Email template library keyed to outreach tier. Tier is determined by guest's appearance count.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| tier | text CHECK NOT NULL | cold / warm / returning / recurring / direct |
| subject_line | text NOT NULL | |
| body_text | text NOT NULL | Full email body with `{{first_name}}`, `{{episode_label}}` placeholders |
| version | int NOT NULL DEFAULT 1 | Incremented on updates |
| is_active | boolean DEFAULT true | Only active templates are served |
| created_by | uuid FK → auth.users | |
| created_at | timestamptz | |

**Tier logic** (from GSR Interview Tracker):
| Appearance count | Tier |
|---|---|
| 0 | cold |
| 1 | warm |
| 2 | returning |
| 3–4 | recurring |
| 5+ | direct |

---

### `email_threads` [PENDING — not yet migrated]

Log of actual sent emails. Provides a full communication history per guest+episode.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_guest_id | uuid FK → episode_guests | |
| guest_id | uuid FK → guests NOT NULL | |
| outreach_draft_id | uuid FK → outreach_drafts | Nullable — may be a custom email |
| email_type | text CHECK | outreach / confirmation / zoom_link / reminder / followup / pre_air / post_air / other |
| sent_at | timestamptz NOT NULL | |
| subject | text | |
| body_snippet | text | First ~500 chars for audit trail |
| sent_by | uuid FK → auth.users | |
| notes | text | |
| created_at | timestamptz | |

---

### `distributions` (applied)

One row per episode per platform.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes CASCADE | |
| platform | text NOT NULL | See platform list below |
| file_version | text | master / web / podcast / short |
| status | text | pending → uploaded → scheduled → live → archived |
| platform_url | text | |
| scheduled_publish_at | timestamptz | |
| uploaded_at, went_live_at | timestamptz | |
| view_count | int | |
| view_count_checked_at | timestamptz | |
| notes | text | |
| created_at | timestamptz | |

UNIQUE on `(episode_id, platform, file_version)`.

**Platform values (6 real + extras):**
| Value | What it is |
|---|---|
| `youtube` | Monday 4PM ET default; 3 playlists |
| `rumble` | No API — browser automation only |
| `dropbox` | Network partner delivery |
| `fireside_podcast` | MP3; also feeds Spotify + Apple Podcasts via RSS |
| `real_life_network` | Signiant Media Shuttle (also RightNow Media) |
| `streamhoster` | FTP → Roku, Apple TV, iOS app, LG TV |
| `genesis_science_network` | genesissciencenetwork.com |
| `social_clip` | Short-form clip status |
| `other` | Catch-all |

---

### `transcripts` (applied)

One row per episode (or per segment).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| segment | text | Nullable = full episode |
| transcript_text | text | |
| generated_by | text | manual / auto_whisper / auto_deepgram / auto_other |
| source_file_url | text | |
| notes | text | |
| created_at, updated_at | timestamptz | |

UNIQUE on `(episode_id, segment)`.

---

### `content_clips` (applied)

30–60 second soundbites for social short-form.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| episode_guest_id | uuid FK → episode_guests | Nullable |
| source_segment | text | interview_1 / interview_2 / opening_monologue / etc. |
| timecode_in, timecode_out | text | HH:MM:SS:FF drop-frame |
| clip_duration_sec | int | |
| quote_verbatim | text | Exact verbatim — never paraphrased |
| clip_type | text | soundbite / one_liner / extended_quote / full_segment |
| platform_fit | text[] | youtube_shorts / instagram_reels / tiktok / x_twitter / facebook |
| editorial_notes | text | |
| vertical_version_created | boolean | |
| status | text | identified → rendered → posted |
| created_at | timestamptz | |

**Rule:** One clip per guest default. Select the single best soundbite. Quote must be verbatim.

---

### `social_posts` (applied)

What actually goes live on social platforms.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | Nullable |
| content_clip_id | uuid FK → content_clips | Nullable |
| platform | text | youtube_shorts / instagram / tiktok / facebook / x_twitter / rumble |
| post_type | text | clip_promo / episode_promo / quote_graphic / guest_spotlight / science_fact / engagement_post / carousel / behind_the_scenes / archive_resurface / other |
| post_caption | text | |
| hashtags | text[] | ~6–10 per post |
| status | text | draft → scheduled → posted |
| scheduled_at, posted_at | timestamptz | |
| post_url | text | |
| created_at | timestamptz | |

---

### `regenerate_attempts` (applied)

Rate-limiting table for `/api/regenerate`. Rolling 1-hour window per user, max 20 requests.

---

## Views

### `v_episode_master`
Flat JOIN view — all data in one query, ordered by show sequence. Powers the "massive spreadsheet."

### `v_episode_workflow`
Computed due dates + boolean flags for both guests' email lifecycle. Returns one row per episode with filming_datetime, computed zoom_link_due / post_shoot_followup_due / pre_air_notification_due / post_air_youtube_due, and boolean sent flags.

---

## Security & Performance (migration 20260528004000)

- **Views** are `SECURITY INVOKER` — querying user's RLS applies
- **Duplicate unique constraints** on `episodes` and `graphics_variations` dropped
- **`toggle_propresenter_added`** has pinned `search_path = ''`
- **RLS policies** use `(select auth.role())` / `(select auth.uid())` to avoid per-row re-evaluation

---

## Pending Renames (coordinate with dashboard code changes)

| Current name | Future name | Blocker |
|---|---|---|
| `graphics` | `lower_thirds` | All route handlers and server actions reference `graphics` — rename migration + code update must ship together |
| `graphics_variations` | `lower_thirds_variations` | Same — batch with above |
| `episodes.guest_name` | (remove) | Keep until episode_guests is confirmed working in production; drop after Stage 8 |

---

## What's NOT in this schema (intentional deferrals)

| Topic | Decision |
|-------|----------|
| ProPresenter API sync table | Phase 2. Current: manual copy from `/approved` page |
| RC API sync table | Phase 3. Current: Daniel pastes from dashboard into RC |
| Viewer Voices full tracking | Separate project, not part of GSR automation pipeline |
| CTN / WWN shows | Separate schema pass — deferred until GSR hub is stable |
| emails_log | Replaced by `email_threads` table in the pending batch above |

---

## Integration Map

| System | How it connects |
|--------|----------------|
| **Rundown Creator** | `episodes.rc_rundown_id` + `production_graphics.rc_row_label` |
| **ProPresenter** | `graphics.propresenter_added` tracks load state. Manual copy from `/approved`. |
| **Google Drive** | `episodes.drive_folder_url`, `production_graphics.drive_file_url`, `premade_library.drive_file_url` |
| **YouTube** | `episodes.youtube_url` + `distributions` platform=youtube |
| **Podcast** | `distributions` platform=fireside_podcast → RSS → Spotify + Apple Podcasts |
| **StreamHoster / Roku / etc.** | `distributions` platform=streamhoster — one upload feeds 4 surfaces |
| **Signiant / Real Life Network** | `distributions` platform=real_life_network |
| **Social platforms** | `social_posts` + `content_clips` |
| **Guest outreach** | `guests` + `episode_guests` + `outreach_drafts` + `email_threads` + `filming_schedule` |
| **Research pipeline** | `articles` + `article_guest_recommendations` + `interview_prep` |

---

## Migration Log

### Applied (31)

```
20260526070128  feature_1_lower_thirds_schema
20260526070138  feature_1_lower_thirds_rls
20260526070152  feature_1_lower_thirds_storage
20260526084606  feature_1_propresenter_added_flag
20260526120000  baseline_rls
20260526120100  storage_bucket_hardening
20260526120200  regenerate_rate_limit
20260526120300  propresenter_atomic_toggle
20260527030000  add_font_fields_to_graphics
20260527030100  episodes_season_episode_unique
20260527040000  audit_fixes
20260527050000  add_show_intro_segment
20260527050100  add_l3_type_and_variants
20260528000000  enhance_episodes
20260528000100  enhance_graphics
20260528000200  add_guests
20260528000300  add_episode_guests
20260528000400  add_interview_prep
20260528000500  master_view
20260528001000  enhance_episodes_metadata
20260528001100  enhance_episode_guests_workflow
20260528001200  add_distributions
20260528001300  add_transcripts
20260528001400  workflow_view
20260528002000  expand_distributions_platforms
20260528002100  enhance_episodes_extended_metadata
20260528002200  fix_workflow_view_timing
20260528003000  correct_distributions_platforms
20260528003100  add_content_clips
20260528003200  add_social_posts
20260528004000  fix_advisor_issues
```

### Pending (7 new tables — write migrations after Daniel approves this plan)

```
[next]  add_production_graphics
[next]  add_premade_library
[next]  add_articles (with 8-dim scoring)
[next]  add_article_guest_recommendations
[next]  add_filming_schedule
[next]  add_outreach_drafts
[next]  add_email_threads
```

### Future (coordinate with code changes)

```
[future]  rename_graphics_to_lower_thirds  (requires dashboard code update)
[future]  rename_graphics_variations_to_lower_thirds_variations
[future]  drop_episodes_guest_name_column  (after Stage 8 confirms episode_guests works)
```
