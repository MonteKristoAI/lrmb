-- QA P1: RLS hardening (Q-SEC-5..9)
--
-- Closes 4 gaps surfaced by the 2026-05-22 QA hunt:
--   Q-SEC-5,6  Storage RLS lets any auth user read/write any path in task-photos.
--              Scope to caller's assigned tasks (admin retains full access).
--   Q-SEC-7    Field staff UPDATE policy on tasks allowed changing ANY column
--              (priority/due_at/property_id/billing) as long as assigned_to stayed self.
--              Trigger now blocks non-admin staff from changing protected columns.
--   Q-SEC-8    audit_logs INSERT policy was WITH CHECK (true). Triggers writing
--              via write_audit_log() are SECURITY DEFINER and bypass RLS, so
--              direct REST INSERTs can be restricted to admin without breaking
--              the legitimate audit pipeline.
--   Q-SEC-9    find_similar_tasks() was SECURITY DEFINER so it bypassed RLS
--              entirely; staff could probe titles at properties they have no
--              assignment to. Switched to SECURITY INVOKER so the caller's RLS
--              policies apply.

-- ============================================================================
-- Q-SEC-5,6: Storage path-scoped policies on task-photos bucket
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users upload task photos"
  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users read task photos"
  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload task photos"
  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view task photos"
  ON storage.objects;
DROP POLICY IF EXISTS "task_photos_insert_scoped"
  ON storage.objects;
DROP POLICY IF EXISTS "task_photos_select_scoped"
  ON storage.objects;
DROP POLICY IF EXISTS "task_photos_update_scoped"
  ON storage.objects;
DROP POLICY IF EXISTS "task_photos_delete_scoped"
  ON storage.objects;

-- Helper: check storage object path belongs to a task the caller can write.
-- Convention (set by src/hooks/useTasks.ts::useUploadTaskPhoto):
--   {propertyId}/{taskId}/{uuid}.{ext}
-- Foldername index 1 = propertyId, index 2 = taskId (uuid string).
CREATE OR REPLACE FUNCTION public.can_write_task_photo(p_path text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path TO public, storage
AS $$
DECLARE
  v_task_id uuid;
  v_property_id uuid;
  v_segments text[];
BEGIN
  IF p_path IS NULL OR p_path = '' THEN RETURN false; END IF;
  v_segments := storage.foldername(p_path);
  IF array_length(v_segments, 1) < 2 THEN RETURN false; END IF;

  BEGIN
    v_property_id := v_segments[1]::uuid;
    v_task_id := v_segments[2]::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    RETURN false;
  END;

  IF public.has_admin_access(auth.uid()) THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.tasks t
    WHERE t.id = v_task_id
      AND t.assigned_to = auth.uid()
      AND (t.property_id IS NULL OR t.property_id = v_property_id)
  );
END;
$$;
REVOKE EXECUTE ON FUNCTION public.can_write_task_photo(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_write_task_photo(text) TO authenticated;

CREATE POLICY "task_photos_insert_scoped"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'task-photos'
    AND public.can_write_task_photo(name)
  );

CREATE POLICY "task_photos_select_scoped"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'task-photos'
    AND public.can_write_task_photo(name)
  );

CREATE POLICY "task_photos_update_scoped"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'task-photos'
    AND public.can_write_task_photo(name)
  )
  WITH CHECK (
    bucket_id = 'task-photos'
    AND public.can_write_task_photo(name)
  );

CREATE POLICY "task_photos_delete_scoped"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'task-photos'
    AND public.can_write_task_photo(name)
  );

-- ============================================================================
-- Q-SEC-7: Field staff cannot mutate protected task columns
-- ============================================================================
CREATE OR REPLACE FUNCTION public.enforce_staff_task_column_scope()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  -- auth.uid() = NULL means caller is not REST-authenticated (service_role,
  -- pg_cron, SECURITY DEFINER trigger context). Don't block those.
  IF v_uid IS NULL THEN RETURN NEW; END IF;

  -- Admins/supervisors/managers retain full update access.
  IF public.has_admin_access(v_uid) THEN
    RETURN NEW;
  END IF;

  -- Field staff may only mutate status/notes/timestamps/photo flags on tasks
  -- assigned to them. Any change to assignment, scheduling, priority,
  -- billing, or external linkage requires admin.
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
REVOKE EXECUTE ON FUNCTION public.enforce_staff_task_column_scope() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_enforce_staff_task_column_scope ON public.tasks;
CREATE TRIGGER trg_enforce_staff_task_column_scope
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_staff_task_column_scope();

-- ============================================================================
-- Q-SEC-8: audit_logs INSERT no longer accepts forged rows from REST clients
-- ============================================================================
DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated insert audit logs" ON public.audit_logs;

CREATE POLICY "Admin insert audit logs"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_access(auth.uid()));

-- write_audit_log() is SECURITY DEFINER so trigger-based audit writes continue
-- to work regardless of the calling role. Service-role writes (edge fns) also
-- bypass RLS. Only the forge-from-REST path is now closed.

-- ============================================================================
-- Q-SEC-9: find_similar_tasks honours caller RLS
-- ============================================================================
DROP FUNCTION IF EXISTS public.find_similar_tasks(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.find_similar_tasks(
  p_property_id uuid,
  p_unit_id uuid DEFAULT NULL,
  p_title text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  status public.task_status,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO public
AS $$
  SELECT
    t.id,
    t.title,
    t.status,
    t.created_at
  FROM public.tasks t
  WHERE t.property_id = p_property_id
    AND (p_unit_id IS NULL OR t.unit_id = p_unit_id)
    AND t.status NOT IN ('completed', 'verified', 'processed')
    AND (
      p_title IS NULL
      OR length(trim(p_title)) < 3
      OR t.title ILIKE '%' || trim(p_title) || '%'
    )
  ORDER BY t.created_at DESC
  LIMIT 10
$$;
REVOKE EXECUTE ON FUNCTION public.find_similar_tasks(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.find_similar_tasks(uuid, uuid, text) TO authenticated;
