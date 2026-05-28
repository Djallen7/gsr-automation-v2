-- Fix all actionable Supabase advisor warnings (2026-05-28)
-- Covers: security definer views, duplicate indexes, function search_path,
--         and auth RLS initplan performance warnings.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Security definer views → security invoker
-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase flags views as SECURITY DEFINER by default. Setting security_invoker
-- means the view runs as the querying user so RLS on underlying tables applies.

ALTER VIEW public.v_episode_master  SET (security_invoker = on);
ALTER VIEW public.v_episode_workflow SET (security_invoker = on);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Drop duplicate unique constraints
-- ─────────────────────────────────────────────────────────────────────────────
-- The original schema already had UNIQUE(season, episode_number) on episodes,
-- which created episodes_season_episode_number_key. Migration 20260527030100
-- added a second named constraint episodes_season_episode_number_unique.
-- Similarly graphics_variations already had the _key constraint from the schema;
-- audit_fixes added graphics_variations_graphic_variation_unique on top.

ALTER TABLE public.episodes
  DROP CONSTRAINT IF EXISTS episodes_season_episode_number_unique;

ALTER TABLE public.graphics_variations
  DROP CONSTRAINT IF EXISTS graphics_variations_graphic_variation_unique;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Fix toggle_propresenter_added: pin search_path
-- ─────────────────────────────────────────────────────────────────────────────
-- Mutable search_path on a function lets an attacker inject a schema that
-- shadows public.graphics. Pinning it to '' forces fully-qualified names.

CREATE OR REPLACE FUNCTION public.toggle_propresenter_added(p_graphic_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_new boolean;
BEGIN
  UPDATE public.graphics
  SET propresenter_added = NOT COALESCE(propresenter_added, false)
  WHERE id = p_graphic_id
  RETURNING propresenter_added INTO v_new;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'graphic not found: %', p_graphic_id
      USING errcode = 'P0002';
  END IF;

  RETURN v_new;
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_propresenter_added(uuid) TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Auth RLS initplan: wrap auth calls in (select ...)
-- ─────────────────────────────────────────────────────────────────────────────
-- auth.role() / auth.uid() called directly in a policy USING clause are
-- re-evaluated per row. Wrapping in (select ...) promotes them to an initplan
-- evaluated once per query — a significant win on larger tables.

-- episodes
DROP POLICY IF EXISTS "read_all_authenticated"        ON public.episodes;
DROP POLICY IF EXISTS "insert_episodes_authenticated" ON public.episodes;
DROP POLICY IF EXISTS "update_episodes_authenticated" ON public.episodes;

CREATE POLICY "read_all_authenticated"
  ON public.episodes FOR SELECT
  USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "insert_episodes_authenticated"
  ON public.episodes FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "update_episodes_authenticated"
  ON public.episodes FOR UPDATE
  USING ((SELECT auth.role()) = 'authenticated');

-- graphics
DROP POLICY IF EXISTS "read_all_authenticated"        ON public.graphics;
DROP POLICY IF EXISTS "insert_graphics_authenticated" ON public.graphics;
DROP POLICY IF EXISTS "update_graphics_authenticated" ON public.graphics;

CREATE POLICY "read_all_authenticated"
  ON public.graphics FOR SELECT
  USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "insert_graphics_authenticated"
  ON public.graphics FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "update_graphics_authenticated"
  ON public.graphics FOR UPDATE
  USING ((SELECT auth.role()) = 'authenticated');

-- graphics_variations
DROP POLICY IF EXISTS "read_all_authenticated"          ON public.graphics_variations;
DROP POLICY IF EXISTS "insert_variations_authenticated" ON public.graphics_variations;

CREATE POLICY "read_all_authenticated"
  ON public.graphics_variations FOR SELECT
  USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "insert_variations_authenticated"
  ON public.graphics_variations FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- regenerate_attempts
DROP POLICY IF EXISTS "read_own_regenerate_attempts"   ON public.regenerate_attempts;
DROP POLICY IF EXISTS "insert_own_regenerate_attempts" ON public.regenerate_attempts;

CREATE POLICY "read_own_regenerate_attempts"
  ON public.regenerate_attempts FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "insert_own_regenerate_attempts"
  ON public.regenerate_attempts FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);
