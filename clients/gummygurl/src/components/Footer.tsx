import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";
import { BRAND } from "@/data/brandData";
import { COMPLIANCE_NOTICES } from "@/data/brandData";

export default function Footer() {
  return (
    <>
      <footer style={{ background: "hsl(220 25% 12%)", color: "hsl(0 0% 92%)" }}>
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <span className="font-bold text-xl mb-4 block">{BRAND.name}</span>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                {BRAND.description}
              </p>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/gummygurl704/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/30 flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/people/Gummy-Gurl/61580771769880/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/30 flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2.5">
                {["All Products", "Hemp THC", "THCA Flower", "Mushroom Products", "Wellness", "Pet CBD"].map((link) => (
                  <li key={link}>
                    <Link
                      to="/shop"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About Us", to: "/#about" },
                  { label: "Blog", to: "/blog", external: true },
                  { label: "Contact", to: "/contact" },
                ].map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.to}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-white/50">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "hsl(210 80% 70%)" }} />
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {BRAND.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-white/50">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: "hsl(210 80% 70%)" }} />
                  <a
                    href="tel:+19784063946"
                    className="hover:text-white transition-colors"
                  >
                    (978) 406-3946
                  </a>
                </li>
              </ul>
              <p className="text-xs text-white/30 mt-6">
                {BRAND.name} · {BRAND.address}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6">
            <p className="text-[10px] text-white/30 text-center mb-6 max-w-3xl mx-auto leading-relaxed">
              THCA Disclaimer: Does not ship to states where THC-A is illegal. This product is not available for shipment to the following states: Arkansas, Idaho, Minnesota, Oregon, Rhode Island, and Texas.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-white/35">
                © {new Date().getFullYear()} {BRAND.company}. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-white/35">
                <a href="/privacy-policy" className="hover:text-white/60 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="hover:text-white/60 transition-colors">
                  Terms of Service
                </a>
                <a href="/shipping-policy" className="hover:text-white/60 transition-colors">
                  Shipping Policy
                </a>
                <a href="/return-policy" className="hover:text-white/60 transition-colors">
                  Return Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
