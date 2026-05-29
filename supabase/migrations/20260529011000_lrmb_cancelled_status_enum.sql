-- Emma round 3 step 1: add 'cancelled' to task_status enum.
-- New WOs that come from TRACK in a cancelled state used to be skipped
-- entirely; existing rows that got cancelled in TRACK after first sync
-- had their local status stuck. Adding the enum value lets v30+
-- explicitly transition the row when TRACK reports cancellation.
ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'cancelled' BEFORE 'completed';
