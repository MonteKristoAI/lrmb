-- P0 security hole discovered by adversarial pentest immediately after
-- 20260529000000 shipped: the existing "Users update own profile" RLS policy
-- (USING + WITH CHECK: id = auth.uid()) permits a field_staff user to set
-- their own profiles.vendor_id to any vendor UUID. Combined with the new
-- "Staff see vendor tasks" policy this means any authenticated user can
-- hop into any vendor's task feed (read + update) by enumerating vendors
-- (which authenticated can list) and self-mutating their profile.
--
-- Defense: BEFORE UPDATE trigger on profiles that rejects any change to
-- vendor_id unless the actor is admin / manager. RLS-layer fix would require
-- per-column WITH CHECK which Postgres doesn't support directly, so the
-- trigger pattern is the only clean option.

CREATE OR REPLACE FUNCTION public.enforce_profile_self_update_scope()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Server-side calls (pg_cron, RPCs, edge functions running as
  -- service_role / postgres) have no auth.uid() — let them through.
  IF (SELECT auth.uid()) IS NULL THEN
    RETURN NEW;
  END IF;

  -- Admins / managers / supervisors can change anything (including
  -- assigning staff to vendors via the admin UI).
  IF public.has_admin_access((SELECT auth.uid())) THEN
    RETURN NEW;
  END IF;

  -- Field-staff self-update: lock down the columns they shouldn't be
  -- able to mutate. vendor_id is the new one introduced today; the
  -- existing policy never blocked it because it's row-level not
  -- column-level. Add more here as future privilege fields appear.
  IF NEW.vendor_id IS DISTINCT FROM OLD.vendor_id THEN
    RAISE EXCEPTION 'Field staff cannot modify their own vendor membership'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_profile_self_update_scope() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.enforce_profile_self_update_scope() TO service_role;

DROP TRIGGER IF EXISTS profiles_self_update_scope ON public.profiles;
CREATE TRIGGER profiles_self_update_scope
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_self_update_scope();
