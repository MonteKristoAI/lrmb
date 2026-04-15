import { Globe, Grid3X3, Layers, Users } from "lucide-react";

const pillars = [
  { icon: Globe, title: "TiME INFUSION", desc: "Thermodynamic Individual Molecular Encapsulation creates hydrophilic cannabinoids for rapid soft-tissue absorption." },
  { icon: Grid3X3, title: "Delta-9-THC Preserved", desc: "Soft tissue absorption preserves Delta-9-THC, minimizing conversion to 11-Hydroxy-THC for a lighter, euphoric experience." },
  { icon: Layers, title: "Premium Effects", desc: "A more uplifting sensory experience like smoking cannabis, without the intense sedation known as couch-lock." },
  { icon: Users, title: "Social Ready", desc: "Predictable onset and offset times make TiME INFUSION gummies perfect for social consumption and events." },
];

const ScienceSection = () => (
  <section id="science" className="py-20 section-divider">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="fade-in">
          <hr className="hr-accent" />
          <h2 className="text-2xl md:text-3xl font-heading mb-4">
            The Science Behind<br /><span className="text-gold">TiME INFUSION</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Our premium cannabis gummies taste great and take effect in 5–15 minutes vs. up to 90 minutes for traditional edibles. TiME INFUSION creates a hydrophilic coating around oil molecules so gummies absorb through soft tissues, preempting first-pass metabolism.
          </p>
          <div className="flex gap-8">
            {[
              { val: "5–15", label: "Min Onset" },
              { val: "18–22%", label: "Bioavailability" },
              { val: "Delta-9", label: "THC Preserved" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl font-black text-gold">{s.val}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 fade-in stagger-1">
          {pillars.map((p) => (
            <div key={p.title} className="bg-card border border-border rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg gold-check-bg flex items-center justify-center mb-3">
                <p.icon size={18} className="text-gold" />
              </div>
              <div className="text-sm font-bold text-foreground mb-1">{p.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ScienceSection;
