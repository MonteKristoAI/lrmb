import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  { q: `What is the entourage effect and how does ${BRAND_NAME} use it?`, a: `The entourage effect is the natural synergy between cannabinoids like THC and CBD and terpenes when consumed together. ${BRAND_NAME} gummies are formulated to recreate this synergy with three distinct blends: RELAXED, BALANCED, and UPLIFTED, each using a specific combination of THC, CBD, and terpenes to deliver a targeted, predictable experience.` },
  { q: "How fast do they work?", a: "Effects typically arrive within 5–15 minutes thanks to TiME INFUSION delivery, compared to 30–90+ minutes for traditional edibles. The encapsulated cannabinoids absorb through soft tissues, bypassing the slow oil digestive process." },
  { q: "What makes these different from other edibles?", a: `${BRAND_NAME} gummies use an entourage mimicking formulation that combines THC, CBD, and specific terpenes to create targeted effects rather than a generic experience. They also feature TiME INFUSION delivery, where molecular encapsulation allows the active compounds to absorb through soft tissues in just 5–15 minutes. Together, this creates a social, predictable, sessionable experience.` },
  { q: "Which effect should I choose?", a: "RELAXED for winding down, calming the body while staying clear. BALANCED for social situations, creativity, and everyday enjoyment. UPLIFTED for energy, euphoria, and active experiences." },
  { q: "How strong are they?", a: "Available in 10mg and 25mg options. Our gummies deliver 18–22% bioavailability (vs 2–6% for traditional edibles), so start with 10mg and adjust from there. The fast onset makes it easy to gauge your response." },
  { q: "Why don't they taste like cannabis?", a: "TiME INFUSION encapsulates each cannabinoid and terpene molecule individually, creating a neutral taste profile. No bitter cannabis oil, no unpleasant aftertaste, just clean flavor." },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useScrollReveal();

  return (
    <section id="faq" className="py-24 section-divider scroll-mt-20" ref={ref}>
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading mb-3">
            Questions<span className="text-gold">?</span>
          </h2>
          <p className="text-sm text-muted-foreground">Everything you need to know about {BRAND_NAME} gummies.</p>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((f, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-semibold text-foreground hover:text-gold transition-colors"
              >
                {f.q}
                <span className="flex-shrink-0 ml-4 text-muted-foreground">
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
