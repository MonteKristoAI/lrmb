import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/data/companyInfo";
import { Phone, Menu, X } from "lucide-react";
import gsdLogo from "@/assets/gsd-logo.png";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToBooking = useCallback(() => {
    setMobileOpen(false);
    const el = document.getElementById("booking") || document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navigate = useNavigate();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);

      // Page routes like /services, /case-studies, /about
      if (href.startsWith("/") && !href.startsWith("/#")) {
        navigate(href);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Hash links like /#faq, /#contact or #booking
      const hash = href.includes("#") ? href.split("#")[1] : "";
      if (hash) {
        if (window.location.pathname !== "/") {
          navigate("/#" + hash);
        } else {
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [navigate]
  );

  return (
    <>
      {/* Skip to content */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          "bg-white/95 backdrop-blur-md border-b border-[hsl(214_20%_90%/0.5)]",
          scrolled && "shadow-sm"
        )}
      >
        <div className="mx-auto flex items-center justify-between h-20 lg:h-[88px] px-3 lg:px-4 max-w-[1440px]">
          {/* Logo — edge to edge, minimal padding */}
          <a href="/" className="shrink-0">
            <img src={gsdLogo} alt="GSD with AI" className="h-[72px] lg:h-[80px] w-auto" />
          </a>

          {/* Desktop Nav — center */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-[hsl(215_15%_46%)] hover:text-[hsl(220_25%_14%)] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-[hsl(215_15%_46%)] hover:text-[hsl(220_25%_14%)] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{COMPANY.phone}</span>
            </a>
            <button
              onClick={scrollToBooking}
              className={cn(
                "bg-[hsl(175_72%_38%)] text-white font-semibold text-sm px-5 py-2.5 rounded-lg",
                "transition-all hover:brightness-110 hover:shadow-md"
              )}
            >
              Book a Call
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[hsl(220_25%_14%)] hover:text-[hsl(175_72%_38%)] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile slide-down panel */}
      <div
        className={cn(
          "fixed left-0 right-0 top-16 z-[49] lg:hidden",
          "bg-white border-b border-[hsl(214_20%_90%)] shadow-lg",
          "transition-all duration-300 ease-in-out overflow-hidden",
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="flex flex-col px-6 py-6 gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-base font-medium text-[hsl(215_15%_46%)] hover:text-[hsl(220_25%_14%)] hover:bg-[hsl(210_25%_97%)] rounded-lg px-4 py-3 transition-colors"
            >
              {link.label}
            </a>
          ))}

          <hr className="my-3 border-[hsl(214_20%_90%)]" />

          <a
            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm text-[hsl(215_15%_46%)] px-4 py-3"
          >
            <Phone className="w-4 h-4" />
            {COMPANY.phone}
          </a>

          <button
            onClick={scrollToBooking}
            className="mt-2 w-full bg-[hsl(175_72%_38%)] text-white font-semibold text-sm px-5 py-3 rounded-lg transition-all hover:brightness-110"
          >
            Book a Call
          </button>
        </nav>
      </div>
    </>
  );
}
