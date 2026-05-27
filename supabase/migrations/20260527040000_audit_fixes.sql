-- Audit-driven fixes (2026-05-26 parallel-agent audit).
-- All statements are idempotent so this is safe to re-run.
--
-- Reverses: each section has a `-- To reverse:` comment block.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Fix toggle_propresenter_added so it actually surfaces "not found"
-- ─────────────────────────────────────────────────────────────────────────────
-- The original was `language sql` returning `boolean`. A `language sql`
-- function with a RETURNING clause returns SETOF, so `rpc('...').data` arrives
-- as an array; the caller's `if (data === null) throw new Error('not found')`
-- never fires. Rewriting as plpgsql lets us use FOUND to detect a no-op
-- update and raise an explicit exception.

create or replace function public.toggle_propresenter_added(p_graphic_id uuid)
returns boolean
language plpgsql
security invoker
as $$
declare
  v_new boolean;
begin
  update public.graphics
  set propresenter_added = not coalesce(propresenter_added, false)
  where id = p_graphic_id
  returning propresenter_added into v_new;

  if not found then
    raise exception 'graphic not found: %', p_graphic_id
      using errcode = 'P0002';
  end if;

  return v_new;
end;
$$;

grant execute on function public.toggle_propresenter_added(uuid) to authenticated;

-- To reverse: re-apply 20260526120300_propresenter_atomic_toggle.sql.


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Indexes for the queries the dashboard actually runs
-- ─────────────────────────────────────────────────────────────────────────────
-- All page loads filter or sort graphics by these columns; without the
-- indexes Postgres seq-scans the whole table on every render.

create index if not exists graphics_episode_id_idx
  on public.graphics (episode_id);

create index if not exists graphics_status_uploaded_at_idx
  on public.graphics (status, uploaded_at desc);

create index if not exists graphics_status_beat_number_idx
  on public.graphics (status, beat_number asc);

create index if not exists graphics_variations_graphic_variation_idx
  on public.graphics_variations (graphic_id, variation_number desc);

-- To reverse:
--   drop index if exists public.graphics_episode_id_idx;
--   drop index if exists public.graphics_status_uploaded_at_idx;
--   drop index if exists public.graphics_status_beat_number_idx;
--   drop index if exists public.graphics_variations_graphic_variation_idx;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Race-proof variation numbering on graphics_variations
-- ─────────────────────────────────────────────────────────────────────────────
-- /api/regenerate computes `nextVariationNumber = MAX + 1` client-side then
-- inserts. Two concurrent regenerates on the same graphic both read MAX,
-- both compute the same N, both insert. A uniqueness constraint converts
-- the loser into a 23505 the route can catch and retry.

alter table public.graphics_variations
  drop constraint if exists graphics_variations_graphic_variation_unique;

alter table public.graphics_variations
  add constraint graphics_variations_graphic_variation_unique
  unique (graphic_id, variation_number);

-- To reverse:
--   alter table public.graphics_variations
--     drop constraint if exists graphics_variations_graphic_variation_unique;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Cascade orphan regenerate_attempts when a graphic is deleted
-- ─────────────────────────────────────────────────────────────────────────────
-- regenerate_attempts.graphic_id was `uuid not null` with no foreign key;
-- deleting a graphic leaves orphan attempts. NOT VALID means existing rows
-- are not re-checked at add time; VALIDATE will fail if orphans exist,
-- in which case clean them with:
--   delete from public.regenerate_attempts ra
--    where not exists (select 1 from public.graphics g where g.id = ra.graphic_id);

alter table public.regenerate_attempts
  drop constraint if exists regenerate_attempts_graphic_id_fkey;

alter table public.regenerate_attempts
  add constraint regenerate_attempts_graphic_id_fkey
  foreign key (graphic_id)
  references public.graphics(id)
  on delete cascade
  not valid;

alter table public.regenerate_attempts
  validate constraint regenerate_attempts_graphic_id_fkey;

-- To reverse:
--   alter table public.regenerate_attempts
--     drop constraint if exists regenerate_attempts_graphic_id_fkey;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. graphics.status NOT NULL DEFAULT 'pending_review'
-- ─────────────────────────────────────────────────────────────────────────────
-- The app always sets status, but a missing value would create a row that
-- disappears from both pending and approved views. Enforce the invariant.

update public.graphics
  set status = 'pending_review'
  where status is null;

alter table public.graphics
  alter column status set default 'pending_review';

alter table public.graphics
  alter column status set not null;

-- To reverse:
--   alter table public.graphics alter column status drop not null;
--   alter table public.graphics alter column status drop default;
