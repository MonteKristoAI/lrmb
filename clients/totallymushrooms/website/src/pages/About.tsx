import Layout from "@/components/Layout";
import TrustBar from "@/components/TrustBar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, FlaskConical, Shield, Beaker, Factory, Award } from "lucide-react";
import aboutFounder from "@/assets/about-founder.png";

const values = [
  { icon: Leaf, title: "Vertical Integration", desc: "We grow every mushroom ourselves. USDA certified organic protocols, pure fruiting body cultivation, no grain substrates, no contract farms." },
  { icon: FlaskConical, title: "Ultrasonic Nano-Refinement", desc: "Our cold-process extraction (<45C) strips chitin cell walls while preserving fragile bioactives intact. 40:1 concentration, 100-500nm particle size." },
  { icon: Shield, title: "Batch-Level COA", desc: "Every production run is sent to an independent, ISO-accredited lab. Full-panel testing: heavy metals, pesticides, microbial, beta-glucan content." },
  { icon: Beaker, title: "178x Efficiency", desc: "Sub-micron nano-emulsion delivers a 178-fold efficiency multiplier over crude powders and 7.0x the absorption of conventional capsules." },
  { icon: Factory, title: "GMP Certified", desc: "Our facility follows Good Manufacturing Practice standards. Every step documented, every batch traceable, every product consistent." },
  { icon: Award, title: "Zero Compromise", desc: "No fillers. No mycelium-on-grain. No heat-destroyed extracts. If it does not meet our standard, it does not leave the facility." },
];

const About = () => (
  <Layout>
    {/* Hero */}
    <section className="pt-28 pb-24">
      <div className="container max-w-5xl">
        <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-4 block">Nashville, TN</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          About <span className="text-gradient-gold">Totally Mushrooms</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl leading-relaxed">
          Clinical-grade bioactives delivered with unrivaled precision. We engineered a fundamentally different approach to mushroom supplementation because the industry standard was never good enough.
        </p>

        {/* Founder + Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="rounded-2xl overflow-hidden border border-border relative group">
            <img src={aboutFounder} alt="Totally Mushrooms team" className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Purity in the Organism.<br />
              <span className="text-gradient-gold">Precision in the Machine.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Totally Mushrooms was built on a single conviction: the mushroom supplement industry is fundamentally broken. Crude capsules with mycelium-on-grain fillers. Heat-destroyed extracts that lose 80% of their bioactives to the gastric gauntlet. Label claims that bear no resemblance to what your cells actually receive.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We took a different path. We grow our own mushrooms under USDA organic protocols. We developed proprietary ultrasonic nano-refinement that operates below 45C to preserve every fragile compound. We concentrate to a 40:1 ratio so that 50mg of our extract delivers the equivalent of 2,000mg dried mushroom. And we test every batch through an independent lab because transparency is not optional.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The result: 95%+ bioavailability. 178x the efficiency of crude powders. Supplements that actually reach your cells.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-widest text-primary/60 mb-3 block">What Sets Us Apart</span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="text-gradient-gold">Standards</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-8 space-y-4 hover-card-lift">
                <div className="w-12 h-12 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center py-16 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.06),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                ["40:1", "Extract Ratio"],
                ["95%+", "Bioavailability"],
                ["178x", "Efficiency"],
                ["<45C", "Cold Process"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-primary font-heading">{val}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to experience the difference?</h3>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="glow-gold px-8 gap-2 group">
              <Link to="/shop">
                Shop the Total Series
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:border-primary/30 px-8">
              <Link to="/science">Our Science</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <TrustBar />
  </Layout>
);

export default About;
