-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- QA-destroyer Agent C P0: task-photos bucket had two coexisting permissive
-- policies. The QA P1 hardening migration 20260522080000 added the path-
-- scoped policies (task_photos_insert_scoped + task_photos_delete_scoped
-- gated on can_write_task_photo(name)) but did NOT drop the legacy ones.
-- Postgres OR-combines permissive policies, so the looser legacy wins ->
-- any authenticated user can upload to or delete from any task folder.
-- This defeated the entire hardening.
--
-- Fix: drop both legacy policies. The scoped policies stay and enforce
-- per-task ownership via can_write_task_photo() which checks tasks.
-- assigned_to / vendor_id / admin_role visibility.
--
-- Note: legacy INSERT also covered the lrmb-onboarding bucket. That
-- bucket has 1 object today and the onboarding form is anon-only (and
-- the form_submissions table is the actual data sink). If a future
-- onboarding flow needs server-side photo upload, add a bucket-specific
-- scoped policy then.

DROP POLICY IF EXISTS "Authenticated upload to task-photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users delete task photos" ON storage.objects;
