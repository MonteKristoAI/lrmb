/*
 * AiiACo Industries Section - Focused Niche: Real Estate, Mortgage, CRE, Management Consulting
 * Liquid Glass Bio-Organic Design
 * Mobile: single-column cards, responsive header with icon
 */
import { motion } from "framer-motion";

const focusedIndustries = [
  {
    slug: "real-estate-brokerage",
    name: "Real Estate & Brokerage",
    icon: "/images/icon-skyline.webp",
    description: "AI lead qualification, automated follow-up, listing content generation, and pipeline intelligence for residential and commercial brokerages.",
    kpis: ["3× Lead Conversion", "70% Less Manual Follow-Up", "60% Faster Listings"],
  },
  {
    slug: "mortgage-lending",
    name: "Mortgage & Lending",
    icon: "/images/icon-mortgage.webp",
    description: "Document extraction, borrower communication automation, compliance monitoring, and pipeline acceleration for mortgage originators and lenders.",
    kpis: ["80% Faster Document Processing", "60% Fewer Status Calls", "40% Faster Clear-to-Close"],
  },
  {
    slug: "commercial-real-estate",
    name: "Commercial Real Estate & Property Management",
    icon: "/images/icon-cre.webp",
    description: "Tenant communication automation, lease administration intelligence, predictive maintenance, and portfolio performance dashboards for CRE operators.",
    kpis: ["60% Less Communication Overhead", "0 Missed Lease Dates", "35% Less Reactive Maintenance"],
  },
  {
    slug: "management-consulting",
    name: "Management Consulting",
    icon: "/images/icon-consulting.webp",
    description: "Proposal and deliverable generation, project risk monitoring, knowledge management, and account expansion intelligence for consulting firms.",
    kpis: ["60% Faster Proposals", "40% Fewer Project Overruns", "3× Knowledge Accessibility"],
  },
];

const capabilities = [
  { title: "Revenue Operations", desc: "Lead qualification, pipeline automation, conversion tracking, and revenue forecasting." },
  { title: "Client Operations", desc: "Automated communication, response consistency, retention systems, and lifecycle management." },
  { title: "Document Intelligence", desc: "Extraction, classification, validation, and compliance monitoring across document-heavy workflows." },
  { title: "Financial Operations", desc: "Reporting automation, anomaly detection, compliance monitoring, and forecasting." },
  { title: "Workforce Optimization", desc: "Recruitment automation, onboarding systems, performance management, and workforce analytics." },
  { title: "Operational Infrastructure", desc: "Workflow orchestration, documentation automation, approvals, and decision support." },
];

export default function Industries() {
  return (
    <section
      id="industries"
      className="mobile-section"
      style={{
        position: "relative",
        padding: "120px 0",
        background: "#03050A",
        overflow: "hidden",
      }}
    >
      <style>{`
        .industries-header-row {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 28px;
        }
        .industries-header-icon {
          width: 96px;
          height: 96px;
          object-fit: contain;
          flex-shrink: 0;
          margin-top: 4px;
        }
        @media (max-width: 640px) {
          .industries-header-row {
            flex-direction: column;
            gap: 16px;
          }
          .industries-header-icon {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1000px 600px at 80% 30%, rgba(184,156,74,0.04) 0%, transparent 55%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "640px", marginBottom: "64px" }}
        >
          <div className="industries-header-row">
            <img
              src="/images/landmark-industries.webp"
              alt="Industries"
              className="industries-header-icon"
            />
            <div>
              <div className="section-pill" style={{ marginBottom: "16px", width: "fit-content" }}>
                <span className="dot" />
                Industries
              </div>
              <h2 className="section-headline shimmer-headline" style={{ marginBottom: "20px" }}>
                Built for Real Estate,<br />
                <span className="accent">Lending & Consulting.</span>
              </h2>
            </div>
          </div>
          <div className="gold-divider" style={{ marginBottom: "20px" }} />
          <p className="section-subhead">
            AiiACo operates at the intersection of real estate, mortgage lending, commercial property, and management consulting - the four sectors where AI integration delivers the fastest, most measurable operational returns.
          </p>
        </motion.div>

        {/* Industry Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "24px",
            marginBottom: "72px",
          }}
        >
          {focusedIndustries.map((industry, i) => (
            <motion.a
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                display: "block",
                textDecoration: "none",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(184,156,74,0.20)",
                padding: "28px",
                transition: "background 0.25s, border-color 0.25s, transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgba(184,156,74,0.07)";
                el.style.borderColor = "rgba(184,156,74,0.40)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgba(255,255,255,0.03)";
                el.style.borderColor = "rgba(184,156,74,0.20)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ width: "48px", height: "48px", marginBottom: "16px" }}>
                <img
                  src={industry.icon}
                  alt={industry.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <h3 style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.95)",
                marginBottom: "12px",
                lineHeight: 1.3,
              }}>
                {industry.name}
              </h3>
              <p style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.65,
                color: "rgba(200,215,230,0.68)",
                marginBottom: "20px",
              }}>
                {industry.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {industry.kpis.map((kpi) => (
                  <span key={kpi} style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "rgba(184,156,74,0.85)",
                    letterSpacing: "0.3px",
                  }}>
                    ✓ {kpi}
                  </span>
                ))}
              </div>
              <div style={{
                marginTop: "20px",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(184,156,74,0.75)",
              }}>
                Explore {industry.name.split("&")[0].trim()} AI →
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "24px" }}
        >
          <h3 style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.88)",
            marginBottom: "32px",
            letterSpacing: "-0.3px",
          }}>
            Core Capability Areas
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: "16px",
          }}>
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "20px",
                }}
              >
                <div style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "rgba(184,156,74,0.88)",
                  marginBottom: "8px",
                  letterSpacing: "0.3px",
                }}>
                  {cap.title}
                </div>
                <div style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "rgba(200,215,230,0.60)",
                }}>
                  {cap.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
