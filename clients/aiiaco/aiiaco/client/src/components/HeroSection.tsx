/*
 * AiiACo Hero Section - Liquid Glass Bio-Organic Design
 * Full-bleed liquid glass background, split layout, glass KPI cards
 * Mobile: single column, KPIs shown below hero text
 */
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import OrCallDirect from "@/components/OrCallDirect";

// Animated counter hook - counts from 0 to target over duration ms
function useCountUp(target: number, duration: number = 1800, delay: number = 0) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

function KpiCard({ kpi, delay }: { kpi: { num: string; label: string; sub: string }; delay: number }) {
  // Parse the numeric value and suffix from strings like "20+", "100%", "0"
  const match = kpi.num.match(/^(\d+)([+%]?)$/);
  const targetNum = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const count = useCountUp(targetNum, 1600, delay);
  const displayNum = targetNum === 0 ? "0" : `${count}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      className="glass-card"
      style={{ padding: "20px 24px" }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
        <span className="stat-number">{displayNum}</span>
        <span className="stat-label" style={{ textAlign: "right" }}>{kpi.label}</span>
      </div>
      <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "rgba(200,215,230,0.50)", margin: "8px 0 0", lineHeight: 1.4 }}>{kpi.sub}</p>
    </motion.div>
  );
}

const HERO_BG = "/images/hero-bg.webp";

const kpis = [
  { num: "4", label: "Core Sectors", sub: "Real Estate, Mortgage, Commercial Property & Management Consulting." },
  { num: "100%", label: "Managed Execution", sub: "We activate the systems you already have. You run the business." },
  { num: "0", label: "Coordination Drag", sub: "Outcomes delivered without dumping complexity on your team." },
];

const points = [
  "Fix the workflows that slow down operations",
  "Reactivate past client databases and CRM systems",
  "Automate outreach, follow-up, and lead generation",
  "Create real-time visibility for leadership and teams",
];

export default function HeroSection({ onOpenQualifier }: { onOpenQualifier?: () => void } = {}) {
  const scrollToContact = () => {
    if (onOpenQualifier) {
      onOpenQualifier();
    } else {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToPlatform = () =>
    document.querySelector("#platform")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#03050A",
      }}
    >
      {/* Scoped responsive styles */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 32px;
          align-items: stretch;
        }
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .hero-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .hero-section-inner {
          padding-top: 80px;
          padding-bottom: 80px;
        }
        /* Mobile KPI strip: horizontal scroll */
        .hero-mobile-kpis {
          display: none;
        }
        @media (max-width: 1023px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .hero-right {
            display: none;
          }
          .hero-mobile-kpis {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 20px;
          }
          .hero-section-inner {
            padding-top: 40px;
            padding-bottom: 60px;
          }
        }
        @media (max-width: 640px) {
          .hero-mobile-kpis {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .hero-cta-row {
            flex-direction: column;
          }
          .hero-cta-row .btn-gold,
          .hero-cta-row .btn-glass {
            width: 100%;
            justify-content: center;
            font-size: 14px;
            padding: 14px 24px;
          }
        }
      `}</style>

      {/* Liquid glass background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          opacity: 0.22,
        }}
      />
      {/* Directional fade overlays */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(90deg, rgba(3,5,10,0.88) 0%, rgba(3,5,10,0.60) 50%, rgba(3,5,10,0.20) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(700px 500px at 8% 75%, rgba(184,156,74,0.07) 0%, transparent 60%)" }} />
      {/* Animated liquid glass orbs - rendered above overlays */}
      <div className="glass-orb glass-orb-1" style={{ top: "8%", left: "4%", zIndex: 1 }} />
      <div className="glass-orb glass-orb-2" style={{ top: "50%", right: "6%", zIndex: 1 }} />
      <div className="glass-orb glass-orb-3" style={{ bottom: "12%", left: "38%", zIndex: 1 }} />

      <div className="container hero-section-inner" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-grid">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div className="section-pill w-fit">
              <span className="dot" />
              EBITDA Efficiency Partner - Operational Clarity. Real Results.
            </div>

            <h1 className="display-headline">
              Remove Operational Friction.<br />
              <span className="gold-line">Run Your Business Faster.</span>
            </h1>
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(12px, 1.2vw, 15px)", fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(184,156,74,0.70)", margin: "-8px 0 0" }}>
              Most businesses don't have a technology problem. They have an operational flow problem.
            </p>

            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(14px, 1.5vw, 18px)", lineHeight: 1.65, color: "rgba(200,215,230,0.82)", maxWidth: "52ch", margin: 0 }}>
              AiiA helps growing companies simplify workflows, activate dormant databases, and create clear operational visibility so leadership can move faster and teams execute without coordination drag.
            </p>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {points.map((p) => (
                <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "14.5px", fontWeight: 600, color: "rgba(210,220,235,0.85)" }}>
                  <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(184,156,74,0.12)", border: "1px solid rgba(184,156,74,0.32)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", fontSize: "10px", color: "#D4A843", fontWeight: 900 }}>✓</span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="hero-cta-row">
              <button onClick={scrollToContact} className="btn-gold" style={{ fontSize: "15px", padding: "14px 30px" }}>
                Book a Strategy Call
              </button>
              <button onClick={() => document.querySelector("#method")?.scrollIntoView({ behavior: "smooth" })} className="btn-glass" style={{ fontSize: "15px", padding: "14px 24px" }}>
                See How It Works
              </button>
            </div>
            <OrCallDirect center={false} marginTop="6px" />

            {/* Mobile KPIs - shown below CTAs on tablet/mobile */}
            <div className="hero-mobile-kpis">
              {kpis.map((kpi, i) => (
                <KpiCard key={kpi.label} kpi={kpi} delay={350 + i * 100} />
              ))}
            </div>

            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12.5px", color: "rgba(200,215,230,0.50)", margin: 0, letterSpacing: "0.1px" }}>
                We streamline how work moves through the business and activate the systems you already have.
              </p>
              <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", fontStyle: "italic", color: "rgba(200,215,230,0.38)", margin: 0 }}>
                CRM, email, outreach, and operational workflows - so your company runs faster, cleaner, with less manual coordination.
              </p>
            </div>
          </motion.div>

          {/* Right: KPI + how it works - desktop only */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hero-right"
          >
            {kpis.map((kpi, i) => (
              <KpiCard key={kpi.label} kpi={kpi} delay={350 + i * 100} />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="glass-card-gold"
              style={{ padding: "24px", flex: 1 }}
            >
              <div className="section-pill" style={{ marginBottom: "14px", width: "fit-content" }}>
                <span className="dot" />
                How It Works
              </div>
              <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.3px" }}>
                One engagement.<br />
                <span style={{ color: "#D4A843" }}>Complete AI infrastructure.</span>
              </p>
              {[
                { n: "01", t: "Business Intelligence Audit", s: "Architecture, goals, bottlenecks, competition." },
                { n: "02", t: "We build the blueprint", s: "Custom AI integration plan with ROI targets." },
                { n: "03", t: "We deploy and manage", s: "Full execution - you receive outcomes, not dashboards." },
              ].map((step) => (
                <div key={step.n} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div className="phase-badge" style={{ width: "30px", height: "30px", fontSize: "10px", borderRadius: "8px", flexShrink: 0 }}>{step.n}</div>
                  <div>
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontWeight: 700, fontSize: "13px", color: "rgba(255,255,255,0.90)", margin: "0 0 2px" }}>{step.t}</p>
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "rgba(200,215,230,0.62)", margin: 0, lineHeight: 1.4 }}>{step.s}</p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "12px", padding: "12px 14px", borderRadius: "10px", background: "rgba(184,156,74,0.07)", border: "1px solid rgba(184,156,74,0.18)" }}>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "rgba(210,220,235,0.78)", margin: 0, lineHeight: 1.5 }}>
                  Performance-based models available - we earn more when you hit your targets.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to bottom, transparent, #03050A)", pointerEvents: "none" }} />
    </section>
  );
}
