/*
 * AiiACo Corporate Package Page
 * Design: Liquid Glass Bio-Organic - deep void black, liquid glass, gold electricity
 * The modular AI rollout sequence for enterprise clients
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";
import CallNowButton from "@/components/CallNowButton";
import SEO from "@/seo/SEO";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const PHASES = [
  {
    number: "01",
    title: "Cold Email Agent",
    subtitle: "Your outbound engine, automated.",
    description:
      "An AI-driven cold email system that researches prospects, writes personalised outreach, handles follow-up sequences, and books meetings - without a human SDR touching each message. Deployed, tested, and optimised within 30 days.",
    deliverables: [
      "Prospect research & list building automation",
      "Personalised email copy generation (AI-written, human-reviewed)",
      "Multi-step follow-up sequences with reply detection",
      "Meeting booking integrated directly into your calendar",
      "Weekly performance reporting dashboard",
    ],
    timeline: "30 days",
    color: "#B89C4A",
  },
  {
    number: "02",
    title: "SDR Agent + Website + AI Receptionist",
    subtitle: "Your front office, fully staffed by AI.",
    description:
      "A virtual SDR that qualifies inbound leads in real time, a high-conversion website built for your specific market, and an AI receptionist that answers calls, books appointments, and routes enquiries 24/7.",
    deliverables: [
      "AI SDR: qualifies leads, answers objections, books discovery calls",
      "Custom website: conversion-optimised, SEO-ready, brand-aligned",
      "AI Receptionist: phone + chat, 24/7, routes to right team member",
      "CRM integration: all interactions logged automatically",
      "Lead scoring model trained on your historical data",
    ],
    timeline: "45 days",
    color: "#C8A855",
  },
  {
    number: "03",
    title: "Full Agent Package + Operator Package",
    subtitle: "End-to-end AI workforce for your business.",
    description:
      "The complete agent deployment - every repetitive, rules-based task in your business is mapped, automated, and monitored. Paired with the Operator Package: AiiA manages the infrastructure so your team focuses on decisions, not administration.",
    deliverables: [
      "Full workflow audit: every manual process identified and mapped",
      "Agent deployment across sales, ops, client success, and admin",
      "Operator dashboard: real-time visibility into every AI workflow",
      "AiiA-managed infrastructure: monitoring, updates, and optimisation",
      "Monthly performance review with ROI reporting",
    ],
    timeline: "60 days",
    color: "#D4A843",
  },
  {
    number: "04",
    title: "Paid Ads Management",
    subtitle: "AI-optimised acquisition at scale.",
    description:
      "AI-assisted paid advertising across Google, Meta, and LinkedIn - continuous creative testing, audience optimisation, and budget allocation managed by a combination of AI automation and expert oversight. Every dollar tracked to pipeline.",
    deliverables: [
      "Multi-platform campaign setup (Google, Meta, LinkedIn)",
      "AI creative testing: 10+ ad variants tested simultaneously",
      "Automated audience segmentation and lookalike modelling",
      "Real-time budget reallocation based on performance signals",
      "Full attribution reporting: ad spend → pipeline → revenue",
    ],
    timeline: "Ongoing",
    color: "#E0B84A",
  },
  {
    number: "05",
    title: "Podcast Management + Social Media Management",
    subtitle: "Thought leadership on autopilot.",
    description:
      "A fully managed content engine: your podcast produced, edited, and distributed, plus a consistent social media presence across LinkedIn, Instagram, and X - all driven by AI-assisted production and a human creative director.",
    deliverables: [
      "Podcast production: recording, editing, show notes, distribution",
      "Episode repurposing: clips, carousels, and written posts from each episode",
      "LinkedIn content calendar: 3-5 posts per week, brand-aligned",
      "Instagram + X management: visual content and engagement",
      "Monthly content performance analytics and strategy review",
    ],
    timeline: "Ongoing",
    color: "#ECC050",
  },
];

const TRACKS = [
  {
    name: "Operator",
    description: "AiiA manages everything. You receive outcomes.",
    example: "Ideal for growth-stage companies ready for full managed AI infrastructure.",
    icon: "/images/icon-efficiency.webp",
    link: "/operator",
  },
  {
    name: "Agent",
    description: "AI tools deployed for your team to operate.",
    example: "Ideal for independent professionals and boutique firms - self-operated AI.",
    icon: "/images/icon-handshake.webp",
    link: "/agentpackage",
  },
  {
    name: "Corporate",
    description: "Modular enterprise rollout, phase by phase.",
    example: "Ideal for growing companies - structured, measurable, scalable.",
    icon: "/images/icon-skyline.webp",
    link: null,
  },
];

export default function CorporatePage() {
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Corporate AI Package | AiiACo - Modular Enterprise AI Rollout"
        description="AiiACo's Corporate Package: a modular, bite-sized AI implementation sequence for enterprise clients. From Cold Email Agent to full Operator infrastructure - deployed in phases, measured by results."
        path="/corporate"
        keywords="corporate AI package, enterprise AI implementation, modular AI rollout, AI automation for business, managed AI infrastructure"
      />
      <div style={{ minHeight: "100vh", background: "#03050A", color: "#d2dceb", fontFamily: FF }}>
        <Navbar />

        {/* Hero */}
        <section style={{ padding: "120px 24px 80px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(184,156,74,0.10)", border: "1px solid rgba(184,156,74,0.25)",
              borderRadius: "20px", padding: "6px 16px", marginBottom: "28px",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#B89C4A",
              textTransform: "uppercase",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#B89C4A", display: "inline-block" }} />
              Corporate Package
            </div>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              AI Infrastructure,{" "}
              <span style={{ color: "#D4A843" }}>Built in Phases.</span>
              <br />Not All at Once.
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(200,215,230,0.60)", maxWidth: "640px", margin: "0 auto 40px", lineHeight: 1.7 }}>
              Most companies fail at AI because they try to implement everything simultaneously.
              The AiiACo Corporate Package deploys your AI infrastructure in five modular phases -
              each one building on the last, each one generating measurable ROI before the next begins.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={scrollToContact}
                style={{
                  background: "linear-gradient(135deg, #B89C4A 0%, #D4A843 50%, #B89C4A 100%)",
                  color: "#03050A", fontWeight: 700, fontSize: "15px",
                  padding: "14px 32px", borderRadius: "10px", border: "none", cursor: "pointer",
                  letterSpacing: "0.02em",
                }}
              >
                Start Phase 1
              </button>
              <CallNowButton variant="outline" size="lg" />
            </div>
          </motion.div>
        </section>

        {/* Three Tracks */}
        <section style={{ padding: "0 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {TRACKS.map((track) => {
              const CardContent = (
                <>
                  {track.name === "Corporate" && (
                    <div style={{
                      position: "absolute", top: "12px", right: "12px",
                      background: "rgba(184,156,74,0.15)", border: "1px solid rgba(184,156,74,0.30)",
                      borderRadius: "10px", padding: "3px 10px",
                      fontSize: "10px", fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em",
                    }}>
                      THIS PAGE
                    </div>
                  )}
                  <img src={track.icon} alt={track.name} style={{ width: "48px", height: "48px", objectFit: "contain", marginBottom: "12px" }} />
                  <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: track.name === "Corporate" ? "#D4A843" : "#d2dceb" }}>
                    {track.name} Track
                  </div>
                  <p style={{ fontSize: "14px", color: "rgba(200,215,230,0.60)", lineHeight: 1.6, margin: "0 0 10px" }}>
                    {track.description}
                  </p>
                  <p style={{ fontSize: "12px", color: "rgba(200,215,230,0.35)", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                    {track.example}
                  </p>
                  {track.link && (
                    <div style={{ marginTop: "14px", fontSize: "13px", fontWeight: 600, color: "#D4A843", display: "flex", alignItems: "center", gap: "6px" }}>
                      Learn more <span style={{ fontSize: "16px" }}>&rarr;</span>
                    </div>
                  )}
                </>
              );

              const cardStyle = {
                background: "rgba(255,255,255,0.03)",
                border: track.name === "Corporate" ? "1px solid rgba(184,156,74,0.40)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px", padding: "28px 24px",
                backdropFilter: "blur(12px)",
                position: "relative" as const,
                overflow: "hidden" as const,
                textDecoration: "none",
                color: "inherit",
                display: "block",
                transition: "border-color 0.2s, transform 0.2s",
              };

              return track.link ? (
                <a key={track.name} href={track.link} style={cardStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,156,74,0.50)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  {CardContent}
                </a>
              ) : (
                <div key={track.name} style={cardStyle}>
                  {CardContent}
                </div>
              );
            })}
          </div>
        </section>

        {/* Phase Sequence */}
        <section style={{ padding: "0 24px 100px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              Five Phases. One Compounding System.
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(200,215,230,0.50)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
              Each phase is self-contained, measurable, and profitable before the next begins.
              You control the pace.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {PHASES.map((phase, idx) => (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: idx % 2 === 0 ? "1fr 2fr" : "2fr 1fr",
                  gap: "0",
                  borderBottom: idx < PHASES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  padding: "48px 0",
                  alignItems: "start",
                }}
              >
                {/* Number + Timeline (left on even, right on odd) */}
                {idx % 2 === 0 && (
                  <div style={{ paddingRight: "40px" }}>
                    <div style={{
                      fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: `1px ${phase.color}`,
                      opacity: 0.4,
                      marginBottom: "8px",
                    }}>
                      {phase.number}
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "rgba(184,156,74,0.08)", border: `1px solid ${phase.color}40`,
                      borderRadius: "8px", padding: "5px 12px",
                      fontSize: "12px", fontWeight: 600, color: phase.color,
                    }}>
                      <img src="/images/icon-trending.webp" alt="" style={{ width: "14px", height: "14px", objectFit: "contain" }} /> {phase.timeline}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div style={{ paddingLeft: idx % 2 === 0 ? "0" : "0", paddingRight: idx % 2 !== 0 ? "40px" : "0" }}>
                  <h3 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", fontWeight: 800, margin: "0 0 6px", color: phase.color }}>
                    {phase.title}
                  </h3>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(200,215,230,0.50)", margin: "0 0 16px", letterSpacing: "0.02em" }}>
                    {phase.subtitle}
                  </p>
                  <p style={{ fontSize: "15px", color: "rgba(200,215,230,0.65)", lineHeight: 1.7, margin: "0 0 20px" }}>
                    {phase.description}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {phase.deliverables.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{
                          width: "5px", height: "5px", borderRadius: "50%",
                          background: phase.color, flexShrink: 0, marginTop: "7px",
                        }} />
                        <span style={{ fontSize: "13.5px", color: "rgba(200,215,230,0.70)", lineHeight: 1.5 }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Number + Timeline (right on odd) */}
                {idx % 2 !== 0 && (
                  <div style={{ paddingLeft: "40px", textAlign: "right" }}>
                    <div style={{
                      fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: `1px ${phase.color}`,
                      opacity: 0.4,
                      marginBottom: "8px",
                    }}>
                      {phase.number}
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "rgba(184,156,74,0.08)", border: `1px solid ${phase.color}40`,
                      borderRadius: "8px", padding: "5px 12px",
                      fontSize: "12px", fontWeight: 600, color: phase.color,
                    }}>
                      <img src="/images/icon-trending.webp" alt="" style={{ width: "14px", height: "14px", objectFit: "contain" }} /> {phase.timeline}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Modular */}
        <section style={{
          padding: "80px 24px",
          background: "rgba(184,156,74,0.04)",
          borderTop: "1px solid rgba(184,156,74,0.12)",
          borderBottom: "1px solid rgba(184,156,74,0.12)",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
              Why Modular Beats All-at-Once
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginTop: "40px" }}>
              {[
                { stat: "3×", label: "Higher adoption rate", sub: "vs. full-suite implementations" },
                { stat: "30d", label: "Time to first ROI", sub: "Phase 1 pays for itself" },
                { stat: "0", label: "Operational disruption", sub: "Each phase runs alongside existing ops" },
                { stat: "100%", label: "Ownership", sub: "You own every system we build" },
              ].map((item) => (
                <div key={item.stat} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px", padding: "28px 20px",
                }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#D4A843", lineHeight: 1, marginBottom: "8px" }}>
                    {item.stat}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#d2dceb", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ fontSize: "12px", color: "rgba(200,215,230,0.40)" }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section ref={contactRef} style={{ padding: "100px 24px", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              Start with Phase 1.
              <br />
              <span style={{ color: "#D4A843" }}>See results in 30 days.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(200,215,230,0.55)", margin: "0 0 36px", lineHeight: 1.7 }}>
              No long-term commitment required for Phase 1. If the Cold Email Agent doesn't generate measurable pipeline within 30 days, you don't continue.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://calendly.com/aiiaco"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #B89C4A 0%, #D4A843 50%, #B89C4A 100%)",
                  color: "#03050A", fontWeight: 700, fontSize: "15px",
                  padding: "14px 32px", borderRadius: "10px", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  letterSpacing: "0.02em",
                }}
              >
                Book a Strategy Call
              </a>
              <CallNowButton variant="outline" size="lg" />
            </div>
            <p style={{ fontSize: "12px", color: "rgba(200,215,230,0.30)", marginTop: "20px" }}>
              AI answers 24/7 · Routes you to the right program · No sales pressure
            </p>
          </motion.div>
        </section>

        <RelatedServices current="/corporate" max={4} />
      <Footer />
      </div>
    </>
  );
}
