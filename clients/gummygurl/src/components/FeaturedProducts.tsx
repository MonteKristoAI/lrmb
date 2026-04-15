import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useIsMobile } from "@/hooks/use-mobile";
import OptimizedImage from "@/components/OptimizedImage";
import { fetchFeaturedProducts, type LocalProduct } from "@/lib/productService";

const CATEGORY_DISPLAY: Record<string, string> = {
  "thc-edibles": "THC",
  "mushroom-products": "Mushroom",
  "health-wellness": "CBD",
  "pet-wellness": "Pet",
  "thca-flower": "THCA",
  "bundles": "Bundle",
};

const badgeColors: Record<string, string> = {
  THC: "bg-primary/10 text-primary",
  CBD: "bg-emerald-500/10 text-emerald-600",
  Wellness: "bg-amber-500/10 text-amber-600",
  Pet: "bg-sky-500/10 text-sky-600"
};

export default function FeaturedProducts() {
  const { ref, isVisible } = useScrollAnimation();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts().then((p) => {
      setProducts(p.slice(0, 6));
      setLoading(false);
    });
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="py-14 lg:py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div className="max-w-xl">
            <span
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 block"
              style={{ color: "hsl(217 91% 50%)" }}>
              Best Sellers
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              Our best-selling hemp gummies, wellness supplements, and pet CBD.
            </p>
          </div>

          {!isMobile}
        </div>

        {/* Product grid / carousel */}
        <div
          ref={scrollRef}
          className={`flex gap-5 scroll-fade ${isVisible ? "visible" : ""} ${
          isMobile ?
          "overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide" :
          "grid grid-cols-3 overflow-hidden"}`
          }
          style={isMobile ? { scrollbarWidth: "none" } : undefined}>

          {loading ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : products.map((p) => {
            const displayCat = CATEGORY_DISPLAY[p.category] || p.category;
            return (
            <div
              key={p.handle}
              className={`group relative rounded-2xl overflow-hidden border border-border flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated bg-card ${
              isMobile ? "min-w-[280px] snap-start" : ""}`
              }>

                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {p.image ? (
                    <OptimizedImage
                      src={p.image}
                      alt={p.title}
                      wrapperClassName="w-full h-full"
                      aspectRatio="auto"
                      className="transition-transform duration-700 group-hover:scale-110"
                      style={{ aspectRatio: "auto" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}

                  {/* Badge */}
                  <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColors[displayCat] || badgeColors["THC"]}`}>
                    {displayCat}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-foreground/80 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1 line-clamp-2">
                    {p.description}
                  </p>

                  {/* Trust badges */}
                  <div className="flex items-center gap-3 mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    <span>Lab Tested</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>COA Available</span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xl font-extrabold text-foreground">${p.price.toFixed(2)}</span>
                    <Button
                    asChild
                    size="sm"
                    className="font-semibold text-xs transition-all duration-300 group-hover:shadow-lg">
                      <Link to={`/product/${p.handle}`}>View Product</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>);
}
