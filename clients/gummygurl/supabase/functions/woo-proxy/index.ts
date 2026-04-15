import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WOO_STORE_URL = (Deno.env.get("WOO_STORE_URL") || "").replace(/\/+$/, "");
    const WOO_CONSUMER_KEY = Deno.env.get("WOO_CONSUMER_KEY");
    const WOO_CONSUMER_SECRET = Deno.env.get("WOO_CONSUMER_SECRET");

    if (!WOO_STORE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
      return new Response(
        JSON.stringify({ error: "WooCommerce credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return new Response(
        JSON.stringify({ error: "Missing 'path' query parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the WooCommerce API URL
    const wooUrl = new URL(`${WOO_STORE_URL}/wp-json/wc/v3${path}`);

    // Forward any additional query params (except 'path')
    url.searchParams.forEach((value, key) => {
      if (key !== "path") {
        wooUrl.searchParams.set(key, value);
      }
    });

    // Determine auth method based on protocol
    const isHttps = wooUrl.protocol === "https:";

    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isHttps) {
      // HTTPS: Use HTTP Basic Auth
      const credentials = btoa(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`);
      fetchHeaders["Authorization"] = `Basic ${credentials}`;
    } else {
      // HTTP: Use query string auth
      wooUrl.searchParams.set("consumer_key", WOO_CONSUMER_KEY);
      wooUrl.searchParams.set("consumer_secret", WOO_CONSUMER_SECRET);
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: fetchHeaders,
    };

    if (req.method === "POST" || req.method === "PUT") {
      fetchOptions.body = await req.text();
    }

    console.log(`Proxying ${req.method} to ${wooUrl.origin}${wooUrl.pathname} (${isHttps ? "Basic Auth" : "Query Auth"})`);

    const wooRes = await fetch(wooUrl.toString(), fetchOptions);
    const body = await wooRes.text();

    console.log(`WooCommerce responded with status ${wooRes.status}`);

    return new Response(body, {
      status: wooRes.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
