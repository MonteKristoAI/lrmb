import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FAQS } from "@/data/faqData";

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <section
      ref={ref}
      aria-labelledby="faq-heading"
      className={`py-16 md:py-24 bg-secondary/30 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}>
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="text-center mb-10 md:mb-14">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Common Questions
          </span>
          <h2 id="faq-heading" className="font-serif text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Everything you need to know about our products, installation process, and services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border/60 bg-card px-5 sm:px-6 shadow-sm data-[state=open]:shadow-card transition-shadow">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5 text-[15px] sm:text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm sm:text-[15px]">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
