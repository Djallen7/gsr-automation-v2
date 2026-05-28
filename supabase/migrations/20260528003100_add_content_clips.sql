-- Content clips: short-form clips (30–60s) derived from episode segments
-- Fields sourced from actual soundbite extraction sessions in the archaeology data
-- Default workflow: identified (timecode logged) → rendered (file exported) → posted

CREATE TABLE IF NOT EXISTS content_clips (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id              uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  episode_guest_id        uuid          REFERENCES episode_guests(id) ON DELETE SET NULL,
  source_segment          text NOT NULL CHECK (source_segment IN (
    'interview_1', 'interview_2', 'opening_monologue',
    'kids_corner', 'heavens_declare', 'genesis_science_minute',
    'ministry_report', 'viewer_voices', 'other'
  )),
  timecode_in             text,          -- HH:MM:SS:FF drop-frame format (e.g. 00:03:47:11)
  timecode_out            text,          -- HH:MM:SS:FF
  clip_duration_sec       int,           -- derived or manually entered
  quote_verbatim          text,          -- exact transcript text — never paraphrase
  clip_type               text NOT NULL DEFAULT 'soundbite' CHECK (clip_type IN (
    'soundbite',       -- 30–60s standalone quote
    'one_liner',       -- sub-5-second cut for fast-paced social feeds
    'extended_quote',  -- 60–180s longer thought
    'full_segment'     -- complete segment cut (e.g. full GSM or THD episode)
  )),
  platform_fit            text[],        -- intended platforms: youtube_shorts, instagram_reels, tiktok, x_twitter, facebook
  editorial_notes         text,          -- "why this works" — standalone strength, audience fit
  vertical_version_created boolean DEFAULT false, -- 9:16 cut created for Shorts/Reels/TikTok
  status                  text NOT NULL DEFAULT 'identified' CHECK (status IN (
    'identified',  -- timecode logged, not yet rendered
    'rendered',    -- video file exported from timeline
    'posted'       -- live on at least one platform
  )),
  created_at              timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE content_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_clips_read_authenticated ON content_clips
  FOR SELECT TO authenticated USING (true);

CREATE POLICY content_clips_insert_authenticated ON content_clips
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY content_clips_update_authenticated ON content_clips
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS content_clips_episode_idx       ON content_clips (episode_id);
CREATE INDEX IF NOT EXISTS content_clips_guest_idx         ON content_clips (episode_guest_id) WHERE episode_guest_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS content_clips_status_idx        ON content_clips (status) WHERE status != 'posted';
CREATE INDEX IF NOT EXISTS content_clips_source_segment_idx ON content_clips (source_segment);

COMMENT ON COLUMN content_clips.quote_verbatim   IS 'Exact transcript text — used to locate clip in edit timeline. Never paraphrase.';
COMMENT ON COLUMN content_clips.timecode_in      IS 'Drop-frame timecode HH:MM:SS:FF matching edit timeline';
COMMENT ON COLUMN content_clips.platform_fit     IS 'Array of target platforms: youtube_shorts, instagram_reels, tiktok, x_twitter, facebook';
