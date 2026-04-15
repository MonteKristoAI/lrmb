/*
 * AiiACo Case Studies Section - Liquid Glass Bio-Organic Design
 * Filterable by sector, institutional motion, no backend required
 * Mobile: single-column cards, responsive CTA
 */
import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import CaseStudyCard from "./CaseStudyCard";
import { caseStudies } from "./caseStudies.data";

const sectors = ["All", ...Array.from(new Set(caseStudies.map((c) => c.sector)))];

export default function CaseStudiesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref as any, { margin: "-15% 0px -15% 0px", once: true });
  const [sector, setSector] = useState("All");

  const filtered = useMemo(() => {
    if (sector === "All") return caseStudies;
    return caseStudies.filter((c) => c.sector === sector);
  }, [sector]);

  const container = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
    }),
    []
  );

  const item = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
    }),
    []
  );

  return (
    <section
      ref={ref as any}
      id="case-studies"
      className="mobile-section"
      style={{ position: "relative", padding: "120px 0", background: "#03050A", overflow: "hidden" }}
    >
      <style>{`
        .cs-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(480px, 100%), 1fr));
          gap: 14px;
          margin-bottom: 32px;
        }
        .cs-cta-inner {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .cs-cards-grid {
            grid-template-columns: 1fr;
          }
          .cs-cta-inner {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .cs-cta-inner .btn-gold {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 600px at 80% 40%, rgba(184,156,74,0.04) 0%, transparent 55%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ maxWidth: "640px", marginBottom: "48px", display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <motion.div variants={item} className="section-pill" style={{ width: "fit-content" }}>
            <span className="dot" />
            Case Studies
          </motion.div>
          <motion.h2 variants={item} className="section-headline shimmer-headline" style={{ marginBottom: 0 }}>
            Anonymized. <span className="accent">Verifiable in Structure.</span>
          </motion.h2>
          <div className="gold-divider" />
          <motion.p variants={item} className="section-subhead" style={{ margin: 0 }}>
            These patterns show how upgrades are engineered: constraints, governance, deployment approach, and measured outcomes.
            No names. No theatre. Just operating model improvements.
          </motion.p>

          {/* Sector filter */}
          <motion.div variants={item} style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                style={{
                  borderRadius: "999px",
                  padding: "8px 16px",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border: s === sector
                    ? "1px solid rgba(184,156,74,0.45)"
                    : "1px solid rgba(255,255,255,0.12)",
                  background: s === sector
                    ? "rgba(184,156,74,0.12)"
                    : "rgba(255,255,255,0.04)",
                  color: s === sector
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(200,215,230,0.55)",
                }}
                onMouseEnter={(e) => {
                  if (s !== sector) e.currentTarget.style.color = "rgba(255,255,255,0.80)";
                }}
                onMouseLeave={(e) => {
                  if (s !== sector) e.currentTarget.style.color = "rgba(200,215,230,0.55)";
                }}
              >
                {s}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Case study cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="cs-cards-grid"
        >
          {filtered.map((cs) => (
            <motion.div key={cs.id} variants={item}>
              <CaseStudyCard cs={cs} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="glass-card" style={{ padding: "28px 32px" }}>
          <div className="cs-cta-inner">
            <div>
              <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.90)", marginBottom: "6px" }}>
                Want outcomes tied to your exact constraints?
              </div>
              <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", color: "rgba(200,215,230,0.60)", lineHeight: 1.5 }}>
                Submit a structured intake. We'll map your bottlenecks, governance needs, and upgrade sequence.
              </div>
            </div>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-gold"
              style={{ whiteSpace: "nowrap", fontSize: "14px", padding: "13px 22px" }}
            >
              Start Your Diagnostic
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
