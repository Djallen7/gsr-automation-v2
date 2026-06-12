# GSR Supabase Schema Design
*Synthesized from 879 conversation sessions, all applied migrations, and full Drive archive review. Updated 2026-05-28.*
*46 migrations applied. Supabase project: `lafkbxypmciopebentxp`.*

---

## The Central Idea

Everything lives under the **episode umbrella**. An episode is the unit of work — it has a shoot date, an air date, guests, graphics, research, distribution records, transcripts, content clips, and social posts. Every other entity links back to it.

```
episodes
  ├── graphics                         text chyrons (lower thirds) → ProPresenter
  │     └── graphics_variations         AI regeneration history
  ├── production_graphics              visual assets → Rundown Creator + Drive
  │     └── premade_library            reusable pre-made asset catalog
  ├── episode_guests                   placed interview slots — one row per slot per episode
  │     └── guests                     person roster, reused across episodes
  ├── booking_pipeline                 outreach tracking before episode placement (overflow guests too)
  ├── shoot_sessions                   monthly production cycle shoot days (1–3 per month)
  ├── interview_prep                   article sourcing + angle development per episode-guest
  ├── articles                         standalone article candidates (8-dim scored, 1 target guest each)
  ├── outreach_drafts                  email template library by tier
  ├── email_threads                    log of actual sent emails
  ├── distributions                    platform delivery tracking
  ├── transcripts                      Whisper/Deepgram or manual
  ├── content_clips                    30–60s soundbites for social
  │     └── social_posts               posted content — clip-based
  └── social_posts                     episode-level posts (promos, quote graphics)
```

All tables listed above have applied migrations as of the 48-migration live schema. The lower-thirds table is `production_lower_thirds` (renamed from `graphics` 2026-06-09; variations child table `lower_thirds_variations`); there is no `lower_thirds` table (only the storage bucket is named `lower-thirds`).

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
| guest_name | text | Legacy flat field, still actively written by `/api/import`. Must not be blind-dropped until the import route stops writing it. Prefer episode_guests + guests for reads. |
| rc_rundown_id | text | Rundown Creator numeric ID (e.g. "79" = May Show 1) |
| drive_folder_url | text | Google Drive episode folder URL |
| notes | text | |
| description | text | YouTube/social description |
| tags | text[] | Episode topic tags |
| thumbnail_url | text | Rendered thumbnail (Storage or CDN URL) |
| thumbnail_source_path | text | Drive path to raw thumbnail source asset |
| chapter_markers | jsonb | `[{"label":"...", "timecode":"HH:MM:SS"}]` |
| youtube_url | text | Live YouTube link once published |
| youtube_published_at | timestamptz | Actual YouTube publish time |
| webstream_scheduled_publish_at | timestamptz | Target webstream release time, the weekly Monday 4PM ET drop that fans out to all platforms (YouTube, Rumble, StreamHoster, GSN, podcast). Default Monday 4PM ET. Replaces youtube_scheduled_publish_at via expand-contract. |
| youtube_scheduled_publish_at | timestamptz | DEPRECATED: superseded by webstream_scheduled_publish_at. Still present during expand-contract; dropped in a later migration after deploy. |
| rumble_url | text | Rumble video link |
| podcast_url | text | Fireside.fm episode link |
| created_at | timestamptz | |

**RC IDs for Season 3 May cycle:** Show 1=79, Show 2=81, Show 3=83, Show 4=82, Show 5=84
**Drive folder pattern:** `05_May (Ep 21-25)/[subfolder]`

---

### `graphics`

**The table is and remains `graphics`.** There is no `lower_thirds` table; that name is a documented phantom. Every route handler and server action queries `graphics`. The only object named `lower-thirds` is the Storage bucket.

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

### `graphics_variations`

