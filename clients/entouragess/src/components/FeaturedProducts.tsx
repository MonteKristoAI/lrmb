import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import relaxedImg from "@/assets/product-relaxed-gummies.jpg";
import balancedImg from "@/assets/product-balanced-gummies.jpg";
import upliftedImg from "@/assets/product-uplifted-gummies.jpg";

const products = [
  {
    name: "RELAXED",
    tagline: "Calm body, clear mind",
    img: relaxedImg,
    terpenes: [
      { name: "Myrcene", amount: "1.5mg" },
      { name: "Linalool", amount: "0.9mg" },
      { name: "β-Caryophyllene", amount: "0.6mg" },
    ],
    colorClass: "effect-relaxed",
    borderClass: "border-effect-relaxed",
    glowClass: "effect-glow-relaxed",
    textClass: "text-effect-relaxed",
  },
  {
    name: "BALANCED",
    tagline: "Clarity, enjoyment, connection",
    img: balancedImg,
    terpenes: [
      { name: "Limonene", amount: "1.2mg" },
      { name: "Linalool", amount: "0.9mg" },
      { name: "β-Caryophyllene", amount: "0.9mg" },
    ],
    colorClass: "effect-balanced",
    borderClass: "border-effect-balanced",
    glowClass: "effect-glow-balanced",
    textClass: "text-effect-balanced",
  },
  {
    name: "UPLIFTED",
    tagline: "Energy, creativity, euphoria",
    img: upliftedImg,
    terpenes: [
      { name: "Limonene", amount: "1.8mg" },
      { name: "α-Pinene", amount: "0.75mg" },
      { name: "β-Caryophyllene", amount: "0.45mg" },
    ],
    colorClass: "effect-uplifted",
    borderClass: "border-effect-uplifted",
    glowClass: "effect-glow-uplifted",
    textClass: "text-effect-uplifted",
  },
];

const FeaturedProducts = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-4 block">
            Choose Your Experience
          </span>
          <h2 className="text-3xl md:text-5xl font-black">Three Blends. Two Strengths.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((p) => (
            <Link
              key={p.name}
              to="/shop"
              className={`group relative bg-card rounded-2xl overflow-hidden border-t-2 ${p.borderClass} transition-all duration-500 hover:-translate-y-2`}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={p.img}
                  alt={`${p.name} gummies`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className={`text-2xl font-black tracking-wider mb-1 ${p.textClass}`}>
                  {p.name}
                </h3>
                <p className="text-foreground font-medium mb-4">{p.tagline}</p>

                {/* Dosage */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex gap-3">
                    <span className="text-xs font-bold bg-secondary px-3 py-1 rounded-full text-foreground">
                      10mg THC
                    </span>
                    <span className="text-xs font-bold bg-secondary px-3 py-1 rounded-full text-foreground">
                      5mg CBD
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-bold bg-secondary px-3 py-1 rounded-full text-foreground">
                      25mg THC
                    </span>
                    <span className="text-xs font-bold bg-secondary px-3 py-1 rounded-full text-foreground">
                      5mg CBD
                    </span>
                  </div>
                </div>

                {/* Terpene blend */}
                <div className="border-t border-border pt-3">
                  <span className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
                    Terpene Blend
                  </span>
                  <div className="flex flex-col gap-1">
                    {p.terpenes.map((t) => (
                      <div key={t.name} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t.name}</span>
                        <span className={`font-semibold ${p.textClass}`}>{t.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
