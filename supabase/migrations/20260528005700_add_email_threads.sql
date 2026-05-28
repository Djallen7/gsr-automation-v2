-- Full sent-email audit log per guest
-- The 6 timestamp columns on episode_guests remain the source of truth for
-- due-date logic in v_episode_workflow; this table is the detailed record

CREATE TABLE IF NOT EXISTS public.email_threads (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id            uuid        NOT NULL REFERENCES public.guests (id),
  episode_guest_id    uuid        REFERENCES public.episode_guests (id) ON DELETE SET NULL,
  booking_pipeline_id uuid        REFERENCES public.booking_pipeline (id) ON DELETE SET NULL,
  outreach_draft_id   uuid        REFERENCES public.outreach_drafts (id) ON DELETE SET NULL,
  email_type          text        NOT NULL CHECK (email_type IN (
    'outreach', 'confirmation', 'zoom_link', 'reminder',
    'followup', 'pre_air', 'post_air', 'other'
  )),
  sent_at             timestamptz NOT NULL,
  subject             text,
  body_snippet        text,
  sent_by             uuid        REFERENCES auth.users (id),
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY email_threads_read   ON public.email_threads FOR SELECT TO authenticated USING (true);
CREATE POLICY email_threads_insert ON public.email_threads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY email_threads_update ON public.email_threads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS email_threads_guest_idx
  ON public.email_threads (guest_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS email_threads_episode_guest_idx
  ON public.email_threads (episode_guest_id)
  WHERE episode_guest_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS email_threads_pipeline_idx
  ON public.email_threads (booking_pipeline_id)
  WHERE booking_pipeline_id IS NOT NULL;
