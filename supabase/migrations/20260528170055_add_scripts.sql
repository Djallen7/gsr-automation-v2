-- One script per episode-segment combination
CREATE TABLE IF NOT EXISTS scripts (
  id          bigint      generated always as identity primary key,
  episode_id  uuid        NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  segment     text        NOT NULL,
  script_text text        NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (episode_id, segment)
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage scripts"
  ON scripts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE TRIGGER set_scripts_updated_at
  BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
