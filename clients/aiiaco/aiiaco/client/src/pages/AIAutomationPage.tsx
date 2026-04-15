/**
 * AiiACo - /ai-automation-for-business SEO Pillar Page
 * Design: Liquid Glass Bio-Organic | SF Pro Display + SF Pro Text | Deep void-black + gold
 * Purpose: Rank for "AI automation for business" head term
 */

import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import RelatedServices from "@/components/RelatedServices";
import { motion } from "framer-motion";

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const automationFaqs = [
  {
    question: "What business processes can be automated with AI?",
    answer: "AI automation applies to any process that is repetitive, rule-based, or data-intensive. High-value targets include: accounts payable and invoice processing (AI extracts, validates, and routes invoices automatically), customer communication (AI drafts responses, routes inquiries, and escalates exceptions), lead qualification and CRM updates (AI scores leads and updates pipeline records from email and call data), document processing (AI extracts data from contracts, forms, and reports), financial reporting (AI aggregates data and generates formatted reports), and supply chain management (AI forecasts demand and triggers procurement workflows).",
  },
  {
    question: "What is the difference between AI automation and traditional RPA?",
    answer: "Traditional RPA (Robotic Process Automation) automates rule-based, structured processes by mimicking mouse clicks and keystrokes. It breaks when interfaces change and cannot handle unstructured data. AI automation uses large language models, computer vision, and intelligent agents to handle unstructured inputs (emails, PDFs, voice, images), make judgment-based decisions, adapt to variations, and orchestrate multi-step workflows across systems. AI automation handles the 60-70% of business processes that RPA cannot touch.",
  },
  {
    question: "How does AI automation reduce operational costs?",
    answer: "AI automation reduces operational costs through three mechanisms: (1) Labor substitution - AI agents execute tasks that previously required human time, reducing headcount requirements for repetitive functions; (2) Error elimination - AI processes data with consistent accuracy, eliminating the cost of human errors and rework; (3) Speed increase - AI processes documents, routes decisions, and generates outputs in seconds rather than hours, reducing cycle times and freeing human capacity for higher-value work. ROI is typically measured in reduced FTE requirements, processing time reduction, and error rate improvement.",
  },
  {
    question: "Does AI automation require replacing existing business software?",
    answer: "No. AI automation is designed to integrate with your existing software stack, not replace it. AiiACo builds automation layers that connect to your ERP, CRM, document management, and communication platforms via APIs and webhooks. Your existing systems remain in place; AI automation adds an intelligent processing layer that handles data extraction, decision routing, and workflow orchestration on top of them.",
  },
  {
    question: "What is AI agent orchestration?",
    answer: "AI agent orchestration is the coordination of multiple AI agents working together to complete a complex, multi-step business process. For example: an AI agent extracts data from an incoming invoice, a second agent validates it against purchase orders in your ERP, a third agent routes it to the correct approver based on amount and department, and a fourth agent records the approval and triggers payment. AiiACo designs and deploys these multi-agent workflows as production-grade operational systems.",
  },
];

const automationTypes = [
  {
    title: "Workflow Automation",
    body: "Repetitive, rule-based processes - approvals, data entry, reporting, scheduling - are automated using AI agents that execute with greater speed, accuracy, and consistency than human operators.",
  },
  {
    title: "Decision Automation",
    body: "AI models trained on your historical data and business logic automate decisions that previously required human judgment: credit assessments, lead scoring, inventory reordering, pricing adjustments.",
  },
  {
    title: "Communication Automation",
    body: "AI-powered communication systems handle inbound inquiries, outbound outreach, follow-up sequences, and customer support - at scale, without degradation in quality or response time.",
  },
  {
    title: "Data Intelligence Automation",
    body: "AI continuously monitors your operational data, surfaces anomalies, generates reports, and delivers actionable intelligence - replacing manual analysis with always-on business intelligence.",
  },
  {
    title: "Document & Contract Automation",
    body: "AI extracts, classifies, and processes unstructured documents - contracts, invoices, applications, compliance filings - reducing processing time from days to minutes.",
  },
  {
    title: "Sales & Revenue Automation",
    body: "AI automates lead qualification, CRM updates, proposal generation, and pipeline management - compressing the sales cycle and increasing conversion rates without adding headcount.",
  },
];

const outcomes = [
  { metric: "60-80%", label: "Reduction in manual processing time across automated workflows" },
  { metric: "3-5x", label: "Throughput increase in departments with full workflow automation" },
  { metric: "70%+", label: "Reduction in decision latency for AI-automated decision processes" },
  { metric: "0→AI", label: "Internal overload transferred to AI systems - your team focuses on judgment, not execution" },
];

