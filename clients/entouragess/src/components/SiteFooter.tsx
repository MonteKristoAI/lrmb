import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import goldLogo from "@/assets/Entourage_gold_logo.png";
import FarmBillBanner from "@/components/FarmBillBanner";

const SiteFooter = () => (
  <>
    <footer className="py-20 section-divider">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <img src={goldLogo} alt="Entourage" className="h-10 w-auto" />
            </Link>
            <p className="text-xs font-body text-muted-foreground leading-relaxed mb-4">
              Premium cannabis gummies with three distinct effects: Relaxed, Balanced, and Uplifted. Powered by TiME INFUSION fast acting delivery.
            </p>
            <div className="flex gap-3">
              <a href="mailto:info@getentouragegummies.com" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors"><Mail size={16} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Products</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/shop" className="text-xs text-muted-foreground hover:text-effect-relaxed transition-colors">Relaxed</Link></li>
              <li><Link to="/shop" className="text-xs text-muted-foreground hover:text-effect-balanced transition-colors">Balanced</Link></li>
              <li><Link to="/shop" className="text-xs text-muted-foreground hover:text-effect-uplifted transition-colors">Uplifted</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Learn</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/explore-technology" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Our Science</Link></li>
              <li><Link to="/effects" className="text-xs text-muted-foreground hover:text-foreground transition-colors">The Entourage Effect</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Shipping Policy</Link></li>
              <li><Link to="/copyright-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Copyright Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved. Must be 21+ to purchase cannabis products.</p>
        </div>
      </div>
    </footer>
    <FarmBillBanner />
  </>
);

export default SiteFooter;
