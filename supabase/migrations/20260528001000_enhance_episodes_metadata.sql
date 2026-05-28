-- Episode metadata: YouTube/platform description, tags, thumbnail, chapter markers
-- Episode platform URLs: YouTube, Rumble, podcast (Fireside)
-- All nullable — populated post-production

ALTER TABLE episodes
  ADD COLUMN IF NOT EXISTS description         text,
  ADD COLUMN IF NOT EXISTS tags                text[]     DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS thumbnail_url       text,
  ADD COLUMN IF NOT EXISTS chapter_markers     jsonb      DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS youtube_url         text,
  ADD COLUMN IF NOT EXISTS youtube_published_at timestamptz,
  ADD COLUMN IF NOT EXISTS rumble_url          text,
  ADD COLUMN IF NOT EXISTS podcast_url         text;

-- chapter_markers format: [{"time": "0:00", "label": "Introduction"}, {"time": "3:45", "label": "Interview 1"}, ...]

COMMENT ON COLUMN episodes.description          IS 'YouTube/platform description copy';
COMMENT ON COLUMN episodes.tags                 IS 'YouTube/platform tags array';
COMMENT ON COLUMN episodes.chapter_markers      IS 'Timecodes array: [{time, label}]';
COMMENT ON COLUMN episodes.youtube_url          IS 'Permanent YouTube URL — populated after upload, used in post-air guest emails';
COMMENT ON COLUMN episodes.youtube_published_at IS 'When YouTube video went live — triggers post-air email window';
COMMENT ON COLUMN episodes.rumble_url           IS 'Rumble video URL';
COMMENT ON COLUMN episodes.podcast_url          IS 'Fireside podcast episode URL';
