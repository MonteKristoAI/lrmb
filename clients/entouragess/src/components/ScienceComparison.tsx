import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BRAND_NAME } from "@/lib/brand";

const rows = [
  { label: "Onset Time", traditional: "60–180 min", ours: "5–15 min" },
  { label: "Bioavailability", traditional: "2–6%", ours: "18–22%" },
  { label: "THC Form", traditional: "11-Hydroxy (heavy)", ours: "Delta 9 (lighter)" },
  { label: "Taste", traditional: "Bitter", ours: "Clean, neutral" },
  { label: "Experience", traditional: "Sedating, unpredictable", ours: "Social, sessionable" },
];

const ScienceComparison = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24" ref={ref}>
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Traditional vs. <span className="text-gold">{BRAND_NAME}</span>
          </h2>
          <p className="text-muted-foreground">Not all edibles are created equal.</p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-secondary/50">
            <div className="p-4" />
            <div className="p-4 text-center">
              <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">Traditional Edibles</span>
            </div>
            <div className="p-4 text-center">
              <span className="text-xs font-bold tracking-wider uppercase text-gold">{BRAND_NAME}</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((r, i) => (
            <div key={r.label} className={`grid grid-cols-3 ${i < rows.length - 1 ? "border-b border-border" : ""}`}>
              <div className="p-4 flex items-center">
                <span className="text-sm font-semibold text-foreground">{r.label}</span>
              </div>
              <div className="p-4 text-center flex items-center justify-center">
                <span className="text-sm text-muted-foreground">{r.traditional}</span>
              </div>
              <div className="p-4 text-center flex items-center justify-center">
                <span className="text-sm font-semibold text-gold">{r.ours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScienceComparison;
