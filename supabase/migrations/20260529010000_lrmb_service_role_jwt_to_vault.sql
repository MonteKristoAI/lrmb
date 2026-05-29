-- L10-MILAN-BLOCKERS P0 closed (2026-05-29): service-role JWT was
-- baked into the command body of 5 pg_cron jobs (21/22/23/24/25). The
-- JWT is a HS256-signed master key with exp 2068 — anyone with SELECT
-- on cron.job (postgres role, dashboard users, pg_dump) reads it.
--
-- This migration:
--   1. Saves the current service-role JWT to vault.secrets under name
--      'service_role_jwt'.
--   2. Adds helper public.get_service_role_jwt() following the same
--      pattern as get_cron_secret().
--   3. Rewrites cron jobs 21/22/23/24/25 to read the JWT from vault at
--      runtime via that helper.
--
-- The vault-stored secret is encrypted at rest. After this migration
-- the cron.job table no longer contains the JWT in plaintext (verified:
-- position('eyJ' in command) = 0 for all 5 jobs).
--
-- This is the BACKEND half of the rotation work. The OLD JWT is still
-- valid (it was never revoked, just removed from the cron.job rows).
-- Full rotation requires Milan to click "Generate new key" in the
-- Supabase dashboard, copy the new JWT, and update the vault secret
-- via `SELECT vault.update_secret(secret_id, new_jwt, name)`. Until
-- that happens the JWT exposure surface is just historical — anyone
-- who already had SELECT on cron.job has a copy, but nothing new
-- leaks. Plan accordingly.

DO $$
DECLARE
  v_cmd TEXT;
  v_jwt TEXT;
  v_existing_secret_id uuid;
BEGIN
  -- Extract JWT from existing cron command (idempotency: skip if vault
  -- already has the secret).
  SELECT id INTO v_existing_secret_id FROM vault.secrets WHERE name = 'service_role_jwt';
  IF v_existing_secret_id IS NULL THEN
    SELECT command INTO v_cmd FROM cron.job WHERE jobid = 21 LIMIT 1;
    v_jwt := substring(v_cmd FROM 'Bearer (eyJ[^''",]+)');
    IF v_jwt IS NULL OR length(v_jwt) < 100 THEN
      RAISE EXCEPTION 'Could not extract JWT from cron.job 21 — manual vault.create_secret needed';
    END IF;
    PERFORM vault.create_secret(v_jwt, 'service_role_jwt');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_service_role_jwt()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public', 'vault' AS $$
  SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_jwt' LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.get_service_role_jwt() FROM PUBLIC, anon, authenticated;
-- service_role + postgres (cron context) keep EXECUTE by default.

-- Cron rewrites (the heart of the fix). Use cron.alter_job to swap the
-- command body without changing schedule.
SELECT cron.alter_job(21, schedule := '*/5 * * * *', command := $body$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-poll',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(public.get_service_role_jwt(), ''),
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 90000
  );
$body$);

SELECT cron.alter_job(22, schedule := '* * * * *', command := $body$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-attachment-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(public.get_service_role_jwt(), ''),
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 50000
  );
$body$);

SELECT cron.alter_job(23, schedule := '0 9 * * 1', command := $body$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/tony-weekly-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(public.get_service_role_jwt(), ''),
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 60000
  );
$body$);

SELECT cron.alter_job(24, schedule := '*/15 * * * *', command := $body$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/ops-health-monitor',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(public.get_service_role_jwt(), ''),
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 30000
  );
$body$);

SELECT cron.alter_job(25, schedule := '0 6 * * *', command := $body$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-reference-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(public.get_service_role_jwt(), ''),
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 60000
  );
$body$);
