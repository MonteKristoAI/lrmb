
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

CREATE POLICY "Anyone can read woo_products" ON public.woo_products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service role can manage woo_products" ON public.woo_products FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_woo_products_handle ON public.woo_products(handle);
CREATE INDEX idx_woo_products_category ON public.woo_products(category);
CREATE INDEX idx_woo_products_woo_id ON public.woo_products(woo_id);
