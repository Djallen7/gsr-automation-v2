-- Build Task 1: rename graphics -> production_lower_thirds
-- Decisions locked 2026-06-09. One concern, idempotent DDL.

-- ============================================================
-- 1. Drop the view that references the dropped columns first
-- ============================================================
DROP VIEW IF EXISTS public.v_episode_master;

-- ============================================================
-- 2. Rename tables
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'graphics') THEN
    ALTER TABLE public.graphics RENAME TO production_lower_thirds;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'graphics_variations') THEN
    ALTER TABLE public.graphics_variations RENAME TO lower_thirds_variations;
  END IF;
END $$;

-- ============================================================
-- 3. Drop obsolete columns from production_lower_thirds
--    (lower thirds are text-only, confirmed 2026-06-09)
-- ============================================================
ALTER TABLE public.production_lower_thirds
  DROP COLUMN IF EXISTS current_image_url,
  DROP COLUMN IF EXISTS asset_source_urls,
  DROP COLUMN IF EXISTS var_1,
  DROP COLUMN IF EXISTS var_2;

-- ============================================================
-- 4. Add ordering columns to production_lower_thirds
-- ============================================================
ALTER TABLE public.production_lower_thirds
  ADD COLUMN IF NOT EXISTS segment_order int,
  ADD COLUMN IF NOT EXISTS l3_type_order int,
  ADD COLUMN IF NOT EXISTS line_number int;

-- ============================================================
-- 5. Update toggle_propresenter_added function
-- ============================================================
CREATE OR REPLACE FUNCTION public.toggle_propresenter_added(p_graphic_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new boolean;
BEGIN
  UPDATE public.production_lower_thirds
  SET propresenter_added = NOT COALESCE(propresenter_added, false)
  WHERE id = p_graphic_id
  RETURNING propresenter_added INTO v_new;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'lower third not found: %', p_graphic_id
      USING errcode = 'P0002';
  END IF;

  RETURN v_new;
END;
$$;

-- ============================================================
-- 6. Recreate v_episode_master without dropped columns
-- ============================================================
CREATE OR REPLACE VIEW public.v_episode_master AS
SELECT
  e.id AS episode_id,
  e.season,
  e.episode_number,
  e.title AS episode_title,
  e.air_date,
  e.shoot_date,
  e.production_status,
  e.rc_rundown_id,
  e.drive_folder_url,
  e.notes AS episode_notes,
  g2.title AS guest_title,
  g2.first_name AS guest_first_name,
  g2.last_name AS guest_last_name,
  g2.organization AS guest_organization,
  eg.segment AS guest_segment,
  eg.booking_status,
  eg.filming_datetime,
  lt.id AS graphic_id,
  lt.segment AS graphic_segment,
  lt.l3_type,
  lt.beat_number,
  lt.initial_text,
  lt.status AS graphic_status,
  lt.propresenter_added,
  lt.notes AS graphic_notes,
  lt.source_doc,
  lt.font_family,
  lt.font_size_pt,
  lt.font_color,
  lt.segment_order,
  lt.l3_type_order,
  lt.line_number,
  length(lt.initial_text) AS char_count
FROM episodes e
LEFT JOIN public.production_lower_thirds lt ON (lt.episode_id = e.id)
LEFT JOIN episode_guests eg ON (
  eg.episode_id = e.id AND eg.segment =
  CASE
    WHEN lt.segment = 'interview_1'::graphic_segment THEN 'interview_1'
    WHEN lt.segment = 'interview_2'::graphic_segment THEN 'interview_2'
    ELSE eg.segment
  END
)
LEFT JOIN guests g2 ON (g2.id = eg.guest_id)
ORDER BY
  e.season,
  e.episode_number,
  CASE lt.segment
    WHEN 'show_intro'::graphic_segment THEN 1
    WHEN 'opening_monologue'::graphic_segment THEN 2
    WHEN 'interview_1'::graphic_segment THEN 3
    WHEN 'heavens_declare'::graphic_segment THEN 4
    WHEN 'kids_corner'::graphic_segment THEN 5
    WHEN 'genesis_science_qa'::graphic_segment THEN 6
    WHEN 'ministry_report'::graphic_segment THEN 7
    WHEN 'genesis_science_minute'::graphic_segment THEN 8
    WHEN 'viewer_voices'::graphic_segment THEN 9
    WHEN 'featured_resource'::graphic_segment THEN 10
    WHEN 'interview_2'::graphic_segment THEN 11
    ELSE 99
  END,
  lt.beat_number;

-- ============================================================
-- 7. production_graphics: add display_duration + last_line
-- ============================================================
ALTER TABLE public.production_graphics
  ADD COLUMN IF NOT EXISTS display_duration int,
  ADD COLUMN IF NOT EXISTS last_line text;

-- ============================================================
-- 8. production_graphics: fix graphic_type CHECK
--    Add Intro Graphic + Book Cover; retire Title Graphic
-- ============================================================
ALTER TABLE public.production_graphics
  DROP CONSTRAINT IF EXISTS production_graphics_graphic_type_check;

ALTER TABLE public.production_graphics
  ADD CONSTRAINT production_graphics_graphic_type_check
  CHECK (graphic_type = ANY (ARRAY[
    'Intro Graphic',
    'Book Cover',
    'B-roll',
    'Pre-made: B-roll',
    'Pre-made: Graphic',
    'Clip w/audio',
    'Article Screenshot',
    'Picture',
    'Propres Quote',
    'Propres Graphic',
    'Roll-in',
    'Graphic'
  ]));

-- Migrate any legacy Title Graphic rows
UPDATE public.production_graphics
  SET graphic_type = 'Intro Graphic'
  WHERE graphic_type = 'Title Graphic';

-- ============================================================
-- 9. production_graphics: fix status CHECK to canonical order
-- ============================================================
ALTER TABLE public.production_graphics
  DROP CONSTRAINT IF EXISTS production_graphics_status_check;

ALTER TABLE public.production_graphics
  ADD CONSTRAINT production_graphics_status_check
  CHECK (status = ANY (ARRAY[
    'Not Started',
    'In Progress',
    'Created',
    'Loaded In'
  ]));
