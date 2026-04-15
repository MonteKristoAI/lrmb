/**
 * AiiACo - /ai-implementation-services SEO Pillar Page
 * Design: Liquid Glass Bio-Organic | SF Pro Display + SF Pro Text | Deep void-black + gold
 * Purpose: Rank for "AI implementation services" head term
 */

import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import RelatedServices from "@/components/RelatedServices";
import { motion } from "framer-motion";

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const services = [
  {
    title: "AI Readiness Assessment",
    body: "Before implementation begins, AiiACo conducts a structured readiness assessment: data infrastructure, workflow documentation, team capability, and competitive AI exposure. This determines the correct implementation sequence and scope.",
  },
  {
    title: "Custom AI System Design",
    body: "Every AI implementation is designed from first principles - not templated. We identify which AI capabilities (LLMs, agents, predictive models, computer vision, voice AI) apply to which operational contexts, and design the system architecture accordingly.",
  },
  {
    title: "End-to-End Deployment",
    body: "AiiACo handles the full deployment stack: API integrations, model configuration, workflow automation, data pipeline setup, and quality assurance. Implementation is delivered as a functional system, not a technical specification.",
  },
  {
    title: "Staff Enablement",
    body: "AI implementation succeeds when the humans around it understand its boundaries. AiiACo provides structured enablement for your team - not training courses, but operational protocols that define how AI and human judgment interact.",
  },
  {
    title: "Performance Monitoring",
    body: "Post-deployment, AiiACo monitors every implemented system against the KPIs defined in the integration blueprint. Underperforming components are retrained or redesigned. The implementation is never considered complete - it is continuously optimized.",
  },
  {
    title: "Performance-Based Option",
    body: "For qualifying engagements, AiiACo offers a performance-based implementation model: reduced upfront cost, with fees tied to measurable outcomes. You pay for results, not for effort.",
  },
];

const implFaqs = [
  {
    question: "What does AI implementation actually involve for a business?",
    answer: "AI implementation is the process of taking an AI integration design and making it operational inside your business. It includes: configuring AI models for your specific data and use cases, building API integrations with your existing ERP, CRM, and operational platforms, setting up data pipelines and automation triggers, testing outputs against accuracy and performance thresholds, and deploying systems into production. AiiACo handles every step - you receive a running system, not a technical specification.",
  },
  {
    question: "What AI systems can be implemented into a business?",
    answer: "AiiACo implements a range of AI system types depending on your operational needs: LLM-based document processing (contracts, invoices, reports), AI communication agents (email drafting, customer response, internal routing), predictive models (demand forecasting, churn scoring, risk assessment), workflow automation agents (multi-step process orchestration), computer vision systems (quality control, document extraction), and voice AI (call transcription, IVR automation). The right combination is determined during the readiness assessment.",
  },
  {
    question: "How does AI implementation work with existing business software?",
    answer: "AI systems connect to your existing software through API integrations, webhook triggers, and data pipeline connectors. For ERP systems (SAP, Oracle, NetSuite, Microsoft Dynamics), AI can automate invoice processing, exception handling, and financial reporting. For CRM platforms (Salesforce, HubSpot), AI can automate lead scoring, pipeline updates, and communication drafting. For document management systems, AI can extract, classify, and route documents automatically. AiiACo designs the integration architecture to fit your existing technology stack.",
  },
  {
    question: "What is staff enablement in the context of AI implementation?",
    answer: "Staff enablement is the process of defining how your team interacts with AI systems after deployment. This is not a training course - it is operational protocol design. AiiACo defines the boundaries of AI decision-making (what AI decides autonomously vs. what requires human review), escalation paths for edge cases, quality control checkpoints, and feedback mechanisms for continuous improvement. Proper enablement is what separates AI implementations that compound in value from those that create new operational complexity.",
  },
  {
    question: "How long does AI implementation take from start to go-live?",
    answer: "Implementation timelines depend on scope. A single workflow automation (e.g., automating AP invoice processing) typically goes live in 4-6 weeks. A multi-system integration across several operational functions typically takes 8-16 weeks for initial deployment. AiiACo manages the entire implementation timeline - you do not need to allocate internal engineering resources or manage vendor relationships. The timeline begins after the Strategic Architecture blueprint is approved.",
  },
];

