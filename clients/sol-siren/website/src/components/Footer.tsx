import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.webp";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-16 py-16 md:py-20">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left: Logo + tagline */}
          <div className="space-y-4">
            <img src={logo} alt="Sol Siren Vintage" className="h-12 select-none" draggable={false} />
            <p className="font-body text-xs tracking-wide text-muted-foreground max-w-[240px]">
              Intentionally curated, soulful vintage outerwear.
            </p>
          </div>

          {/* Middle: Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">
                Quick Links
              </h4>
              <nav className="flex flex-col gap-3">
                {[
                  { label: "Shop", to: "/shop" },
                  { label: "Jewelry", to: "/jewelry" },
                  { label: "Gift Cards", to: "/gift-cards" },
                  { label: "Archive", to: "/archive" },
                  { label: "About", to: "/#about" },
                  { label: "Contact", to: "/#contact" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="font-body text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">
                Customer Care
              </h4>
              <nav className="flex flex-col gap-3">
                {[
                  { label: "Shipping & Returns", to: "/shipping-returns" },
                  { label: "FAQ", to: "/faq" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="font-body text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Right: Social + Contact */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">
                Connect
              </h4>
              <div className="flex items-center gap-4">
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors duration-300">
                  <Facebook size={18} />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={13} />
                <span className="font-body text-xs">hello@solsirenvintage.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={13} />
                <span className="font-body text-xs">Los Angeles, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-6 border-t border-border">
          <p className="font-body text-[10px] tracking-wide text-muted-foreground text-center">
            © {year} Sol Siren Vintage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
