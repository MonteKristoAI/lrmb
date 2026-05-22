-- Schedule ops-health-monitor every 15 minutes.
-- Writes 'ops_health_check' rows to audit_logs with overall severity.
-- Severity=error rows can trigger n8n email alerts via the global error handler.
--
-- The edge function checks 6 production signals:
--   1. track-poll cron stale (> 15 min since last run)
--   2. track-attachment-push cron stale (> 3 min)
--   3. polling error rate (> 10% in last 1h)
--   4. dead-letter photos (any with attempts >= 5 not synced)
--   5. OPS_VIEW_HMAC_SECRET missing (share links break)
--   6. poll collection stuck (last_run > 1h ago for any collection)

SELECT cron.schedule(
  'ops-health-monitor-every-15min',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/ops-health-monitor',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0MDQwMiwiZXhwIjoyMDY4MzE2NDAyfQ.dZkRUGidoMExV920Qq4oZnzRzs0Rxsb-aqKn--i1KBA'
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 30000
  );
  $$
);
