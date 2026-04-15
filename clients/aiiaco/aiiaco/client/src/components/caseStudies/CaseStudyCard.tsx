/*
 * AiiACo Case Study Card - Liquid Glass Bio-Organic Design
 * Anonymized. Verifiable in structure.
 * Responsive: stacks Approach/Outcomes on mobile
 */
import { motion } from "framer-motion";
import type { CaseStudy } from "./caseStudies.data";

export default function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="glass-card cs-card"
      style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "0" }}
    >
      <style>{`
        .cs-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        @media (max-width: 640px) {
          .cs-card {
            padding: 20px !important;
          }
          .cs-card-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .cs-card-tags {
            gap: 6px !important;
          }
          .cs-card-tags .cs-timeline {
            margin-left: 0 !important;
            width: 100%;
            margin-top: 4px;
          }
        }
      `}</style>

      {/* Tags + timeline */}
      <div className="cs-card-tags" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <span style={{
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          padding: "4px 12px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: "rgba(200,215,230,0.70)",
        }}>
          {cs.sector}
        </span>
        <span style={{
          borderRadius: "999px",
          border: "1px solid rgba(184,156,74,0.28)",
          background: "rgba(184,156,74,0.08)",
          padding: "4px 12px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: "rgba(210,220,235,0.80)",
        }}>
          {cs.type}
        </span>
        <span className="cs-timeline" style={{
          marginLeft: "auto",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: "rgba(184,156,74,0.65)",
        }}>
          {cs.timeline}
        </span>
      </div>

      {/* Situation */}
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif", fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.90)", marginBottom: "6px", letterSpacing: "-0.1px" }}>
        Situation
      </div>
      <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", lineHeight: 1.6, color: "rgba(200,215,230,0.68)", margin: "0 0 20px", overflowWrap: "break-word", wordBreak: "break-word" }}>
        {cs.situation}
      </p>

      {/* Approach + Outcomes - responsive grid */}
      <div className="cs-card-grid">
        <div>
          <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(200,215,230,0.45)", marginBottom: "10px" }}>
            Approach
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {cs.approach.map((a) => (
              <li key={a} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "rgba(200,215,230,0.68)", lineHeight: 1.45, display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "rgba(184,156,74,0.70)", fontWeight: 900, flexShrink: 0, marginTop: "1px" }}>•</span>
                <span style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(200,215,230,0.45)", marginBottom: "10px" }}>
            Outcomes
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {cs.outcomes.map((m) => (
              <li key={m.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12.5px", color: "rgba(200,215,230,0.65)", overflowWrap: "break-word", wordBreak: "break-word" }}>{m.label}</span>
                  <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", fontWeight: 700, color: "rgba(210,220,235,0.90)", whiteSpace: "nowrap" as const }}>{m.value}</span>
                </div>
              </li>
            ))}
          </ul>
          {cs.outcomes.some((o) => o.note) && (
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11.5px", color: "rgba(200,215,230,0.40)", margin: "8px 0 0", lineHeight: 1.4 }}>
              Notes vary by workflow and baseline maturity.
            </p>
          )}
        </div>
      </div>

      {/* Governance */}
      <div>
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(200,215,230,0.40)", marginBottom: "8px" }}>
          Governance
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {cs.governance.map((g) => (
            <span
              key={g}
              style={{
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                padding: "3px 10px",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "rgba(200,215,230,0.60)",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
