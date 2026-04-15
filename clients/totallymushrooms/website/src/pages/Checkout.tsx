import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, Lock, CreditCard, Truck } from "lucide-react";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <Layout>
        <section className="pt-28 pb-24">
          <div className="container max-w-lg text-center space-y-6 py-20">
            <CheckCircle2 size={64} className="mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="text-muted-foreground leading-relaxed">
              Your order #TM-{Math.floor(10000 + Math.random() * 90000)} has been placed successfully. You'll receive a confirmation email shortly.
            </p>
            <div className="rounded-xl border border-border bg-card p-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated delivery</span>
                <span className="font-medium text-foreground">3–5 business days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order total</span>
                <span className="font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
              <Button variant="outline" onClick={() => navigate("/")} className="border-border hover:bg-secondary">
                Back to Home
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <section className="pt-28 pb-24">
          <div className="container max-w-lg text-center space-y-6 py-20">
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <Button onClick={() => navigate("/shop")}>Browse Products</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-24">
        <div className="container">
          <h1 className="text-3xl font-bold mb-10">Checkout</h1>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left — Form */}
            <div className="lg:col-span-3 space-y-10">
              {/* Contact */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
                  Contact
                </h2>
                <Input type="email" placeholder="Email address" required className="bg-card border-border" />
              </div>

              {/* Shipping */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="First name" required className="bg-card border-border" />
                  <Input placeholder="Last name" required className="bg-card border-border" />
                </div>
                <Input placeholder="Address" required className="bg-card border-border" />
                <Input placeholder="Apartment, suite, etc. (optional)" className="bg-card border-border" />
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="City" required className="bg-card border-border" />
                  <Input placeholder="State" required className="bg-card border-border" />
                  <Input placeholder="ZIP code" required className="bg-card border-border" />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Truck size={18} className="text-primary" />
                  Shipping Method
                </h2>
                <div className="rounded-xl border border-primary bg-card p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">Standard Shipping (3–5 days)</p>
                    <p className="text-xs text-muted-foreground">
                      {shipping === 0 ? "Free on orders over $50" : "Free on orders over $50"}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>
                  Payment
                </h2>
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CreditCard size={16} />
                    <span>Credit or Debit Card</span>
                    <Lock size={12} className="ml-auto" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <Input placeholder="Card number" required className="bg-background border-border" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM / YY" required className="bg-background border-border" />
                    <Input placeholder="CVV" required className="bg-background border-border" />
                  </div>
                  <Input placeholder="Name on card" required className="bg-background border-border" />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full text-base font-semibold">
                Complete Order — ${total.toFixed(2)}
              </Button>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6 space-y-6 sticky top-24">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-sm text-primary font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex gap-2">🔒 <span>SSL encrypted checkout</span></div>
                  <div className="flex gap-2">📦 <span>Free shipping on orders $50+</span></div>
                  <div className="flex gap-2">↩️ <span>30-day money-back guarantee</span></div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
