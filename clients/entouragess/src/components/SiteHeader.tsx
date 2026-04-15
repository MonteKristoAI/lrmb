import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import goldLogo from "@/assets/Entourage_gold_logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Effects", to: "/effects" },
  { label: "Science", to: "/explore-technology" },
  { label: "Reviews", to: "/#reviews" },
  { label: "FAQ", to: "/#faq" },
  
  { label: "Contact", to: "/contact" },
];

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);



  const handleNavClick = useCallback(
    (e: React.MouseEvent, to: string) => {
      if (to.includes("#")) {
        const [path, hash] = to.split("#");
        const targetPath = path || "/";
        if (location.pathname === targetPath) {
          e.preventDefault();
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          e.preventDefault();
          navigate(targetPath + "#" + hash);
        }
        setOpen(false);
      }
    },
    [location.pathname, navigate]
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-20">
          <Link to="/">
            <img src={goldLogo} alt="Entourage" className="h-12 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={(e) => handleNavClick(e, l.to)}
                className="text-sm font-subheading text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      {open && (
        <nav className="fixed inset-0 top-20 z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center gap-8 pt-16 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={(e) => { handleNavClick(e, l.to); setOpen(false); }}
              className="text-xl font-bold text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};

export default SiteHeader;
