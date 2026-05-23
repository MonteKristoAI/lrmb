-- Per Supabase advisor 0003 + 0024: wrap auth.uid() in (select auth.uid())
-- so Postgres evaluates once per query instead of once per row. Also dedup
-- permissive policy duplicates on vendors.
--
-- Behaviour is semantically identical. Only the planner cost changes.

-- ============================================================================
-- audit_logs (2)
-- ============================================================================
DROP POLICY IF EXISTS "Admin insert audit logs" ON public.audit_logs;
CREATE POLICY "Admin insert audit logs" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Admin read audit logs" ON public.audit_logs;
CREATE POLICY "Admin read audit logs" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_admin_access((select auth.uid())));

-- ============================================================================
-- inspection_responses (1)
-- ============================================================================
DROP POLICY IF EXISTS "Users manage responses on own inspections" ON public.inspection_responses;
CREATE POLICY "Users manage responses on own inspections" ON public.inspection_responses FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.inspections i WHERE i.id = inspection_responses.inspection_id
    AND (i.inspector_id = (select auth.uid()) OR public.has_admin_access((select auth.uid())))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.inspections i WHERE i.id = inspection_responses.inspection_id
    AND (i.inspector_id = (select auth.uid()) OR public.has_admin_access((select auth.uid())))));

-- ============================================================================
-- inspection_template_items (1)
-- ============================================================================
DROP POLICY IF EXISTS "Admin manage template items" ON public.inspection_template_items;
CREATE POLICY "Admin manage template items" ON public.inspection_template_items FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

-- ============================================================================
-- inspection_templates (1)
-- ============================================================================
DROP POLICY IF EXISTS "Admin manage templates" ON public.inspection_templates;
CREATE POLICY "Admin manage templates" ON public.inspection_templates FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

-- ============================================================================
-- inspections (3)
-- ============================================================================
DROP POLICY IF EXISTS "Admin full inspection access" ON public.inspections;
CREATE POLICY "Admin full inspection access" ON public.inspections FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Inspector sees own inspections" ON public.inspections;
CREATE POLICY "Inspector sees own inspections" ON public.inspections FOR SELECT TO authenticated
  USING (inspector_id = (select auth.uid()));

DROP POLICY IF EXISTS "Inspector updates own inspections" ON public.inspections;
CREATE POLICY "Inspector updates own inspections" ON public.inspections FOR UPDATE TO authenticated
  USING (inspector_id = (select auth.uid()))
  WITH CHECK (inspector_id = (select auth.uid()));

-- ============================================================================
-- notification_events (3)
-- ============================================================================
DROP POLICY IF EXISTS "System insert notifications" ON public.notification_events;
CREATE POLICY "System insert notifications" ON public.notification_events FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Users see own notifications" ON public.notification_events;
CREATE POLICY "Users see own notifications" ON public.notification_events FOR SELECT TO authenticated
  USING (recipient_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users update own notifications" ON public.notification_events;
CREATE POLICY "Users update own notifications" ON public.notification_events FOR UPDATE TO authenticated
  USING (recipient_id = (select auth.uid()))
  WITH CHECK (recipient_id = (select auth.uid()));

-- ============================================================================
-- profiles (3)
-- ============================================================================
DROP POLICY IF EXISTS "Admin access all profiles" ON public.profiles;
CREATE POLICY "Admin access all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- ============================================================================
-- properties (2)
-- ============================================================================
DROP POLICY IF EXISTS "Admin access all properties" ON public.properties;
CREATE POLICY "Admin access all properties" ON public.properties FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Staff see assigned properties" ON public.properties;
CREATE POLICY "Staff see assigned properties" ON public.properties FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.staff_assignments sa
    WHERE sa.property_id = properties.id AND sa.profile_id = (select auth.uid()) AND sa.active = true));

-- ============================================================================
-- push_subscriptions (1)
-- ============================================================================
DROP POLICY IF EXISTS "Users manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users manage own push subscriptions" ON public.push_subscriptions FOR ALL TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- reservation_events (1)
-- ============================================================================
DROP POLICY IF EXISTS "Admin access reservation events" ON public.reservation_events;
CREATE POLICY "Admin access reservation events" ON public.reservation_events FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

-- ============================================================================
-- revoked_share_tokens (1)
-- ============================================================================
DROP POLICY IF EXISTS "Admin manage revoked share tokens" ON public.revoked_share_tokens;
CREATE POLICY "Admin manage revoked share tokens" ON public.revoked_share_tokens FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

-- ============================================================================
-- staff_assignments (2)
-- ============================================================================
DROP POLICY IF EXISTS "Admin manage assignments" ON public.staff_assignments;
CREATE POLICY "Admin manage assignments" ON public.staff_assignments FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Users read own assignments" ON public.staff_assignments;
CREATE POLICY "Users read own assignments" ON public.staff_assignments FOR SELECT TO authenticated
  USING (profile_id = (select auth.uid()));

