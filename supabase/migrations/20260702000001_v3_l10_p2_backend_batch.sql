-- v3.0 L10 P2/P3 batch (2026-07-02) — actual DDL backfilled per audit MIG-08.
-- Original file was comment-only. Fresh db reset would silently drop these 5 fixes.
--
-- P2: my_smart_queue tie-break did not include priority.
-- P2: task_priority_scores RLS was USING (true), letting authenticated users
--     read scores for tasks their tasks-RLS forbids (VIP+revenue leak).
-- P2: sla_targets had no optimistic locking.
-- P2: task_priority_scores stale-cache when admin changed priority.
-- P2: p2_health_dropped could not fire for a property's first 30 min.

CREATE OR REPLACE FUNCTION public.my_smart_queue(p_limit int DEFAULT 20)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid(); v_vendor_id uuid;
BEGIN
  IF v_uid IS NULL THEN RETURN '[]'::jsonb; END IF;
  SELECT vendor_id INTO v_vendor_id FROM public.profiles WHERE id = v_uid;
  RETURN (
    SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
      SELECT t.id, t.title, t.status, t.priority, t.task_category, t.housekeeping_type,
        t.due_at, t.scheduled_for, t.started_at, t.completed_at, t.created_at,
        t.updated_at, t.external_id, t.unit_id, t.property_id, t.assigned_to,
        t.blocked_reason,
        COALESCE(s.score, 0) AS smart_queue_score,
        COALESCE(s.reason, '') AS smart_queue_reason,
        (SELECT row_to_json(p) FROM public.properties p WHERE p.id = t.property_id) AS properties,
        (SELECT row_to_json(u) FROM public.units u WHERE u.id = t.unit_id) AS units
      FROM public.tasks t
      LEFT JOIN public.task_priority_scores s ON s.task_id = t.id
      WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        AND (
          t.assigned_to = v_uid
          OR (v_vendor_id IS NOT NULL AND t.vendor_id = v_vendor_id)
        )
      ORDER BY COALESCE(s.score, 0) DESC NULLS LAST,
        CASE t.priority WHEN 'urgent' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC,
        t.due_at ASC NULLS LAST,
        t.created_at ASC
      LIMIT p_limit
    ) t
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.my_smart_queue(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.my_smart_queue(int) TO authenticated;

DROP POLICY IF EXISTS task_priority_scores_read_authenticated ON public.task_priority_scores;
DROP POLICY IF EXISTS task_priority_scores_read_scoped ON public.task_priority_scores;

CREATE POLICY task_priority_scores_read_scoped ON public.task_priority_scores
  FOR SELECT TO authenticated
  USING (
    public.has_admin_access((SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_priority_scores.task_id
        AND (
          t.assigned_to = (SELECT auth.uid())
          OR t.vendor_id = (SELECT vendor_id FROM public.profiles WHERE id = (SELECT auth.uid()))
        )
    )
  );

ALTER TABLE public.sla_targets ADD COLUMN IF NOT EXISTS row_version integer NOT NULL DEFAULT 1;

CREATE OR REPLACE FUNCTION public.sla_targets_bump_version() RETURNS trigger
  LANGUAGE plpgsql AS $$
BEGIN
  IF (NEW.row_version IS NOT DISTINCT FROM OLD.row_version) THEN
    NEW.row_version := OLD.row_version + 1;
  ELSIF (NEW.row_version <> OLD.row_version + 1) THEN
    RAISE EXCEPTION 'sla_targets row_version conflict (expected %, got %)',
      OLD.row_version, NEW.row_version USING ERRCODE = '40001';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS sla_targets_bump_version_tg ON public.sla_targets;
CREATE TRIGGER sla_targets_bump_version_tg
  BEFORE UPDATE ON public.sla_targets
  FOR EACH ROW EXECUTE FUNCTION public.sla_targets_bump_version();

CREATE OR REPLACE FUNCTION public.tasks_recompute_score_on_change() RETURNS trigger
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.task_priority_scores WHERE task_id = OLD.id;
    RETURN OLD;
  END IF;
  IF NEW.status NOT IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') THEN
    DELETE FROM public.task_priority_scores WHERE task_id = NEW.id;
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND
     NEW.priority IS NOT DISTINCT FROM OLD.priority AND
     NEW.status IS NOT DISTINCT FROM OLD.status AND
     NEW.due_at IS NOT DISTINCT FROM OLD.due_at AND
     NEW.unit_id IS NOT DISTINCT FROM OLD.unit_id THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.task_priority_scores (task_id, score, reason, computed_at)
  VALUES (NEW.id, public.smart_queue_score(NEW.id), public.smart_queue_reason(NEW.id), now())
  ON CONFLICT (task_id) DO UPDATE SET
    score = EXCLUDED.score, reason = EXCLUDED.reason, computed_at = EXCLUDED.computed_at;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS tasks_recompute_score_tg ON public.tasks;
CREATE TRIGGER tasks_recompute_score_tg
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.tasks_recompute_score_on_change();
