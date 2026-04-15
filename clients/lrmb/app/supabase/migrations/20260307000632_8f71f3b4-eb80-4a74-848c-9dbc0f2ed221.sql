
-- =============================================
-- LRMB Phase 2: RLS Policies
-- =============================================

-- PROFILES: users read own, admin/supervisor/manager read all
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admin access all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- USER_ROLES: users read own roles, admin/supervisor read all
CREATE POLICY "Users read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin read all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));

CREATE POLICY "Admin manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PROPERTIES: field_staff see assigned properties, admin/supervisor/manager see all
CREATE POLICY "Admin access all properties"
  ON public.properties FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

CREATE POLICY "Staff see assigned properties"
  ON public.properties FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.staff_assignments sa
      WHERE sa.property_id = properties.id
        AND sa.profile_id = auth.uid()
        AND sa.active = true
    )
  );

-- UNITS: follows property visibility
CREATE POLICY "Admin access all units"
  ON public.units FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

CREATE POLICY "Staff see units of assigned properties"
  ON public.units FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.staff_assignments sa
      WHERE sa.property_id = units.property_id
        AND sa.profile_id = auth.uid()
        AND sa.active = true
    )
  );

-- STAFF_ASSIGNMENTS: users read own, admin manage all
CREATE POLICY "Users read own assignments"
  ON public.staff_assignments FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Admin manage assignments"
  ON public.staff_assignments FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- TASKS: field_staff see assigned, admin/supervisor see property-scoped, manager reads all
CREATE POLICY "Staff see assigned tasks"
  ON public.tasks FOR SELECT TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Staff update assigned tasks"
  ON public.tasks FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

CREATE POLICY "Admin full task access"
  ON public.tasks FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- TASK_UPDATES: follows task visibility
CREATE POLICY "Users see updates on visible tasks"
  ON public.task_updates FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_updates.task_id
        AND (t.assigned_to = auth.uid() OR public.has_admin_access(auth.uid()))
    )
  );

CREATE POLICY "Users insert updates on assigned tasks"
  ON public.task_updates FOR INSERT TO authenticated
  WITH CHECK (
    actor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_updates.task_id
        AND (t.assigned_to = auth.uid() OR public.has_admin_access(auth.uid()))
    )
  );

-- TASK_PHOTOS: follows task visibility
CREATE POLICY "Users see photos on visible tasks"
  ON public.task_photos FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_photos.task_id
        AND (t.assigned_to = auth.uid() OR public.has_admin_access(auth.uid()))
    )
  );

CREATE POLICY "Users upload photos on assigned tasks"
  ON public.task_photos FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_photos.task_id
        AND (t.assigned_to = auth.uid() OR public.has_admin_access(auth.uid()))
    )
  );

-- INSPECTION_TEMPLATES: all authenticated can read, admin can manage
CREATE POLICY "All read templates"
  ON public.inspection_templates FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin manage templates"
  ON public.inspection_templates FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- INSPECTION_TEMPLATE_ITEMS: follows template visibility
CREATE POLICY "All read template items"
  ON public.inspection_template_items FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin manage template items"
  ON public.inspection_template_items FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- INSPECTIONS: inspector sees own, admin/supervisor see all
CREATE POLICY "Inspector sees own inspections"
  ON public.inspections FOR SELECT TO authenticated
  USING (inspector_id = auth.uid());

CREATE POLICY "Inspector updates own inspections"
  ON public.inspections FOR UPDATE TO authenticated
  USING (inspector_id = auth.uid())
  WITH CHECK (inspector_id = auth.uid());

CREATE POLICY "Admin full inspection access"
  ON public.inspections FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- INSPECTION_RESPONSES: follows inspection visibility
CREATE POLICY "Users manage responses on own inspections"
  ON public.inspection_responses FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_responses.inspection_id
        AND (i.inspector_id = auth.uid() OR public.has_admin_access(auth.uid()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_responses.inspection_id
        AND (i.inspector_id = auth.uid() OR public.has_admin_access(auth.uid()))
    )
  );

-- NOTIFICATION_EVENTS: users see their own
CREATE POLICY "Users see own notifications"
  ON public.notification_events FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON public.notification_events FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "System insert notifications"
  ON public.notification_events FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_access(auth.uid()));

-- AUDIT_LOGS: admin/supervisor/manager can read
CREATE POLICY "Admin read audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));

CREATE POLICY "System insert audit logs"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- RESERVATION_EVENTS: admin access only
CREATE POLICY "Admin access reservation events"
  ON public.reservation_events FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- =============================================
-- STORAGE POLICIES for task-photos bucket
-- =============================================
CREATE POLICY "Authenticated users upload task photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'task-photos');

CREATE POLICY "Authenticated users read task photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'task-photos');
