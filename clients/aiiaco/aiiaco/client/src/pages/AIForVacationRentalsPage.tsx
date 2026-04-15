/**
 * AiiACo - /ai-for-vacation-rentals
 * Target: "AI for vacation rentals", "AI vacation rental management"
 * Positioning: AiiACo is the INTEGRATOR, not a competing vendor (vs Hospitable, Jurny, Hostaway)
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { motion } from "framer-motion";


const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const useCases = [
  { n: "01", title: "Guest Communication Automation", body: "Pre-arrival, in-stay, and post-stay messaging automated across every channel. Guest questions answered in seconds, 24/7, in natural language." },
  { n: "02", title: "Dynamic Pricing Integration", body: "AI connects your pricing tool (PriceLabs, Wheelhouse, Beyond) to your PMS and generates occupancy-optimized rate adjustments without manual review." },
  { n: "03", title: "Maintenance Coordination", body: "Field teams receive AI-dispatched work orders with context, photos, and priority. Housekeepers, handymen, and landscapers get the right job at the right time." },
  { n: "04", title: "Review Intelligence", body: "Guest review analysis surfaces recurring complaints, flags properties at risk of star-rating drops, and drafts reply content for operators managing hundreds of units." },
  { n: "05", title: "Financial Reporting Automation", body: "Monthly owner statements, tax summaries, and performance dashboards generated from PMS data in minutes instead of days." },
  { n: "06", title: "Unit Onboarding Automation", body: "New property onboarding from contract signature to live listing compressed from weeks to days via AI-orchestrated content, pricing, and channel distribution." },
];

const platforms = [
  "Hostaway",
  "Guesty",
  "Hospitable",
  "Hostfully",
  "Jurny",
  "RentalReady",
  "Boom",
  "CiiRUS",
  "PriceLabs",
  "Wheelhouse",
  "Beyond Pricing",
  "Airbnb",
  "Vrbo",
  "Booking.com",
];

const faqItems = [
  {
    question: "Isn't Hostaway, Hospitable, or Jurny already an AI vacation rental platform?",
    answer:
      "Yes, and AiiACo works with them, not against them. Hostaway, Hospitable, Jurny, RentalReady, and Boom are product platforms that handle specific parts of vacation rental operations. AiiACo is an integration layer that ties those platforms together and adds AI coordination between them. A 200-unit operator running Hostaway plus PriceLabs plus Airtable plus Slack typically has integration gaps that AiiACo's operational AI layer fills without replacing any vendor.",
  },
  {
    question: "Do I have to switch PMS platforms to work with AiiACo?",
    answer:
      "No. AiiACo integrates with your existing PMS via native APIs and webhook pipelines. Hostaway, Guesty, Hospitable, Hostfully, Jurny, RentalReady, Boom, and CiiRUS all have documented integration paths. AiiACo builds the layer on top of what you already run.",
  },
  {
    question: "What does AI actually do for a vacation rental operator?",
    answer:
      "AI handles the repeatable coordination work that consumes operator time: guest messaging across every channel, maintenance dispatch to field teams, pricing adjustments based on occupancy signals, review analysis, owner financial reporting, and new unit onboarding. Operators keep the judgment work: owner relationships, guest escalations, strategic pricing calls, and property acquisition.",
  },
  {
    question: "Can AI personalize guest communication across hundreds of units?",
    answer:
      "Yes. AiiACo deploys guest communication systems that personalize per-guest based on booking channel, stay length, unit type, and past behavior. Pre-arrival instructions, in-stay check-ins, and post-stay review requests all adapt to context. The operator's brand voice is preserved because the AI is tuned on existing communication templates.",
  },
  {
    question: "How long does AI integration take for a vacation rental operator?",
    answer:
      "A focused guest communication deployment takes 3 to 5 weeks. Full integration across guest comms, maintenance dispatch, pricing, review analysis, and financial reporting runs 6 to 12 weeks depending on unit count and PMS complexity. AiiACo handles every integration step.",
  },
  {
    question: "Does AiiACo replace housekeepers or property managers?",
    answer:
      "No. AiiACo replaces the coordination and admin work that consumes property manager time: dispatching jobs, answering routine guest messages, generating reports, chasing maintenance updates. Property managers and field teams keep the in-person work. Operators typically scale from 50 to 200+ units without adding headcount.",
  },
];

export default function AIForVacationRentalsPage() {
  return (
    <>
      <SEO path="/ai-for-vacation-rentals" />
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)", minHeight: "100vh" }}>
        <section style={{ padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 100px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fade} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A843" }} />
                <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>AI for Vacation Rentals</span>
              </motion.div>

              <motion.h1 variants={fade} className="display-headline" style={{ marginBottom: "24px" }}>
                AI for Vacation Rentals.<br />
                <span className="gold-line">Scale From 50 Units to 500. Without Chaos.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.7, color: "rgba(200,215,230,0.78)", maxWidth: "68ch", marginBottom: "40px" }}>
                AiiACo is the integration layer for vacation rental operators running Hostaway, Guesty, Hospitable, or Hostfully alongside PriceLabs, Wheelhouse, and the OTAs. We deploy AI guest communication, maintenance coordination, review intelligence, and owner reporting on top of your existing stack, so you scale units without adding headcount.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/upgrade" className="btn-gold" style={{ textDecoration: "none" }}>Start Your Engagement</a>
                <a href="/industries/luxury-lifestyle-hospitality" style={{ fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.70)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "12px 0", borderBottom: "1px solid rgba(200,215,230,0.20)" }}>
                  Hospitality Industry Deep Dive →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section style={{ padding: "clamp(60px, 8vw, 100px) 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
                Use Cases
              </motion.p>
              <motion.h2 variants={fade} className="section-headline" style={{ marginBottom: "48px" }}>
                What AiiACo Deploys for Vacation Rental Operators.
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

        <section style={{ padding: "80px 0", background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", marginBottom: "16px" }}>
              Supported Platforms
            </p>
            <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "32px" }}>
              Keep Your Stack. Add the AI Layer.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "12px" }}>
              {platforms.map((p) => (
                <div key={p} style={{ padding: "14px 18px", background: "rgba(184,156,74,0.04)", border: "1px solid rgba(184,156,74,0.12)", borderRadius: "10px", fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(200,215,230,0.88)" }}>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection
          items={faqItems}
          eyebrow="AI for Vacation Rentals FAQ"
          headline="Operator Questions, Answered."
          subheadline="Everything about how AiiACo integrates AI across Hostaway, Guesty, Hospitable, PriceLabs, and the OTAs without replacing any vendor."
        />

        <section style={{ padding: "clamp(80px, 10vw, 120px) 0", background: "rgba(6,11,20,0.80)", borderTop: "1px solid rgba(184,156,74,0.10)" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "20px" }}>
              Scale the portfolio. Not the team.
            </h2>
            <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.65, color: "rgba(200,215,230,0.60)", marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px" }}>
              Every engagement begins with a Business Intelligence Audit. AiiACo maps the friction in your current operations and scopes an AI integration path tied to unit growth.
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
