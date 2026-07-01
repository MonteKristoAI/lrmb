-- v3 sweep fix (2026-07-01 evening): 3 Supabase performance WARN advisors.
-- 1) sla_targets_write_admin was FOR ALL, giving SELECT double-eval alongside sla_targets_read_authenticated.
-- 2) auth.uid() re-eval per row on sla_targets + ops_health_snapshots. Wrap in (SELECT ...) so it's inited once.
-- 3) Add FK covering index for sla_targets_updated_by_fkey (INFO, tidy).

DROP POLICY IF EXISTS sla_targets_write_admin ON public.sla_targets;

CREATE POLICY sla_targets_insert_admin ON public.sla_targets
  FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_access((SELECT auth.uid())));

CREATE POLICY sla_targets_update_admin ON public.sla_targets
  FOR UPDATE TO authenticated
  USING (public.has_admin_access((SELECT auth.uid())))
  WITH CHECK (public.has_admin_access((SELECT auth.uid())));

CREATE POLICY sla_targets_delete_admin ON public.sla_targets
  FOR DELETE TO authenticated
  USING (public.has_admin_access((SELECT auth.uid())));

DROP POLICY IF EXISTS ops_health_snapshots_read_admin ON public.ops_health_snapshots;

CREATE POLICY ops_health_snapshots_read_admin ON public.ops_health_snapshots
  FOR SELECT TO authenticated
  USING (public.has_admin_access((SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS sla_targets_updated_by_idx
  ON public.sla_targets (updated_by);
