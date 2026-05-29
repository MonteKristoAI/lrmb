-- Anti-regression for Emma's "start at Not Started, flip on first
-- action" rule. Frontend bumpStartedIfPending covers subtask toggle +
-- photo upload, but a future contributor adding a new action (note,
-- block, claim) may forget. Centralize at the DB layer.

CREATE OR REPLACE FUNCTION public.auto_bump_in_progress_on_first_action()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_current text;
BEGIN
  IF NEW.task_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.update_type NOT IN ('note', 'photo_upload', 'photo_delete') THEN
    RETURN NEW;
  END IF;
  SELECT status::text INTO v_current FROM public.tasks WHERE id = NEW.task_id;
  IF v_current IN ('new', 'vendor_not_started') THEN
    UPDATE public.tasks
       SET status = 'in_progress'::task_status,
           started_at = COALESCE(started_at, now()),
           updated_at = now()
     WHERE id = NEW.task_id
       AND status::text IN ('new', 'vendor_not_started');
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_auto_bump_in_progress_on_first_action ON public.task_updates;
CREATE TRIGGER trg_auto_bump_in_progress_on_first_action
  AFTER INSERT ON public.task_updates
  FOR EACH ROW EXECUTE FUNCTION public.auto_bump_in_progress_on_first_action();

CREATE OR REPLACE FUNCTION public.auto_bump_in_progress_on_subtask_toggle()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.task_id IS NULL THEN RETURN NEW; END IF;
  IF OLD.is_completed = false AND NEW.is_completed = true THEN
    UPDATE public.tasks
       SET status = 'in_progress'::task_status,
           started_at = COALESCE(started_at, now()),
           updated_at = now()
     WHERE id = NEW.task_id
       AND status::text IN ('new', 'vendor_not_started');
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_auto_bump_in_progress_on_subtask_toggle ON public.track_wo_subtasks;
CREATE TRIGGER trg_auto_bump_in_progress_on_subtask_toggle
  AFTER UPDATE OF is_completed ON public.track_wo_subtasks
  FOR EACH ROW EXECUTE FUNCTION public.auto_bump_in_progress_on_subtask_toggle();
