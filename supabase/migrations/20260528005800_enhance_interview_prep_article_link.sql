-- Link interview_prep rows to the articles table
-- interview_prep still keeps article_url and article_title as freeform fallback
-- article_id is the structured link when the article exists in the articles table

ALTER TABLE public.interview_prep
  ADD COLUMN IF NOT EXISTS article_id uuid REFERENCES public.articles (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS interview_prep_article_idx
  ON public.interview_prep (article_id)
  WHERE article_id IS NOT NULL;
