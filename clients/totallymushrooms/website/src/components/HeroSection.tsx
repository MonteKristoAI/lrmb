import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroProduct from "@/assets/product-revive-thrive.webp";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-end pb-16 md:pb-20 pt-24 overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute top-[10%] right-[5%] w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[150px]" />
      <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.025] blur-[120px]" />
    </div>

    <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: `linear-gradient(hsl(43 74% 49% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(43 74% 49% / 0.3) 1px, transparent 1px)`,
      backgroundSize: '80px 80px'
    }} />

    <div className="container relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-6 space-y-8 md:space-y-10">
          {/* Eyebrow */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-primary/60" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">The Total Series</span>
            </div>
          </div>

          {/* Headline */}
          <div className="animate-fade-up animate-fade-up-delay-1">
            <h1 className="text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
              Bypass the
              <br />
              <span className="text-gradient-gold font-medium italic">Gauntlet.</span>
            </h1>
          </div>

          {/* Subhead */}
          <div className="animate-fade-up animate-fade-up-delay-2 max-w-lg">
            <p className="text-base md:text-lg text-foreground/80 leading-[1.75]">
              40:1 nano-extracted from organically grown fruiting bodies.
              Sub-micron particles engineered to bypass digestive degradation
              and deliver clinical-grade bioactives directly to your cells.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 animate-fade-up animate-fade-up-delay-3">
            <Link to="/shop">
              <Button size="lg" className="px-8 md:px-10 h-12 md:h-14 text-xs md:text-sm font-semibold tracking-wide gap-3 group rounded-none bg-primary hover:bg-primary/90">
                SHOP THE TOTAL SERIES
                <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Button>
            </Link>
            <Link to="/science" className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300 tracking-wide uppercase font-medium">
              Our Science
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-end gap-8 md:gap-14 pt-2 animate-fade-up animate-fade-up-delay-4">
            {[
              { value: "95%+", label: "Bioavailability" },
              { value: "178", suffix: "x", label: "Efficiency" },
              { value: "40:1", label: "Extract Ratio" },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-4xl md:text-5xl font-heading text-primary">{value}</span>
                  {suffix && <span className="text-xl md:text-2xl text-primary/80">{suffix}</span>}
                </div>
                <span className="text-xs uppercase tracking-[0.12em] text-foreground/60 mt-1.5 block font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product */}
        <div className="lg:col-span-6 relative animate-fade-up animate-fade-up-delay-2">
          <div className="relative">
            <div className="absolute inset-0 scale-110 bg-gradient-to-t from-primary/[0.07] via-primary/[0.03] to-transparent blur-3xl rounded-full" />
            <img
              src={heroProduct}
              alt="Totally Mushrooms Systemic Mastery Pack"
              className="relative w-full max-w-xs mx-auto md:max-w-sm lg:max-w-lg xl:max-w-xl animate-float drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
            <div className="absolute -bottom-2 left-4 lg:left-0">
              <div className="glass-card-gold rounded-sm px-5 py-3 animate-fade-up animate-fade-up-delay-5">
                <span className="text-xs uppercase tracking-[0.15em] text-foreground/60 block">Starting at</span>
                <span className="text-2xl font-heading text-primary">$35</span>
                <span className="text-sm text-foreground/50 ml-1">/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-px shimmer-line" />
  </section>
);

export default HeroSection;
