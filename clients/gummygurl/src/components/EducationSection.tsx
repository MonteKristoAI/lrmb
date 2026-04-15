import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import eduThc from "@/assets/edu-thc.webp";
import eduCbd from "@/assets/edu-cbd.webp";
import eduPet from "@/assets/edu-pet.webp";
import eduMushroom from "@/assets/edu-mushroom.webp";

const educationCards: { title: string; text: string; note?: string; image?: string }[] = [
  {
    title: "Delta-8 & Delta-9 (Hemp-Derived)",
    text: "Hemp-derived cannabinoids such as Delta-8 and compliant Delta-9 THC are federally regulated under the 2018 Farm Bill. Products meet legal THC thresholds and are lab verified.",
    image: eduThc,
  },
  {
    title: "CBD Products",
    text: "CBD is a non-intoxicating cannabinoid derived from hemp. Available in edibles, tinctures, capsules, and topicals, each product is third-party tested and COA verified.",
    image: eduCbd,
  },
  {
    title: "Wellness & Pet Products",
    text: "Plant-based wellness supplements and CBD pet treats are crafted under strict compliance standards and ship only where legally permitted.",
    image: eduPet,
  },
  {
    title: "Legal Mushroom Products",
    text: "Innovative mushroom-based formulations designed to deliver unique sensory experiences using carefully selected, legally compliant ingredients. Products are third-party tested and 50 State Legal.",
    note: "These are not functional mushrooms but legal alternatives to psilocybin.",
    image: eduMushroom,
  },
];

export default function EducationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative pt-6 md:pt-8 lg:pt-10 pb-28 lg:pb-36 overflow-hidden bg-background">
      <div className={`container mx-auto px-4 lg:px-8 relative z-10 scroll-fade ${isVisible ? "visible" : ""}`}>
        <div className="max-w-2xl mb-16">
          <span
            className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-6 block"
            style={{ color: "hsl(217 91% 50%)" }}
          >
            Hemp Education
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.2] mb-6 text-foreground">
            Understanding Hemp-Derived Products
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Learn the differences between Delta-8, Delta-9, CBD, and wellness products so you can choose confidently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {educationCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 bg-card border border-border"
              style={{
                borderLeft: "2px solid hsl(217 91% 50%)",
              }}
            >
              {card.image && (
                <OptimizedImage
                  src={card.image}
                  alt={card.title}
                  aspectRatio="16/10"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="px-8 py-8">
                <h3 className="text-[15px] font-semibold mb-3 text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.text}
                </p>
                {card.note && (
                  <p className="text-xs leading-relaxed text-muted-foreground/70 italic mt-3 pt-3 border-t border-border">
                    {card.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 text-primary"
          >
            Explore All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
