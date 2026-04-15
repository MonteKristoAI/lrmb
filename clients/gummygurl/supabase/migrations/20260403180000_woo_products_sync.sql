-- WooCommerce → Supabase product sync tables
-- Products synced from WooCommerce via n8n webhooks + daily cron

-- 1. Main products table (synced from WooCommerce)
CREATE TABLE public.woo_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  woo_id integer UNIQUE NOT NULL,
  handle text UNIQUE NOT NULL,
  title text NOT NULL,
  brand text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'thc-edibles',
  subcategory text,
  price numeric(10,2) NOT NULL,
  compare_price numeric(10,2),
  description text DEFAULT '',
  short_description text DEFAULT '',
  highlights text[] DEFAULT '{}',
  effects text[] DEFAULT '{}',
  image_url text,
  product_image_url text,
  gallery_images text[] DEFAULT '{}',
  variants jsonb DEFAULT '[]',
  flavors jsonb DEFAULT '[]',
  thc_restricted boolean NOT NULL DEFAULT false,
  coa_pdf text,
  whats_included text[] DEFAULT '{}',
  stock_status text DEFAULT 'instock',
  woo_status text DEFAULT 'publish',
  woo_categories jsonb DEFAULT '[]',
  woo_meta jsonb DEFAULT '{}',
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.woo_products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products (shop page, product detail, etc.)
CREATE POLICY "Anyone can read woo_products"
  ON public.woo_products FOR SELECT TO anon, authenticated
  USING (true);

-- Service role (n8n sync) can do everything
CREATE POLICY "Service role can manage woo_products"
  ON public.woo_products FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Indexes for fast lookups
CREATE INDEX idx_woo_products_handle ON public.woo_products(handle);
CREATE INDEX idx_woo_products_category ON public.woo_products(category);
CREATE INDEX idx_woo_products_woo_id ON public.woo_products(woo_id);
CREATE INDEX idx_woo_products_status ON public.woo_products(woo_status, stock_status);

-- 2. Category mapping table (WooCommerce slug → LocalProduct CategorySlug/SubcategorySlug)
CREATE TABLE public.woo_category_map (
  woo_category_slug text PRIMARY KEY,
  woo_category_name text NOT NULL,
  category_slug text NOT NULL,
  subcategory_slug text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.woo_category_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read woo_category_map"
  ON public.woo_category_map FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage woo_category_map"
  ON public.woo_category_map FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage woo_category_map"
  ON public.woo_category_map FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Pre-seed known category mappings
INSERT INTO public.woo_category_map (woo_category_slug, woo_category_name, category_slug, subcategory_slug) VALUES
  ('bundles', 'Bundles', 'bundles', NULL),
  ('thc-edibles', 'THC Edibles', 'thc-edibles', NULL),
  ('gummies', 'Gummies', 'thc-edibles', 'gummies'),
  ('cookies-dessert-edibles', 'Cookies & Dessert Edibles', 'thc-edibles', 'cookies-dessert-edibles'),
  ('chocolate-candy', 'Chocolate & Candy', 'thc-edibles', 'chocolate-candy'),
  ('drink-mixes', 'Drink Mixes', 'thc-edibles', 'drink-mixes'),
  ('specialty-edibles', 'Specialty Edibles', 'thc-edibles', 'specialty-edibles'),
  ('mushroom-products', 'Mushroom Products', 'mushroom-products', NULL),
  ('mushroom-gummies', 'Mushroom Gummies', 'mushroom-products', 'mushroom-gummies'),
  ('mushroom-chocolate', 'Mushroom Chocolate', 'mushroom-products', 'mushroom-chocolate'),
  ('health-wellness', 'Health & Wellness', 'health-wellness', NULL),
  ('cbd-gummies', 'CBD Gummies', 'health-wellness', 'cbd-gummies'),
  ('tinctures', 'Tinctures', 'health-wellness', 'tinctures'),
  ('sleep-support', 'Sleep Support', 'health-wellness', 'sleep-support'),
  ('intimacy-support', 'Intimacy Support', 'health-wellness', 'intimacy-support'),
  ('topicals', 'Topicals', 'health-wellness', 'topicals'),
  ('pet-wellness', 'Pet Wellness', 'pet-wellness', NULL),
  ('crunchy-treats', 'Crunchy Treats', 'pet-wellness', 'crunchy-treats'),
  ('soft-chews', 'Soft Chews', 'pet-wellness', 'soft-chews'),
  ('protein-treats', 'Protein Treats', 'pet-wellness', 'protein-treats'),
  ('thca-flower', 'THCA Flower', 'thca-flower', NULL),
  ('uncategorized', 'Uncategorized', 'thc-edibles', NULL)
ON CONFLICT (woo_category_slug) DO NOTHING;

-- 3. Add woo_id reference to product_overrides
ALTER TABLE public.product_overrides
  ADD COLUMN IF NOT EXISTS woo_id integer;
