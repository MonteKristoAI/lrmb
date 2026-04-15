import { Leaf, Zap } from "lucide-react";
import { BRAND_PRODUCT_STATEMENT } from "@/lib/brand";

const DualPillarSection = () => (
  <section className="py-20 section-divider">
    <div className="container">
      <div className="text-center mb-12 fade-in">
        <hr className="hr-accent mx-auto" />
        <h2 className="text-2xl md:text-3xl font-bold">What Makes Our Gummies <span className="text-gold">Different</span></h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
          Two innovations working together to create a cannabis edible experience that mimics smoking, but in a more precisely dosed and controlled way.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Pillar 1: Formulation */}
        <div className="bg-card border border-border rounded-xl p-8 fade-in">
          <div className="w-11 h-11 rounded-lg gold-check-bg flex items-center justify-center mb-4">
            <Leaf size={22} className="text-gold" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">Entourage Effect Mimicking Formulation</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Our gummies aren't just THC. They use a precise blend of <strong className="text-foreground">THC + CBD + terpenes</strong> designed to recreate the full-spectrum experience of smoking, the entourage effect, in gummy form.
          </p>
          <ul className="flex flex-col gap-2.5">
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-gold mt-0.5">→</span>
              Cannabinoids and terpenes working together, not isolated THC
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-gold mt-0.5">→</span>
              Designed for clarity, enjoyment, and connection
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-gold mt-0.5">→</span>
              Social & sessionable, not heavy or sedating
            </li>
          </ul>
        </div>

        {/* Pillar 2: Delivery */}
        <div className="bg-card border border-border rounded-xl p-8 fade-in stagger-1">
          <div className="w-11 h-11 rounded-lg gold-check-bg flex items-center justify-center mb-4">
            <Zap size={22} className="text-gold" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">TiME INFUSION Delivery System</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Each cannabinoid and terpene molecule is individually encapsulated with a hydrophilic coating, enabling <strong className="text-foreground">soft-tissue absorption in 5–15 minutes</strong>, bypassing the slow digestive pathway entirely.
          </p>
          <ul className="flex flex-col gap-2.5">
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-gold mt-0.5">→</span>
              Fast-acting: effects in 5–15 minutes, not 90
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-gold mt-0.5">→</span>
              Preserves Delta-9-THC, no heavy liver conversion
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-gold mt-0.5">→</span>
              Better taste with no bitter cannabis oil flavor
            </li>
          </ul>
        </div>
      </div>

      {/* Combined result */}
      <div className="bg-card border border-[hsl(var(--gold)/0.3)] rounded-xl p-8 text-center max-w-3xl mx-auto fade-in stagger-2">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-3">Together</p>
        <p className="text-sm text-foreground leading-relaxed italic">
          "{BRAND_PRODUCT_STATEMENT}"
        </p>
      </div>
    </div>
  </section>
);

export default DualPillarSection;
