-- L10 audit 2026-06-09 — RLS + storage lockdown wave 2.
-- Closes findings surfaced by parallel agents after c3f8738 shipped:
--
--   RLS P0-1: anon can read/update/delete every in-flight LRMB onboarding
--             draft. `anon_select_drafts_only` + `anon_update_drafts` gate
--             on the literal `DRAFT_` prefix — which is shipped in the SPA
--             bundle, so it is not a secret.
--   RLS P0-2: 5 public views (v_operations_*, v_track_*) carry full
--             arwdDxtm ACL for anon. security_invoker is already ON so
--             underlying RLS does block today's reads, but the wide ACL
--             grants are pure attack surface — REVOKE to deny-by-default.
--   RLS P1-3: anon has SELECT on user_roles. RLS qual blocks anon today
--             (auth.uid() is NULL), but any policy regression would leak
--             the full RBAC table — REVOKE.
--   Storage P2-1: task-photos bucket has NULL file_size_limit and NULL
--             allowed_mime_types. Set explicit 10 MB cap + image whitelist
--             so a future RLS regression doesn't expose arbitrary uploads.
--   Verify P0-2: prune_noisy_heartbeats(7) covers 3 actions but misses
--             ops_health_check (1,774 rows growing ~96/day). Add it.
--   Verify P1-1: notification_events insert is one batch; chunk to 200.
--             (Code change, deferred — see verify report.)

-- ─────────────────────────────────────────────────────────────────────
-- 1. form_submissions: kill the DRAFT_ corridor.
-- ─────────────────────────────────────────────────────────────────────
-- Drop the anon read + update policies. Keep `anon_insert` (legitimate
-- public submit path) and `auth_select_admin_only` (admin review).
-- Drafts-resume from anon was a "nice-to-have" never tied to a real
-- session — admin can still review via the authenticated SELECT path.

DROP POLICY IF EXISTS anon_select_drafts_only ON public.form_submissions;
DROP POLICY IF EXISTS anon_update_drafts      ON public.form_submissions;

-- Belt-and-suspenders: revoke direct table grants from anon.
-- INSERT stays via the policy on `anon_insert`. SELECT/UPDATE/DELETE are
-- denied at both the GRANT and POLICY layers.
REVOKE ALL ON public.form_submissions FROM anon;
GRANT  INSERT ON public.form_submissions TO anon;


-- ─────────────────────────────────────────────────────────────────────
-- 2. View ACLs: REVOKE everything from anon on 5 operations/track views.
-- ─────────────────────────────────────────────────────────────────────
-- security_invoker = on means the caller's RLS applies to the underlying
-- tables, and underlying RLS denies anon today. But the views carry
-- arwdDxtm grants to anon at the view layer — that is junk that should
-- never have been issued. Defense-in-depth: deny-by-default.

REVOKE ALL ON public.v_operations_recent_photos   FROM anon;
REVOKE ALL ON public.v_operations_recent_activity FROM anon;
REVOKE ALL ON public.v_operations_damage_claims   FROM anon;
REVOKE ALL ON public.v_track_attachment_queue     FROM anon;
REVOKE ALL ON public.v_track_poll_latest          FROM anon;
-- v_track_sync_health already lacks SELECT; revoke any residual grants.
REVOKE ALL ON public.v_track_sync_health          FROM anon;


-- ─────────────────────────────────────────────────────────────────────
-- 3. user_roles: anon has no business reading this table.
-- ─────────────────────────────────────────────────────────────────────
REVOKE SELECT ON public.user_roles FROM anon;


-- ─────────────────────────────────────────────────────────────────────
-- 4. task-photos bucket: file size + MIME whitelist.
-- ─────────────────────────────────────────────────────────────────────
-- 10 MB matches the edge fn's MAX_BYTES cap. MIME list matches the
-- magic-byte detector in photo-upload v3 (jpeg, png, webp, heic).
UPDATE storage.buckets
   SET file_size_limit    = 10485760,                        -- 10 MB
       allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/heic']
 WHERE id = 'task-photos';


-- ─────────────────────────────────────────────────────────────────────
-- 5. prune_noisy_heartbeats: extend coverage to ops_health_check.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.prune_noisy_heartbeats(days_to_keep integer DEFAULT 7)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  removed integer;
BEGIN
  -- v2: added ops_health_check (audit log noise from hourly health probe).
  -- Keep audit_logs with payload severity != info (errors + warnings).
  DELETE FROM public.audit_logs
  WHERE action IN (
    'track_attachment_push_run',
    'track_poll_run',
    'final_clean_orchestrator_run',
    'ops_health_check'
  )
    AND created_at < (now() - make_interval(days => days_to_keep))
    AND COALESCE((payload_json->>'severity'), 'info') = 'info';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_noisy_heartbeats(integer)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.prune_noisy_heartbeats(integer)
  TO   service_role, postgres;
