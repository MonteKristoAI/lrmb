import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { extractionSteps, systemicMatrix, gastricGauntlet } from "@/lib/data";
import { ArrowRight, Beaker, Shield, Download, FlaskConical, Zap, Brain, AlertTriangle } from "lucide-react";

const bioavailabilityData = [
  { label: "Standard Powder", range: "10-15%", value: 12, isOurs: false },
  { label: "Hot Water Extract", range: "25-35%", value: 30, isOurs: false },
  { label: "Dual Extract (Alcohol + Water)", range: "40-50%", value: 45, isOurs: false },
  { label: "Total Series Nano-Extract", range: "95%+", value: 95, isOurs: true },
];

const coaFields = [
  { label: "Batch Number", value: "TM-2026-0412-LM" },
  { label: "Test Date", value: "March 28, 2026" },
  { label: "Extract Ratio", value: "40:1" },
  { label: "Beta-Glucan Content", value: "41.2% w/w" },
  { label: "Heavy Metals", value: "ND (Not Detected)" },
  { label: "Pesticides", value: "ND (Not Detected)" },
  { label: "Microbial", value: "Pass" },
];

const Science = () => (
  <Layout>
    {/* Hero */}
    <section className="pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="container max-w-4xl text-center relative z-10">
        <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-4 block">The Total Series: Systemic Mastery</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          The Science of{" "}
          <span className="text-gradient-gold">Bioavailability</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Clinical-grade bioactives delivered with unrivaled precision. Our proprietary ultrasonic nano-refinement process achieves 95%+ bioavailability, a 178-fold efficiency multiplier over crude powders, and 7.0x the absorption of conventional capsules.
        </p>
        <div className="flex justify-center gap-10 md:gap-16 mt-12">
          {[
            { value: "95%+", label: "Bioavailability" },
            { value: "178x", label: "Efficiency" },
            { value: "7.0x", label: "Absorption" },
            { value: "40:1", label: "Extract Ratio" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-5xl font-light text-primary font-heading">{s.value}</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-foreground/50 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* The Gastric Gauntlet */}
    <section className="pb-24">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-3 block">The Metabolic Toll</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Gastric <span className="text-gradient-gold">Gauntlet</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Most legacy mushroom extracts are trapped in indigestible cell walls and destroyed by stomach acid before your body can use them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy */}
          <div className="rounded-2xl border border-destructive/30 bg-card p-8 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle size={18} className="text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Legacy Supplements</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-destructive/70 w-20 shrink-0">CRUDE CAPSULE</span>
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] text-muted-foreground">pH 1.5-3.5</span>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-mono text-destructive/70">FRAGMENTS</span>
              </div>
              <p className="leading-relaxed">{gastricGauntlet.legacy.description}</p>
            </div>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center">
              <span className="text-2xl font-bold text-destructive font-heading">{gastricGauntlet.legacy.potencyLoss}%</span>
              <span className="text-xs text-destructive/70 block">Potency Loss (The Biological Expense)</span>
            </div>
          </div>

          {/* Total Series */}
          <div className="rounded-2xl border border-primary/30 bg-card p-8 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Beaker size={18} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">The Total Series</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-primary/70 w-20 shrink-0">MICRO-SPHERES</span>
                <div className="h-px flex-1 bg-primary/20" />
                <span className="text-[10px] text-primary/50">pH 1.5-3.5</span>
                <div className="h-px flex-1 bg-primary/20" />
                <span className="text-xs font-mono text-primary/70">UPTAKE</span>
              </div>
              <p className="leading-relaxed">{gastricGauntlet.totalSeries.description}</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center glow-gold-subtle">
              <span className="text-2xl font-bold text-primary font-heading">{gastricGauntlet.totalSeries.bioavailability}</span>
              <span className="text-xs text-primary/70 block">Bioavailability (The Cellular Advantage)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Ultrasonic Nano-Refinement: The Breakthrough */}
    <section className="pb-24">
      <div className="container max-w-5xl">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-14">
          <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-3 block">The Breakthrough</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ultrasonic <span className="text-gradient-gold">Nano-Refinement</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="rounded-xl bg-background/60 border border-border/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <FlaskConical size={18} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Chitin Elimination</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Eliminates metabolic waste by stripping indigestible chitinous cell walls. No energy wasted on digestion.
              </p>
            </div>
            <div className="rounded-xl bg-background/60 border border-border/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Shield size={18} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Intact Bioactives</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cold-process extraction (&lt;45C) preserves fragile structural compounds entirely intact. No destructive heat.
              </p>
            </div>
            <div className="rounded-xl bg-background/60 border border-border/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Zap size={18} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Maximum Kinetic Yield</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ultrasonic cavitation unlocks maximum bioactive yield without heat degradation. 100-500nm sub-micron particles.
              </p>
            </div>
          </div>

          {/* Nano Edge stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-1">178x</div>
              <div className="text-sm text-muted-foreground font-medium">Efficiency Multiplier</div>
              <div className="text-xs text-muted-foreground/60 mt-1">Performance increase over unrefined powders</div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-1">7.0x</div>
              <div className="text-sm text-muted-foreground font-medium">Bioavailability Advantage</div>
              <div className="text-xs text-muted-foreground/60 mt-1">Absorption advantage over conventional capsules</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 5-Step Process */}
    <section className="pb-24">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-3 block">From Farm to Formula</span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Our 5-Step <span className="text-gradient-gold">Process</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-8 top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
          <div className="space-y-8">
            {extractionSteps.map((step, index) => (
              <div
                key={step.step}
                className="relative pl-16 md:pl-20 animate-fade-up"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="absolute left-0 top-2 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10 group-hover:bg-primary/10 transition-colors duration-300">
                  <span className="text-lg md:text-xl font-bold text-primary">{step.step}</span>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 md:p-8 hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <h3 className="text-xl font-bold text-foreground font-heading">{step.title}</h3>
                    <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
                      {step.metric}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Systemic Mastery Matrix */}
    <section className="pb-24">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-3 block">Three Pillars of Optimization</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Systemic Mastery <span className="text-gradient-gold">Matrix</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three kinetic protocols engineered for the modern biohacker.
          </p>
        </div>

        {/* Matrix table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-5 text-muted-foreground font-medium text-xs uppercase tracking-widest w-1/4"></th>
                  {systemicMatrix.map((col) => (
                    <th key={col.product} className="p-5 text-center">
                      <span className={`text-lg font-bold font-heading ${
                        col.color === "red" ? "text-red-400" : col.color === "gold" ? "text-primary" : "text-foreground"
                      }`}>
                        {col.product}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Mushroom Core", key: "mushroomCore" as const },
                  { label: "Target Biomarker", key: "targetBiomarker" as const },
                  { label: "Kinetic Advantage", key: "kineticAdvantage" as const },
                  { label: "Ideal Application", key: "idealApplication" as const },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-border/50 last:border-0">
                    <td className="p-5 text-muted-foreground font-medium text-xs uppercase tracking-widest">{row.label}</td>
                    {systemicMatrix.map((col) => (
                      <td key={col.product} className="p-5 text-center text-foreground/80">
                        {col[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    {/* Bioavailability Comparison */}
    <section className="pb-24">
      <div className="container max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-14">
          <div className="mb-10">
            <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-3 block">Head-to-Head</span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Bioavailability <span className="text-gradient-gold">Comparison</span>
            </h2>
          </div>
          <div className="space-y-6">
            {bioavailabilityData.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className={`text-sm font-medium ${item.isOurs ? "text-foreground" : "text-muted-foreground"}`}>
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold ${item.isOurs ? "text-primary" : "text-muted-foreground"}`}>
                    {item.range}
                  </span>
                </div>
                <div className="relative h-3 rounded-full bg-border/50 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                      item.isOurs ? "bg-gradient-to-r from-primary/80 to-primary glow-gold" : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 mt-8 leading-relaxed">
            Bioavailability estimates based on in-vitro dissolution testing and published peer-reviewed studies on mushroom extraction methods. Individual results may vary.
          </p>
        </div>
      </div>
    </section>

    {/* Certificate of Analysis */}
    <section className="pb-24">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-3 block">Transparency First</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Certificate of <span className="text-gradient-gold">Analysis</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every batch is sent to an independent, ISO-accredited laboratory for full-panel testing. We publish results because you deserve to know exactly what you are putting in your body.
          </p>
        </div>

        <div className="max-w-lg mx-auto rounded-2xl border border-border bg-card overflow-hidden">
          <div className="bg-primary/5 border-b border-border px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Sample Certificate of Analysis</p>
                <p className="text-xs text-muted-foreground">Total Neuro - Lion's Mane Nano Extract</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {coaFields.map((field) => (
              <div key={field.label} className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-muted-foreground">{field.label}</span>
                <span className={`text-sm font-semibold ${
                  field.value === "Pass" || field.value.includes("ND") ? "text-green-400"
                  : field.value === "40:1" ? "text-primary"
                  : "text-foreground"
                }`}>
                  {field.value}
                </span>
              </div>
            ))}
          </div>
          <div className="px-8 py-6 border-t border-border">
            <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 gap-2">
              <Download size={16} />
              Download Sample COA
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="pb-28">
      <div className="container max-w-4xl">
        <div className="text-center rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-14 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.06),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Bypass the Gauntlet.<br />
              <span className="text-gradient-gold">Master Your System.</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Clinical-grade bioactives. 40:1 nano-extraction. 95%+ bioavailability. Verified by third-party testing, felt in your body.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="glow-gold px-8 gap-2 group">
                <Link to="/shop">
                  Shop the Total Series
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:border-primary/30 px-8">
                <Link to="/quiz">Find Your Protocol</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Science;
