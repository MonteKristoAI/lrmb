import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/data/faqs";

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section
      id="faq"
      ref={ref}
      className="relative overflow-hidden bg-[hsl(214_20%_97%)] bg-texture-diagonal bg-radial-teal py-20 lg:py-28"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&h=1080&fit=crop&q=80" alt="" className="h-full w-full object-cover opacity-[0.03]" />
      </div>
      <div
        className={cn(
          "container mx-auto mb-14 text-center reveal",
          isVisible && "visible",
        )}
      >
        <span className="overline mb-4 block">FAQ</span>
        <h2 className="font-heading text-3xl font-extrabold text-foreground md:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
          Everything you need to know about working with GSD. Can't find
          what you're looking for? Reach out — we're happy to help.
        </p>
      </div>

      <div
        className={cn(
          "container mx-auto max-w-3xl reveal",
          isVisible && "visible",
        )}
      >
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          const panelId = `faq-panel-${i}`;
          const triggerId = `faq-trigger-${i}`;

          return (
            <div key={faq.q} className="border-b border-border">
              <button
                id={triggerId}
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-center justify-between py-5 text-left text-base font-semibold text-foreground rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isOpen ? "rotate-180 text-primary" : "text-muted-foreground",
                  )}
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? "500px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <p className="pb-5 pt-1 text-[15px] leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
