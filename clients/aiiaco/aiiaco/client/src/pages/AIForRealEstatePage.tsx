/**
 * AiiACo - /ai-for-real-estate
 * Target: "AI for real estate", "AI for real estate brokerages"
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { motion } from "framer-motion";


const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const useCases = [
  { n: "01", title: "Lead Qualification in Seconds", body: "Inbound leads scored in real time by intent, budget, timeline, and property criteria. Qualified buyers routed to the right agent before a competitor has them." },
  { n: "02", title: "MLS-Compliant Listing Content", body: "Listing descriptions, neighborhood reports, and buyer pitch decks generated from MLS data in seconds. NAR and Fair Housing Act language compliance built in." },
  { n: "03", title: "Automated Multi-Touch Follow-Up", body: "Personalized outbound sequences across email, SMS, and voice triggered by deal stage. No cold leads, no missed touchpoints, no manual scheduling." },
  { n: "04", title: "Pipeline Intelligence", body: "Real-time dashboards showing deal velocity, conversion probability, and revenue forecast across every agent. Broker-level visibility without manual reporting." },
  { n: "05", title: "Dormant Database Reactivation", body: "Cold contacts segmented and re-engaged with personalized sequences. Typical reactivation rate: 15 to 25 percent of previously dormant database." },
  { n: "06", title: "Transaction Coordination", body: "Document tracking, critical date monitoring, and task handoff between listing agent, buyer agent, TC, and title. AI catches missing paperwork before it delays closing." },
];

const platforms = [
  "Follow Up Boss",
  "kvCORE",
  "BoomTown",
  "Lofty (formerly Chime)",
  "BoldTrail",
  "Compass",
  "dotloop",
  "SkySlope",
  "Salesforce Real Estate Cloud",
  "Zillow Premier Agent",
];

const faqItems = [
  {
    question: "How does AI help real estate brokerages?",
    answer:
      "AI for real estate brokerages embeds artificial intelligence into lead qualification, listing content generation, transaction coordination, and agent productivity workflows. It replaces manual follow-up with multi-touch sequences, generates MLS-compliant listing copy in seconds, and surfaces deal intelligence for brokers managing dozens of agents. AiiACo builds the integration on top of Follow Up Boss, kvCORE, BoomTown, Lofty, or any brokerage CRM already in use.",
  },
  {
    question: "Does AI replace real estate agents?",
    answer:
      "No. AI replaces the coordination and administrative work that consumes agent time: lead qualification, follow-up scheduling, content drafting, reporting, and transaction tracking. Agents keep the judgment work: client relationships, negotiations, showings, deal structuring. Brokerages that deploy AI typically see agent capacity increase 2 to 3 times without hiring.",
  },
  {
    question: "Can AI write MLS listings without violating Fair Housing Act rules?",
    answer:
      "Yes. AiiACo deploys content generation systems with Fair Housing Act language filters and NAR advertising compliance built in. Listing descriptions adhere to protected-class language rules and can be reviewed by compliance officers before publication. Brokerages reduce per-listing content time from hours to minutes while maintaining compliance.",
  },
  {
    question: "Which real estate platforms does AiiACo integrate with?",
    answer:
      "AiiACo integrates with Follow Up Boss, kvCORE, BoomTown, Lofty, BoldTrail, Compass, dotloop, SkySlope, Salesforce Real Estate Cloud, and Zillow Premier Agent via native APIs. For platforms without public APIs, AiiACo builds custom integration layers via webhook pipelines.",
  },
  {
    question: "How long does AI integration take for a real estate brokerage?",
    answer:
      "A focused lead qualification and follow-up deployment takes 3 to 5 weeks. Full integration across lead ops, listing content, transaction coordination, and pipeline reporting runs 8 to 12 weeks. AiiACo manages every phase: CRM integration, content tuning, agent onboarding, and ongoing optimization.",
  },
  {
    question: "Can AiiACo deploy performance-based for a brokerage?",
    answer:
      "Yes. AiiACo offers Performance Partnership engagements tied to measurable outcomes: lead conversion rate, listing content velocity, or GCI per agent. This model reduces upfront investment for brokerages that want to align vendor compensation directly with business results.",
  },
];

export default function AIForRealEstatePage() {
  return (
    <>
      <SEO path="/ai-for-real-estate" />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI for Real Estate</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI for Real Estate.<br />
                <span className="gold-line">Built for Brokerages That Close.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                AiiACo deploys AI lead qualification, automated outreach, MLS-compliant listing content, and pipeline intelligence for real estate brokerages. The stack runs on top of Follow Up Boss, kvCORE, BoomTown, Lofty, and every major brokerage CRM in market.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Start Your Engagement</a>
                <a href="/industries/real-estate-brokerage" style={{ fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  Industry Deep Dive →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                Use Cases
              </motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                What AiiACo Deploys for Brokerages.
              </motion.h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(380px, 100%), 1fr))", gap: "16px" }}>
                {useCases.map((uc) => (
                  <motion.div key={uc.n} variants={fade} style={{ padding: "24px 28px", background: "rgba(184,156,74,0.04)", border: "1px solid rgba(184,156,74,0.12)", borderRadius: "14px" }}>
                    <div style={{ fontFamily: FF, fontSize: "12px", fontWeight: 800, color: "rgba(184,156,74,0.70)", letterSpacing: "0.14em", marginBottom: "8px" }}>{uc.n}</div>
                    <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{uc.title}</h3>
                    <p style={{ fontFamily: FF, fontSize: "14px", lineHeight: 1.65, color: "rgba(200,215,230,0.70)", margin: 0 }}>{uc.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platforms */}
        <section style={{ padding: "80px 0", background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
              Supported Brokerage Platforms
            </p>
            <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "32px" }}>
              Keep Your CRM. Add the AI Layer.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "12px" }}>
              {platforms.map((p) => (
                <div key={p} style={{ padding: "16px 20px", background: "rgba(184,156,74,0.04)", border: "1px solid rgba(184,156,74,0.12)", borderRadius: "10px", fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.88)" }}>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection
          items={faqItems}
          eyebrow="AI for Real Estate FAQ"
          headline="Brokerage Questions, Answered."
          subheadline="Everything about how AiiACo deploys AI on top of brokerage CRMs, MLS content workflows, and transaction coordination."
        />

        <section style={{ padding: "clamp(80px, 10vw, 120px) 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "20px" }}>
              Close more. With less friction.
            </h2>
            <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.65, color: "rgba(200,215,230,0.60)", marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px" }}>
              Every engagement begins with a Business Intelligence Audit. AiiACo maps the friction in your brokerage operations and scopes an AI deployment path tied to GCI.
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
