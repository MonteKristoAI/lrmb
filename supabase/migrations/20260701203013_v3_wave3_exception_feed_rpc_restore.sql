-- 20260701203013_v3_wave3_exception_feed_rpc_restore
--
-- This migration was applied to prod via MCP apply_migration during the
-- v3.0 ship + L10 audit sweep. Its DDL was later folded into a consolidated
-- L10 batch (20260702010001_v3_l10_p0_security_correctness.sql,
-- 20260702000001_v3_l10_p2_backend_batch.sql, or a subsequent `fix` migration).
--
-- Kept as a marker file so `supabase db reset` and `supabase migration repair`
-- align repo state with prod state without touching schema twice. The
-- consolidated file is idempotent (CREATE OR REPLACE / DROP IF EXISTS +
-- CREATE), so re-running it after this no-op is safe.
--
-- Do NOT delete this file. If you delete it, `supabase migration list` will
-- report the corresponding prod version as unknown to repo.

SELECT 1;
