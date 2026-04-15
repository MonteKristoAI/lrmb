import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const points = [
  { title: "The full smoking experience, in a gummy", desc: "Our entourage-mimicking THC + CBD + terpene formulation recreates the balanced, full-spectrum effect of smoking. Clarity, enjoyment, and connection, not just isolated THC." },
  { title: "Same-speed onset as smoking", desc: "TiME INFUSION delivery means 5–15 minute onset via soft tissue absorption, comparable to inhalation, without any combustion." },
  { title: "No smoke. No smell. No judgment.", desc: "Our gummies look like regular candy. Discreet, odorless, lung-friendly, perfect anywhere, anytime." },
  { title: "Social & sessionable by design", desc: "Predictable onset and offset. A lighter, more uplifting effect. Purpose-built for social consumption, not couch-lock." },
];

const SmokersSection = () => (
  <section className="py-20 section-divider" style={{ background: "linear-gradient(135deg, hsl(43 74% 49% / 0.03) 0%, hsl(var(--background)) 60%)" }}>
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="fade-in">
          <hr className="hr-accent" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Finally, A Cannabis Edible<br /><span className="text-gold">That Feels Like Smoking</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Traditional edibles don't just take too long, they deliver the <em>wrong type of effect</em>. Heavy, sedating, unpredictable. Our gummies solve both problems. The entourage-mimicking formulation recreates the <em>quality</em> of the smoking experience, while TiME INFUSION delivery matches the <em>speed</em>.
          </p>
          <ul className="flex flex-col gap-4 mb-8">
            {points.map((p) => (
              <li key={p.title} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md gold-check-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{p.title}</p>
                  <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
            Shop Gummies <ArrowRight size={16} />
          </Link>
        </div>
        <div className="fade-in stagger-1 flex flex-col items-center gap-8">
          <div className="bg-card border border-border rounded-xl p-6 w-full">
            <p className="text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-5">
              Onset Time vs Inhalation
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[0.8125rem] font-semibold text-foreground">Inhalation (smoking)</span>
                  <span className="text-[0.8125rem] text-muted-foreground">&lt; 60 sec</span>
                </div>
                <div className="progress-bar-track"><div className="progress-bar-muted" style={{ width: "2%" }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[0.8125rem] font-semibold text-gold">Our Gummies (TiME INFUSION)</span>
                  <span className="text-[0.8125rem] font-bold text-gold">5–15 min</span>
                </div>
                <div className="progress-bar-track"><div className="progress-bar-gold" style={{ width: "16%" }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[0.8125rem] text-muted-foreground">Traditional Edibles</span>
                  <span className="text-[0.8125rem] text-muted-foreground">1–4 hours</span>
                </div>
                <div className="progress-bar-track"><div className="progress-bar-danger" style={{ width: "100%" }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default SmokersSection;
