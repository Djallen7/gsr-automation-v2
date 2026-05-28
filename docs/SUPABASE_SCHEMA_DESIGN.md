# GSR Supabase Schema Design
*Synthesized from 879 conversation sessions and all applied migrations. Updated 2026-05-28.*
*28 migrations applied. Supabase project: `lafkbxypmciopebentxp`.*

---

## The Central Idea

Everything lives under the **episode umbrella**. An episode is the unit of work — it has a shoot date, an air date, guests, graphics, research, distribution records, transcripts, content clips, and social posts. Every other entity links back to it.

```
episodes
  ├── graphics            (lower thirds + all L3 types, ordered by segment/beat)
  │     └── graphics_variations   (AI regeneration history)
  ├── episode_guests      (booking records — one row per slot per episode)
  │     └── guests               (person roster, reused across episodes)
  ├── interview_prep      (article sourcing + angle development per guest)
  ├── distributions       (platform delivery tracking — 6 real platforms)
  ├── transcripts         (Whisper/Deepgram or manual — one per episode or per segment)
  ├── content_clips       (30–60s soundbites for social short-form)
  │     └── social_posts         (what actually gets posted to Instagram/TikTok/etc.)
  └── social_posts        (episode-level posts — episode promos, quote graphics, etc.)
```

Two views centralize operational data:
- **`v_episode_master`** — flat JOIN of all tables, ordered by show sequence. The "massive spreadsheet."
- **`v_episode_workflow`** — computed email due dates + boolean flags for both guests' lifecycle.

---

## Tables

### `episodes` (enhanced)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| season | int | e.g. 3 |
| episode_number | int | e.g. 21; UNIQUE with season |
| title | text | Episode topic hook |
| air_date | date | Tuesday broadcast date |
| shoot_date | date | Recording day (often weeks before air) |
| production_status | text | planned → in_prep → shot → in_post → scheduled → aired |
| guest_name | text | Legacy denormalized field — kept for Feature 1 compatibility |
| rc_rundown_id | text | Rundown Creator numeric ID (e.g. "79" = May Show 1) |
| drive_folder_url | text | Google Drive episode folder URL |
| notes | text | Freeform production notes |
| description | text | YouTube/social description |
| tags | text[] | Episode topic tags |
| thumbnail_url | text | Rendered thumbnail (Supabase Storage or CDN URL) |
| thumbnail_source_path | text | Drive path to raw thumbnail source asset |
| chapter_markers | jsonb | `[{"label":"...", "timecode":"HH:MM:SS"}]` |
| youtube_url | text | Live YouTube link once published |
| youtube_published_at | timestamptz | Actual publish time |
| youtube_scheduled_publish_at | timestamptz | Target publish time (default Monday 4PM ET) |
| rumble_url | text | Rumble video link |
| podcast_url | text | Fireside.fm episode link |
| created_at | timestamptz | |

**Naming conventions from archaeology:**
- RC rundown titles: "May Show 1 | S03_Ep021"
- RC IDs for May cycle: Show 1=79, Show 2=81, Show 3=83, Show 4=82, Show 5=84
- Drive folder format: `05_May (Ep 21-25)/[subfolder]`

---

### `graphics` (enhanced)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| segment | graphic_segment enum | 12 values including show_intro |
| l3_type | text (CHECK) | 15 type values |
| beat_number | int | Order within segment, starts at 1 |
| initial_text | text | Primary L3 text (55–65 chars, ALL CAPS) |
| var_1, var_2 | text | Alternate copy lines (3-col system) |
| status | graphic_status enum | pending_review → approved / rejected / needs_revision |
| current_image_url | text | `__text_only__` sentinel for text-only imports |
| propresenter_added | boolean | Toggled via atomic RPC after copy to ProPresenter |
| font_family, font_size_pt, font_color | text/int/text | Per-graphic font overrides |
| notes | text | Freeform note on this specific graphic |
| asset_source_urls | text[] | Candidate URLs for footage/image sourcing (Storyblocks, NASA SVS, etc.) |
| source_doc | text | Source script/doc reference |
| uploaded_by, approved_by | uuid FK → auth.users | |
| uploaded_at, approved_at | timestamptz | |

