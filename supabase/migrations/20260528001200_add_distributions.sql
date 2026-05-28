-- Distribution tracking: one row per episode × platform × file version
-- Covers broadcast delivery, streaming uploads, podcast, and partner deliveries

CREATE TABLE IF NOT EXISTS distributions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id            uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  platform              text NOT NULL CHECK (platform IN (
    'youtube',               -- genesissciencenetwork YouTube channel
    'rumble',                -- Rumble channel
    'fireside_podcast',      -- Fireside.fm podcast (MP3)
    'real_life_network',     -- Signiant Media Shuttle delivery
    'network_partner',       -- Dropbox partner delivery (do not name specific stations)
    'tbn_c21c',              -- Creation in the 21st Century on TBN
    'creation_tv_network',   -- 24/7 Creation TV channel (CTN)
    'genesis_science_network', -- genesissciencenetwork.com web stream
    'social_clip',           -- Short-form clip (YouTube Shorts, vertical, etc.)
    'other'
  )),
  file_version          text CHECK (file_version IN (
    'broadcast',    -- full broadcast master file
    'web_stream',   -- compressed web/streaming version
    'mp3_podcast',  -- audio-only podcast file
    'vertical_short', -- 9:16 vertical cut for social
    'clip',         -- standalone short clip derived from episode
    'other'
  )),
  status                text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',          -- not yet uploaded
    'uploading',        -- in progress
    'scheduled',        -- uploaded, scheduled for future publish
    'live',             -- publicly available
    'failed',           -- upload or delivery error
    'not_applicable'    -- this platform not used for this episode
  )),
  platform_url          text,                    -- URL once live
  scheduled_publish_at  timestamptz,             -- if platform supports scheduled publish
  uploaded_at           timestamptz,             -- when file was delivered/uploaded
  went_live_at          timestamptz,             -- when it became publicly viewable
  view_count            int,                     -- snapshot view count (not live)
  view_count_checked_at timestamptz,             -- when view_count was last recorded
  notes                 text,                    -- delivery errors, special instructions, etc.
  created_at            timestamptz DEFAULT now(),
  UNIQUE (episode_id, platform, file_version)   -- one status row per episode-platform-version
);

-- RLS
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY distributions_read_authenticated ON distributions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY distributions_insert_authenticated ON distributions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY distributions_update_authenticated ON distributions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS distributions_episode_idx ON distributions (episode_id);
CREATE INDEX IF NOT EXISTS distributions_status_idx  ON distributions (status) WHERE status NOT IN ('live', 'not_applicable');
CREATE INDEX IF NOT EXISTS distributions_platform_idx ON distributions (platform, status);
