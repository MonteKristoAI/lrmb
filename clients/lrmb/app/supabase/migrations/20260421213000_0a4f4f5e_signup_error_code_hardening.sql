-- Keep signup disabled, but return an auth-style permission error
-- instead of an internal server error classification.
CREATE OR REPLACE FUNCTION public.block_public_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    RAISE EXCEPTION USING
      ERRCODE = '42501',
      MESSAGE = 'Public signup is disabled. Contact your administrator.';
  END IF;

  RETURN NEW;
END;
$$;
