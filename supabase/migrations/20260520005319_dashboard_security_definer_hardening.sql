-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Production hardening: REVOKE EXECUTE on SECURITY DEFINER trigger functions
-- from anon + authenticated. These functions are called BY triggers (not via
-- REST), so revoking EXECUTE doesn't affect normal operation but stops them
-- from being callable directly via /rest/v1/rpc/X.
--
-- Functions kept callable by authenticated:
--   - has_admin_access, has_role (used in RLS policies + UI)
--   - find_similar_tasks (utility for admin Create Task page)
--   - avg_admin_touches_per_task (KPI dashboard)
--
-- All others: revoked from anon (always) + authenticated (where they are
-- pure trigger functions with no UI callsite).

-- ============================================================================
-- Trigger functions — revoke EXECUTE entirely (callers are triggers, not users)
-- ============================================================================
REVOKE EXECUTE ON FUNCTION public.auto_process_inspection() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_billing_requirements() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_housekeeping_task_from_reservation_event() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_form_submission() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_on_task_change() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.send_push_on_notification() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_claim_deadline() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.block_public_signup() FROM anon, authenticated;

-- ============================================================================
-- Cron-triggered functions — revoke from anon (only service_role/cron calls them)
-- ============================================================================
REVOKE EXECUTE ON FUNCTION public.escalate_overdue_tasks() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.escalate_unaccepted_tasks() FROM anon, authenticated;

-- ============================================================================
-- RBAC / utility functions — keep callable by authenticated, revoke from anon
-- ============================================================================
REVOKE EXECUTE ON FUNCTION public.has_admin_access(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.find_similar_tasks(uuid, uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.avg_admin_touches_per_task() FROM anon;
