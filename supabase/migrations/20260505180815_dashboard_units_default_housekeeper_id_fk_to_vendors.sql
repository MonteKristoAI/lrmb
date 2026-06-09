-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Promote units.default_housekeeper from a free-text label to a proper FK to vendors.id.
-- Keeps the existing text column to avoid breaking anything reading it; future migration drops it.
-- Backfills via case-insensitive name match, with explicit handling for the "FB Houskeeping" typo.

ALTER TABLE public.units
  ADD COLUMN IF NOT EXISTS default_housekeeper_id uuid
    REFERENCES public.vendors(id) ON DELETE SET NULL;

-- Backfill — typo handling for "FB Houskeeping" -> "FB Housekeeping"
UPDATE public.units u
SET default_housekeeper_id = v.id
FROM public.vendors v
WHERE u.default_housekeeper IS NOT NULL
  AND u.default_housekeeper <> ''
  AND u.default_housekeeper_id IS NULL
  AND lower(trim(
    CASE u.default_housekeeper
      WHEN 'FB Houskeeping' THEN 'FB Housekeeping'
      ELSE u.default_housekeeper
    END
  )) = lower(trim(v.name));

CREATE INDEX IF NOT EXISTS units_default_housekeeper_id_idx
  ON public.units (default_housekeeper_id);

COMMENT ON COLUMN public.units.default_housekeeper_id IS
  'FK to vendors.id for the default housekeeping vendor for this unit. Replaces the legacy default_housekeeper text column once UI migrates.';
