-- Enhance episodes table with production workflow fields
-- Non-breaking: all columns nullable except production_status (has default)

ALTER TABLE episodes
  ADD COLUMN IF NOT EXISTS shoot_date       date,
  ADD COLUMN IF NOT EXISTS production_status text NOT NULL DEFAULT 'planned'
    CHECK (production_status IN (
      'planned',    -- on calendar, not yet in prep
      'in_prep',    -- scripting / booking underway
      'shot',       -- recorded, in post
      'in_post',    -- editing / graphics / L3 work
      'scheduled',  -- locked air date, ready
      'aired'       -- published
    )),
  ADD COLUMN IF NOT EXISTS rc_rundown_id    text,
  ADD COLUMN IF NOT EXISTS drive_folder_url text,
  ADD COLUMN IF NOT EXISTS notes            text;

-- Index for the common "show me everything for this production cycle" query
CREATE INDEX IF NOT EXISTS episodes_production_status_idx
  ON episodes (production_status, air_date);

COMMENT ON COLUMN episodes.shoot_date IS 'Day the episode was recorded (may differ from air_date by weeks)';
COMMENT ON COLUMN episodes.rc_rundown_id IS 'Rundown Creator numeric ID, e.g. 79 for May Show 1';
COMMENT ON COLUMN episodes.drive_folder_url IS 'Google Drive folder URL for this episode''s assets';
