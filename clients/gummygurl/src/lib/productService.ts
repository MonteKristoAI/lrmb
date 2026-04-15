/**
 * Product data access layer — reads from Supabase `woo_products` table.
 *
 * Replaces direct imports from `@/data/products` throughout the app.
 * During migration, falls back to the hardcoded ALL_PRODUCTS array
 * if `woo_products` is empty.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  LocalProduct,
  CategorySlug,
  SubcategorySlug,
  EffectTag,
  ProductVariant,
  FlavorOption,
} from "@/data/products";
import { ALL_PRODUCTS, SHIPPING_POLICY } from "@/data/products";

// Re-export types so consumers can switch imports to this file
export type { LocalProduct, CategorySlug, SubcategorySlug, EffectTag, ProductVariant, FlavorOption };
export { SHIPPING_POLICY };

// ---------------------------------------------------------------------------
// Supabase row → LocalProduct mapper
// ---------------------------------------------------------------------------

interface WooProductRow {
  woo_id: number;
  handle: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string | null;
  price: number;
  compare_price: number | null;
  description: string;
  short_description: string;
  highlights: string[];
  effects: string[];
  image_url: string | null;
  product_image_url: string | null;
  gallery_images: string[];
  variants: any[];
  flavors: any[];
  thc_restricted: boolean;
  coa_pdf: string | null;
  whats_included: string[];
  stock_status: string;
  woo_status: string;
}

/** Parse a jsonb field that may come back as a JSON string or already parsed array */
function parsJsonbArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

// COA overrides: products that share COAs or need hardcoded COA paths
// Applied globally so every page (ProductDetail, LabResults, Shop) gets the correct COA link
const COA_MAP: Record<string, string> = {
  // Products with dedicated COAs (from products.ts coaPdf)
  "fubar-gummies-10-pack": "/coas/fubar-coa.pdf",
  "500mg-extremes-thc-gummies-10-pack": "/coas/extreme-10pack-coa.pdf",
  "extreme-singles-500mg-thc-gummy": "/coas/extreme-single-coa.pdf",
  "100mg-delta-9-cereal-killa-bar": "/coas/cereal-killa-coa.pdf",
  "thc-lollipops-70mg-420mg": "/coas/420-lollipop-coa.pdf",
  "2000mg-magnum-thc-gummies": "/coas/magnum-coa.pdf",
  "75mg-oreo-cookie": "/coas/75mg-oreo-cookie-coa.pdf",
  "cheapest-delta-8-gummy-on-the-internet": "/coas/cheapest-gummy-coa.pdf",
  "cheapest-delta-9-gummy-on-the-internet": "/coas/cheapest-gummy-coa.pdf",
  "150mg-delta-9-chocolate-bars": "/coas/chocolate-bars-coa.pdf",
  "rize-mushroom-gummies": "/coas/rize-mushroom-gummy-coa.jpg",
  "rize-mushroom-chocolate-bar-3500mg": "/coas/rize-chocolate-bar-coa.jpg",
  // Shared COAs (per Seamus: same COA covers multiple products)
  "10000mg-thc-gummies": "/coas/magnum-coa.pdf",
  "2000mg-puckerz-thc-sour-gummies": "/coas/extreme-single-coa.pdf",
  "megadose-mushroom-gummies-3500mg": "/coas/rize-mushroom-gummy-coa.jpg",
  "50mg-milk-chocolate-thc-cbd-edible": "/coas/milk-chocolate-coa.pdf",
  "peanut-butter-soft-chews-pet-treat": "/coas/peanut-butter-pet-treat-coa.pdf",
  "mean-green-5000mg-muscle-rub": "/coas/mean-green-coa.pdf",
  "100mg-delta-8-caramel-cubes": "/coas/caramel-cubes-coa.pdf",
  "500mg-strawberry-cream-coated-golden-oreo-cookie": "/coas/cheapest-gummy-coa.pdf",
  "40mg-nano-cbd-gummies": "/coas/nano-cbd-gummy-coa.pdf",
  // Supabase handle variants (WooCommerce generates different slugs than local products.ts)
  "rize-megadose-mushroom-chocolate-bar": "/coas/rize-chocolate-bar-coa.jpg",
  "cheapest-delta-8-gummy-on-the-net": "/coas/cheapest-gummy-coa.pdf",
  "cheapest-gummy-on-the-net-125mg-delta-9": "/coas/cheapest-gummy-coa.pdf",
  "rize-megadose-mushroom-gummies": "/coas/rize-mushroom-gummy-coa.jpg",
  "75mg-cookies-cream-coated-oreo-cookie": "/coas/75mg-oreo-cookie-coa.pdf",
  // THCA flower strains
  "starburst-thca-flower": "/coas/starburst-coa.pdf",
  "sour-cookies-thca-flower": "/coas/sour-cookie-coa.pdf",
  "lemon-kush-thca-flower": "/coas/lemon-kush-coa.pdf",
  "orange-apricot-mac-thca-flower": "/coas/orange-apricot-mac-coa.pdf",
  "space-runtz-thca-flower": "/coas/space-runtz-coa.pdf",
  "purple-haze-thca-flower": "/coas/purple-haze-coa.pdf",
  "apple-fritter-thca-flower": "/coas/apple-fritter-coa.pdf",
  "platinum-grape-punch-thca-flower": "/coas/platinum-grape-punch-coa.pdf",
  "cherry-pie-runtz-thca-flower": "/coas/cherry-pie-runtz-coa.pdf",
};

