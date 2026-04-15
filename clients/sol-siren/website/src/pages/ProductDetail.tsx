import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Truck, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import products from "@/data/products";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <>
        <main className="bg-background pt-28 min-h-screen flex flex-col items-center justify-center px-6">
          <h1 className="font-display text-3xl text-foreground">Product not found.</h1>
          <button onClick={() => navigate("/shop")} className="mt-6 font-body text-sm text-muted-foreground underline">
            Back to Shop
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="bg-background pt-24 md:pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 md:px-16 mb-8">
          <nav className="font-body text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-16 grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 md:gap-16">
          <ImageGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
};

/* ================================================================== */
const ImageGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [active, setActive] = useState(0);
  const hasMultiple = images.length > 1;

  const prevImage = () => setActive((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setActive((prev) => (prev + 1) % images.length);

  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-[4/5] max-h-[70vh] overflow-hidden border border-border bg-muted">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${name} – view ${active + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-20 h-24 border overflow-hidden transition-all duration-200 ${
              active === i ? "border-foreground" : "border-border opacity-60 hover:opacity-100"
            }`}
          >
            <img src={src} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ================================================================== */
const ProductInfo = ({ product }: { product: typeof products[number] }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    for (let i = 0; i < qty; i++) addItem({ ...product, selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleSizeSelect = (s: string) => {
    setSelectedSize(s);
    setSizeError(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col justify-start md:sticky md:top-28"
    >
      <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">{product.name}</h1>
      <p className="mt-2 font-body text-xs tracking-wide text-muted-foreground">{product.variant}</p>
      <p className="mt-4 font-body text-xl font-medium text-foreground">${product.price}.00</p>

      <p className="mt-6 font-body text-sm text-muted-foreground leading-relaxed max-w-md">
        {product.description}
      </p>

      <p className="mt-4 font-body text-[11px] italic text-muted-foreground/70 max-w-md">
        Vintage items may show minor wear consistent with age. Each piece is one-of-one and carries its own history.
      </p>

      <div className="w-full h-[1px] bg-border my-8" />

      {/* Size selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">Size</p>
          {selectedSize && (
            <span className="flex items-center gap-1 font-body text-[10px] text-[#5a7d5a]">
              <Check size={12} /> Size selected
            </span>
          )}
        </div>
        <motion.div
          className="flex gap-2"
          animate={sizeError ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.15 }}
        >
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => handleSizeSelect(s)}
              className={`px-4 py-2 border font-body text-xs tracking-wide transition-all duration-200 ${
                selectedSize === s
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border text-foreground hover:border-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </motion.div>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: sizeError ? 24 : 0, opacity: sizeError ? 1 : 0 }}
        >
          <p className="mt-2 font-body text-[11px] text-[#c0392b]/80">Please select a size.</p>
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-6">
        <p className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-3">Quantity</p>
        <div className="flex items-center border border-border w-fit">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-foreground hover:bg-muted transition-colors">
            <Minus size={14} />
          </button>
          <span className="px-5 py-2 font-body text-sm text-foreground border-x border-border">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-foreground hover:bg-muted transition-colors">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      {product.sold ? (
        <div className="mt-8 space-y-2">
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-muted text-muted-foreground py-4 font-body text-[10px] tracking-ultra-wide uppercase cursor-not-allowed border border-muted-foreground/30"
          >
            Sold Out
          </button>
          <p className="font-body text-[11px] text-muted-foreground/70 text-center italic">
            This piece has been sold and is no longer available.
          </p>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          className={`mt-8 w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground py-4 font-body text-[10px] tracking-ultra-wide uppercase transition-all duration-300 ${
            selectedSize ? "hover:bg-foreground/90" : "opacity-75 hover:opacity-85"
          }`}
        >
          <ShoppingBag size={14} />
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      )}

      {/* Shipping notes */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck size={14} />
          <span className="font-body text-xs">Free shipping on orders over $150.</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <RotateCcw size={14} />
          <span className="font-body text-xs">14-day returns.</span>
        </div>
      </div>

      {/* Accordions */}
      <div className="mt-10 border-t border-border">
        <Accordion title="Product Details">
          <ul className="font-body text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1 pl-1">
            {product.productDetails.era && <li><span className="text-foreground font-medium">Era:</span> {product.productDetails.era}</li>}
            {product.productDetails.material && <li><span className="text-foreground font-medium">Material:</span> {product.productDetails.material}</li>}
            {product.productDetails.color && <li><span className="text-foreground font-medium">Color:</span> {product.productDetails.color}</li>}
            {product.productDetails.lining && <li><span className="text-foreground font-medium">Lining:</span> {product.productDetails.lining}</li>}
            {product.productDetails.closure && <li><span className="text-foreground font-medium">Closure:</span> {product.productDetails.closure}</li>}
            {product.productDetails.length && <li><span className="text-foreground font-medium">Length:</span> {product.productDetails.length}</li>}
            {product.productDetails.fit && <li><span className="text-foreground font-medium">Fit:</span> {product.productDetails.fit}</li>}
          </ul>
        </Accordion>
        <Accordion title="Size & Fit">
          <div className="font-body text-sm text-muted-foreground leading-relaxed space-y-3">
            <p><span className="text-foreground font-medium">Estimated Modern Size:</span> {product.sizeFit.modernSize}</p>
            <div>
              <p className="text-foreground font-medium mb-1">Measurements:</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Shoulder: {product.sizeFit.measurements.shoulder}</li>
                <li>Bust: {product.sizeFit.measurements.bust}</li>
                <li>Sleeve: {product.sizeFit.measurements.sleeve}</li>
                <li>Length: {product.sizeFit.measurements.length}</li>
              </ul>
            </div>
            <p>{product.sizeFit.fitDescription}</p>
          </div>
        </Accordion>
        <Accordion title="Care Instructions">
          <ul className="font-body text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1 pl-1">
            {product.careInstructions.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ul>
        </Accordion>
      </div>
    </motion.div>
  );
};

/* ================================================================== */
const Accordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-body text-xs tracking-ultra-wide uppercase text-foreground"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
