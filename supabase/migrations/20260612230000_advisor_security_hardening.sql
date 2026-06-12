-- Advisor hardening (run-notes punch list, 2026-06-12). One concern per
-- statement, all idempotent. NOT YET APPLIED to the live project: applying
-- needs Daniel's go-ahead (live-DB carve-out in the canon approvals grant).

-- 1. Pin search_path on every exposed function (advisor 0011).
ALTER FUNCTION public.toggle_propresenter_added(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.notify_script_extract() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;

-- 2. Trigger-only functions need no direct API execute (advisors 0028/0029).
REVOKE EXECUTE ON FUNCTION public.notify_script_extract() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;
-- toggle_propresenter_added stays executable by authenticated (the review UI
-- calls it via RPC); anon never needs it.
REVOKE EXECUTE ON FUNCTION public.toggle_propresenter_added(uuid) FROM anon;

-- 3. The master view should run with the caller's rights, not the owner's
--    (advisor 0010). Authenticated users see the same rows via RLS; anon
--    correctly loses access.
ALTER VIEW public.v_episode_master SET (security_invoker = true);
