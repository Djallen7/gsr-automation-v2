-- Atomic toggle for graphics.propresenter_added.
-- The dashboard previously did read-then-write client-side, which lost updates
-- when two operators clicked simultaneously. This RPC performs the flip in a
-- single statement and returns the new value.

create or replace function public.toggle_propresenter_added(p_graphic_id uuid)
returns boolean
language sql
security invoker
as $$
  update public.graphics
  set propresenter_added = not coalesce(propresenter_added, false)
  where id = p_graphic_id
  returning propresenter_added;
$$;

grant execute on function public.toggle_propresenter_added(uuid) to authenticated;
