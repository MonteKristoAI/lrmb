-- L10 audit wave 5 (2026-06-09): DB hardening sweep.
-- Addresses findings still open after waves 2-4:
--   RLS audit P1-2: anon has unnecessary INSERT/UPDATE/DELETE grants on
--                   19 base tables. RLS denies today, but a single
--                   permissive-policy regression would open the floodgates.
--                   REVOKE ALL closes the GRANT-layer hole; authenticated
--                   is unaffected (separate grant chain).
--   SQL fns P0-1:   send_push_on_notification swallows ALL exceptions
--                   (incl. vault decrypt failure, JWT expiry). Add
--                   audit_logs row inside EXCEPTION so SOC has visibility.
--   SQL fns P1-6:   handle_new_user raw INSERT — ON CONFLICT for race +
--                   retry idempotency.
--   Storage P1-5:   1 orphan task-photos blob today. Janitor function
--                   deferred — Supabase blocks direct DELETE on
--                   storage.objects (protect_delete() trigger); needs
--                   Storage REST API path via net.http_post, follow-up.

-- ─────────────────────────────────────────────────────────────────────
-- 1. REVOKE ALL anon grants on base tables (defense-in-depth).
-- ─────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  t text;
  base_tables text[] := ARRAY[
    'audit_logs','inspections','inspection_templates','inspection_template_items',
    'notification_events','profiles','properties','push_subscriptions',
    'reservation_events','revoked_share_tokens','staff_assignments',
    'task_photos','task_updates','tasks','track_clean_types','track_poll_state',
    'track_wo_subtasks','units','vendors'
  ];
BEGIN
  FOREACH t IN ARRAY base_tables LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
  END LOOP;
END $$;

-- form_submissions keeps anon INSERT (re-granted in wave 2 migration
-- 20260609230000_lrmb_l10_rls_lockdown.sql).

-- ─────────────────────────────────────────────────────────────────────
-- 2. handle_new_user: ON CONFLICT (id) DO NOTHING.
-- ─────────────────────────────────────────────────────────────────────
-- Old INSERT raised duplicate-key on auth retries (e.g. magic-link race),
-- blocking signup. Idempotent profile create.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────
-- 3. send_push_on_notification: surface exceptions to audit_logs.
-- ─────────────────────────────────────────────────────────────────────
-- Old EXCEPTION WHEN OTHERS THEN RETURN NEW swallowed everything including
-- vault decrypt failures (security incident — vault tokens compromised,
-- silent), JWT expiry (silent ops degradation), pg_net network errors.
-- Now log + RETURN NEW (still don't block notification_events insert).
CREATE OR REPLACE FUNCTION public.send_push_on_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url' LIMIT 1)
           || '/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
    ),
    body := jsonb_build_object(
      'user_id', NEW.recipient_id,
      'title',   COALESCE(NEW.title, NEW.event_type),
      'body',    COALESCE(NEW.body, ''),
      'task_id', NEW.task_id,
      'tag',     'lrmb-' || COALESCE(NEW.task_id::text, 'general')
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  BEGIN
    INSERT INTO public.audit_logs (action, entity_type, entity_id, description, payload_json)
    VALUES (
      'push_dispatch_failed',
      'notification_events',
      NEW.id,
      'send_push_on_notification exception: ' || SQLERRM,
      jsonb_build_object(
        'severity', 'warning',
        'sqlstate', SQLSTATE,
        'recipient_id', NEW.recipient_id,
        'event_type', NEW.event_type
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- last-resort: if even audit_logs insert fails, swallow to keep
    -- notification_events insert path open.
    NULL;
  END;
  RETURN NEW;
END;
$$;
