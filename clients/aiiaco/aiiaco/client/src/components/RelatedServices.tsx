/**
 * RelatedServices - Bottom-of-page cross-link block.
 *
 * Shows 3-4 related service pages for internal linking and pillar/spoke architecture.
 * Call sites pass `current` (the current page path) and the component auto-selects
 * the most relevant siblings from a canonical services catalog.
 *
 * Usage:
 *   <RelatedServices current="/ai-integration" />
 *   <RelatedServices current="/ai-revenue-engine" max={3} />
 *   <RelatedServices current="/industries/real-estate-brokerage" max={4} />
 *
 * Uses plain <a href> (not wouter Link) for two reasons:
 * 1. These are SEO cross-links at the bottom of the page where SPA navigation is
 *    not worth the complexity - Google crawls them regardless.
 * 2. wouter's Link component triggered a "Missing getServerSnapshot" error in
 *    SSR renderToString calls on any page that included this component.
 *    Plain <a> sidesteps that entirely.
 */

interface ServiceEntry {
  href: string;
  title: string;
  desc: string;
  keywords: string[];
}

const SERVICES: ServiceEntry[] = [
  {
    href: "/ai-integration",
    title: "AI Integration Services",
    desc: "End-to-end enterprise AI integration across your full operational architecture.",
    keywords: ["pillar", "integration", "enterprise", "architecture"],
  },
  {
    href: "/ai-revenue-engine",
    title: "AI Revenue Engine",
    desc: "Five-component AI revenue system: lead gen, nurture, pipeline, reactivation, attribution.",
    keywords: ["revenue", "pipeline", "crm", "sales", "growth"],
  },
  {
    href: "/ai-crm-integration",
    title: "AI CRM Integration",
    desc: "Embed AI directly into Salesforce, HubSpot, Pipedrive, or GoHighLevel without migration.",
    keywords: ["crm", "salesforce", "hubspot", "integration", "revenue"],
  },
  {
    href: "/ai-workflow-automation",
    title: "AI Workflow Automation",
    desc: "Operational automation at scale across every revenue and operations function.",
    keywords: ["workflow", "automation", "operations", "process"],
  },
  {
    href: "/ai-for-real-estate",
    title: "AI for Real Estate",
    desc: "AI integration for brokerages: lead qualification, listing content, transaction management.",
    keywords: ["real-estate", "brokerage", "mls", "listing", "realtor"],
  },
  {
    href: "/ai-for-vacation-rentals",
    title: "AI for Vacation Rentals",
    desc: "Integration layer built on top of Hostaway, Guesty, Hospitable, and channel managers.",
    keywords: ["vacation-rental", "str", "pms", "hospitality", "airbnb"],
  },
];

// Industry-to-service affinity map. Used when `current` is an /industries/ path.
const INDUSTRY_AFFINITY: Record<string, string[]> = {
  "real-estate-brokerage": ["/ai-for-real-estate", "/ai-crm-integration", "/ai-revenue-engine"],
  "mortgage-lending": ["/ai-workflow-automation", "/ai-crm-integration", "/ai-revenue-engine"],
  "commercial-real-estate": ["/ai-workflow-automation", "/ai-integration", "/ai-crm-integration"],
  "luxury-lifestyle-hospitality": ["/ai-for-vacation-rentals", "/ai-workflow-automation", "/ai-crm-integration"],
  "management-consulting": ["/ai-workflow-automation", "/ai-integration", "/ai-revenue-engine"],
  "insurance": ["/ai-workflow-automation", "/ai-crm-integration", "/ai-integration"],
  "financial-services": ["/ai-workflow-automation", "/ai-integration", "/ai-revenue-engine"],
  "investment-wealth-management": ["/ai-crm-integration", "/ai-workflow-automation", "/ai-integration"],
  "software-technology": ["/ai-integration", "/ai-workflow-automation", "/ai-revenue-engine"],
  "agency-operations": ["/ai-revenue-engine", "/ai-crm-integration", "/ai-workflow-automation"],
};

interface RelatedServicesProps {
  current: string;
  max?: number;
  headline?: string;
  subhead?: string;
}

export default function RelatedServices({ current, max = 3, headline, subhead }: RelatedServicesProps) {
  let pool: ServiceEntry[] = [];

  // Industry page: use affinity map
  const industryMatch = current.match(/^\/industries\/(.+)$/);
  if (industryMatch && INDUSTRY_AFFINITY[industryMatch[1]]) {
    const affinityHrefs = INDUSTRY_AFFINITY[industryMatch[1]];
    pool = affinityHrefs
      .map((href) => SERVICES.find((s) => s.href === href))
      .filter((x): x is ServiceEntry => Boolean(x));
  } else {
    // Service page: exclude the current page, return the rest
    pool = SERVICES.filter((s) => s.href !== current);
  }

  const items = pool.slice(0, max);
  if (items.length === 0) return null;

  const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

  return (
    <section
      aria-labelledby="related-services-heading"
      style={{
        padding: "clamp(60px, 7vw, 100px) 0",
        background: "rgba(6,11,20,0.80)",
        borderTop: "1px solid rgba(184,156,74,0.10)",
      }}
    >
      <div className="container" style={{ maxWidth: "1100px" }}>
        <p
          style={{
            fontFamily: FF,
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(184,156,74,0.60)",
            marginBottom: "12px",
          }}
        >
          Related Services
        </p>
        <h2
          id="related-services-heading"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(24px, 3vw, 34px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            margin: "0 0 12px",
          }}
        >
          {headline ?? "Keep Exploring"}
        </h2>
        {subhead ? (
          <p
            style={{
              fontFamily: FF,
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(200,215,230,0.60)",
              margin: "0 0 32px",
              maxWidth: "62ch",
            }}
          >
            {subhead}
          </p>
        ) : (
          <div style={{ height: "32px" }} />
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "16px",
          }}
        >
          {items.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "22px 24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              <p
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                  margin: "0 0 8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {link.title}
              </p>
              <p
                style={{
                  fontFamily: FF,
                  fontSize: "13px",
                  color: "rgba(200,215,230,0.55)",
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
  );
}
