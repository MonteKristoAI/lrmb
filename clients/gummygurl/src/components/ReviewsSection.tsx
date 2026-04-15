import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import OptimizedImage from "@/components/OptimizedImage";
import sectionReviews from "@/assets/section-reviews.webp";

const reviews = [
  {
    name: "Sarah M.",
    location: "Charlotte, NC",
    rating: 5,
    text: "The Delta-8 gummies are exactly what I was looking for. Lab tested, great taste, and I love that COAs are right on the product page.",
    product: "Delta-8 Chill Gummies",
  },
  {
    name: "Jason T.",
    location: "Austin, TX",
    rating: 5,
    text: "Finally a brand that's upfront about compliance. Ordered the CBD oil and it arrived fast in discreet packaging. Will definitely reorder.",
    product: "CBD Oil 500mg",
  },
  {
    name: "Maria L.",
    location: "Denver, CO",
    rating: 5,
    text: "My dog has been so much calmer since starting the CBD chews. I appreciate that everything is third-party tested — that matters to me as a pet parent.",
    product: "CBD Dog Chews",
  },
  {
    name: "David K.",
    location: "Raleigh, NC",
    rating: 4,
    text: "Good quality Delta-9 tincture. The fact that it's Farm Bill compliant and they show the lab results gives me confidence in what I'm buying.",
    product: "Delta-9 Night Tincture",
  },
  {
    name: "Ashley R.",
    location: "Atlanta, GA",
    rating: 5,
    text: "Love the recovery capsules for post-workout. Clean ingredients, no weird fillers. Gummy Gurl is my go-to wellness brand now.",
    product: "Recovery Capsules",
  },
  {
    name: "Chris P.",
    location: "Nashville, TN",
    rating: 5,
    text: "Shipped to my state no problem. Appreciate the transparency around what's in each product. The CBD gummies taste amazing too.",
    product: "CBD Calm Gummies",
  },
];

export default function ReviewsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-16 lg:py-24 overflow-hidden" style={{ background: "hsl(210 25% 97%)" }}>
      <div className={`container mx-auto px-4 lg:px-8 relative z-10 scroll-fade ${isVisible ? "visible" : ""}`}>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span
            className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 block"
            style={{ color: "hsl(217 91% 50%)" }}
          >
            Customer Reviews
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
            What our customers say
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Real feedback from real people. No paid endorsements, no medical claims.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12 rounded-2xl overflow-hidden">
          <OptimizedImage
            src={sectionReviews}
            alt="Colorful gummy bears – customer favorites"
            aspectRatio="16/9"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-xl p-7 transition-all duration-300 hover:-translate-y-0.5 bg-card border border-border shadow-soft"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i < review.rating ? "hsl(25 95% 53%)" : "transparent"}
                    stroke={i < review.rating ? "hsl(25 95% 53%)" : "hsl(210 15% 85%)"}
                  />
                ))}
              </div>
              <p className="text-[13px] leading-[1.8] mb-5 text-muted-foreground">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {review.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {review.location}
                  </div>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-1 rounded-full"
                  style={{ background: "hsl(217 91% 50% / 0.08)", color: "hsl(217 91% 50%)" }}
                >
                  {review.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-primary text-primary-foreground shadow-soft"
          >
            Leave a Review
          </button>
        </div>
      </div>
    </section>
  );
}
