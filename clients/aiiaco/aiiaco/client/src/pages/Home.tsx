/*
 * AiiACo - Home Page
 * Design: Liquid Glass Bio-Organic - deep void black, liquid glass, gold electricity
 * Section order: Hero → Platform → Method → AfterUpgrade → Results → Industries → CaseStudies → Models → Principles → Contact
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PlatformSection from "@/components/PlatformSection";
import MethodSection from "@/components/MethodSection";
import AfterUpgradeSection from "@/components/AfterUpgradeSection";
import ResultsSection from "@/components/ResultsSection";
import Industries from "@/components/Industries";
import CaseStudiesSection from "@/components/caseStudies/CaseStudiesSection";
import EngagementModels from "@/components/EngagementModels";
import BuiltForCorporateAge from "@/components/BuiltForCorporateAge";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEO from "@/seo/SEO";
import CredibilityBlock from "@/components/CredibilityBlock";
import OperationalLeaks from "@/components/OperationalLeaks";

const SF: React.CSSProperties = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
};

export default function Home() {
  const [qualifierOpen, setQualifierOpen] = useState(false);
  const [qualifierSource, setQualifierSource] = useState("Direct");

  const openQualifier = (source: string) => {
    setQualifierSource(source);
    setQualifierOpen(true);
  };

  const closeQualifier = () => setQualifierOpen(false);

  // Close on Escape key
  useEffect(() => {
    if (!qualifierOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQualifier();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [qualifierOpen]);

  return (
    <>
      {/* title/description resolve from PAGE_META["/"] in seo.config.ts - no manual override */}
      <SEO path="/" />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A", overflowX: "hidden" }}>
        <Navbar onOpenQualifier={() => openQualifier("Navbar - Request Upgrade")} />
        <main className="flex-1">
          <HeroSection onOpenQualifier={() => openQualifier("Hero CTA")} />
          <CredibilityBlock />
          <OperationalLeaks onOpenQualifier={openQualifier} />
          <PlatformSection />
          <MethodSection />
          <AfterUpgradeSection />
          <ResultsSection />
          <Industries />
          <CaseStudiesSection />
          <EngagementModels />
          <BuiltForCorporateAge />
          <ContactSection leadSource="Contact Section" />
        </main>
        <Footer />
      </div>

      {/* Qualifier Modal - opened from Operational Leaks CTAs and other entry points */}
      <AnimatePresence>
        {qualifierOpen && (
          <motion.div
            key="qualifier-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "rgba(3,5,10,0.92)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeQualifier();
            }}
          >
            {/* Top gold line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(184,156,74,0.6), transparent)" }} />

            {/* Close button */}
            <button
              onClick={closeQualifier}
              style={{
                position: "absolute", top: "24px", right: "24px",
                background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)",
                borderRadius: "8px", color: "rgba(184,156,74,0.80)",
                ...SF, fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em",
                padding: "8px 16px", cursor: "pointer", textTransform: "uppercase",
              }}
            >
              Close
            </button>

            {/* Qualifier form in a contained card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              style={{
                width: "100%",
                maxWidth: "1100px",
                maxHeight: "calc(100vh - 80px)",
                overflowY: "auto",
                background: "rgba(6,11,20,0.98)",
                border: "1px solid rgba(184,156,74,0.18)",
                borderRadius: "20px",
                scrollbarWidth: "none",
              }}
            >
              <ContactSection leadSource={qualifierSource} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
