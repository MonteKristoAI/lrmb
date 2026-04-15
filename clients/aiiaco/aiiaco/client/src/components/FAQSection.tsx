/**
 * AiiACo FAQ Section - reusable accordion-style FAQ
 * Design: Liquid Glass Bio-Organic - deep void black, gold accents
 * Used on: Home, /ai-integration, /method, /ai-implementation-services, /ai-automation-for-business
 * Each FAQ item maps to a schema.org Question in StructuredData.tsx
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items: FAQItem[];
  headline?: string;
  subheadline?: string;
  eyebrow?: string;
};

function FAQRow({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "20px",
          padding: "22px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{
          fontFamily: FFD,
          fontSize: "clamp(15px, 1.4vw, 17px)",
          fontWeight: 600,
          color: open ? "rgba(212,168,67,0.95)" : "rgba(255,255,255,0.88)",
          lineHeight: 1.45,
          transition: "color 0.2s",
          flex: 1,
        }}>
          {item.question}
        </span>
        <span style={{
          flexShrink: 0,
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: `1px solid ${open ? "rgba(212,168,67,0.45)" : "rgba(255,255,255,0.15)"}`,
          color: open ? "rgba(212,168,67,0.90)" : "rgba(200,215,230,0.55)",
          fontSize: "16px",
          lineHeight: 1,
          transition: "all 0.2s",
          transform: open ? "rotate(45deg)" : "none",
          marginTop: "2px",
        }}>
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              fontFamily: FF,
              fontSize: "clamp(14px, 1.3vw, 15px)",
              lineHeight: 1.75,
              color: "rgba(200,215,230,0.72)",
              margin: "0 0 22px",
              paddingRight: "40px",
            }}>
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection({ items, headline, subheadline, eyebrow }: FAQSectionProps) {
  return (
    <section
      style={{
        padding: "clamp(60px, 8vw, 100px) 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container" style={{ maxWidth: "860px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "48px" }}
        >
          {eyebrow && (
            <p style={{
              fontFamily: FF,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(184,156,74,0.60)",
              marginBottom: "14px",
            }}>
              {eyebrow}
            </p>
          )}
          <h2 style={{
            fontFamily: FFD,
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.94)",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}>
            {headline ?? "Frequently Asked Questions"}
          </h2>
          {subheadline && (
            <p style={{
              fontFamily: FF,
              fontSize: "clamp(14px, 1.4vw, 16px)",
              lineHeight: 1.65,
              color: "rgba(200,215,230,0.60)",
              margin: 0,
              maxWidth: "60ch",
            }}>
              {subheadline}
            </p>
          )}
        </motion.div>

        <div>
          {items.map((item, i) => (
            <FAQRow key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
