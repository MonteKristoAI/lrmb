import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE, PAGE_META } from "./seo.config";

type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  ogImage?: string;
  keywords?: string;
  /** When true, omit the canonical link entirely. Used on NotFound where the
   *  requested URL is unknown at render time and we do not want to create a
   *  fake canonical to /404. */
  suppressCanonical?: boolean;
};

/**
 * SEO component.
 * Resolution order for title/description:
 *   1. Explicit `title`/`description` prop (page-level override)
 *   2. PAGE_META[path] (route-level default from seo.config.ts)
 *   3. SITE.defaultTitle / SITE.defaultDescription (global fallback)
 *
 * Canonical URL: always SITE.domain + path (apex domain, never www).
 */
export default function SEO({
  title,
  description,
  path = "/",
  noindex = false,
  ogImage,
  keywords,
  suppressCanonical = false,
}: SEOProps) {
  const meta = PAGE_META[path];
  const pageTitle = title ?? meta?.title ?? SITE.defaultTitle;
  const pageDesc = description ?? meta?.description ?? SITE.defaultDescription;
  const pageKeywords = keywords ?? SITE.keywords;
  const url = `${SITE.domain}${path}`;
  const image = ogImage ?? SITE.ogImage;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content="AiiACo" />
      {!suppressCanonical && <link rel="canonical" href={url} />}

      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      {!suppressCanonical && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {SITE.twitterHandle && <meta name="twitter:site" content={SITE.twitterHandle} />}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
