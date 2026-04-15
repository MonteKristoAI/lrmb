import { Zap, Droplets, Grid3X3, Shield, Leaf } from "lucide-react";

const stats = [
  { value: "5–15", unit: "min", icon: Zap, label: "Onset Time", desc: "Fast-acting effects" },
  { value: "THC+CBD", unit: "", icon: Leaf, label: "Full Spectrum", desc: "Entourage effect formulation" },
  { value: "18–22", unit: "%", icon: Grid3X3, label: "Bioavailability", desc: "vs 2–6% traditional" },
  { value: "100", unit: "%", icon: Droplets, label: "Water-Soluble", desc: "Hydrophilic cannabinoids" },
  { value: "24", unit: "mo", icon: Shield, label: "Shelf Stable", desc: "No seepage or crystallization" },
];

const TrustStats = () => (
  <section className="py-16">
    <div className="container">
      <p className="text-center text-xs font-bold tracking-[0.25em] uppercase text-gold mb-10 fade-in">
        Why Our Gummies Are Different
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className={`text-center fade-in stagger-${i + 1}`}>
            <div className="text-3xl md:text-4xl font-black text-foreground mb-2">
              {s.value}<span className="text-lg text-gold">{s.unit}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-md gold-check-bg flex items-center justify-center">
                <s.icon size={16} className="text-gold" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStats;
