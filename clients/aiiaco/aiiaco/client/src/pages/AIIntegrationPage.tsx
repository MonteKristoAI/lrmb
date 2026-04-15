/**
 * AiiACo - /ai-integration SEO Pillar Page
 * Design: Liquid Glass Bio-Organic | SF Pro Display + SF Pro Text | Deep void-black + gold
 * Purpose: Rank for "AI integration" head term - long-form authoritative content
 */

import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import RelatedServices from "@/components/RelatedServices";
import { motion } from "framer-motion";

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const pillars = [
  {
    n: "01",
    title: "Diagnostic Architecture",
    body: "AI integration begins with a complete audit of your operational architecture - workflows, data flows, decision bottlenecks, and competitive exposure. Without this foundation, AI deployment is guesswork dressed as strategy.",
  },
  {
    n: "02",
    title: "Integration Blueprint",
    body: "A custom AI integration blueprint maps each identified leverage point to a specific AI capability - LLMs, automation agents, predictive models, or workflow orchestration - with measurable ROI targets attached to each.",
  },
  {
    n: "03",
    title: "Managed Deployment",
    body: "AiiACo deploys, configures, and manages every AI system in the blueprint. You do not manage vendors, prompts, or integrations. You receive outcomes: reduced drag, increased throughput, compounding efficiency.",
  },
  {
    n: "04",
    title: "Continuous Optimization",
    body: "AI integration is not a one-time project. AiiACo monitors performance against KPIs, retrains models as your business evolves, and expands the integration footprint as new leverage points emerge.",
  },
];

const aiFaqs = [
  {
    question: "What is AI integration and how is it different from buying AI tools?",
    answer: "AI integration means embedding artificial intelligence into your operational infrastructure as a functional system - not subscribing to standalone tools. Most businesses buy AI tools (ChatGPT, a chatbot, one automation) and call it AI adoption. That is AI decoration. True integration means your business has an AI operational layer that handles repeatable decisions, automates complex multi-step workflows, surfaces intelligence from your data, and scales execution without scaling headcount. AiiACo builds this infrastructure end-to-end.",
  },
  {
    question: "How long does AI integration take for a mid-size or enterprise business?",
    answer: "A Strategic Intelligence Blueprint (full operational diagnostic and architecture) takes 2-4 weeks. Initial deployment of a defined AI workflow - such as automating AP invoice processing using LLM-based document extraction, or deploying a predictive demand forecasting model - takes 4-8 weeks. Full managed AI integration across multiple operational functions spans 3-6 months for initial deployment, followed by continuous optimization. AiiACo manages every phase, eliminating the internal resource burden that typically extends enterprise AI timelines.",
  },
  {
    question: "What does AiiACo actually do - are you consultants or do you build and run the systems?",
    answer: "AiiACo is an AI Integration Authority, not a consulting firm. We do not deliver strategy decks and leave implementation to your team. We design the AI architecture, select and configure every AI system, deploy integrations with your existing ERP, CRM, and operational platforms, and manage the full stack on an ongoing basis. You receive operational outcomes - reduced processing time, increased throughput, automated decision workflows - not advisory documents.",
  },
  {
    question: "How does AI integration work with existing ERP and CRM systems?",
    answer: "AI integration connects to your existing systems through API integrations, data pipeline connectors, and workflow triggers. For ERP systems (SAP, Oracle, NetSuite), AI can automate document processing, exception handling, and reporting workflows. For CRM platforms (Salesforce, HubSpot), AI can automate lead scoring, communication drafting, and pipeline management. AiiACo designs the integration architecture to work within your existing technology stack - we do not require you to replace your core systems.",
  },
  {
    question: "What is performance-based AI integration?",
    answer: "Performance-based AI integration is an engagement model where AiiACo's fees are partially tied to measurable operational outcomes - such as reduction in manual processing time, increase in throughput, or cost savings from automation. This model reduces upfront investment and aligns AiiACo's incentives directly with your business results. It is available to qualified engagements where clear, measurable KPIs can be established at the outset of the engagement.",
  },
  {
    question: "How does AiiACo handle AI governance, data security, and compliance?",
    answer: "AiiACo implements AI governance protocols at every layer of the integration stack: data access controls and role-based permissions for all AI systems, model validation and output auditing before production deployment, documented AI decision trails for regulatory compliance, vendor security assessment for all third-party AI providers, and ongoing monitoring for model drift and performance degradation. Enterprise clients receive a governance framework document as part of every full integration engagement.",
  },
];

