-- L10 wave 16 (2026-06-10): janitor hardening.
-- Codex review surfaced:
--   - queued_count == removed_count was a lie (net.http_delete returns
--     immediately; success != confirmed deletion). Rename to queued.
--   - No range checks on hours_to_keep / max_batch. Caller passing 0 or
--     negative numbers triggers mass deletion of recent uploads.

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
  queued_count  integer := 0;
  failed_count  integer := 0;
  orphan_path   text;
  storage_base  text := 'https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/task-photos/';
  sr_jwt        text;
BEGIN
  IF hours_to_keep IS NULL OR hours_to_keep < 1 THEN
    RAISE EXCEPTION 'hours_to_keep must be >= 1, got %', hours_to_keep;
  END IF;
  IF max_batch IS NULL OR max_batch < 1 OR max_batch > 5000 THEN
    RAISE EXCEPTION 'max_batch must be between 1 and 5000, got %', max_batch;
  END IF;

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
    RETURN jsonb_build_object('queued', 0, 'failed', 0, 'error', 'vault_missing_service_role_jwt');
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
      queued_count := queued_count + 1;
    EXCEPTION WHEN OTHERS THEN
      failed_count := failed_count + 1;
    END;
  END LOOP;

  INSERT INTO public.audit_logs (action, entity_type, entity_id, description, payload_json)
  VALUES (
    'task_photos_janitor_run',
    'storage',
    gen_random_uuid(),
    'task-photos janitor: queued ' || queued_count || ', enqueue-failed ' || failed_count,
    jsonb_build_object(
      'severity', CASE WHEN failed_count > 0 THEN 'warning' ELSE 'info' END,
      'queued_count', queued_count,
      'failed_count', failed_count,
      'hours_to_keep', hours_to_keep,
      'max_batch', max_batch
    )
  );

  RETURN jsonb_build_object('queued', queued_count, 'failed', failed_count);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.janitor_task_photos_orphans(integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.janitor_task_photos_orphans(integer, integer)
  TO   service_role, postgres;
