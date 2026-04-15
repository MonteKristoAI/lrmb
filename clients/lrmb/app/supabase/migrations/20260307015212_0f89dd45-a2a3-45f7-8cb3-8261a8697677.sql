SELECT cron.schedule(
  'escalate-overdue-tasks-every-15min',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url:='https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/escalate-overdue-tasks',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDA0MDIsImV4cCI6MjA2ODMxNjQwMn0.N20bbMXDwZ7DBmzZaY7MBjM5wPFR_04C1sn4xpZuOcY"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);