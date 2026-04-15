import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import TrustBar from "@/components/TrustBar";
import { products, categories } from "@/lib/data";
import { useState } from "react";

const Shop = () => {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <Layout>
      <section className="pt-28 pb-24">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-primary/50" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary/70">The Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            Our <span className="text-gradient-gold italic">Products</span>
          </h1>
          <p className="text-muted-foreground mb-10 max-w-lg">
            The Total Series: 40:1 nano-extracted, cold-process ultrasonic refinement, 95%+ bioavailability. 178x efficiency over crude powders. Subscribe and save 25%.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {["All", ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  filter === cat
                    ? "bg-primary text-primary-foreground border-primary glow-gold-subtle"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>
      <TrustBar />
    </Layout>
  );
};

export default Shop;
