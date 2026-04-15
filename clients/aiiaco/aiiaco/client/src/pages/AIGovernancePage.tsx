/*
 * AiiACo - /ai-governance SEO Authority Page
 * Design: Liquid Glass Bio-Organic | SF Pro Display + SF Pro Text | Deep void-black + gold
 * Purpose: Rank for "AI governance framework", "enterprise AI risk", "AI compliance"
 * Also signals seriousness to enterprise buyers evaluating AiiACo
 */

import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import RelatedServices from "@/components/RelatedServices";
import { motion } from "framer-motion";

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const governancePillars = [
  {
    num: "01",
    title: "Data Security & Access Controls",
    body: "All AI systems deployed by AiiACo operate under strict data access controls. Client data is processed in isolated environments with role-based access, encryption at rest and in transit (AES-256, TLS 1.3), and no cross-client data sharing. AI models are not trained on client data without explicit written authorization. Data residency requirements are documented and enforced per engagement.",
    tags: ["AES-256 encryption", "TLS 1.3", "Role-based access", "Data isolation", "Residency controls"],
  },
  {
    num: "02",
    title: "Model Validation Standards",
    body: "Before any AI model enters production, AiiACo conducts structured validation: accuracy benchmarking against defined thresholds, edge case testing with adversarial inputs, bias assessment for decision-making models, and output consistency testing across representative data samples. Models that do not meet performance thresholds are retrained or replaced before go-live.",
    tags: ["Accuracy benchmarking", "Adversarial testing", "Bias assessment", "Output consistency", "Pre-production validation"],
  },
  {
    num: "03",
    title: "Human-in-the-Loop Protocols",
    body: "AiiACo defines explicit human oversight boundaries for every deployed AI system. High-stakes decisions (financial approvals above defined thresholds, legal document generation, medical data processing) require human review before execution. Escalation paths are documented, tested, and enforced. AI autonomy boundaries are agreed upon with clients before deployment and reviewed quarterly.",
    tags: ["Oversight boundaries", "Escalation paths", "Approval thresholds", "Quarterly review", "Documented protocols"],
  },
  {
    num: "04",
    title: "Audit Trails & Explainability",
    body: "Every AI decision or output in a production system is logged with timestamp, input context, model version, and output. For regulated industries, AiiACo implements explainability layers that document why a model produced a specific output - critical for financial services, healthcare, and legal applications subject to regulatory audit. Logs are retained per client-specified retention policies.",
    tags: ["Decision logging", "Model versioning", "Explainability layers", "Regulatory audit support", "Retention policies"],
  },
  {
    num: "05",
    title: "Risk Controls & Failure Modes",
    body: "AiiACo documents failure modes for every deployed AI system before go-live: what happens when a model produces a low-confidence output, when an API integration fails, when data quality degrades, or when a model encounters out-of-distribution inputs. Fallback procedures are tested and operational. Monitoring alerts are configured for anomalous output patterns, latency spikes, and accuracy degradation.",
    tags: ["Failure mode documentation", "Fallback procedures", "Anomaly monitoring", "Latency alerts", "Accuracy tracking"],
  },
  {
    num: "06",
    title: "Regulatory Alignment",
    body: "AiiACo tracks and aligns AI deployments with applicable regulatory frameworks: EU AI Act risk classification for systems deployed in European markets, NIST AI Risk Management Framework for US federal and regulated industries, GDPR and CCPA compliance for data processing pipelines, and sector-specific requirements for financial services (SR 11-7, MiFID II), healthcare (HIPAA), and energy (NERC CIP). Governance documentation is updated as regulations evolve.",
    tags: ["EU AI Act", "NIST AI RMF", "GDPR / CCPA", "SR 11-7 / MiFID II", "HIPAA alignment"],
  },
];

