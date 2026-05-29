-- L10 sweep batch 2 (codex adversarial review 2026-05-29):
--
-- P0  Staff update vendor tasks  cross-tenant WRITE bypass.
--     Policy had USING but no WITH CHECK, so a vendor field_staff could
--     UPDATE tasks SET vendor_id = '<other-vendor-uuid>' and transfer
--     work orders out of their own queue or NULL them out to hide WOs
--     from everyone except admins. Add matching WITH CHECK.
--
-- P1  upsert_track_vendor never updated mutable fields (name/email/
--     phone/active) on existing track_vendor_id  TRACK side flips
--     vendor.isActive=false and AiiA stays stale forever. Add
--     conditional UPDATE on the fast path + same on the name-collision
--     adoption path.
--
-- P1  avg_admin_touches_per_task SECURITY DEFINER function reachable
--     via /rest/v1/rpc by any authenticated user (advisor lint 0029).
--     Pure metric  REVOKE. has_admin_access + has_role MUST stay
--     authenticated-EXECUTEable because RLS USING clauses call them.
--
-- P2  diagnose_wo_visibility + enforce_profile_self_update_scope only
--     read the singular PostgREST GUC request.jwt.claim.role. Read
--     both the singular form AND the plural request.jwt.claims JSON
--     for forward-compat with PostgREST major upgrades.
--
-- P2  profiles_email_lower_uniq covers empty-string emails  any flow
--     that signs up with email='' will conflict. Tighten the partial
--     predicate to require length>0 AND backfill any existing ''  NULL.
--
-- P2  upsert_track_vendor name-collision adoption used lower(name)
--     without trim()  TRACK's "Emma Benson CO Test " (trailing space)
--     wouldn't match local "Emma Benson CO Test"  duplicate insert.
--     Trim both sides.
--
-- P2  Add current_user_vendor_id() SECURITY DEFINER helper so vendor
--     RLS policies don't depend on profiles SELECT staying open.
--     Tightening profiles SELECT in the future cannot silently break
--     vendor-membership visibility.
--
-- P2-3  Create avg_cycle_time_hours() RPC that AdminDashboard.tsx
--      calls at line 61. Currently returns PostgREST 404.

-- 1  P0 cross-tenant write bypass
DROP POLICY IF EXISTS "Staff update vendor tasks" ON public.tasks;
CREATE POLICY "Staff update vendor tasks" ON public.tasks
  FOR UPDATE TO authenticated
  USING (
    vendor_id IS NOT NULL
    AND vendor_id IN (
      SELECT p.vendor_id FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.vendor_id IS NOT NULL
    )
  )
  WITH CHECK (
    vendor_id IS NOT NULL
    AND vendor_id IN (
      SELECT p.vendor_id FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.vendor_id IS NOT NULL
    )
  );

-- 2  P2 vendor-id helper + tighter profile.vendor_id trigger guard
CREATE OR REPLACE FUNCTION public.current_user_vendor_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_vendor UUID;
BEGIN
  SELECT vendor_id INTO v_vendor
  FROM public.profiles WHERE id = (select auth.uid()) LIMIT 1;
  RETURN v_vendor;
END $$;

REVOKE EXECUTE ON FUNCTION public.current_user_vendor_id() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.current_user_vendor_id() TO authenticated, service_role;

