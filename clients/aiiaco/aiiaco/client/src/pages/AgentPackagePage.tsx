/*
 * AiiACo Agent Package Page
 * Design: Liquid Glass Bio-Organic - deep void black, liquid glass, gold electricity
 * AI tools deployed for your team to operate - self-service AI infrastructure
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";
import CallNowButton from "@/components/CallNowButton";
import SEO from "@/seo/SEO";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const ICON = {
  handshake: "/images/icon-handshake.webp",
  efficiency: "/images/icon-efficiency.webp",
  brain: "/images/icon-brain.webp",
  target: "/images/icon-target.webp",
  users: "/images/icon-users.webp",
  shield: "/images/icon-shield.webp",
  trending: "/images/icon-trending.webp",
  skyline: "/images/icon-skyline.webp",
};

const AGENTS = [
  {
    title: "AI SDR Agent",
    description: "Qualifies inbound leads in real time, answers objections, and books discovery calls directly into your calendar. Your team reviews qualified leads - the AI handles the rest.",
    capabilities: [
      "Real-time lead qualification",
      "Objection handling and follow-up",
      "Calendar integration for booking",
      "CRM logging of all interactions",
    ],
    icon: ICON.target,
    color: "#B89C4A",
  },
  {
    title: "AI Receptionist",
    description: "Answers calls and chats 24/7. Routes enquiries to the right team member. Books appointments. Never misses a call, never puts anyone on hold.",
    capabilities: [
      "24/7 phone and chat coverage",
      "Intelligent call routing",
      "Appointment scheduling",
      "Multi-language support",
    ],
    icon: ICON.users,
    color: "#C8A855",
  },
  {
    title: "Cold Email Agent",
    description: "Researches prospects, writes personalised outreach, manages follow-up sequences, and books meetings - without a human SDR touching each message.",
    capabilities: [
      "Prospect research and list building",
      "Personalised email generation",
      "Multi-step follow-up sequences",
      "Reply detection and meeting booking",
    ],
    icon: ICON.brain,
    color: "#D4A843",
  },
  {
    title: "Operations Agent",
    description: "Automates repetitive admin tasks: data entry, report generation, invoice processing, and workflow triggers. Your team focuses on decisions, not administration.",
    capabilities: [
      "Data entry automation",
      "Report generation and distribution",
      "Invoice processing and reconciliation",
      "Workflow triggers and notifications",
    ],
    icon: ICON.efficiency,
    color: "#E0B84A",
  },
  {
    title: "Client Success Agent",
    description: "Monitors client health signals, sends proactive check-ins, flags at-risk accounts, and surfaces upsell opportunities based on usage patterns.",
    capabilities: [
      "Client health monitoring",
      "Proactive check-in sequences",
      "At-risk account flagging",
      "Upsell opportunity detection",
    ],
    icon: ICON.shield,
    color: "#ECC050",
  },
];

const DIFFERENTIATORS = [
  { title: "Your Team Operates", desc: "AI tools are deployed for your team to use. You maintain control over every decision and interaction.", icon: ICON.handshake },
  { title: "Trained on Your Data", desc: "Every agent is trained on your specific business context, terminology, and processes - not generic templates.", icon: ICON.brain },
  { title: "Measurable ROI", desc: "Each agent comes with performance dashboards and KPI tracking. You see exactly what the AI is producing.", icon: ICON.trending },
  { title: "Scales with You", desc: "Start with one agent. Add more as your team gets comfortable. No lock-in, no pressure to deploy everything at once.", icon: ICON.target },
];

export default function AgentPackagePage() {
  const contactRef = useRef<HTMLDivElement>(null);
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <SEO
        title="Agent Package | AiiACo - AI Tools for Your Team to Operate"
        description="AiiACo's Agent Package: AI tools deployed for your team to operate. SDR agents, receptionists, cold email automation, operations agents, and client success agents - all trained on your business data."
        path="/agentpackage"
        keywords="AI agent package, AI SDR, AI receptionist, cold email automation, AI operations, AI client success, business AI tools"
      />
      <div style={{ minHeight: "100vh", background: "#03050A", color: "#d2dceb", fontFamily: FF, overflowX: "hidden" }}>
        <Navbar />

        {/* Hero */}
        <section style={{ padding: "clamp(80px, 12vw, 120px) 24px 80px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <img src={ICON.handshake} alt="Agent Package" style={{ width: "72px", height: "72px", objectFit: "contain", margin: "0 auto 24px" }} />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(184,156,74,0.10)", border: "1px solid rgba(184,156,74,0.25)",
              borderRadius: "20px", padding: "6px 16px", marginBottom: "28px",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#B89C4A",
              textTransform: "uppercase",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#B89C4A", display: "inline-block" }} />
              Agent Package
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              AI Tools,{" "}
              <span style={{ color: "#D4A843" }}>Deployed for Your Team.</span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)", color: "rgba(200,215,230,0.60)", maxWidth: "640px", margin: "0 auto 40px", lineHeight: 1.7 }}>
              Your team stays in control. We deploy the AI agents, train them on your data,
              and hand you the keys. You operate them. You own the outcomes.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={scrollToContact} className="btn-gold" style={{ fontSize: "15px", padding: "14px 32px" }}>
                Request Agent Package
              </button>
              <CallNowButton variant="outline" size="lg" />
            </div>
          </motion.div>
        </section>

        {/* Agents Grid */}
        <section style={{ padding: "0 24px 100px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              Your AI Workforce
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(200,215,230,0.50)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
              Each agent is purpose-built for a specific function. Deploy one or deploy all - your team operates them.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: "20px" }}>
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.title}
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
                <img src={agent.icon} alt={agent.title} style={{ width: "40px", height: "40px", objectFit: "contain", marginBottom: "16px" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px", color: agent.color }}>{agent.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(200,215,230,0.65)", lineHeight: 1.65, margin: "0 0 20px" }}>{agent.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {agent.capabilities.map((cap) => (
                    <div key={cap} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: agent.color, flexShrink: 0, marginTop: "7px" }} />
                      <span style={{ fontSize: "13px", color: "rgba(200,215,230,0.70)", lineHeight: 1.5 }}>{cap}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Differentiators */}
        <section style={{
          padding: "80px 24px",
          background: "rgba(184,156,74,0.04)",
          borderTop: "1px solid rgba(184,156,74,0.12)",
          borderBottom: "1px solid rgba(184,156,74,0.12)",
        }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, margin: "0 0 48px", letterSpacing: "-0.02em", textAlign: "center" }}>
              Why the Agent Package
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "24px" }}>
              {DIFFERENTIATORS.map((d) => (
                <div key={d.title} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px", padding: "28px 20px",
                  textAlign: "center",
                }}>
                  <img src={d.icon} alt={d.title} style={{ width: "40px", height: "40px", objectFit: "contain", margin: "0 auto 16px" }} />
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#D4A843", marginBottom: "8px" }}>{d.title}</div>
                  <p style={{ fontSize: "13px", color: "rgba(200,215,230,0.60)", lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ideal For */}
        <section style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
            Ideal For
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "16px" }}>
            {[
              "Solo practitioners scaling with AI",
              "Small teams that want to stay lean",
              "Companies that prefer hands-on control",
              "Businesses testing AI before full integration",
            ].map((item) => (
              <div key={item} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px", padding: "20px 16px",
                fontSize: "14px", color: "rgba(200,215,230,0.70)", lineHeight: 1.5,
              }}>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section ref={contactRef} style={{ padding: "100px 24px", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              Deploy Your First Agent.
              <br />
              <span style={{ color: "#D4A843" }}>Your team runs it from day one.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(200,215,230,0.55)", margin: "0 0 36px", lineHeight: 1.7 }}>
              Start with the agent that solves your biggest bottleneck. Add more as your team gets comfortable. No lock-in.
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

        <RelatedServices current="/agentpackage" max={4} />
      <Footer />
      </div>
    </>
  );
}
