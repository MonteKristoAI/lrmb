/*
 * OperationalLeaks - Three Operational Leaks That Quietly Kill Profit
 * Based on the AiiA Operator Brief
 * Mobile: stacked layout, no grid columns for icon+content
 */
import { motion } from "framer-motion";

const leaks = [
  {
    num: "01",
    title: "The Field Workflow Bottleneck",
    problem: "Work orders stall because systems are not built for the people doing the work.",
    detail:
      "Field teams capture information on their phones, admins re-enter it later, and managers chase updates. The result is slow execution and unnecessary coordination drag.",
    fix: "Streamlined mobile-first workflows that eliminate re-entry and give managers real-time visibility.",
    icon: "/images/icon-workflow-transparent.webp",
  },
  {
    num: "02",
    title: "The Payroll Efficiency Trap",
    problem: "Payroll grows not because teams are too large, but because workflows require too much coordination.",
    detail:
      "Multiple admins manage tasks, employees follow up instead of executing, and leadership senses inefficiency without clear visibility into where time is actually going.",
    fix: "Automated coordination that removes manual handoffs and gives leadership a clear operational picture.",
    icon: "/images/icon-efficiency-transparent.webp",
  },
  {
    num: "03",
    title: "The Numbers We Don't Trust Problem",
    problem: "Companies generate data, but operational numbers often conflict across systems.",
    detail:
      "When leadership cannot trust the numbers, decisions slow down, friction increases, and the business runs on gut feel instead of clarity.",
    fix: "A single source of operational truth - synced, accurate, and available in real time.",
    icon: "/images/icon-data-transparent.webp",
  },
];

export default function OperationalLeaks({ onOpenQualifier }: { onOpenQualifier?: (source: string) => void } = {}) {
  return (
    <section
      id="operational-leaks"
      className="mobile-section"
      style={{
        position: "relative",
        padding: "100px 0",
        background: "#03050A",
        overflow: "hidden",
      }}
    >
      <style>{`
        .leak-card-inner {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: flex-start;
        }
        .leak-cta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .leak-card-inner {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .leak-icon-col {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
          }
          .leak-cta-row {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(700px 500px at 80% 40%, rgba(184,156,74,0.035) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "640px", marginBottom: "64px" }}
        >
          <div className="section-pill" style={{ marginBottom: "20px", width: "fit-content" }}>
            <span className="dot" />
            Operational Diagnostics
          </div>
          <h2 className="section-headline shimmer-headline" style={{ marginBottom: "20px" }}>
            Three Leaks That{" "}
            <span className="accent">Quietly Kill Profit.</span>
          </h2>
          <div className="gold-divider" style={{ marginBottom: "20px" }} />
          <p className="section-subhead">
            As companies grow, complexity increases faster than the systems supporting them. These three patterns quietly reduce efficiency and margins - and most leadership teams feel them without being able to name them.
          </p>
        </motion.div>

        {/* Leak cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {leaks.map((leak, i) => (
            <motion.div
              key={leak.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="glass-card"
              style={{ padding: "28px" }}
            >
              <div className="leak-card-inner">
                {/* Icon + Number badge */}
                <div className="leak-icon-col" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", paddingTop: "4px" }}>
                  <div style={{ width: "48px", height: "48px" }}>
                    <img
                      src={leak.icon}
                      alt={leak.title}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <div
                    className="phase-badge"
                    style={{
                      width: "36px",
                      height: "36px",
                      fontSize: "11px",
                      borderRadius: "10px",
                    }}
                  >
                    {leak.num}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "clamp(18px, 1.8vw, 22px)",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.96)",
                      margin: "0 0 8px",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {leak.title}
                  </h3>
                  <p
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "rgba(210,220,235,0.85)",
                      margin: "0 0 10px",
                      lineHeight: 1.5,
                    }}
                  >
                    {leak.problem}
                  </p>
                  <p
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "rgba(200,215,230,0.60)",
                      margin: "0 0 16px",
                      maxWidth: "72ch",
                    }}
                  >
                    {leak.detail}
                  </p>
                  {/* Fix pill + CTA */}
                  <div className="leak-cta-row">
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        background: "rgba(184,156,74,0.07)",
                        border: "1px solid rgba(184,156,74,0.20)",
                        borderRadius: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#D4A843",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "rgba(212,168,67,0.90)",
                          lineHeight: 1.4,
                        }}
                      >
                        {leak.fix}
                      </span>
                    </div>
                    {/* CTA button */}
                    <button
                      onClick={() => {
                        if (onOpenQualifier) {
                          onOpenQualifier(`Operational Leaks - ${leak.title}`);
                        } else {
                          const el = document.getElementById("contact");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 18px",
                        background: "linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(184,140,50,0.12) 100%)",
                        border: "1px solid rgba(212,168,67,0.45)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#D4A843",
                        letterSpacing: "0.2px",
                        transition: "all 0.2s ease",
                        minHeight: "44px",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "linear-gradient(135deg, rgba(212,168,67,0.28) 0%, rgba(184,140,50,0.22) 100%)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,67,0.70)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(184,140,50,0.12) 100%)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,67,0.45)";
                      }}
                    >
                      <span>→</span>
                      Does this sound familiar? Let's fix it.
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