const governanceFaqs = [
  {
    question: "What is an AI governance framework and why does it matter for enterprise deployments?",
    answer: "An AI governance framework is a structured set of policies, controls, and oversight mechanisms that define how AI systems are designed, deployed, monitored, and audited within an organization. For enterprise deployments, governance matters because: (1) AI systems making automated decisions create legal and regulatory liability without proper oversight documentation; (2) model drift and data quality degradation cause silent performance failures that are only caught through monitoring; (3) regulators in financial services, healthcare, and energy require documented evidence of AI risk controls; and (4) enterprise buyers and boards require assurance that AI systems will not create reputational, operational, or compliance risk.",
  },
  {
    question: "How does AiiACo handle data security when deploying AI systems?",
    answer: "AiiACo deploys AI systems with data security controls defined before any system is built. Client data is processed in isolated environments - no cross-client data sharing, no use of client data for model training without explicit authorization. All data in transit is encrypted with TLS 1.3. Data at rest uses AES-256 encryption. Role-based access controls limit which team members and systems can access which data. Data residency requirements (e.g., EU data must remain in EU infrastructure) are documented and enforced per engagement.",
  },
  {
    question: "What is model validation and how does AiiACo validate AI models before deployment?",
    answer: "Model validation is the process of verifying that an AI model performs as expected before it is deployed in a production environment. AiiACo's validation process includes: accuracy benchmarking against defined thresholds on held-out test data, adversarial testing with edge cases and unusual inputs, bias assessment for models that make decisions affecting people or financial outcomes, output consistency testing across representative data samples, and integration testing to verify the model performs correctly within the full system architecture. Models that do not meet validation thresholds are retrained or replaced before go-live.",
  },
  {
    question: "What AI regulations does AiiACo align with?",
    answer: "AiiACo aligns AI deployments with applicable regulatory frameworks based on client geography and industry: the EU AI Act (risk classification and conformity requirements for systems deployed in European markets), the NIST AI Risk Management Framework (for US federal and regulated industries), GDPR and CCPA (for data processing pipelines handling personal data), SR 11-7 (model risk management for US financial institutions), MiFID II (for algorithmic trading and financial advice systems), HIPAA (for AI systems processing protected health information), and NERC CIP (for AI in energy infrastructure). Governance documentation is maintained and updated as regulations evolve.",
  },
  {
    question: "What happens if an AI system deployed by AiiACo produces incorrect outputs?",
    answer: "AiiACo documents failure modes and fallback procedures for every deployed AI system before go-live. If a model produces a low-confidence output, the system escalates to human review rather than executing autonomously. If an API integration fails, fallback procedures route the process through an alternative path or queue it for manual processing. Monitoring systems alert AiiACo's operations team to anomalous output patterns, accuracy degradation, and latency spikes. When a production issue is identified, AiiACo's SLA defines response time, root cause analysis, and remediation timeline.",
  },
  {
    question: "How does AiiACo ensure AI systems remain compliant as regulations change?",
    answer: "AiiACo maintains a regulatory monitoring function that tracks changes to AI-relevant regulations across major jurisdictions (EU, US, UK, Canada, Australia). When regulatory changes affect deployed systems, AiiACo initiates a governance review with the client, assesses the impact on deployed AI systems, and implements required changes to data handling, model documentation, or oversight protocols. For clients in highly regulated industries, quarterly governance reviews are included in the managed optimization engagement.",
  },
];

