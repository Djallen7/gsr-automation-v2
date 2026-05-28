-- Isaac's visual asset tracking for Rundown Creator workflow
-- These are b-roll, title cards, images — NOT lower-third text chyrons
-- Each row maps to one RC rundown row; status and type values are exact from Isaac's tracker

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.production_graphics (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id         uuid        NOT NULL REFERENCES public.episodes (id) ON DELETE CASCADE,
  rc_row_label       text,
  rundown_position   int         CHECK (rundown_position BETWEEN 1 AND 15),
  graphic_type       text        NOT NULL CHECK (graphic_type IN (
    'Title Graphic',
    'B-roll',
    'Pre-made: B-roll',
    'Pre-made: Graphic',
    'Clip w/audio',
    'Article Screenshot',
    'Picture',
    'Propres Quote',
    'Propres Graphic',
    'Roll-in',
    'Graphic'
  )),
  description        text,
  status             text        NOT NULL DEFAULT 'Not Started' CHECK (status IN (
    'Not Started',
    'Created',
    'In Progress',
    'Loaded In'
  )),
  drive_file_url     text,
  rc_rundown_id      text,
  lastline_trigger   boolean     NOT NULL DEFAULT false,
  assigned_to        uuid        REFERENCES auth.users (id),
  premade_library_id uuid        REFERENCES public.premade_library (id) ON DELETE SET NULL,
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.production_graphics ENABLE ROW LEVEL SECURITY;

CREATE POLICY production_graphics_read   ON public.production_graphics FOR SELECT TO authenticated USING (true);
CREATE POLICY production_graphics_insert ON public.production_graphics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY production_graphics_update ON public.production_graphics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS production_graphics_episode_idx
  ON public.production_graphics (episode_id, rundown_position);

CREATE INDEX IF NOT EXISTS production_graphics_status_idx
  ON public.production_graphics (status)
  WHERE status != 'Loaded In';

DROP TRIGGER IF EXISTS production_graphics_updated_at ON public.production_graphics;
CREATE TRIGGER production_graphics_updated_at
  BEFORE UPDATE ON public.production_graphics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
