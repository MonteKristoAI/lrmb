
-- Expand product_overrides with status and flags
ALTER TABLE public.product_overrides 
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS subscription_eligible boolean NOT NULL DEFAULT false;

-- Sync existing is_available=false rows to out_of_stock status
UPDATE public.product_overrides SET status = 'out_of_stock' WHERE is_available = false;

-- Custom products table for admin-added products
CREATE TABLE public.custom_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text UNIQUE NOT NULL,
  title text NOT NULL,
  brand text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'thc-edibles',
  subcategory text,
  price numeric(10,2) NOT NULL,
  compare_price numeric(10,2),
  description text DEFAULT '',
  highlights text[] DEFAULT '{}',
  effects text[] DEFAULT '{}',
  ingredients text DEFAULT '',
  weight text DEFAULT '',
  gram_amount text DEFAULT '',
  image_url text,
  product_image_url text,
  gallery_images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  is_featured boolean NOT NULL DEFAULT false,
  subscription_eligible boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage custom_products" ON public.custom_products
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read custom_products" ON public.custom_products
  FOR SELECT TO anon, authenticated
  USING (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Admin can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');