function mapRowToProduct(row: WooProductRow): LocalProduct {
  const handle = row.handle;
  return {
    handle,
    title: row.title,
    brand: row.brand,
    category: (row.category || "thc-edibles") as CategorySlug,
    subcategory: (row.subcategory || "gummies") as SubcategorySlug,
    price: Number(row.price),
    comparePrice: row.compare_price ? Number(row.compare_price) : undefined,
    effects: (row.effects || []) as EffectTag[],
    description: row.description || "",
    highlights: row.highlights || [],
    whatsIncluded: row.whats_included?.length ? row.whats_included : undefined,
    image: row.image_url,
    productImage: row.product_image_url,
    secondaryImages: row.gallery_images || [],
    flavors: (() => {
      const f = parsJsonbArray(row.flavors) as FlavorOption[];
      return f.length > 0 ? f : undefined;
    })(),
    variants: (() => {
      const v = parsJsonbArray(row.variants) as ProductVariant[];
      return v.length > 0 ? v : [{ id: `woo-${row.handle}`, label: "Default", price: Number(row.price) }];
    })(),
    thcRestricted: row.thc_restricted ?? false,
    coaPdf: row.coa_pdf || COA_MAP[handle] || undefined,
  };
}

// ---------------------------------------------------------------------------
// Products to hide from storefront (no COA available, bank requirement)
// These stay in the database but are filtered from all public-facing pages.
// When a new COA arrives, remove the handle from this set and add to COA_MAP.
// ---------------------------------------------------------------------------
const HIDDEN_HANDLES = new Set([
  "1000mg-nurtle-thc-gummy",
  "420mg-milk-chocolate-coated-oreo-cookie",
  "1000mg-smores-coated-oreo-cookie",
  "800mg-frost-n-fade-frosting",
  "30mg-delta-8-chocolate-covered-gummies",
  "5mg-thc-midnight-bluezzz-sleep-gummies",
  "1000mg-delta-8-gummies-with-caffeine",
  "250mg-thc-hot-choc-lit-cocoa-mix",
  "intimacy-gummy",
  "elderberry-cbd-gummies",
  "5000mg-cbd-tincture",
  "1200mg-cbn-sleep-tincture",
  "400mg-cbn-sleep-gummy-with-melatonin",
  "5000mg-joint-and-muscle-balm",
  "chicken-chips-pet-treat",
  "beef-liver-pet-treat",
  "decadence-bundle-premium-thc-chocolate-dessert-collection",
  "gummy-lovers-bundle-6500mg-thc-variety-pack",
  "curiosity-bundle-unique-edibles-experience-pack",
]);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Fetch all published, in-stock products. Falls back to hardcoded data. */
export async function fetchAllProducts(): Promise<LocalProduct[]> {
  const { data, error } = await (
    supabase
      .from("woo_products" as any)
      .select("*")
      .eq("woo_status", "publish") as any
  );

  let products: LocalProduct[];
  if (error || !data || data.length === 0) {
    products = ALL_PRODUCTS;
  } else {
    products = (data as WooProductRow[]).map(mapRowToProduct);
  }

  // Filter out hidden products (no COA, bank requirement)
  return products.filter(p => !HIDDEN_HANDLES.has(p.handle));
}

