import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Eye, X } from "lucide-react";
import { useCart, type Product } from "@/contexts/CartContext";
import products from "@/data/products";

/* ================================================================== */
/*  SECTION                                                            */
/* ================================================================== */
const FeaturedShop = () => {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <section className="bg-background py-24 md:py-32 px-6 md:px-16">
      {/* Header */}
      <div className="mx-auto max-w-7xl text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-foreground">
          Featured Pieces
        </h2>
        <p className="mt-4 font-body text-lg md:text-xl tracking-wide text-muted-foreground">
          Vintage worth remembering
        </p>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {products.filter((p) => !p.sold).slice(0, 6).map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={() => setQuickView(p)} />
        ))}
      </div>

      {/* View All */}
      <div className="mx-auto max-w-7xl text-center mt-14">
        <Link
          to="/shop"
          className="inline-block border border-foreground bg-transparent text-foreground px-10 py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground hover:text-primary-foreground transition-colors duration-300"
        >
          View All Products
        </Link>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
      </AnimatePresence>
    </section>
  );
};

/* ================================================================== */
/*  PRODUCT CARD                                                       */
/* ================================================================== */
const ProductCard = ({ product, onQuickView }: { product: Product; onQuickView: () => void }) => {
  const slug = (product as any).slug || product.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group"
    >
      <Link to={`/product/${slug}`} className="relative aspect-[3/4] overflow-hidden border border-border bg-muted block">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
          className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-5 py-2.5 font-body text-[10px] tracking-ultra-wide uppercase text-foreground opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border border-border"
        >
          <Eye size={14} />
          Quick View
        </button>
      </Link>

      <Link to={`/product/${slug}`} className="block mt-4 space-y-1">
        <h3 className="font-display text-lg md:text-xl font-light text-foreground hover:opacity-70 transition-opacity">{product.name}</h3>
        <p className="font-body text-xs tracking-wide text-muted-foreground">{product.variant}</p>
        <p className="font-body text-sm font-medium text-foreground">${product.price}.00</p>
      </Link>

      <Link
        to={`/product/${slug}`}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-foreground bg-foreground text-primary-foreground py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors duration-300"
      >
        <ShoppingBag size={14} />
        Select Options
      </Link>
    </motion.div>
  );
};

/* ================================================================== */
/*  QUICK VIEW MODAL                                                   */
/* ================================================================== */
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-background border border-border max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="aspect-[3/4] md:aspect-auto">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        {/* Details */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>

          <h3 className="font-display text-2xl md:text-3xl font-light text-foreground">{product.name}</h3>
          <p className="mt-2 font-body text-xs tracking-wide text-muted-foreground">{product.variant}</p>
          <p className="mt-4 font-body text-lg font-medium text-foreground">${product.price}.00</p>

          <p className="mt-6 font-body text-sm text-muted-foreground leading-relaxed">
            A timeless piece from our curated vintage collection. Designed for effortless elegance.
          </p>

          <button
            onClick={() => {
              addItem(product);
              onClose();
            }}
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

export default FeaturedShop;
