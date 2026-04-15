import { Link } from "react-router-dom";
import { systemicMatrix } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const zoneNumbers = { "Total Neuro": "01", "Total Velocity": "02", "Total Aegis": "03" };
const zoneAccents = {
  "Total Neuro": { text: "text-foreground", glow: "group-hover:shadow-[0_0_80px_-20px_hsl(0_0%_100%/0.06)]" },
  "Total Velocity": { text: "text-red-400", glow: "group-hover:shadow-[0_0_80px_-20px_hsl(0_70%_50%/0.08)]" },
  "Total Aegis": { text: "text-primary", glow: "group-hover:shadow-[0_0_80px_-20px_hsl(43_74%_49%/0.08)]" },
};
const zoneLinks = { "Total Neuro": "/product/total-neuro", "Total Velocity": "/product/total-velocity", "Total Aegis": "/product/total-aegis" };

const SystemicMatrix = () => (
  <section className="py-32 relative grain-overlay">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(40_10%_5%)] to-background" />
    <div className="container relative z-10">
      <div className="max-w-3xl mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-12 bg-primary/60" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Three Pillars of Optimization</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.0] mb-6">
          Systemic<br />
          <span className="text-gradient-gold italic">Mastery Matrix</span>
        </h2>
        <p className="text-base md:text-lg text-foreground/60 leading-relaxed max-w-lg">
          Three kinetic protocols. Three distinct optimization zones.
          Each engineered with a single-species 40:1 nano-extract targeting
          a specific biomarker pathway.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border/20 rounded-sm overflow-hidden">
        {systemicMatrix.map((col) => {
          const num = zoneNumbers[col.product as keyof typeof zoneNumbers];
          const accent = zoneAccents[col.product as keyof typeof zoneAccents];
          const link = zoneLinks[col.product as keyof typeof zoneLinks];

          return (
            <Link key={col.product} to={link} className={`group bg-card p-10 lg:p-12 space-y-8 transition-all duration-700 ${accent.glow}`}>
              <div className="space-y-4">
                <span className="text-xs font-mono text-foreground/35 tracking-wider">{num}</span>
                <h3 className={`text-2xl md:text-3xl font-heading ${accent.text} transition-colors duration-500`}>
                  {col.product}
                </h3>
                <p className="text-sm uppercase tracking-[0.15em] text-foreground/55 font-heading italic">
                  {col.mushroomCore}
                </p>
              </div>

              <div className="space-y-6 pt-4 border-t border-border/30">
                {[
                  { label: "Target Biomarker", value: col.targetBiomarker },
                  { label: "Kinetic Advantage", value: col.kineticAdvantage },
                  { label: "Ideal Application", value: col.idealApplication },
                ].map((spec) => (
                  <div key={spec.label} className="space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/45 font-medium">{spec.label}</span>
                    <p className="text-sm text-foreground/85">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/25">
                <span className="text-xs uppercase tracking-[0.15em] text-primary/80 font-medium">40:1 Nano Extract</span>
                <ArrowRight size={14} className={`${accent.text} opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default SystemicMatrix;