-- ============================================================================
-- task_photos (3)
-- ============================================================================
DROP POLICY IF EXISTS "Users delete own photos on visible tasks" ON public.task_photos;
CREATE POLICY "Users delete own photos on visible tasks" ON public.task_photos FOR DELETE TO authenticated
  USING (uploaded_by = (select auth.uid()) AND EXISTS (SELECT 1 FROM public.tasks t
    WHERE t.id = task_photos.task_id AND (t.assigned_to = (select auth.uid()) OR public.has_admin_access((select auth.uid())))));

DROP POLICY IF EXISTS "Users see photos on visible tasks" ON public.task_photos;
CREATE POLICY "Users see photos on visible tasks" ON public.task_photos FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t
    WHERE t.id = task_photos.task_id AND (t.assigned_to = (select auth.uid()) OR public.has_admin_access((select auth.uid())))));

DROP POLICY IF EXISTS "Users upload photos on assigned tasks" ON public.task_photos;
CREATE POLICY "Users upload photos on assigned tasks" ON public.task_photos FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = (select auth.uid()) AND EXISTS (SELECT 1 FROM public.tasks t
    WHERE t.id = task_photos.task_id AND (t.assigned_to = (select auth.uid()) OR public.has_admin_access((select auth.uid())))));

-- ============================================================================
-- task_updates (2)
-- ============================================================================
DROP POLICY IF EXISTS "Users insert updates on assigned tasks" ON public.task_updates;
CREATE POLICY "Users insert updates on assigned tasks" ON public.task_updates FOR INSERT TO authenticated
  WITH CHECK (actor_id = (select auth.uid()) AND EXISTS (SELECT 1 FROM public.tasks t
    WHERE t.id = task_updates.task_id AND (t.assigned_to = (select auth.uid()) OR public.has_admin_access((select auth.uid())))));

DROP POLICY IF EXISTS "Users see updates on visible tasks" ON public.task_updates;
CREATE POLICY "Users see updates on visible tasks" ON public.task_updates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t
    WHERE t.id = task_updates.task_id AND (t.assigned_to = (select auth.uid()) OR public.has_admin_access((select auth.uid())))));

-- ============================================================================
-- tasks (3)
-- ============================================================================
DROP POLICY IF EXISTS "Admin full task access" ON public.tasks;
CREATE POLICY "Admin full task access" ON public.tasks FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Staff see assigned tasks" ON public.tasks;
CREATE POLICY "Staff see assigned tasks" ON public.tasks FOR SELECT TO authenticated
  USING (assigned_to = (select auth.uid()));

DROP POLICY IF EXISTS "Staff update assigned tasks" ON public.tasks;
CREATE POLICY "Staff update assigned tasks" ON public.tasks FOR UPDATE TO authenticated
  USING (assigned_to = (select auth.uid()))
  WITH CHECK (assigned_to = (select auth.uid()));

-- ============================================================================
-- track_poll_state (1)
-- ============================================================================
DROP POLICY IF EXISTS "track_poll_state_admin_read" ON public.track_poll_state;
CREATE POLICY "track_poll_state_admin_read" ON public.track_poll_state FOR SELECT TO authenticated
  USING (public.has_admin_access((select auth.uid())));

-- ============================================================================
-- units (2)
-- ============================================================================
DROP POLICY IF EXISTS "Admin access all units" ON public.units;
CREATE POLICY "Admin access all units" ON public.units FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Staff see units of assigned properties" ON public.units;
CREATE POLICY "Staff see units of assigned properties" ON public.units FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.staff_assignments sa
    WHERE sa.property_id = units.property_id AND sa.profile_id = (select auth.uid()) AND sa.active = true));

-- ============================================================================
-- user_roles (3)
-- ============================================================================
DROP POLICY IF EXISTS "Admin manage roles" ON public.user_roles;
CREATE POLICY "Admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role((select auth.uid()), 'admin'::public.app_role))
  WITH CHECK (public.has_role((select auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admin read all roles" ON public.user_roles;
CREATE POLICY "Admin read all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_admin_access((select auth.uid())));

DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================================================
-- vendors (1 + drop 4 redundant)
-- ============================================================================
-- Per advisor multiple_permissive_policies: drop the 4 individual per-command
-- policies; the "Admin manage vendors" FOR ALL covers SELECT/INSERT/UPDATE/DELETE.
DROP POLICY IF EXISTS "vendors_auth_select" ON public.vendors;
DROP POLICY IF EXISTS "vendors_auth_insert" ON public.vendors;
DROP POLICY IF EXISTS "vendors_auth_update" ON public.vendors;
DROP POLICY IF EXISTS "vendors_auth_delete" ON public.vendors;

DROP POLICY IF EXISTS "Admin manage vendors" ON public.vendors;
CREATE POLICY "Admin manage vendors" ON public.vendors FOR ALL TO authenticated
  USING (public.has_admin_access((select auth.uid())))
  WITH CHECK (public.has_admin_access((select auth.uid())));

-- ============================================================================
-- Performance: unindexed FK on revoked_share_tokens
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_revoked_share_tokens_revoked_by
  ON public.revoked_share_tokens (revoked_by);
