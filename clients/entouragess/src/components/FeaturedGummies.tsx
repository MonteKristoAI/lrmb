import { Link } from "react-router-dom";
import tropicalImg from "@/assets/tropical-gummies.jpg";
import citrusImg from "@/assets/citrus-gummies.jpg";
import berryImg from "@/assets/berry-gummies.jpg";

const products = [
  { img: tropicalImg, badge: "Best Seller", badgeClass: "gold-gradient text-primary-foreground", title: "Tropical Bliss Gummies", desc: "Fast-acting tropical gummies, 5–15 min onset", price: "$25.00", rating: "4.9", reviews: "187" },
  { img: citrusImg, badge: "New", badgeClass: "bg-emerald-600 text-foreground", title: "Citrus Sunrise Gummies", desc: "Citrus gummies with predictable, controlled effects", price: "$25.00", rating: "4.8", reviews: "112" },
  { img: berryImg, badge: null, badgeClass: "", title: "Berry Burst Gummies", desc: "Mixed berry medley, fast-acting formula, 10mg Delta-9-THC", price: "$25.00", rating: "4.7", reviews: "98" },
];

const FeaturedGummies = () => (
  <section id="shop" className="py-20">
    <div className="container">
      <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
        <div className="fade-in">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Gummies</h2>
          <p className="text-sm text-muted-foreground mt-2">Fast-acting favorites powered by TiME INFUSION technology.</p>
        </div>
        <Link to="/shop" className="text-sm font-semibold border border-border rounded-lg px-4 py-2 text-foreground hover:bg-secondary transition-colors fade-in">
          View All →
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <article key={p.title} className={`bg-card border border-border rounded-xl overflow-hidden card-hover fade-in stagger-${i + 1}`}>
            <div className="aspect-[4/3] overflow-hidden">
              <img src={p.img} alt={p.title} loading="lazy" width={400} height={300} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              {p.badge && (
                <span className={`inline-block text-[0.6875rem] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${p.badgeClass}`}>
                  {p.badge}
                </span>
              )}
              <h3 className="font-bold text-foreground mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gold">{p.price}</span>
                <div className="flex items-center gap-1 text-xs">
                  <span className="stars-color">★★★★★</span>
                  <span className="text-foreground font-medium">{p.rating}</span>
                  <span className="text-muted-foreground">({p.reviews})</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedGummies;