export default function AIAutomationPage() {
  return (
    <>
      <SEO
        title="AI Automation for Business | AiiACo - Operational Automation at Scale"
        description="AiiACo designs and deploys AI automation for business operations - workflow automation, decision automation, communication automation, and data intelligence. Managed end-to-end. Measured against KPIs."
        keywords="AI automation for business, business AI automation, AI workflow automation, AI process automation, enterprise AI automation, AI business automation, automated AI systems, AI operations"
        path="/ai-automation-for-business"
      />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI Automation for Business</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI Automation<br />
                <span className="gold-line">for Business Operations.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                AI automation for business is the systematic replacement of manual, repetitive, and decision-based tasks with AI systems that execute faster, more accurately, and at greater scale than human operators. AiiACo designs, deploys, and manages these systems as a complete operational layer - not as individual tools.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Automate Your Operations</a>
                <a href="/results" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Outcomes →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Automation Types */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
          <div className="container">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>Automation Capabilities</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                Six Domains of <span className="accent">Business AI Automation</span>
              </motion.h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "20px" }}>
                {automationTypes.map((a) => (
                  <motion.div key={a.title} variants={fade} className="glass-card" style={{ padding: "28px 24px" }}>
                    <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "21px", fontWeight: 700, color: "rgba(255,255,255,0.94)", margin: "0 0 12px", letterSpacing: "-0.3px" }}>{a.title}</h3>
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", lineHeight: 1.65, color: "rgba(200,215,230,0.68)", margin: 0 }}>{a.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Outcomes */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>Measured Outcomes</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "40px" }}>
                What AI Automation <span className="accent">Delivers in Practice</span>
              </motion.h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "20px" }}>
                {outcomes.map((o) => (
                  <motion.div key={o.label} variants={fade} className="glass-card" style={{ padding: "28px 24px", textAlign: "center" }}>
                    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#D4A843", letterSpacing: "-1px", marginBottom: "12px" }}>{o.metric}</div>
                    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", lineHeight: 1.55, color: "rgba(200,215,230,0.65)" }}>{o.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* The AiiACo Difference */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>The AiiACo Model</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "24px" }}>
                You Do Not Manage <span className="accent">AI Automation. We Do.</span>
              </motion.h2>
              <div className="gold-divider" />
              <motion.div variants={fade} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p className="section-subhead" style={{ margin: 0 }}>
                  Most AI automation projects fail not because the technology is wrong, but because the business lacks the internal capacity to configure, monitor, and iterate on AI systems. The automation is deployed once and left to degrade.
                </p>
                <p className="section-subhead" style={{ margin: 0 }}>
                  AiiACo operates differently. We manage every AI automation system we deploy - monitoring performance, retraining models, adjusting workflows, and expanding automation coverage as your business evolves. You receive the outcomes of AI automation without the operational burden of managing it.
                </p>
                <p className="section-subhead" style={{ margin: 0 }}>
                  For qualifying engagements, we offer a performance-based model: reduced upfront cost, with fees tied to the measurable outcomes your AI automation delivers. You pay for results, not for deployment.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          eyebrow="Common Questions"
          headline="AI Automation - Answered Directly"
          subheadline="What business leaders need to know before automating operations with AI."
          items={automationFaqs}
        />

        {/* CTA */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(184,156,74,0.03)" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "20px" }}>
                Ready to Automate <span className="accent">Your Business Operations?</span>
              </motion.h2>
              <motion.p variants={fade} className="section-subhead" style={{ marginBottom: "36px" }}>
                Every AiiACo engagement begins with a Business Intelligence Audit - a structured assessment of which operations are ready for AI automation and what outcomes are achievable within your specific context.
              </motion.p>
              <motion.div variants={fade} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Begin Automation Audit</a>
                <a href="/ai-integration" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  Learn About AI Integration →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Cross-links to related pillar pages */}
        <section style={{ padding: "60px 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "24px" }}>Related Services</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <a href="/ai-integration" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textDecoration: "none" }}>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 6px" }}>AI Integration Services</p>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, lineHeight: 1.5 }}>End-to-end AI integration across your full operational architecture - diagnostic, blueprint, and managed deployment.</p>
              </a>
              <a href="/ai-implementation-services" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textDecoration: "none" }}>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 6px" }}>AI Implementation Services</p>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, lineHeight: 1.5 }}>Structured deployment of AI systems across your operational stack - from scoping to go-live.</p>
              </a>
            </div>
          </div>
        </section>

        <RelatedServices current="/ai-automation-for-business" max={4} />

      </main>
      <Footer />
    </>
  );
}
