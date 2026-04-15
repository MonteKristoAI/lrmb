import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FindYourEffect = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24" ref={ref}>
      <div className="container text-center max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-3 h-3 rounded-full bg-effect-relaxed" />
          <div className="w-3 h-3 rounded-full bg-effect-balanced" />
          <div className="w-3 h-3 rounded-full bg-effect-uplifted" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-6">
          Find Your <span className="text-gold">Effect</span>
        </h2>
        <p className="text-muted-foreground mb-10">
          Relaxed. Balanced. Uplifted. Every gummy is designed to deliver a specific, predictable experience.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full gold-gradient text-primary-foreground font-bold hover:opacity-90 transition-opacity"
        >
          Shop Now <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default FindYourEffect;
