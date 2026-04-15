import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const collections = [
  {
    title: "Windows",
    tagline: "Premium aluminum windows crafted for clarity and insulation",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    span: "col-span-1 md:col-span-2 md:row-span-2",
  },
  {
    title: "Patio Doors",
    tagline: "Seamless indoor-outdoor transitions",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    span: "col-span-1",
  },
  {
    title: "Entry Doors",
    tagline: "Grand entrances that make a statement",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    span: "col-span-1",
  },
  {
    title: "Sliding Systems",
    tagline: "Expansive glass walls with precision engineering",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    span: "col-span-1 md:col-span-2 md:row-span-2",
  },
];

const FeaturedCollections = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-background py-20 lg:py-28" aria-label="Featured collections">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
            Our Collections
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4">
            Crafted for Modern Living
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-primary/60" />
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Explore our curated range of aluminum windows, doors, and architectural systems — each designed with uncompromising attention to detail.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 lg:gap-5">
          {collections.map((col, i) => (
            <article
              key={col.title}
              className={`group relative overflow-hidden rounded-sm cursor-pointer ${col.span} ${
                i === 0 ? "min-h-[320px] md:min-h-0" : "min-h-[260px] md:min-h-0"
              } transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${col.image})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/60" />
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
                <h3 className="font-display text-xl lg:text-2xl font-bold text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }}>
                  {col.title}
                </h3>
                <p className="mt-1 text-sm text-white/90 max-w-xs" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                  {col.tagline}
                </p>
                <span className="story-link mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "750ms" }}>
          <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60">
            Explore All Products <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
