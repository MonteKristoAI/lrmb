/*
 * AiiACo Built For Corporate Age - Liquid Glass Bio-Organic Design
 * Mobile: responsive CTA card padding, stacked buttons
 */
import { motion } from "framer-motion";
import OrCallDirect from "@/components/OrCallDirect";

const principles = [
  { title: "Diagnostic First", desc: "We do not recommend before we understand. Every engagement begins with a structured audit, not a sales pitch." },
  { title: "Execution, Not Advice", desc: "We build and run the system. Recommendations without implementation are not our model." },
  { title: "Measurable or Nothing", desc: "Every deployment is tied to defined KPIs. If it cannot be measured, it will not be deployed." },
  { title: "Governance by Default", desc: "Quality controls, audit trails, and exception handling are built into every integration, not added later." },
  { title: "Outcome Alignment", desc: "Performance-based structures are available because we are confident in what we build." },
  { title: "No Internal Overload", desc: "We manage the system. Your team manages the business. Complexity stays on our side of the engagement." },
];

export default function BuiltForCorporateAge() {
  const scrollToContact = () =>
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="about"
      className="mobile-section"
      style={{
        position: "relative",
        padding: "120px 0",
        background: "#03050A",
        overflow: "hidden",
      }}
    >
      <style>{`
        .corporate-cta-card {
          padding: 52px 48px;
          text-align: center;
        }
        .corporate-cta-buttons {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .corporate-cta-card {
            padding: 32px 20px;
          }
          .corporate-cta-buttons {
            flex-direction: column;
          }
          .corporate-cta-buttons .btn-gold,
          .corporate-cta-buttons .btn-glass {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1200px 700px at 50% 50%, rgba(3,5,10,0.60) 0%, rgba(3,5,10,0.90) 70%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="section-pill" style={{ marginBottom: "20px", width: "fit-content", margin: "0 auto 20px" }}>
            <span className="dot" />
            The AiiACo Operating Constraints
          </div>
          <h2 className="section-headline shimmer-headline" style={{ marginBottom: "20px", textAlign: "center" }}>
            Non-Negotiable Standards. <span className="accent">Every Engagement. No Exceptions.</span>
          </h2>
          <div className="gold-divider" style={{ marginBottom: "20px", margin: "0 auto 20px" }} />
          <p className="section-subhead" style={{ textAlign: "center", margin: "0 auto", maxWidth: "56ch" }}>
            These are not values statements or marketing commitments. They are the operating constraints that govern every managed AI integration engagement AiiACo runs.
          </p>
        </motion.div>

        {/* Principles grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: "14px", marginBottom: "64px" }}>
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.10, duration: 0.5 }}
              className="glass-card"
              style={{ padding: "28px", textAlign: "center" }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(184,156,74,0.10)", border: "1px solid rgba(184,156,74,0.22)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "16px", color: "rgba(184,156,74,0.80)" }}>
                ◆
              </div>
              <h4 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "19px", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 10px", letterSpacing: "-0.2px" }}>
                {p.title}
              </h4>
              <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", lineHeight: 1.6, color: "rgba(200,215,230,0.65)", margin: 0 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-card-gold corporate-cta-card"
        >
          <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(24px, 3.5vw, 48px)", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-0.8px" }}>
            The Corporate Age of AI has already begun.
            <br />
            <span style={{ color: "#D4A843" }}>The only question is whether you are building the infrastructure or watching others do it.</span>
          </h2>
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(15px, 1.6vw, 18px)", color: "rgba(200,215,230,0.75)", margin: "0 auto 32px", maxWidth: "56ch", lineHeight: 1.6 }}>
            AiiACo is the AI Integration Authority for the Corporate Age. One engagement. Complete operational AI infrastructure. Delivered, managed, and performance-aligned.
          </p>
          <div className="corporate-cta-buttons">
            <button onClick={scrollToContact} className="btn-gold" style={{ fontSize: "16px", padding: "16px 36px" }}>
              Request Upgrade
            </button>
            <button
              onClick={() => document.querySelector("#models")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-glass"
              style={{ fontSize: "16px", padding: "16px 28px" }}
            >
              Review Engagement Models
            </button>
          </div>
          <OrCallDirect marginTop="8px" />
        </motion.div>
      </div>
    </section>
  );
}
