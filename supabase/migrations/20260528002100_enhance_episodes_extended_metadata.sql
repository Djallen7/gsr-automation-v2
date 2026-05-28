-- Additional episode metadata fields surfaced by archaeology
-- youtube_scheduled_publish_at: default Monday 4PM ET (Daniel's standing schedule rule)
-- thumbnail_source_path: local path on VideoEdit server / Drive (thumbnails live inside episode folder)

ALTER TABLE episodes
  ADD COLUMN IF NOT EXISTS youtube_scheduled_publish_at timestamptz,
  ADD COLUMN IF NOT EXISTS thumbnail_source_path        text;

COMMENT ON COLUMN episodes.youtube_scheduled_publish_at IS 'Default: next available Monday 4:00 PM ET. Override when needed.';
COMMENT ON COLUMN episodes.thumbnail_source_path IS 'Path to thumbnail PNG/JPG on VideoEdit server or Drive. Spec: 1280x720, under 2MB.';
