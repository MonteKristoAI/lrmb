import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsletterSection from "@/components/NewsletterSection";
import { BRAND_NAME, BRAND_PRODUCT_STATEMENT } from "@/lib/brand";
import silSocial from "@/assets/silhouette-social-cutout.png";
import silUplifted from "@/assets/silhouette-uplifted-cutout.png";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";
import PKChart from "@/components/PKChart";

const heroStats = [
  { val: "5–15", label: "Min Onset" },
  { val: "18–22%", label: "Bioavailability" },
  { val: "Δ9", label: "THC Form" },
];

const deliveryMethods = [
  { emoji: "🫁", title: "Inhalation", time: "< 60 sec", timeLabel: "to first effects", pros: ["Lungs absorb cannabinoids directly", "D9 THC enters bloodstream intact", "Entourage effect from whole plant"], cons: ["Smoke, smell, lung exposure"], badge: null },
  { emoji: "🍬", title: `${BRAND_NAME} Gummies`, time: "5–15 min", timeLabel: "to first effects", pros: ["Entourage mimicking formulation (THC+CBD+terpenes)", "Buccal soft tissue absorbs gummy", "Bypasses liver, D9 stays intact", "No smoke, no smell, discreet"], cons: [], badge: "Best of Both" },
  { emoji: "🍪", title: "Traditional Edibles", time: "1–4 hours", timeLabel: "to first effects", pros: [], cons: ["Usually THC only, no entourage effect", "GI tract digests edible slowly", "Liver converts D9 to 11 OH THC", "Heavy, sedating, unpredictable"] },
];

const whyItems = [
  { title: "Entourage Effect Mimicking Formulation", desc: "THC + CBD + terpenes working together to recreate the balanced, full spectrum experience of smoking in gummy form." },
  { title: "5-15 Minute Onset", desc: "TiME INFUSION delivery means effects arrive as fast as 5 minutes, not the 30 to 90+ minutes you wait with traditional edibles." },
  { title: "Delta 9 THC Preserved", desc: "No liver conversion to 11 Hydroxy THC. The lighter, euphoric Delta 9 experience is preserved." },
  { title: "Social and Sessionable", desc: "Designed for clarity, enjoyment, and connection. Predictable onset and non-sedating effects make these gummies purpose built for social consumption." },
  { title: "No Bitter Cannabis Flavor", desc: "Encapsulation neutralizes the acrid taste of cannabis oils. Products taste exactly as intended." },
  { title: "18-22% Bioavailability", desc: "Up to 10x more bioavailable than traditional edibles, meaning more effect per milligram of cannabinoid." },
];

const comparisonRows = [
  { metric: "Formulation", time: "THC + CBD + terpenes", trad: "Usually isolated THC only" },
  { metric: "Effect Profile", time: "Social, clear, sessionable", trad: "Heavy, sedating, unpredictable" },
  { metric: "Onset Time", time: "5–15 minutes", trad: "1–4 hours" },
  { metric: "Bioavailability", time: "18–22%", trad: "2–6%" },
  { metric: "THC Form Delivered", time: "Delta 9 THC", trad: "11 Hydroxy THC (heavy, sedating)" },
  { metric: "Taste Profile", time: "Neutral, no cannabis flavor", trad: "Bitter, oily cannabis taste" },
  { metric: "Predictability", time: "Consistent onset and experience", trad: "Highly variable, unreliable" },
  { metric: "Social Suitability", time: "Ideal, predictable timing and non-sedating", trad: "Risky, delayed, unpredictable, and sedating" },
];

