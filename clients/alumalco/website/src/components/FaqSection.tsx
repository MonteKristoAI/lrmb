import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of aluminum windows and doors do you offer?",
    answer:
      "We offer a comprehensive range including Tilt and Turn windows, Casement windows, Lift and Slide doors, Slimline sliding doors, Bifold doors, and custom Entry doors — all engineered with premium aluminum profiles for maximum durability and thermal performance.",
  },
  {
    question: "How long does the installation process take?",
    answer:
      "A typical residential installation takes 1–3 days depending on the scope of the project. Commercial projects are assessed individually. Our team provides a detailed timeline during the consultation phase so you know exactly what to expect.",
  },
  {
    question: "Do your products come with a warranty?",
    answer:
      "Yes. All of our aluminum windows and doors come with a comprehensive 10-year warranty covering manufacturing defects, hardware functionality, and finish integrity. Extended warranty options are also available.",
  },
  {
    question: "Can I get a custom size or finish?",
    answer:
      "Absolutely. Every project is made to measure. We offer a wide palette of powder-coat finishes, anodized options, and wood-grain laminates to match any architectural style or interior design vision.",
  },
  {
    question: "Are your windows and doors energy efficient?",
    answer:
      "Our products feature thermal-break aluminum profiles, multi-point locking systems, and high-performance double or triple glazing options that meet or exceed current energy efficiency standards, helping reduce heating and cooling costs.",
  },
  {
    question: "How do I get a quote for my project?",
    answer:
      "Simply click the 'Get a Free Quote' button or contact us directly by phone. Share your project details — dimensions, product preferences, and timeline — and our team will provide a detailed, no-obligation estimate within 48 hours.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            Common Questions
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border/50 bg-card/50 px-6 rounded-sm"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors text-sm md:text-base py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
