import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    number: "01",
    title: "Lifetime Warranty",
    description: "Every product backed by our lifetime craftsmanship guarantee",
  },
  {
    number: "02",
    title: "Premium Materials",
    description: "Aircraft-grade aluminum and precision-engineered components",
  },
  {
    number: "03",
    title: "Custom Design",
    description: "Tailored solutions measured and crafted to your exact specifications",
  },
  {
    number: "04",
    title: "Energy Efficient",
    description: "Advanced thermal break technology for superior insulation",
  },
];

const WhyChooseUs = () => {
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
    <section ref={ref} className="bg-card py-20 lg:py-28" aria-label="Why choose us">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4">
            The Alumalco <span className="text-primary">Difference</span>
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-primary/60" />
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Decades of expertise distilled into every detail — from material selection to final installation.
          </p>
        </div>

        {/* Rows */}
        <div className="max-w-5xl mx-auto border-t border-border/30">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.number}
              className={`grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] items-baseline gap-x-10 gap-y-2 py-8 border-b border-border/30 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <span className="font-display text-4xl font-semibold text-muted-foreground/30">
                {benefit.number}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed md:text-right">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
