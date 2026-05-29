-- Recap migration of the 4 inline fixes applied via mcp__supabase
-- during the QA-destroyer 2026-05-29 session. Already live; this file
-- exists for git history + future re-apply replay.

-- P0-1 (L1 self-found): regrant avg_admin_touches_per_task
GRANT EXECUTE ON FUNCTION public.avg_admin_touches_per_task() TO authenticated;
COMMENT ON FUNCTION public.avg_admin_touches_per_task() IS
'Aggregate scalar metric. Returns avg admin/supervisor/manager touches per task. Safe to expose to authenticated — no PII, no per-row access.';

-- P0-2 (L1 self-found): revoke avg_cycle_time_hours from public/anon
REVOKE EXECUTE ON FUNCTION public.avg_cycle_time_hours() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.avg_cycle_time_hours() TO authenticated, service_role;

-- P0-6 (Agent C): drop legacy task-photos permissive policies
DROP POLICY IF EXISTS "Authenticated upload to task-photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users delete task photos" ON storage.objects;

-- P0-7 + P0-8 (Agent D): form_submissions PII leak + anon UPDATE bypass
UPDATE public.form_submissions
SET view_password = 'INTERNAL_' || encode(gen_random_bytes(24), 'hex')
WHERE id = 'f2526a6b-fb5f-4543-b6a6-9ad2c3a7aee8'
  AND view_password = 'DRAFT';
DROP POLICY IF EXISTS "anon_select_drafts_only" ON public.form_submissions;
CREATE POLICY "anon_select_drafts_only" ON public.form_submissions
  FOR SELECT TO anon
  USING (
    view_password LIKE 'DRAFT_%'
    AND length(view_password) >= 10
    AND client = 'lrmb'
  );
DROP POLICY IF EXISTS "anon_update_drafts" ON public.form_submissions;
CREATE POLICY "anon_update_drafts" ON public.form_submissions
  FOR UPDATE TO anon
  USING (
    view_password LIKE 'DRAFT_%'
    AND length(view_password) >= 10
    AND client = 'lrmb'
  )
  WITH CHECK (
    view_password LIKE 'DRAFT_%'
    AND length(view_password) >= 10
    AND client = 'lrmb'
  );

-- P1-7 (Agent D): has_admin_access + has_role IDOR
CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller uuid := auth.uid(); v_is_admin boolean;
BEGIN
  IF v_caller IS NULL THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role IN ('admin','supervisor','manager')) INTO v_is_admin;
    RETURN v_is_admin;
  END IF;
  IF _user_id <> v_caller THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles
      WHERE user_id = v_caller AND role IN ('admin','supervisor','manager')) INTO v_is_admin;
    IF NOT v_is_admin THEN RETURN false; END IF;
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','supervisor','manager')) INTO v_is_admin;
  RETURN v_is_admin;
END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller uuid := auth.uid(); v_admin boolean; v_has boolean;
BEGIN
  IF v_caller IS NULL THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) INTO v_has;
    RETURN v_has;
  END IF;
  IF _user_id <> v_caller THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles
      WHERE user_id = v_caller AND role IN ('admin','supervisor','manager')) INTO v_admin;
    IF NOT v_admin THEN RETURN false; END IF;
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) INTO v_has;
  RETURN v_has;
END $$;
