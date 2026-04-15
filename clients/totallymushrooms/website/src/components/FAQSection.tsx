import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What makes the Total Series different from other mushroom supplements?",
    answer: "Three things set us apart. First, our proprietary ultrasonic nano-refinement process (<45C cold-process) strips indigestible chitin cell walls while preserving fragile bioactives intact. Second, we achieve a 40:1 extract ratio - 50mg of nano-extract delivers the equivalent of 2,000mg dried mushroom. Third, our 100-500nm sub-micron particles bypass the gastric gauntlet entirely, delivering 95%+ bioavailability vs. the 10-15% typical of crude capsules.",
  },
  {
    question: "How should I take the Total Series gummies?",
    answer: "Three protocols. Baseline Maintenance: 1 gummy daily for systemic equilibrium. Peak Demand: 1 gummy twice daily during high-stress periods. Kinetic Spiking: consume exactly 20 minutes before deep work (Total Neuro) or physical exertion (Total Velocity). Store below 75F, away from direct sunlight.",
  },
  {
    question: "What is the Gastric Gauntlet?",
    answer: "The pH 1.5-3.5 acidic zone of your stomach that destroys most mushroom supplements before absorption. Legacy capsules lose up to 80% of their potency. Our nano-emulsified micro-spheres at 100-500nm are engineered to survive this gauntlet intact, delivering bioactives directly to cellular membranes.",
  },
  {
    question: "What mushrooms are in each product?",
    answer: "Total Neuro: Lion's Mane (Hericium erinaceus) for NGF synthesis and cognitive regeneration. Total Velocity: Cordyceps (Cordyceps militaris) for ATP synthesis and VO2 Max. Total Aegis: Golden Oyster (Pleurotus citrinopileatus) for L-Ergothioneine and systemic defense. Each is a single-species, 40:1 nano-extract.",
  },
  {
    question: "Are your products third-party tested?",
    answer: "Every batch is tested at an independent, ISO-accredited laboratory. Full-panel analysis: heavy metals, pesticides, microbial contamination, beta-glucan content. Certificate of Analysis published for every product. All mushrooms USDA certified organic, GMP facility.",
  },
  {
    question: "Do you offer subscriptions?",
    answer: "Subscribe and save 25% on every order with automatic monthly delivery. Pause, skip, or cancel anytime. Subscription members earn 30 loyalty points per order vs. 20 for one-time purchases.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-primary/60" />
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light leading-[1.05]">
                Common<br />
                <span className="text-gradient-gold italic">Questions</span>
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-border/20">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={i} className="group">
                    <button onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 py-7 text-left transition-colors duration-300"
                    >
                      <span className={`text-base leading-relaxed transition-colors duration-300 ${isOpen ? 'text-foreground font-medium' : 'text-foreground/75 group-hover:text-foreground/90'}`}>
                        {faq.question}
                      </span>
                      <ChevronDown size={20} strokeWidth={1.5}
                        className={`shrink-0 mt-1 text-foreground/50 transition-all duration-500 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100 pb-7' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[15px] text-foreground/60 leading-[1.8] max-w-xl">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
