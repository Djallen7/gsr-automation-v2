-- Add per-graphic font override fields.
-- The dashboard is text-only forever (decision 2026-05-27): the visual
-- background lives in ProPresenter, the dashboard supplies text + font
-- settings. All three fields are nullable; the app supplies defaults
-- when they're unset.

alter table public.graphics
  add column if not exists font_family   text,
  add column if not exists font_size_pt  int,
  add column if not exists font_color    text;

-- Color is stored as a hex string ("#FFFFFF") or a CSS-style named color.
-- size_pt is the point size as it should be set in ProPresenter.
-- family is a literal font name to type into ProPresenter (e.g. "Helvetica Neue Bold").

-- No backfill: existing rows keep nulls and inherit defaults.
