import { Link } from "react-router-dom";
import { products } from "@/lib/data";

const zones = [
  { name: "Cognitive Regeneration", product: "Total Neuro", mushroom: "Lion's Mane", stat: "NGF Synthesis", id: "total-neuro" },
  { name: "Cellular Propulsion", product: "Total Velocity", mushroom: "Cordyceps", stat: "ATP Synthesis", id: "total-velocity" },
  { name: "Systemic Defense", product: "Total Aegis", mushroom: "Golden Oyster", stat: "L-Ergothioneine", id: "total-aegis" },
];

const CategoriesSection = () => (
  <section className="py-28 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-card/60 to-card/40" />
    <div className="container relative z-10">
      <div className="flex items-center gap-4 mb-16">
        <div className="h-px w-12 bg-primary/60" />
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Optimization Zones</span>
      </div>

      <div className="space-y-0 divide-y divide-border/25">
        {zones.map((zone, i) => {
          const product = products.find(p => p.id === zone.id);
          return (
            <Link key={zone.name} to={`/product/${zone.id}`}
              className="group flex items-center justify-between py-10 md:py-14 transition-colors duration-500"
            >
              <div className="flex items-center gap-8 md:gap-16">
                <span className="text-sm font-mono text-foreground/40 tracking-wider w-8">0{i + 1}</span>
                {product && (
                  <div className="hidden md:block w-20 h-20 rounded-sm overflow-hidden bg-card border border-foreground/15 shrink-0 group-hover:border-primary/40 transition-all duration-500">
                    <img src={product.image} alt={zone.product} className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-700 group-hover:scale-110" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl md:text-4xl font-heading text-foreground/90 group-hover:text-foreground transition-colors duration-500">
                    {zone.product}
                  </h3>
                  <p className="text-sm text-foreground/50 font-heading italic mt-1">{zone.mushroom}</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-12">
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/40 block font-medium">Biomarker</span>
                  <span className="text-sm text-foreground/70">{zone.stat}</span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center border border-foreground/20 rounded-full group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-500">
                  <span className="text-foreground/40 group-hover:text-primary transition-colors duration-500 text-sm">&rarr;</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
