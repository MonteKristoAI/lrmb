import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { BUSINESS } from "@/data/businessData";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              {BUSINESS.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Premium aluminium solutions for modern architecture. Crafted with
              precision, built to last.
            </p>
            <div className="flex flex-wrap gap-2">
              {BUSINESS.trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                {BUSINESS.address}
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-5">
              Business Hours
            </h4>
            <ul className="space-y-3 text-sm">
              {BUSINESS.hours.map((h) => (
                <li
                  key={h.day}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span>
                    <span className="text-foreground font-medium">{h.day}</span>
                    <br />
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © {year} {BUSINESS.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
