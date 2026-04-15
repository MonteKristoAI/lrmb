import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
}

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://luxeshutters.com.au";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

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

export default function SEOHead({ title, description, canonical, ogType = "website" }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;
    const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", url, true);
    setMeta("og:image", OG_IMAGE, true);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", OG_IMAGE);
    setMeta("twitter:card", "summary_large_image");
    setCanonical(url);
  }, [title, description, canonical, ogType]);

  return null;
}
