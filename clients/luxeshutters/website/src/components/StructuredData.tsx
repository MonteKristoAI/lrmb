import { useEffect } from "react";
import type { Review } from "@/data/clinicData";

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
const BUSINESS_ID = `${SITE_URL}/#business`;
const ORG_ID = `${SITE_URL}/#org`;

// E.164 phone for Schema.org (no separators per ITU-T E.164). Display format stays in clinicData.CLINIC.phone.
const TELEPHONE_E164 = "+611800465893";

export const ORGANIZATION_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Luxe Shutters",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo-widget.webp`,
    width: 512,
    height: 512,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: TELEPHONE_E164,
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.facebook.com/Luxeshutters",
    "https://www.instagram.com/luxe_shutters",
  ],
};

export function buildAggregateRating(reviews: Review[]) {
  const validRatings = reviews.map((r) => r.rating).filter((r) => typeof r === "number");
  if (validRatings.length === 0) return undefined;
  const avg = validRatings.reduce((s, r) => s + r, 0) / validRatings.length;
  return {
    "@type": "AggregateRating",
    ratingValue: avg.toFixed(1),
    reviewCount: validRatings.length.toString(),
    bestRating: "5",
    worstRating: "1",
  };
}

export function buildReviewSchema(review: Review) {
  return {
    "@type": "Review",
    author: { "@type": "Person", name: review.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: review.text,
    itemReviewed: { "@id": BUSINESS_ID },
  };
}

export const LOCAL_BUSINESS_DATA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: "Luxe Shutters",
  description: "Premium shutters, blinds, curtains, zipscreens, and awnings — custom-made and professionally installed in Temora and the Riverina region.",
  url: SITE_URL,
  telephone: TELEPHONE_E164,
  email: "admin@luxeshutters.com.au",
  address: {
    "@type": "PostalAddress",
    streetAddress: "185 Hoskins St",
    addressLocality: "Temora",
    addressRegion: "NSW",
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
  image: `${SITE_URL}/og-image.webp`,
  logo: `${SITE_URL}/logo-widget.webp`,
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
  sameAs: [
    "https://www.facebook.com/Luxeshutters",
    "https://www.instagram.com/luxe_shutters",
  ],
};

/** Build a LocalBusiness augmented with AggregateRating + top-N reviews */
export function buildLocalBusinessWithReviews(reviews: Review[], topReviewCount = 5) {
  const aggregateRating = buildAggregateRating(reviews);
  const topReviews = reviews.slice(0, topReviewCount).map(buildReviewSchema);
  return {
    ...LOCAL_BUSINESS_DATA,
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(topReviews.length > 0 ? { review: topReviews } : {}),
  };
}

export function buildServiceData(serviceName: string, serviceDescription: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    provider: { "@id": BUSINESS_ID },
    areaServed: {
      "@type": "State",
      name: "New South Wales",
    },
  };
}

/** All 6 product-line services in one array (Services page) */
export function buildAllServiceSchemas() {
  return [
    buildServiceData("Plantation Shutters", "Custom plantation shutters in timber, PVC, and aluminium — professionally installed across Temora and the Riverina."),
    buildServiceData("Window Blinds", "Roller, venetian, vertical, and motorised blinds in a wide range of fabrics and colours."),
    buildServiceData("Curtains", "Custom sheer, block-out, and thermal-lined curtains with S-fold, pinch pleat, and eyelet heading styles."),
    buildServiceData("Zipscreens", "Wind-rated outdoor zipscreens with UV protection up to 99%, motorised with smart-home control."),
    buildServiceData("Awnings", "Retractable and fixed awnings for outdoor living areas — weather-resistant fabrics and frames."),
    buildServiceData("Security Roller Shutters", "Insurance-approved security roller shutters with motorised operation and thermal insulation."),
  ];
}

export { SITE_URL, BUSINESS_ID, ORG_ID, TELEPHONE_E164 };

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
