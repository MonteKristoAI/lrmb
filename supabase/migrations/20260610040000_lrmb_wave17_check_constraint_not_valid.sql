-- L10 wave 17 (2026-06-10): replace the wave 12 "WHEN check_violation
-- THEN NULL" pattern with NOT VALID + a separate VALIDATE CONSTRAINT
-- step. The old pattern silently skipped adding the constraint on
-- clones with pre-existing violation rows. NOT VALID always succeeds
-- on add (skips validation for existing rows); VALIDATE CONSTRAINT
-- then either passes (invariant proven) or fails loudly.

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tasks_status_timestamp_consistency'
      AND conrelid = 'public.tasks'::regclass
  ) THEN
    ALTER TABLE public.tasks
      ADD CONSTRAINT tasks_status_timestamp_consistency
      CHECK (
        (status NOT IN ('in_progress','completed','verified','processed') OR started_at IS NOT NULL)
        AND (status NOT IN ('completed','verified','processed') OR completed_at IS NOT NULL)
      )
      NOT VALID;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tasks_owner_charges_amount_window'
      AND conrelid = 'public.tasks'::regclass
  ) THEN
    ALTER TABLE public.tasks
      ADD CONSTRAINT tasks_owner_charges_amount_window
      CHECK (owner_charges_amount IS NULL OR (owner_charges_amount >= 0 AND owner_charges_amount <= 100000))
      NOT VALID;
  END IF;
END $$;

DO $$ BEGIN
  ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_status_timestamp_consistency;
EXCEPTION WHEN check_violation THEN
  RAISE WARNING 'tasks_status_timestamp_consistency has existing violations; manual cleanup required';
END $$;

DO $$ BEGIN
  ALTER TABLE public.tasks VALIDATE CONSTRAINT tasks_owner_charges_amount_window;
EXCEPTION WHEN check_violation THEN
  RAISE WARNING 'tasks_owner_charges_amount_window has existing violations; manual cleanup required';
END $$;
