import { useEffect } from "react";

const BASE_URL = "https://www.getsstuffdone.com";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attr}="${name}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogType = "website",
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const url = canonical
      ? canonical.startsWith("http")
        ? canonical
        : `${BASE_URL}${canonical}`
      : BASE_URL;

    // Standard meta
    setMeta("description", description);

    // Open Graph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", url, true);

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    // Canonical
    setCanonical(url);
  }, [title, description, canonical, ogType]);

  return null;
}
