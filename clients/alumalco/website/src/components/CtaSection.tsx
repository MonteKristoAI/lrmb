import { Phone, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/data/businessData";

const CtaSection = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_60%)]" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-6">
          Get Started Today
        </span>

        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Ready to Transform{" "}
          <span className="text-gradient-warm">Your Space?</span>
        </h2>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          From custom aluminium facades to precision glazing — let's bring your
          vision to life. Reach out for a free consultation and quote.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-lg"
          >
            <a href="/#quote" onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("quote");
              if (el) { el.scrollIntoView({ behavior: "smooth" }); }
              else { window.location.href = "/#quote"; }
            }}>
              Book a Consultation <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary/30 text-primary hover:bg-primary/10 text-base px-8 py-6 rounded-lg"
          >
            <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}>
              <Phone className="w-4 h-4 mr-2" /> {BUSINESS.phone}
            </a>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{BUSINESS.address}</span>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
