-- Hot-path index used by the Final Clean orchestrator + task/reservation joins.
-- Partial index keeps it small (skips NULL).
CREATE INDEX IF NOT EXISTS idx_tasks_reservation_id
  ON public.tasks (reservation_id)
  WHERE reservation_id IS NOT NULL;

-- Per Nemr Directive §16: lock vendor specialty values to the approved enum
-- via CHECK constraint (vendors.specialty is text — soft constraint is
-- cheaper than migrating to a typed enum and preserves admin flexibility
-- if new specialties emerge).
ALTER TABLE public.vendors
  DROP CONSTRAINT IF EXISTS vendors_specialty_allowed;

ALTER TABLE public.vendors
  ADD CONSTRAINT vendors_specialty_allowed
  CHECK (
    specialty IS NULL OR specialty IN (
      'plumbing', 'electrical', 'HVAC', 'general maintenance',
      'pest', 'pool', 'housekeeping', 'linen/laundry', 'locksmith', 'other'
    )
  ) NOT VALID;

DO $$
BEGIN
  ALTER TABLE public.vendors VALIDATE CONSTRAINT vendors_specialty_allowed;
EXCEPTION WHEN check_violation THEN
  RAISE NOTICE 'Existing vendor rows violate the specialty allowlist; constraint stays NOT VALID until cleanup.';
END $$;

-- Audit log retention helper. Manual run only for now — retention isn't
-- yet a problem (73K rows, 0 older than 90d). When that changes, schedule
-- this via pg_cron. Skips severity='error' entries so we don't lose
-- alerting history.
CREATE OR REPLACE FUNCTION public.prune_audit_logs(p_keep_days integer DEFAULT 90)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  WITH del AS (
    DELETE FROM public.audit_logs
    WHERE created_at < now() - (p_keep_days || ' days')::interval
      AND COALESCE(payload_json->>'severity', 'info') <> 'error'
    RETURNING 1
  )
  SELECT count(*) INTO v_deleted FROM del;
  RETURN v_deleted;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.prune_audit_logs(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_audit_logs(integer) TO service_role;
