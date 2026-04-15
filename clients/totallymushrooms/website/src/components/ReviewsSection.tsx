import { Star, BadgeCheck } from "lucide-react";
import { reviews } from "@/lib/data";

const ReviewsSection = () => (
  <section className="py-28">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light leading-[1.05] mb-6">
            Real <span className="text-gradient-gold italic">Results</span>
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Verified reviews from people who made the switch to nano-extracted mushroom supplements.
          </p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-5xl font-heading text-primary">4.9</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs text-foreground/50 uppercase tracking-[0.15em] mt-1 block font-medium">Average Rating</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {reviews.map((r, i) => (
            <div key={i} className="group p-8 md:p-10 border border-border/25 hover:border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-500 rounded-sm">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className={j < r.rating ? "fill-primary text-primary" : "text-foreground/20"} />
                ))}
              </div>
              <p className="text-foreground/80 leading-[1.8] text-base mb-6">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-card border border-border/40 flex items-center justify-center text-sm text-foreground/60 font-heading">
                    {r.avatar}
                  </div>
                  <span className="text-sm text-foreground/70 font-medium">{r.name}</span>
                </div>
                {r.verified && (
                  <div className="flex items-center gap-1.5 text-primary/70">
                    <BadgeCheck size={14} strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-[0.15em] font-medium">Verified Purchase</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ReviewsSection;
