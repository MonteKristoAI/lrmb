-- QA P1 Q-SEC-17: jti-based share token revocation list.
-- v2 share tokens carry a `jti` (random uuid). Inserting it here marks the
-- token as revoked; verify functions check via has_revoked_share_token(jti).
CREATE TABLE IF NOT EXISTS public.revoked_share_tokens (
  jti text PRIMARY KEY,
  revoked_at timestamptz NOT NULL DEFAULT now(),
  revoked_by uuid REFERENCES auth.users(id),
  reason text
);
ALTER TABLE public.revoked_share_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage revoked share tokens" ON public.revoked_share_tokens;
CREATE POLICY "Admin manage revoked share tokens"
  ON public.revoked_share_tokens FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

-- Helper used by edge fns (called via service-role; bypasses RLS but kept
-- SECURITY DEFINER so it can be invoked from RPC if needed later).
CREATE OR REPLACE FUNCTION public.has_revoked_share_token(p_jti text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.revoked_share_tokens WHERE jti = p_jti)
$$;
REVOKE EXECUTE ON FUNCTION public.has_revoked_share_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_revoked_share_token(text) TO authenticated, service_role;
