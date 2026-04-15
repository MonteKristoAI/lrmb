import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Luxury Residence",
    location: "Westmount, Montreal",
    description: "Full aluminum facade with panoramic windows and custom entry systems",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Modern Townhome",
    location: "Quebec City",
    description: "Custom sliding systems and thermally broken entry doors",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Commercial Building",
    location: "Downtown Montreal",
    description: "Curtain wall and storefront glazing with integrated ventilation",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  },
];

const GallerySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-background py-20 lg:py-28" aria-label="Project gallery">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
            Our Projects
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4">
            Project <span className="text-primary">Gallery</span>
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-primary/60" />
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Browse our completed installations showcasing precision craftsmanship and architectural excellence.
          </p>
        </div>

        {/* Stacked Images */}
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`group relative aspect-[16/7] rounded-sm overflow-hidden cursor-pointer transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <img
                src={project.image}
                alt={`${project.title} — ${project.location}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-500 group-hover:from-background/80" />
              {/* Project info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                  {project.title} <span className="text-muted-foreground font-normal">— {project.location}</span>
                </h3>
                <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-lg">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "800ms" }}>
          <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 px-8 py-5 text-sm tracking-wide">
            View All Projects <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
