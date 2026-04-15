const items = [
  "USDA Organic",
  "Third-Party Lab Tested",
  "GMP Certified",
  "Non-GMO",
  "Vegan",
  "Made in USA",
  "40:1 Extract Ratio",
  "95%+ Bioavailability",
  "Cold Process < 45C",
  "Batch-Level COA",
];

const TrustBar = () => (
  <div className="py-5 border-y border-border/30 bg-card/20 overflow-hidden">
    <div className="flex whitespace-nowrap" style={{ animation: 'marquee 45s linear infinite' }}>
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center gap-6 mx-6">
          <span className="text-xs uppercase tracking-[0.12em] text-foreground/55 font-medium">{item}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
        </span>
      ))}
    </div>
  </div>
);

export default TrustBar;
