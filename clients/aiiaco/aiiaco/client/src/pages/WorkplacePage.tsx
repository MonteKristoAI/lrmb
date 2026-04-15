/*
 * AiiACo - Workplace Policy Page
 * Route: /workplace
 * Design: Liquid Glass Bio-Organic - consistent with site design language
 */
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";
import SEO from "@/seo/SEO";
import { CALENDLY_URL } from "@/const";
import { trackCalendlyLinkClick } from "@/hooks/useCalendlyTracking";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.10 } } };

const pillars = [
  {
    number: "01",
    title: "Fully Remote, No Exceptions",
    body: "AiiACo has no physical headquarters and no plans to build one. Every team member - from AI architects to client success leads - operates from wherever they do their best work. We believe the right talent is distributed across the globe, and our infrastructure is built to prove it.",
  },
  {
    number: "02",
    title: "Output Over Hours",
    body: "We do not track time. We track outcomes. Deliverables, milestones, and measurable client results are the only metrics that matter. A team member who solves a complex integration problem in three hours is valued the same as one who takes twelve - what matters is the quality of the solution, not the clock.",
  },
  {
    number: "03",
    title: "Async by Default",
    body: "Meetings are a last resort, not a first instinct. Documentation, recorded walkthroughs, and structured async updates replace standing calls. When synchronous communication is necessary, it is scheduled with a clear agenda and a defined outcome. We respect time zones and protect deep work.",
  },
  {
    number: "04",
    title: "Radical Autonomy",
    body: "Team members are trusted to manage their own schedules, environments, and workflows. There is no approval chain for how you structure your day. AiiACo hires for judgment and then gets out of the way. Autonomy is not a perk - it is a prerequisite for the caliber of work we deliver.",
  },
  {
    number: "05",
    title: "Systems Over Supervision",
    body: "We build internal systems - documentation, workflows, AI-assisted tooling - that enable execution without constant oversight. Every process is designed to run without a manager in the loop. This is the same philosophy we apply to client AI infrastructure, and it starts internally.",
  },
  {
    number: "06",
    title: "Global Talent, No Geographic Bias",
    body: "Compensation and opportunity at AiiACo are not adjusted by location. A top-tier AI integration specialist in Lagos, Manila, or São Paulo is compensated at the same level as one in New York or London. We compete for the best minds globally and pay accordingly.",
  },
];

const standards = [
  {
    label: "Communication",
    text: "All async communication is written with clarity and context. We over-document rather than under-communicate. Responses to async messages are expected within one business day unless urgency is flagged.",
  },
  {
    label: "Availability",
    text: "Team members define their working windows and publish them to the team. Overlap hours for cross-timezone collaboration are agreed upon at onboarding. No one is expected to be always-on.",
  },
  {
    label: "Accountability",
    text: "Deadlines are commitments. If a deadline is at risk, the team member flags it proactively - not after the fact. We operate with a culture of early escalation, not silent failure.",
  },
  {
    label: "Confidentiality",
    text: "Client data, engagement details, and internal systems are strictly confidential. All team members operate under NDA and follow AiiACo's data handling protocols regardless of their location or device.",
  },
  {
    label: "Professional Standards",
    text: "AiiACo represents the AI Integration Authority for the Corporate Age. All external communications, deliverables, and client interactions must reflect that standard - precise, professional, and authoritative.",
  },
  {
    label: "Continuous Improvement",
    text: "Team members are expected to stay current with the AI landscape. AiiACo provides access to research, tooling, and learning resources. Stagnation is not compatible with the pace of this field.",
  },
];

