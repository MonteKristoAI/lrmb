-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- QA-destroyer L1 hit: 16x 403 on /rest/v1/rpc/avg_admin_touches_per_task.
-- Migration 20260529002100 revoked EXECUTE from authenticated based on the
-- codex L10 review flagging it as advisor 0029 ("SECURITY DEFINER function
-- exposed to authenticated"). That ignored the fact that AdminDashboard.tsx
-- and KPIOverview.tsx both call it. RPC returns a scalar aggregate (count
-- ratio over task_updates joined to user_roles) — no PII, no per-row
-- access. Re-grant + document.
GRANT EXECUTE ON FUNCTION public.avg_admin_touches_per_task() TO authenticated;
COMMENT ON FUNCTION public.avg_admin_touches_per_task() IS
'Aggregate scalar metric. Returns avg admin/supervisor/manager touches per task. Safe to expose to authenticated — no PII, no per-row access.';
