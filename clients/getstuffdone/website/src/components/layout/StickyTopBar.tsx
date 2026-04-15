import { COMPANY } from "@/data/companyInfo";
import { Phone } from "lucide-react";

export default function StickyTopBar() {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hidden lg:block fixed top-0 left-0 right-0 z-[60] bg-[hsl(220_25%_4%)] border-b border-white/5">
      <div className="container flex items-center justify-between h-[44px]">
        {/* Left: Phone */}
        <a
          href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-xs font-body text-white/60 hover:text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-gold" />
          <span>{COMPANY.phone}</span>
        </a>

        {/* Center: Tagline */}
        <p className="text-xs font-body text-white/50 hidden md:block">
          {COMPANY.tagline}
        </p>

        {/* Right: Book Now */}
        <button
          onClick={scrollToBooking}
          className="bg-gold text-gold-foreground hover:bg-gold-light font-heading font-semibold text-xs px-4 py-1.5 rounded-md transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
