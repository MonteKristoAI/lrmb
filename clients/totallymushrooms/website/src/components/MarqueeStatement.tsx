const phrases = [
  "95%+ Bioavailability",
  "40:1 Extract Ratio",
  "178x Efficiency",
  "Cold Process < 45C",
  "Sub-Micron Particles",
  "Bypass the Gauntlet",
  "USDA Organic",
  "Batch-Level COA",
];

const MarqueeStatement = () => (
  <section className="py-6 overflow-hidden select-none" aria-hidden="true">
    {/* Large text marquee */}
    <div className="flex whitespace-nowrap" style={{ animation: 'marquee 60s linear infinite' }}>
      {[...phrases, ...phrases, ...phrases].map((phrase, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className="text-[clamp(3rem,10vw,8rem)] font-heading font-light text-foreground/[0.025] uppercase tracking-tight mx-4">
            {phrase}
          </span>
          <span className="w-2 h-2 rounded-full bg-primary/10 mx-4 shrink-0" />
        </span>
      ))}
    </div>
  </section>
);

export default MarqueeStatement;