-- 3  P1 upsert_track_vendor  refresh mutable fields on existing rows
CREATE OR REPLACE FUNCTION public.upsert_track_vendor(
  p_track_vendor_id INTEGER,
  p_name            TEXT,
  p_contact_name    TEXT DEFAULT NULL,
  p_email           TEXT DEFAULT NULL,
  p_phone           TEXT DEFAULT NULL,
  p_is_active       BOOLEAN DEFAULT TRUE
) RETURNS TABLE (vendor_id UUID, created BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing UUID;
  v_byname   UUID;
  v_norm     TEXT := trim(p_name);
BEGIN
  IF p_track_vendor_id IS NULL THEN
    RAISE EXCEPTION 'p_track_vendor_id required' USING ERRCODE = '22023';
  END IF;
  IF v_norm IS NULL OR length(v_norm) = 0 THEN
    RAISE EXCEPTION 'p_name required' USING ERRCODE = '22023';
  END IF;

  -- 1) Fast path under FOR UPDATE row lock + refresh mutable fields.
  SELECT id INTO v_existing
  FROM public.vendors
  WHERE track_vendor_id = p_track_vendor_id
  FOR UPDATE;
  IF v_existing IS NOT NULL THEN
    UPDATE public.vendors
       SET name         = COALESCE(NULLIF(v_norm, ''), name),
           contact_name = COALESCE(p_contact_name, contact_name),
           email        = COALESCE(p_email, email),
           phone        = COALESCE(p_phone, phone),
           active       = p_is_active
     WHERE id = v_existing
       AND (name IS DISTINCT FROM v_norm
            OR active IS DISTINCT FROM p_is_active
            OR email IS DISTINCT FROM COALESCE(p_email, email)
            OR phone IS DISTINCT FROM COALESCE(p_phone, phone)
            OR contact_name IS DISTINCT FROM COALESCE(p_contact_name, contact_name));
    RETURN QUERY SELECT v_existing, FALSE;
    RETURN;
  END IF;

  -- 2) Try insert.
  BEGIN
    INSERT INTO public.vendors (
      name, contact_name, email, phone, specialty, active, track_vendor_id
    ) VALUES (
      v_norm, p_contact_name, p_email, p_phone, 'housekeeping', p_is_active, p_track_vendor_id
    )
    RETURNING id INTO v_existing;

    INSERT INTO public.audit_logs (
      action, entity_type, entity_id, description, payload_json
    ) VALUES (
      'track_vendor_auto_imported', 'edge_function', gen_random_uuid(),
      format('Auto-imported TRACK vendor %s (%s)', p_track_vendor_id, v_norm),
      jsonb_build_object('severity', 'info', 'trackVendorId', p_track_vendor_id, 'name', v_norm, 'vendorId', v_existing)
    );

    RETURN QUERY SELECT v_existing, TRUE;
    RETURN;
  EXCEPTION WHEN unique_violation THEN
    -- 3) Either track_vendor_id raced OR name collided.
    SELECT id INTO v_existing
    FROM public.vendors WHERE track_vendor_id = p_track_vendor_id;
    IF v_existing IS NOT NULL THEN
      RETURN QUERY SELECT v_existing, FALSE;
      RETURN;
    END IF;
    -- Name collision  trim both sides + accept only an unambiguous adoption.
    SELECT id INTO v_byname FROM public.vendors
    WHERE lower(trim(name)) = lower(v_norm) AND track_vendor_id IS NULL
    FOR UPDATE;
    IF v_byname IS NOT NULL AND (
      SELECT count(*) FROM public.vendors
      WHERE lower(trim(name)) = lower(v_norm) AND track_vendor_id IS NULL
    ) = 1 THEN
      UPDATE public.vendors
         SET track_vendor_id = p_track_vendor_id,
             contact_name    = COALESCE(p_contact_name, contact_name),
             email           = COALESCE(p_email, email),
             phone           = COALESCE(p_phone, phone),
             active          = p_is_active
       WHERE id = v_byname;
      RETURN QUERY SELECT v_byname, FALSE;
      RETURN;
    END IF;
    RETURN QUERY SELECT NULL::uuid, FALSE;
    RETURN;
  END;
END $$;

