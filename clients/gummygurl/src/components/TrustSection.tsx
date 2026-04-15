import { FlaskConical, FileCheck, Scale, Truck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const microPoints = [
  { icon: FlaskConical, label: "Third-party lab tested" },
  { icon: FileCheck, label: "COA available for every product" },
  { icon: Scale, label: "Farm Bill compliant hemp" },
  { icon: Truck, label: "Ships only where legally permitted" },
];

const cards = [
  {
    title: "Independent Lab Testing",
    text: "Every batch is verified by third-party labs. Certificates of Analysis confirm potency, purity, and safety.",
  },
  {
    title: "Farm Bill Compliance",
    text: "Hemp-derived products meet federal regulations and contain compliant THC levels.",
  },
  {
    title: "Responsible Shipping",
    text: "Products ship only to regions where hemp-derived products are legally permitted, in accordance with federal and state regulations.",
  },
  {
    title: "Hemp Sourcing & Standards",
    text: "Products are made using high-quality hemp and strict production standards.",
  },
];

export default function TrustSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative pt-28 lg:pt-36 pb-10 lg:pb-14 overflow-hidden bg-background">
      <div className={`container mx-auto px-4 lg:px-8 relative z-10 scroll-fade ${isVisible ? "visible" : ""}`}>
        <div
          className="rounded-2xl p-8 lg:p-12"
          style={{
            background: "hsl(210 25% 97%)",
            border: "1px solid hsl(210 20% 92%)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Left */}
            <div>
              <span
                className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-8 block"
                style={{ color: "hsl(217 91% 50%)" }}
              >
                Compliance &amp; Quality
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[1.2] mb-6 text-foreground">
                Built on transparency, testing, and real compliance.
              </h2>
              <p className="text-base leading-relaxed mb-12 max-w-md text-muted-foreground">
                Every product is third-party tested, Farm Bill compliant, and verified through Certificates of Analysis (COA).
              </p>

              {/* Micro-points */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {microPoints.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "hsl(217 91% 50%)" }} strokeWidth={1.5} />
                    <span className="text-sm leading-snug text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl px-8 py-7 transition-all duration-300 hover:-translate-y-0.5 bg-white"
                  style={{
                    borderLeft: "2px solid hsl(217 91% 50%)",
                  }}
                >
                  <h3 className="text-[15px] font-semibold mb-2 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
