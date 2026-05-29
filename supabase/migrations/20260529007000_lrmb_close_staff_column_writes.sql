-- QA-destroyer L10 Agent B P0 batch (2026-05-29).
-- The enforce_staff_task_column_scope trigger guards the "field staff can
-- only update small set of progress columns" rule. Agent B found three
-- P0 holes:
--
-- P0-1 vendor_id transfer breach. Emma (staff2, vendor 77eb1af4) could
--   UPDATE tasks SET vendor_id='<other vendor uuid>' WHERE id=<her WO>.
--   "Staff update assigned tasks" RLS WITH CHECK only requires
--   assigned_to=auth.uid(); it's PERMISSIVE so it OR-combines with
--   "Staff update vendor tasks" WITH CHECK (added earlier today). The
--   weaker policy wins. The trigger was supposed to close the gap but
--   vendor_id was never in its protected-column list. Add it.
--
-- P0-2 owner_charges_amount unrestricted. Field staff wrote -99999.99
--   directly. Negative amount surfaces as a credit on the owner
--   statement downstream. Add to trigger + CHECK constraint.
--
-- P0-3 time_estimate_minutes unrestricted. Field staff wrote
--   -1000000. UI rendered "-16666h -40m" and StaffWorkload/KPI charts
--   poisoned. Add to trigger + CHECK constraint.
--
-- Also add track_clean_type_id + clean_type_name to the protected list
-- (sync-only, set by service_role; same class as external_source +
-- external_id).

CREATE OR REPLACE FUNCTION public.enforce_staff_task_column_scope()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN NEW; END IF;
  IF public.has_admin_access(v_uid) THEN RETURN NEW; END IF;
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to
     OR NEW.vendor_id IS DISTINCT FROM OLD.vendor_id
     OR NEW.property_id IS DISTINCT FROM OLD.property_id
     OR NEW.unit_id IS DISTINCT FROM OLD.unit_id
     OR NEW.priority IS DISTINCT FROM OLD.priority
     OR NEW.due_at IS DISTINCT FROM OLD.due_at
     OR NEW.scheduled_for IS DISTINCT FROM OLD.scheduled_for
     OR NEW.task_category IS DISTINCT FROM OLD.task_category
     OR NEW.task_type IS DISTINCT FROM OLD.task_type
     OR NEW.housekeeping_type IS DISTINCT FROM OLD.housekeeping_type
     OR NEW.external_source IS DISTINCT FROM OLD.external_source
     OR NEW.external_id IS DISTINCT FROM OLD.external_id
     OR NEW.track_clean_type_id IS DISTINCT FROM OLD.track_clean_type_id
     OR NEW.clean_type_name IS DISTINCT FROM OLD.clean_type_name
     OR NEW.time_estimate_minutes IS DISTINCT FROM OLD.time_estimate_minutes
     OR NEW.owner_charges_amount IS DISTINCT FROM OLD.owner_charges_amount
     OR NEW.claim_status IS DISTINCT FROM OLD.claim_status
     OR NEW.claim_filed_amount IS DISTINCT FROM OLD.claim_filed_amount
     OR NEW.claim_approved_amount IS DISTINCT FROM OLD.claim_approved_amount
     OR NEW.claim_id IS DISTINCT FROM OLD.claim_id
     OR NEW.claim_provider IS DISTINCT FROM OLD.claim_provider
     OR NEW.claim_filed_at IS DISTINCT FROM OLD.claim_filed_at
     OR NEW.claim_decided_at IS DISTINCT FROM OLD.claim_decided_at
     OR NEW.claim_deadline_at IS DISTINCT FROM OLD.claim_deadline_at
     OR NEW.requires_photo IS DISTINCT FROM OLD.requires_photo
     OR NEW.requires_note IS DISTINCT FROM OLD.requires_note
     OR NEW.requires_timestamp IS DISTINCT FROM OLD.requires_timestamp
     OR NEW.damage_classification IS DISTINCT FROM OLD.damage_classification
  THEN
    RAISE EXCEPTION 'Field staff cannot modify protected task columns'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;

-- Defense-in-depth CHECK constraints so even admin/service_role can't
-- write garbage by accident.
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_owner_charges_amount_nonneg
    CHECK (owner_charges_amount IS NULL OR (owner_charges_amount >= 0 AND owner_charges_amount <= 100000)) NOT VALID;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_time_estimate_minutes_sane
    CHECK (time_estimate_minutes IS NULL OR (time_estimate_minutes >= 0 AND time_estimate_minutes <= 1440)) NOT VALID;

-- VALIDATE separately so existing rows that are already clean lock in.
-- If any historical row violates we surface and fix before constraint
-- becomes enforced.
ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_owner_charges_amount_nonneg;
ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_time_estimate_minutes_sane;
