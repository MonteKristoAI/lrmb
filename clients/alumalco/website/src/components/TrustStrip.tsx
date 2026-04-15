import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "20+", label: "Years of Excellence" },
  { value: "500+", label: "Projects Completed" },
  { value: "5-Star", label: "Rated on Google" },
  { value: "Lifetime", label: "Warranty" },
];

const TrustStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-card border-t border-border/50"
      aria-label="Company achievements"
    >
      <div className="container mx-auto px-6 py-10 lg:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              } ${i < stats.length - 1 ? "lg:border-r lg:border-primary/20" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span className="font-display text-3xl lg:text-4xl font-semibold text-primary">
                {stat.value}
              </span>
              <span className="mt-1 text-sm tracking-wide uppercase text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
