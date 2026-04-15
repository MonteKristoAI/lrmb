import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingCart, Eye, SlidersHorizontal, ChevronDown, ShieldCheck, FileText, Loader2 } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplianceBanner from "@/components/ComplianceBanner";
import type { LocalProduct, EffectTag } from "@/lib/productService";
import { useProducts } from "@/hooks/useProducts";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";
import { useCartStore } from "@/stores/cartStore";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
] as const;

const categoryColors: Record<string, string> = {
  "thc-edibles": "hsl(var(--primary) / 0.1)",
  "mushroom-products": "hsl(280 60% 55% / 0.1)",
  "health-wellness": "hsl(40 90% 50% / 0.1)",
  "pet-wellness": "hsl(200 80% 50% / 0.1)",
  "thca-flower": "hsl(140 60% 40% / 0.1)",
  "bundles": "hsl(320 60% 50% / 0.1)",
};
const categoryTextColors: Record<string, string> = {
  "thc-edibles": "hsl(var(--primary))",
  "mushroom-products": "hsl(280 60% 45%)",
  "health-wellness": "hsl(40 80% 40%)",
  "pet-wellness": "hsl(200 70% 40%)",
  "thca-flower": "hsl(140 60% 35%)",
  "bundles": "hsl(320 60% 40%)",
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<string>(() => searchParams.get("category") || "All");
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [effect, setEffect] = useState<string>(() => searchParams.get("effect") || "All Effects");
  const [brand, setBrand] = useState<string>("All");

  const toggleCategory = (val: string) => {
    if (val === "All") { setCategory("All"); setSubcategory(null); return; }
    setCategory(prev => prev === val ? "All" : val);
    setSubcategory(null);
  };
  const toggleEffect = (val: string) => {
    if (val === "All Effects") { setEffect("All Effects"); return; }
    setEffect(prev => prev === val ? "All Effects" : val);
  };
  const toggleBrand = (val: string) => {
    if (val === "All") { setBrand("All"); return; }
    setBrand(prev => prev === val ? "All" : val);
  };
  const [sort, setSort] = useState("featured");
  const [quickView, setQuickView] = useState<LocalProduct | null>(null);
  const [addingHandle, setAddingHandle] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { ref, isVisible } = useScrollAnimation();

  // Sync URL search params to filter state on navigation
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlEffect = searchParams.get("effect");
    if (urlCategory) setCategory(urlCategory);
    if (urlEffect) setEffect(urlEffect);
  }, [searchParams]);

  // Products from Supabase (woo_products) with fallback to hardcoded
  const { products: allProducts, overrides, brands: BRANDS, loading: productsLoading } = useProducts();

  const ALL_EFFECTS: EffectTag[] = ["Unwind", "Social", "Sleep", "Relief", "Recovery", "Uplift", "Clarity", "Intimacy", "Performance"];

  const activeCategory = PRODUCT_CATEGORIES.find((c) => c.slug === category);

  const getProductStatus = useCallback((handle: string) => {
    return overrides[handle]?.status || "active";
  }, [overrides]);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (p.hidden) return false;
      const status = getProductStatus(p.handle);
      return status !== "draft";
    });
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    if (subcategory) {
      list = list.filter((p) => p.subcategory === subcategory);
    }
    if (effect !== "All Effects") {
      list = list.filter((p) => p.effects.includes(effect as EffectTag));
    }
    if (brand !== "All") {
      list = list.filter((p) => p.brand === brand);
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [category, subcategory, effect, brand, sort, allProducts, overrides, getProductStatus]);

  const handleAddToCart = (product: LocalProduct) => {
    const variant = product.variants[0];
    if (!variant) return;
    setAddingHandle(product.handle);
    addItem({
      handle: product.handle,
      title: product.title,
      brand: product.brand,
      variantId: variant.id,
      variantLabel: variant.label,
      price: variant.price,
      quantity: 1,
      image: product.image,
    });
    toast.success("Added to cart!", { description: product.title });
    setTimeout(() => setAddingHandle(null), 400);
  };

  const getCategoryLabel = (slug: string) => PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero */}
          <div ref={ref} className={`text-center max-w-2xl mx-auto mb-12 scroll-fade ${isVisible ? "visible" : ""}`}>
            <div className="w-12 h-0.5 mb-6 rounded-full mx-auto bg-primary" />
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-foreground">Shop All Products</h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Premium hemp-derived edibles, mushroom products, wellness supplements, and pet CBD — all third-party lab tested.
            </p>
          </div>

          {/* Filters */}
          <div className="rounded-2xl p-5 lg:p-6 mb-6 bg-muted/50 border border-border space-y-3">
            {/* Row 1: Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 mr-1 shrink-0 text-muted-foreground" />
              <button
                onClick={() => toggleCategory("All")}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
                  category === "All" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                All
              </button>
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => toggleCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
                    category === cat.slug ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Row 2: Effects */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
              <button
                onClick={() => toggleEffect("All Effects")}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
                  effect === "All Effects" ? "bg-primary/10 text-primary border-primary/30 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                All Effects
              </button>
              {ALL_EFFECTS.map((eff) => (
                <button
                  key={eff}
                  onClick={() => toggleEffect(eff)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
                    effect === eff ? "bg-primary/10 text-primary border-primary/30 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {eff}
                </button>
              ))}
            </div>

            {/* Row 3: Brands + Subcategories + Sort */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
              <button
                onClick={() => toggleBrand("All")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                  brand === "All" ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border hover:border-accent/50"
                }`}
              >
                All Brands
              </button>
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                    brand === b ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border hover:border-accent/50"
                  }`}
                >
                  {b}
                </button>
              ))}

              {/* Subcategory chips */}
              {activeCategory && activeCategory.subcategories.length > 0 && (
                <>
                  <div className="w-px h-5 bg-border mx-1" />
                  <button
                    onClick={() => setSubcategory(null)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                      !subcategory ? "bg-primary/10 text-primary border-primary/30" : "bg-card text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    All {activeCategory.label}
                  </button>
                  {activeCategory.subcategories.map((sub) => (
                    <button
                      key={sub.slug}
                      onClick={() => setSubcategory(sub.slug)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                        subcategory === sub.slug ? "bg-primary/10 text-primary border-primary/30" : "bg-card text-muted-foreground border-border hover:border-primary/30"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </>
              )}

              {/* Sort dropdown pushed right */}
              <div className="ml-auto relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-medium cursor-pointer bg-card text-muted-foreground border border-border hover:border-primary/30 transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          <p className="text-xs mb-6 text-muted-foreground">
            Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="rounded-2xl p-12 max-w-md mx-auto bg-muted border border-border">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No products match your filters.</p>
                <button
                  onClick={() => { setCategory("All"); setEffect("All Effects"); setBrand("All"); setSubcategory(null); }}
                  className="text-sm mt-3 underline text-primary"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => {
                const isAdding = addingHandle === product.handle;
                const status = getProductStatus(product.handle);
                const isUnavailable = status === "out_of_stock" || status === "restock_coming_soon";

                return (
                  <div
                    key={product.handle}
                    className={`rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col hover:-translate-y-1.5 hover:shadow-elevated bg-card border border-border ${isUnavailable ? "opacity-80" : ""}`}
                  >
                    <Link to={`/product/${product.handle}`} className="block relative">
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        {product.image ? (
                          <>
                            <OptimizedImage
                              src={product.image}
                              alt={product.title}
                              wrapperClassName="w-full h-full"
                              aspectRatio="1/1"
                              className={`transition-all duration-300 group-hover:scale-105 ${product.productImage && product.productImage !== product.image ? "group-hover:opacity-0" : ""}`}
                            />
                            {product.productImage && product.productImage !== product.image && (
                              <div className="absolute inset-0 pointer-events-none">
                                <OptimizedImage
                                  src={product.productImage}
                                  alt={`${product.title} - hover`}
                                  wrapperClassName="w-full h-full !bg-transparent"
                                  aspectRatio="1/1"
                                  className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                            <ShoppingCart className="w-12 h-12 opacity-20 text-muted-foreground" />
                          </div>
                        )}
                        {isUnavailable && (
                          <div className="absolute inset-0 bg-background/20 flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow-lg">
                              {status === "restock_coming_soon" ? "Restock Coming Soon" : "Out of Stock"}
                            </span>
                          </div>
                        )}
                      </div>
                      <span
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: categoryColors[product.category] || "hsl(var(--primary) / 0.1)",
                          color: categoryTextColors[product.category] || "hsl(var(--primary))",
                        }}
                      >
                        {getCategoryLabel(product.category)}
                      </span>
                      {product.comparePrice && !isUnavailable && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground">
                          10% OFF
                        </span>
                      )}
                      {product.brand && (
                        <span className="absolute top-3 right-12 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-card/80 backdrop-blur-sm text-muted-foreground border border-border">
                          {product.brand}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); setQuickView(product); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-card/80 backdrop-blur-sm shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-foreground" />
                      </button>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col">
                      <Link to={`/product/${product.handle}`}>
                        <h3 className="font-semibold mb-1.5 transition-colors group-hover:text-primary line-clamp-1 text-foreground">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-[13px] mb-2 line-clamp-2 flex-1 leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                      {product.effects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.effects.map((e) => (
                            <span key={e} className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                              {e}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Lab Tested</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-border" />
                        <span>COA</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-foreground">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm line-through text-muted-foreground">
                              ${product.comparePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {isUnavailable ? (
                          <span className="text-xs font-semibold text-amber-600">
                            {status === "restock_coming_soon" ? "Back Soon" : "Sold Out"}
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={isAdding}
                            className="gap-1.5 text-xs font-semibold transition-all duration-300 hover:shadow-lg"
                          >
                            {isAdding ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compliance */}
          <div className="mt-16 rounded-2xl p-6 lg:p-8 text-center bg-muted border border-border">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Compliance & Transparency</span>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl mx-auto mb-4 text-muted-foreground">
              All hemp-derived products are Farm Bill compliant and contain less than 0.3% THC by dry weight. These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease. Must be 21+ to purchase. Ships only where legally permitted.
            </p>
            <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" />COA Available</span>
              <span>•</span><span>21+ Only</span>
              <span>•</span><span>State Restrictions Apply</span>
            </div>
          </div>
        </div>
      </main>

      {/* Quick View */}
      <Dialog open={!!quickView} onOpenChange={() => setQuickView(null)}>
        <DialogContent className="max-w-lg bg-card border border-border">
          {quickView && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">{quickView.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden aspect-square bg-muted flex items-center justify-center">
                  {quickView.image ? (
                    <OptimizedImage src={quickView.image} alt={quickView.title} wrapperClassName="w-full h-full" aspectRatio="1/1" />
                  ) : (
                    <ShoppingCart className="w-16 h-16 text-muted-foreground opacity-20" />
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: categoryColors[quickView.category], color: categoryTextColors[quickView.category] }}>
                    {getCategoryLabel(quickView.category)}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                    {quickView.brand}
                  </span>
                  {quickView.effects.map((e) => (
                    <span key={e} className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                      {e}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">{quickView.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">${quickView.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { handleAddToCart(quickView); setQuickView(null); }} className="gap-1.5">
                      <ShoppingCart className="w-4 h-4" />Add to Cart
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/product/${quickView.handle}`} onClick={() => setQuickView(null)}>View Details</Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg p-3 text-[11px] bg-muted border border-border">
                  <div className="flex items-center gap-1.5 mb-1.5 font-medium text-muted-foreground">
                    <ShieldCheck className="w-3 h-3 text-primary" />Lab Tested · COA Available
                  </div>
                  <p className="text-muted-foreground">This product is third-party lab tested. Certificate of Analysis available on the product page.</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ComplianceBanner />
      <Footer />
    </div>
  );
}
