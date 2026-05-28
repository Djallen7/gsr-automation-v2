-- Article candidates for the research pipeline
-- Each article has ONE target guest (recommended_guest_id) — direct FK, not a junction table
-- total_score is a stored generated column summing the 8 dimensions (max 80)
-- When an article is used in an episode, interview_prep row is created linking article to episode+guest

CREATE TABLE IF NOT EXISTS public.articles (
  id                         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  url                        text        UNIQUE,
  title                      text        NOT NULL,
  source_publication         text,
  published_date             date,
  summary                    text,
  key_points                 text,
  lane                       text        CHECK (lane IN (
    'creation_science', 'astronomy', 'biology', 'genetics',
    'geology', 'archaeology', 'physics', 'technology', 'other'
  )),
  score_scientific_clarity   int         CHECK (score_scientific_clarity   BETWEEN 0 AND 10),
  score_biblical_alignment   int         CHECK (score_biblical_alignment   BETWEEN 0 AND 10),
  score_production_viability int         CHECK (score_production_viability BETWEEN 0 AND 10),
  score_guest_fit            int         CHECK (score_guest_fit            BETWEEN 0 AND 10),
  score_story_originality    int         CHECK (score_story_originality    BETWEEN 0 AND 10),
  score_audience_engagement  int         CHECK (score_audience_engagement  BETWEEN 0 AND 10),
  score_research_depth       int         CHECK (score_research_depth       BETWEEN 0 AND 10),
  score_timeliness           int         CHECK (score_timeliness           BETWEEN 0 AND 10),
  total_score                int         GENERATED ALWAYS AS (
    COALESCE(score_scientific_clarity,   0) +
    COALESCE(score_biblical_alignment,   0) +
    COALESCE(score_production_viability, 0) +
    COALESCE(score_guest_fit,            0) +
    COALESCE(score_story_originality,    0) +
    COALESCE(score_audience_engagement,  0) +
    COALESCE(score_research_depth,       0) +
    COALESCE(score_timeliness,           0)
  ) STORED,
  yec_stance                 text        CHECK (yec_stance IN ('yec_friendly', 'neutral', 'hostile')),
  recommended_guest_id       uuid        REFERENCES public.guests (id) ON DELETE SET NULL,
  outreach_framing_notes     text,
  status                     text        NOT NULL DEFAULT 'scout'
    CHECK (status IN ('scout', 'approved', 'outreach_sent', 'booked', 'used', 'archived')),
  added_by                   uuid        REFERENCES auth.users (id),
  created_at                 timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY articles_read   ON public.articles FOR SELECT TO authenticated USING (true);
CREATE POLICY articles_insert ON public.articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY articles_update ON public.articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS articles_status_idx            ON public.articles (status);
CREATE INDEX IF NOT EXISTS articles_recommended_guest_idx ON public.articles (recommended_guest_id)
  WHERE recommended_guest_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS articles_total_score_idx       ON public.articles (total_score DESC);
