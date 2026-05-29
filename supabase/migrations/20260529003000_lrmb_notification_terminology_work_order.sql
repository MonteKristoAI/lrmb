-- Emma feedback 2026-05-29: push notifications still say "Task Assigned"
-- while the rest of the UI consistently says "Work Order". Rename the
-- titles emitted by notify_on_task_change so the notification bell + the
-- mobile push payload both match.
--
-- Body text and event_type enums STAY task_* — those are internal
-- identifiers (CLIENT.md rule: user-visible strings say work order,
-- internal identifiers stay task).
--
-- Also: backfill historical notification_events.title so the bell
-- history doesn't show a mix of "Task X" + "Work Order X" entries.
--
-- Also: link ebenson@lrmb.com (Emma's primary account) to the Emma
-- Benson CO Test vendor row. Without it, when Emma signs in to her
-- admin-flagged ebenson@lrmb.com account she'd see admin-tier rows
-- (everything) but vendor-membership visibility would also be open
-- for consistency with her field_staff persona.

CREATE OR REPLACE FUNCTION public.notify_on_task_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Work order assigned (was "Task Assigned" pre 2026-05-29)
  IF (TG_OP = 'UPDATE' AND NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to)) THEN
    INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
    VALUES (NEW.assigned_to, NEW.id, 'task_assigned', 'Work Order Assigned',
            'You have been assigned: ' || NEW.title);
  END IF;

  -- Work order blocked (was "Task Blocked")
  IF (TG_OP = 'UPDATE' AND NEW.status = 'blocked' AND OLD.status IS DISTINCT FROM 'blocked') THEN
    IF NEW.created_by IS NOT NULL AND NEW.created_by IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
      VALUES (NEW.created_by, NEW.id, 'task_blocked', 'Work Order Blocked',
              NEW.title || ' has been blocked: ' || COALESCE(NEW.blocked_reason, 'No reason given'));
    END IF;
  END IF;

  -- Work order completed (was "Task Completed")
  IF (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed') THEN
    IF NEW.created_by IS NOT NULL AND NEW.created_by IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
      VALUES (NEW.created_by, NEW.id, 'task_completed', 'Work Order Completed',
              NEW.title || ' has been completed and awaits verification');
    END IF;
  END IF;

  -- Work order verified (was "Task Verified")
  IF (TG_OP = 'UPDATE' AND NEW.status = 'verified' AND OLD.status IS DISTINCT FROM 'verified') THEN
    IF NEW.assigned_to IS NOT NULL THEN
      INSERT INTO public.notification_events (recipient_id, task_id, event_type, title, body)
      VALUES (NEW.assigned_to, NEW.id, 'task_verified', 'Work Order Verified',
              NEW.title || ' has been verified');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill historical titles. Only touches rows starting with "Task "
-- (the four event_type variants above), leaves anything else alone.
UPDATE public.notification_events
SET title = 'Work Order ' || substring(title from 6)
WHERE title LIKE 'Task %';

-- Link ebenson@lrmb.com (primary Emma) to Emma Benson CO Test vendor.
-- The enforce_profile_self_update_scope trigger allows server-side
-- updates from postgres/service_role, so this UPDATE runs unimpeded.
UPDATE public.profiles
SET vendor_id = '77eb1af4-9dfe-449b-93af-b5acbe602a0d'
WHERE email = 'ebenson@lrmb.com'
  AND vendor_id IS NULL;
