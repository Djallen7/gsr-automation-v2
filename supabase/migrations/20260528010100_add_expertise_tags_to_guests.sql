-- Structured expertise tags array on guests for filtering and matching
-- Applied to Supabase remote before local file was created; reconstructed from schema

ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS expertise_tags text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS guests_expertise_tags_idx ON public.guests USING gin (expertise_tags);
