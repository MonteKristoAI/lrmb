import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Eye, X } from "lucide-react";
import { useCart, type Product } from "@/contexts/CartContext";
import products from "@/data/products";
import type { ProductCategory } from "@/data/products";
import Footer from "@/components/Footer";

const categories: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Fur", value: "fur" },
  { label: "Leather", value: "leather" },
  { label: "Penny Lane / Afghan", value: "penny-lane-afghan" },
  { label: "Overcoat", value: "overcoat" },
  { label: "Apres Ski", value: "apres-ski" },
  { label: "Jewelry", value: "jewelry" },
];

const Shop = () => {
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get("category") as ProductCategory) || "all";

  const available = products.filter((p) => !p.sold);
  const filtered = activeCategory === "all"
    ? available
    : available.filter((p) => p.category === activeCategory);

  const setCategory = (value: string) => {
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  return (
    <>
      <main className="bg-background pt-28 md:pt-32">
        {/* Hero */}
        <div className="mx-auto max-w-7xl text-center px-6 md:px-16 mb-10 md:mb-14">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground">
            Shop
          </h1>
          <p className="mt-4 font-body text-sm md:text-base tracking-wide uppercase text-[#2A2A2A]/70">
            Curated pieces. Limited drops.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mx-auto max-w-7xl px-6 md:px-16 mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`font-display text-xs md:text-sm tracking-widest uppercase transition-colors duration-300 pb-1 border-b ${
                  activeCategory === cat.value
                    ? "text-[#2A2A2A] border-[#2A2A2A]"
                    : "text-[#2A2A2A]/50 border-transparent hover:text-[#2A2A2A]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={() => setQuickView(p)} />
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mx-auto max-w-7xl px-6 md:px-16 py-24 md:py-32 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            More to discover soon
          </h2>
          <p className="mt-3 font-body text-lg md:text-xl tracking-wide text-muted-foreground">
            New pieces released regularly
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
            <button className="bg-foreground text-primary-foreground px-6 py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors">
              Stay Connected
            </button>
          </div>
        </div>

        {/* Quick View Modal */}
        <AnimatePresence>
          {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
};

/* ================================================================== */
const ProductCard = ({ product, index, onQuickView }: { product: Product; index: number; onQuickView: () => void }) => {
  const slug = (product as any).slug || product.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 4) * 0.08 }}
      className="group"
    >
      <Link to={`/product/${slug}`} className={`relative aspect-[3/4] overflow-hidden border border-border bg-muted block ${product.sold ? "opacity-75" : ""}`}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {product.sold && (
          <div className="absolute top-4 left-4 bg-foreground text-primary-foreground font-body text-[10px] tracking-ultra-wide uppercase px-3 py-1.5 z-10">
            Sold
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
        {!product.sold && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-5 py-2.5 font-body text-[10px] tracking-ultra-wide uppercase text-foreground opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border border-border"
          >
            <Eye size={14} />
            Quick View
          </button>
        )}
      </Link>

      <Link to={`/product/${slug}`} className="block mt-4 space-y-1">
        <h3 className="font-display text-lg font-light text-foreground hover:opacity-70 transition-opacity">{product.name}</h3>
        <p className="font-body text-xs tracking-wide text-muted-foreground">{product.variant}</p>
        <p className="font-body text-sm font-medium text-foreground">${product.price}.00</p>
      </Link>

      {product.sold ? (
        <div className="mt-4 w-full flex items-center justify-center gap-2 border border-muted-foreground/30 bg-muted text-muted-foreground py-3 font-body text-[10px] tracking-ultra-wide uppercase cursor-not-allowed">
          Sold Out
        </div>
      ) : (
        <Link
          to={`/product/${slug}`}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-foreground bg-foreground text-primary-foreground py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors duration-300"
        >
          <ShoppingBag size={14} />
          Select Options
        </Link>
      )}
    </motion.div>
  );
};

const QuickViewModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-background border border-border max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[3/4] md:aspect-auto">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
          <h3 className="font-display text-2xl md:text-3xl font-light text-foreground">{product.name}</h3>
          <p className="mt-2 font-body text-xs tracking-wide text-muted-foreground">{product.variant}</p>
          <p className="mt-4 font-body text-lg font-medium text-foreground">${product.price}.00</p>
          <p className="mt-6 font-body text-sm text-muted-foreground leading-relaxed">
            A timeless piece from our curated vintage-inspired collection. Designed for effortless elegance.
          </p>
          <button
            onClick={() => { addItem(product); onClose(); }}
            className="mt-8 w-full flex items-center justify-center gap-2 border border-foreground bg-foreground text-primary-foreground py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors duration-300"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Shop;
