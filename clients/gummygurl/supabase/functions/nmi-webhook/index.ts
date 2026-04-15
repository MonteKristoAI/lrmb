import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // NMI sends webhooks as form-encoded POST
    const body = await req.text();
    const params = Object.fromEntries(new URLSearchParams(body));

    console.log(`[NMI-WEBHOOK] Received: type=${params.type || params.event_type}, transaction_id=${params.transaction_id || params.transactionid}`);

    const transactionId = params.transaction_id || params.transactionid;
    const orderId = params.orderid;
    const action = params.action || params.type || params.event_type || "";
    const condition = params.condition || "";

    if (!transactionId && !orderId) {
      console.log("[NMI-WEBHOOK] No transaction_id or orderid, skipping");
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Find order by transaction ID or order ID
    let order;
    if (orderId) {
      const { data } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .maybeSingle();
      order = data;
    }

    if (!order && transactionId) {
      const { data } = await supabase
        .from("orders")
        .select("id, status")
        .eq("stripe_payment_intent_id", transactionId) // field reused for NMI transaction ID
        .maybeSingle();
      order = data;
    }

    if (!order) {
      console.log(`[NMI-WEBHOOK] No matching order found for transaction=${transactionId}, orderid=${orderId}`);
      return new Response(JSON.stringify({ received: true, no_match: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update based on condition
    if (condition === "complete" || condition === "pendingsettlement" || action === "sale") {
      if (order.status === "pending" || order.status === "pending_payment") {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent_id: transactionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);
        console.log(`[NMI-WEBHOOK] Order ${order.id} marked as paid`);
      }
    } else if (condition === "failed" || condition === "abandoned") {
      if (order.status !== "paid" && order.status !== "processing" && order.status !== "completed") {
        await supabase
          .from("orders")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("id", order.id);
        console.log(`[NMI-WEBHOOK] Order ${order.id} cancelled`);
      }
    }

    return new Response(JSON.stringify({ received: true, order_id: order.id }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[NMI-WEBHOOK] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { "Content-Type": "application/json" },
      status: 200, // Always return 200 to NMI to prevent retries
    });
  }
});
