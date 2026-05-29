-- Emma round 3 step 2: backfills for the three issues she flagged.
-- 1. #32390 cancelled in TRACK yesterday but stayed open locally.
-- 2. #32419 title says Inspection but clean type label was "Checkout
--    Clean" because clean_type_name was NULL.
-- 3. 19 maintenance WOs had a vendor name from TRACK but vendor_id was
--    NULL locally because resolveTrackVendor was HK-only. RLS missed.

UPDATE public.tasks
SET status = 'cancelled', updated_at = now()
WHERE external_source = 'track' AND external_id = '32390';

UPDATE public.tasks
SET clean_type_name = 'Inspection'
WHERE external_source = 'track' AND external_id = '32419'
  AND (clean_type_name IS NULL OR clean_type_name = '');

UPDATE public.tasks t
SET vendor_id = v.id
FROM public.vendors v
WHERE t.external_source = 'track'
  AND t.task_category = 'maintenance'
  AND t.vendor_id IS NULL
  AND t.assigned_vendor_name IS NOT NULL
  AND lower(trim(t.assigned_vendor_name)) = lower(trim(v.name));
