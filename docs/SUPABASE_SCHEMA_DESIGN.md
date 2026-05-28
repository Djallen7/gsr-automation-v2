# GSR Supabase Schema Design
*Synthesized from 879 conversation sessions, 13 existing migrations, and FEATURE_1 spec. Updated 2026-05-28.*

---

## The Central Idea

Everything lives under the **episode umbrella**. An episode is the unit of work — it has a shoot date, an air date, guests, graphics, research, and emails. Every other entity links back to it.

```
episodes
  ├── graphics          (lower thirds + all L3 types, ordered by segment/beat)
  │     └── graphics_variations  (AI regeneration history)
  ├── episode_guests    (booking records)
  │     └── guests             (person roster, reused across episodes)
  └── interview_prep    (article sourcing + angle development per guest)
```

The `v_episode_master` view joins all of this into a single flat query — the "massive spreadsheet" for the dashboard.

---

## Tables

### `episodes` (existing + enhanced)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| season | int | e.g. 3 |
| episode_number | int | e.g. 21; unique with season |
| title | text | Episode topic hook |
| air_date | date | Tuesday broadcast date |
| **shoot_date** | date | **NEW** — recording day (often weeks before air) |
| **production_status** | text | **NEW** — planned → in_prep → shot → in_post → scheduled → aired |
| guest_name | text | Legacy denormalized field — kept for Feature 1 compatibility |
| **rc_rundown_id** | text | **NEW** — Rundown Creator numeric ID (e.g. "79" = May Show 1) |
| **drive_folder_url** | text | **NEW** — Google Drive episode folder URL |
| **notes** | text | **NEW** — freeform production notes |
| created_at | timestamptz | |

**Naming conventions from archaeology:**
- RC rundown titles: "May Show 1 | S03_Ep021"
- RC IDs for May cycle: Show 1=79, Show 2=81, Show 3=83, Show 4=82, Show 5=84
- Drive folder format: `05_May (Ep 21-25)/[subfolder]`

---

### `graphics` (existing + enhanced)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| episode_id | uuid FK → episodes | |
| segment | graphic_segment enum | 12 values including show_intro |
| l3_type | text (CHECK) | 15 type values |
| beat_number | int | Order within segment, starts at 1 |
| initial_text | text | Primary L3 text (55–65 chars, ALL CAPS) |
| var_1, var_2 | text | Alternate copy lines (3-col system) |
| status | graphic_status enum | pending_review → approved / rejected |
| current_image_url | text | `__text_only__` sentinel for text-only imports |
| propresenter_added | boolean | Toggled via atomic RPC after copy to ProPresenter |
| font_family, font_size_pt, font_color | text/int | Per-graphic font overrides |
| **notes** | text | **NEW** — freeform note on this specific graphic |
| **asset_source_urls** | text[] | **NEW** — candidate URLs for footage/image sourcing |
| **source_doc** | text | **NEW** — source script/doc reference (was buried in variations.generation_context) |
| uploaded_by, approved_by | uuid FK → auth.users | |
| uploaded_at, approved_at | timestamptz | |

**Asset sourcing URLs are stored as a Postgres array (`text[]`)** — no join table needed. Query with `ANY(asset_source_urls)`. Typical sources: Storyblocks, Artgrid, NASA SVS, Pond5, Pexels/Pixabay.

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
| guest_id | uuid FK → guests | CASCADE delete |
| segment | text | interview_1 or interview_2 |
| booking_status | text | outreach → confirmed → shot → aired (or declined / no_show) |
| filming_datetime | timestamptz | Confirmed Zoom time |
| zoom_location | text | Zoom link or 'in-studio' |
| resource_verified | boolean | creationsuperstore.com product confirmed |
| resource_url | text | URL if found; null = offer website plug instead |
| appearance_notes | text | Post-appearance notes for future booking decisions |
| created_at | timestamptz | |

UNIQUE constraint on `(episode_id, segment)` — one guest per slot.

---

### `interview_prep` (NEW)

Article sourcing and angle development per episode-guest. Multiple rows allowed per episode (multiple candidate articles/angles).

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

### `graphics_variations` (existing, no changes)

Tracks every AI-generated and human-written alternative text for a graphic. Variation 1 is auto-created on import.

---

### `regenerate_attempts` (existing, no changes)

Rate-limiting table for `/api/regenerate`. Rolling window per user.

---

## Master View: `v_episode_master`

A flat JOIN view that powers the "massive spreadsheet" — all data in one query, ordered by show sequence.

```sql
SELECT * FROM v_episode_master
WHERE season = 3 AND episode_number = 21;
```

Returns one row per graphic, with episode context, guest context, and all L3 fields side by side. Column order mirrors the show's run-of-show sequence (show_intro → monologue → interview_1 → heavens_declare → kids_corner → qa → ministry → gsm → viewer_voices → featured_resource → interview_2).

---

## What's NOT in this schema (intentional)

| Topic | Decision |
|-------|----------|
| `emails_log` | Deferred to Phase 1A (post-Feature 1 ship). Add when dashboard email workflow is built. |
| ProPresenter API sync table | Phase 2. Current workflow: copy text manually from `/approved` page. |
| RC API sync table | Phase 3. Current workflow: Daniel pastes from dashboard into RC. |
| Viewer Voices full tracking | Separate project — not part of GSR automation pipeline. |
| Post-production distribution | Separate project — Miryam + Isaac workflow, not Daniel's. |

---

## Integration Map

| System | How it connects to this schema |
|--------|-------------------------------|
| **Rundown Creator** | `episodes.rc_rundown_id` → use to fetch/write rows via RC API. Graphics text from `graphics.initial_text`. Two-pass workflow: Pass 1 = graphics list, Pass 2 = timers. |
| **ProPresenter** | `graphics.propresenter_added` tracks what's been loaded. `font_family/size/color` override per graphic. Manual copy from `/approved` page (Phase 2: API push). |
| **Google Drive** | `episodes.drive_folder_url` links to episode folder. `graphics.source_doc` points to script doc within that folder. |
| **Dashboard** | All tables have RLS + authenticated policies. `v_episode_master` view for unified display. |
| **Guest email outreach** | `guests` + `episode_guests.booking_status` tracks the outreach lifecycle. Email content in Claude Desktop (not stored here until Phase 1A). |

---

## Migration Order

Apply in this sequence — each is idempotent:

```
20260528000000_enhance_episodes.sql
20260528000100_enhance_graphics.sql
20260528000200_add_guests.sql
20260528000300_add_episode_guests.sql
20260528000400_add_interview_prep.sql
20260528000500_master_view.sql
```

Run `list_migrations` after applying each one to verify.

**None of these break existing Feature 1 functionality** — all changes are additive (new columns with defaults, new tables, new view).
