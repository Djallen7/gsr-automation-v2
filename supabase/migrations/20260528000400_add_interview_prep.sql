-- Interview prep: tracks source articles and angle development per episode-guest
-- One row per article/angle candidate; multiple rows allowed per episode

CREATE TABLE IF NOT EXISTS interview_prep (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id          uuid NOT NULL REFERENCES episodes(id)       ON DELETE CASCADE,
  episode_guest_id    uuid          REFERENCES episode_guests(id) ON DELETE SET NULL,
  article_url         text,
  article_title       text,
  source_publication  text,
  article_summary     text,
  angle_notes         text,          -- how this angle plays on TV; why it fits GSR
  talking_points      text,          -- raw notes or guest-provided talking points
  lane                text CHECK (lane IN (
                        'creation_science', 'astronomy', 'biology',
                        'genetics', 'geology', 'archaeology', 'other'
                      )),
  status              text NOT NULL DEFAULT 'researching'
    CHECK (status IN (
      'researching',       -- article found, angle under development
      'angle_approved',    -- Daniel approved the angle
      'questions_drafted', -- interview questions written
      'questions_sent',    -- talking points/questions sent to guest
      'complete'           -- all prep done
    )),
  created_at          timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE interview_prep ENABLE ROW LEVEL SECURITY;

CREATE POLICY interview_prep_read_authenticated ON interview_prep
  FOR SELECT TO authenticated USING (true);

CREATE POLICY interview_prep_insert_authenticated ON interview_prep
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY interview_prep_update_authenticated ON interview_prep
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS interview_prep_episode_idx ON interview_prep (episode_id);
CREATE INDEX IF NOT EXISTS interview_prep_guest_idx   ON interview_prep (episode_guest_id) WHERE episode_guest_id IS NOT NULL;
