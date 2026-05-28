-- Social posts: tracks what actually goes live on social platforms
-- Covers clip promos, quote graphics, episode promos, engagement posts, etc.
-- Can link to a content_clip (clip-based posts) or stand alone (quote graphics, episode promos)
-- Post type vocabulary sourced from GSR Socials Claude project instructions in archaeology

CREATE TABLE IF NOT EXISTS social_posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id       uuid REFERENCES episodes(id)      ON DELETE SET NULL,
  content_clip_id  uuid REFERENCES content_clips(id) ON DELETE SET NULL,
  platform         text NOT NULL CHECK (platform IN (
    'youtube_shorts',    -- <60s vertical, lives on YouTube channel
    'instagram',         -- Reels or static post (1:1 or 9:16)
    'tiktok',            -- 9:16 vertical
    'facebook',          -- Video post or static graphic
    'x_twitter',         -- Video clip or text post
    'rumble'             -- Rumble clip (separate from full episode)
  )),
  post_type        text NOT NULL CHECK (post_type IN (
    'clip_promo',          -- promotes a clip derived from an episode
    'episode_promo',       -- promotes the full episode airing
    'quote_graphic',       -- static graphic with quote text (1x1 or 9:16)
    'guest_spotlight',     -- highlights a specific guest
    'science_fact',        -- standalone science-meets-Scripture fact
    'engagement_post',     -- question, poll, myth vs. fact
    'carousel',            -- multi-image post (Instagram)
    'behind_the_scenes',   -- BTS content from shoot
    'archive_resurface',   -- older clip or episode being reshared
    'other'
  )),
  post_caption     text,             -- full caption text (no em dashes)
  hashtags         text[],           -- separate from caption; ~6-10 per post
  status           text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',      -- caption written, not yet scheduled
    'scheduled',  -- queued for posting
    'posted'      -- live
  )),
  scheduled_at     timestamptz,      -- when it's set to go out
  posted_at        timestamptz,      -- when it actually went live
  post_url         text,             -- link to live post
  created_at       timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_posts_read_authenticated ON social_posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY social_posts_insert_authenticated ON social_posts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY social_posts_update_authenticated ON social_posts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS social_posts_episode_idx     ON social_posts (episode_id) WHERE episode_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS social_posts_clip_idx        ON social_posts (content_clip_id) WHERE content_clip_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS social_posts_status_idx      ON social_posts (status) WHERE status != 'posted';
CREATE INDEX IF NOT EXISTS social_posts_platform_idx    ON social_posts (platform, status);
CREATE INDEX IF NOT EXISTS social_posts_scheduled_idx   ON social_posts (scheduled_at) WHERE scheduled_at IS NOT NULL;
