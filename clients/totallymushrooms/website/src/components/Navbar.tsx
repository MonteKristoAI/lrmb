import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo-totally-mushrooms.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Science", to: "/science" },
  { label: "About", to: "/about" },
  { label: "Wholesale", to: "/wholesale" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      scrolled ? "bg-background/80 backdrop-blur-2xl border-b border-border/30" : "bg-transparent"
    }`}>
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="relative z-10 shrink-0">
          <img src={logo} alt="Totally Mushrooms" className={`transition-all duration-500 ${scrolled ? 'h-12' : 'h-16'}`} />
        </Link>

        <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm tracking-wide transition-colors duration-300 py-2 font-medium ${
                  isActive ? "text-primary" : "text-foreground/60 hover:text-foreground/90"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-px left-0 h-px bg-primary transition-all duration-500 ${isActive ? 'w-full' : 'w-0'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/quiz" className="hidden lg:block text-xs tracking-wide text-foreground/50 hover:text-primary transition-colors duration-300 uppercase font-medium">
            Find Your Protocol
          </Link>
          <Link to="/shop" className="hidden md:block">
            <Button size="sm" className="rounded-none text-xs tracking-[0.12em] font-semibold px-6 h-9 uppercase">
              Shop
            </Button>
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-foreground/70 hover:text-primary transition-colors duration-300"
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold animate-count-up">
                {totalItems}
              </span>
            )}
          </button>
          <button className="lg:hidden p-2 text-foreground/70" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/30 bg-background/98 backdrop-blur-2xl">
          <nav className="container flex flex-col py-8 gap-1">
            {navLinks.map((link) => {
              const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
              return (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`text-lg font-heading px-4 py-3 transition-colors ${isActive ? "text-primary" : "text-foreground/60"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border/30 mt-4 pt-4 px-4 space-y-3">
              <Link to="/quiz" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full rounded-none border-primary/30 text-primary text-sm tracking-wide">Find Your Protocol</Button>
              </Link>
              <Link to="/shop" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-none text-sm tracking-wide">Shop Now</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
