-- Add expertise_tags array to guests for faceted filtering and prompt injection.
-- Complements the free-text expertise column with a structured tag set.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS expertise_tags text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS guests_expertise_tags_idx
  ON public.guests USING GIN (expertise_tags);
