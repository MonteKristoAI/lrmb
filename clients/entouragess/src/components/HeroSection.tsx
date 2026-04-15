import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/tropical-gummies.jpg";
import { BRAND_NAME, BRAND_PRODUCT_STATEMENT } from "@/lib/brand";

const HeroSection = () => (
  <section className="pt-28 pb-20 md:pt-36 md:pb-28">
    <div className="container">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="fade-in">
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-gold mb-6">
            Entourage Effect · Fast-Acting · Social & Sessionable
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading leading-[1.1] mb-6">
            The Gummy That Feels
            <br />
            <span className="text-gold">Like Smoking, Without the Smoke</span>
          </h1>
          <p className="text-lg font-body text-muted-foreground mb-4 max-w-lg">
            {BRAND_NAME} gummies combine an entourage-mimicking THC + CBD + terpene formulation with TiME INFUSION fast-acting delivery for an experience traditional edibles can't match.
          </p>
          <blockquote className="border-l-2 border-gold pl-4 my-6 max-w-lg">
            <p className="text-sm text-foreground italic leading-relaxed">
              "{BRAND_PRODUCT_STATEMENT}"
            </p>
          </blockquote>
          <p className="text-sm text-foreground mb-8">
            Feel the effects in <span className="text-gold font-bold">5–15 minutes</span>, not 90.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
              Shop Our Gummies <ArrowRight size={16} />
            </Link>
            <Link to="/explore-technology" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
              How It Works
            </Link>
          </div>
        </div>
        <div className="fade-in stagger-2 flex justify-center">
          <img src={heroImg} alt={`${BRAND_NAME} cannabis gummies, entourage effect meets fast-acting delivery`} width={500} height={500} className="rounded-2xl max-w-full" />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
