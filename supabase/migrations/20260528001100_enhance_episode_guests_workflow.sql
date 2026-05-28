-- Email workflow timestamps on episode_guests
-- Tracks WHEN each guest communication was actually sent
-- Target dates are computed from episodes.shoot_date and episodes.air_date — not stored

ALTER TABLE episode_guests
  ADD COLUMN IF NOT EXISTS interview_confirmation_sent_at  timestamptz,
  ADD COLUMN IF NOT EXISTS day_before_reminder_sent_at     timestamptz,
  ADD COLUMN IF NOT EXISTS zoom_link_sent_at               timestamptz,
  ADD COLUMN IF NOT EXISTS post_shoot_followup_sent_at     timestamptz,
  ADD COLUMN IF NOT EXISTS pre_air_notification_sent_at    timestamptz,
  ADD COLUMN IF NOT EXISTS post_air_youtube_sent_at        timestamptz;

-- Computed due dates (reference only — logic lives in the workflow view):
-- zoom_link_due               = episodes.shoot_date (day of recording)
-- post_shoot_followup_due     = episodes.shoot_date + 3 days
-- pre_air_notification_due    = episodes.air_date - 1 day (night before air)
-- post_air_youtube_due        = episodes.youtube_published_at + 2 days

COMMENT ON COLUMN episode_guests.zoom_link_sent_at            IS 'Due: shoot day. Send Zoom link + join 15 min early instruction.';
COMMENT ON COLUMN episode_guests.post_shoot_followup_sent_at  IS 'Due: shoot_date +3 days. Thank guest, give estimated air date.';
COMMENT ON COLUMN episode_guests.pre_air_notification_sent_at IS 'Due: air_date -1 day. Include air time (Tue 8PM Central), Roku/Fire TV/Rumble/GSN. No YouTube yet.';
COMMENT ON COLUMN episode_guests.post_air_youtube_sent_at     IS 'Due: ~2 days after youtube_published_at. Include YouTube URL + view count if notable.';
