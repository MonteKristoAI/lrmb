/*
 * AiiACo Engagement Models - Liquid Glass Bio-Organic Design
 * Three pricing tiers with glass cards
 * Mobile: single-column cards, responsive header with icon
 */
import { motion } from "framer-motion";
import OrCallDirect from "@/components/OrCallDirect";

const models = [
  {
    name: "Strategic Blueprint",
    tag: "Foundational",
    price: "Fixed Investment",
    desc: "A structured diagnostic and integration blueprint. Defines what to upgrade, in what order, and how to measure it.",
    includes: [
      "Business architecture audit",
      "Bottleneck and friction mapping",
      "AI integration blueprint",
      "Prioritized deployment sequence",
      "ROI targets and success metrics",
      "Governance and tooling framework",
    ],
    ideal: "For organizations that want strategic clarity before committing to execution.",
    featured: false,
  },
  {
    name: "Full Integration",
    tag: "Most Selected",
    price: "Structured Retainer",
    desc: "End-to-end deployment: blueprint, AI workforce configuration, integration, managed optimization, and performance reporting.",
    includes: [
      "Everything in Strategic Blueprint",
      "AI workforce assembly and configuration",
      "Full operational integration",
      "Ongoing management and monitoring",
      "Performance reporting against benchmarks",
      "Quarterly strategic expansion reviews",
    ],
    ideal: "For organizations ready to operate with AI infrastructure, not experiment with it.",
    featured: true,
  },
  {
    name: "Performance Partnership",
    tag: "Results-Aligned",
    price: "Milestone-Based",
    desc: "Reduced upfront investment. Milestone-based fees tied to defined outcomes. We earn more when you hit your targets.",
    includes: [
      "Full integration scope included",
      "Reduced upfront investment",
      "Milestone-based fee structure",
      "Defined outcome benchmarks",
      "Shared accountability model",
      "Long-term partnership alignment",
    ],
    ideal: "For organizations that want vendor compensation aligned to business outcomes.",
    featured: false,
  },
];

export default function EngagementModels() {
  const scrollToContact = () =>
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="models"
      className="mobile-section"
      style={{
        position: "relative",
        padding: "120px 0",
        background: "#060B14",
        overflow: "hidden",
      }}
    >
      <style>{`
        .models-header-row {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 8px;
        }
        .models-header-icon {
          width: 88px;
          height: 88px;
          object-fit: contain;
          flex-shrink: 0;
          margin-top: 4px;
        }
        @media (max-width: 640px) {
          .models-header-row {
            flex-direction: column;
            gap: 16px;
          }
          .models-header-icon {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 600px at 50% 50%, rgba(184,156,74,0.05) 0%, transparent 60%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "640px", marginBottom: "64px" }}
        >
          <div className="models-header-row">
            <img
              src="/images/landmark-models.webp"
              alt="Engagement Models"
              className="models-header-icon"
            />
            <div>
              <div className="section-pill" style={{ marginBottom: "16px", width: "fit-content" }}>
                <span className="dot" />
                Engagement Models
              </div>
              <h2 className="section-headline shimmer-headline" style={{ marginBottom: "0" }}>
                You Choose the Structure. <span className="accent">AiiACo Delivers the Outcome.</span>
              </h2>
            </div>
          </div>
          <div className="gold-divider" style={{ marginBottom: "20px" }} />
          <p className="section-subhead">
            Three engagement structures. One non-negotiable standard: measurable, operational results. The model you select determines how the investment is structured - not what gets built, not how it is executed, and not what you receive.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className={model.featured ? "glass-card-gold" : "glass-card"}
              style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}
            >
              {model.featured && (
                <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, rgba(184,156,74,0.95), rgba(212,168,67,0.80))", color: "#0a0800", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: "10px", letterSpacing: "1.2px", textTransform: "uppercase", padding: "5px 16px", borderRadius: "0 0 10px 10px", whiteSpace: "nowrap" }}>
                  Most Selected
                </div>
              )}

              <div>
                {!model.featured && (
                  <div className="section-pill" style={{ marginBottom: "12px", width: "fit-content", fontSize: "10px" }}>
                    <span className="dot" />
                    {model.tag}
                  </div>
                )}
                {model.featured && <div style={{ height: "22px" }} />}
                <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "24px", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 6px", letterSpacing: "-0.3px", lineHeight: 1.1 }}>
                  {model.name}
                </h3>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: model.featured ? "#D4A843" : "rgba(184,156,74,0.62)", margin: 0 }}>
                  {model.price}
                </p>
              </div>

              <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", lineHeight: 1.65, color: "rgba(200,215,230,0.70)", margin: 0 }}>
                {model.desc}
              </p>

              <div>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(184,156,74,0.58)", marginBottom: "12px" }}>Includes</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {model.includes.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", color: "rgba(210,220,235,0.80)" }}>
                      <span style={{ color: "#D4A843", fontWeight: 900, flexShrink: 0, marginTop: "1px", fontSize: "11px" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginTop: "auto" }}>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(200,215,230,0.62)", margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>Ideal for:</strong>{" "}{model.ideal}
                </p>
              </div>

              <button onClick={scrollToContact} className={model.featured ? "btn-gold" : "btn-glass"} style={{ justifyContent: "center" }}>
                {model.featured ? "Begin Full Integration" : "Discuss This Model"}
              </button>
              <OrCallDirect marginTop="6px" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.40)", marginTop: "32px", textAlign: "center" }}
        >
          All engagements begin with a structured discovery process. Pricing is determined following the initial business intelligence audit.
        </motion.p>
      </div>
    </section>
  );
}
