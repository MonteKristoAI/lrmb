import { useEffect } from "react";

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

export default function StructuredData({ data, id = "structured-data" }: StructuredDataProps) {
  useEffect(() => {
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => { script?.remove(); };
  }, [data, id]);

  return null;
}

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://luxeshutters.com.au";

export const ORGANIZATION_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Luxe Shutters",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-widget.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "1800-465-893",
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.facebook.com/Luxeshutters",
    "https://www.instagram.com/luxe_shutters",
  ],
};

export const LOCAL_BUSINESS_DATA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Luxe Shutters",
  description: "Premium shutters, blinds, curtains, zipscreens, and awnings -- custom-made and professionally installed in Temora and the Riverina region.",
  url: SITE_URL,
  telephone: "1800-465-893",
  email: "admin@luxeshutters.com.au",
  address: {
    "@type": "PostalAddress",
    streetAddress: "185 Hoskins St",
    addressLocality: "Temora",
    addressRegion: "New South Wales",
    postalCode: "2666",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.4468,
    longitude: 147.5344,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  priceRange: "$$",
  image: `${SITE_URL}/og-image.png`,
  areaServed: [
    { "@type": "City", name: "Temora" },
    { "@type": "City", name: "Wagga Wagga" },
    { "@type": "City", name: "Young" },
    { "@type": "City", name: "Cootamundra" },
    { "@type": "City", name: "West Wyalong" },
    { "@type": "City", name: "Griffith" },
    { "@type": "City", name: "Junee" },
    { "@type": "City", name: "Cowra" },
  ],
};

export function buildServiceData(serviceName: string, serviceDescription: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    provider: {
      "@type": "LocalBusiness",
      name: "Luxe Shutters",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "State",
      name: "New South Wales",
    },
  };
}

export { SITE_URL };

export function buildFAQData(faqs: { q: string; a: string }[]) {
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

export function buildBreadcrumbData(items: { name: string; url: string }[]) {
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