The table is and remains `graphics_variations`; there is no `lower_thirds_variations` table (a documented phantom). Tracks every AI-generated and human-written alternative text for a graphic. Variation 1 is auto-created on import.

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
| is_christian | boolean | Professing Christian; null = unknown. false = secular guest — brief David to stay on science, avoid biblical claims |
| is_yec | boolean | Young Earth Creationist; false = apply science-first framing, avoid age/cosmology topics |
| expertise_tags | text[] | Structured tag array e.g. `{"astrophysics","cosmology"}` — for filtering |
| credentials_display | text | Display-ready credential string e.g. "Ph.D., Astrophysics, ICR" |
| timezone | text | IANA timezone e.g. "America/Chicago" |
| location_city | text | City/state e.g. "Dallas, TX" |
| website | text | Personal or institutional website |
| source | text | How we found them (referral, ICR, own search, etc.) |
| is_deceased | boolean DEFAULT false | Prevents accidental outreach |
| do_not_contact | boolean DEFAULT false | Hard stop — never contact again |
| sensitive_flag | boolean DEFAULT false | Flag for guests needing special handling |
| sensitive_notes | text | Context on the sensitivity |
| re_approach_after | date | Don't reach out until after this date |
| re_approach_notes | text | Why to wait and what to say when re-approaching |
| communication_notes | text | Responsiveness, on-air performance, scheduling ease |
| notes | text | |
| created_at | timestamptz | |

**Note:** Most guests are YEC Christians; GSR is slowly expanding to non-Christian scientists to cover a wider topic range. When `is_christian = false`, David is briefed to lean on science-first framing and stewardship/design angles rather than biblical authority.

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

### `production_graphics` (applied)

**Separate workflow from the `graphics` (lower thirds) table.** These are visual assets (b-roll, title cards, images) that appear in Rundown Creator rows, assigned to Isaac's graphics queue. NOT text chyrons.

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

### `premade_library` (applied)

Catalog of reusable pre-made b-roll loops and graphics built up over several years. The assets live on the production server (VideoEdit); Drive may have copies. Production graphics rows reference this when they use a pre-made asset. Primary sources are **Envato Elements** and **Storyblocks**.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text NOT NULL | Short identifier e.g. "Galaxy Flythrough Loop 1" |
| description | text | What it looks like / when to use it |
| asset_type | text CHECK | b_roll_loop / title_graphic / graphic / clip_with_audio / other |
| is_loop | boolean DEFAULT true | True for b-roll loops (the primary asset type here) |
| duration_sec | int | Loop duration in seconds; null for stills/graphics |
| source | text CHECK | envato / storyblocks / nasa_svs / creation_com / own_production / other |
| source_url | text | Origin catalog URL (Envato/Storyblocks item page) |
| license_type | text | subscription_envato / subscription_storyblocks / public_domain / own / other |
| server_file_path | text | Path on VideoEdit server e.g. `/GSR/Broll/Space/galaxy_flythrough_01.mp4` |
| drive_file_url | text | Drive copy URL if backed up there |
| tags | text[] | Searchable tags e.g. `{"space", "galaxy", "stars", "creation"}` |
| resolution | text | e.g. "1920x1080", "3840x2160" |
| notes | text | Quality notes, preferred use cases, restrictions |
| created_at | timestamptz | |

**Asset type check values:** `b_roll_loop`, `title_graphic`, `graphic`, `clip_with_audio`, `other`
**Source check values:** `envato`, `storyblocks`, `nasa_svs`, `creation_com`, `own_production`, `other`

---

### `articles` (applied)

Standalone article candidates for the research pipeline. Each article has **one target guest** — the person best suited to discuss it. When the article is used in an episode, an `interview_prep` row is created linking the article to the episode+guest.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| url | text UNIQUE | Source article URL |
| title | text NOT NULL | |
| source_publication | text | e.g. "Nature", "ICR.org", "Science Daily" |
| published_date | date | |
| summary | text | |
| key_points | text | Bullet notes on the most interesting claims |
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
| recommended_guest_id | uuid FK → guests | The one target guest identified for this article (nullable — may not be found yet) |
| outreach_framing_notes | text | How to pitch the article to the guest — worldview framing, known friction points, backup guest if target passes |
| status | text | scout → approved → outreach_sent → booked → used → archived |
| added_by | uuid FK → auth.users | |
| created_at | timestamptz | |

**Scoring rubric:** each dimension 0–10, max total 80. Score ≥ 60 is broadcast-ready. Score ≥ 40 with strong guest fit warrants development.

**One article → one guest.** This is a direct column, not a junction table. If the target guest declines, update `recommended_guest_id` to the backup and revise `outreach_framing_notes`.

---

### `shoot_sessions` (applied)

