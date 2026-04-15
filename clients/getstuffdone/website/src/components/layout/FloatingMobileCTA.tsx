import { COMPANY } from "@/data/companyInfo";
import { Phone, Calendar } from "lucide-react";

export default function FloatingMobileCTA() {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white shadow-[0_-2px_10px_rgb(0_0_0/0.06)] lg:hidden">
      <div className="container flex items-center gap-3 py-3">
        {/* Call Us */}
        <a
          href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2.5 font-heading text-sm font-semibold text-foreground transition-colors hover:border-[hsl(175_72%_38%/0.4)] hover:text-[hsl(175_72%_38%)]"
        >
          <Phone className="h-4 w-4" />
          Call Us
        </a>

        {/* Book a Call */}
        <button
          onClick={scrollToBooking}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[hsl(175_72%_38%)] py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-[hsl(175_72%_32%)]"
        >
          <Calendar className="h-4 w-4" />
          Book a Call
        </button>
      </div>
    </div>
  );
}
