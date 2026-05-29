-- L10 sweep (codex + playwright + supabase advisor 2026-05-29) closed five
-- production data-exposure surfaces. None caused a confirmed breach, but
-- each is reachable via the anon key shipped in the SPA bundle.
--
-- 1. Materialized views readable by `anon` (RLS does not apply to MVs).
-- 2. user_roles `anon_select_limited` policy `USING (true)` — anon can
--    enumerate every user_id + role pair (recon surface).
-- 3. form_submissions `auth_select` policy `USING (true)` — any
--    authenticated user (incl. vendor staff + future demo accounts) can
--    read every submitted form.
-- 4. form_submissions `anon_insert` `WITH CHECK (true)` — anon can insert
--    arbitrary rows of any size, any client, any view_password.
-- 5. form_submissions `anon_select_drafts_only` had `view_password LIKE
--    'DRAFT%' OR client = 'lrmb'` — the OR meant anon could read every
--    LRMB row regardless of draft status. Should have been AND.

-- ─── 1. Materialized views ─────────────────────────────────────────────
REVOKE SELECT ON public.mv_ops_dashboard_kpis FROM anon;
REVOKE SELECT ON public.mv_ops_dashboard_kpis_by_property FROM anon;
REVOKE SELECT ON public.mv_track_reservations_latest FROM anon;

-- Authenticated keeps SELECT — useDashboardKpis() runs from logged-in
-- pages and pulls these views directly.
GRANT SELECT ON public.mv_ops_dashboard_kpis TO authenticated;
GRANT SELECT ON public.mv_ops_dashboard_kpis_by_property TO authenticated;
GRANT SELECT ON public.mv_track_reservations_latest TO authenticated;

-- ─── 2. user_roles anon SELECT ─────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_limited" ON public.user_roles;
-- Also REVOKE the table-level grants anon never needed. RLS already
-- blocked everything but RLS doesn't apply to TRUNCATE/REFERENCES.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.user_roles FROM anon;

-- ─── 3. form_submissions auth_select ───────────────────────────────────
DROP POLICY IF EXISTS "auth_select" ON public.form_submissions;
CREATE POLICY "auth_select_admin_only" ON public.form_submissions
  FOR SELECT TO authenticated
  USING ((SELECT public.has_admin_access((SELECT auth.uid()))));

-- ─── 4. form_submissions anon_insert tighten ───────────────────────────
DROP POLICY IF EXISTS "anon_insert" ON public.form_submissions;
CREATE POLICY "anon_insert" ON public.form_submissions
  FOR INSERT TO anon
  WITH CHECK (
    client IN ('lrmb')                                  -- known clients only
    AND view_password LIKE 'DRAFT%'                     -- forces draft prefix
    AND length(coalesce(view_password,'')) BETWEEN 10 AND 128
    AND pg_column_size(data) < 100000                   -- 100 KB cap
  );

-- ─── 5. form_submissions anon_select_drafts_only OR-bug fix ────────────
DROP POLICY IF EXISTS "anon_select_drafts_only" ON public.form_submissions;
CREATE POLICY "anon_select_drafts_only" ON public.form_submissions
  FOR SELECT TO anon
  USING (
    view_password LIKE 'DRAFT%'
    AND client = 'lrmb'                                 -- AND was OR — fixed
  );

-- ─── 6. user_roles + form_submissions REVOKE table-level over-grants ──
-- RLS gates DML but anon never had a use case for INSERT/UPDATE/DELETE/
-- TRUNCATE/REFERENCES/TRIGGER. Belt-and-braces.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.form_submissions FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.form_submissions FROM authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.user_roles FROM authenticated;
