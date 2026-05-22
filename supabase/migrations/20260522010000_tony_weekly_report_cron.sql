-- Schedule tony-weekly-report every Monday at 09:00 UTC.
-- The edge function computes 7-day KPIs and writes a 'tony_weekly_report'
-- audit_logs row. A separate n8n workflow reads new rows and emails Tony.

SELECT cron.schedule(
  'tony-weekly-report-mondays-9am-utc',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/tony-weekly-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA'
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 60000
  );
  $$
);
