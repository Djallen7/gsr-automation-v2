-- Guest roster: one row per person, reused across episodes
-- Replaces the flat guest_name text on episodes for structured lookup

CREATE TABLE IF NOT EXISTS guests (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text,                    -- Dr., Mr., Ms., etc.
  first_name          text NOT NULL,
  last_name           text NOT NULL,
  email               text,
  phone               text,
  expertise           text,
  job_title           text,
  organization        text,
  is_yec              boolean DEFAULT true,     -- Young Earth Creationist; false = apply science-first framing
  communication_notes text,                    -- responsiveness, scheduling ease, on-air performance notes
  notes               text,                    -- general freeform notes
  created_at          timestamptz DEFAULT now()
);

-- RLS: authenticated users can read/write all guests
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY guests_read_authenticated ON guests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY guests_insert_authenticated ON guests
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY guests_update_authenticated ON guests
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Lookup indexes
CREATE INDEX IF NOT EXISTS guests_last_name_idx ON guests (last_name);
CREATE INDEX IF NOT EXISTS guests_email_idx     ON guests (email) WHERE email IS NOT NULL;
