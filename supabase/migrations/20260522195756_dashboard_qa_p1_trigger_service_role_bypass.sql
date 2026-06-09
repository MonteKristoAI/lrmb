-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Trigger must NOT block service-role / cron / superuser writes.
-- auth.uid() = NULL means caller is not a REST-authenticated user (it's
-- either service_role, postgres, or a SECURITY DEFINER function called
-- without JWT). In all those cases we want the trigger to be a no-op.
CREATE OR REPLACE FUNCTION public.enforce_staff_task_column_scope()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path TO public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  -- Not a REST-authenticated user (service-role, cron, trigger context) -> skip.
  IF v_uid IS NULL THEN RETURN NEW; END IF;
  -- Admin/supervisor/manager -> skip.
  IF public.has_admin_access(v_uid) THEN RETURN NEW; END IF;
  -- Field staff: block any change to protected columns.
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to
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
END;
$$;
