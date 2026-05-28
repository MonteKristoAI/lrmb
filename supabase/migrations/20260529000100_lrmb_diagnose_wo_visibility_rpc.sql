-- Built after the 2026-05-28 Emma diagnostic loop where we mis-identified
-- "WO not visible" as a sync bug when it was actually an assignment-gate
-- bug. The diagnostic chain took ~2 hours and produced one wrong root-cause
-- conclusion before landing on the right one.
--
-- This RPC answers "why doesn't user X see work order Y?" in one query.
-- Returns each gate of the visibility chain so the answer is causal, not
-- yes/no.
--
-- Usage from SQL (service-role only):
--   SELECT public.diagnose_wo_visibility('staff2@lrmb.test', '32389');
--
-- Locked down: SECURITY DEFINER + REVOKE from anon + authenticated.
-- Only service_role can call. Surfacing user info + RLS state to a regular
-- user would be a leak.

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
  v_visible_by_admin BOOLEAN := false;
  v_visible_by_assigned BOOLEAN := false;
  v_visible_by_vendor BOOLEAN := false;
  v_recommendation TEXT;
BEGIN
  -- Gate 1: does the user exist in profiles?
  SELECT p.id, p.email, p.full_name, p.vendor_id
  INTO v_user
  FROM public.profiles p
  WHERE lower(p.email) = lower(p_user_email)
  LIMIT 1;

  IF v_user.id IS NULL THEN
    RETURN jsonb_build_object(
      'visible', false,
      'gate_failed', 'user_lookup',
      'reason', format('No profiles row with email %s', p_user_email)
    );
  END IF;

  -- Gate 2: what roles does the user have?
  SELECT array_agg(DISTINCT ur.role::text) INTO v_user_roles
  FROM public.user_roles ur
  WHERE ur.user_id = v_user.id;

  -- Gate 3: does the WO exist in tasks (i.e. did it sync)?
  SELECT t.id, t.status, t.task_category, t.assigned_to, t.vendor_id, t.unit_id, t.property_id,
         t.external_id, t.title, t.assigned_vendor_name, t.created_at, t.updated_at,
         u.unit_code, u.track_id AS track_unit_id, pr.name AS property_name, v.name AS vendor_name
  INTO v_task
  FROM public.tasks t
  LEFT JOIN public.units u ON u.id = t.unit_id
  LEFT JOIN public.properties pr ON pr.id = t.property_id
  LEFT JOIN public.vendors v ON v.id = t.vendor_id
  WHERE t.external_source = 'track' AND t.external_id = p_external_id
  LIMIT 1;

  IF v_task.id IS NULL THEN
    RETURN jsonb_build_object(
      'visible', false,
      'gate_failed', 'sync',
      'reason', format('No tasks row with external_source=track and external_id=%s — track-poll has not synced this WO (yet, or at all). Check audit_logs for `track_poll_info` mentioning this ID.', p_external_id),
      'user', jsonb_build_object('id', v_user.id, 'email', v_user.email, 'roles', v_user_roles)
    );
  END IF;

  -- Gate 4a: admin RLS path
  v_visible_by_admin := (
    v_user_roles && ARRAY['admin','manager']::text[]
    OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = v_user.id AND ur.role::text IN ('admin','manager','supervisor'))
  );

  -- Gate 4b: personal assignment path
  v_visible_by_assigned := (v_task.assigned_to = v_user.id);

  -- Gate 4c: vendor membership path (added 2026-05-29)
  v_visible_by_vendor := (
    v_user.vendor_id IS NOT NULL
    AND v_task.vendor_id IS NOT NULL
    AND v_user.vendor_id = v_task.vendor_id
  );

  -- Recommendation:
  v_recommendation := CASE
    WHEN v_visible_by_admin OR v_visible_by_assigned OR v_visible_by_vendor THEN
      'Visible. If user reports they still cannot see it: have them refresh the app, clear cache, or confirm they are logged in as the right account.'
    WHEN v_task.assigned_to IS NULL AND v_task.vendor_id IS NULL THEN
      format('Unassigned. Either UPDATE tasks SET assigned_to = %L WHERE id = %L; OR have an admin pick an assignee in the UI; OR link tasks.vendor_id and profiles.vendor_id so the vendor RLS policy applies.', v_user.id, v_task.id)
    WHEN v_task.vendor_id IS NOT NULL AND v_user.vendor_id IS NULL THEN
      format('Task is vendor-assigned (vendor_id=%L, name=%s) but user has no vendor_id. UPDATE profiles SET vendor_id = %L WHERE id = %L; so the new vendor-membership RLS applies.', v_task.vendor_id, v_task.vendor_name, v_task.vendor_id, v_user.id)
    WHEN v_task.assigned_to IS NOT NULL AND v_task.assigned_to <> v_user.id THEN
      format('Task is assigned to someone else (assigned_to=%L, not %L). Reassign via the admin UI or wait for that user to complete it.', v_task.assigned_to, v_user.id)
    ELSE
      'Not visible — check the RLS gates above to see which path is closest to satisfied.'
  END;

  RETURN jsonb_build_object(
    'visible', v_visible_by_admin OR v_visible_by_assigned OR v_visible_by_vendor,
    'gates', jsonb_build_object(
      'admin_or_manager', v_visible_by_admin,
      'personal_assignment', v_visible_by_assigned,
      'vendor_membership', v_visible_by_vendor
    ),
    'user', jsonb_build_object(
      'id', v_user.id,
      'email', v_user.email,
      'full_name', v_user.full_name,
      'vendor_id', v_user.vendor_id,
      'roles', v_user_roles
    ),
    'task', jsonb_build_object(
      'id', v_task.id,
      'external_id', v_task.external_id,
      'title', v_task.title,
      'status', v_task.status,
      'category', v_task.task_category,
      'assigned_to', v_task.assigned_to,
      'vendor_id', v_task.vendor_id,
      'vendor_name', v_task.vendor_name,
      'assigned_vendor_name', v_task.assigned_vendor_name,
      'unit_code', v_task.unit_code,
      'track_unit_id', v_task.track_unit_id,
      'property', v_task.property_name,
      'created_at', v_task.created_at,
      'updated_at', v_task.updated_at
    ),
    'recommendation', v_recommendation
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.diagnose_wo_visibility(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.diagnose_wo_visibility(TEXT, TEXT) TO service_role;
