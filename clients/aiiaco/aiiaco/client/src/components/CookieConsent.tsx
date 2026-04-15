import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "aiiaco_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="cookie-banner"
        >
          <p className="cookie-text">
            We use site data only to provide the right diagnostic and path
            forward.{" "}
            <a href="/privacy" className="cookie-link">
              Privacy Policy
            </a>
          </p>
          <button onClick={accept} className="cookie-accept">
            Accept
          </button>

          <style>{`
            .cookie-banner {
              position: fixed;
              bottom: 16px;
              left: 16px;
              right: 16px;
              z-index: 9999;
              max-width: 460px;
              margin: 0 auto;
              background: rgba(12, 14, 20, 0.92);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(212, 168, 67, 0.15);
              border-radius: 14px;
              padding: 14px 16px;
              display: flex;
              align-items: center;
              gap: 12px;
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
              box-shadow: 0 8px 32px rgba(0,0,0,0.5);
              box-sizing: border-box;
            }
            .cookie-text {
              flex: 1;
              margin: 0;
              font-size: 13px;
              line-height: 1.45;
              color: rgba(200, 215, 230, 0.75);
              min-width: 0;
            }
            .cookie-link {
              color: rgba(212, 168, 67, 0.85);
              text-decoration: underline;
              text-underline-offset: 2px;
            }
            .cookie-accept {
              font-size: 12px;
              font-weight: 600;
              color: #03050A;
              background: var(--gold-bright, #D4A843);
              border: none;
              border-radius: 8px;
              padding: 7px 16px;
              cursor: pointer;
              flex-shrink: 0;
              transition: opacity 0.15s;
              white-space: nowrap;
            }
            .cookie-accept:hover {
              opacity: 0.85;
            }
            @media (max-width: 420px) {
              .cookie-banner {
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
                padding: 14px;
                bottom: 12px;
                left: 12px;
                right: 12px;
              }
              .cookie-text {
                font-size: 12px;
                text-align: center;
              }
              .cookie-accept {
                width: 100%;
                padding: 10px 16px;
                font-size: 13px;
                text-align: center;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
