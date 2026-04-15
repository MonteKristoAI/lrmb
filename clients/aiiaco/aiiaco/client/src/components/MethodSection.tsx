/*
 * AiiACo Method Section - Liquid Glass Bio-Organic Design
 * 5-phase process with glass cards and gold spine
 */
import { motion } from "framer-motion";

const phases = [
  {
    num: "01",
    title: "Find the Friction",
    sub: "Operational Audit - No Assumptions",
    body: "We analyze how work actually flows through your business - where tasks wait on people, where admins chase updates, where data conflicts, and where coordination is eating margin.",
    outputs: ["Process mapping", "Bottleneck identification", "Coordination audit", "Data reliability check", "Workflow gaps", "Margin leaks"],
  },
  {
    num: "02",
    title: "Implement the Fix",
    sub: "Practical Systems. Real Execution.",
    body: "We implement streamlined workflows that remove manual coordination, activate dormant CRM and database systems, and automate the handoffs that currently require human follow-up.",
    outputs: ["Workflow automation", "CRM reactivation", "Outreach automation", "Admin reduction", "Mobile-first capture", "System integration"],
  },
  {
    num: "03",
    title: "Measure the Improvement",
    sub: "Numbers You Can Actually Trust",
    body: "We establish a single source of operational truth - synced, accurate, and available in real time - so leadership can make decisions faster and with confidence.",
    outputs: ["Real-time dashboards", "Execution speed metrics", "Coordination reduction", "Revenue visibility", "Team performance", "Operational KPIs"],
  },
  {
    num: "04",
    title: "Expand What Works",
    sub: "Scale Successful Systems Across the Company",
    body: "Once a module is working, we expand it. The same operational clarity that fixed one department gets applied across the business - compounding efficiency over time.",
    outputs: ["Cross-department rollout", "Playbook documentation", "Team training", "Scaling roadmap", "Ongoing optimization", "Performance reporting"],
  },
];

export default function MethodSection() {
  return (
    <section
      id="method"
      className="mobile-section"
      style={{
        position: "relative",
        padding: "120px 0",
        background: "#03050A",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .method-header-row {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .method-header-icon {
            width: 64px !important;
            height: 64px !important;
          }
          .method-phase-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .method-phase-badge-col {
            flex-direction: row !important;
            align-items: center !important;
          }
          .method-phase-spine {
            display: none !important;
          }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 600px at 10% 60%, rgba(184,156,74,0.04) 0%, transparent 55%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "640px", marginBottom: "72px" }}
        >
          <div className="method-header-row" style={{ display: "flex", alignItems: "flex-start", gap: "24px", marginBottom: "8px" }}>
            <img
              src="/images/landmark-method.webp"
              alt="Method"
              className="method-header-icon"
              style={{ width: "88px", height: "88px", objectFit: "contain", flexShrink: 0, marginTop: "4px" }}
            />
            <div>
              <div className="section-pill" style={{ marginBottom: "16px", width: "fit-content" }}>
                <span className="dot" />
                How AiiA Works
              </div>
              <h2 className="section-headline shimmer-headline" style={{ marginBottom: "0" }}>
                Find. Implement. Measure. <span className="accent">Expand.</span>
              </h2>
            </div>
          </div>
          <div className="gold-divider" style={{ marginBottom: "20px" }} />
          <p className="section-subhead">
            Most operational modules are implemented within 2-4 weeks. We find the friction, build the fix, measure the improvement, and expand what works across the business.
          </p>
        </motion.div>

        {/* Phases */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {phases.map((phase, i) => (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.55 }}
              className="glass-card"
              style={{ padding: "28px 32px" }}
            >
              <div className="method-phase-grid" style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "20px", alignItems: "flex-start" }}>
                {/* Badge + spine */}
                <div className="method-phase-badge-col" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div className="phase-badge" style={{ width: "48px", height: "48px", fontSize: "13px", borderRadius: "14px" }}>{phase.num}</div>
                  {i < phases.length - 1 && (
                    <div className="method-phase-spine" style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, rgba(184,156,74,0.22), transparent)" }} />
                  )}
                </div>
                {/* Content */}
                <div>
                  <div style={{ marginBottom: "4px" }}>
                    <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(184,156,74,0.72)" }}>
                      {phase.sub}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(19px, 2vw, 25px)", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 12px", lineHeight: 1.15, letterSpacing: "-0.3px" }}>
                    {phase.title}
                  </h3>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", lineHeight: 1.65, color: "rgba(200,215,230,0.70)", margin: "0 0 18px", maxWidth: "72ch" }}>
                    {phase.body}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                    {phase.outputs.map((o) => (
                      <span
                        key={o}
                        style={{
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "rgba(200,215,230,0.72)",
                          padding: "5px 12px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
