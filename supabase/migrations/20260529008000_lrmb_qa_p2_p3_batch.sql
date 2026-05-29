-- QA-destroyer P2/P3 batch (2026-05-29). Closes:
--   B-P2-11 whitespace-only inputs (server-side CHECK constraints)
--   B-P3-12 handleReopen atomic RPC (lost-write window)
--   D-P2   v_track_sync_health SECURITY DEFINER lint (security_invoker)
--   D-P2   3 MVs visible to all authenticated -> admin-only via RPC
--
-- Already done earlier today (no-op verify):
--   C-P1-02 + C-P2-06 MV refresh cadence (cron 13 */5, 14+15 */10 CONCURRENTLY)
--   D-P2   http extension moved to extensions schema
--   D-P3   "6 tables coarse ALL policy" — none exist on public (false positive)

-- 1) B-P2-11 whitespace-only inputs
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_blocked_reason_nonblank
    CHECK (blocked_reason IS NULL OR length(trim(blocked_reason)) >= 1) NOT VALID;
ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_blocked_reason_nonblank;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_title_nonblank
    CHECK (title IS NULL OR length(trim(title)) >= 1) NOT VALID;
ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_title_nonblank;

ALTER TABLE public.task_updates
  ADD CONSTRAINT task_updates_note_nonblank
    CHECK (note IS NULL OR length(trim(note)) >= 1) NOT VALID;
ALTER TABLE public.task_updates VALIDATE CONSTRAINT task_updates_note_nonblank;

-- 2) B-P3-12 atomic reopen (drop first because existing reopen_task
-- has a different return signature)
DROP FUNCTION IF EXISTS public.reopen_task(uuid, text);
CREATE OR REPLACE FUNCTION public.reopen_task(
  p_task_id uuid,
  p_expected_status text
) RETURNS TABLE (id uuid, status text, reopened_count integer)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  -- RLS still applies. We rely on the "Staff update assigned tasks"
  -- (or admin) policy to gate access. Atomicity comes from the single
  -- UPDATE with WHERE status = expected — second concurrent caller's
  -- row count is 0 and gets a NULL result back.
  RETURN QUERY
    UPDATE public.tasks t
       SET status         = 'new'::task_status,
           reopened_count = COALESCE(t.reopened_count, 0) + 1,
           completed_at   = NULL,
           verified_at    = NULL,
           processed_at   = NULL,
           processed_by   = NULL,
           updated_at     = now()
     WHERE t.id = p_task_id
       AND t.status::text = p_expected_status
     RETURNING t.id, t.status::text, t.reopened_count;
END $$;
GRANT EXECUTE ON FUNCTION public.reopen_task(uuid, text) TO authenticated, service_role;

-- 3) D-P2 v_track_sync_health SECURITY DEFINER lint -> security_invoker
ALTER VIEW public.v_track_sync_health SET (security_invoker = true);

-- 4) D-P2 3 MVs visible to all authenticated -> admin-only RPC
REVOKE SELECT ON public.mv_ops_dashboard_kpis FROM authenticated;
REVOKE SELECT ON public.mv_ops_dashboard_kpis_by_property FROM authenticated;
REVOKE SELECT ON public.mv_track_reservations_latest FROM authenticated;

CREATE OR REPLACE FUNCTION public.get_dashboard_kpis()
RETURNS SETOF public.mv_ops_dashboard_kpis
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RETURN;
  END IF;
  RETURN QUERY SELECT * FROM public.mv_ops_dashboard_kpis LIMIT 1;
END $$;
GRANT EXECUTE ON FUNCTION public.get_dashboard_kpis() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_dashboard_kpis_by_property()
RETURNS SETOF public.mv_ops_dashboard_kpis_by_property
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RETURN;
  END IF;
  RETURN QUERY SELECT * FROM public.mv_ops_dashboard_kpis_by_property;
END $$;
GRANT EXECUTE ON FUNCTION public.get_dashboard_kpis_by_property() TO authenticated, service_role;

COMMENT ON FUNCTION public.get_dashboard_kpis() IS 'Admin/supervisor/manager only. Returns mv_ops_dashboard_kpis row or empty for non-admin callers. RLS bypassed via SECURITY DEFINER, gate enforced via has_admin_access(auth.uid()).';
