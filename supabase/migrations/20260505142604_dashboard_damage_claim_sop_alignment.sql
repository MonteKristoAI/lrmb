-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Align tasks/task_photos schema with LRMB Damage Claim SOP (2026-04-20).
-- All additive, nullable, backwards-compatible.

-- 1. Three-way responsibility (Owner / Guest / LRMB) per SOP
ALTER TYPE public.damage_classification ADD VALUE IF NOT EXISTS 'owner_damage';
ALTER TYPE public.damage_classification ADD VALUE IF NOT EXISTS 'management_damage';

-- 2. Distinguish vendor invoice vs claim amounts
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS claim_filed_amount   numeric,
  ADD COLUMN IF NOT EXISTS claim_approved_amount numeric,
  ADD COLUMN IF NOT EXISTS claim_filed_at        timestamptz,
  ADD COLUMN IF NOT EXISTS claim_decided_at      timestamptz;

COMMENT ON COLUMN public.tasks.claim_filed_amount IS
  'Amount filed in Safely / Rental Guardian (may differ from vendor_invoice_amount due to markup or aggregated line items).';
COMMENT ON COLUMN public.tasks.claim_approved_amount IS
  'Amount the claim platform approved. NULL if claim is still pending or denied.';
COMMENT ON COLUMN public.tasks.claim_filed_at IS
  'Timestamp the claim was submitted to the platform; pairs with claim_status=filed.';
COMMENT ON COLUMN public.tasks.claim_decided_at IS
  'Timestamp the claim was approved or denied; pairs with claim_status=approved|denied.';

-- 3. Photo subtype vocabulary so the SOP-required before/after/closeup/receipt distinctions are explicit
DO $$
BEGIN
  -- Backfill any non-conforming subtype values to 'other' first so the constraint will hold
  UPDATE public.task_photos
     SET photo_subtype = 'other'
   WHERE photo_subtype IS NOT NULL
     AND photo_subtype NOT IN ('before','after','wide','closeup','receipt','invoice','formal_statement','other');

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'task_photos_subtype_vocabulary'
  ) THEN
    ALTER TABLE public.task_photos
      ADD CONSTRAINT task_photos_subtype_vocabulary
      CHECK (
        photo_subtype IS NULL OR photo_subtype IN
        ('before','after','wide','closeup','receipt','invoice','formal_statement','other')
      );
  END IF;
END $$;
