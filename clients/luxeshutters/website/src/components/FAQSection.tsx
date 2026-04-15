import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FAQS = [
  {
    q: "How long does installation take?",
    a: "Most standard installations take 1–3 hours per window. Larger projects like whole-home shutters or zipscreens may take 1–2 days. We provide detailed timelines during your consultation.",
  },
  {
    q: "Do you offer free estimates?",
    a: "Yes! In-home consultations and estimates are completely free with no obligation. We bring our mobile showroom to you so you can see samples in your own space.",
  },
  {
    q: "What products do you recommend for maximum privacy?",
    a: "Shutters and security roller shutters offer the best privacy. Block-out blinds and curtains with thermal lining are also excellent options for bedrooms and living areas.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Absolutely. We're fully licensed and insured with experienced installers on every project, giving you complete peace of mind.",
  },
  {
    q: "Do you offer motorised options?",
    a: "Yes! Most of our products are available with motorised operation, including smart-home integration with remotes, wall switches, or app control.",
  },
  {
    q: "What about warranty coverage?",
    a: "All our products come with manufacturer warranties. We also provide a workmanship warranty on every installation. Ask about specific coverage during your consultation.",
  },
  {
    q: "Which areas do you service?",
    a: "We service the Riverina region including Temora, Wagga Wagga, Young, Cootamundra, West Wyalong, and surrounding areas. Contact us to confirm if we cover your location.",
  },
  {
    q: "Can you match my existing decor?",
    a: "Absolutely. We offer a huge range of colours, fabrics, and finishes across all product lines. Bring a sample or photo during your consultation and we'll find the perfect match.",
  },
];

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <section
      ref={ref}
      className={`py-16 md:py-24 bg-secondary/30 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="text-center mb-10 md:mb-14">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Common Questions
          </span>
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Everything you need to know about our products, installation
            process, and services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border/60 bg-card px-5 sm:px-6 shadow-sm data-[state=open]:shadow-card transition-shadow"
            >
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
