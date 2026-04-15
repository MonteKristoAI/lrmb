/*
 * AiiACo Platform Section - Liquid Glass Bio-Organic Design
 * Six foundations, glass cards, gold accents
 */
import { motion } from "framer-motion";

const foundations = [
  {
    num: "01",
    title: "Business Intelligence Audit",
    body: "Structured diagnostic of your workflows, data infrastructure, and decision bottlenecks. We map where manual processes create throughput drag, where data quality limits AI readiness, and where competitive exposure is highest. Output: a prioritized leverage map with quantified ROI targets per integration point.",
  },
  {
    num: "02",
    title: "Strategic AI Architecture",
    body: "Custom integration blueprint mapping each leverage point to a specific AI capability: LLMs for document extraction and communication, automation agents for workflow orchestration, predictive models for demand forecasting and risk scoring. Includes system selection, integration architecture, governance framework, and measurable success criteria.",
  },
  {
    num: "03",
    title: "AI Workforce Deployment",
    body: "We configure and deploy the AI systems identified in the blueprint: API integrations with your ERP, CRM, and operational platforms; prompt-engineered LLM pipelines; multi-agent workflow orchestration; and data pipeline setup. Every system is validated against accuracy thresholds before production go-live.",
  },
  {
    num: "04",
    title: "Full Execution",
    body: "AiiACo manages the complete implementation stack - vendor contracting, API configuration, model tuning, integration testing, and production deployment. You do not manage tools, prompts, or vendor relationships. You receive running systems: automated workflows, AI-generated outputs, and reduced manual processing time.",
  },
  {
    num: "05",
    title: "Managed Optimization",
    body: "Monthly performance reporting against defined KPIs, model retraining as your business data evolves, governance reviews for regulatory compliance, and proactive identification of new automation opportunities. AI infrastructure requires ongoing management to maintain accuracy and compound performance over time.",
  },
  {
    num: "06",
    title: "Performance Alignment",
    body: "For qualifying engagements: reduced upfront cost with success-linked fees tied to measurable outcomes - processing time reduction, throughput increase, or cost savings from automation. Incentives are aligned from day one. AiiACo earns more when your operations perform better.",
  },
];

export default function PlatformSection() {
  return (
    <section
      id="platform"
      className="mobile-section"
      style={{
        position: "relative",
        padding: "120px 0",
        background: "#060B14",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 600px at 85% 50%, rgba(184,156,74,0.04) 0%, transparent 60%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "640px", marginBottom: "64px" }}
        >
          <div className="section-pill" style={{ marginBottom: "20px", width: "fit-content" }}>
            <span className="dot" />
            The AiiACo Authority Platform
          </div>
          <h2 className="section-headline shimmer-headline" style={{ marginBottom: "20px" }}>
            One Engagement. <span className="accent">Complete AI Operational Command.</span>
          </h2>
          <div className="gold-divider" style={{ marginBottom: "20px" }} />
          <p className="section-subhead" style={{ marginBottom: "16px" }}>
            Vendors sell tools. Consultants sell decks. AiiACo delivers the entire operating model - diagnostics, architecture, deployment, managed execution, and performance-aligned outcomes. This is not a service. It is a structural upgrade.
          </p>
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14.5px", lineHeight: 1.65, color: "rgba(200,215,230,0.55)", margin: 0, maxWidth: "58ch" }}>
            The businesses winning the next decade are not experimenting with AI. They are running on it. AiiACo is the authority that makes that transition irreversible.
          </p>
        </motion.div>

        {/* Foundation cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
            gap: "14px",
          }}
        >
          {foundations.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="glass-card"
              style={{ padding: "28px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div className="phase-badge" style={{ flexShrink: 0 }}>{f.num}</div>
                <div>
                  <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "19px", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 10px", lineHeight: 1.15, letterSpacing: "-0.2px" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", lineHeight: 1.65, color: "rgba(200,215,230,0.70)", margin: 0 }}>
                    {f.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-card-gold"
          style={{ marginTop: "40px", padding: "36px 40px", textAlign: "center" }}
        >
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.4px" }}>
            You do not hire AI tools. You hire{" "}
            <span style={{ color: "#D4A843" }}>AiiACo</span>.
          </p>
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "16px", color: "rgba(200,215,230,0.70)", margin: 0, maxWidth: "60ch", marginLeft: "auto", marginRight: "auto" }}>
            AiiACo assembles, deploys, and manages your entire AI workforce - and delivers
            the results, not the workload.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
