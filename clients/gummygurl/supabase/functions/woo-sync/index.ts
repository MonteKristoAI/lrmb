import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const secret = Deno.env.get("WOO_SYNC_SECRET");
    if (!secret) {
      return new Response(
        JSON.stringify({ error: "WOO_SYNC_SECRET not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    if (req.method === "POST") {
      const body = await req.json();

      if (!Array.isArray(body)) {
        return new Response(
          JSON.stringify({ error: "Body must be a JSON array of products" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (body.length === 0) {
        return new Response(
          JSON.stringify({ count: 0 }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate each product has required fields
      for (let i = 0; i < body.length; i++) {
        const p = body[i];
        if (typeof p.woo_id !== "number" || !p.handle || !p.title) {
          return new Response(
            JSON.stringify({ error: `Product at index ${i} missing required fields (woo_id, handle, title)` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      const now = new Date().toISOString();
      const rows = body.map((p: Record<string, unknown>) => ({
        woo_id: p.woo_id,
        handle: p.handle,
        title: p.title,
        brand: p.brand ?? "",
        category: p.category ?? "thc-edibles",
        subcategory: p.subcategory ?? null,
        price: p.price ?? 0,
        compare_price: p.compare_price ?? null,
        description: p.description ?? "",
        short_description: p.short_description ?? "",
        highlights: p.highlights ?? [],
        effects: p.effects ?? [],
        image_url: p.image_url ?? null,
        product_image_url: p.product_image_url ?? null,
        gallery_images: p.gallery_images ?? [],
        variants: p.variants ?? [],
        flavors: p.flavors ?? [],
        thc_restricted: p.thc_restricted ?? false,
        coa_pdf: p.coa_pdf ?? null,
        whats_included: p.whats_included ?? [],
        stock_status: p.stock_status ?? "instock",
        woo_status: p.woo_status ?? "publish",
        woo_categories: p.woo_categories ?? [],
        woo_meta: p.woo_meta ?? {},
        synced_at: now,
        updated_at: now,
      }));

      const { error, count } = await supabase
        .from("woo_products")
        .upsert(rows, { onConflict: "woo_id", count: "exact" });

      if (error) {
        console.error("Upsert error:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ count: count ?? rows.length }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "DELETE") {
      const body = await req.json();

      if (!body.woo_ids || !Array.isArray(body.woo_ids) || body.woo_ids.length === 0) {
        return new Response(
          JSON.stringify({ error: "Body must contain woo_ids array" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error, count } = await supabase
        .from("woo_products")
        .delete({ count: "exact" })
        .in("woo_id", body.woo_ids);

      if (error) {
        console.error("Delete error:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ deleted: count ?? 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST or DELETE." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("woo-sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
