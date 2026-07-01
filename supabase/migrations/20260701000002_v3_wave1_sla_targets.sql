-- v3.0 Wave 1: SLA config table + resolver functions.
-- Replaces hardcoded "overdue = due_at < now()" with per-category/type/priority
-- targets. LRMB admin can tune values via Admin -> SLA Config UI in Wave 2.
--
-- Applied via MCP apply_migration on 2026-07-01 18:26 UTC (version 20260701182630).
-- File committed to repo for DR parity.

CREATE TABLE IF NOT EXISTS public.sla_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_category public.task_category NOT NULL,
  task_type text NULL,
  priority public.task_priority NULL,
  target_hours integer NOT NULL CHECK (target_hours > 0 AND target_hours <= 720),
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sla_targets_scope_idx
  ON public.sla_targets (task_category, task_type, priority) WHERE active = true;

COMMENT ON TABLE public.sla_targets IS
  'SLA target hours per (task_category, task_type, priority) tuple. NULL type/priority = wildcard.
   Resolver public.sla_target_hours() picks most specific match. Dedup is app-level via /admin/sla page.';

INSERT INTO public.sla_targets (task_category, task_type, priority, target_hours) VALUES
  ('housekeeping',        'checkout_turnover', NULL,     6),
  ('housekeeping',        NULL,                'urgent', 4),
  ('housekeeping',        NULL,                NULL,     24),
  ('maintenance',         'maintenance',       'urgent', 4),
  ('maintenance',         'maintenance',       'high',   24),
  ('maintenance',         'maintenance',       'medium', 72),
  ('maintenance',         'maintenance',       'low',    168),
  ('maintenance',         NULL,                'urgent', 4),
  ('maintenance',         NULL,                NULL,     72),
  ('inspection',          NULL,                'urgent', 4),
  ('inspection',          NULL,                NULL,     24),
  ('concierge',           NULL,                'urgent', 1),
  ('concierge',           NULL,                'high',   4),
  ('concierge',           NULL,                'medium', 24),
  ('concierge',           NULL,                NULL,     72),
  ('property_management', NULL,                NULL,     48),
  ('general',             NULL,                NULL,     72)
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.sla_target_hours(
  p_category public.task_category,
  p_task_type text,
  p_priority public.task_priority
) RETURNS integer
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT target_hours
  FROM public.sla_targets
  WHERE active = true
    AND task_category = p_category
    AND (task_type IS NULL OR task_type = p_task_type)
    AND (priority IS NULL OR priority = p_priority)
  ORDER BY
    (task_type IS NOT NULL)::int DESC,
    (priority IS NOT NULL)::int DESC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.sla_deadline(p_task_id uuid) RETURNS timestamptz
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    t.due_at,
    t.created_at + (COALESCE(public.sla_target_hours(t.task_category, t.task_type, t.priority), 72) * INTERVAL '1 hour')
  )
  FROM public.tasks t
  WHERE t.id = p_task_id;
$$;

ALTER TABLE public.sla_targets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sla_targets_read_authenticated ON public.sla_targets;
CREATE POLICY sla_targets_read_authenticated ON public.sla_targets
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS sla_targets_write_admin ON public.sla_targets;
CREATE POLICY sla_targets_write_admin ON public.sla_targets
  FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

GRANT SELECT ON public.sla_targets TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sla_targets TO authenticated;
GRANT EXECUTE ON FUNCTION public.sla_target_hours TO authenticated;
GRANT EXECUTE ON FUNCTION public.sla_deadline TO authenticated;
