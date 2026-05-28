-- Email template library keyed by outreach tier
-- Tier is determined by guest appearance count (computed from episode_guests)
-- Tier logic: 0 appearances = cold, 1 = warm, 2 = returning, 3-4 = recurring, 5+ = direct
-- Templates use {{first_name}}, {{episode_label}}, {{shoot_date}} as placeholders

CREATE TABLE IF NOT EXISTS public.outreach_drafts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tier         text        NOT NULL CHECK (tier IN (
    'cold', 'warm', 'returning', 'recurring', 'direct'
  )),
  subject_line text        NOT NULL,
  body_text    text        NOT NULL,
  version      int         NOT NULL DEFAULT 1,
  is_active    boolean     NOT NULL DEFAULT true,
  created_by   uuid        REFERENCES auth.users (id),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY outreach_drafts_read   ON public.outreach_drafts FOR SELECT TO authenticated USING (true);
CREATE POLICY outreach_drafts_insert ON public.outreach_drafts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY outreach_drafts_update ON public.outreach_drafts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS outreach_drafts_tier_active_idx
  ON public.outreach_drafts (tier)
  WHERE is_active = true;
