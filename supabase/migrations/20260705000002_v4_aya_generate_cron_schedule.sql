-- Aya morning brief cron. Fires daily at 11:00 UTC (~06-07h US ET) so leadership
-- opens the app to a fresh "what needs attention today" narrative. Mirrors the
-- other edge-fn crons: net.http_post with the service-role JWT + x-cron-secret
-- injected from the get_service_role_jwt()/get_cron_secret() helpers.
--
-- Until MK_GW_KEY (an mk-ai-gateway virtual key) is set as a function secret,
-- the fn returns skipped:true and writes nothing. Harmless no-op; the day the
-- key lands, this cron starts producing insights with zero further changes.

SELECT cron.schedule('aya-generate-morning', '0 11 * * *', $CRON$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/aya-generate',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(public.get_service_role_jwt(), ''),
      'x-cron-secret', coalesce(public.get_cron_secret(), '')
    ),
    body := jsonb_build_object('source', 'pg_cron'),
    timeout_milliseconds := 90000
  );
$CRON$);
