import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
}

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://luxeshutters.com.au";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.webp`;
const DEFAULT_OG_ALT = "Luxe Shutters — premium shutters, blinds and curtains in Temora and the Riverina";
const INDEX_DIRECTIVE = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (el) {
    el.setAttribute("content", content);
  } else {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    el.content = content;
    document.head.appendChild(el);
  }
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (link) {
    link.href = href;
  } else {
    link = document.createElement("link");
    link.rel = "canonical";
    link.href = href;
    document.head.appendChild(link);
  }
}

function setAlternate(hreflang: string, href: string) {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let link = document.querySelector(selector) as HTMLLinkElement | null;
  if (link) {
    link.href = href;
  } else {
    link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = hreflang;
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage,
  ogImageAlt,
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;
    const path = canonical ?? "/";
    // Homepage uses trailing slash (root), all other pages have no trailing slash
    const url = path === "/" ? `${BASE_URL}/` : `${BASE_URL}${path}`;
    const image = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `${BASE_URL}${ogImage}`
      : DEFAULT_OG_IMAGE;
    const alt = ogImageAlt || DEFAULT_OG_ALT;

    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : INDEX_DIRECTIVE);

    // Open Graph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", url, true);
    setMeta("og:image", image, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", alt, true);
    setMeta("og:locale", "en_AU", true);
    setMeta("og:site_name", "Luxe Shutters", true);

    // Twitter
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
    setMeta("twitter:image:alt", alt);
    setMeta("twitter:card", "summary_large_image");

    // Canonical + hreflang
    setCanonical(url);
    setAlternate("en-AU", url);
    setAlternate("x-default", url);
  }, [title, description, canonical, ogType, ogImage, ogImageAlt, noindex]);

  return null;
}