const ExploreTechnology = () => (
  <>
    <SiteHeader />
    <main className="pt-16">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silSocial} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container text-center max-w-3xl mx-auto fade-in relative z-10">
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-gold mb-4">
            The Science Behind Our Gummies
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            Two Innovations. <span className="text-gold">One Unique Gummy.</span>
          </h1>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            What makes {BRAND_NAME} gummies different isn't just one thing. It's the combination of our <strong className="text-foreground">entourage mimicking formulation</strong> and our <strong className="text-foreground">TiME INFUSION delivery system</strong> working together.
          </p>
          <p className="text-sm text-foreground leading-relaxed max-w-xl mx-auto my-6">
            {BRAND_PRODUCT_STATEMENT}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {heroStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-gold">{s.val}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillar 1: Formulation */}
      <section className="py-20 section-divider">
        <div className="container max-w-4xl">
          <div className="fade-in">
            <hr className="hr-accent" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-gold">Pillar 1:</span> Entourage Mimicking Formulation
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Most edibles just contain THC, delivering a one dimensional, often heavy and sedating experience. Entourage gummies use a precise blend of <strong className="text-foreground">encapsulated THC + CBD + terpenes</strong> to recreate the entourage effect produced from smoking.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The entourage effect is the synergy between cannabinoids and terpenes when consumed together. It's why smoking feels different from eating a THC edible. The compounds modulate and complement each other.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our formulation is designed for <strong className="text-foreground">clarity, enjoyment, and connection</strong>. A social, sessionable experience rather than a heavy or sedating one.
            </p>
          </div>
        </div>
      </section>

      {/* Pillar 2: Delivery */}
      <section className="py-20 section-divider relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silUplifted} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-4xl relative z-10">
          <div className="fade-in">
            <hr className="hr-accent" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-gold">Pillar 2:</span> TiME INFUSION Delivery
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              TiME INFUSION stands for Thermodynamic individual Molecular Encapsulation. The process individually wraps each cannabinoid and terpene molecule with a hydrophilic (water loving) coating, creating a true water soluble cannabinoid rather than an oil emulsion. This enables absorption through soft tissues in the mouth and stomach rather than requiring full digestion through the GI tract and liver. The process is significant because absorption through soft tissues allows THC to enter the bloodstream directly, avoiding oxidation in the GI tract and liver where Delta 9 THC is converted into 11 OH THC, a metabolite known for producing heavy and sedating effects. By preserving Delta 9 THC in its original form, the experience remains lighter and more euphoric. Encapsulation also neutralizes the acrid taste of cannabis oils, so products taste exactly as intended with no bitter cannabis flavor. This is the delivery half of our gummies and it's what makes them fast. Combined with our entourage effect mimicking formulation, it means you get the right type of effect at the right speed.
            </p>
          </div>
        </div>
      </section>

      {/* PK Data Chart */}
      <section className="py-20 section-divider">
        <div className="container max-w-4xl">
          <div className="text-center mb-8 fade-in">
            <hr className="hr-accent mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Pre Clinical <span className="text-gold">Pharmacokinetic Data</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              ESEV study data showing plasma THC concentrations after TiME INFUSION administration. Delta 9 THC peaks rapidly via buccal absorption while 11 OH THC stays near zero throughout.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 fade-in stagger-1">
            <PKChart />
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 section-divider relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-4 fade-in">
            <hr className="hr-accent mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Why It <span className="text-gold">Matters</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Traditional edibles fail on two fronts. They take too long and they deliver the wrong type of effect. {BRAND_NAME} gummies solve both with an entourage effect mimicking formulation that produces the right experience and TiME INFUSION delivery that prevents oxidation of THC into 11 OH THC, contributing not just to speed but to the overall quality of the experience.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {whyItems.map((item, i) => (
              <div key={item.title} className={`bg-card border border-border rounded-xl p-6 fade-in stagger-${Math.min(i + 1, 4)}`}>
                <h3 className="text-sm font-bold text-gold mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Methods Comparison - moved below Why It Matters */}
      <section className="py-20 section-divider">
        <div className="container">
          <div className="text-center mb-10 fade-in">
            <h2 className="text-lg font-bold text-muted-foreground mb-2">How Different Delivery Methods Compare</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {deliveryMethods.map((m, i) => (
              <div key={m.title} className={`bg-card border rounded-xl p-6 fade-in stagger-${i + 1} ${i === 1 ? "border-[hsl(var(--gold)/0.4)]" : "border-border"}`}>
                {m.badge && (
                  <span className="inline-block text-[0.6875rem] font-bold uppercase tracking-wider text-gold mb-2">{m.badge}</span>
                )}
                <div className="text-3xl mb-2">{m.emoji}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{m.title}</h3>
                <div className={`text-xl font-black mb-1 ${i === 1 ? "text-gold" : "text-foreground"}`}>{m.time}</div>
                <p className="text-xs text-muted-foreground mb-4">{m.timeLabel}</p>
                <ul className="flex flex-col gap-2">
                  {m.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs">
                      <span className="text-gold mt-0.5">→</span>
                      <span className="text-muted-foreground">{p}</span>
                    </li>
                  ))}
                  {m.cons.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-xs">
                      <span className={`mt-0.5 ${i === 1 ? "text-emerald-500" : "text-destructive"}`}>
                        {i === 1 ? "✓" : "✗"}
                      </span>
                      <span className="text-muted-foreground">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 section-divider">
        <div className="container max-w-4xl">
          <div className="text-center mb-10 fade-in">
            <hr className="hr-accent mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {BRAND_NAME} vs <span className="text-gold">Traditional Edibles</span>
            </h2>
            <p className="text-sm text-muted-foreground">How our gummies compare across key metrics, formulation and delivery.</p>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden fade-in stagger-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium"></th>
                    <th className="text-left p-4 text-gold font-bold">{BRAND_NAME} Gummies</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Traditional Edibles</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.metric} className="border-b border-border last:border-0">
                      <td className="p-4 font-semibold text-foreground">{row.metric}</td>
                      <td className="p-4 text-gold">{row.time}</td>
                      <td className="p-4 text-muted-foreground">{row.trad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Experience the Difference */}
      <section className="py-20 section-divider relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silSocial} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-3xl text-center fade-in relative z-10">
          <span className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4 block">Interested?</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Experience the Difference
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto">
            Try our gummies and feel the difference that entourage mimicking formulation + TiME INFUSION delivery makes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
              Shop Gummies <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
    <SiteFooter />
  </>
);

export default ExploreTechnology;
