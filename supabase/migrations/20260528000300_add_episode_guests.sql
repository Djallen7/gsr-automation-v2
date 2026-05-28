-- Episode-guest junction: links guests to episodes with booking workflow
-- One row per guest-per-episode-per-slot (interview_1 or interview_2)

CREATE TABLE IF NOT EXISTS episode_guests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id       uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  guest_id         uuid NOT NULL REFERENCES guests(id)   ON DELETE CASCADE,
  segment          text NOT NULL CHECK (segment IN ('interview_1', 'interview_2')),
  booking_status   text NOT NULL DEFAULT 'outreach'
    CHECK (booking_status IN (
      'outreach',   -- initial email sent, no reply
      'confirmed',  -- guest confirmed, date locked
      'declined',   -- guest passed
      'shot',       -- interview recorded
      'aired',      -- episode went live with this guest
      'no_show'     -- confirmed but did not appear
    )),
  filming_datetime  timestamptz,               -- confirmed Zoom/in-studio time
  zoom_location     text,                      -- Zoom link or 'in-studio'
  resource_verified boolean DEFAULT false,     -- creationsuperstore.com product confirmed
  resource_url      text,                      -- URL if found; null = offer website plug instead
  appearance_notes  text,                      -- post-appearance notes for future booking decisions
  created_at        timestamptz DEFAULT now(),
  UNIQUE (episode_id, segment)                 -- one guest per interview slot per episode
);

-- RLS
ALTER TABLE episode_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY episode_guests_read_authenticated ON episode_guests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY episode_guests_insert_authenticated ON episode_guests
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY episode_guests_update_authenticated ON episode_guests
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS episode_guests_episode_idx ON episode_guests (episode_id);
CREATE INDEX IF NOT EXISTS episode_guests_guest_idx   ON episode_guests (guest_id);
CREATE INDEX IF NOT EXISTS episode_guests_status_idx  ON episode_guests (booking_status);