---

### `guests` (NEW)

One row per person. Reused across episodes.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| title | text | Dr., Mr., Ms. |
| first_name, last_name | text | |
| email, phone | text | |
| expertise | text | e.g. "Astrophysics, Cosmology" |
| job_title | text | |
| organization | text | |
| is_yec | boolean | false = apply science-first framing, avoid age/cosmology topics |
| communication_notes | text | Responsiveness, on-air performance, scheduling ease |
| notes | text | General notes |
| created_at | timestamptz | |

**Chyron format** (from L3 spec): `DR. JOHN SMITH | ICR | ASTROPHYSICS`
Built from: `{title} {last_name} | {organization} | {expertise}`

---

### `episode_guests` (NEW — junction)

Links a guest to an episode + interview slot. One row per slot per episode.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | CASCADE delete |
| guest_id | uuid FK → guests | |
| segment | text | interview_1 or interview_2 |
| booking_status | text | outreach → confirmed → shot → aired (or declined / no_show) |
| filming_datetime | timestamptz | Confirmed Zoom time |
| zoom_location | text | Zoom link or 'in-studio' |
| resource_verified | boolean | creationsuperstore.com product confirmed |
| resource_url | text | URL if found; null = offer website plug instead |
| appearance_notes | text | Post-appearance notes for future booking decisions |
| interview_confirmation_sent_at | timestamptz | Email timestamps — see email timing below |
| zoom_link_sent_at | timestamptz | |
| day_before_reminder_sent_at | timestamptz | |
| post_shoot_followup_sent_at | timestamptz | |
| pre_air_notification_sent_at | timestamptz | |
| post_air_youtube_sent_at | timestamptz | |
| created_at | timestamptz | |

UNIQUE constraint on `(episode_id, segment)` — one guest per slot.

**Email timing (from archaeology):**
- zoom_link = shoot day (same day as filming_datetime)
- post_shoot_followup = shoot_date + 1 day
- pre_air = air_date − 1 day
- youtube = youtube_published_at + 2 days

---

### `interview_prep` (NEW)

Article sourcing and angle development per episode-guest. Multiple rows allowed per episode.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| episode_guest_id | uuid FK → episode_guests | Nullable — can exist before guest is booked |
| article_url | text | Source article URL |
| article_title | text | |
| source_publication | text | e.g. "Nature", "ICR.org", "Science Daily" |
| article_summary | text | |
| angle_notes | text | TV viability rationale, why it fits GSR |
| talking_points | text | Raw notes or guest-provided points |
| lane | text | creation_science / astronomy / biology / genetics / geology / archaeology / other |
| status | text | researching → angle_approved → questions_drafted → questions_sent → complete |
| created_at | timestamptz | |

---

### `distributions` (NEW)

One row per episode per platform. Tracks upload status, timing, and view counts.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | CASCADE delete |
| platform | text | See platform list below |
| file_version | text | 'master', 'web', 'podcast', 'short' |
| status | text | pending → uploaded → scheduled → live → archived |
| platform_url | text | Live URL once published |
| scheduled_publish_at | timestamptz | When it's set to go live |
| uploaded_at | timestamptz | When file was delivered to platform |
| went_live_at | timestamptz | When it actually became public |
| view_count | int | Snapshot view count |
| view_count_checked_at | timestamptz | When view_count was last updated |
| notes | text | |
| created_at | timestamptz | |

UNIQUE on `(episode_id, platform, file_version)`.

