import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const GetInTouch = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[150px]" />

    <div className="container relative z-10 text-center max-w-3xl">
      <div className="flex justify-center mb-12">
        <div className="relative w-36 h-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border border-foreground/15" />
          <div className="absolute bottom-0 left-1 w-20 h-20 rounded-full border border-red-400/25" />
          <div className="absolute bottom-0 right-1 w-20 h-20 rounded-full border border-primary/30" />
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.0] mb-6">
        Bypass the Gauntlet.<br />
        <span className="text-gradient-gold italic">Master Your System.</span>
      </h2>

      <p className="text-foreground/60 max-w-md mx-auto mb-10 leading-relaxed text-base">
        Questions about products, wholesale partnerships, or the science? We are here.
      </p>

      <div className="flex justify-center gap-6">
        <Link to="/shop">
          <Button size="lg" className="rounded-none px-10 h-14 text-xs tracking-[0.12em] uppercase font-semibold gap-3 group glow-gold">
            Shop the Total Series
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Button>
        </Link>
        <Link to="/contact">
          <Button variant="outline" size="lg" className="rounded-none px-10 h-14 text-xs tracking-[0.12em] uppercase font-semibold border-foreground/20 hover:border-primary/40 text-foreground/70 hover:text-foreground">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default GetInTouch;
