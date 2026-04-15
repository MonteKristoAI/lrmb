import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Archive as ArchiveIcon } from "lucide-react";
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
  }),
};

const Archive = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get("category") as ProductCategory) || "all";

  const soldItems = products.filter((p) => p.sold);
  const filtered = activeCategory === "all"
    ? soldItems
    : soldItems.filter((p) => p.category === activeCategory);

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
        <div className="mx-auto max-w-3xl text-center px-6 md:px-16 mb-16 md:mb-20">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-body text-[11px] tracking-fashion uppercase text-muted-foreground"
          >
            <ArchiveIcon size={13} className="inline mr-2 mb-0.5" />
            Sol Siren Vintage
          </motion.p>

          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground"
          >
            Archive
          </motion.h1>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-xl mx-auto font-body text-base md:text-lg italic text-muted-foreground leading-relaxed"
          >
            Pieces that found their people.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="mt-10 w-16 h-[1px] bg-foreground/20 mx-auto origin-center"
          />
        </div>

        {/* Filter Bar */}
        {soldItems.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 md:px-16 mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
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
        )}

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <div className="mx-auto max-w-2xl px-6 md:px-16 py-20 md:py-28 text-center">
            <p className="font-body text-base italic text-muted-foreground">
              No archived pieces in this category yet.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {filtered.map((p, i) => (
              <ArchiveCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        {/* Closing text */}
        <div className="mx-auto max-w-2xl px-6 md:px-16 py-24 md:py-32 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-body text-base md:text-lg italic text-muted-foreground leading-relaxed"
          >
            These pieces have found their next chapter.
            <br />
            If you're drawn to a similar style, reach out — we may have something quietly waiting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10"
          >
            <Link
              to="/shop"
              className="inline-block border border-foreground bg-transparent text-foreground px-8 py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground hover:text-primary-foreground transition-colors duration-300"
            >
              Explore Available Pieces
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

/* ─── Archive Card ─── */
const ArchiveCard = ({
  product,
  index,
}: {
  product: (typeof products)[number];
  index: number;
}) => {
  const slug = (product as any).slug || product.id;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      custom={index % 4}
      className="group"
    >
      <Link
        to={`/product/${slug}`}
        className="relative aspect-[3/4] overflow-hidden border border-border bg-muted block"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
          loading="lazy"
        />
        {/* SOLD overlay */}
        <div className="absolute inset-0 bg-foreground/10 transition-colors duration-500 group-hover:bg-foreground/5" />
        <div className="absolute top-4 left-4 bg-foreground text-primary-foreground font-body text-[10px] tracking-ultra-wide uppercase px-3 py-1.5 z-10">
          Sold
        </div>
      </Link>

      <Link to={`/product/${slug}`} className="block mt-4 space-y-1">
        <h3 className="font-display text-lg font-light text-foreground/80 hover:opacity-70 transition-opacity">
          {product.name}
        </h3>
        <p className="font-body text-xs tracking-wide text-muted-foreground">
          {product.variant}
        </p>
        <p className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground/60 mt-2">
          Found her next chapter
        </p>
      </Link>
    </motion.div>
  );
};

export default Archive;
