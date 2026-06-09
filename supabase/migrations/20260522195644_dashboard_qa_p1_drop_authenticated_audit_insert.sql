-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Q-SEC-8 (followup): drop the second permissive audit_logs INSERT policy.
-- Edge fns write via service-role (bypasses RLS) and triggers via SECURITY DEFINER.
-- No legitimate frontend path inserts to audit_logs directly.
DROP POLICY IF EXISTS "Authenticated insert audit logs" ON public.audit_logs;
