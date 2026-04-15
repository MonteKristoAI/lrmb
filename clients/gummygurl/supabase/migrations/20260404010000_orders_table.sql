-- Orders table for one-time purchases
-- Flow: pending → paid (Stripe confirms) → processing (WC order created) → completed/cancelled

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  woo_order_id integer,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric(10,2) NOT NULL,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Service role (edge functions) can do everything
CREATE POLICY "Service role manages orders"
  ON public.orders FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_stripe_session ON public.orders(stripe_session_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_email ON public.orders(email);
