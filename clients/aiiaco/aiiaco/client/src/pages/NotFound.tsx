/**
 * AiiACo - 404 Not Found Page
 * Design: Liquid Glass Bio-Organic | Deep void-black + gold
 * SEO: noindex (404 pages must never be indexed)
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const POPULAR_DESTINATIONS: Array<{ href: string; title: string; desc: string }> = [
  {
    href: "/",
    title: "Home",
    desc: "AiiACo is the AI Integration Authority for the Corporate Age.",
  },
  {
    href: "/ai-integration",
    title: "AI Integration Services",
    desc: "End-to-end enterprise AI integration, designed and deployed by AiiACo.",
  },
  {
    href: "/method",
    title: "The AiiACo Method",
    desc: "Find the friction, implement the fix, measure the improvement, expand what works.",
  },
  {
    href: "/industries",
    title: "Industries We Serve",
    desc: "Real estate, mortgage, commercial property, hospitality, and more.",
  },
  {
    href: "/results",
    title: "Results",
    desc: "Measured outcomes from structured AI integration engagements.",
  },
  {
    href: "/upgrade",
    title: "Request an Engagement",
    desc: "Start the conversation. Response within 24 hours.",
  },
];

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | AiiACo"
        description="The page you requested does not exist. Return to aiiaco.com or explore our AI integration services, industries, and engagement models."
        noindex
        suppressCanonical
      />
      <Navbar />

      <main
        style={{
          background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)",
          minHeight: "100vh",
          padding: "clamp(80px, 12vw, 160px) 0 clamp(80px, 10vw, 140px)",
        }}
      >
        <div className="container" style={{ maxWidth: "900px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(184,156,74,0.08)",
              border: "1px solid rgba(184,156,74,0.22)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#D4A843",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: FF,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(184,156,74,0.85)",
              }}
            >
              Error 404
            </span>
          </div>

          <h1
            style={{
              fontFamily: FFD,
              fontSize: "clamp(56px, 10vw, 120px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "rgba(255,255,255,0.95)",
              margin: "0 0 12px",
            }}
          >
            404
          </h1>

          <p
            style={{
              fontFamily: FFD,
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              margin: "0 0 20px",
            }}
          >
            Page Not Found
          </p>

          <p
            style={{
              fontFamily: FF,
              fontSize: "clamp(15px, 1.5vw, 17px)",
              lineHeight: 1.7,
              color: "rgba(200,215,230,0.70)",
              maxWidth: "560px",
              margin: "0 auto 48px",
            }}
          >
            The page you requested does not exist or was moved. Explore AiiACo below or return to the homepage.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginBottom: "72px" }}>
            <Link href="/" className="btn-gold" style={{ textDecoration: "none" }}>
              Return to Homepage
            </Link>
            <Link
              href="/industries"
              style={{
                fontFamily: FF,
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(200,215,230,0.70)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "12px 0",
                borderBottom: "1px solid rgba(200,215,230,0.20)",
              }}
            >
              Browse Industries →
            </Link>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "48px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontFamily: FF,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(184,156,74,0.60)",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Popular Destinations
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                gap: "16px",
              }}
            >
              {POPULAR_DESTINATIONS.map((dest) => (
                <Link
                  key={dest.href}
                  href={dest.href}
                  style={{
                    display: "block",
                    padding: "20px 24px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    textDecoration: "none",
                  }}
                >
                  <p
                    style={{
                      fontFamily: FFD,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.92)",
                      margin: "0 0 6px",
                    }}
                  >
                    {dest.title}
                  </p>
                  <p
                    style={{
                      fontFamily: FF,
                      fontSize: "13px",
                      color: "rgba(200,215,230,0.55)",
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {dest.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
