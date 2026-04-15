import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import silhouetteSocial from "@/assets/silhouette-social.png";

const SilhouetteHero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
    {/* Background silhouette */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <img
        src={silhouetteSocial}
        alt=""
        aria-hidden="true"
        className="w-[60%] max-w-2xl opacity-[0.15] animate-float translate-y-[15%]"
        width={1920}
        height={1080}
      />
    </div>

    {/* Content */}
    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
      {/* Wordmark */}
      <div className="mb-12 fade-in">
        <h2 className="text-sm md:text-base font-bold tracking-[0.4em] uppercase text-gold mb-2">
          {BRAND_NAME}
        </h2>
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 fade-in stagger-1 tracking-tight">
        <span className="text-gold">Entourage</span>
      </h1>
      <p className="text-xl md:text-2xl font-semibold text-foreground mb-2 fade-in stagger-1">
        The Social Gummy Experience
      </p>

      <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto fade-in stagger-2">
        Fast acting. Predictable. Designed for connection.
      </p>

      <p className="text-sm text-muted-foreground mb-10 max-w-lg mx-auto fade-in stagger-2">
        {BRAND_NAME} gummies combine an entourage mimicking THC + CBD + terpene formulation with TiME INFUSION fast acting delivery.
      </p>

      {/* Effect pills */}
      <div className="flex items-center justify-center gap-6 mb-10 fade-in stagger-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-effect-relaxed" />
          <span className="text-xs font-semibold text-effect-relaxed tracking-wider uppercase">Relaxed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-effect-balanced" />
          <span className="text-xs font-semibold text-effect-balanced tracking-wider uppercase">Balanced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-effect-uplifted" />
          <span className="text-xs font-semibold text-effect-uplifted tracking-wider uppercase">Uplifted</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 justify-center fade-in stagger-3">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Shop Gummies <ArrowRight size={16} />
        </Link>
        <a
          href="#effects"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
        >
          Explore Effects
        </a>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-glow">
      <ChevronDown size={24} className="text-muted-foreground" />
    </div>
  </section>
);

export default SilhouetteHero;
