import { Phone, CalendarDays } from "lucide-react";
import { CLINIC } from "@/data/clinicData";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function FloatingCallButton() {
  const phoneHref = `tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`;
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToBooking = () => {
    if (location.pathname === "/") {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#booking");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex gap-3">
      <Button asChild className="flex-1 h-12 text-base font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft">
        <a href={phoneHref}>
          <Phone className="w-5 h-5" />
          Call us
        </a>
      </Button>
      <Button
        variant="outline"
        className="flex-1 h-12 text-base font-semibold gap-2 border-2 border-border"
        onClick={scrollToBooking}
      >
        <CalendarDays className="w-5 h-5" />
        Consultation
      </Button>
    </div>
  );
}
