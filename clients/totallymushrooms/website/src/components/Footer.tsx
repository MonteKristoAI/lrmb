import { Link } from "react-router-dom";
import logo from "@/assets/logo-totally-mushrooms.png";

const Footer = () => (
  <footer className="border-t border-border/25 relative">
    <div className="container py-20 md:py-28">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-light leading-[1.1] text-foreground/25">
          Bypass the Gauntlet.
          <br />
          <span className="text-foreground/35 italic">Master Your System.</span>
        </h2>
      </div>
    </div>

    <div className="container pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8">
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <img src={logo} alt="Totally Mushrooms" className="h-12 mb-5 opacity-70" />
          <p className="text-sm text-foreground/50 leading-relaxed max-w-xs">
            Clinical-grade bioactives delivered with unrivaled precision. Totally Mushrooms, LLC. Nashville, TN.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-5 font-medium">Shop</h4>
          <nav className="flex flex-col gap-3">
            {[
              { label: "Total Neuro", to: "/product/total-neuro" },
              { label: "Total Velocity", to: "/product/total-velocity" },
              { label: "Total Aegis", to: "/product/total-aegis" },
              { label: "All Products", to: "/shop" },
              { label: "Find Your Protocol", to: "/quiz" },
            ].map(({ label, to }) => (
              <Link key={label} to={to} className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors duration-300">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-5 font-medium">Company</h4>
          <nav className="flex flex-col gap-3">
            {[
              { label: "Our Science", to: "/science" },
              { label: "About", to: "/about" },
              { label: "Journal", to: "/blog" },
              { label: "Wholesale", to: "/wholesale" },
              { label: "Contact", to: "/contact" },
            ].map(({ label, to }) => (
              <Link key={label} to={to} className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors duration-300">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-5 font-medium">Legal</h4>
          <nav className="flex flex-col gap-3">
            {["Privacy Policy", "Terms of Service", "Refund Policy", "Shipping"].map((item) => (
              <span key={item} className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors duration-300 cursor-pointer">
                {item}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>

    <div className="border-t border-border/20">
      <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          {[
            { label: "Instagram", href: "https://instagram.com/totallymushrooms" },
            { label: "TikTok", href: "https://tiktok.com/@totally.mushrooms" },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.15em] text-foreground/40 hover:text-primary transition-colors duration-300 font-medium">
              {label}
            </a>
          ))}
        </div>
        <span className="text-xs text-foreground/35">
          &copy; 2026 Totally Mushrooms, LLC. These statements have not been evaluated by the FDA.
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
