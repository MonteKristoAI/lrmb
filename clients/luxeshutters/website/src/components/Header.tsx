import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/data/clinicData";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  
  { label: "Blog", href: "/blog/", anchor: true },
  { label: "About", href: "/#about", anchor: true },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isDark = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const scrollToBooking = () => {
    if (location.pathname === "/") {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#booking");
    }
  };

  return (
    <header className={`fixed left-0 right-0 z-50 transition-all duration-300 top-0 lg:top-[44px] ${isDark ? "bg-[#F0F4F8] shadow-soft" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex flex-col">
            <span className={`font-serif font-bold text-xl leading-tight transition-colors duration-300 ${isDark ? "text-[#1a2332]" : "text-white"}`}>{CLINIC.name}</span>
            <span className={`text-[10px] tracking-widest uppercase hidden sm:block transition-colors duration-300 ${isDark ? "text-[#6b7d8e]" : "text-white/60"}`}>Shutters · Blinds · Curtains</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            item.anchor ? (
              <a key={item.label} href={item.href} className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${isDark ? "text-[#2B3540] hover:text-primary" : "text-white/90 hover:text-white"}`}>{item.label}</a>
            ) : (
              <Link key={item.label} to={item.href} className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${isDark ? "text-[#2B3540] hover:text-primary" : "text-white/90 hover:text-white"}`}>{item.label}</Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`} className={`flex items-center gap-1.5 text-sm transition-colors ${isDark ? "text-[#2B3540] hover:text-primary" : "text-white/90 hover:text-white"}`}><Phone className="w-3.5 h-3.5" />{CLINIC.phone}</a>
          <Button size="default" onClick={scrollToBooking} className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">Get a Free Quote</Button>
        </div>

        <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border animate-fade-in">
          <nav className="container mx-auto py-4 px-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
              item.anchor ? (
                <a key={item.label} href={item.href} className="px-4 py-3 text-left text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">{item.label}</a>
              ) : (
                <Link key={item.label} to={item.href} className="px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">{item.label}</Link>
              )
            )}
            <div className="border-t border-border mt-2 pt-3">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium" onClick={scrollToBooking}>Get a Free Quote</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}