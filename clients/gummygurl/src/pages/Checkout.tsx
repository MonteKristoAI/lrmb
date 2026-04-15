import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Truck, ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SHIPPING_POLICY } from "@/lib/productService";
import { trackStartedCheckout, trackPlacedOrder } from "@/lib/klaviyo";
import { toast } from "sonner";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois",
  "Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts",
  "Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota",
  "Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming",
];

const SHIPPING_FLAT_RATE = 8.0;
const FREE_SHIPPING_THRESHOLD = 99.0;

declare global {
  interface Window {
    CollectJS?: {
      configure: (config: any) => void;
      startPaymentRequest: () => void;
    };
  }
}

type CheckoutStep = "form" | "processing" | "success" | "error";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>("form");
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [collectJsLoaded, setCollectJsLoaded] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Discount code
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<{ code: string; percent: number } | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Subscription detection
  const subscriptionItems = items.filter((i) => i.isSubscription);
  const isSubscriptionCheckout = subscriptionItems.length > 0;
  const subscriptionFrequency = subscriptionItems[0]?.frequency;

  // Subscription discount (10% off)
  const subscriptionDiscount = isSubscriptionCheckout ? 0.10 : 0;

  // Totals
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = isSubscriptionCheckout ? rawSubtotal * (1 - subscriptionDiscount) : rawSubtotal;
  const discountAmount = discountApplied ? subtotal * (discountApplied.percent / 100) : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotalAfterDiscount + shipping;

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    try {
      // Check WooCommerce coupon via woo-proxy
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/woo-proxy?path=/coupons&code=${encodeURIComponent(discountCode.trim())}`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      const coupons = await res.json();
      if (Array.isArray(coupons) && coupons.length > 0) {
        const coupon = coupons[0];
        if (coupon.discount_type === "percent") {
          setDiscountApplied({ code: coupon.code, percent: parseFloat(coupon.amount) });
          toast.success(`Discount applied: ${coupon.amount}% off`);
        } else if (coupon.discount_type === "fixed_cart") {
          // Fixed amount - convert to percent equivalent for simplicity
          const pct = Math.min((parseFloat(coupon.amount) / subtotal) * 100, 100);
          setDiscountApplied({ code: coupon.code, percent: pct });
          toast.success(`Discount applied: $${coupon.amount} off`);
        } else {
          setDiscountApplied({ code: coupon.code, percent: parseFloat(coupon.amount) });
          toast.success("Discount applied!");
        }
      } else {
        toast.error("Invalid discount code");
      }
    } catch {
      toast.error("Could not verify discount code");
    } finally {
      setDiscountLoading(false);
    }
  };

  // Check shipping restrictions
  const isRestrictedState = SHIPPING_POLICY.restrictedStates.includes(state);
  const hasThcaFlower = items.some((i) => i.handle?.includes("thca-flower"));
  const isThcaRestricted = hasThcaFlower && (SHIPPING_POLICY as any).thcaFlowerRestrictedStates?.includes(state);
  const isBlocked = isRestrictedState || isThcaRestricted;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step === "form") {
      navigate("/shop");
    }
  }, [items, step, navigate]);

  // Load Collect.js
  useEffect(() => {
    const tokenKey = import.meta.env.VITE_NMI_TOKENIZATION_KEY;
    if (!tokenKey || tokenKey === "PLACEHOLDER") {
      console.warn("[Checkout] NMI tokenization key not configured");
      return;
    }

    const existing = document.querySelector('script[src*="Collect.js"]');
    if (existing) {
      setCollectJsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://secure.networkmerchants.com/token/Collect.js";
    script.dataset.tokenizationKey = tokenKey;
    script.dataset.variant = "inline";
    script.async = true;

    script.onload = () => {
      window.CollectJS?.configure({
        variant: "inline",
        styleSniffer: false,
        callback: (response: any) => {
          setPaymentToken(response.token);
        },
        fieldsAvailableCallback: () => {
          setCollectJsLoaded(true);
        },
        fields: {
          ccnumber: {
            selector: "#nmi-card-number",
            title: "Card Number",
            placeholder: "0000 0000 0000 0000",
          },
          ccexp: {
            selector: "#nmi-card-exp",
            title: "Expiration Date",
            placeholder: "MM / YY",
          },
          cvv: {
            selector: "#nmi-card-cvv",
            title: "CVV",
            placeholder: "CVV",
          },
        },
      });
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove - Collect.js should persist
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validate form
    if (!email || !firstName || !lastName || !address1 || !city || !state || !zip) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isBlocked) {
      toast.error(
        isThcaRestricted
          ? "THCA flower cannot be shipped to your state"
          : "Sorry, we cannot ship THC products to your state",
        { description: "Please check our shipping policy for details." }
      );
      return;
    }

    const tokenKey = import.meta.env.VITE_NMI_TOKENIZATION_KEY;
    const isNmiConfigured = tokenKey && tokenKey !== "PLACEHOLDER";

    if (isNmiConfigured && !paymentToken) {
      // Trigger Collect.js tokenization
      if (window.CollectJS) {
        window.CollectJS.startPaymentRequest();
        // Token will be set via callback, then we re-submit
        return;
      }
      toast.error("Payment system not ready. Please wait a moment and try again.");
      return;
    }

    setStep("processing");

    // Track Klaviyo "Started Checkout"
    if (email) {
      trackStartedCheckout(email, items.map(i => ({ title: i.title, price: i.price, quantity: i.quantity })), total);
    }

    try {
      const headers: Record<string, string> = {};
      const session = (await supabase.auth.getSession()).data.session;
      if (session) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const { data, error } = await supabase.functions.invoke("process-payment", {
        headers,
        body: {
          payment_token: paymentToken || null,
          email,
          shipping: {
            first_name: firstName,
            last_name: lastName,
            address_1: address1,
            address_2: address2,
            city,
            state,
            zip,
            country: "US",
          },
          items: items.map((item) => ({
            handle: item.handle,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          user_id: session?.user?.id || undefined,
          discount: discountApplied ? { code: discountApplied.code, percent: discountApplied.percent } : undefined,
          subscription: isSubscriptionCheckout ? { frequency: subscriptionFrequency } : undefined,
        },
      });

      if (error) throw error;

      if (data?.success) {
        setOrderId(data.order_id);
        setStep("success");
        clearCart();
        // Track Klaviyo "Placed Order" event
        trackPlacedOrder(email, data.order_id, items.map(i => ({ title: i.title, price: i.price, quantity: i.quantity })), total);
      } else {
        setErrorMessage(data?.error || "Payment failed. Please try again.");
        setStep("error");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStep("error");
    }
  }, [email, firstName, lastName, address1, address2, city, state, zip, paymentToken, items, isBlocked, isThcaRestricted, clearCart]);

  // Auto-submit when token arrives from Collect.js
  useEffect(() => {
    if (paymentToken && step === "form") {
      handleSubmit();
    }
  }, [paymentToken, step, handleSubmit]);

  if (step === "success") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-foreground mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. You'll receive a confirmation email at <strong>{email}</strong>.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-6">Order ID: {orderId}</p>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/account")}>View Orders</Button>
              <Button variant="outline" onClick={() => navigate("/shop")}>Continue Shopping</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-foreground mb-3">Payment Failed</h1>
            <p className="text-muted-foreground mb-6">{errorMessage}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => { setStep("form"); setPaymentToken(null); setErrorMessage(""); }}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/shop")}>Back to Shop</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to cart
          </button>

          <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Contact */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Contact</h2>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-border"
                    id="newsletter-optin"
                  />
                  <span className="text-sm text-muted-foreground">
                    Email me with news, deals, and product drops
                  </span>
                </label>
              </div>

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  <div className="col-span-2">
                    <Input
                      placeholder="Street address"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="Apartment, suite, etc. (optional)"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="ZIP code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                  />
                  <Input value="United States" disabled />
                </div>

                {isBlocked && state && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {isThcaRestricted ? `THCA flower cannot be shipped to ${state}.` : `THC products cannot be shipped to ${state}. Some items in your cart may be restricted.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Discount Code */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Discount Code</h2>
                {discountApplied ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <span className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                      {discountApplied.code} - {discountApplied.percent}% off
                    </span>
                    <button
                      onClick={() => { setDiscountApplied(null); setDiscountCode(""); }}
                      className="text-xs text-emerald-600 hover:text-emerald-800 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyDiscount())}
                    />
                    <Button
                      variant="outline"
                      onClick={applyDiscount}
                      disabled={discountLoading || !discountCode.trim()}
                    >
                      {discountLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment</h2>

                {!import.meta.env.VITE_NMI_TOKENIZATION_KEY || import.meta.env.VITE_NMI_TOKENIZATION_KEY === "PLACEHOLDER" ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Payment processing is being configured. You can place orders but payment will be processed later.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Card Number</label>
                      <div id="nmi-card-number" className="h-10 px-3 border border-border rounded-md bg-background" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Expiry</label>
                        <div id="nmi-card-exp" className="h-10 px-3 border border-border rounded-md bg-background" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">CVV</label>
                        <div id="nmi-card-cvv" className="h-10 px-3 border border-border rounded-md bg-background" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 text-[11px] text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={step === "processing" || isBlocked}
                size="lg"
                className="w-full text-base font-semibold gap-2"
              >
                {step === "processing" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order - ${total.toFixed(2)}
                  </>
                )}
              </Button>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 bg-muted-foreground/10 rounded" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {isSubscriptionCheckout && (
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg mb-3">
                    <p className="text-sm font-medium text-primary">Subscribe & Save 10%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recurring delivery: {subscriptionFrequency === "2_weeks" ? "Every 2 weeks" : subscriptionFrequency === "1_month" ? "Monthly" : subscriptionFrequency === "2_months" ? "Every 2 months" : "Every 3 months"}. Cancel anytime from your account.
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${rawSubtotal.toFixed(2)}</span>
                  </div>
                  {isSubscriptionCheckout && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Subscribe & Save (10%)</span>
                      <span>-${(rawSubtotal * subscriptionDiscount).toFixed(2)}</span>
                    </div>
                  )}
                  {discountApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({discountApplied.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" />
                      Shipping
                    </span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-medium">FREE</span>
                    ) : (
                      <span>${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-[11px] text-muted-foreground mt-3">
                    Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Farm Bill compliant - all products &lt;0.3% THC</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    <span>Secure encrypted checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
