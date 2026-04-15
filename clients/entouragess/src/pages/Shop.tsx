import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsletterSection from "@/components/NewsletterSection";

import shopRelaxed from "@/assets/shop-relaxed.jpg";
import shopBalanced from "@/assets/shop-balanced.jpg";
import shopUplifted from "@/assets/shop-uplifted.jpg";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";
import silUplifted from "@/assets/silhouette-uplifted-cutout.png";

type Effect = "all" | "relaxed" | "balanced" | "uplifted";

interface Terpene {
  name: string;
  amount: string;
}

const effectData: Record<string, { desc: string; terpenes: Terpene[]; img: string }> = {
  relaxed: {
    desc: "Calm body, clear mind.",
    terpenes: [
      { name: "Myrcene", amount: "1.5mg" },
      { name: "Linalool", amount: "0.9mg" },
      { name: "β-Caryophyllene", amount: "0.6mg" },
    ],
    img: shopRelaxed,
  },
  balanced: {
    desc: "Clarity, enjoyment, connection.",
    terpenes: [
      { name: "Limonene", amount: "1.2mg" },
      { name: "Linalool", amount: "0.9mg" },
      { name: "β-Caryophyllene", amount: "0.9mg" },
    ],
    img: shopBalanced,
  },
  uplifted: {
    desc: "Energy, creativity, euphoria.",
    terpenes: [
      { name: "Limonene", amount: "1.8mg" },
      { name: "α-Pinene", amount: "0.75mg" },
      { name: "β-Caryophyllene", amount: "0.45mg" },
    ],
    img: shopUplifted,
  },
};

const products = [
  { id: "relaxed", effect: "relaxed" as const, name: "RELAXED", price: "$25.00" },
  { id: "balanced", effect: "balanced" as const, name: "BALANCED", price: "$25.00" },
  { id: "uplifted", effect: "uplifted" as const, name: "UPLIFTED", price: "$25.00" },
];

const filters: { label: string; value: Effect; color?: string }[] = [
  { label: "All", value: "all" },
  { label: "Relaxed", value: "relaxed", color: "bg-effect-relaxed" },
  { label: "Balanced", value: "balanced", color: "bg-effect-balanced" },
  { label: "Uplifted", value: "uplifted", color: "bg-effect-uplifted" },
];

const effectColors: Record<string, { text: string; border: string; glow: string }> = {
  relaxed: { text: "text-effect-relaxed", border: "border-effect-relaxed", glow: "effect-glow-relaxed" },
  balanced: { text: "text-effect-balanced", border: "border-effect-balanced", glow: "effect-glow-balanced" },
  uplifted: { text: "text-effect-uplifted", border: "border-effect-uplifted", glow: "effect-glow-uplifted" },
};

const Shop = () => {
  const [filter, setFilter] = useState<Effect>("all");
  const filtered = filter === "all" ? products : products.filter((p) => p.effect === filter);

  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
          </div>
          <div className="container text-center max-w-2xl fade-in relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Shop <span className="text-gold">Gummies</span>
            </h1>
            <p className="text-muted-foreground">
              Three blends. Two strengths.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-8">
          <div className="container">
            <div className="flex gap-3 justify-center flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    filter === f.value
                      ? "gold-gradient text-primary-foreground"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {f.color && <div className={`w-2 h-2 rounded-full ${f.color}`} />}
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="pb-24 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src={silUplifted} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
          </div>
          <div className="container relative z-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => {
                const colors = effectColors[p.effect];
                const data = effectData[p.effect];
                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className={`group relative bg-card rounded-2xl overflow-hidden border-t-2 ${colors.border} transition-all duration-500 hover:-translate-y-2 block`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={data.img}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <span className={`text-xs font-black tracking-wider uppercase ${colors.text}`}>
                        {p.effect}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{p.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{data.desc}</p>

                      {/* Pricing */}
                      <div className="mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Pricing</p>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground">10mg Single</span>
                            <span className="font-bold text-gold">$2.50</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground">25mg Single</span>
                            <span className="font-bold text-gold">$6.25</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground">100mg Pack</span>
                            <span className="font-bold text-gold">$25.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Terpene Blend */}
                      <div className="mb-5">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Terpene Blend</p>
                        <div className="space-y-1">
                          {data.terpenes.map((t) => (
                            <div key={t.name} className="flex justify-between text-sm">
                              <span className="text-foreground">{t.name}</span>
                              <span className={`font-bold ${colors.text}`}>{t.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-gold">{p.price}</span>
                        <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full gold-gradient text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity">
                          View Details <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
};

export default Shop;
