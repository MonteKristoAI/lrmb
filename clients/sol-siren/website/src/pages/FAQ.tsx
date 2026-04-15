import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "What makes Sol Siren Vintage different?",
    a: (
      <>
        <p>Each piece is chosen slowly and felt deeply.</p>
        <p className="mt-3">
          We source soulful outerwear with history — garments that carry texture, mood and presence. These are not trend pieces. They are coats with memory, weight and character. These are investment pieces.
        </p>
        <p className="mt-3">
          Every item is carefully inspected, prepared and wrapped with intention before it finds its next home.
        </p>
      </>
    ),
  },
  {
    q: "Are your pieces truly vintage?",
    a: (
      <>
        <p>Yes.</p>
        <p className="mt-3">
          Most of our garments date from the 1960s–1980s, though occasionally earlier or later pieces may make an appearance. Signs of gentle wear are part of the beauty of vintage clothing and are disclosed whenever present.
        </p>
        <p className="mt-3">We believe that owning a piece of history is the ultimate luxury.</p>
      </>
    ),
  },
  {
    q: "How do you identify materials and fur types?",
    a: (
      <>
        <p>All materials are identified to the best of our professional knowledge and experience.</p>
        <p className="mt-3">
          Many vintage garments no longer carry original labels, and historic manufacturing methods were not always documented. When identifying suede, leather, shearling or fur, we rely on traditional visual and tactile assessment methods developed through experience.
        </p>
        <p className="mt-3">
          While we strive for accuracy and transparency in every description, exact fiber content or fur species cannot be scientifically guaranteed unless explicitly stated.
        </p>
        <p className="mt-3">If you ever have questions about a specific piece, we welcome thoughtful inquiry.</p>
      </>
    ),
  },
  {
    q: "Do you test fur or leather through laboratory analysis?",
    a: (
      <>
        <p>No.</p>
        <p className="mt-3">
          We do not conduct laboratory testing on pelts or fibers. Identifications are made through professional evaluation and traditional garment knowledge.
        </p>
        <p className="mt-3">All descriptions are provided in good faith and with care.</p>
      </>
    ),
  },
  {
    q: "In what condition can I expect my garment to arrive?",
    a: (
      <>
        <p>We inspect every garment carefully.</p>
        <p className="mt-3">
          Any notable wear, repairs, thinning or patina will be disclosed in the listing. Minor signs of age are to be expected in vintage garments. They add depth and character. They are proof of life.
        </p>
        <p className="mt-3">If a piece has structural concerns, it will not be offered for sale.</p>
      </>
    ),
  },
  {
    q: "How should I care for my vintage coat?",
    a: (
      <>
        <p>We recommend:</p>
        <ul className="mt-3 space-y-2 list-disc list-inside">
          <li>Professional cleaning by a specialist experienced in leather, fur and vintage garments.</li>
          <li>When not in use, allow your coat to rest in the breathable garment bag included with your order. It protects the piece while allowing it to breathe, preserving the integrity of the piece. Plastic should be avoided, as it can suffocate natural fibers.</li>
          <li>Hang on the custom hanger included with your purchase.</li>
          <li>Keep away from prolonged direct sunlight and moisture.</li>
        </ul>
        <p className="mt-3">Detailed care notes are often included with your purchase.</p>
      </>
    ),
  },
  {
    q: "How is my order packaged?",
    a: (
      <>
        <p>Each piece is prepared and wrapped with intention.</p>
        <p className="mt-3">
          Your coat will arrive carefully folded, protected and presented in a way that feels worthy of its history — whether it's for you or a gift.
        </p>
      </>
    ),
  },
  {
    q: "Do you accept returns?",
    a: (
      <>
        <p>Due to the one-of-a-kind nature of vintage garments, all sales are final unless otherwise stated.</p>
        <p className="mt-3">
          We encourage you to review measurements and descriptions carefully before purchasing. If you have questions prior to purchase, we are happy to assist.
        </p>
      </>
    ),
  },
  {
    q: "Do you ship internationally?",
    a: (
      <>
        <p>We do offer international shipping in select cases.</p>
        <p className="mt-3">
          Please note that customs regulations regarding leather and fur vary by country. It is the buyer's responsibility to understand import regulations prior to purchase.
        </p>
        <p className="mt-3">If you are unsure, please reach out before ordering.</p>
      </>
    ),
  },
  {
    q: "Can I request additional photos or measurements?",
    a: (
      <>
        <p>Absolutely.</p>
        <p className="mt-3">
          We understand that buying vintage online requires trust. If you need additional details before committing to a piece, we are happy to provide them whenever possible.
        </p>
      </>
    ),
  },
  {
    q: "What if I'm not sure that the coat is \"mine\"?",
    a: (
      <>
        <p>You'll know.</p>
        <p className="mt-3">The right piece doesn't feel like a purchase — it feels like a recognition.</p>
      </>
    ),
  },
];

const FAQ = () => {
  return (
    <>
      <main className="pt-32 pb-20 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[750px]"
        >
          <h1 className="font-display text-3xl md:text-4xl text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-sm text-muted-foreground text-center mb-16 max-w-md mx-auto">
            Everything you need to know before welcoming a piece home.
          </p>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="font-body text-sm md:text-base tracking-wide text-left py-6 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-[750px] mt-20 pt-10 border-t border-border"
        >
          <h2 className="font-display text-sm uppercase tracking-[0.15em] text-foreground/70 mb-3">
            Legal Disclaimer
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Materials are identified to the best of our knowledge. Due to the nature of vintage garments, exact composition cannot be guaranteed.
          </p>
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
