-- L10 wave 16 (2026-06-10): dedicated nonce dedup table for track-webhook.
-- Old check-then-insert via audit_logs let concurrent replays both pass
-- (audit row written later, failures swallowed). INSERT-first into this
-- table with PK constraint catches the race atomically.

CREATE TABLE IF NOT EXISTS public.webhook_nonces (
  nonce text PRIMARY KEY,
  source text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);

CREATE INDEX IF NOT EXISTS webhook_nonces_expires_idx
  ON public.webhook_nonces (expires_at);

REVOKE ALL ON public.webhook_nonces FROM anon, authenticated;
GRANT  ALL ON public.webhook_nonces TO service_role;

CREATE OR REPLACE FUNCTION public.prune_webhook_nonces()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE removed integer;
BEGIN
  DELETE FROM public.webhook_nonces WHERE expires_at < now();
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_webhook_nonces() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.prune_webhook_nonces() TO service_role, postgres;

DO $$
BEGIN PERFORM cron.unschedule('prune-webhook-nonces-hourly'); EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'prune-webhook-nonces-hourly',
  '0 * * * *',
  $cron$ SELECT public.prune_webhook_nonces(); $cron$
);
