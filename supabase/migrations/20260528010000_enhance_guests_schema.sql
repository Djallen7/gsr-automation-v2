-- Extended guest contact management fields
-- Applied to Supabase remote before local file was created; reconstructed from schema

ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS is_deceased         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS do_not_contact      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sensitive_flag      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sensitive_notes     text,
  ADD COLUMN IF NOT EXISTS re_approach_after   date,
  ADD COLUMN IF NOT EXISTS re_approach_notes   text,
  ADD COLUMN IF NOT EXISTS credentials_display text,
  ADD COLUMN IF NOT EXISTS source              text,
  ADD COLUMN IF NOT EXISTS website             text;
