import React from "react";
import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = ({
  className = "",
  testimonials,
  duration = 15,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => (
  <div className={className}>
    <div
      className="flex flex-col gap-6 pb-6 [animation:testimonials-marquee_var(--dur)_linear_infinite] hover:[animation-play-state:paused] active:[animation-play-state:paused]"
      style={{ "--dur": `${duration}s` } as React.CSSProperties}
    >
      {[0, 1].map((index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, image, name, role }, i) => (
            <div
              className="rounded-lg border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
              key={`${index}-${i}`}
            >
              <div className="mb-3 flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm italic leading-relaxed text-foreground/90">
                "{text}"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={image}
                  alt={name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
);
