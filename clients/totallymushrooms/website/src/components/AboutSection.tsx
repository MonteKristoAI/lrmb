import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import aboutImage from "@/assets/product-wellness-bundle.webp";

const AboutSection = () => (
  <section className="py-28 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-card/60 to-card/40" />
    <div className="container relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-5 lg:-ml-16 xl:-ml-24">
          <div className="relative group">
            <div className="aspect-[3/4] overflow-hidden">
              <img src={aboutImage} alt="Totally Mushrooms collection"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
            <div className="absolute bottom-6 left-6">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/60 font-medium">Nashville, TN</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Our Story</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-light leading-[1.05]">
            Purity in the Organism.<br />
            <span className="text-gradient-gold italic">Precision in the Machine.</span>
          </h2>

          <div className="space-y-5 max-w-lg">
            <p className="text-foreground/70 leading-[1.8] text-base">
              The mushroom supplement industry wastes 80% of what nature provides. Crude capsules. Mycelium-on-grain fillers. Heat-destroyed extracts that dissolve in stomach acid before reaching a single cell.
            </p>
            <p className="text-foreground/70 leading-[1.8] text-base">
              We engineered a different path. Proprietary ultrasonic nano-refinement. Cold-process extraction below 45C. Sub-micron particles that bypass the gastric gauntlet entirely. The result: 95%+ bioavailability from mushrooms we grow ourselves.
            </p>
          </div>

          <div className="flex items-center gap-10 pt-4">
            {[
              { value: "40:1", label: "Extract" },
              { value: "<45C", label: "Process" },
              { value: "95%+", label: "Uptake" },
            ].map(({ value, label }) => (
              <div key={label}>
                <span className="text-3xl font-heading text-primary">{value}</span>
                <span className="text-xs uppercase tracking-[0.15em] text-foreground/55 block mt-1 font-medium">{label}</span>
              </div>
            ))}
          </div>

          <Link to="/science"
            className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.12em] text-foreground/60 hover:text-primary transition-colors duration-300 group pt-2 font-medium"
          >
            Explore Our Science
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
