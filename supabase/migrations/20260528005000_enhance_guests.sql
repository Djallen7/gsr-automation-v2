-- Add worldview and scheduling fields to guests
-- is_christian: nullable (null = unknown); false = secular guest requiring science-first framing
-- GSR is expanding its roster beyond YEC Christians to cover wider science topics
-- timezone and location_city were previously buried in parenthetical notes in guest name cells

ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS is_christian  boolean,
  ADD COLUMN IF NOT EXISTS timezone      text,
  ADD COLUMN IF NOT EXISTS location_city text;

COMMENT ON COLUMN public.guests.is_christian IS
  'Professing Christian; null = unknown; false = secular — brief David on science-first framing only';
COMMENT ON COLUMN public.guests.timezone IS
  'IANA timezone string e.g. America/Chicago — used for scheduling zoom calls';
COMMENT ON COLUMN public.guests.location_city IS
  'City and state/country e.g. Dallas TX — scheduling context';
