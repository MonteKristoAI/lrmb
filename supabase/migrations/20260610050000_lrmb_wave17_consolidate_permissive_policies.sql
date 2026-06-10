-- L10 wave 17 (2026-06-10): consolidate multiple_permissive_policies
-- warnings from Supabase advisor 0006. Each policy combo (admin +
-- scoped) was OR'd at query time by Postgres anyway; collapsing them
-- into single policies removes the per-policy eval overhead.

DROP POLICY IF EXISTS "Admin access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "profiles_select_combined" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Admin select all properties" ON public.properties;
DROP POLICY IF EXISTS "Staff see assigned properties" ON public.properties;
DROP POLICY IF EXISTS "Vendor staff see properties of their tasks" ON public.properties;
CREATE POLICY "properties_select_combined" ON public.properties
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.staff_assignments sa
      WHERE sa.property_id = properties.id
        AND sa.profile_id = (SELECT auth.uid())
        AND sa.active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      WHERE t.property_id = properties.id
        AND t.vendor_id IS NOT NULL
        AND t.vendor_id = p.vendor_id
    )
  );

DROP POLICY IF EXISTS "Admin select all units" ON public.units;
DROP POLICY IF EXISTS "Staff see units of assigned properties" ON public.units;
DROP POLICY IF EXISTS "Vendor staff see units of their tasks" ON public.units;
CREATE POLICY "units_select_combined" ON public.units
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.staff_assignments sa
      WHERE sa.property_id = units.property_id
        AND sa.profile_id = (SELECT auth.uid())
        AND sa.active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      WHERE t.unit_id = units.id
        AND t.vendor_id IS NOT NULL
        AND t.vendor_id = p.vendor_id
    )
  );

DROP POLICY IF EXISTS "Admin read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin select roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "user_roles_select_combined" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR has_role((SELECT auth.uid()), 'admin'::app_role)
    OR user_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Admin select vendors" ON public.vendors;
DROP POLICY IF EXISTS "Staff read own vendor" ON public.vendors;
CREATE POLICY "vendors_select_combined" ON public.vendors
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR id IN (
      SELECT p.vendor_id FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.vendor_id IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Admin select assignments" ON public.staff_assignments;
DROP POLICY IF EXISTS "Users read own assignments" ON public.staff_assignments;
CREATE POLICY "staff_assignments_select_combined" ON public.staff_assignments
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR profile_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Admin select all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Staff see assigned tasks" ON public.tasks;
DROP POLICY IF EXISTS "Staff see vendor tasks" ON public.tasks;
CREATE POLICY "tasks_select_combined" ON public.tasks
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR assigned_to = (SELECT auth.uid())
    OR (
      vendor_id IS NOT NULL
      AND vendor_id IN (
        SELECT p.vendor_id FROM public.profiles p
        WHERE p.id = (SELECT auth.uid()) AND p.vendor_id IS NOT NULL
      )
    )
  );

DROP POLICY IF EXISTS "Admin update all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Staff update assigned tasks" ON public.tasks;
DROP POLICY IF EXISTS "Staff update vendor tasks" ON public.tasks;
CREATE POLICY "tasks_update_combined" ON public.tasks
  FOR UPDATE TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR assigned_to = (SELECT auth.uid())
    OR (
      vendor_id IS NOT NULL
      AND vendor_id IN (
        SELECT p.vendor_id FROM public.profiles p
        WHERE p.id = (SELECT auth.uid()) AND p.vendor_id IS NOT NULL
      )
    )
  );

DROP POLICY IF EXISTS "All read templates" ON public.inspection_templates;
DROP POLICY IF EXISTS "All read template items" ON public.inspection_template_items;

DROP POLICY IF EXISTS "Admin select inspections" ON public.inspections;
DROP POLICY IF EXISTS "Inspector sees own inspections" ON public.inspections;
CREATE POLICY "inspections_select_combined" ON public.inspections
  FOR SELECT TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR inspector_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Admin update inspections" ON public.inspections;
DROP POLICY IF EXISTS "Inspector updates own inspections" ON public.inspections;
CREATE POLICY "inspections_update_combined" ON public.inspections
  FOR UPDATE TO authenticated
  USING (
    has_admin_access((SELECT auth.uid()))
    OR inspector_id = (SELECT auth.uid())
  );
