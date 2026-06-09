-- L10 wave 5 follow-up (2026-06-09): task-photos orphan janitor.
-- Supabase blocks direct DELETE on storage.objects via protect_delete() trigger,
-- so route through Storage REST API via net.http_delete with the service-role
-- JWT from vault. Storage service handles object cleanup + S3 blob deletion.
--
-- v2: hardcode the public project URL (it's not a secret — present in SPA
-- bundle). Vault only stores service_role_jwt which already exists.

CREATE OR REPLACE FUNCTION public.janitor_task_photos_orphans(
  hours_to_keep integer DEFAULT 24,
  max_batch     integer DEFAULT 200
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage, vault, pg_temp
AS $$
DECLARE
  removed_count integer := 0;
  failed_count  integer := 0;
  orphan_path   text;
  storage_base  text := 'https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/task-photos/';
  sr_jwt        text;
BEGIN
  sr_jwt := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='service_role_jwt' LIMIT 1);

  IF sr_jwt IS NULL THEN
    INSERT INTO public.audit_logs (action, entity_type, entity_id, description, payload_json)
    VALUES (
      'task_photos_janitor_misconfigured',
      'storage',
      gen_random_uuid(),
      'janitor aborted: vault.service_role_jwt missing',
      jsonb_build_object('severity','error')
    );
    RETURN jsonb_build_object('removed', 0, 'error', 'vault_missing_service_role_jwt');
  END IF;

  FOR orphan_path IN
    SELECT o.name FROM storage.objects o
     WHERE o.bucket_id = 'task-photos'
       AND o.created_at < (now() - make_interval(hours => hours_to_keep))
       AND NOT EXISTS (SELECT 1 FROM public.task_photos tp WHERE tp.storage_path = o.name)
     ORDER BY o.created_at ASC
     LIMIT max_batch
  LOOP
    BEGIN
      PERFORM net.http_delete(
        url := storage_base || orphan_path,
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || sr_jwt,
          'apikey', sr_jwt
        )
      );
      removed_count := removed_count + 1;
    EXCEPTION WHEN OTHERS THEN
      failed_count := failed_count + 1;
    END;
  END LOOP;

  INSERT INTO public.audit_logs (action, entity_type, entity_id, description, payload_json)
  VALUES (
    'task_photos_janitor_run',
    'storage',
    gen_random_uuid(),
    'task-photos janitor queued ' || removed_count || ' DELETE(s), ' || failed_count || ' failed',
    jsonb_build_object(
      'severity', CASE WHEN failed_count > 0 THEN 'warning' ELSE 'info' END,
      'removed_count', removed_count,
      'failed_count', failed_count,
      'hours_to_keep', hours_to_keep,
      'max_batch', max_batch
    )
  );

  RETURN jsonb_build_object('removed', removed_count, 'failed', failed_count);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.janitor_task_photos_orphans(integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.janitor_task_photos_orphans(integer, integer)
  TO   service_role, postgres;

-- Schedule daily at 03:15 UTC.
DO $$
BEGIN PERFORM cron.unschedule('janitor-task-photos-daily'); EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'janitor-task-photos-daily',
  '15 3 * * *',
  $cron$ SELECT public.janitor_task_photos_orphans(24, 200); $cron$
);
