
-- 1. Notification auto-creation trigger
CREATE OR REPLACE FUNCTION public.notify_on_task_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Task assigned
  IF (TG_OP = 'UPDATE' AND NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to)) THEN
    INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
    VALUES (NEW.assigned_to, NEW.id, 'task_assigned', 'Task Assigned', 'You have been assigned: ' || NEW.title);
  END IF;

  -- Task blocked
  IF (TG_OP = 'UPDATE' AND NEW.status = 'blocked' AND OLD.status IS DISTINCT FROM 'blocked') THEN
    -- Notify admins/supervisors via created_by if available
    IF NEW.created_by IS NOT NULL AND NEW.created_by IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
      VALUES (NEW.created_by, NEW.id, 'task_blocked', 'Task Blocked', NEW.title || ' has been blocked: ' || COALESCE(NEW.blocked_reason, 'No reason given'));
    END IF;
  END IF;

  -- Task completed
  IF (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed') THEN
    IF NEW.created_by IS NOT NULL AND NEW.created_by IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
      VALUES (NEW.created_by, NEW.id, 'task_completed', 'Task Completed', NEW.title || ' has been completed and awaits verification');
    END IF;
  END IF;

  -- Task verified
  IF (TG_OP = 'UPDATE' AND NEW.status = 'verified' AND OLD.status IS DISTINCT FROM 'verified') THEN
    IF NEW.assigned_to IS NOT NULL THEN
      INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
      VALUES (NEW.assigned_to, NEW.id, 'task_verified', 'Task Verified', NEW.title || ' has been verified');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_on_task_change
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_task_change();

-- 2. Storage RLS policies for task-photos bucket
CREATE POLICY "Authenticated users can upload task photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'task-photos');

CREATE POLICY "Authenticated users can view task photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'task-photos');
