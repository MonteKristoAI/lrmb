import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const singles = products.filter(p => !p.isBundle);
  const bundles = products.filter(p => p.isBundle);

  return (
    <section className="py-28">
      <div className="container">
        <div className="flex items-end justify-between mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary/60" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">The Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              Nano-Extracted<br />
              <span className="text-gradient-gold italic">Precision Gummies</span>
            </h2>
          </div>
          <Link to="/shop"
            className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-foreground/60 hover:text-primary transition-colors duration-300 group font-medium"
          >
            View All
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {singles.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>

        {bundles.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-12 bg-primary/60" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Complete Protocols</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {bundles.map((p) => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
