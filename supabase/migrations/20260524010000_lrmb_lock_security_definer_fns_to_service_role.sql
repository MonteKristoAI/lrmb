-- Per Supabase advisor lints 0028 / 0029 (anon + authenticated can execute
-- SECURITY DEFINER fn via REST), tighten the 3 fns introduced in recent PRs:
--
-- prune_audit_logs               DELETE-capable; cron-only
-- create_missing_final_cleans    spawns Final Clean tasks; pg_cron-only
-- has_revoked_share_token        edge-fn-internal; never called from client
--
-- All three were granted to service_role and revoked from PUBLIC in their
-- original migrations, but Supabase's default GRANT-on-create for new
-- functions still allowed anon + authenticated to execute via /rest/v1/rpc.
-- This migration revokes those explicitly.

REVOKE EXECUTE ON FUNCTION public.prune_audit_logs(integer)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.prune_audit_logs(integer) TO service_role;

REVOKE EXECUTE ON FUNCTION public.create_missing_final_cleans(integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.create_missing_final_cleans(integer, integer) TO service_role;

REVOKE EXECUTE ON FUNCTION public.has_revoked_share_token(text)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.has_revoked_share_token(text) TO service_role;
