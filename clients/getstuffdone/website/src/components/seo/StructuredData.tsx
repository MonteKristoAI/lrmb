import { useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Generic JSON-LD injector                                          */
/* ------------------------------------------------------------------ */

interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

export default function StructuredData({ data, id }: StructuredDataProps) {
  useEffect(() => {
    const scriptId = id ?? "structured-data";
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!el) {
      el = document.createElement("script");
      el.id = scriptId;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }

    el.textContent = JSON.stringify(data);

    return () => {
      el?.remove();
    };
  }, [data, id]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Pre-built data objects                                            */
/* ------------------------------------------------------------------ */

export const ORGANIZATION_DATA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GSD with AI",
  legalName: "Gets Stuff Done LLC",
  url: "https://www.getsstuffdone.com",
  logo: "https://www.getsstuffdone.com/logo.png",
  description:
    "Smart IT & AI Solutions — Affordable, Scalable, Impactful. We design, build, and deploy AI agents and automations that replace manual work.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Maxine Aitkenhead",
    jobTitle: "Founder & CEO",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Houston",
    addressRegion: "TX",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-281-844-2458",
    email: "info@getsstuffdone.com",
    contactType: "customer service",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.linkedin.com/in/maxineaitkenhead/",
    "https://www.facebook.com/p/Gets-Stuff-Done-LLC-61580812436146/",
  ],
};

export const PROFESSIONAL_SERVICE_DATA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GSD with AI",
  url: "https://www.getsstuffdone.com",
  description:
    "AI and IT consulting for small and mid-size businesses. Workflow automation, CRM integration, AI agent deployment, and digital transformation.",
  telephone: "+1-281-844-2458",
  email: "info@getsstuffdone.com",
  priceRange: "$$",
  image: "https://www.getsstuffdone.com/logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "",
    addressLocality: "Houston",
    addressRegion: "TX",
    postalCode: "77001",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 29.7604,
    longitude: -95.3698,
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  serviceType: [
    "AI Consulting",
    "IT Consulting",
    "Workflow Automation",
    "CRM Integration",
    "Digital Transformation",
    "AI Agent Deployment",
    "Cybersecurity",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Workflow Automation",
    "CRM Systems",
    "Digital Transformation",
    "Cybersecurity",
    "Data Governance",
  ],
};

/* ------------------------------------------------------------------ */
/*  Builder helpers                                                   */
/* ------------------------------------------------------------------ */

export function buildFAQData(
  faqs: { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function buildBreadcrumbData(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