**Real platforms (6 + extras):**
| Platform value | What it is |
|---|---|
| `youtube` | Main post: Monday 4PM ET, private until approved; 3 playlists |
| `rumble` | Secondary video; no API, browser automation only |
| `dropbox` | Network partner delivery; no metadata required |
| `fireside_podcast` | Podcast MP3; also feeds Spotify + Apple Podcasts via RSS |
| `real_life_network` | Signiant Media Shuttle delivery (also called RightNow Media) |
| `streamhoster` | FTP; feeds Roku, Apple TV, iOS app, LG TV (one upload) |
| `genesis_science_network` | genesissciencenetwork.com web stream |
| `social_clip` | Short-form clip (tracked here for episode-level status) |
| `other` | Catch-all |

---

### `transcripts` (NEW)

One row per episode (or per segment if broken out).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| segment | text | Nullable — null = full episode |
| transcript_text | text | Full text |
| generated_by | text | manual / auto_whisper / auto_deepgram / auto_other |
| source_file_url | text | Drive or Storage URL of source audio/video |
| notes | text | |
| created_at, updated_at | timestamptz | |

UNIQUE on `(episode_id, segment)`.

---

### `content_clips` (NEW)

30–60 second soundbites from an episode, used for social short-form content.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| episode_guest_id | uuid FK → episode_guests | Nullable — clips can come from non-interview segments |
| source_segment | text | interview_1 / interview_2 / opening_monologue / kids_corner / heavens_declare / genesis_science_minute / ministry_report / viewer_voices / other |
| timecode_in | text | HH:MM:SS:FF drop-frame timecode |
| timecode_out | text | HH:MM:SS:FF drop-frame timecode |
| clip_duration_sec | int | Calculated duration in seconds |
| quote_verbatim | text | Exact verbatim quote — never paraphrased |
| clip_type | text | soundbite / one_liner / extended_quote / full_segment |
| platform_fit | text[] | youtube_shorts, instagram_reels, tiktok, x_twitter, facebook |
| editorial_notes | text | Notes on why this clip was selected |
| vertical_version_created | boolean | Whether a 9:16 crop has been rendered |
| status | text | identified → rendered → posted |
| created_at | timestamptz | |

**Conventions from archaeology:**
- One clip per guest is the default; select the single best soundbite
- Timecodes are drop-frame format (HH:MM:SS:FF)
- Quote must be verbatim — never paraphrased or compressed

---

### `social_posts` (NEW)

What actually goes live on social platforms. Can link to a content_clip (clip promos) or stand alone (quote graphics, episode promos).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | Nullable |
| content_clip_id | uuid FK → content_clips | Nullable — clip-based posts link here |
| platform | text | youtube_shorts / instagram / tiktok / facebook / x_twitter / rumble |
| post_type | text | See post types below |
| post_caption | text | Full caption text (no em dashes) |
| hashtags | text[] | ~6–10 per post, separate from caption |
| status | text | draft → scheduled → posted |
| scheduled_at | timestamptz | When it's queued to go out |
| posted_at | timestamptz | When it actually went live |
| post_url | text | Link to live post |
| created_at | timestamptz | |

**Post types:**
`clip_promo`, `episode_promo`, `quote_graphic`, `guest_spotlight`, `science_fact`, `engagement_post`, `carousel`, `behind_the_scenes`, `archive_resurface`, `other`

---

### `graphics_variations` (existing, no changes)

Tracks every AI-generated and human-written alternative text for a graphic. Variation 1 is auto-created on import.

---

### `regenerate_attempts` (existing, no changes)

Rate-limiting table for `/api/regenerate`. Rolling window per user.

---

## Views

### `v_episode_master`

Flat JOIN view — all data in one query, ordered by show sequence. Powers the "massive spreadsheet" in the dashboard.

```sql
SELECT * FROM v_episode_master
WHERE season = 3 AND episode_number = 21;
```

Returns one row per graphic, with episode context, guest context, and all L3 fields side by side. Column order mirrors the show's run-of-show sequence.

### `v_episode_workflow`

Computed due dates + boolean flags for both guests' email lifecycle.

```sql
SELECT * FROM v_episode_workflow
WHERE episode_number = 21;
```

