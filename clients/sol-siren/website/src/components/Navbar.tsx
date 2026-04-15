import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.webp";
import { useCart } from "@/contexts/CartContext";

const shopCategories = [
  { label: "Fur", to: "/shop?category=fur" },
  { label: "Leather", to: "/shop?category=leather" },
  { label: "Penny Lane / Afghan", to: "/shop?category=penny-lane-afghan" },
  { label: "Overcoat", to: "/shop?category=overcoat" },
  { label: "Apres Ski", to: "/shop?category=apres-ski" },
  { label: "Jewelry", to: "/jewelry" },
  { label: "Gift Cards", to: "/gift-cards" },
  { label: "Archive", to: "/archive" },
];

const Navbar = () => {
  const { count, openCart } = useCart();
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (isHome && location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isHome, location.hash]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const linkClass =
    "relative font-body text-xs tracking-ultra-wide uppercase text-foreground/80 hover:text-foreground transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-foreground after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left";

  const mobileLinkClass =
    "block font-body text-sm tracking-ultra-wide uppercase text-foreground/80 hover:text-foreground transition-colors duration-300 py-3";

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-16 py-4 transition-all duration-300 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
        {/* Logo */}
        <Link to="/" onClick={handleHomeClick}>
          <img
            src={logo}
            alt="Sol Siren Vintage"
            className="h-14 md:h-16 ml-2 md:ml-6 select-none"
            draggable={false}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 md:gap-12">
          <Link to="/" onClick={handleHomeClick} className={linkClass}>
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              to="/shop"
              className={linkClass}
            >
              Shop
            </Link>
            <AnimatePresence>
              {shopOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                >
                  <div className="bg-background border border-border shadow-sm min-w-[180px] py-2">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.to}
                        to={cat.to}
                        onClick={() => {
                          setShopOpen(false);
                        }}
                        className="block px-5 py-2.5 font-body text-[11px] tracking-wide uppercase text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { label: "About", to: "/#about" },
            { label: "Blog", to: "/blog" },
            { label: "Contact", to: "/#contact" },
          ].map((item) => {
            if (item.to.startsWith("/#")) {
              const sectionId = item.to.slice(2);
              return (
                <Link key={item.label} to={`/${item.to.slice(1)}`} onClick={handleSectionClick(sectionId)} className={linkClass}>
                  {item.label}
                </Link>
              );
            }
            return (
              <Link key={item.label} to={item.to} className={linkClass}>
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={openCart}
            className="relative text-foreground/80 hover:text-foreground transition-colors duration-300"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-foreground text-primary-foreground font-body text-[9px] font-medium rounded-full"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>

        {/* Mobile: Shop + Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-5">
          <Link
            to="/shop"
            className={linkClass}
          >
            Shop
          </Link>

          <button
            onClick={openCart}
            className="relative text-foreground/80 hover:text-foreground transition-colors duration-300"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-foreground text-primary-foreground font-body text-[9px] font-medium rounded-full"
              >
                {count}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground/80 hover:text-foreground transition-colors duration-300"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[72px] left-0 right-0 z-[55] bg-background border-b border-border shadow-md px-8 py-6 md:hidden"
          >
            <Link to="/" onClick={(e) => { handleHomeClick(e); setMobileOpen(false); }} className={mobileLinkClass}>
              Home
            </Link>

            {shopCategories.map((cat) => (
              <Link
                key={cat.to}
                to={cat.to}
                onClick={() => { setMobileOpen(false); }}
                className={`${mobileLinkClass} pl-4 text-xs`}
              >
                {cat.label}
              </Link>
            ))}

            <Link to="/#about" onClick={handleSectionClick("about")} className={mobileLinkClass}>
              About
            </Link>
            <Link to="/blog" onClick={() => { setMobileOpen(false); }} className={mobileLinkClass}>
              Blog
            </Link>
            <Link to="/#contact" onClick={handleSectionClick("contact")} className={mobileLinkClass}>
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
