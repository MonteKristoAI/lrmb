/**
 * AiiACo - /ai-revenue-engine
 * Purpose: Own the category term "AI revenue system" (zero-competition whitespace)
 * Target keyword: "AI revenue systems", "what is an AI revenue system"
 * Design: Liquid Glass Bio-Organic | Deep void-black + gold
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { motion } from "framer-motion";


const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const components = [
  {
    n: "01",
    title: "Lead Generation Layer",
    body: "AI scouts, qualifies, and routes inbound leads in real time. It scores intent signals, budget indicators, and fit criteria before a human ever touches a record. The layer integrates directly with existing CRMs rather than replacing them.",
  },
  {
    n: "02",
    title: "Multi-Touch Nurture Engine",
    body: "Personalized outreach sequences fire automatically across email, SMS, voice, and LinkedIn based on deal stage and engagement signals. Content adapts to the prospect's behavior. Sales reps receive ready-to-close handoffs, not cold leads.",
  },
  {
    n: "03",
    title: "Pipeline Intelligence",
    body: "Real-time deal velocity, conversion probability, and revenue forecast across every rep and team. The AI surfaces at-risk deals, recommends the next best action per opportunity, and replaces gut-feel pipeline reviews with data.",
  },
  {
    n: "04",
    title: "Dormant Database Reactivation",
    body: "AiiACo reactivates the 50 to 80 percent of contacts sitting inert in most CRMs. The AI segments by fit and recency, generates personalized re-engagement sequences, and routes responders back into active pipeline - often producing 15 to 25 percent response rates on what the client considered dead leads.",
  },
  {
    n: "05",
    title: "Closed-Loop Revenue Attribution",
    body: "Every touch, every channel, every outcome flows back into a unified attribution model. The system learns what actually drives revenue and allocates spend and effort accordingly. Finance, marketing, and sales see the same numbers.",
  },
];

const faqItems = [
  {
    question: "What is an AI revenue system?",
    answer:
      "An AI revenue system is a connected set of AI-powered workflows that generate, qualify, nurture, convert, and reactivate pipeline without proportional human effort. It sits across the five revenue functions (lead generation, nurture, pipeline intelligence, dormant database reactivation, and closed-loop attribution) and replaces the manual coordination work that consumes sales and marketing time. Unlike buying an AI sales tool, an AI revenue system is an operational layer built on top of your existing CRM that handles repeatable revenue work as infrastructure.",
  },
  {
    question: "How is this different from buying a sales AI tool like Outreach, Salesloft, or Clay?",
    answer:
      "Point tools automate one step of the revenue process. An AI revenue system connects every step: inbound lead scoring, multi-touch sequences, deal intelligence, database reactivation, and attribution - all running as one coordinated layer. AiiACo builds this on top of the tools you already own. You keep Salesforce, HubSpot, Pipedrive, GoHighLevel, Outreach, Clay, or whatever else is in your stack, and AiiACo adds the AI operational layer that ties them together.",
  },
  {
    question: "How much revenue can an AI revenue system generate from a dormant customer database?",
    answer:
      "Most CRMs carry 50 to 80 percent of contacts that have gone cold. A well-architected reactivation layer typically converts 15 to 25 percent of those into re-engaged responders, and a single-digit percentage back into active pipeline. For a brokerage, consultancy, or SaaS company with 10,000 dormant contacts, that translates to 100 to 500 new active opportunities without adding headcount or ad spend.",
  },
  {
    question: "How long does AiiACo take to deploy an AI revenue system?",
    answer:
      "The first operational module (usually either inbound lead scoring or dormant database reactivation) ships in 3 to 5 weeks. A full five-component AI revenue system running across lead gen, nurture, pipeline intelligence, reactivation, and attribution takes 8 to 14 weeks depending on CRM complexity, data quality, and the number of channels in use. AiiACo handles integration, content tuning, and ongoing optimization.",
  },
  {
    question: "Does AiiACo replace the sales team?",
    answer:
      "No. AiiACo replaces the coordination and administrative work that consumes sales rep time (lead triage, follow-up scheduling, CRM data entry, pipeline reports, cold outreach drafting). Reps keep the judgment work: discovery calls, negotiation, stakeholder management, closing. Companies that deploy an AI revenue system typically see reps handle 2 to 3 times more active deals without burning out.",
  },
  {
    question: "Which CRMs does AiiACo integrate with?",
    answer:
      "AiiACo integrates with Salesforce, HubSpot, Pipedrive, GoHighLevel, Follow Up Boss, Zoho CRM, Microsoft Dynamics 365, Close, Copper, and Keap via native APIs. For industry-specific platforms (kvCORE for real estate, Encompass for mortgage, Kantata for consulting), AiiACo builds custom integration layers. No CRM migration is required in most engagements.",
  },
  {
    question: "Can an AI revenue system be deployed performance-based?",
    answer:
      "Yes. AiiACo offers a Performance Partnership engagement model for qualifying clients where fees are tied to measurable revenue outcomes: pipeline generated, dormant database response rate, or conversion lift. This model reduces upfront investment and aligns incentives. It is available where clear KPIs can be established at engagement kickoff.",
  },
  {
    question: "What makes AiiACo qualified to build this vs an internal team?",
    answer:
      "AiiACo builds AI revenue systems as its core service, across real estate, mortgage lending, commercial property, management consulting, and financial services engagements. Internal teams typically take 9 to 18 months to ship what AiiACo ships in 8 to 14 weeks because internal teams have competing priorities, learning curves on each integration, and limited exposure to what actually works across verticals. AiiACo brings the full pattern library.",
  },
];

export default function AIRevenueEnginePage() {
  return (
    <>
      <SEO path="/ai-revenue-engine" />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI Revenue Systems</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI Revenue Engine.<br />
                <span className="gold-line">Pipeline Without Proportional Headcount.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                An AI revenue system is a connected set of AI-powered workflows that generate, qualify, nurture, convert, and reactivate pipeline without proportional human effort. AiiACo designs, deploys, and manages this system as operational infrastructure on top of your existing CRM.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Build Your Revenue Engine</a>
                <a href="/method" style={{ fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  View Our Method →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* What an AI Revenue System Is */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                Definition
              </motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "24px" }}>
                Not a Tool. <span className="accent">An Operating Layer.</span>
              </motion.h2>
              <div className="gold-divider" />
              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "17px", lineHeight: 1.75, color: "rgba(200,215,230,0.72)", maxWidth: "72ch", marginTop: "28px" }}>
                Most companies buy an AI sales tool, plug it into a CRM, and call it done. The result is a point automation, not a revenue system. An AI revenue system connects five functions into one coordinated layer: lead generation, multi-touch nurture, pipeline intelligence, dormant database reactivation, and closed-loop attribution. It runs on top of the CRM you already own, generates pipeline without proportional headcount, and compounds over time as the AI learns what actually drives revenue in your business.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 5 Components */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                The 5 Components
              </motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                What AiiACo Builds.
              </motion.h2>

              <div style={{ display: "grid", gap: "24px" }}>
                {components.map((c) => (
                  <motion.div
                    key={c.n}
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
                    <div style={{ fontFamily: FF, fontSize: "18px", fontWeight: 800, color: "rgba(184,156,74,0.80)", letterSpacing: "0.08em" }}>{c.n}</div>
                    <div>
                      <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{c.title}</h3>
                      <p style={{ fontFamily: FF, fontSize: "15px", lineHeight: 1.7, color: "rgba(200,215,230,0.70)", margin: 0 }}>{c.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          items={faqItems}
          eyebrow="AI Revenue System FAQ"
          headline="The Questions Operators Ask."
          subheadline="Everything about how AiiACo builds, deploys, and manages AI revenue systems on top of existing CRM infrastructure."
        />

        {/* Related Services */}
        <section style={{ padding: "80px 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "24px" }}>
              Related Services
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "16px" }}>
              {[
                { href: "/ai-integration", title: "AI Integration Services", desc: "End-to-end enterprise AI integration across your full operational architecture." },
                { href: "/ai-crm-integration", title: "AI CRM Integration", desc: "Embed AI directly into Salesforce, HubSpot, Pipedrive, or GoHighLevel." },
                { href: "/ai-workflow-automation", title: "AI Workflow Automation", desc: "Operational automation at scale across every revenue and operations function." },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textDecoration: "none" }}
                >
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 6px" }}>{link.title}</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, lineHeight: 1.5 }}>{link.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(80px, 10vw, 120px) 0" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "20px" }}>
              Build the revenue engine.
            </h2>
            <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.65, color: "rgba(200,215,230,0.60)", marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px" }}>
              Every engagement begins with a Business Intelligence Audit. AiiACo maps your current revenue operations, identifies the highest-leverage AI components, and scopes a path from today to a compounding AI revenue engine.
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
