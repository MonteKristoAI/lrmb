import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Gift } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Footer from "@/components/Footer";

const isGiftCard = (id: string) => id.startsWith("gift-card-");

const Checkout = () => {
  const { items, subtotal, removeItem, updateQty } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();
  const { items: cartItems } = useCart();

  const handlePlaceOrder = () => {
    setConfirmed(true);
    // Clear cart after short delay
    setTimeout(() => {
      cartItems.forEach((i) => removeItem(i.id));
    }, 300);
  };

  if (confirmed) {
    return (
      <>
        <main className="bg-background pt-28 min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <CheckCircle size={48} className="mx-auto text-foreground/40 mb-6" />
            <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
              Order Confirmed
            </h1>
            <p className="mt-2 font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">
              Demo only — no payment collected
            </p>
            <p className="mt-6 font-body text-sm text-muted-foreground leading-relaxed">
              Thank you for exploring! This was a demo checkout. In a real store, you'd receive a confirmation email.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-8 bg-foreground text-primary-foreground px-8 py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors"
            >
              Continue Shopping
            </button>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="bg-background pt-28 md:pt-32 pb-20 min-h-screen">
        <div className="mx-auto max-w-3xl px-6 md:px-16">
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground text-center">
            Checkout
          </h1>
          <p className="mt-2 text-center font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">
            Demo — no payment will be collected
          </p>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-body text-sm text-muted-foreground">Your cart is empty.</p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-6 bg-foreground text-primary-foreground px-8 py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Shipping Form */}
              <div className="space-y-6">
                <h2 className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">
                  Shipping Details
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", placeholder: "Jane Doe" },
                    { label: "Email", placeholder: "jane@example.com", type: "email" },
                    { label: "Address", placeholder: "123 Main St" },
                    { label: "City", placeholder: "Los Angeles" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block font-body text-xs text-muted-foreground mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-xs text-muted-foreground mb-1.5">State</label>
                      <input
                        placeholder="CA"
                        className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs text-muted-foreground mb-1.5">ZIP</label>
                      <input
                        placeholder="90001"
                        className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 border border-border p-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {isGiftCard(item.id) ? (
                        <div className="w-14 h-16 flex items-center justify-center bg-foreground/5 border border-border flex-shrink-0">
                          <Gift size={18} className="text-foreground/60" />
                        </div>
                      ) : (
                        <img src={item.image} alt={item.name} className="w-14 h-16 object-cover border border-border flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body text-sm text-foreground truncate">{item.name}</h4>
                        <p className="font-body text-xs text-muted-foreground truncate">
                          {isGiftCard(item.id) ? "Digital delivery" : `Qty: ${item.qty}`}
                        </p>
                      </div>
                      <p className="font-body text-sm text-foreground">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="font-body text-xs tracking-ultra-wide uppercase text-muted-foreground">Subtotal</span>
                      <span className="font-body text-base font-medium text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="font-body text-xs text-muted-foreground">Shipping</span>
                      <span className="font-body text-xs text-muted-foreground">Demo</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full mt-4 bg-foreground text-primary-foreground py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors"
                  >
                    Place Order (Demo)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
