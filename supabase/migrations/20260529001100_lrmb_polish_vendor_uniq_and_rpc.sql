-- Two follow-ups from the self-audit after 20260529000000 + 001000 shipped:
--
-- 1. vendors_track_vendor_id_uniq is partial (WHERE track_vendor_id IS NOT NULL).
--    Yesterday's experience (units_track_id_uniq, migration 20260528180000)
--    proved PostgREST UPSERT ON CONFLICT cannot resolve a partial unique
--    index. Recreate as non-partial UNIQUE so a future track-poll v23
--    vendor auto-import can `.upsert({...}, { onConflict: "track_vendor_id" })`.
--    Postgres UNIQUE treats NULLs as distinct natively, so multiple NULL
--    track_vendor_id rows coexist as before.
--
-- 2. diagnose_wo_visibility's personal_assignment gate returns NULL (not
--    false) when assigned_to IS NULL, because `NULL = uuid` is NULL.
--    Propagated NULLs make the final `visible` flag also NULL in JSON
--    output, which the caller can't sanely branch on. Guard each gate
--    with IS NOT NULL + COALESCE to false.

DROP INDEX IF EXISTS public.vendors_track_vendor_id_uniq;
CREATE UNIQUE INDEX vendors_track_vendor_id_uniq
  ON public.vendors (track_vendor_id);

-- RPC rewrite — same return shape, NULL-safe gates.
CREATE OR REPLACE FUNCTION public.diagnose_wo_visibility(
  p_user_email TEXT,
  p_external_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_user RECORD;
  v_user_roles TEXT[];
  v_task RECORD;
  v_admin BOOLEAN;
  v_personal BOOLEAN;
  v_vendor BOOLEAN;
  v_recommendation TEXT;
BEGIN
  SELECT p.id, p.email, p.full_name, p.vendor_id INTO v_user
  FROM public.profiles p WHERE lower(p.email) = lower(p_user_email) LIMIT 1;
  IF v_user.id IS NULL THEN
    RETURN jsonb_build_object('visible', false, 'gate_failed', 'user_lookup',
      'reason', format('No profiles row with email %s', p_user_email));
  END IF;

  SELECT array_agg(DISTINCT ur.role::text) INTO v_user_roles
  FROM public.user_roles ur WHERE ur.user_id = v_user.id;

  SELECT t.id, t.status, t.task_category, t.assigned_to, t.vendor_id, t.unit_id, t.property_id,
         t.external_id, t.title, t.assigned_vendor_name, t.created_at, t.updated_at,
         u.unit_code, u.track_id AS track_unit_id, pr.name AS property_name, v.name AS vendor_name
  INTO v_task FROM public.tasks t
  LEFT JOIN public.units u ON u.id = t.unit_id
  LEFT JOIN public.properties pr ON pr.id = t.property_id
  LEFT JOIN public.vendors v ON v.id = t.vendor_id
  WHERE t.external_source = 'track' AND t.external_id = p_external_id LIMIT 1;

  IF v_task.id IS NULL THEN
    RETURN jsonb_build_object('visible', false, 'gate_failed', 'sync',
      'reason', format('No tasks row with external_source=track and external_id=%s', p_external_id),
      'user', jsonb_build_object('id', v_user.id, 'email', v_user.email, 'roles', v_user_roles));
  END IF;

  -- NULL-safe gates. Each returns strictly true/false, never NULL.
  v_admin := EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = v_user.id AND ur.role::text IN ('admin','manager','supervisor')
  );
  v_personal := (v_task.assigned_to IS NOT NULL AND v_task.assigned_to = v_user.id);
  v_vendor := (
    v_user.vendor_id IS NOT NULL
    AND v_task.vendor_id IS NOT NULL
    AND v_user.vendor_id = v_task.vendor_id
  );

  v_recommendation := CASE
    WHEN v_admin OR v_personal OR v_vendor THEN
      'Visible. If user reports they still cannot see it: refresh, clear cache, confirm right account.'
    WHEN v_task.assigned_to IS NULL AND v_task.vendor_id IS NULL THEN
      format('Unassigned. UPDATE tasks SET assigned_to=%L WHERE id=%L; or link vendor.', v_user.id, v_task.id)
    WHEN v_task.vendor_id IS NOT NULL AND v_user.vendor_id IS NULL THEN
      format('Task vendor=%L (%s); user has no vendor_id. UPDATE profiles SET vendor_id=%L WHERE id=%L; (admin-only via trigger).', v_task.vendor_id, v_task.vendor_name, v_task.vendor_id, v_user.id)
    WHEN v_task.assigned_to IS NOT NULL AND v_task.assigned_to <> v_user.id THEN
      format('Task assigned to someone else (%L, not %L). Reassign or wait.', v_task.assigned_to, v_user.id)
    ELSE 'Not visible — check gates above.'
  END;

  RETURN jsonb_build_object(
    'visible', v_admin OR v_personal OR v_vendor,
    'gates', jsonb_build_object(
      'admin_or_manager', v_admin,
      'personal_assignment', v_personal,
      'vendor_membership', v_vendor
    ),
    'user', jsonb_build_object('id', v_user.id, 'email', v_user.email, 'full_name', v_user.full_name, 'vendor_id', v_user.vendor_id, 'roles', v_user_roles),
    'task', jsonb_build_object('id', v_task.id, 'external_id', v_task.external_id, 'title', v_task.title, 'status', v_task.status, 'category', v_task.task_category, 'assigned_to', v_task.assigned_to, 'vendor_id', v_task.vendor_id, 'vendor_name', v_task.vendor_name, 'assigned_vendor_name', v_task.assigned_vendor_name, 'unit_code', v_task.unit_code, 'track_unit_id', v_task.track_unit_id, 'property', v_task.property_name, 'created_at', v_task.created_at, 'updated_at', v_task.updated_at),
    'recommendation', v_recommendation
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.diagnose_wo_visibility(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.diagnose_wo_visibility(TEXT, TEXT) TO service_role;
