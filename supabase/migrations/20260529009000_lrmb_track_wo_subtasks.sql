-- Emma feedback 2026-05-29: each TRACK clean type has a per-WO
-- checklist of specific sub-tasks the cleaner has to complete
-- (verified live: WO #32419 has 25 inspection items). TRACK exposes
-- them at /api/pms/housekeeping/work-orders/{id}/tasks with id, name,
-- isCompleted, completedBy, completedAt, sortOrder.
--
-- We mirror them locally per WO so the field-staff PWA can render the
-- checklist offline + so we can persist completion state across sessions.
--
-- RLS: a user can SELECT the subtasks of any task they can see (delegates
-- to tasks RLS via EXISTS). UPDATE: only the field staff who can update
-- the parent task can flip isCompleted. INSERT/DELETE: service-role only
-- (sync from TRACK).

CREATE TABLE IF NOT EXISTS public.track_wo_subtasks (
  track_id      BIGINT PRIMARY KEY,
  task_id       UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  sort_order    INTEGER,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  completed_by  TEXT,
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS track_wo_subtasks_task_id_idx
  ON public.track_wo_subtasks (task_id, sort_order NULLS LAST, track_id);

ALTER TABLE public.track_wo_subtasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subtasks_select_via_parent_task" ON public.track_wo_subtasks;
CREATE POLICY "subtasks_select_via_parent_task" ON public.track_wo_subtasks
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.tasks t WHERE t.id = track_wo_subtasks.task_id
  ));

DROP POLICY IF EXISTS "subtasks_update_via_parent_task" ON public.track_wo_subtasks;
CREATE POLICY "subtasks_update_via_parent_task" ON public.track_wo_subtasks
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.tasks t
    WHERE t.id = track_wo_subtasks.task_id
      AND (
        public.has_admin_access((SELECT auth.uid()))
        OR t.assigned_to = (SELECT auth.uid())
        OR (t.vendor_id IS NOT NULL AND t.vendor_id IN (
          SELECT vendor_id FROM public.profiles
          WHERE id = (SELECT auth.uid()) AND vendor_id IS NOT NULL
        ))
      )
  ))
  WITH CHECK (true);

GRANT SELECT, UPDATE ON public.track_wo_subtasks TO authenticated;
GRANT ALL ON public.track_wo_subtasks TO service_role;
