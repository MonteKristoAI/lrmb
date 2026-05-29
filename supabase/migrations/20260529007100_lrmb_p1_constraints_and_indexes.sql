-- QA-destroyer L10 P1 batch (2026-05-29). Closes 5 P1 items from
-- Agent B + Agent C. v2 retry: replace date_trunc unique index with a
-- BEFORE INSERT trigger (date_trunc fails Postgres IMMUTABLE check
-- for index expressions).

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_blocked_reason_len_cap
    CHECK (blocked_reason IS NULL OR length(blocked_reason) <= 2000) NOT VALID;
ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_blocked_reason_len_cap;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_title_len_cap
    CHECK (title IS NULL OR length(title) <= 500) NOT VALID;
ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_title_len_cap;

-- task_updates idempotency: reject duplicate (task, actor, type) within 2s.
CREATE OR REPLACE FUNCTION public.enforce_task_update_idempotency()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE v_recent INTEGER;
BEGIN
  IF NEW.task_id IS NULL OR NEW.actor_id IS NULL THEN RETURN NEW; END IF;
  SELECT count(*) INTO v_recent FROM public.task_updates tu
   WHERE tu.task_id = NEW.task_id
     AND tu.actor_id = NEW.actor_id
     AND tu.update_type = NEW.update_type
     AND tu.created_at > (now() - interval '2 seconds');
  IF v_recent > 0 THEN
    RAISE EXCEPTION 'Duplicate % within 2s — likely fat-finger double-click', NEW.update_type
      USING ERRCODE = '23505';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_enforce_task_update_idempotency ON public.task_updates;
CREATE TRIGGER trg_enforce_task_update_idempotency
  BEFORE INSERT ON public.task_updates
  FOR EACH ROW EXECUTE FUNCTION public.enforce_task_update_idempotency();

-- Terminal status note guard: field staff cannot add notes / photo
-- updates to completed / verified / processed WOs.
CREATE OR REPLACE FUNCTION public.enforce_task_update_on_open()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_status text;
BEGIN
  IF v_uid IS NULL THEN RETURN NEW; END IF;
  IF public.has_admin_access(v_uid) THEN RETURN NEW; END IF;
  IF NEW.task_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.update_type NOT IN ('note', 'photo_upload') THEN RETURN NEW; END IF;
  SELECT status::text INTO v_status FROM public.tasks WHERE id = NEW.task_id;
  IF v_status IN ('completed', 'verified', 'processed') THEN
    RAISE EXCEPTION 'Cannot add notes or photos to a closed work order (status=%)', v_status
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_enforce_task_update_on_open ON public.task_updates;
CREATE TRIGGER trg_enforce_task_update_on_open
  BEFORE INSERT ON public.task_updates
  FOR EACH ROW EXECUTE FUNCTION public.enforce_task_update_on_open();

-- Hot AdminDashboard query: action+created_at index.
CREATE INDEX IF NOT EXISTS audit_logs_action_created_at_desc_idx
  ON public.audit_logs (action, created_at DESC);
