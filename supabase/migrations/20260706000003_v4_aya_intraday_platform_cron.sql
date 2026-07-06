-- Intraday platform refresh: every 2 hours, platform-only, fast mode (cheap model,
-- no refine) so the leadership headline never goes stale during the day. The
-- morning full run (aya-generate-morning) still does the high-quality gpt-4o pass
-- plus per-property notes once a day.
SELECT cron.unschedule('aya-generate-platform-2h') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname='aya-generate-platform-2h');

SELECT cron.schedule('aya-generate-platform-2h', '30 */2 * * *', $CRON$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/aya-generate?scope=platform&fast=1',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(public.get_service_role_jwt(), ''),
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron_intraday'),
    timeout_milliseconds := 60000
  );
$CRON$);
