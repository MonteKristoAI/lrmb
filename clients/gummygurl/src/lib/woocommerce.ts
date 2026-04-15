/**
 * WooCommerce REST API helper
 *
 * All requests are routed through a server-side proxy (e.g. Supabase edge
 * function) so that consumer key / secret are never exposed to the browser.
 *
 * TODO: Replace WOO_PROXY_URL with the URL of your deployed proxy once ready.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Base URL of the server-side proxy that forwards requests to WooCommerce. */
const WOO_PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/woo-proxy`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WooImage {
  id: number;
  src: string;
  alt: string;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: WooImage[];
  categories: WooCategory[];
}

export interface WooOrderLineItem {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

export interface WooOrderBilling {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address_1?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface WooOrderPayload {
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  billing: WooOrderBilling;
  line_items: WooOrderLineItem[];
}

export interface WooOrder {
  id: number;
  status: string;
  total: string;
  order_key: string;
  /** URL to redirect the customer for payment (if applicable). */
  payment_url?: string;
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

async function wooApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${WOO_PROXY_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `WooCommerce API error ${res.status}: ${body || res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Product helpers
// ---------------------------------------------------------------------------

/** Fetch a paginated list of products. */
export async function fetchWooProducts(
  params: { page?: number; per_page?: number; category?: number } = {}
): Promise<WooProduct[]> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.per_page) query.set("per_page", String(params.per_page));
  if (params.category) query.set("category", String(params.category));

  const qs = query.toString();
  return wooApiFetch<WooProduct[]>(`/products${qs ? `?${qs}` : ""}`);
}

/** Fetch a single product by its slug (URL-friendly handle). */
export async function fetchWooProductBySlug(
  slug: string
): Promise<WooProduct | null> {
  const products = await wooApiFetch<WooProduct[]>(
    `/products?slug=${encodeURIComponent(slug)}`
  );
  return products[0] ?? null;
}

// ---------------------------------------------------------------------------
// Order / Checkout helpers
// ---------------------------------------------------------------------------

/** Create a new WooCommerce order. */
export async function createWooOrder(
  payload: WooOrderPayload
): Promise<WooOrder> {
  return wooApiFetch<WooOrder>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
