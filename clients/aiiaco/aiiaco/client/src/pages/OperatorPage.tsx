/*
 * AiiACo Operator Package Page
 * Design: Liquid Glass Bio-Organic - deep void black, liquid glass, gold electricity
 * AiiA manages everything - you receive outcomes
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CallNowButton from "@/components/CallNowButton";
import SEO from "@/seo/SEO";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const ICON = {
  efficiency: "/images/icon-efficiency.webp",
  brain: "/images/icon-brain.webp",
  target: "/images/icon-target.webp",
  users: "/images/icon-users.webp",
  shield: "/images/icon-shield.webp",
  trending: "/images/icon-trending.webp",
  workflow: "/images/icon-workflow-transparent.webp",
  data: "/images/icon-data-transparent.webp",
};

const WHAT_WE_MANAGE = [
  {
    title: "AI Workforce Deployment",
    description: "We assemble, configure, and deploy your entire AI workforce - SDR agents, receptionists, operations agents, client success agents. All trained on your data, all managed by us.",
    icon: ICON.brain,
    color: "#B89C4A",
  },
  {
    title: "Infrastructure Monitoring",
    description: "24/7 monitoring of every AI workflow. We detect issues before they affect your business, apply updates, and optimise performance continuously.",
    icon: ICON.efficiency,
    color: "#C8A855",
  },
  {
    title: "Performance Optimisation",
    description: "Monthly performance reviews with ROI reporting. We identify underperforming workflows, test improvements, and implement changes - you just review the results.",
    icon: ICON.trending,
    color: "#D4A843",
  },
  {
    title: "Security & Compliance",
    description: "Enterprise-grade security, data handling, and compliance management. Your AI infrastructure meets the same standards as your core business systems.",
    icon: ICON.shield,
    color: "#E0B84A",
  },
  {
    title: "Workflow Expansion",
    description: "As your business grows, we identify new automation opportunities, deploy additional agents, and expand your AI infrastructure - without disrupting existing operations.",
    icon: ICON.workflow,
    color: "#ECC050",
  },
  {
    title: "Reporting & Intelligence",
    description: "Real-time dashboards, weekly summaries, and strategic insights. You see exactly what your AI workforce is producing and where the next opportunity lies.",
    icon: ICON.data,
    color: "#D4A843",
  },
];

const COMPARISON = [
  { aspect: "Who operates the AI", agent: "Your team", operator: "AiiACo" },
  { aspect: "Who monitors performance", agent: "Your team", operator: "AiiACo" },
  { aspect: "Who handles updates", agent: "Your team", operator: "AiiACo" },
  { aspect: "Who expands workflows", agent: "Your team (with support)", operator: "AiiACo" },
  { aspect: "Who reports results", agent: "Self-service dashboards", operator: "AiiACo delivers reports" },
  { aspect: "Best for", agent: "Hands-on teams", operator: "Outcome-focused leaders" },
];

export default function OperatorPage() {
  const contactRef = useRef<HTMLDivElement>(null);
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <SEO
        title="Operator Package | AiiACo - Fully Managed AI Infrastructure"
        description="AiiACo's Operator Package: we manage everything. AI workforce deployment, monitoring, optimisation, and reporting - you receive outcomes, not tasks."
        path="/operator"
        keywords="managed AI infrastructure, AI operator, fully managed AI, AI workforce management, AI operations, managed AI services"
      />
      <div style={{ minHeight: "100vh", background: "#03050A", color: "#d2dceb", fontFamily: FF, overflowX: "hidden" }}>
        <Navbar />

        {/* Hero */}
        <section style={{ padding: "clamp(80px, 12vw, 120px) 24px 80px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <img src={ICON.efficiency} alt="Operator Package" style={{ width: "72px", height: "72px", objectFit: "contain", margin: "0 auto 24px" }} />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(184,156,74,0.10)", border: "1px solid rgba(184,156,74,0.25)",
              borderRadius: "20px", padding: "6px 16px", marginBottom: "28px",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#B89C4A",
              textTransform: "uppercase",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#B89C4A", display: "inline-block" }} />
              Operator Package
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              We Manage Everything.{" "}
              <br />
              <span style={{ color: "#D4A843" }}>You Receive Outcomes.</span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)", color: "rgba(200,215,230,0.60)", maxWidth: "640px", margin: "0 auto 40px", lineHeight: 1.7 }}>
              Your AI infrastructure - deployed, monitored, optimised, and expanded - entirely by AiiACo.
              You focus on running your business. We focus on making it run better.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={scrollToContact} className="btn-gold" style={{ fontSize: "15px", padding: "14px 32px" }}>
                Request Operator Package
              </button>
              <CallNowButton variant="outline" size="lg" />
            </div>
          </motion.div>
        </section>

        {/* What We Manage */}
        <section style={{ padding: "0 24px 100px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              What AiiACo Manages for You
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(200,215,230,0.50)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
              Every aspect of your AI infrastructure - from deployment to expansion - handled by our team.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: "20px" }}>
            {WHAT_WE_MANAGE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", padding: "28px 24px",
                  backdropFilter: "blur(12px)",
                }}
              >
                <img src={item.icon} alt={item.title} style={{ width: "40px", height: "40px", objectFit: "contain", marginBottom: "16px" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px", color: item.color }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(200,215,230,0.65)", lineHeight: 1.65, margin: 0 }}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Agent vs Operator Comparison */}
        <section style={{
          padding: "80px 24px",
          background: "rgba(184,156,74,0.04)",
          borderTop: "1px solid rgba(184,156,74,0.12)",
          borderBottom: "1px solid rgba(184,156,74,0.12)",
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, margin: "0 0 40px", letterSpacing: "-0.02em", textAlign: "center" }}>
              Agent vs Operator
            </h2>

            {/* Desktop table */}
            <div className="hidden sm:block">
              <div style={{
                display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr",
                background: "rgba(184,156,74,0.08)", borderRadius: "12px 12px 0 0",
                padding: "14px 20px", fontWeight: 700, fontSize: "13px",
                letterSpacing: "0.05em", textTransform: "uppercase", color: "#D4A843",
              }}>
                <div />
                <div>Agent Package</div>
                <div>Operator Package</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={row.aspect} style={{
                  display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr",
                  padding: "14px 20px",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  fontSize: "14px",
                }}>
                  <div style={{ color: "rgba(200,215,230,0.80)", fontWeight: 600 }}>{row.aspect}</div>
                  <div style={{ color: "rgba(200,215,230,0.55)" }}>{row.agent}</div>
                  <div style={{ color: "#D4A843", fontWeight: 600 }}>{row.operator}</div>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {COMPARISON.map((row) => (
                <div key={row.aspect} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px", padding: "16px",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(200,215,230,0.80)", marginBottom: "10px" }}>{row.aspect}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(200,215,230,0.40)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Agent</div>
                      <div style={{ fontSize: "13px", color: "rgba(200,215,230,0.55)" }}>{row.agent}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(184,156,74,0.60)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Operator</div>
                      <div style={{ fontSize: "13px", color: "#D4A843", fontWeight: 600 }}>{row.operator}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section ref={contactRef} style={{ padding: "100px 24px", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              Stop Managing AI.
              <br />
              <span style={{ color: "#D4A843" }}>Start Receiving Results.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(200,215,230,0.55)", margin: "0 0 36px", lineHeight: 1.7 }}>
              The Operator Package is for leaders who want outcomes, not operations.
              We handle the infrastructure. You handle the business.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://calendly.com/aiiaco"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ fontSize: "15px", padding: "14px 32px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                Book a Strategy Call
              </a>
              <CallNowButton variant="outline" size="lg" />
            </div>
            <p style={{ fontSize: "12px", color: "rgba(200,215,230,0.30)", marginTop: "20px" }}>
              AiA answers 24/7 · Routes you to the right program · No sales pressure
            </p>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}
