-- Supabase Cloud doesn't allow ALTER DATABASE (postgres role lacks superuser).
-- Switch cron secret source from app.settings GUC to Supabase Vault.
--
-- Operator step (Supabase SQL editor, one-time):
--   SELECT vault.create_secret('<hex-secret>', 'cron_secret');
-- Then add CRON_SECRET=<same hex> as Edge Function secret in the dashboard.

CREATE OR REPLACE FUNCTION public.get_cron_secret()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO public, vault
AS $$
  SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret' LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.get_cron_secret() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.get_cron_secret() TO service_role, postgres;

DO $$
BEGIN
  PERFORM cron.unschedule('track-poll-every-5min');
  PERFORM cron.unschedule('track-attachment-push-every-1min');
  PERFORM cron.unschedule('tony-weekly-report-mondays-9am-utc');
  PERFORM cron.unschedule('ops-health-monitor-every-15min');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule('track-poll-every-5min', '*/5 * * * *', $cron$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-poll',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 90000
  );
$cron$);

SELECT cron.schedule('track-attachment-push-every-1min', '* * * * *', $cron$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-attachment-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 50000
  );
$cron$);

SELECT cron.schedule('tony-weekly-report-mondays-9am-utc', '0 9 * * 1', $cron$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/tony-weekly-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 60000
  );
$cron$);

SELECT cron.schedule('ops-health-monitor-every-15min', '*/15 * * * *', $cron$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/ops-health-monitor',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 30000
  );
$cron$);