Returns one row per episode with:
- Both guests' name, email, booking_status, filming_datetime, zoom_location
- All 6 email sent timestamps for each guest
- Computed due dates: zoom_link_due, post_shoot_followup_due, pre_air_notification_due, post_air_youtube_due
- Boolean flags: zoom_sent, followup_sent, pre_air_done, youtube_done

---

## Security & Performance (migration 20260528004000)

All actionable advisor issues have been fixed:
- **Views** are `SECURITY INVOKER` — querying user's RLS applies, not view creator's
- **Duplicate unique constraints** on `episodes` and `graphics_variations` have been dropped
- **`toggle_propresenter_added`** has a pinned `search_path = ''` 
- **RLS policies** on `episodes`, `graphics`, `graphics_variations`, `regenerate_attempts` use `(select auth.role())` / `(select auth.uid())` to avoid per-row re-evaluation

---

## What's NOT in this schema (intentional)

| Topic | Decision |
|-------|----------|
| `emails_log` | Deferred to Phase 1A (post-Feature 1 ship). Add when dashboard email workflow is built. |
| ProPresenter API sync table | Phase 2. Current workflow: copy text manually from `/approved` page. |
| RC API sync table | Phase 3. Current workflow: Daniel pastes from dashboard into RC. |
| Viewer Voices full tracking | Separate project — not part of GSR automation pipeline. |
| CTN / WWN shows | Separate schema pass — separate show structure, deferred until GSR hub is stable. |

---

## Integration Map

| System | How it connects |
|--------|----------------|
| **Rundown Creator** | `episodes.rc_rundown_id` → fetch/write via RC API. Graphics text from `graphics.initial_text`. |
| **ProPresenter** | `graphics.propresenter_added` tracks load state. `font_family/size/color` override per graphic. Manual copy from `/approved` (Phase 2: API push). |
| **Google Drive** | `episodes.drive_folder_url` → episode folder. `graphics.source_doc` → script doc. `graphics.asset_source_urls` → source footage candidates. |
| **YouTube** | `episodes.youtube_url`, `youtube_published_at`, `youtube_scheduled_publish_at` + `distributions` platform=youtube row. |
| **Podcast platforms** | `distributions` platform=fireside_podcast + Fireside RSS feeds Spotify + Apple Podcasts automatically. |
| **StreamHoster / Roku / etc.** | `distributions` platform=streamhoster — one upload feeds Roku, Apple TV, iOS app, LG TV. |
| **Signiant / Real Life Network** | `distributions` platform=real_life_network (also called RightNow Media). |
| **Social platforms** | `social_posts` table tracks individual posts. `content_clips` tracks the source soundbites. |
| **Guest email outreach** | `guests` + `episode_guests.booking_status` + 6 email timestamps + `v_episode_workflow` computed due dates. |

---

## Migration Order (all 28 applied)

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
20260528000000  enhance_episodes (shoot_date, production_status, rc_id, drive_url, notes)
20260528000100  enhance_graphics (notes, asset_source_urls, source_doc)
20260528000200  add_guests
20260528000300  add_episode_guests (booking lifecycle + 6 email timestamps)
20260528000400  add_interview_prep
20260528000500  v_episode_master view
20260528001000  enhance_episodes_metadata (description, tags, youtube_url, youtube_published_at)
20260528001100  enhance_episode_guests_workflow (email timestamp columns)
20260528001200  add_distributions (6 real platforms + genesis_science_network + social_clip)
20260528001300  add_transcripts
20260528001400  v_episode_workflow view (computed email due dates)
20260528002100  enhance_episodes_extended_metadata (youtube_scheduled_publish_at, thumbnail_source_path)
20260528003000  correct_distributions_platforms (cleaned platform list to real 6)
20260528003100  add_content_clips
20260528003200  add_social_posts
20260528004000  fix_advisor_issues (security definer views, duplicate indexes, RLS initplan)
```