export default function WorkplacePage() {
  return (
    <>
      <SEO
        title="Workplace Policy | AiiACo - Remote-First AI Integration Authority"
        description="AiiACo operates as a fully remote, output-driven company. We prioritize autonomy, async collaboration, and measurable results over hours logged."
        path="/workplace"
        keywords="AiiACo workplace policy, remote AI company, async work policy, distributed AI team, remote-first company policy"
      />
      <div style={{ background: "#03050A", minHeight: "100vh", color: "rgba(255,255,255,0.88)" }}>
        <Navbar />

        {/* Hero */}
        <section style={{ padding: "120px 0 80px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.div variants={fade}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "32px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(184,156,74,0.85)", display: "inline-block" }} />
                  <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>Workplace Policy</span>
                </div>
              </motion.div>

              <motion.h1 variants={fade} style={{ fontFamily: FFD, fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.95)", margin: "0 0 28px" }}>
                We Build for Distributed<br />
                <span style={{ color: "rgba(184,156,74,0.90)" }}>Execution at Scale.</span>
              </motion.h1>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "18px", lineHeight: 1.75, color: "rgba(200,215,230,0.60)", maxWidth: "680px", margin: "0 0 16px" }}>
                AiiACo operates as a fully remote, output-driven company. We prioritize autonomy, async collaboration, and measurable results over hours logged. Our systems are built for distributed execution, enabling global talent to deliver high-impact AI solutions efficiently.
              </motion.p>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "14px", lineHeight: 1.7, color: "rgba(200,215,230,0.38)", maxWidth: "680px", margin: 0 }}>
                This page describes how AiiACo operates internally - the principles that govern how our team works, communicates, and delivers. It applies to all full-time team members, contractors, and embedded AI specialists working on AiiACo engagements.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Six Pillars */}
        <section style={{ padding: "96px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "1100px" }}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fade} style={{ marginBottom: "56px" }}>
                <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", margin: "0 0 12px" }}>How We Operate</p>
                <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0, letterSpacing: "-0.01em" }}>Six Pillars of the AiiACo Workplace</h2>
              </motion.div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                {pillars.map((p) => (
                  <motion.div
                    key={p.number}
                    variants={fade}
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "16px",
                      padding: "32px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "absolute", top: "20px", right: "24px", fontFamily: FFD, fontSize: "48px", fontWeight: 800, color: "rgba(184,156,74,0.06)", lineHeight: 1, userSelect: "none" }}>{p.number}</div>
                    <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(184,156,74,0.70)", margin: "0 0 12px" }}>{p.number}</p>
                    <h3 style={{ fontFamily: FFD, fontSize: "19px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 14px", lineHeight: 1.25 }}>{p.title}</h3>
                    <p style={{ fontFamily: FF, fontSize: "14px", lineHeight: 1.75, color: "rgba(200,215,230,0.52)", margin: 0 }}>{p.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Operating Standards */}
        <section style={{ padding: "96px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "1100px" }}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fade} style={{ marginBottom: "56px" }}>
                <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", margin: "0 0 12px" }}>Standards</p>
                <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0, letterSpacing: "-0.01em" }}>What We Expect From Every Team Member</h2>
              </motion.div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {standards.map((s, i) => (
                  <motion.div
                    key={s.label}
                    variants={fade}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 1fr",
                      gap: "32px",
                      padding: "28px 0",
                      borderBottom: i < standards.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      alignItems: "start",
                    }}
                  >
                    <p style={{ fontFamily: FFD, fontSize: "15px", fontWeight: 700, color: "rgba(184,156,74,0.80)", margin: 0, paddingTop: "2px" }}>{s.label}</p>
                    <p style={{ fontFamily: FF, fontSize: "15px", lineHeight: 1.75, color: "rgba(200,215,230,0.58)", margin: 0 }}>{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Remote Works for AI */}
        <section style={{ padding: "96px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fade} style={{ marginBottom: "40px" }}>
                <p style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(184,156,74,0.60)", margin: "0 0 12px" }}>Philosophy</p>
                <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0, letterSpacing: "-0.01em" }}>Why Remote Works for AI Integration</h2>
              </motion.div>

              <motion.div variants={fade} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.80, color: "rgba(200,215,230,0.58)", margin: 0 }}>
                  AI integration is fundamentally a systems discipline. The work requires deep, uninterrupted focus - the kind that is destroyed by open offices, unnecessary meetings, and performative presence. Remote work is not a compromise for AiiACo; it is the optimal environment for the type of thinking our work demands.
                </p>
                <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.80, color: "rgba(200,215,230,0.58)", margin: 0 }}>
                  The best AI architects, integration engineers, and operational specialists are not concentrated in any single city or country. By operating remotely, we access a global talent pool that no office-bound competitor can match. This directly translates to better outcomes for our clients - because the person best suited to solve a specific integration challenge is on our team, regardless of their timezone.
                </p>
                <p style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.80, color: "rgba(200,215,230,0.58)", margin: 0 }}>
                  We also practice what we deploy. Every AI system AiiACo builds for clients is designed to operate autonomously, asynchronously, and at scale - without constant human supervision. Our internal workplace model reflects the same principles. We are not just an AI company. We are an AI-native company.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Join CTA */}
        <section style={{ padding: "96px 0 120px" }}>
          <div className="container" style={{ maxWidth: "700px", textAlign: "center" }}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fade}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)", borderRadius: "999px", padding: "6px 16px", marginBottom: "28px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(184,156,74,0.85)", display: "inline-block" }} />
                  <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(184,156,74,0.85)" }}>Join the Team</span>
                </div>
              </motion.div>

              <motion.h2 variants={fade} style={{ fontFamily: FFD, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.10, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.95)", margin: "0 0 20px" }}>
                Built for People Who Deliver.
              </motion.h2>

              <motion.p variants={fade} style={{ fontFamily: FF, fontSize: "16px", lineHeight: 1.75, color: "rgba(200,215,230,0.52)", margin: "0 0 36px" }}>
                If you are an AI specialist, integration engineer, or operational leader who thrives in high-autonomy environments and measures success by outcomes - not office hours - AiiACo was built for you.
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCalendlyLinkClick("workplace_page")}
                  style={{
                    fontFamily: FF,
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#03050A",
                    background: "linear-gradient(135deg, rgba(212,180,67,1) 0%, rgba(184,156,74,1) 100%)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px 32px",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Work With Us
                </a>
                <a
                  href="/method"
                  style={{
                    fontFamily: FF,
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "rgba(184,156,74,0.85)",
                    background: "transparent",
                    border: "1px solid rgba(184,156,74,0.30)",
                    borderRadius: "8px",
                    padding: "14px 32px",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Our Method
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <RelatedServices current="/workplace" max={4} />
      <Footer />
      </div>
    </>
  );
}
