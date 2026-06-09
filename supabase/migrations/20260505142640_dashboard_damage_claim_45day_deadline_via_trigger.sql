-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- 45-day SOP deadline. Generated columns reject CASE+enum as non-immutable on PG17,
-- so use a regular column maintained by a BEFORE INSERT/UPDATE trigger.

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS claim_deadline_at timestamptz;

COMMENT ON COLUMN public.tasks.claim_deadline_at IS
  '45-day SOP deadline for guest damage claims (Safely/Rental Guardian require docs within 45 days). Maintained by trg_set_claim_deadline.';

CREATE OR REPLACE FUNCTION public.set_claim_deadline()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.damage_classification = 'guest_damage' AND NEW.created_at IS NOT NULL THEN
    NEW.claim_deadline_at := NEW.created_at + interval '45 days';
  ELSE
    NEW.claim_deadline_at := NULL;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_set_claim_deadline ON public.tasks;
CREATE TRIGGER trg_set_claim_deadline
  BEFORE INSERT OR UPDATE OF damage_classification, created_at
  ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_claim_deadline();

-- Backfill for any existing tasks already classified as guest_damage
UPDATE public.tasks
   SET claim_deadline_at = created_at + interval '45 days'
 WHERE damage_classification = 'guest_damage'
   AND claim_deadline_at IS NULL;

CREATE INDEX IF NOT EXISTS tasks_claim_deadline_pending_idx
  ON public.tasks (claim_deadline_at)
  WHERE damage_classification = 'guest_damage'
    AND claim_status IN ('pending','filed');
