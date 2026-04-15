import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const testimonials = [
  {
    text: "Alumalco transformed our home with stunning aluminum windows. The craftsmanship and attention to detail exceeded all expectations. Every frame is flawless.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Marc-André Bouchard",
    role: "Homeowner, Montreal",
  },
  {
    text: "Their sliding door systems are absolutely flawless. The indoor-outdoor flow in our living room is now seamless. Truly premium quality that you can feel.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sophie Tremblay",
    role: "Interior Designer",
  },
  {
    text: "We've partnered with Alumalco on multiple commercial projects. Their aluminum curtain walls are best-in-class across Quebec and Ontario.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    name: "Jean-François Gagnon",
    role: "Construction Director",
  },
  {
    text: "From consultation to installation, the process was seamless. Our entry doors make a grand statement every time guests arrive at our home.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Catherine Dubois",
    role: "Homeowner, Quebec City",
  },
  {
    text: "The energy efficiency of their window systems cut our heating costs by 30%. Outstanding engineering designed for Canadian winters.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "David Chen",
    role: "Facility Manager",
  },
  {
    text: "Alumalco delivered our hotel lobby glazing on time and on budget. The result is breathtaking — guests always comment on it when they walk in.",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    name: "Isabelle Roy",
    role: "Hotel Operations Manager",
  },
  {
    text: "We chose Alumalco for our office building retrofit. Their team handled the complex installation with incredible professionalism and precision.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Michael Pearson",
    role: "Project Manager, Ottawa",
  },
  {
    text: "The patio doors they installed completely opened up our living space. Beautiful design, whisper-quiet operation, and superb thermal insulation.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    name: "Émilie Lavoie",
    role: "Homeowner, Laval",
  },
  {
    text: "Five years in and our Alumalco windows still look and perform like day one. Their warranty and after-care service are completely unmatched.",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    name: "Robert Simard",
    role: "Property Developer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const WallOfLove = () => {
  return (
    <section id="testimonials" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Testimonials
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
            Wall of Love
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground md:text-lg">
            See what our clients across Canada have to say about working with
            Alumalco.
          </p>
        </div>

        {/* Columns */}
        <div className="group mx-auto flex max-w-5xl justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] max-h-[720px]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={25}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={20}
          />
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
            asChild
          >
            <a
              href="https://g.page/alumalco/review"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leave a Review
              <ExternalLink size={16} />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WallOfLove;
