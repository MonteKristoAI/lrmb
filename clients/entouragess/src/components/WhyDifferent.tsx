import { Zap, Atom, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const benefits = [
  {
    icon: Zap,
    title: "Fast Acting",
    stat: "5–15 min",
    desc: "Feel effects in minutes, not hours. TiME INFUSION delivers the active compounds through soft tissues, bypassing slow digestion.",
    color: "text-effect-relaxed",
    bg: "bg-effect-relaxed/10",
  },
  {
    icon: Atom,
    title: "Better Absorption",
    stat: "18–22%",
    desc: "Bioavailability measures how much of what you consume actually reaches your system. Traditional edibles deliver only 2–6%. TiME INFUSION molecular encapsulation ensures consistent, efficient delivery every session.",
    color: "text-effect-balanced",
    bg: "bg-effect-balanced/10",
  },
  {
    icon: Sparkles,
    title: "Entourage Effect",
    stat: "Entourage",
    desc: "THC, CBD, and terpenes work together to create what's known as the entourage effect, a synergy that produces a smoother, more balanced experience than any single compound alone.",
    color: "text-effect-uplifted",
    bg: "bg-effect-uplifted/10",
  },
];

const WhyDifferent = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Why This Is <span className="text-gold">Different</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="glass-card rounded-2xl p-8 text-center">
              <div className={`w-16 h-16 rounded-2xl ${b.bg} flex items-center justify-center mx-auto mb-6`}>
                <b.icon size={28} className={b.color} />
              </div>
              <div className={`text-3xl font-black mb-2 ${b.color}`}>{b.stat}</div>
              <h3 className="text-xl font-bold mb-3">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyDifferent;
