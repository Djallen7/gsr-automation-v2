-- Transcripts: full episode or per-segment text
-- Used for: metadata generation (Claude API), YouTube chapters, search, re-cut content

CREATE TABLE IF NOT EXISTS transcripts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id      uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  segment         text,                  -- null = full episode; matches graphic_segment values when set
  transcript_text text NOT NULL,
  generated_by    text NOT NULL DEFAULT 'manual'
    CHECK (generated_by IN (
      'manual',          -- typed or copy-pasted by team
      'auto_whisper',    -- OpenAI Whisper
      'auto_deepgram',   -- Deepgram
      'auto_other'       -- other auto-transcription service
    )),
  source_file_url text,                  -- Drive or QNAP path of the audio/video file transcribed
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (episode_id, segment)           -- one transcript per segment per episode
);

-- RLS
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY transcripts_read_authenticated ON transcripts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY transcripts_insert_authenticated ON transcripts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY transcripts_update_authenticated ON transcripts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS transcripts_episode_idx ON transcripts (episode_id);
