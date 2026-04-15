/*
 * AiiACo - Industry Microsite Page
 * Design: Liquid Glass Bio-Organic | SF Pro Display + SF Pro Text | Deep void-black + gold
 * Used for all /industries/[slug] routes
 */

import { motion } from "framer-motion";
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { getIndustryBySlug } from "@/data/industries";
import { caseStudies } from "@/components/caseStudies/caseStudies.data";
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import RelatedServices from "@/components/RelatedServices";
import { CALENDLY_URL } from "@/const";
import { useCalendlyTracking, trackCalendlyLinkClick } from "@/hooks/useCalendlyTracking";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const BASE_URL = "https://aiiaco.com";

// Loose props type: wouter's <Route component={}> passes { params: { slug } }
// while entry-server.tsx's SSR render passes { ssrSlug } directly.
// Both forms are accepted so the component works in client navigation AND SSR.
type IndustryMicrositeProps = {
  ssrSlug?: string;
  params?: { slug?: string };
};

export default function IndustryMicrosite(props: IndustryMicrositeProps = {}) {
  const hookParams = useParams<{ slug: string }>();
  const slug = hookParams.slug || props.params?.slug || props.ssrSlug;
  const industry = getIndustryBySlug(slug || "");
  useCalendlyTracking(`industry_${slug || "unknown"}`);

  // Resolve related industries for the "Related Industries" section
  const relatedIndustries = industry?.relatedSlugs
    ?.map(s => getIndustryBySlug(s))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
    .slice(0, 4) ?? [];

  // Build per-industry JSON-LD schema blocks (Service + BreadcrumbList + FAQPage)
  const industrySchemas: Array<Record<string, unknown>> = [];

  if (industry) {
    const pageUrl = `${BASE_URL}/industries/${industry.slug}`;

    industrySchemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: `AI Integration for ${industry.name}`,
      serviceType: "AI Integration and Implementation Consulting",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: "Worldwide",
      description: industry.directAnswer ?? industry.description,
      url: pageUrl,
      category: "Artificial Intelligence Consulting",
    });

    industrySchemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Industries", item: `${BASE_URL}/industries` },
        { "@type": "ListItem", position: 3, name: industry.name, item: pageUrl },
      ],
    });

    if (industry.faq && industry.faq.length > 0) {
      industrySchemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: industry.faq.map(q => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      });
    }
  }

  if (!industry) {
    return (
      <>
        <Navbar />
        <main
          style={{
            background: "#03050A",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.90)",
                marginBottom: "16px",
              }}
            >
              Industry Not Found
            </h1>
            <a href="/industries"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(184,156,74,0.90)",
                textDecoration: "none",
              }}
            >
              ← Back to Industries
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title={industry.seoTitle}
        description={industry.seoDescription}
        keywords={industry.seoKeywords}
        path={`/industries/${industry.slug}`}
      />
      {industrySchemas.length > 0 && (
        <Helmet>
          {industrySchemas.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))}
        </Helmet>
      )}
      <Navbar />

      <main
        style={{
          background: "linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)",
          minHeight: "100vh",
        }}
      >
        {/* Back button */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "rgba(5,8,16,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 0",
          }}
        >
          <div className="container" style={{ maxWidth: "900px" }}>
            <a href="/industries"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(184,156,74,0.85)",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8L10 13" stroke="rgba(184,156,74,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Industries
            </a>
          </div>
        </div>

        {/* Hero */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0 clamp(40px, 6vw, 80px)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div
                variants={fade}
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
                    background: "rgba(184,156,74,0.85)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(184,156,74,0.85)",
                  }}
                >
                  {industry.name}
                </span>
              </motion.div>

              <motion.h1
                variants={fade}
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(32px, 5vw, 56px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "rgba(255,255,255,0.95)",
                  marginBottom: "20px",
                }}
              >
                {industry.headline}
              </motion.h1>

              <motion.p
                variants={fade}
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(16px, 2vw, 19px)",
                  lineHeight: 1.65,
                  color: "rgba(200,215,230,0.70)",
                  maxWidth: "680px",
                  marginBottom: "20px",
                }}
              >
                {industry.subheadline}
              </motion.p>

              <motion.div
                variants={fade}
                style={{
                  width: "48px",
                  height: "2px",
                  background: "linear-gradient(90deg, rgba(184,156,74,0.80), transparent)",
                  marginBottom: "28px",
                }}
              />

              {/* Direct Answer (AEO) - highlighted for passage-level citation */}
              {industry.directAnswer && (
                <motion.div
                  variants={fade}
                  style={{
                    padding: "20px 24px",
                    background: "rgba(184,156,74,0.06)",
                    border: "1px solid rgba(184,156,74,0.18)",
                    borderLeft: "3px solid rgba(184,156,74,0.60)",
                    borderRadius: "8px",
                    marginBottom: "28px",
                    maxWidth: "720px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "15px",
                      lineHeight: 1.65,
                      color: "rgba(230,220,200,0.88)",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {industry.directAnswer}
                  </p>
                </motion.div>
              )}

              <motion.p
                variants={fade}
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "rgba(200,215,230,0.60)",
                  maxWidth: "680px",
                  marginBottom: "40px",
                }}
              >
                {industry.description}
              </motion.p>

              <motion.div variants={fade} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{ textDecoration: "none" }}
                  onClick={() => trackCalendlyLinkClick(`industry_${slug}_hero`)}
                >
                  Book a Strategy Call
                </a>
                <a
                  href="/#models"
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "rgba(200,215,230,0.70)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(200,215,230,0.20)",
                  }}
                >
                  View Engagement Models →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* KPIs */}
        <section
          style={{
            padding: "60px 0",
            background: "rgba(255,255,255,0.015)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="container" style={{ maxWidth: "900px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
                gap: "32px",
              }}
            >
              {industry.kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <div
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "clamp(32px, 4vw, 44px)",
                      fontWeight: 700,
                      color: "rgba(184,156,74,0.92)",
                      lineHeight: 1,
                      marginBottom: "8px",
                    }}
                  >
                    {kpi.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: "rgba(200,215,230,0.50)",
                    }}
                  >
                    {kpi.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section style={{ padding: "80px 0" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: "48px" }}
            >
              <p
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(184,156,74,0.60)",
                  marginBottom: "16px",
                }}
              >
                Operational Drag We Eliminate
              </p>
              <h2
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                The Problems We Are Built to Solve
              </h2>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(380px, 100%), 1fr))",
                gap: "16px",
              }}
            >
              {industry.painPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  style={{
                    padding: "24px 28px",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.90)",
                      marginBottom: "10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {point.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "rgba(200,215,230,0.60)",
                      margin: 0,
                    }}
                  >
                    {point.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section
          style={{
            padding: "80px 0",
            background: "rgba(255,255,255,0.012)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: "48px" }}
            >
              <p
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(184,156,74,0.60)",
                  marginBottom: "16px",
                }}
              >
                What We Deploy
              </p>
              <h2
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                AI Systems Built for {industry.name}
              </h2>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(380px, 100%), 1fr))",
                gap: "16px",
              }}
            >
              {industry.useCases.map((uc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  style={{
                    padding: "24px 28px",
                    background: "rgba(184,156,74,0.04)",
                    border: "1px solid rgba(184,156,74,0.12)",
                    borderRadius: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "rgba(184,156,74,0.80)",
                        flexShrink: 0,
                      }}
                    />
                    <h3
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.92)",
                        margin: 0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {uc.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "rgba(200,215,230,0.65)",
                      margin: 0,
                    }}
                  >
                    {uc.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance & Regulatory Context (renders if industry.regulations populated) */}
        {industry.regulations && industry.regulations.length > 0 && (
          <section
            aria-labelledby={`${industry.slug}-regulations`}
            style={{
              padding: "clamp(60px, 8vw, 90px) 0",
              background: "rgba(255,255,255,0.012)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="container" style={{ maxWidth: "960px" }}>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
                <motion.p
                  variants={fade}
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(184,156,74,0.60)",
                    marginBottom: "12px",
                  }}
                >
                  Compliance Context
                </motion.p>
                <motion.h2
                  id={`${industry.slug}-regulations`}
                  variants={fade}
                  className="section-headline"
                  style={{ marginBottom: "16px" }}
                >
                  Built for {industry.name} Regulatory Reality
                </motion.h2>
                <motion.p
                  variants={fade}
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "rgba(200,215,230,0.60)",
                    margin: "0 0 32px",
                    maxWidth: "62ch",
                  }}
                >
                  Every AiiACo deployment accounts for the regulatory frameworks that govern{" "}
                  {industry.name.toLowerCase()}. Compliance is not a bolt-on. It is part of how the
                  integration is scoped, audited, and operated.
                </motion.p>

                <motion.div
                  variants={fade}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                    gap: "10px",
                  }}
                >
                  {industry.regulations.map((reg) => (
                    <div
                      key={reg}
                      style={{
                        padding: "12px 16px",
                        background: "rgba(184,156,74,0.05)",
                        border: "1px solid rgba(184,156,74,0.16)",
                        borderRadius: "8px",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "rgba(230,220,200,0.82)",
                        lineHeight: 1.4,
                      }}
                    >
                      {reg}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Platform Integrations (renders if industry.platforms populated) */}
        {industry.platforms && industry.platforms.length > 0 && (
          <section
            aria-labelledby={`${industry.slug}-platforms`}
            style={{
              padding: "clamp(60px, 8vw, 90px) 0",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="container" style={{ maxWidth: "960px" }}>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
                <motion.p
                  variants={fade}
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(184,156,74,0.60)",
                    marginBottom: "12px",
                  }}
                >
                  Platform Integrations
                </motion.p>
                <motion.h2
                  id={`${industry.slug}-platforms`}
                  variants={fade}
                  className="section-headline"
                  style={{ marginBottom: "16px" }}
                >
                  Works With Your Existing Stack
                </motion.h2>
                <motion.p
                  variants={fade}
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "rgba(200,215,230,0.60)",
                    margin: "0 0 32px",
                    maxWidth: "62ch",
                  }}
                >
                  AiiACo integrates AI on top of the platforms {industry.name.toLowerCase()}{" "}
                  operators already run. No migration. No rip-and-replace. The integration layer
                  sits above these systems via native APIs and webhook pipelines.
                </motion.p>

                <motion.div
                  variants={fade}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                    gap: "12px",
                  }}
                >
                  {industry.platforms.map((plat) => (
                    <div
                      key={plat}
                      style={{
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: "rgba(200,215,230,0.85)",
                        textAlign: "center",
                      }}
                    >
                      {plat}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Who We Work With (Roles - renders if industry.roles populated) */}
        {industry.roles && industry.roles.length > 0 && (
          <section
            aria-labelledby={`${industry.slug}-roles`}
            style={{
              padding: "clamp(60px, 8vw, 90px) 0",
              background: "rgba(255,255,255,0.012)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="container" style={{ maxWidth: "960px" }}>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
                <motion.p
                  variants={fade}
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(184,156,74,0.60)",
                    marginBottom: "12px",
                  }}
                >
                  Who We Work With
                </motion.p>
                <motion.h2
                  id={`${industry.slug}-roles`}
                  variants={fade}
                  className="section-headline"
                  style={{ marginBottom: "16px" }}
                >
                  The Roles AiiACo Supports
                </motion.h2>
                <motion.p
                  variants={fade}
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "rgba(200,215,230,0.60)",
                    margin: "0 0 32px",
                    maxWidth: "62ch",
                  }}
                >
                  AiiACo builds AI integration for the specific operators inside{" "}
                  {industry.name.toLowerCase()} teams. Each role has its own friction profile and
                  workflow bottlenecks. We scope and deploy against the roles that matter.
                </motion.p>

                <motion.ul
                  variants={fade}
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                    gap: "8px",
                  }}
                >
                  {industry.roles.map((role) => (
                    <li
                      key={role}
                      style={{
                        padding: "10px 14px",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "rgba(200,215,230,0.78)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "rgba(184,156,74,0.70)",
                          flexShrink: 0,
                        }}
                      />
                      {role}
                    </li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </section>
        )}

        {/* Industry FAQ (renders only if industry.faq is populated) */}
        {industry.faq && industry.faq.length > 0 && (
          <FAQSection
            items={industry.faq}
            eyebrow={`${industry.name} FAQ`}
            headline={`AI for ${industry.name}: Frequently Asked Questions`}
            subheadline={`Answers to the questions ${industry.name.toLowerCase()} operators ask about AI integration, engagement timelines, and how AiiACo deploys and manages the stack.`}
          />
        )}

        {/* Featured Case Study */}
        {industry.featuredCaseStudyId && (() => {
          const cs = caseStudies.find((c) => c.id === industry.featuredCaseStudyId);
          if (!cs) return null;
          return (
            <section
              style={{
                padding: "80px 0",
                background: "rgba(255,255,255,0.015)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="container" style={{ maxWidth: "900px" }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{ marginBottom: "40px" }}
                >
                  <p
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(184,156,74,0.60)",
                      marginBottom: "16px",
                    }}
                  >
                    Case Study
                  </p>
                  <h2
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "clamp(24px, 3vw, 34px)",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.92)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      marginBottom: "8px",
                    }}
                  >
                    {cs.sector} - {cs.type}
                  </h2>
                  <p
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "15px",
                      lineHeight: 1.65,
                      color: "rgba(200,215,230,0.60)",
                      maxWidth: "640px",
                    }}
                  >
                    {cs.situation}
                  </p>
                </motion.div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                    gap: "16px",
                    marginBottom: "32px",
                  }}
                >
                  {/* Outcomes */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{
                      padding: "24px 28px",
                      background: "rgba(184,156,74,0.04)",
                      border: "1px solid rgba(184,156,74,0.12)",
                      borderRadius: "14px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(184,156,74,0.60)",
                        marginBottom: "16px",
                      }}
                    >
                      Outcomes
                    </p>
                    {cs.outcomes.map((o, i) => (
                      <div key={i} style={{ marginBottom: i < cs.outcomes.length - 1 ? "14px" : 0 }}>
                        <div
                          style={{
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                            fontSize: "22px",
                            fontWeight: 700,
                            color: "rgba(184,156,74,0.90)",
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}
                        >
                          {o.value}
                        </div>
                        <div
                          style={{
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                            fontSize: "12px",
                            color: "rgba(200,215,230,0.55)",
                          }}
                        >
                          {o.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Approach */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    style={{
                      padding: "24px 28px",
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "14px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(200,215,230,0.35)",
                        marginBottom: "16px",
                      }}
                    >
                      Approach
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {cs.approach.map((a, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "flex-start",
                            marginBottom: i < cs.approach.length - 1 ? "10px" : 0,
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(184,156,74,0.70)",
                              fontSize: "14px",
                              lineHeight: 1.5,
                              flexShrink: 0,
                            }}
                          >
                            -
                          </span>
                          <span
                            style={{
                              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                              fontSize: "13px",
                              lineHeight: 1.55,
                              color: "rgba(200,215,230,0.65)",
                            }}
                          >
                            {a}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <a href="/case-studies"
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "rgba(184,156,74,0.80)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    View All Case Studies →
                  </a>
                  <span
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "11px",
                      color: "rgba(200,215,230,0.30)",
                    }}
                  >
                    {cs.timeline} timeline
                  </span>
                </div>
              </div>
            </section>
          );
        })()}

        {/* CTA */}
        <section style={{ padding: "80px 0" }}>
          <div className="container" style={{ maxWidth: industry.showCalendly ? "860px" : "700px", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  marginBottom: "20px",
                }}
              >
                {industry.showCalendly ? "Schedule a Private Consultation" : `Ready to Deploy AI in ${industry.name}?`}
              </h2>
              <p
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: "rgba(200,215,230,0.60)",
                  marginBottom: "36px",
                  maxWidth: "560px",
                  margin: "0 auto 36px",
                }}
              >
                {industry.showCalendly
                  ? "Select a time directly. All consultations are conducted under strict confidentiality - no obligation, no pitch decks."
                  : "Every engagement begins with a Business Intelligence Audit - a diagnostic of your architecture, goals, and operational bottlenecks. No commitment required."}
              </p>

              {industry.showCalendly ? (
                /* Calendly inline embed for UHNW */
                <div
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1px solid rgba(184,156,74,0.20)",
                    background: "rgba(3,5,10,0.80)",
                    marginBottom: "28px",
                  }}
                >
                  <iframe
                    src="https://calendly.com/aiiaco?embed_type=Inline&hide_gdpr_banner=1&background_color=03050A&text_color=d2dceb&primary_color=B89C4A"
                    width="100%"
                    height="650"
                    frameBorder="0"
                    title="Schedule a Private Consultation with AiiACo"
                    style={{ display: "block", background: "#03050A" }}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ textDecoration: "none" }} onClick={() => trackCalendlyLinkClick(`industry_${slug}`)}>
                    Book Your Audit Call
                  </a>
                  <a href="/industries"
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(200,215,230,0.60)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(200,215,230,0.20)",
                    }}
                  >
                    ← All Industries
                  </a>
                </div>
              )}

              {industry.showCalendly && (
                <a href="/industries"
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "rgba(200,215,230,0.45)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  ← All Industries
                </a>
              )}
            </motion.div>
          </div>
        </section>

        {/* Related Industries (renders only if industry.relatedSlugs is populated) */}
        {relatedIndustries.length > 0 && (
          <section
            style={{
              padding: "80px 0",
              background: "rgba(255,255,255,0.012)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="container" style={{ maxWidth: "900px" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: "40px" }}
              >
                <p
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(184,156,74,0.60)",
                    marginBottom: "16px",
                  }}
                >
                  Related Industries
                </p>
                <h2
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(24px, 3vw, 34px)",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Operators in Adjacent Verticals
                </h2>
              </motion.div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                  gap: "16px",
                }}
              >
                {relatedIndustries.map((related) => (
                  <a
                    key={related.slug}
                    href={`/industries/${related.slug}`}
                    style={{
                      display: "block",
                      padding: "24px 28px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      textDecoration: "none",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(184,156,74,0.60)",
                        margin: "0 0 10px",
                      }}
                    >
                      Industry
                    </p>
                    <p
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.92)",
                        margin: "0 0 8px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {related.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "13px",
                        color: "rgba(200,215,230,0.60)",
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {related.subheadline}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cross-links to pillar pages */}
        <section
          style={{
            padding: "60px 0",
            background: "rgba(6,11,20,0.80)",
            borderTop: "1px solid rgba(184,156,74,0.10)",
          }}
        >
          <div className="container" style={{ maxWidth: "900px" }}>
            <p
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(184,156,74,0.60)",
                marginBottom: "24px",
              }}
            >
              Our Services
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                gap: "16px",
              }}
            >
              {[
                {
                  href: "/ai-integration",
                  title: "AI Integration Services",
                  desc: "End-to-end AI integration across your full operational architecture.",
                },
                {
                  href: "/ai-implementation-services",
                  title: "AI Implementation Services",
                  desc: "Structured deployment of AI systems - from scoping to go-live.",
                },
                {
                  href: "/ai-automation-for-business",
                  title: "AI Automation for Business",
                  desc: "Automation of repeatable business processes using AI agents.",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
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
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.90)",
                      margin: "0 0 6px",
                    }}
                  >
                    {link.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "13px",
                      color: "rgba(200,215,230,0.50)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {link.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <RelatedServices current={`/industries/${industry.slug}`} max={3} headline="Apply These Capabilities to Your Stack" subhead="AiiACo delivers specialist AI integrations on top of the CRMs, workflow tools, and revenue platforms your team already runs." />
      <Footer />
    </>
  );
}
