-- Emma feedback round 3 (2026-05-29): TaskDetail page polish.
-- TRACK sends timeEstimate as integer minutes on housekeeping WOs
-- (observed values in the captured sample: 0, 60, 120, 180). Surface
-- it on the WO detail page so cleaners + supervisors can plan shifts.

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS time_estimate_minutes INTEGER;
