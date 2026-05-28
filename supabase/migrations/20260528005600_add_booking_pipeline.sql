-- Pre-episode-placement outreach tracking
-- Replaces the ALT rows in the monthly interview schedule spreadsheet
-- Daniel sends more outreach than there are slots; overflow guests sit here
-- confirmed but unplaced until the following month's cycle has room
-- When placed: create episode_guests row and fill in episode_guest_id here

CREATE TABLE IF NOT EXISTS public.booking_pipeline (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id            uuid        NOT NULL REFERENCES public.guests (id),
  article_id          uuid        REFERENCES public.articles (id) ON DELETE SET NULL,
  outreach_tier       text        NOT NULL CHECK (outreach_tier IN (
    'cold', 'warm', 'returning', 'recurring', 'direct'
  )),
  status              text        NOT NULL DEFAULT 'outreach_sent' CHECK (status IN (
    'outreach_sent', 'replied', 'confirmed', 'placed', 'declined', 'no_show', 'deferred'
  )),
  target_season       int,
  target_month        int         CHECK (target_month BETWEEN 1 AND 12),
  shoot_session_id    uuid        REFERENCES public.shoot_sessions (id) ON DELETE SET NULL,
  episode_guest_id    uuid        REFERENCES public.episode_guests (id) ON DELETE SET NULL,
  outreach_sent_at    timestamptz,
  last_contact_at     timestamptz,
  notes               text,
  created_by          uuid        REFERENCES auth.users (id),
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_pipeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY booking_pipeline_read   ON public.booking_pipeline FOR SELECT TO authenticated USING (true);
CREATE POLICY booking_pipeline_insert ON public.booking_pipeline FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY booking_pipeline_update ON public.booking_pipeline FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS booking_pipeline_guest_idx
  ON public.booking_pipeline (guest_id);

CREATE INDEX IF NOT EXISTS booking_pipeline_status_cycle_idx
  ON public.booking_pipeline (target_season, target_month, status);

CREATE INDEX IF NOT EXISTS booking_pipeline_active_idx
  ON public.booking_pipeline (target_season, target_month)
  WHERE status NOT IN ('placed', 'declined', 'no_show');