/** Fetch a single product by its URL handle/slug. */
export async function fetchProductByHandle(
  handle: string
): Promise<LocalProduct | null> {
  // Block hidden products from direct access
  if (HIDDEN_HANDLES.has(handle)) return null;

  const { data, error } = await (
    supabase
      .from("woo_products" as any)
      .select("*")
      .eq("handle", handle)
      .maybeSingle() as any
  );

  if (error || !data) {
    // Fallback: check hardcoded products
    return ALL_PRODUCTS.find((p) => p.handle === handle) || null;
  }

  return mapRowToProduct(data as WooProductRow);
}

/** Fetch products flagged as featured via product_overrides. */
// Curated featured handles — one per category for variety (per Seamus, Apr 13 2026)
const FEATURED_HANDLES = [
  "fubar-gummies-10-pack",                // THC Edibles
  "100mg-delta-9-cereal-killa-bar",       // THC Edibles (variety)
  "rize-mushroom-gummies",                // Mushroom
  "400mg-cbn-sleep-gummy-with-melatonin", // Wellness (hidden, fallback below)
  "5mg-thc-midnight-bluezzz-sleep-gummies", // Wellness sleep (hidden, fallback)
  "chicken-chips-pet-treat",              // Pet (hidden, fallback)
];

export async function fetchFeaturedProducts(): Promise<LocalProduct[]> {
  // First try curated list from product_overrides in Supabase
  const { data: overrides } = await (
    supabase
      .from("product_overrides" as any)
      .select("handle")
      .eq("is_featured", true) as any
  );

  if (overrides && overrides.length > 0) {
    const handles = overrides.map((o: any) => o.handle);
    const { data } = await (
      supabase
        .from("woo_products" as any)
        .select("*")
        .in("handle", handles)
        .eq("woo_status", "publish") as any
    );
    if (data && data.length >= 4) {
      return (data as WooProductRow[]).map(mapRowToProduct);
    }
  }

  // Fallback: curated diverse selection across categories
  // fetchAllProducts() already filters hidden products
  const all = await fetchAllProducts();

  // Pick one from each category for diversity
  const categories = ["thc-edibles", "mushroom-products", "health-wellness", "pet-wellness", "thca-flower"];
  const picks: LocalProduct[] = [];
  for (const cat of categories) {
    const match = visible.find(p => p.category === cat && !picks.includes(p));
    if (match) picks.push(match);
  }
  // Fill remaining slots from THC edibles (most popular)
  for (const p of visible) {
    if (picks.length >= 6) break;
    if (!picks.includes(p)) picks.push(p);
  }
  return picks.slice(0, 6);
}

/** Fetch all product_overrides as a handle-keyed map. */
export async function fetchProductOverrides(): Promise<
  Record<string, { status: string; is_featured: boolean; subscription_eligible: boolean }>
> {
  const { data } = await (
    supabase.from("product_overrides" as any).select("*") as any
  );

  const map: Record<string, any> = {};
  (data || []).forEach((o: any) => {
    map[o.handle] = o;
  });
  return map;
}

/** Get all unique brands from the product set. */
export function getBrands(products: LocalProduct[]): string[] {
  return [...new Set(products.map((p) => p.brand))];
}

/** Get all unique effect tags from the product set. */
export function getEffects(products: LocalProduct[]): EffectTag[] {
  const set = new Set<EffectTag>();
  products.forEach((p) => p.effects.forEach((e) => set.add(e)));
  return [...set];
}
