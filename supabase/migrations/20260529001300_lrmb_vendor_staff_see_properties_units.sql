-- Playwright UI smoke 2026-05-29 found that field_staff Emma cannot see
-- the property name or unit code on her own task cards or detail page,
-- even though the task is visible. Root cause: properties and units RLS
-- only grant SELECT through `staff_assignments`. Vendor-membership
-- visibility (added 20260529000000) wasn't extended to the JOIN targets,
-- so PostgREST's resource embedding returns null for both relations.
--
-- Plus drop one more anon over-permissive read (properties.anon_select_
-- for_onboarding, qual=true) that was missed in 20260529001200 — same
-- class of bug as the dropped profiles/vendors counterparts.

DROP POLICY IF EXISTS "anon_select_for_onboarding" ON public.properties;

DROP POLICY IF EXISTS "Vendor staff see properties of their tasks" ON public.properties;
CREATE POLICY "Vendor staff see properties of their tasks" ON public.properties
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.profiles p ON p.id = (select auth.uid())
      WHERE t.property_id = properties.id
        AND t.vendor_id IS NOT NULL
        AND t.vendor_id = p.vendor_id
    )
  );

DROP POLICY IF EXISTS "Vendor staff see units of their tasks" ON public.units;
CREATE POLICY "Vendor staff see units of their tasks" ON public.units
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.profiles p ON p.id = (select auth.uid())
      WHERE t.unit_id = units.id
        AND t.vendor_id IS NOT NULL
        AND t.vendor_id = p.vendor_id
    )
  );