const differentiators = [
  { label: "Outcome-Oriented", desc: "Every implementation is scoped against measurable KPIs. If the system does not perform, we fix it." },
  { label: "Fully Managed", desc: "You do not manage vendors, prompts, or integrations. AiiACo manages the entire implementation stack." },
  { label: "Cross-Industry", desc: "Implementation frameworks deployed across real estate, mortgage lending, commercial property management, and management consulting." },
  { label: "Performance-Based Option", desc: "Qualifying clients can access implementation services with reduced upfront cost and success-linked fees." },
];

export default function AIImplementationPage() {
  return (
    <>
      <SEO
        title="AI Implementation Services | AiiACo - Managed AI Deployment"
        description="AiiACo provides end-to-end AI implementation services for enterprise and mid-market businesses. Custom AI system design, full deployment, staff enablement, and performance monitoring - all managed by AiiACo."
        keywords="AI implementation services, AI implementation, AI deployment services, managed AI implementation, enterprise AI implementation, AI system deployment, AI consulting implementation"
        path="/ai-implementation-services"
      />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI Implementation Services</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI Implementation<br />
                <span className="gold-line">That Delivers Results.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                AiiACo's AI implementation services cover the full lifecycle - from readiness assessment and system design to deployment, enablement, and continuous performance monitoring. We do not deliver recommendations. We deliver functioning AI systems.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Start Implementation</a>
                <a href="/case-studies" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Case Studies →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
          <div className="container">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>Implementation Services</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                What AiiACo <span className="accent">Implements for You</span>
              </motion.h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "20px" }}>
                {services.map((s) => (
                  <motion.div key={s.title} variants={fade} className="glass-card" style={{ padding: "28px 24px" }}>
                    <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "21px", fontWeight: 700, color: "rgba(255,255,255,0.94)", margin: "0 0 12px", letterSpacing: "-0.3px" }}>{s.title}</h3>
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", lineHeight: 1.65, color: "rgba(200,215,230,0.68)", margin: 0 }}>{s.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Differentiators */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>Why AiiACo</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "40px" }}>
                Implementation That <span className="accent">Operates Differently</span>
              </motion.h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {differentiators.map((d) => (
                  <motion.div key={d.label} variants={fade} style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843", flexShrink: 0, marginTop: "8px" }} />
                    <div>
                      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: "6px" }}>{d.label}</div>
                      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", lineHeight: 1.6, color: "rgba(200,215,230,0.68)" }}>{d.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(184,156,74,0.03)" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "20px" }}>
                Begin Your <span className="accent">AI Implementation</span>
              </motion.h2>
              <motion.p variants={fade} className="section-subhead" style={{ marginBottom: "36px" }}>
                Every AiiACo engagement begins with a Business Intelligence Audit - a structured assessment of your operations, data, and AI readiness. No generic proposals. No wasted time.
              </motion.p>
              <motion.div variants={fade} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Request Implementation Audit</a>
                <a href="/models" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Engagement Models →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          eyebrow="Common Questions"
          headline="AI Implementation - Answered Directly"
          subheadline="What enterprise buyers need to know before starting an AI implementation engagement."
          items={implFaqs}
        />

        {/* Cross-links to related pillar pages */}
        <section style={{ padding: "60px 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "24px" }}>Related Services</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <a href="/ai-integration" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textDecoration: "none" }}>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 6px" }}>AI Integration Services</p>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, lineHeight: 1.5 }}>End-to-end AI integration across your full operational architecture - diagnostic, blueprint, and managed deployment.</p>
              </a>
              <a href="/ai-automation-for-business" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textDecoration: "none" }}>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 6px" }}>AI Automation for Business</p>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, lineHeight: 1.5 }}>End-to-end automation of repeatable business processes using AI agents and workflow orchestration.</p>
              </a>
            </div>
          </div>
        </section>

        <RelatedServices current="/ai-implementation-services" max={4} />

      </main>
      <Footer />
    </>
  );
}
