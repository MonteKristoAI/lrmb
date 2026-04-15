import { Phone } from "lucide-react";
import { CLINIC } from "@/data/clinicData";
import { Button } from "@/components/ui/button";

export default function StickyCallBar() {
  const phoneHref = `tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="hidden lg:block fixed top-0 left-0 right-0 z-[60] bg-foreground text-primary-foreground shadow-soft">
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8 py-2">
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-accent" />
          <a href={phoneHref} className="font-semibold text-sm hover:text-accent transition-colors">
            {CLINIC.phone}
          </a>
          <span className="text-xs text-primary-foreground/60 hidden xl:inline">
            — Premium Shutters, Blinds & Curtains
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-primary-foreground/50 hidden xl:inline">
            Serving Regional NSW
          </span>
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 text-xs font-semibold">
            <a href={phoneHref}>Call Now</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
