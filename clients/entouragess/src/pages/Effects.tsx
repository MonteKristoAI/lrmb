import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import NewsletterSection from "@/components/NewsletterSection";
import SiteFooter from "@/components/SiteFooter";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import silSocial from "@/assets/silhouette-social-cutout.png";
import silUplifted from "@/assets/silhouette-uplifted-cutout.png";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";
const SectionReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useScrollReveal();
  return <div ref={ref} className={className}>{children}</div>;
};

const Effects = () => (
  <>
    <SiteHeader />
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silSocial} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-3xl text-center relative z-10">
          <p className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">
            Understanding the Science
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            The Entourage Effect
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Cannabis is more than just THC. When THC, CBD, and terpenes work together, they create something greater than any single compound alone. This is the entourage effect.
          </p>
        </div>
      </section>

      {/* What Is It */}
      <section className="py-20 border-t border-border">
        <SectionReveal className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                What Is the <span className="text-primary">Entourage Effect</span>?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cannabis flower contains hundreds of compounds. When it is smoked, all of them are consumed together. The experience is created by how these compounds work in combination, not by THC alone. THC drives the experience, CBD smooths it out, and terpenes shape the character.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { label: "THC", desc: "The primary active compound. Delivers the core effect you feel.", color: "text-primary" },
                { label: "CBD", desc: "Balances and smooths the experience. Reduces unwanted intensity.", color: "text-effect-balanced" },
                { label: "Terpenes", desc: "Natural plant compounds that shape each effect profile. They guide whether you feel relaxed, balanced, or uplifted.", color: "text-effect-relaxed" },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl p-5 border border-border">
                  <h3 className={`text-lg font-bold ${item.color} mb-1`}>{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* How Entourage Uses It */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <SectionReveal className="container max-w-3xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            How ENTOURAGE Gummies Use It
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
            Every ENTOURAGE gummy is built around the entourage effect. Instead of using THC alone, each formula combines a precise ratio of THC, CBD, and a curated terpene blend to deliver a specific, repeatable experience.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Relaxed",
                desc: "Myrcene, Linalool, and β-Caryophyllene produce a calm, unwinding effect.",
                color: "bg-effect-relaxed/10 border-effect-relaxed/20",
                dot: "bg-effect-relaxed",
              },
              {
                title: "Balanced",
                desc: "β-Caryophyllene, Limonene, and Linalool create a centered, easy going feel.",
                color: "bg-effect-balanced/10 border-effect-balanced/20",
                dot: "bg-effect-balanced",
              },
              {
                title: "Uplifted",
                desc: "Limonene, α-Pinene, and β-Caryophyllene deliver an energized, social experience.",
                color: "bg-effect-uplifted/10 border-effect-uplifted/20",
                dot: "bg-effect-uplifted",
              },
            ].map((blend) => (
              <div key={blend.title} className={`rounded-xl p-6 border ${blend.color}`}>
                <h3 className="text-lg font-bold text-foreground mb-2">{blend.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{blend.desc}</p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* CTA */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silUplifted} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <SectionReveal className="container max-w-2xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Find Your Effect
          </h2>
          <p className="text-muted-foreground mb-8">
            Three blends. Two strengths. One consistent experience.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            Shop the Blends <ArrowRight size={16} />
          </Link>
        </SectionReveal>
      </section>

      <NewsletterSection />
    </main>
    <SiteFooter />
  </>
);

export default Effects;
