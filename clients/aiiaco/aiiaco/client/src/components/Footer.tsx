/*
 * AiiACo Footer - Liquid Glass Bio-Organic Design
 * Mobile: 2-column grid for links, brand section full-width
 */

const linkStyle = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", fontWeight: 600,
  color: "rgba(200,215,230,0.50)" as const, letterSpacing: "0.2px",
  textDecoration: "none", display: "block", padding: "2px 0", transition: "color 0.15s",
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "#02030A",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "56px 0 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr 1fr;
          gap: 32px;
          align-items: flex-start;
          margin-bottom: 48px;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        @media (max-width: 1279px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(184,156,74,0.50), transparent)" }} />

      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <img
                src="/images/logo-gold.webp"
                alt="AiiA logo"
                style={{ height: "44px", width: "auto", objectFit: "contain" }}
              />
            </div>
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "13.5px", lineHeight: 1.65, color: "rgba(200,215,230,0.48)", margin: "0 0 8px", maxWidth: "42ch" }}>
              AiiA is the Operational Intelligence partner for companies that refuse to let friction run the business. We find the leaks, implement the fix, and measure the improvement.
            </p>
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12.5px", lineHeight: 1.6, color: "rgba(200,215,230,0.32)", margin: "0 0 4px", maxWidth: "42ch" }}>
              Serving real estate, mortgage & lending, commercial property, and management consulting firms.
            </p>
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "rgba(200,215,230,0.28)", margin: 0 }}>www.aiiaco.com</p>
          </div>

          {/* Services links - pillar + foundational */}
          <nav aria-label="Services navigation">
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(184,156,74,0.65)", marginBottom: "14px" }}>Services</p>
            <a href="/ai-integration" style={linkStyle}>AI Integration</a>
            <a href="/ai-implementation-services" style={linkStyle}>AI Implementation</a>
            <a href="/ai-automation-for-business" style={linkStyle}>AI Automation</a>
            <a href="/ai-governance" style={linkStyle}>AI Governance</a>
            <a href="/models" style={linkStyle}>Engagement Models</a>
          </nav>

          {/* Solutions - 5 new service pages (Round 2) */}
          <nav aria-label="Solutions navigation">
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(184,156,74,0.65)", marginBottom: "14px" }}>Solutions</p>
            <a href="/ai-revenue-engine" style={linkStyle}>AI Revenue Engine</a>
            <a href="/ai-crm-integration" style={linkStyle}>AI CRM Integration</a>
            <a href="/ai-workflow-automation" style={linkStyle}>AI Workflow Automation</a>
            <a href="/ai-for-real-estate" style={linkStyle}>AI for Real Estate</a>
            <a href="/ai-for-vacation-rentals" style={linkStyle}>AI for Vacation Rentals</a>
          </nav>

          {/* Platform links */}
          <nav aria-label="Platform navigation">
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(184,156,74,0.65)", marginBottom: "14px" }}>Platform</p>
            <a href="/method" style={linkStyle}>The AiiACo Method</a>
            <a href="/industries" style={linkStyle}>Industries Served</a>
            <a href="/results" style={linkStyle}>Results & Outcomes</a>
            <a href="/case-studies" style={linkStyle}>Case Studies</a>
            <a href="/blog" style={linkStyle}>Blog & Insights</a>
            <a href="/demo" style={linkStyle}>Diagnostic Intelligence</a>
          </nav>

          {/* Company links */}
          <nav aria-label="Company navigation">
            <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(184,156,74,0.65)", marginBottom: "14px" }}>Company</p>
            <a href="/manifesto" style={linkStyle}>Our Manifesto</a>
            <a href="/workplace" style={linkStyle}>Workplace Policy</a>
            <a href="/upgrade" style={linkStyle}>Request Upgrade</a>
            <a href="/privacy" style={linkStyle}>Privacy Policy</a>
            <a href="/terms" style={linkStyle}>Terms of Service</a>
          </nav>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "24px" }} />

        <div className="footer-bottom">
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "rgba(200,215,230,0.28)", margin: 0 }}>
            © {new Date().getFullYear()} AiiACo. All rights reserved.
          </p>
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "rgba(200,215,230,0.28)", margin: 0 }}>
            Operational Intelligence · Workflow Automation · Real Estate & Mortgage · Management Consulting
          </p>
        </div>
      </div>
    </footer>
  );
}