const industries = [
  "Financial Services", "Real Estate", "Insurance", "Energy & Resources",
  "Software & Technology", "Healthcare & Wellness", "Automotive", "Food & Beverage",
  "Luxury & Lifestyle", "Agency Operations", "Investment & Capital", "Retail & Commerce",
];

export default function AIIntegrationPage() {
  return (
    <>
      <SEO
        title="AI Integration Services | AiiACo - Operational AI for Enterprise"
        description="AiiACo delivers end-to-end AI integration for enterprise and mid-market businesses. From diagnostic architecture to managed deployment - we build, integrate, and run your complete AI operational infrastructure."
        keywords="AI integration, AI integration services, enterprise AI integration, business AI integration, AI integration company, operational AI, AI deployment, AI implementation"
        path="/ai-integration"
      />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI Integration Authority</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI Integration<br />
                <span className="gold-line">for the Corporate Age.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                AI integration is the process of embedding artificial intelligence into the operational infrastructure of a business - not as a tool layer, but as a functional system that executes, decides, and delivers. AiiACo is the AI Integration Authority that designs, deploys, and manages this infrastructure on your behalf.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Initiate Integration</a>
                <a href="/method" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Our Method →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* What AI Integration Actually Means */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>What AI Integration Is</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "24px" }}>
                Not a Tool. <span className="accent">An Operating System.</span>
              </motion.h2>
              <div className="gold-divider" />
              <motion.div variants={fade} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p className="section-subhead" style={{ margin: 0 }}>
                  Most businesses approach AI as a tool procurement exercise - they subscribe to ChatGPT, add a chatbot, or automate one email sequence. This is not AI integration. It is AI decoration.
                </p>
                <p className="section-subhead" style={{ margin: 0 }}>
                  True AI integration means your business has an AI operational layer that handles repeatable decisions, automates complex workflows, surfaces intelligence from your data, and scales execution without scaling headcount. It is infrastructure - not a feature.
                </p>
                <p className="section-subhead" style={{ margin: 0 }}>
                  AiiACo builds this infrastructure. We audit your operations, design the integration architecture, deploy every AI system, and manage the entire stack. You do not hire AI tools. You hire AiiACo. AiiACo hires and manages everything else.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Four Pillars */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>The Integration Framework</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                Four Phases of <span className="accent">Operational AI Integration</span>
              </motion.h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "20px" }}>
                {pillars.map((p) => (
                  <motion.div key={p.n} variants={fade} className="glass-card" style={{ padding: "32px 28px" }}>
                    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(184,156,74,0.55)", marginBottom: "12px" }}>PHASE {p.n}</div>
                    <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "22px", fontWeight: 700, color: "rgba(255,255,255,0.94)", margin: "0 0 14px", letterSpacing: "-0.3px" }}>{p.title}</h3>
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", lineHeight: 1.65, color: "rgba(200,215,230,0.68)", margin: 0 }}>{p.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Industries */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>Cross-Industry Deployment</motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "16px" }}>
                AI Integration Across <span className="accent">Every Sector</span>
              </motion.h2>
              <motion.p variants={fade} className="section-subhead" style={{ marginBottom: "36px" }}>
                AiiACo has deployed AI integration frameworks across real estate, mortgage lending, commercial property management, and management consulting. The architecture is tailored per sector; the methodology - diagnostic, blueprint, deployment, optimization - remains consistent.
              </motion.p>
              <motion.div variants={fade} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {industries.map((ind) => (
                  <span key={ind} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(200,215,230,0.72)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px", padding: "7px 14px" }}>{ind}</span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(184,156,74,0.03)" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "20px" }}>
                Ready to Integrate <span className="accent">AI Into Your Operations?</span>
              </motion.h2>
              <motion.p variants={fade} className="section-subhead" style={{ marginBottom: "36px" }}>
                AiiACo operates three engagement models - from strategic advisory to full performance-based integration. Every engagement begins with a Business Intelligence Audit.
              </motion.p>
              <motion.div variants={fade} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Initiate Your Integration</a>
                <a href="/models" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Engagement Models →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section - targets enterprise AI integration search queries */}
        <FAQSection
          eyebrow="Common Questions"
          headline="AI Integration - Answered Directly"
          subheadline="The questions enterprise buyers ask before engaging an AI integration partner."
          items={aiFaqs}
        />

        {/* Related specialist services - full pillar-spoke cross-link grid */}
        <RelatedServices
          current="/ai-integration"
          max={5}
          headline="Explore Specialist Services"
          subhead="AiiACo delivers AI integration through focused specialist engagements. Each of the following is a deep-dive on a specific revenue or operational layer built on top of this pillar framework."
        />

      </main>
      <Footer />
    </>
  );
}
