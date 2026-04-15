import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
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
    <section ref={ref} className="bg-card py-20 lg:py-28" aria-label="About us">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left — Text */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
              About Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4">
              Crafting <span className="text-primary">Excellence</span> in Aluminum
            </h2>
            <div className="mt-4 h-px w-16 bg-primary/60" />

            <p className="mt-6 text-muted-foreground leading-relaxed">
              With over two decades of experience, Alumalco has established itself as a
              premier provider of aluminum solutions across Quebec and Ontario. From luxury
              residences to landmark commercial projects, our work reflects an unwavering
              commitment to precision engineering and architectural beauty.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every project begins with deep collaboration — understanding your vision,
              the environment, and the demands of the structure. We combine traditional
              craftsmanship with cutting-edge technology to deliver systems that perform
              flawlessly for decades.
            </p>

            <span
              className="inline-flex items-center mt-8 text-sm font-medium tracking-wide text-primary cursor-pointer hover:opacity-80 transition-opacity"
              role="link"
              tabIndex={0}
            >
              More About Us <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </div>

          {/* Right — Image */}
          <div
            className={`group overflow-hidden rounded-sm transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
              alt="Modern aluminum and glass building facade"
              className="w-full h-full object-cover aspect-[4/5] transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
