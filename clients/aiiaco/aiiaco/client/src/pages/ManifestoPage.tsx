/*
 * AiiACo Manifesto Page - /manifesto
 * Design: Liquid Glass Bio-Organic - deep void black, liquid glass, gold electricity
 * SEO: Unique title, description, canonical for /manifesto
 */
import { motion } from "framer-motion";
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import RelatedServices from "@/components/RelatedServices";

const declarations = [
  {
    n: "I",
    headline: "Intelligence is Infrastructure.",
    body: "AI is not a tool you add to a workflow. It is the architecture of the workflow itself. The businesses that understand this are not adopting AI - they are rebuilding their operating model around it. Those that do not will not be disrupted. They will simply become irrelevant.",
  },
  {
    n: "II",
    headline: "The Corporate Age of AI Has Begun.",
    body: "This is not a prediction. It is a condition. The transition from manual-dependent operations to AI-integrated infrastructure is not a future event - it is the current competitive divide. The question is not whether to integrate. The question is how fast and how well.",
  },
  {
    n: "III",
    headline: "Advice Without Execution Is Noise.",
    body: "The consulting model that delivers a strategy document and exits has no place in operational AI integration. We do not advise. We build, deploy, and manage. The system runs. The results are measured. The engagement is accountable.",
  },
  {
    n: "IV",
    headline: "Complexity Belongs on Our Side.",
    body: "AI infrastructure is complex. Managing AI agents, governance frameworks, quality controls, and performance monitoring requires sustained operational attention. That attention belongs on our side of the engagement - not yours. You manage the business. We manage the system.",
  },
  {
    n: "V",
    headline: "Outcomes Are Engineered, Not Promised.",
    body: "We do not make projections. We define KPIs, build to them, and measure against them. Performance-based structures are available because we are confident in what we build. If the outcome is not measurable, it will not be deployed.",
  },
  {
    n: "VI",
    headline: "The Businesses That Will Define This Decade Are Integrating Now.",
    body: "Not experimenting. Not piloting. Integrating. The window for first-mover advantage in AI-integrated operations is narrowing. The businesses that move with precision and speed today will be the ones that set the competitive standard for the next ten years.",
  },
];

export default function ManifestoPage() {
  return (
    <>
      <SEO
        title="The Corporate Age of AI | AiiACo Manifesto"
        description="AI is no longer a tool - it is infrastructure. Read the AiiACo manifesto on operational AI integration and the next corporate evolution."
        path="/manifesto"
        keywords="AI integration manifesto, corporate age of AI, operational AI infrastructure, AI integration authority, enterprise AI transformation, AI implementation philosophy"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1">
          {/* Hero */}
          <section
            style={{
              position: "relative",
              padding: "140px 0 100px",
              background: "linear-gradient(180deg, #03050A 0%, #060B14 60%, #03050A 100%)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 600px at 50% 40%, rgba(184,156,74,0.06) 0%, transparent 55%)" }} />
            <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "760px" }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="section-pill" style={{ marginBottom: "28px", width: "fit-content" }}>
                  <span className="dot" />
                  Manifesto
                </div>
                <h1 style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(40px, 6vw, 72px)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.97)",
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                  margin: "0 0 24px",
                }}>
                  The Corporate Age<br />
                  <span style={{ color: "#D4A843" }}>of AI Has Begun.</span>
                </h1>
                <div className="gold-divider" style={{ marginBottom: "28px" }} />
                <p style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(16px, 1.8vw, 20px)",
                  color: "rgba(200,215,230,0.72)",
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: "58ch",
                }}>
                  A declaration for the businesses that intend to lead - not respond.
                  Six principles that define how operational AI integration is built, deployed, and measured.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Declarations */}
          <section style={{ padding: "80px 0 120px", background: "#03050A" }}>
            <div className="container" style={{ maxWidth: "760px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {declarations.map((d, i) => (
                  <motion.div
                    key={d.n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.05 }}
                    style={{
                      padding: "40px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      display: "grid",
                      gridTemplateColumns: "48px 1fr",
                      gap: "28px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "rgba(184,156,74,0.65)",
                      paddingTop: "6px",
                      textTransform: "uppercase" as const,
                    }}>
                      {d.n}
                    </div>
                    <div>
                      <h2 style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "clamp(20px, 2.5vw, 30px)",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.96)",
                        margin: "0 0 14px",
                        lineHeight: 1.15,
                        letterSpacing: "-0.3px",
                      }}>
                        {d.headline}
                      </h2>
                      <p style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "clamp(14px, 1.5vw, 16px)",
                        color: "rgba(200,215,230,0.70)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        {d.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="glass-card-gold"
                style={{ padding: "40px 36px", marginTop: "56px", textAlign: "center" }}
              >
                <h3 style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(22px, 2.8vw, 34px)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.97)",
                  margin: "0 0 14px",
                  letterSpacing: "-0.4px",
                  lineHeight: 1.1,
                }}>
                  Principles without execution are philosophy.
                </h3>
                <p style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  color: "rgba(200,215,230,0.68)",
                  margin: "0 auto 28px",
                  maxWidth: "52ch",
                  lineHeight: 1.6,
                }}>
                  AiiACo exists to execute. If you are ready to integrate, begin the process.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="/upgrade" className="btn-gold" style={{ fontSize: "15px", padding: "14px 28px", textDecoration: "none" }}>
                    Request Upgrade
                  </a>
                  <a href="/method" className="btn-glass" style={{ fontSize: "15px", padding: "14px 22px", textDecoration: "none" }}>
                    Review the Method
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          <TeamSection />

          <RelatedServices current="/manifesto" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
