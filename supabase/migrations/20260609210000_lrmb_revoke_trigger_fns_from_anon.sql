-- L10 audit 2026-06-09 P0-1: three SECURITY DEFINER trigger functions
-- (auto_bump_in_progress_on_first_action, auto_bump_in_progress_on_subtask_toggle,
-- reject_non_hk_subtask_insert) have EXECUTE grants to anon + authenticated,
-- making them callable via PostgREST /rest/v1/rpc/. They're meant to run
-- ONLY in trigger context; direct invocation bypasses RLS.
--
-- Triggers continue to fire regardless of EXECUTE grant (Postgres invokes
-- trigger functions directly via internal path, ACL only checked on RPC).

REVOKE EXECUTE ON FUNCTION public.auto_bump_in_progress_on_first_action()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_bump_in_progress_on_subtask_toggle()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_non_hk_subtask_insert()
  FROM PUBLIC, anon, authenticated;

-- L10 audit P2-1: dashboard RPCs that lack inner permission check.
-- avg_admin_touches_per_task + get_dashboard_kpis + get_dashboard_kpis_by_property
-- are callable by any authenticated user and return global ops data.
REVOKE EXECUTE ON FUNCTION public.avg_admin_touches_per_task()
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.avg_admin_touches_per_task() TO service_role;

DO $$
DECLARE
  fn_name text;
  fn_sig text;
BEGIN
  FOR fn_name, fn_sig IN
    SELECT p.proname, pg_get_function_identity_arguments(p.oid)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('get_dashboard_kpis', 'get_dashboard_kpis_by_property')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM PUBLIC, anon, authenticated', fn_name, fn_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO service_role', fn_name, fn_sig);
  END LOOP;
END $$;
