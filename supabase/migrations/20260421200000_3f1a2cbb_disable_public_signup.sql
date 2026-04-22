-- Disable self-serve signups and keep account creation admin-only.
-- Public signup requests create users with email_confirmed_at = NULL.
-- Admin-created users (email_confirm: true) have email_confirmed_at set.
CREATE OR REPLACE FUNCTION public.block_public_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'Public signup is disabled. Contact your administrator.';
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_block_public_signup'
  ) THEN
    CREATE TRIGGER trg_block_public_signup
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.block_public_signup();
  END IF;
END
$$;
