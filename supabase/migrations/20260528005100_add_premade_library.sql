-- Reusable b-roll loops and graphics catalog
-- Primary assets are looping video clips from Envato Elements and Storyblocks
-- built up over several years; stored on the VideoEdit server (Drive may have copies)
-- production_graphics rows reference this when using a pre-made asset

CREATE TABLE IF NOT EXISTS public.premade_library (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  description      text,
  asset_type       text        NOT NULL CHECK (asset_type IN (
    'b_roll_loop', 'title_graphic', 'graphic', 'clip_with_audio', 'other'
  )),
  is_loop          boolean     NOT NULL DEFAULT true,
  duration_sec     int,
  source           text        NOT NULL CHECK (source IN (
    'envato', 'storyblocks', 'nasa_svs', 'creation_com', 'own_production', 'other'
  )),
  source_url       text,
  license_type     text        CHECK (license_type IN (
    'subscription_envato', 'subscription_storyblocks', 'public_domain', 'own', 'other'
  )),
  server_file_path text,
  drive_file_url   text,
  tags             text[]      NOT NULL DEFAULT '{}',
  resolution       text,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.premade_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY premade_library_read   ON public.premade_library FOR SELECT TO authenticated USING (true);
CREATE POLICY premade_library_insert ON public.premade_library FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY premade_library_update ON public.premade_library FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS premade_library_source_idx     ON public.premade_library (source);
CREATE INDEX IF NOT EXISTS premade_library_asset_type_idx ON public.premade_library (asset_type);
