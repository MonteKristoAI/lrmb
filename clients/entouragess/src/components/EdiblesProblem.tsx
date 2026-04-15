import { Clock, Shuffle, Frown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const problems = [
  {
    icon: Clock,
    title: "Slow Onset",
    desc: "Traditional edibles take 1–4 hours. You never know when it's coming.",
  },
  {
    icon: Shuffle,
    title: "Unpredictable Effects",
    desc: "Too much, too little, too late. Every time is a gamble.",
  },
  {
    icon: Frown,
    title: "Bad Taste",
    desc: "Bitter cannabis oil ruins the experience before it starts.",
  },
];

const EdiblesProblem = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 section-divider" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            The Problem With <span className="text-gold">Edibles</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everyone's had a bad edible experience. Here's why.
          </p>
        </div>

        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className="glass-card rounded-2xl p-6 md:p-8 flex items-center gap-5 md:gap-8"
            >
              <span className="text-4xl md:text-5xl font-black text-gold/30 select-none shrink-0 w-10 text-center">
                {i + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <p.icon size={24} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EdiblesProblem;
