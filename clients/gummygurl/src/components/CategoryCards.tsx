import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import catThc from "@/assets/product-fubar-packaging.webp";
import catThcaFlower from "@/assets/cat-thca-flower.webp";
import catMushroom from "@/assets/product-megadose-mushroom-packaging.webp";
import catWellness from "@/assets/product-cbn-sleep-gummy-packaging.webp";
import catPet from "@/assets/product-peanut-butter-pet-treat-packaging.webp";

interface Category {
  title: string;
  slug: string;
  description: string;
  cta: string;
  image: string;
  keynotes?: string[];
}

const categories: Category[] = [
  {
    title: "Hemp-Derived THC",
    slug: "thc-edibles",
    description:
      "Delta-8, Delta-9, and CBD gummies, chocolates, edibles, and drink mixes — lab-tested and legally compliant.",
    cta: "Explore THC",
    image: catThc,
  },
  {
    title: "THCA Flower",
    slug: "thca-flower",
    description:
      "High-quality hemp flower naturally rich in THCA — delivering classic cannabis terpene profiles and potency while remaining federally compliant.",
    cta: "Shop THCA Flower",
    image: catThcaFlower,
  },
  {
    title: "Mushroom Products",
    slug: "mushroom-products",
    description:
      "Innovative mushroom-based products crafted to deliver unique sensory experiences using carefully selected, legally compliant compounds.",
    cta: "Shop Mushroom",
    image: catMushroom,
    keynotes: ["Legal Formulations", "Lab Tested", "COA Available"],
  },
  {
    title: "Health & Wellness",
    slug: "health-wellness",
    description:
      "Functional supplements and plant-based wellness products designed to support everyday balance, recovery, and overall well-being.",
    cta: "Browse Wellness",
    image: catWellness,
    keynotes: ["Lab Tested", "Quality Ingredients", "COA Available"],
  },
  {
    title: "Pet Products",
    slug: "pet-wellness",
    description:
      "CBD pet treats and wellness formulas crafted to support calm, comfort, and everyday pet wellness.",
    cta: "Shop Pet Care",
    image: catPet,
  },
];

export default function CategoryCards() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-14 lg:py-20 relative overflow-hidden bg-secondary/40">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 block text-primary">
            Product Categories
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
            From hemp-derived cannabinoids to mushroom products, wellness supplements, and pet CBD — find what works for you.
          </p>
        </div>

        {/* Top row: 3 cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 scroll-fade ${isVisible ? "visible" : ""}`}>
          {categories.slice(0, 3).map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>

        {/* Bottom row: 2 cards centered */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto scroll-fade ${isVisible ? "visible" : ""}`}>
          {categories.slice(3).map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      to={`/shop?category=${cat.slug}`}
      className="group relative rounded-2xl overflow-hidden border border-border flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated bg-card"
    >
      {/* Image - proper aspect ratio, no clipping */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={cat.image}
          alt={cat.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Category label overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-lg font-bold text-white drop-shadow-md">
            {cat.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
          {cat.description}
        </p>
        {cat.keynotes ? (
          <div className="flex items-center gap-3 mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground flex-wrap">
            {cat.keynotes.map((note, i) => (
              <span key={note} className="flex items-center gap-3">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-border" />}
                {note}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            <span>Lab Tested</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Legal Hemp</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>COA Available</span>
          </div>
        )}
        <Button
          size="default"
          className="w-full font-semibold text-sm transition-all duration-300 group-hover:shadow-lg"
        >
          {cat.cta}
        </Button>
      </div>
    </Link>
  );
}
