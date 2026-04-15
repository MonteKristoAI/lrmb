-- Newsletter subscribers table
-- Collects emails from site signup forms
-- Ready for Klaviyo sync when configured

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text DEFAULT '',
  interests text DEFAULT '',
  source text DEFAULT 'website',
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Service role can manage (edge functions for signup)
CREATE POLICY "Service role manages subscribers"
  ON public.newsletter_subscribers FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Anyone can subscribe (insert only - not read/update/delete)
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admins can view
CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
