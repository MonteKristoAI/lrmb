/**
 * AiiACo - /ai-workflow-automation
 * Target keywords: "AI workflow automation", "how AI automates operations"
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { motion } from "framer-motion";


const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const categories = [
  {
    n: "01",
    title: "Revenue Operations",
    body: "Lead qualification, pipeline automation, conversion tracking, and revenue forecasting. Replaces manual CRM data entry, lead triage, and pipeline reporting with continuous AI coordination.",
  },
  {
    n: "02",
    title: "Client Operations",
    body: "Automated client communication, response consistency, retention signals, and lifecycle management. Replaces inbox triage and manual follow-up with AI-orchestrated engagement flows.",
  },
  {
    n: "03",
    title: "Document Intelligence",
    body: "Extraction, classification, validation, and compliance monitoring across document-heavy workflows like mortgage origination, insurance claims, and legal review.",
  },
  {
    n: "04",
    title: "Financial Operations",
    body: "Reporting automation, anomaly detection, compliance monitoring, and cash flow forecasting. Replaces month-end spreadsheet work and reactive reconciliation with continuous monitoring.",
  },
  {
    n: "05",
    title: "Workforce Optimization",
    body: "Recruitment automation, onboarding sequences, performance monitoring, and workforce analytics. Replaces fragmented HR workflows with AI-coordinated employee lifecycle management.",
  },
  {
    n: "06",
    title: "Operational Infrastructure",
    body: "Workflow orchestration, documentation automation, approval routing, and decision support. Ties every previous category together into a single operating layer that runs continuously.",
  },
];

const faqItems = [
  {
    question: "How does AI automate business operations?",
    answer:
      "AI automates business operations by replacing manual, repetitive, and decision-based tasks with systems that execute faster and more consistently than human workflows. It handles document processing, lead qualification, customer communication, pipeline tracking, and routine decision-making across revenue and operational functions. AiiACo designs the automation architecture, deploys it on top of existing platforms, and manages the stack on an ongoing basis.",
  },
  {
    question: "What operational tasks can AI automate immediately?",
    answer:
      "The fastest-to-deploy automations include lead qualification and routing, document extraction from PDFs and images, customer outreach sequences, CRM data entry, pipeline status updates, report generation, and inbox triage. These typically deploy within 2 to 4 weeks per workflow. Deeper automation across multiple departments takes 8 to 14 weeks.",
  },
  {
    question: "What is the difference between AI workflow automation and RPA?",
    answer:
      "RPA (Robotic Process Automation) automates deterministic, rule-based tasks: clicking buttons, copying data, filling forms. AI workflow automation handles the decision-based and language-based work RPA cannot: reading and classifying documents, drafting communication, qualifying leads by intent, predicting outcomes, and adapting to new patterns. AiiACo combines both where appropriate but treats them as complementary, not interchangeable.",
  },
  {
    question: "Does AiiACo build on top of tools like n8n, Make, or Zapier?",
    answer:
      "Yes, where appropriate. AiiACo uses n8n, Make, Zapier, Workato, and similar orchestration platforms as the execution substrate for workflow automation, with LLM layers on top for intelligence, and custom code where integration depth demands it. The client receives a managed integration layer, not a pile of tool subscriptions to maintain.",
  },
  {
    question: "How long does AI workflow automation take to deploy?",
    answer:
      "Single-workflow deployments ship in 2 to 4 weeks. A cross-functional deployment across 3 to 5 departments runs 8 to 14 weeks depending on integration complexity and compliance requirements. AiiACo handles every phase: architecture, deployment, team training, and ongoing optimization.",
  },
  {
    question: "How is AI workflow automation measured?",
    answer:
      "Every AiiACo deployment establishes KPIs at the outset: cycle time reduction, throughput increase, automation coverage percentage, cost reduction, or error rate reduction. Dashboards show real-time performance against baseline. Performance Partnership engagements tie AiiACo fees directly to these KPIs.",
  },
];

export default function AIWorkflowAutomationPage() {
  return (
    <>
      <SEO path="/ai-workflow-automation" />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI Workflow Automation</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI Workflow Automation.<br />
                <span className="gold-line">Operations Run Themselves.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                AI workflow automation replaces manual, repetitive, and decision-based tasks with AI systems that execute faster and more consistently than human workflows. AiiACo designs, deploys, and manages the full stack across revenue, client, document, financial, workforce, and infrastructure operations.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Automate Your Operations</a>
                <a href="/method" style={{ fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Our Method →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                6 Automation Categories
              </motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                What AiiACo Automates.
              </motion.h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(380px, 100%), 1fr))", gap: "16px" }}>
                {categories.map((c) => (
                  <motion.div key={c.n} variants={fade} style={{ padding: "24px 28px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px" }}>
                    <div style={{ fontFamily: FF, fontSize: "12px", fontWeight: 800, color: "rgba(184,156,74,0.70)", letterSpacing: "0.14em", marginBottom: "8px" }}>{c.n}</div>
                    <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "19px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{c.title}</h3>
                    <p style={{ fontFamily: FF, fontSize: "14px", lineHeight: 1.65, color: "rgba(200,215,230,0.65)", margin: 0 }}>{c.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <FAQSection
          items={faqItems}
          eyebrow="AI Workflow Automation FAQ"
          headline="How AI Automates Operations."
          subheadline="Everything about what AiiACo automates, how deployments ship, and how performance is measured."
        />

        <section style={{ padding: "clamp(80px, 10vw, 120px) 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "20px" }}>
              Stop managing the work. Run the outcomes.
            </h2>
            <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.65, color: "rgba(200,215,230,0.60)", marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px" }}>
              Every engagement begins with a Business Intelligence Audit. AiiACo maps the workflows consuming your team's time and scopes an automation path that produces measurable capacity.
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
