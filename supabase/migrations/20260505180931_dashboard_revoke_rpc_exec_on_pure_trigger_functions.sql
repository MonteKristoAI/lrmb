-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Trigger functions should never be callable as REST RPCs.
-- Both write_audit_log() (touched today) and set_claim_deadline() (added today)
-- are pure trigger functions and should be invisible to anon + authenticated roles.

REVOKE EXECUTE ON FUNCTION public.write_audit_log()    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_claim_deadline() FROM anon, authenticated;

-- Lock the search_path explicitly even though the function definitions already do.
ALTER FUNCTION public.write_audit_log()    SET search_path = public, pg_temp;
ALTER FUNCTION public.set_claim_deadline() SET search_path = public, pg_temp;
