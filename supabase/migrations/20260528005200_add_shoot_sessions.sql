-- Monthly production cycle shoot days
-- A production cycle has 1-3 shoot days (May might have May 28, May 29, and a June 15 overflow)
-- production_month is the AIRING cycle — not necessarily the calendar month of the shoot
-- episode_guests.filming_datetime points to the specific timeslot within a session

CREATE TABLE IF NOT EXISTS public.shoot_sessions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  season           int         NOT NULL,
  production_month int         NOT NULL CHECK (production_month BETWEEN 1 AND 12),
  session_date     date        NOT NULL,
  label            text,
  location         text        CHECK (location IN ('zoom', 'in_studio', 'pre_recorded', 'other')),
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (season, production_month, session_date)
);

ALTER TABLE public.shoot_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY shoot_sessions_read   ON public.shoot_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY shoot_sessions_insert ON public.shoot_sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY shoot_sessions_update ON public.shoot_sessions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS shoot_sessions_season_month_idx ON public.shoot_sessions (season, production_month);
