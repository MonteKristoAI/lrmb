import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import TrustBar from "@/components/TrustBar";
import { products, dosingProtocol } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Repeat, Beaker, Leaf, Shield, FileCheck, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

const Product = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const { addItem } = useCart();

  if (!product) {
    return (
      <Layout>
        <div className="pt-28 pb-24 container text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/shop"><Button>Back to Shop</Button></Link>
        </div>
      </Layout>
    );
  }

  const displayPrice = isSubscription ? product.subscriptionPrice : product.price;
  const related = products.filter((p) => p.id !== id && !p.isBundle).slice(0, 4);
  const isGummy = !product.isTincture && !product.isBundle;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: displayPrice, image: product.image }, qty);
    toast.success(`${product.name} added to cart`);
    setQty(1);
  };

  return (
    <Layout>
      <section className="pt-28 pb-24">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden aspect-square relative group">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {product.badge && (
                <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary/70">{product.zone}</span>
              <h1 className="text-3xl md:text-5xl font-medium">{product.name}</h1>
              {product.subtitle && (
                <p className="text-lg text-foreground/50 font-heading italic">{product.subtitle}</p>
              )}

              {/* Price + subscription */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary font-heading">${displayPrice.toFixed(2)}</span>
                  {isSubscription && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-primary font-medium">Save 25%</span>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSubscription(false)}
                    className={`flex-1 py-3.5 px-4 border text-sm transition-all duration-300 rounded-sm ${
                      !isSubscription
                        ? "border-primary bg-primary/15 text-primary font-medium"
                        : "border-foreground/20 text-foreground/60 hover:border-foreground/30 hover:text-foreground/80"
                    }`}
                  >
                    One-time purchase
                  </button>
                  <button
                    onClick={() => setIsSubscription(true)}
                    className={`flex-1 py-3.5 px-4 border text-sm transition-all duration-300 flex items-center justify-center gap-2 rounded-sm ${
                      isSubscription
                        ? "border-primary bg-primary/15 text-primary font-medium"
                        : "border-foreground/20 text-foreground/60 hover:border-foreground/30 hover:text-foreground/80"
                    }`}
                  >
                    <Repeat size={14} />
                    Subscribe & Save 25%
                  </button>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2">
                {product.benefits.map((b) => (
                  <span key={b} className="px-3.5 py-1.5 border border-primary/25 bg-primary/8 text-[11px] text-primary/90 font-medium tracking-wide rounded-sm">
                    {b}
                  </span>
                ))}
              </div>

              {/* Extract Specifications */}
              <div className="glass-card rounded-xl p-5 space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Extract Specifications</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mushroom</span>
                    <p className="text-foreground font-medium italic">{product.mushroom}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Extract Ratio</span>
                    <p className="text-primary font-bold">{product.extractRatio}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Active Equivalent</span>
                    <p className="text-foreground font-medium">{product.activeEquivalent}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target Biomarker</span>
                    <p className="text-foreground font-medium">{product.targetBiomarker}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Serving Size</span>
                    <p className="text-foreground font-medium">{product.servingSize}</p>
                  </div>
                </div>
              </div>

              {/* Add to cart */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center border border-border rounded-xl">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="px-5 text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <Button size="lg" className="flex-1 gap-2 text-sm font-semibold" onClick={handleAddToCart}>
                  <ShoppingCart size={18} />
                  Add to Cart - ${(displayPrice * qty).toFixed(2)}
                </Button>
              </div>

              {/* Trust signals */}
              <div className="pt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2.5"><Leaf size={14} className="text-primary/60" /><span>100% organic fruiting body - no grain fillers</span></div>
                <div className="flex items-center gap-2.5"><Beaker size={14} className="text-primary/60" /><span>40:1 ultrasonic nano-extraction, 95%+ bioavailability</span></div>
                <div className="flex items-center gap-2.5"><Shield size={14} className="text-primary/60" /><span>Third-party lab tested, batch-level COA available</span></div>
                <div className="flex items-center gap-2.5"><FileCheck size={14} className="text-primary/60" /><span>Free shipping on orders over $50</span></div>
              </div>
            </div>
          </div>

          {/* Dosing Protocol - only for gummies */}
          {isGummy && (
            <div className="mt-20 rounded-2xl border border-border bg-card p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading">The Protocol</h3>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Suggested Use</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dosingProtocol.map((dose) => (
                  <div key={dose.name} className="rounded-xl border border-border bg-background p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{dose.name}</span>
                      <span className="text-xs text-primary font-mono">{dose.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{dose.instruction}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/60 mt-6">
                Clinical advisory: Maintain in a cool, dry environment (below 75F). Keep away from direct sunlight to preserve nano-stability.
              </p>
            </div>
          )}

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <TrustBar />
    </Layout>
  );
};

export default Product;
