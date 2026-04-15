import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import OptimizedImage from "@/components/OptimizedImage";
import aboutLogos from "@/assets/section-about-logos.webp";

const metrics = [
  { value: "35+", label: "Products across multiple wellness categories" },
  { value: "100%", label: "Third-party lab tested" },
  { value: "Nationwide", label: "Shipping where legally permitted" },
  { value: "Farm Bill", label: "Hemp compliance standards" },
];

const bulletPoints = [
  "Transparent compliance practices",
  "Third-party lab verification",
  "Clearly labeled formulations",
  "Responsible and legal distribution",
];

const brands = [
  "Gummy Gurl",
  "Nature Gurl",
  "Lifted Labs",
  "Good Karma",
  "Phyto Kinetics",
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative pt-10 lg:pt-14 pb-6 lg:pb-8 overflow-hidden bg-background">
      <div className={`container mx-auto px-4 lg:px-8 relative z-10 scroll-fade ${isVisible ? "visible" : ""}`}>
        <div
          className="rounded-2xl p-8 lg:p-12"
          style={{
            background: "hsl(210 25% 97%)",
            border: "1px solid hsl(210 20% 92%)",
          }}
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span
              className="text-sm font-semibold tracking-[0.25em] uppercase mb-6 block"
              style={{ color: "hsl(217 91% 50%)" }}
            >
              About Gummy Gurl
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.2] mb-6 text-foreground">
              Wellness made simple, transparent, and compliant.
            </h2>
          </div>

          {/* Brand logos image */}
          <div className="max-w-2xl mx-auto mb-12">
            <OptimizedImage
              src={aboutLogos}
              alt="Gummy Gurl family of brands – Gummy Gurl, Nature Gurl, Phyto Kinetics, Lifted Labs, Good Karma"
              aspectRatio="16/10"
              wrapperClassName="!bg-transparent"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Two-column content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 max-w-4xl mx-auto">
            <div className="space-y-4 text-[14px] leading-[1.85] text-muted-foreground">
              <p>
                Gummy Gurl, Nature Gurl, Lifted Labs, Good Karma, and Phyto Kinetics are a collection of brands focused on creating high-quality hemp, wellness, and alternative products designed for modern consumers.
              </p>
              <p>
                Across these brands we develop a wide range of products including hemp-derived cannabinoid edibles, THCA flower, plant-based wellness supplements, pet care products, and innovative legal mushroom alternatives.
              </p>
              <p>
                All products are produced with a focus on transparency, consistency, and regulatory compliance.
              </p>
              <p>
                Every product is third-party lab tested and supported by Certificates of Analysis (COAs) to ensure quality, safety, and accurate labeling.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground/70">
                Some products may not be legal in every jurisdiction. We ship products only where they are legally permitted, and certain cannabinoid or specialty products may be restricted in some states.
              </p>
            </div>

            <div>
              <ul className="space-y-3 mb-8">
                {bulletPoints.map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "hsl(217 91% 50%)" }} />
                    <span className="text-[14px] text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Brand logos row */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  Our Brands
                </p>
                <div className="flex flex-wrap gap-3">
                  {brands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold tracking-wide text-foreground bg-white"
                      style={{ border: "1px solid hsl(217 91% 50% / 0.15)" }}
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <p className="text-center text-sm text-muted-foreground/80 italic max-w-xl mx-auto mb-12 mt-2">
            No medical claims. No confusion.
            <br />
            Just transparent products people can understand and trust.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl px-6 py-6 transition-all duration-300 hover:-translate-y-0.5 bg-white"
                style={{
                  border: "1px solid hsl(217 91% 50% / 0.12)",
                }}
              >
                <div className="text-2xl lg:text-3xl font-bold mb-1.5" style={{ color: "hsl(217 91% 50%)" }}>
                  {stat.value}
                </div>
                <div className="text-[11px] leading-snug text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
