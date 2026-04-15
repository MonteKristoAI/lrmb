import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AboutTime = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 section-divider" ref={ref}>
      <div className="container max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-8">
          It's About <span className="text-gold">TiME</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
          TiME INFUSION is the infusion process that wraps each individual cannabinoid and terpene molecule in a hydrophilic coating. This allows your body to absorb it through soft tissues in minutes, not hours.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
          The result is a faster, lighter, more predictable experience with significantly higher bioavailability than traditional edibles.
        </p>
        <div className="flex flex-col items-center gap-8">
          <img src="/images/time-infusion-badge.jpg" alt="Powered by TiME INFUSION" className="h-20 w-20 object-contain" loading="lazy" />
          <Link
            to="/explore-technology"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Explore the Science <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutTime;
