const audiences = [
  { emoji: "🍬", title: "Existing Edibles Enthusiasts", desc: "Current edibles users frustrated by inconsistent onset times and heavy, sedating effects. Our entourage formulation + fast delivery gives a lighter, more enjoyable experience." },
  { emoji: "🌿", title: "Traditional Cannabis Users", desc: "Smokers and vapers looking for a cleaner format that delivers the same type of effect. Our THC + CBD + terpene blend mimics the entourage effect of smoking, with 5–15 min onset." },
  { emoji: "🕊️", title: "Nervous Nellies", desc: "New or cautious consumers who've had bad edibles experiences. Predictable onset, balanced formulation, and easy dosing make our gummies stress-free." },
  { emoji: "🌱", title: "Natural Alternatives Seekers", desc: "Consumers looking for plant-based wellness solutions. Our full-spectrum formulation works with the plant's natural cannabinoid and terpene profiles, no synthetics." },
  { emoji: "⚡", title: "Busy Bees", desc: "Active professionals who need fast, reliable effects without dedicating hours to waiting. Social, sessionable, and designed for clarity, not couch-lock." },
  { emoji: "🧘", title: "Wellness Seekers", desc: "Health-focused consumers using cannabis for sleep, stress, or recovery who value precise dosing, a balanced entourage effect, and a clean product experience." },
];

const AudienceGrid = () => (
  <section className="py-20 section-divider">
    <div className="container">
      <div className="text-center mb-12 fade-in">
        <hr className="hr-accent mx-auto" />
        <h2 className="text-2xl md:text-3xl font-bold">Who Our Gummies Are For</h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
          Designed for six types of cannabis consumers who want something better than traditional edibles.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in stagger-1">
        {audiences.map((a) => (
          <div key={a.title} className="bg-card border border-border rounded-xl p-6 card-hover">
            <div className="text-3xl mb-3">{a.emoji}</div>
            <p className="text-sm font-bold text-foreground mb-2">{a.title}</p>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceGrid;
