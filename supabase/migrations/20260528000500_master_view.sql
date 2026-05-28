-- Master episode view: the "massive spreadsheet" — all data joined under episode umbrella
-- Read-only view; no RLS needed (underlying tables enforce access)

CREATE OR REPLACE VIEW v_episode_master AS
SELECT
  -- Episode identity
  e.id                  AS episode_id,
  e.season,
  e.episode_number,
  e.title               AS episode_title,
  e.air_date,
  e.shoot_date,
  e.production_status,
  e.rc_rundown_id,
  e.drive_folder_url,
  e.notes               AS episode_notes,
  -- Guest (primary slot; interview_1 takes precedence for display)
  g2.title              AS guest_title,
  g2.first_name         AS guest_first_name,
  g2.last_name          AS guest_last_name,
  g2.organization       AS guest_organization,
  eg.segment            AS guest_segment,
  eg.booking_status,
  eg.filming_datetime,
  -- Graphic / lower third
  g.id                  AS graphic_id,
  g.segment             AS graphic_segment,
  g.l3_type,
  g.beat_number,
  g.initial_text,
  g.var_1,
  g.var_2,
  g.status              AS graphic_status,
  g.propresenter_added,
  g.notes               AS graphic_notes,
  g.asset_source_urls,
  g.source_doc,
  g.font_family,
  g.font_size_pt,
  g.font_color,
  length(g.initial_text) AS char_count
FROM episodes e
LEFT JOIN graphics g ON g.episode_id = e.id
LEFT JOIN episode_guests eg ON eg.episode_id = e.id
  AND eg.segment = CASE
    WHEN g.segment = 'interview_1' THEN 'interview_1'
    WHEN g.segment = 'interview_2' THEN 'interview_2'
    ELSE eg.segment
  END
LEFT JOIN guests g2 ON g2.id = eg.guest_id
ORDER BY
  e.season,
  e.episode_number,
  CASE g.segment
    WHEN 'show_intro'           THEN  1
    WHEN 'opening_monologue'    THEN  2
    WHEN 'interview_1'          THEN  3
    WHEN 'heavens_declare'      THEN  4
    WHEN 'kids_corner'          THEN  5
    WHEN 'genesis_science_qa'   THEN  6
    WHEN 'ministry_report'      THEN  7
    WHEN 'genesis_science_minute' THEN 8
    WHEN 'viewer_voices'        THEN  9
    WHEN 'featured_resource'    THEN 10
    WHEN 'interview_2'          THEN 11
    ELSE 99
  END,
  g.beat_number;
