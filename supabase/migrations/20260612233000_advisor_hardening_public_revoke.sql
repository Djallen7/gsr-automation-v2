-- Completes the function lock from 20260612230000: functions get EXECUTE
-- granted to PUBLIC by default and anon/authenticated inherit it, so the
-- role-specific REVOKEs alone did not close access. Applied live 2026-06-12
-- with Daniel's go-ahead; advisor re-run confirms the anon findings cleared.
REVOKE EXECUTE ON FUNCTION public.notify_script_extract() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.toggle_propresenter_added(uuid) FROM PUBLIC;

-- The review UI calls this via RPC as a signed-in user; server-side code may
-- call it with the service role. (The remaining advisor note on this function
-- for authenticated is intentional and accepted.)
GRANT EXECUTE ON FUNCTION public.toggle_propresenter_added(uuid) TO authenticated, service_role;
