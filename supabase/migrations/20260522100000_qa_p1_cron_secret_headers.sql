-- QA P1 Q-SEC-10..15: thread x-cron-secret through every pg_cron http_post
-- so the edge functions can verify the call originated from our own cron.
--
-- Operator action required before fail-closed enforcement kicks in:
--   1. Pick a random secret: openssl rand -hex 32
--   2. ALTER DATABASE postgres SET app.settings.cron_secret = '<that secret>';
--      Then reload settings (or wait for next session).
--   3. In Supabase dashboard -> Project Settings -> Edge Functions ->
--      add CRON_SECRET=<that secret> to the shared function environment.
--   4. After both are set, the edge functions will reject any call missing
--      the matching x-cron-secret header. Until both are set the edge fns
--      log a warning but accept the call (graceful rollout).

DO $$
BEGIN
  PERFORM cron.unschedule('track-poll-every-5min');
  PERFORM cron.unschedule('track-attachment-push-every-1min');
  PERFORM cron.unschedule('tony-weekly-report-mondays-9am-utc');
  PERFORM cron.unschedule('ops-health-monitor-every-15min');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- track-poll: every 5 min
SELECT cron.schedule(
  'track-poll-every-5min',
  '*/5 * * * *',
  $cron$
    SELECT net.http_post(
      url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-poll',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
        'x-cron-secret', coalesce(current_setting('app.settings.cron_secret', true), '')
      ),
      body := jsonb_build_object('source', 'pg_cron'),
      timeout_milliseconds := 90000
    );
  $cron$
);

-- track-attachment-push: every 1 min
SELECT cron.schedule(
  'track-attachment-push-every-1min',
  '* * * * *',
  $cron$
    SELECT net.http_post(
      url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-attachment-push',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
        'x-cron-secret', coalesce(current_setting('app.settings.cron_secret', true), '')
      ),
      body := jsonb_build_object('source', 'pg_cron'),
      timeout_milliseconds := 50000
    );
  $cron$
);

-- tony-weekly-report: Monday 09:00 UTC
SELECT cron.schedule(
  'tony-weekly-report-mondays-9am-utc',
  '0 9 * * 1',
  $cron$
    SELECT net.http_post(
      url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/tony-weekly-report',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
        'x-cron-secret', coalesce(current_setting('app.settings.cron_secret', true), '')
      ),
      body := jsonb_build_object('source', 'pg_cron'),
      timeout_milliseconds := 60000
    );
  $cron$
);

-- ops-health-monitor: every 15 min
SELECT cron.schedule(
  'ops-health-monitor-every-15min',
  '*/15 * * * *',
  $cron$
    SELECT net.http_post(
      url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/ops-health-monitor',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA',
        'x-cron-secret', coalesce(current_setting('app.settings.cron_secret', true), '')
      ),
      body := jsonb_build_object('source', 'pg_cron'),
      timeout_milliseconds := 30000
    );
  $cron$
);
