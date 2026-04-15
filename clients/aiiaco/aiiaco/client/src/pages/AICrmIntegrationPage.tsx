/**
 * AiiACo - /ai-crm-integration
 * Target keywords: "AI CRM integration", "how to integrate AI into a CRM"
 * Design: Liquid Glass Bio-Organic | Deep void-black + gold
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { motion } from "framer-motion";


const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const steps = [
  {
    n: "01",
    title: "Map the CRM Workflow",
    body: "AiiACo audits every touchpoint in the existing CRM: lead capture, qualification, routing, follow-up, status updates, reporting, and handoff. The map identifies where manual work lives and where AI can remove it.",
  },
  {
    n: "02",
    title: "Design the Integration Layer",
    body: "AI capabilities are matched to the mapped friction points. Document extraction for inbound PDFs, conversational AI for qualification, generative content for outbound sequences, predictive scoring for pipeline intelligence. Every capability is scoped with a measurable outcome target.",
  },
  {
    n: "03",
    title: "Deploy Without Platform Migration",
    body: "The AI layer connects to the existing CRM via native APIs and webhook pipelines. No data export, no platform switch, no disruption. CRM admins keep their existing workflows. The AI automation runs on top.",
  },
  {
    n: "04",
    title: "Manage and Optimize",
    body: "AiiACo monitors every AI decision, retrains models as business data evolves, and expands the integration as new friction points emerge. CRM integration is operational infrastructure, not a one-time project.",
  },
];

const crms = [
  "Salesforce",
  "HubSpot",
  "Pipedrive",
  "GoHighLevel",
  "Follow Up Boss",
  "Zoho CRM",
  "Microsoft Dynamics 365",
  "Close",
  "Copper",
  "Keap",
  "ActiveCampaign",
  "Monday.com CRM",
];

const faqItems = [
  {
    question: "How do you integrate AI into a CRM?",
    answer:
      "AiiACo integrates AI into a CRM in four steps: map the current workflow, design an AI integration layer that matches specific friction points, deploy the layer via native APIs and webhooks, and manage it on an ongoing basis. The existing CRM is not replaced or migrated. Lead scoring, document extraction, conversational qualification, outbound sequence generation, and predictive pipeline intelligence all run as operational layers on top of Salesforce, HubSpot, Pipedrive, GoHighLevel, or whatever platform the client already uses.",
  },
  {
    question: "Which CRMs does AiiACo work with?",
    answer:
      "AiiACo integrates with Salesforce, HubSpot, Pipedrive, GoHighLevel, Follow Up Boss, Zoho CRM, Microsoft Dynamics 365, Close, Copper, Keap, ActiveCampaign, and industry-specific platforms like kvCORE (real estate), Encompass (mortgage), Kantata (consulting). For any platform with a documented API, AiiACo can build a custom integration layer.",
  },
  {
    question: "Do we have to migrate off our current CRM?",
    answer:
      "No. AiiACo integrates with the CRM you already use. The AI layer sits above the CRM via APIs and webhooks. Your admins keep their existing workflows, reports, and dashboards. The AI automation runs alongside them, replacing manual coordination work without disrupting day-to-day operations.",
  },
  {
    question: "What does AI actually do inside a CRM?",
    answer:
      "AI handles the repeatable work that consumes CRM admin time: scoring inbound leads by intent and fit, generating personalized outbound sequences, extracting data from PDFs and emails into structured CRM fields, predicting deal outcomes and next best actions, drafting status updates, and surfacing at-risk deals before they slip. Sales reps and CRM admins keep the judgment and relationship work.",
  },
  {
    question: "How long does an AI CRM integration take?",
    answer:
      "A focused first module (lead scoring, document extraction, or outbound automation) ships in 3 to 5 weeks. Full integration across lead gen, nurture, pipeline intelligence, and reporting runs 6 to 12 weeks depending on CRM complexity, data volume, and the number of workflows. AiiACo handles every integration step.",
  },
  {
    question: "Is AI CRM integration compliant with data privacy rules?",
    answer:
      "Yes. AiiACo implements data access controls, audit trails for every AI decision, role-based permissions, and vendor security assessments for every third-party AI provider. GDPR, CCPA, and industry-specific compliance (RESPA, HIPAA, PCI DSS) are built into every integration. Compliance officers retain sign-off on regulated workflows.",
  },
];

export default function AICrmIntegrationPage() {
  return (
    <>
      <SEO path="/ai-crm-integration" />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI CRM Integration</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI CRM Integration.<br />
                <span className="gold-line">Your CRM. Smarter Operations.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                AI CRM integration embeds artificial intelligence directly into your existing customer relationship management platform, without replacing it. AiiACo builds the integration layer that scores inbound leads, generates outbound sequences, extracts document data, and surfaces pipeline intelligence on top of Salesforce, HubSpot, Pipedrive, GoHighLevel, and every major CRM in market.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Integrate Your CRM</a>
                <a href="/method" style={{ fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Our Method →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 4-Step Process */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                How It Works
              </motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                How to Integrate AI Into a CRM.
              </motion.h2>

              <div style={{ display: "grid", gap: "24px" }}>
                {steps.map((s) => (
                  <motion.div
                    key={s.n}
                    variants={fade}
                    style={{
                      padding: "28px 32px",
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "14px",
                      display: "grid",
                      gridTemplateColumns: "60px 1fr",
                      gap: "24px",
                      alignItems: "start",
                    }}
                  >
                    <div style={{ fontFamily: FF, fontSize: "18px", fontWeight: 800, color: "rgba(184,156,74,0.80)", letterSpacing: "0.08em" }}>{s.n}</div>
                    <div>
                      <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                      <p style={{ fontFamily: FF, fontSize: "15px", lineHeight: 1.7, color: "rgba(200,215,230,0.70)", margin: 0 }}>{s.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Supported CRMs */}
        <section style={{ padding: "80px 0", background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: "32px" }}>
              <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                Supported CRMs
              </p>
              <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
                Keep Your CRM. Add the AI Layer.
              </h2>
            </motion.div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "12px" }}>
              {crms.map((crm) => (
                <div key={crm} style={{ padding: "16px 20px", background: "rgba(184,156,74,0.04)", border: "1px solid rgba(184,156,74,0.12)", borderRadius: "10px", fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.88)" }}>
                  {crm}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          items={faqItems}
          eyebrow="AI CRM Integration FAQ"
          headline="Integration Questions, Answered."
          subheadline="Everything about how AiiACo builds AI integration layers on top of existing CRM platforms without migration or disruption."
        />

        {/* CTA */}
        <section style={{ padding: "clamp(80px, 10vw, 120px) 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "20px" }}>
              Keep the CRM. Add the intelligence.
            </h2>
            <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.65, color: "rgba(200,215,230,0.60)", marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px" }}>
              AiiACo starts every engagement with a Business Intelligence Audit. We map the friction in your current CRM workflows and scope a path to an AI-integrated operating layer that generates compounding revenue leverage.
            </p>
            <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>
              Start the Audit
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