Each month's production cycle has 1–3 separate shoot days (e.g. May has May 28, May 29, and June 15 overflow). This table tracks those days. `episode_guests.filming_datetime` points to the specific timeslot within a session.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| season | int NOT NULL | e.g. 3 |
| production_month | int NOT NULL | 1–12 (the month this cycle is producing for) |
| session_date | date NOT NULL | Actual shoot day |
| label | text | Display label e.g. "May 28th AM", "June 15th overflow" |
| location | text | zoom / in_studio / pre_recorded |
| notes | text | |
| created_at | timestamptz | |

UNIQUE on `(season, production_month, session_date)`.

**Why overflow sessions span into the next month:** if May fills up (5 episodes × 2 interviews = 10 slots), confirmed guests overflow to a June shoot session that still feeds May episodes airing later. The `production_month` field captures which airing cycle the session belongs to, not which calendar month it's shot in.

---

### `booking_pipeline` (applied)

Tracks the full outreach lifecycle before a guest is placed on a specific episode. This is the replacement for the ALT rows in the current monthly spreadsheet — confirmed guests waiting for episode placement, plus all outreach-in-progress.

When a guest is confirmed and placed on an episode, the `episode_guests` row is created and `booking_pipeline.episode_guest_id` is filled in. Until then, `episode_guest_id` is null.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| guest_id | uuid FK → guests NOT NULL | |
| article_id | uuid FK → articles | The article they're being invited to discuss (nullable) |
| outreach_tier | text CHECK | cold / warm / returning / recurring / direct |
| status | text CHECK | outreach_sent / replied / confirmed / placed / declined / no_show / deferred |
| target_season | int | Season they're being recruited for |
| target_month | int | 1–12 — the production cycle (not necessarily the shoot month) |
| shoot_session_id | uuid FK → shoot_sessions | Assigned shoot session once confirmed |
| episode_guest_id | uuid FK → episode_guests | Filled when placed on a specific episode |
| outreach_sent_at | timestamptz | When initial email went out |
| last_contact_at | timestamptz | Most recent contact in either direction |
| notes | text | Scheduling notes, location, timezone issues |
| created_by | uuid FK → auth.users | |
| created_at | timestamptz | |

**Status values:**
| Value | Meaning |
|---|---|
| `outreach_sent` | Email sent, no reply yet |
| `replied` | Guest replied but not confirmed |
| `confirmed` | Confirmed the date — may not have an episode assigned yet (overflow) |
| `placed` | episode_guest_id is set; slot assigned |
| `declined` | Guest said no |
| `no_show` | Did not show for confirmed session |
| `deferred` | Pushed to a future month's cycle |

---

### `outreach_drafts` (applied)

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

### `email_threads` (applied)

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

**Platform values (live 9-value enum: youtube, rumble, dropbox, fireside_podcast, real_life_network, streamhoster, genesis_science_network, social_clip, other):**
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

## Column lifecycle notes

| Item | Status |
|---|---|
| `graphics` / `graphics_variations` | Final names. No rename is planned; the `lower_thirds` / `lower_thirds_variations` names are documented phantoms that do not exist in the schema. |
| `episodes.guest_name` | Still actively written by `/api/import`. Must not be blind-dropped until the import route stops writing it. |

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
| **Guest outreach** | `guests` + `episode_guests` + `outreach_drafts` + `email_threads` |
| **Research pipeline** | `articles` + `interview_prep` (article-to-guest link is the direct FK `articles.recommended_guest_id`; no junction table) |

---

## Migration Log

### Applied (46)

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
20260528010000  enhance_guests_schema  (is_deceased, do_not_contact, sensitive_flag, re_approach_after, credentials_display, source, website)
20260528010100  add_expertise_tags_to_guests
20260528005000  enhance_guests  (is_christian, timezone, location_city)
20260528005100  add_premade_library
20260528005200  add_shoot_sessions
20260528005300  add_articles  (8-dim scoring, recommended_guest_id, total_score generated)
20260528005400  add_production_graphics  (11 types, 4 statuses, set_updated_at trigger)
20260528005500  add_outreach_drafts
20260528005600  add_booking_pipeline
20260528005700  add_email_threads
20260528005800  enhance_interview_prep_article_link
```

### Future (coordinate with code changes)

```
[future]  drop_episodes_guest_name_column  (only after /api/import stops writing guest_name)
```

No table rename is planned. The `lower_thirds` / `lower_thirds_variations` names are documented phantoms; the live tables are `graphics` and `graphics_variations`.
