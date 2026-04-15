/*
 * AiiACo Results Section - Liquid Glass Bio-Organic Design
 * Count-up KPIs on scroll, outcome cards, institutional motion only
 * Mobile: single-column grids, stacked CTA
 */
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type KPI = {
  label: string;
  value: number;
  suffix?: string;
  sub: string;
};

type OutcomeCard = {
  title: string;
  body: string;
};

const kpis: KPI[] = [
  {
    label: "Cycle Time Reduction",
    value: 70,
    suffix: "%",
    sub: "Typical range depends on workflow complexity and integration depth.",
  },
  {
    label: "Capacity Increase",
    value: 3,
    suffix: "x",
    sub: "More throughput without proportional headcount growth.",
  },
  {
    label: "Automation Coverage",
    value: 60,
    suffix: "%",
    sub: "Repetitive operations automated with governance and quality controls.",
  },
  {
    label: "Reporting Coherence",
    value: 1,
    suffix: "→AI",
    sub: "From fragmented dashboards to a unified KPI framework.",
  },
];

const outcomes: OutcomeCard[] = [
  {
    title: "Processing Acceleration",
    body: "Reduced operational cycle times by 30-70% depending on workflow complexity and integration depth.",
  },
  {
    title: "Headcount Leverage",
    body: "Increased workload handling capacity without proportional increases in internal staffing.",
  },
  {
    title: "Support Automation",
    body: "Automated repetitive customer interactions while improving response consistency and auditability.",
  },
  {
    title: "Revenue Optimization",
    body: "Improved lead routing, qualification, and conversion tracking through structured automation and decision loops.",
  },
  {
    title: "Operational Visibility",
    body: "Replaced fragmented reporting with unified KPI frameworks and automated performance dashboards.",
  },
  {
    title: "Friction Reduction",
    body: "Eliminated manual bottlenecks in onboarding, documentation, internal approvals, and workflow orchestration.",
  },
];

function useCountUp(target: number, start: number, enabled: boolean, durationMs = 900) {
  const [val, setVal] = useState(target);

  useEffect(() => {
    if (!enabled) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setVal(target);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const from = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (target - from) * eased;
      setVal(next);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, start, target, durationMs]);

  return val;
}

function formatValue(value: number, suffix?: string) {
  const rounded = Math.round(value);
  if (!suffix) return String(rounded);
  if (suffix === "→AI") return `0→AI`;
  return `${rounded}${suffix}`;
}

function KpiCard({
  kpi,
  inView,
  variants,
  index,
}: {
  kpi: KPI;
  inView: boolean;
  variants: any;
  index: number;
}) {
  const val = useCountUp(kpi.value, kpi.value, inView, 850 + index * 90);

  return (
    <motion.div variants={variants} className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(200,215,230,0.55)" }}>
          {kpi.label}
        </div>
        <div className="stat-number" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>
          {kpi.suffix === "→AI" ? "0→AI" : formatValue(val, kpi.suffix)}
        </div>
      </div>
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", lineHeight: 1.55, color: "rgba(200,215,230,0.60)", margin: "10px 0 14px" }}>
        {kpi.sub}
      </div>
      <div style={{ height: "2px", width: "100%", overflow: "hidden", borderRadius: "999px", background: "rgba(255,255,255,0.07)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 0.9 + index * 0.12, ease: "easeOut" }}
          style={{ height: "100%", background: "rgba(184,156,74,0.50)", borderRadius: "999px" }}
        />
      </div>
    </motion.div>
  );
}

export default function ResultsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef as any, { margin: "-15% 0px -15% 0px", once: true });

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
      ref={sectionRef as any}
      id="results"
      className="mobile-section"
      style={{ position: "relative", padding: "120px 0", background: "#060B14", overflow: "hidden" }}
    >
      <style>{`
        .results-bottom-cta {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .results-bottom-cta {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .results-bottom-cta .btn-gold {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 600px at 20% 60%, rgba(184,156,74,0.04) 0%, transparent 55%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ maxWidth: "640px", marginBottom: "64px", display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <motion.div variants={item} className="section-pill" style={{ width: "fit-content" }}>
            <span className="dot" />
            Managed AI Integration Results
          </motion.div>
          <motion.h2 variants={item} className="section-headline shimmer-headline" style={{ marginBottom: 0 }}>
            Enterprise AI Integration Outcomes. <span className="accent">Measured. Verified. Repeatable.</span>
          </motion.h2>
          <div className="gold-divider" />
          <motion.p variants={item} className="section-subhead" style={{ margin: 0 }}>
            AiiACo does not rely on brand theatre or founder credentials. Every engagement is measured against defined KPIs from day one - no vanity metrics, no narrative substitutes.
          </motion.p>
          <motion.p variants={item} className="section-subhead" style={{ margin: 0 }}>
            The outcomes of enterprise AI integration are consistent across sectors: reduced operational drag, increased throughput leverage, and compounding efficiency gains that accelerate as AI automation matures inside the business.
          </motion.p>
        </motion.div>

        {/* KPI Reveal */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: "14px", marginBottom: "14px" }}
        >
          {kpis.map((k, idx) => (
            <KpiCard key={k.label} kpi={k} inView={inView} variants={item} index={idx} />
          ))}
        </motion.div>

        {/* Outcome grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "14px", marginBottom: "32px" }}
        >
          {outcomes.map((o) => (
            <motion.div
              key={o.title}
              variants={item}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="glass-card"
              style={{ padding: "22px" }}
            >
              <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", fontWeight: 700, color: "rgba(255,255,255,0.90)", marginBottom: "8px" }}>
                {o.title}
              </div>
              <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", lineHeight: 1.6, color: "rgba(200,215,230,0.65)" }}>
                {o.body}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
          className="glass-card-gold"
          style={{ padding: "32px 36px" }}
        >
          <div className="results-bottom-cta">
            <div>
              <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, color: "rgba(255,255,255,0.96)", marginBottom: "8px", letterSpacing: "-0.2px" }}>
                Results are not promised. They are engineered.
              </div>
              <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", color: "rgba(200,215,230,0.65)", lineHeight: 1.55 }}>
                If you want marketing claims, the internet is full of them. If you want an upgraded operating model, request the plan.
              </div>
            </div>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-gold"
              style={{ whiteSpace: "nowrap", fontSize: "14px", padding: "13px 24px" }}
            >
              See Your Upgrade Plan
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
