import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHIPPING_FLAT_RATE = 8.0;
const FREE_SHIPPING_THRESHOLD = 99.0;
const NMI_API_URL = "https://secure.networkmerchants.com/api/transact.php";

interface CartItem {
  handle: string;
  title: string;
  price: number;
  quantity: number;
  image?: string | null;
  woo_id?: number;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const {
      payment_token,
      email,
      shipping,
      items,
      user_id,
      discount,
      subscription,
    }: {
      payment_token: string | null;
      email: string;
      shipping: ShippingAddress;
      items: CartItem[];
      user_id?: string;
      discount?: { code: string; percent: number };
      subscription?: { frequency: string };
    } = await req.json();

    const isSubscription = !!subscription?.frequency;

    // Validate
    if (!email) throw new Error("Email is required");
    if (!items || items.length === 0) throw new Error("Cart is empty");
    if (!shipping?.first_name || !shipping?.last_name || !shipping?.address_1 || !shipping?.city || !shipping?.state || !shipping?.zip) {
      throw new Error("Complete shipping address is required");
    }

    for (const item of items) {
      if (!item.handle || !item.title || !item.price || item.price <= 0 || !item.quantity || item.quantity <= 0) {
        throw new Error("Invalid cart item");
      }
    }

    // Validate discount server-side via WooCommerce coupons API
    let validatedDiscount = 0;
    if (discount?.code) {
      try {
        const wooStoreUrl = (Deno.env.get("WOO_STORE_URL") || "").replace(/\/+$/, "");
        const wooKey = Deno.env.get("WOO_CONSUMER_KEY");
        const wooSecret = Deno.env.get("WOO_CONSUMER_SECRET");
        if (wooStoreUrl && wooKey && wooSecret) {
          const credentials = btoa(`${wooKey}:${wooSecret}`);
          const couponRes = await fetch(
            `${wooStoreUrl}/wp-json/wc/v3/coupons?code=${encodeURIComponent(discount.code)}`,
            { headers: { Authorization: `Basic ${credentials}` } }
          );
          const coupons = await couponRes.json();
          if (Array.isArray(coupons) && coupons.length > 0) {
            const coupon = coupons[0];
            if (coupon.discount_type === "percent") {
              validatedDiscount = parseFloat(coupon.amount);
            } else if (coupon.discount_type === "fixed_cart") {
              // Convert fixed amount to effective percentage
              const sub = items.reduce((s, i) => s + i.price * i.quantity, 0);
              validatedDiscount = Math.min((parseFloat(coupon.amount) / sub) * 100, 100);
            }
          }
        }
      } catch (e) {
        console.warn("[PROCESS-PAYMENT] Coupon validation failed:", e);
        // Continue without discount rather than blocking the order
      }
    }

    // Calculate totals with validated discount
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = validatedDiscount > 0 ? subtotal * (validatedDiscount / 100) : 0;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const shippingCost = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
    const total = subtotalAfterDiscount + shippingCost;

