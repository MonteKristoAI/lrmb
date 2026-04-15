import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Truck, ChevronDown, Instagram, Facebook, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";
import type { EffectTag } from "@/lib/productService";

const ALL_EFFECTS: EffectTag[] = ["Unwind", "Social", "Sleep", "Relief", "Recovery", "Uplift", "Clarity", "Intimacy", "Performance"];

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/shop", hasDropdown: true },
  { label: "Blog", href: "/blog", external: true },
  { label: "Subscriptions", href: "/#subscribe", anchor: true },
  { label: "Lab Reports", href: "/lab-results" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const accountLink = user ? "/account" : "/login";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.anchor) {
      const anchorId = item.href.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(item.href);
      }
    }
  };

  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs sm:text-sm font-medium tracking-wide">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 shrink-0" />
          <span>Free shipping on orders over $99</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-soft" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between py-3.5 px-4 lg:px-8">
          {/* Left — Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={new URL("@/assets/logo-gummygurl.webp", import.meta.url).href}
              alt="Gummy Gurl"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Center — Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {NAV_ITEMS.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                  >
                    <Link
                      to="/shop"
                      className="px-4 py-2.5 text-[15px] font-medium transition-colors rounded-lg text-foreground/70 hover:text-primary inline-flex items-center gap-1"
                    >
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                    </Link>

                    {productsOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                        <div className="w-[480px] bg-white rounded-xl shadow-elevated border border-border p-5 animate-fade-in">
                          {/* Categories */}
                          <div className="mb-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Categories</p>
                            <div className="grid grid-cols-2 gap-1">
                              {PRODUCT_CATEGORIES.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  to={`/shop?category=${cat.slug}`}
                                  onClick={() => setProductsOpen(false)}
                                  className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                                >
                                  {cat.label}
                                  {cat.comingSoon && <span className="ml-1.5 text-[9px] text-muted-foreground">✦ Soon</span>}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-border mb-4" />

                          {/* Effects */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Shop by Effect</p>
                            <div className="flex flex-wrap gap-1.5">
                              {ALL_EFFECTS.map((eff) => (
                                <Link
                                  key={eff}
                                  to={`/shop?effect=${eff}`}
                                  onClick={() => setProductsOpen(false)}
                                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors"
                                >
                                  {eff}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* View All */}
                          <div className="border-t border-border mt-4 pt-3">
                            <Link
                              to="/shop"
                              onClick={() => setProductsOpen(false)}
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              View All Products →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.anchor) {
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className="px-4 py-2.5 text-[15px] font-medium transition-colors rounded-lg text-foreground/70 hover:text-primary"
                  >
                    {item.label}
                  </button>
                );
              }

              if ('external' in item && item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2.5 text-[15px] font-medium transition-colors rounded-lg text-foreground/70 hover:text-primary"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2.5 text-[15px] font-medium transition-colors rounded-lg text-foreground/70 hover:text-primary"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right — Social + Cart + CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <CartDrawer />
            <Button size="lg" onClick={() => navigate(user ? "/shop" : "/login")} className="font-semibold text-[15px] bg-primary hover:bg-primary/90">
              {user ? "Shop Now" : "Sign In"}
            </Button>
            <Link to={accountLink} className="p-1.5 rounded-full text-foreground/50 hover:text-primary transition-colors" aria-label="Account">
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile — Cart + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <CartDrawer />
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-border animate-fade-in">
            <nav className="container mx-auto py-4 px-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div key={item.label}>
                      <Link
                        to="/shop"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors block"
                      >
                        {item.label}
                      </Link>
                      <div className="pl-6 space-y-0.5">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/shop?category=${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors block"
                          >
                            {cat.label}{cat.comingSoon ? " ✦" : ""}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (item.anchor) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleNavClick(item);
                        setMobileOpen(false);
                      }}
                      className="px-4 py-3 text-left text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {item.label}
                    </button>
                  );
                }

                if ('external' in item && item.external) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to={accountLink}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                My Account
              </Link>
              <div className="border-t border-border mt-2 pt-3">
                <Button className="w-full font-medium" onClick={() => { navigate(user ? "/shop" : "/login"); setMobileOpen(false); }}>
                  {user ? "Shop Now" : "Sign In"}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
