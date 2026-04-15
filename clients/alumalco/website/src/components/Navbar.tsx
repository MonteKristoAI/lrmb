import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { products } from "@/data/productsData";
import { portfolioProjects } from "@/data/portfolioData";

const navLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "Products", href: "/products", isRoute: true, hasDropdown: true, dropdownType: "products" as const },
  { label: "Portfolio", href: "/portfolio", isRoute: true, hasDropdown: true, dropdownType: "portfolio" as const },
  { label: "About", href: "/about", isRoute: true },
  { label: "Blog", href: "/blog", isRoute: true },
  { label: "Contact", href: "/contact", isRoute: true },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToQuote = () => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById("quote");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#quote");
      setTimeout(() => {
        const el = document.getElementById("quote");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const getDropdownItems = (type: string) => {
    if (type === "products") {
      return products.map((p) => ({
        id: p.id,
        label: p.name,
        sublabel: p.category,
        href: `/products#${p.id}`,
      }));
    }
    if (type === "portfolio") {
      return portfolioProjects.map((p) => ({
        id: p.id,
        label: p.title,
        sublabel: p.location,
        href: `/portfolio#${p.id}`,
      }));
    }
    return [];
  };

  const getViewAllLink = (type: string) => {
    if (type === "products") return { href: "/products", label: "View All Products" };
    if (type === "portfolio") return { href: "/portfolio", label: "View All Projects" };
    return null;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-20 px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Alumalco
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.dropdownType!)}
              onMouseLeave={() => link.hasDropdown && setOpenDropdown(null)}
            >
              {link.hasDropdown ? (
                <>
                  <Link to={link.href} className="story-link text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1">
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === link.dropdownType ? "rotate-180" : ""}`}
                    />
                  </Link>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                      openDropdown === link.dropdownType
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="bg-background border border-border/60 shadow-xl rounded-sm min-w-[260px] overflow-hidden">
                      {getDropdownItems(link.dropdownType!).map((item) => (
                        <Link
                          key={item.id}
                          to={item.href}
                          className="group flex items-center gap-3 px-5 py-3.5 transition-all duration-300 hover:bg-primary/5 hover:pl-7 border-b border-border/30 last:border-b-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />
                          <div>
                            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 block leading-none mb-1">
                              {item.sublabel}
                            </span>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                              {item.label}
                            </span>
                          </div>
                        </Link>
                      ))}

                      {/* View All */}
                      {(() => {
                        const viewAll = getViewAllLink(link.dropdownType!);
                        return viewAll ? (
                          <Link
                            to={viewAll.href}
                            className="block text-center py-3 text-xs uppercase tracking-[0.15em] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-t border-border/50"
                          >
                            {viewAll.label}
                          </Link>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </>
              ) : link.isRoute ? (
                <Link
                  to={link.href}
                  className="story-link text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="story-link text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-6">
          <a
            href="tel:18558266799"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" />
            1 (855) 826-6799
          </a>
          <button
            onClick={scrollToQuote}
            className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            Get a Free Quote
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.label}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === link.dropdownType ? null : link.dropdownType!)
                    }
                    className="flex items-center gap-1 text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors w-full"
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === link.dropdownType ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openDropdown === link.dropdownType ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-4 flex flex-col gap-2 border-l-2 border-primary/30">
                      {getDropdownItems(link.dropdownType!).map((item) => (
                        <Link
                          key={item.id}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <hr className="border-border" />
            <a
              href="tel:18558266799"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Phone className="w-4 h-4" />
              1 (855) 826-6799
            </a>
            <button
              onClick={scrollToQuote}
              className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-center w-full"
            >
              Get a Free Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