    // Resolve user from auth header
    let resolvedUserId = user_id || null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader && !resolvedUserId) {
      const anonClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      const token = authHeader.replace("Bearer ", "");
      const { data } = await anonClient.auth.getUser(token);
      if (data.user) resolvedUserId = data.user.id;
    }

    // Create pending order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: resolvedUserId,
        email,
        items: items.map((i) => ({
          handle: i.handle,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          woo_id: i.woo_id || null,
        })),
        subtotal,
        shipping: shippingCost,
        total,
        status: "pending",
        shipping_address: shipping,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      throw new Error("Failed to create order");
    }

    const orderId = order.id;

    // Check NMI credentials
    const nmiSecurityKey = Deno.env.get("NMI_SECURITY_KEY");

    if (!nmiSecurityKey) {
      // NMI not configured - create order as "pending_payment" for manual processing
      await supabase
        .from("orders")
        .update({ status: "pending_payment", updated_at: new Date().toISOString() })
        .eq("id", orderId);

      console.log(`[PROCESS-PAYMENT] NMI not configured. Order ${orderId} created as pending_payment.`);

      return new Response(
        JSON.stringify({
          success: true,
          order_id: orderId,
          payment_status: "pending_payment",
          message: "Order placed. Payment processing is being configured.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (!payment_token) {
      throw new Error("Payment token is required");
    }

    // Call NMI Direct Post API
    const nmiParams = new URLSearchParams({
      security_key: nmiSecurityKey,
      payment_token: payment_token,
      type: "sale",
      amount: total.toFixed(2),
      currency: "USD",
      first_name: shipping.first_name,
      last_name: shipping.last_name,
      address1: shipping.address_1,
      address2: shipping.address_2 || "",
      city: shipping.city,
      state: shipping.state,
      zip: shipping.zip,
      country: shipping.country || "US",
      email: email,
      orderid: orderId,
      order_description: items.map((i) => `${i.title} x${i.quantity}`).join(", "),
      shipping: shippingCost.toFixed(2),
    });

    // For subscriptions: add customer to vault for recurring billing
    if (isSubscription) {
      nmiParams.set("customer_vault", "add_customer");
    }

    console.log(`[PROCESS-PAYMENT] Calling NMI for order ${orderId}, amount $${total.toFixed(2)}${isSubscription ? " (subscription)" : ""}`);

    const nmiResponse = await fetch(NMI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: nmiParams.toString(),
    });

    const nmiText = await nmiResponse.text();
    const nmiResult = Object.fromEntries(new URLSearchParams(nmiText));

    console.log(`[PROCESS-PAYMENT] NMI response: response=${nmiResult.response}, responsetext=${nmiResult.responsetext}`);

    // NMI response codes: 1=Approved, 2=Declined, 3=Error
    if (nmiResult.response === "1") {
      // APPROVED
      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent_id: nmiResult.transactionid,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      // For subscriptions: save vault ID and create subscription record
      if (isSubscription && nmiResult.customer_vault_id) {
        const INTERVAL_MAP: Record<string, { days: number; label: string }> = {
          "2_weeks": { days: 14, label: "Every 2 Weeks" },
          "1_month": { days: 30, label: "Every Month" },
          "2_months": { days: 60, label: "Every 2 Months" },
          "3_months": { days: 90, label: "Every 3 Months" },
        };
        const interval = INTERVAL_MAP[subscription!.frequency] || INTERVAL_MAP["1_month"];
        const nextBilling = new Date(Date.now() + interval.days * 24 * 60 * 60 * 1000);

        // Upsert subscription in Supabase
        await supabase
          .from("subscriptions")
          .insert({
            user_id: resolvedUserId,
            product_handle: items[0]?.handle || "unknown",
            frequency: subscription!.frequency,
            status: "active",
            current_period_end: nextBilling.toISOString(),
            stripe_subscription_id: `nmi_vault_${nmiResult.customer_vault_id}`,
            stripe_price_id: null,
            discount_percent: 10,
          });

        console.log(`[PROCESS-PAYMENT] Subscription created: vault=${nmiResult.customer_vault_id}, frequency=${subscription!.frequency}, next_billing=${nextBilling.toISOString()}`);
      }

      // Create WooCommerce order
      try {
        const wooStoreUrl = (Deno.env.get("WOO_STORE_URL") || "").replace(/\/+$/, "");
        const wooKey = Deno.env.get("WOO_CONSUMER_KEY");
        const wooSecret = Deno.env.get("WOO_CONSUMER_SECRET");

        if (wooStoreUrl && wooKey && wooSecret) {
          // Look up WooCommerce product IDs
          const lineItems = [];
          for (const item of items) {
            let productId = item.woo_id;
            if (!productId) {
              const { data: prod } = await supabase
                .from("woo_products")
                .select("woo_id")
                .eq("handle", item.handle)
                .single();
              productId = prod?.woo_id;
            }
            if (productId) {
              lineItems.push({ product_id: productId, quantity: item.quantity });
            }
          }

          const wooOrder = {
            payment_method: "nmi",
            payment_method_title: "Credit Card",
            set_paid: true,
            billing: {
              first_name: shipping.first_name,
              last_name: shipping.last_name,
              email,
              address_1: shipping.address_1,
              address_2: shipping.address_2 || "",
              city: shipping.city,
              state: shipping.state,
              postcode: shipping.zip,
              country: shipping.country || "US",
            },
            shipping: {
              first_name: shipping.first_name,
              last_name: shipping.last_name,
              address_1: shipping.address_1,
              address_2: shipping.address_2 || "",
              city: shipping.city,
              state: shipping.state,
              postcode: shipping.zip,
              country: shipping.country || "US",
            },
            line_items: lineItems,
            shipping_lines:
              shippingCost > 0
                ? [{ method_title: "Flat Rate", method_id: "flat_rate", total: shippingCost.toFixed(2) }]
                : [{ method_title: "Free Shipping", method_id: "free_shipping", total: "0.00" }],
            meta_data: [
              { key: "_nmi_transaction_id", value: nmiResult.transactionid },
              { key: "_supabase_order_id", value: orderId },
            ],
          };

          const credentials = btoa(`${wooKey}:${wooSecret}`);
          const wcRes = await fetch(`${wooStoreUrl}/wp-json/wc/v3/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${credentials}`,
            },
            body: JSON.stringify(wooOrder),
          });

          if (wcRes.ok) {
            const wcData = await wcRes.json();
            await supabase
              .from("orders")
              .update({
                woo_order_id: wcData.id,
                status: "processing",
                updated_at: new Date().toISOString(),
              })
              .eq("id", orderId);
            console.log(`[PROCESS-PAYMENT] WooCommerce order #${wcData.id} created`);
          } else {
            console.error(`[PROCESS-PAYMENT] WC order failed: ${await wcRes.text()}`);
          }
        }
      } catch (wcErr) {
        console.error("[PROCESS-PAYMENT] WC order error (non-fatal):", wcErr);
      }

      return new Response(
        JSON.stringify({
          success: true,
          order_id: orderId,
          transaction_id: nmiResult.transactionid,
          payment_status: "approved",
          subscription: isSubscription ? {
            vault_id: nmiResult.customer_vault_id,
            frequency: subscription?.frequency,
          } : undefined,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else {
      // DECLINED or ERROR
      const declineMessage = nmiResult.responsetext || "Payment declined";
      await supabase
        .from("orders")
        .update({ status: "declined", updated_at: new Date().toISOString() })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({
          success: false,
          order_id: orderId,
          error: declineMessage,
          payment_status: nmiResult.response === "2" ? "declined" : "error",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[PROCESS-PAYMENT] Error:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
