-- SPRINT-05: SLA push notification infrastructure.
CREATE TABLE IF NOT EXISTS public.sla_push_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dedupe_key text NOT NULL UNIQUE,
  severity text NOT NULL,
  title text NOT NULL,
  subtitle text,
  entity_link text,
  enqueued_at timestamptz NOT NULL DEFAULT now(),
  dispatched_at timestamptz,
  dispatch_attempts int NOT NULL DEFAULT 0,
  last_error text
);
CREATE INDEX IF NOT EXISTS sla_push_queue_pending_idx
  ON public.sla_push_queue (enqueued_at) WHERE dispatched_at IS NULL;
CREATE INDEX IF NOT EXISTS sla_push_queue_severity_idx
  ON public.sla_push_queue (severity, enqueued_at DESC);
ALTER TABLE public.sla_push_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sla_push_queue_read_admin ON public.sla_push_queue;
CREATE POLICY sla_push_queue_read_admin ON public.sla_push_queue
  FOR SELECT TO authenticated USING (public.has_admin_access((SELECT auth.uid())));

CREATE OR REPLACE FUNCTION public.enqueue_sla_push_from_mv()
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_added int;
BEGIN
  INSERT INTO public.sla_push_queue (dedupe_key, severity, title, subtitle, entity_link)
  SELECT dedupe_key, severity, title, subtitle, entity_link
  FROM public.mv_operational_exceptions
  WHERE severity = 'P1'
    AND NOT EXISTS (SELECT 1 FROM public.sla_push_queue q WHERE q.dedupe_key = mv_operational_exceptions.dedupe_key)
  ON CONFLICT (dedupe_key) DO NOTHING;
  GET DIAGNOSTICS v_added = ROW_COUNT;
  RETURN v_added;
END $$;
REVOKE EXECUTE ON FUNCTION public.enqueue_sla_push_from_mv() FROM PUBLIC, anon, authenticated;
