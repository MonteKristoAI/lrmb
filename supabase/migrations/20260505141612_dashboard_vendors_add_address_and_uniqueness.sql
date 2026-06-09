-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Add address column for street address from TRACK / Trainual export.
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS address text;

-- Enforce one vendor per case-insensitive name to make bulk imports idempotent.
CREATE UNIQUE INDEX IF NOT EXISTS vendors_name_lower_unique
  ON public.vendors (lower(name));

COMMENT ON COLUMN public.vendors.address IS
  'Street address per LRMB Vendors export (Emma 2026-04-20).';
