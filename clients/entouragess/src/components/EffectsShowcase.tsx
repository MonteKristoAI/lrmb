import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";
import silSocial from "@/assets/silhouette-social-cutout.png";
import silUplifted from "@/assets/silhouette-uplifted-cutout.png";

const effects = [
  {
    name: "RELAXED",
    tagline: "Calm body, clear mind",
    desc: "Unwind without checking out. Myrcene and Linalool smooth the edges while CBD keeps you present. Perfect for winding down after a long day or enhancing a quiet night in.",
    silhouette: silRelaxed,
    terpenes: "1.5mg Myrcene · 0.9mg Linalool · 0.6mg β-Caryophyllene",
    thc: "10mg THC / 25mg THC · 5mg CBD",
    colorVar: "--effect-relaxed",
    textClass: "text-effect-relaxed",
    bgClass: "bg-effect-relaxed",
  },
  {
    name: "BALANCED",
    tagline: "Clarity, enjoyment, connection",
    desc: "The sweet spot. Limonene lifts your mood while Linalool and β-Caryophyllene keep the experience smooth and social. This is what edibles were supposed to feel like.",
    silhouette: silSocial,
    terpenes: "1.2mg Limonene · 0.9mg Linalool · 0.9mg β-Caryophyllene",
    thc: "10mg THC / 25mg THC · 5mg CBD",
    colorVar: "--effect-balanced",
    textClass: "text-effect-balanced",
    bgClass: "bg-effect-balanced",
  },
  {
    name: "UPLIFTED",
    tagline: "Energy, creativity, euphoria",
    desc: "Turn it up. High dose Limonene, α-Pinene, and β-Caryophyllene create an energizing, euphoric experience. Great for creative sessions, social events, or anytime you want to feel more alive.",
    silhouette: silUplifted,
    terpenes: "1.8mg Limonene · 0.75mg α-Pinene · 0.45mg β-Caryophyllene",
    thc: "10mg THC / 25mg THC · 5mg CBD",
    colorVar: "--effect-uplifted",
    textClass: "text-effect-uplifted",
    bgClass: "bg-effect-uplifted",
  },
];

const EffectSection = ({ effect, reverse }: { effect: typeof effects[0]; reverse: boolean }) => {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className="relative min-h-[60vh] flex items-center py-20 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at ${reverse ? "left" : "right"} center, hsl(var(${effect.colorVar}) / 0.06) 0%, transparent 70%)`,
      }}
    >
      <div className="container relative z-10">
        <div className={`grid md:grid-cols-2 gap-12 items-center`}>
          <div className={reverse ? "md:col-start-2 md:row-start-1" : ""}>
            <div className={`w-12 h-1 ${effect.bgClass} mb-6 rounded-full`} />
            <h3 className={`text-4xl md:text-6xl font-black tracking-wider mb-2 ${effect.textClass}`}>
              {effect.name}
            </h3>
            <p className="text-xl font-semibold text-foreground mb-4">{effect.tagline}</p>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">{effect.desc}</p>
            <div className="mb-4">
              <span className="text-lg font-bold text-foreground">{effect.thc}</span>
            </div>
            <p className="text-base text-muted-foreground mb-8">{effect.terpenes}</p>
            <Link
              to="/shop"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${effect.bgClass} text-background font-bold text-sm hover:opacity-90 transition-opacity`}
            >
              Shop {effect.name} <ArrowRight size={16} />
            </Link>
          </div>
          {/* Silhouette visual */}
          <div className={`flex items-center justify-center ${reverse ? "md:col-start-1 md:row-start-1" : ""}`}>
            <img
              src={effect.silhouette}
              alt={`${effect.name} silhouette`}
              className="h-[420px] w-auto object-contain opacity-80"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const EffectsShowcase = () => (
  <section id="effects" className="py-12 scroll-mt-20">
    <div className="text-center mb-16">
      <span className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-4 block">
        Three Distinct Experiences
      </span>
      <h2 className="text-3xl md:text-5xl font-black">Find Your Effect</h2>
    </div>
    {effects.map((e, i) => (
      <EffectSection key={e.name} effect={e} reverse={i % 2 === 1} />
    ))}
  </section>
);

export default EffectsShowcase;