export default function AIGovernancePage() {
  return (
    <>
      <SEO
        title="AI Governance Framework | Enterprise AI Risk & Compliance | AiiACo"
        description="AiiACo's enterprise AI governance framework: data security protocols, model validation standards, human-in-the-loop controls, audit trails, and regulatory alignment with EU AI Act, NIST AI RMF, GDPR, and sector-specific requirements."
        path="/ai-governance"
        keywords="AI governance framework, enterprise AI risk management, AI compliance, AI model validation, AI data security, EU AI Act compliance, NIST AI RMF, AI audit trail, AI risk controls, AI regulatory compliance, responsible AI deployment"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1" style={{ paddingTop: "80px" }}>

          {/* Hero */}
          <section style={{ padding: "clamp(80px, 10vw, 130px) 0 clamp(60px, 8vw, 100px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 600px at 20% 50%, rgba(184,156,74,0.05) 0%, transparent 60%)" }} />
            <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "860px" }}>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                <motion.div variants={fade}>
                  <div className="section-pill" style={{ marginBottom: "20px", width: "fit-content" }}>
                    <span className="dot" />
                    AI Governance & Compliance
                  </div>
                </motion.div>
                <motion.h1 variants={fade} className="section-headline shimmer-headline" style={{ marginBottom: "20px", fontSize: "clamp(36px, 5vw, 60px)" }}>
                  Enterprise AI Governance.<br />
                  <span className="accent">Risk Controls That Hold.</span>
                </motion.h1>
                <motion.div variants={fade} className="gold-divider" style={{ marginBottom: "24px" }} />
                <motion.p variants={fade} className="section-subhead" style={{ maxWidth: "68ch", marginBottom: "20px" }}>
                  Enterprise AI deployments create legal, operational, and regulatory exposure without proper governance. AiiACo builds governance controls into every engagement - not as an afterthought, but as the foundation that makes AI infrastructure trustworthy enough to run critical operations.
                </motion.p>
                <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14.5px", lineHeight: 1.65, color: "rgba(200,215,230,0.55)", maxWidth: "62ch" }}>
                  Governance is not a compliance checkbox. It is the operational discipline that determines whether AI systems remain accurate, auditable, and aligned with your business objectives over time.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Governance Pillars */}
          <section style={{ padding: "clamp(60px, 8vw, 100px) 0", background: "#060B14" }}>
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ maxWidth: "640px", marginBottom: "56px" }}
              >
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                  Governance Framework
                </p>
                <h2 className="section-headline" style={{ marginBottom: "16px" }}>
                  Six Pillars of <span className="accent">AI Governance</span>
                </h2>
                <p className="section-subhead">
                  AiiACo's governance framework is applied to every enterprise AI deployment - from initial architecture through ongoing managed optimization.
                </p>
              </motion.div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {governancePillars.map((pillar, i) => (
                  <motion.div
                    key={pillar.num}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.55 }}
                    className="glass-card"
                    style={{ padding: "28px 32px" }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "20px", alignItems: "flex-start" }}>
                      <div className="phase-badge" style={{ width: "48px", height: "48px", fontSize: "13px", borderRadius: "14px", flexShrink: 0 }}>
                        {pillar.num}
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 12px", lineHeight: 1.15, letterSpacing: "-0.3px" }}>
                          {pillar.title}
                        </h3>
                        <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", lineHeight: 1.65, color: "rgba(200,215,230,0.70)", margin: "0 0 18px", maxWidth: "72ch" }}>
                          {pillar.body}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                          {pillar.tags.map((tag) => (
                            <span
                              key={tag}
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
                              {tag}
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

          {/* Regulatory Alignment Table */}
          <section style={{ padding: "clamp(60px, 8vw, 100px) 0", background: "#03050A" }}>
            <div className="container" style={{ maxWidth: "900px" }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: "40px" }}
              >
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                  Regulatory Alignment
                </p>
                <h2 className="section-headline" style={{ marginBottom: "16px" }}>
                  Frameworks AiiACo <span className="accent">Aligns With</span>
                </h2>
                <p className="section-subhead">
                  AI deployments in regulated industries require documented alignment with applicable frameworks. AiiACo tracks and applies these standards across all enterprise engagements.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card"
                style={{ overflow: "hidden" }}
              >
                {[
                  { framework: "EU AI Act", scope: "All AI systems deployed in European markets", classification: "Risk-based classification (unacceptable, high, limited, minimal)", relevance: "Mandatory for EU operations" },
                  { framework: "NIST AI RMF", scope: "US federal and regulated industries", classification: "Govern, Map, Measure, Manage", relevance: "Best practice for US enterprise" },
                  { framework: "GDPR / CCPA", scope: "Data processing pipelines handling personal data", classification: "Data minimization, consent, right to explanation", relevance: "Required for EU/California data" },
                  { framework: "SR 11-7", scope: "US bank and financial institution AI/ML models", classification: "Model risk management, validation, governance", relevance: "Required for US financial services" },
                  { framework: "MiFID II", scope: "Algorithmic trading and financial advice systems", classification: "Algorithm testing, circuit breakers, audit trails", relevance: "Required for EU financial markets" },
                  { framework: "HIPAA", scope: "AI systems processing protected health information", classification: "Data security, access controls, audit logs", relevance: "Required for US healthcare" },
                ].map((row, i) => (
                  <div
                    key={row.framework}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "160px 1fr 1fr",
                      gap: "20px",
                      padding: "20px 28px",
                      borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "15px", fontWeight: 700, color: "rgba(184,156,74,0.90)", margin: 0 }}>
                        {row.framework}
                      </p>
                      <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 600, color: "rgba(200,215,230,0.40)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {row.relevance}
                      </p>
                    </div>
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", lineHeight: 1.55, color: "rgba(200,215,230,0.65)", margin: 0 }}>
                      {row.scope}
                    </p>
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", lineHeight: 1.55, color: "rgba(200,215,230,0.50)", margin: 0 }}>
                      {row.classification}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ */}
          <FAQSection
            eyebrow="Governance Questions"
            headline="AI Governance - Answered Directly"
            subheadline="What enterprise buyers and compliance teams ask before deploying AI in regulated environments."
            items={governanceFaqs}
          />

          {/* CTA */}
          <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(184,156,74,0.03)" }}>
            <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
                <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "20px" }}>
                  Deploy AI With <span className="accent">Governance Built In</span>
                </motion.h2>
                <motion.p variants={fade} className="section-subhead" style={{ marginBottom: "36px" }}>
                  Every AiiACo engagement includes governance framework design, model validation, and regulatory alignment documentation - not as an add-on, but as a core component of the integration architecture.
                </motion.p>
                <motion.div variants={fade} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Begin Governance Assessment</a>
                  <a href="/method" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                    View the AiiACo Method →
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Cross-links */}
          <section style={{ padding: "60px 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
            <div className="container" style={{ maxWidth: "900px" }}>
              <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "24px" }}>Related Services</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <a href="/ai-integration" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textDecoration: "none" }}>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 6px" }}>AI Integration Services</p>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, lineHeight: 1.5 }}>End-to-end AI integration with governance built into every phase of the engagement.</p>
                </a>
                <a href="/method" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textDecoration: "none" }}>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 6px" }}>The AiiACo Method</p>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, lineHeight: 1.5 }}>Five-phase execution protocol - governance and compliance are embedded in Phase 02 Strategic Architecture.</p>
                </a>
              </div>
            </div>
          </section>

          <RelatedServices current="/ai-governance" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