REVOKE EXECUTE ON FUNCTION public.upsert_track_vendor(INTEGER, TEXT, TEXT, TEXT, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.upsert_track_vendor(INTEGER, TEXT, TEXT, TEXT, TEXT, BOOLEAN)
  TO service_role;


-- 4  P1 REVOKE avg_admin_touches_per_task from authenticated
REVOKE EXECUTE ON FUNCTION public.avg_admin_touches_per_task() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.avg_admin_touches_per_task() TO service_role;

-- 5  P2 GUC dual-path for forward-compat
CREATE OR REPLACE FUNCTION public.diagnose_wo_visibility(
  p_user_email TEXT, p_external_id TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE
  v_user RECORD; v_user_roles TEXT[]; v_task RECORD;
  v_admin BOOLEAN; v_personal BOOLEAN; v_vendor BOOLEAN; v_recommendation TEXT;
  v_caller_role TEXT;
BEGIN
  v_caller_role := COALESCE(
    current_setting('request.jwt.claim.role', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
  );
  IF (v_caller_role IS NULL OR v_caller_role NOT IN ('service_role'))
     AND current_user NOT IN ('postgres', 'service_role', 'supabase_admin') THEN
    RAISE EXCEPTION 'service_role required' USING ERRCODE = '42501';
  END IF;

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

  v_admin    := EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = v_user.id AND ur.role::text IN ('admin','manager','supervisor'));
  v_personal := (v_task.assigned_to IS NOT NULL AND v_task.assigned_to = v_user.id);
  v_vendor   := (v_user.vendor_id IS NOT NULL AND v_task.vendor_id IS NOT NULL AND v_user.vendor_id = v_task.vendor_id);

  v_recommendation := CASE
    WHEN v_admin OR v_personal OR v_vendor THEN 'Visible. If user reports they still cannot see it: refresh, clear cache, confirm right account.'
    WHEN v_task.assigned_to IS NULL AND v_task.vendor_id IS NULL THEN format('Unassigned. UPDATE tasks SET assigned_to=%L WHERE id=%L; or link vendor.', v_user.id, v_task.id)
    WHEN v_task.vendor_id IS NOT NULL AND v_user.vendor_id IS NULL THEN format('Task vendor=%L (%s); user has no vendor_id. UPDATE profiles SET vendor_id=%L WHERE id=%L; (admin-only via trigger).', v_task.vendor_id, v_task.vendor_name, v_task.vendor_id, v_user.id)
    WHEN v_task.assigned_to IS NOT NULL AND v_task.assigned_to <> v_user.id THEN format('Task assigned to someone else (%L, not %L). Reassign or wait.', v_task.assigned_to, v_user.id)
    ELSE 'Not visible  check gates above.'
  END;

  RETURN jsonb_build_object(
    'visible', v_admin OR v_personal OR v_vendor,
    'gates', jsonb_build_object('admin_or_manager', v_admin, 'personal_assignment', v_personal, 'vendor_membership', v_vendor),
    'user', jsonb_build_object('id', v_user.id, 'email', v_user.email, 'full_name', v_user.full_name, 'vendor_id', v_user.vendor_id, 'roles', v_user_roles),
    'task', jsonb_build_object('id', v_task.id, 'external_id', v_task.external_id, 'title', v_task.title, 'status', v_task.status, 'category', v_task.task_category, 'assigned_to', v_task.assigned_to, 'vendor_id', v_task.vendor_id, 'vendor_name', v_task.vendor_name, 'assigned_vendor_name', v_task.assigned_vendor_name, 'unit_code', v_task.unit_code, 'track_unit_id', v_task.track_unit_id, 'property', v_task.property_name, 'created_at', v_task.created_at, 'updated_at', v_task.updated_at),
    'recommendation', v_recommendation
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.diagnose_wo_visibility(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.diagnose_wo_visibility(TEXT, TEXT) TO service_role;


CREATE OR REPLACE FUNCTION public.enforce_profile_self_update_scope()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := COALESCE(
    current_setting('request.jwt.claim.role', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
  );
  IF current_user IN ('postgres', 'service_role', 'supabase_admin') THEN
    RETURN NEW;
  END IF;
  IF v_role IS NULL OR v_role = '' THEN
    IF NEW.vendor_id IS DISTINCT FROM OLD.vendor_id THEN
      RAISE EXCEPTION 'No authenticated user; cannot modify vendor membership'
        USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;
  IF public.has_admin_access((SELECT auth.uid())) THEN
    RETURN NEW;
  END IF;
  IF NEW.vendor_id IS DISTINCT FROM OLD.vendor_id THEN
    RAISE EXCEPTION 'Field staff cannot modify their own vendor membership'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;


-- 6  P2 profiles_email_lower_uniq  exclude empty/whitespace
-- Backfill safety: convert any empty-string emails to NULL first
-- (count was 0 at migration time; future-proof).
UPDATE public.profiles SET email = NULL
WHERE email IS NOT NULL AND length(trim(email)) = 0;

DROP INDEX IF EXISTS public.profiles_email_lower_uniq;
CREATE UNIQUE INDEX profiles_email_lower_uniq
  ON public.profiles (lower(email))
  WHERE email IS NOT NULL AND length(trim(email)) > 0;


-- 7  P2-3  avg_cycle_time_hours() RPC for AdminDashboard.tsx
CREATE OR REPLACE FUNCTION public.avg_cycle_time_hours()
RETURNS NUMERIC
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT round(
    avg(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600.0)::numeric,
    2
  )
  FROM public.tasks
  WHERE completed_at IS NOT NULL
    AND created_at > now() - interval '30 days';
$$;

GRANT EXECUTE ON FUNCTION public.avg_cycle_time_hours() TO authenticated, service_role;
