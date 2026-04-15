import { useScrollReveal } from "@/hooks/useScrollReveal";

const ReviewsSection = () => {
  const sectionRef = useScrollReveal();

  return (
    <section id="reviews" className="py-24 section-divider scroll-mt-20" ref={sectionRef}>
      <div className="container max-w-2xl text-center">
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-4 block">Reviews</span>
        <h2 className="text-3xl md:text-4xl font-heading mb-4">Be the First to Try Entourage</h2>
        <p className="text-muted-foreground mb-8">
          Our gummies are launching soon. Check back for real reviews from real people.
        </p>
        <a
          href="#newsletter"
          className="inline-block px-8 py-3 rounded-full border border-gold text-gold font-bold text-sm hover:bg-gold hover:text-background transition-colors"
        >
          Get Notified
        </a>
      </div>
    </section>
  );
};

export default ReviewsSection;
