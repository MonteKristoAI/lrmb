import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ChevronLeft, ShieldCheck, AlertTriangle, Check, Minus, Plus, FlaskConical, RefreshCw, Loader2 } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplianceBanner from "@/components/ComplianceBanner";
import { fetchProductByHandle, SHIPPING_POLICY, type LocalProduct } from "@/lib/productService";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";
import { useCartStore, FREQUENCY_LABELS, type SubscriptionFrequency } from "@/stores/cartStore";
import { toast } from "sonner";
import { COMPLIANCE_NOTICES } from "@/data/brandData";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedFlavorIdx, setSelectedFlavorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("1_month");
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) { setLoading(false); return; }
    fetchProductByHandle(handle).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Product not found</h1>
          <Link to="/shop"><Button>Back to Shop</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIdx];
  const basePrice = selectedVariant?.price ?? product.price;
  const discountPercent = 10;
  const subscriptionPrice = +(basePrice * (1 - discountPercent / 100)).toFixed(2);
  const price = isSubscription ? subscriptionPrice : basePrice;
  const categoryLabel = PRODUCT_CATEGORIES.find((c) => c.slug === product.category)?.label ?? product.category;

  // Build gallery images
  const galleryImages: string[] = [];
  const selectedFlavor = product.flavors?.[selectedFlavorIdx];
  const flavorImage = selectedFlavor?.image;

  // Main image: flavor image > productImage > packaging image
  const mainImage = flavorImage || product.productImage || product.image;
  if (mainImage) galleryImages.push(mainImage);

  // Add packaging if different from main
  if (product.image && product.image !== mainImage) galleryImages.push(product.image);
  // Add productImage if different from main and packaging
  if (product.productImage && product.productImage !== mainImage && product.productImage !== product.image) {
    galleryImages.push(product.productImage);
  }
  // Add secondary images
  if (product.secondaryImages) {
    product.secondaryImages.forEach((img) => {
      if (!galleryImages.includes(img)) galleryImages.push(img);
    });
  }

  const displayImage = galleryImages[activeThumb] || mainImage;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      handle: product.handle,
      title: product.title,
      brand: product.brand,
      variantId: isSubscription ? `${selectedVariant.id}-sub-${frequency}` : selectedVariant.id,
      variantLabel: isSubscription
        ? `${selectedVariant.label} · Subscribe & Save`
        : selectedVariant.label,
      price,
      quantity,
      image: product.image,
      isSubscription,
      frequency: isSubscription ? frequency : undefined,
    });
    toast.success(isSubscription ? "Subscription added to cart" : "Added to cart", {
      description: `${quantity}x ${product.title}`,
    });
    setQuantity(1);
  };

  // Reset active thumb when flavor changes
  const handleFlavorChange = (idx: number) => {
    setSelectedFlavorIdx(idx);
    setActiveThumb(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-80 text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image + Thumbnails */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                {displayImage ? (
                  <OptimizedImage src={displayImage} alt={product.title} wrapperClassName="w-full h-full rounded-2xl" aspectRatio="1/1" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground opacity-20" />
                  </div>
                )}
              </div>

              {/* Thumbnail gallery */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeThumb === i ? "border-primary" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <OptimizedImage src={img} alt={`${product.title} view ${i + 1}`} wrapperClassName="w-full h-full" aspectRatio="1/1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {categoryLabel}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  {product.brand}
                </span>
                {product.effects.map((e) => (
                  <span key={e} className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                    {e}
                  </span>
                ))}
              </div>

              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">{product.title}</h1>

              <div className="flex items-center gap-3 mb-4">
                <p className="text-2xl font-bold text-primary">${price.toFixed(2)}</p>
                {isSubscription && (
                  <p className="text-lg line-through text-muted-foreground">${basePrice.toFixed(2)}</p>
                )}
                {!isSubscription && product.comparePrice && (
                  <p className="text-lg line-through text-muted-foreground">${product.comparePrice.toFixed(2)}</p>
                )}
                {(isSubscription || product.comparePrice) && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Subscribe & Save Toggle */}
              <div className="mb-6 rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setIsSubscription(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    !isSubscription ? "bg-primary/5 border-b border-primary/20" : "bg-card border-b border-border"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    !isSubscription ? "border-primary" : "border-muted-foreground/40"
                  }`}>
                    {!isSubscription && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">One-Time Purchase</span>
                    <span className="ml-2 text-sm text-muted-foreground">${basePrice.toFixed(2)}</span>
                  </div>
                </button>
                <button
                  onClick={() => setIsSubscription(true)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isSubscription ? "bg-primary/5" : "bg-card"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSubscription ? "border-primary" : "border-muted-foreground/40"
                  }`}>
                    {isSubscription && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Subscribe & Save</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                        {discountPercent}% OFF
                      </span>
                    </div>
                    <span className="text-sm text-primary font-semibold">${subscriptionPrice.toFixed(2)}</span>
                  </div>
                </button>

                {/* Frequency selector */}
                {isSubscription && (
                  <div className="px-4 py-3 bg-muted/50 border-t border-border">
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Delivery Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}
                      className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-card text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {(Object.entries(FREQUENCY_LABELS) as [SubscriptionFrequency, string][]).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <p className="leading-relaxed mb-8 text-muted-foreground">{product.description}</p>

              {/* Flavor selector */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block text-foreground">Flavor</label>
                  <select
                    value={selectedFlavorIdx}
                    onChange={(e) => handleFlavorChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-card text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {product.flavors.map((f, i) => (
                      <option key={f.label} value={i}>{f.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Variant selector */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block text-foreground">Options</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantIdx(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                          selectedVariantIdx === i
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {v.label} — ${v.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included (bundles) */}
              {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                <div className="mb-6 rounded-xl p-4 bg-muted border border-border">
                  <h3 className="text-sm font-semibold mb-2 text-foreground">What's Included</h3>
                  <ul className="space-y-2">
                    {product.whatsIncluded.map((item, i) => {
                      const [name, ...rest] = item.split(" – ");
                      return (
                        <li key={i} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{name}</span>
                          {rest.length > 0 && <span> – {rest.join(" – ")}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Highlights */}
              {product.highlights.length > 0 && (
                <div className="mb-6 rounded-xl p-4 bg-muted border border-border">
                  <h3 className="text-sm font-semibold mb-2 text-foreground">Highlights</h3>
                  <ul className="space-y-1.5">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 hover:bg-muted transition-colors text-foreground"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 text-sm font-semibold min-w-[3rem] text-center text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-3 hover:bg-muted transition-colors text-foreground"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 gap-2 text-base py-6"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart — ${(price * quantity).toFixed(2)}
                </Button>
              </div>

              {/* Shipping restriction notice */}
              {product.thcRestricted && (
                <div className="rounded-xl p-4 mb-4 bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Shipping Restrictions Apply
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This product contains THC and cannot be shipped to all states. It ships only to: {SHIPPING_POLICY.allowedStates.join(", ")}.
                  </p>
                </div>
              )}

              {/* Shipping info */}
              <div className="rounded-xl p-4 mb-4 bg-muted border border-border text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Shipping</p>
                <p>${SHIPPING_POLICY.flatRate.toFixed(2)} flat rate · Free on orders over ${SHIPPING_POLICY.freeShippingThreshold}</p>
              </div>

              {/* Lab Report section */}
              <div className="rounded-xl p-5 mb-4 bg-muted border border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <FlaskConical className="w-4 h-4 text-primary" />
                  Lab Report
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground mb-3">
                  Every batch of this product is independently tested by accredited third-party laboratories. The Certificate of Analysis (COA) confirms potency, purity, and safety.
                </p>
                {product.coaPdf ? (
                  <a href={product.coaPdf} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="default" size="default" className="w-full gap-2 text-sm font-semibold">
                      <FlaskConical className="w-4 h-4" />
                      View Lab Report (COA)
                    </Button>
                  </a>
                ) : (
                  <Link to="/lab-results">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <FlaskConical className="w-3.5 h-3.5" />
                      View All Lab Reports
                    </Button>
                  </Link>
                )}
              </div>

              {/* COA / Compliance */}
              <div className="rounded-xl p-5 space-y-3 bg-muted border border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Lab Tested & Compliant
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{COMPLIANCE_NOTICES.coa}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{COMPLIANCE_NOTICES.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ComplianceBanner />
      <Footer />
    </div>
  );
}
