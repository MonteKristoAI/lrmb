/*
 * CredibilityBlock - 3-line "Companies come to AiiA when..." section
 * Positioned directly below the Hero, above Platform
 */
import { motion } from "framer-motion";

const triggers = [
  "Operations feel slower than they should",
  "Teams spend too much time coordinating work",
  "Past client databases and CRM systems are underutilized",
];

export default function CredibilityBlock() {
  return (
    <section
      style={{
        background: "#03050A",
        padding: "0 0 64px",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          style={{
            borderTop: "1px solid rgba(184,156,74,0.15)",
            borderBottom: "1px solid rgba(184,156,74,0.15)",
            padding: "32px 0",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <p
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(13px, 1.1vw, 14px)",
              fontWeight: 700,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              color: "rgba(184,156,74,0.65)",
              margin: 0,
            }}
          >
            Companies come to AiiA when
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
              gap: "16px",
            }}
          >
            {triggers.map((trigger, i) => (
              <motion.div
                key={trigger}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#D4A843",
                    flexShrink: 0,
                    marginTop: "7px",
                  }}
                />
                <p
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(14px, 1.3vw, 16px)",
                    fontWeight: 500,
                    color: "rgba(210,220,235,0.80)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {trigger}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
