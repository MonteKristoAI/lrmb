// Blog HTML Parser
// Extracts SEO fields, JSON-LD, article body, images, and metrics
// from MonteKristo AI blog HTML format

export interface SEOFields {
  seoTitle: string;
  metaDescription: string;
  focusKeyphrase: string;
  urlSlug: string;
  canonical: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  category: string;
  tags: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
}

export interface BlogImage {
  url: string;
  alt: string;
  caption: string;
  position: number;
  isFeatured: boolean;
}

export interface PostMetrics {
  wordCount: number;
  emDashCount: number;
  externalLinkCount: number;
  internalLinkCount: number;
  h2Count: number;
  h3Count: number;
  faqCount: number;
  svgCount: number;
  imageCount: number;
  bannedWordsFound: string[];
}

export interface ParsedBlogPost {
  seo: SEOFields;
  htmlBody: string;
  jsonLd: string;
  fullSource: string;
  images: BlogImage[];
  metrics: PostMetrics;
}

// ---- Banned Words (MonteKristo AI company-wide standard) ----

const BANNED_WORDS: string[] = [
  'delve', 'tapestry', 'nuanced', 'realm', 'landscape', 'multifaceted',
  'pivotal', 'utilize', 'facilitate', 'elucidate', 'robust', 'seamless',
  'cutting-edge', 'transformative', 'innovative', 'dynamic', 'agile',
  'game-changer', 'revolutionize', 'crucial', 'moreover', 'furthermore',
  'in conclusion', "it's worth noting", "it's important to note",
  'dive deep', 'incredibly', 'extremely', 'absolutely', 'truly',
  'significantly', 'groundbreaking', 'revolutionary', 'leverage',
  'streamline', 'empower', 'harness', 'unpack', 'unravel',
  'navigate the complexities', 'in today\'s world', 'in the ever-evolving',
  'in the realm of', 'when it comes to', 'it\'s crucial to',
  'it\'s essential to', 'it\'s vital to', 'it\'s imperative to',
  'let\'s dive', 'let\'s explore', 'let\'s take a closer look',
];

// ---- Parser Functions ----

export function parseBlogHTML(html: string): ParsedBlogPost {
  const seo = extractSEOFields(html);
  const htmlBody = extractArticleBody(html);
  const jsonLd = extractJsonLD(html);
  const images = extractImages(htmlBody);
  const metrics = calculateMetrics(htmlBody);

  return { seo, htmlBody, jsonLd, fullSource: html, images, metrics };
}

export function extractSEOFields(html: string): SEOFields {
  const commentMatch = html.match(/<!--[\s\S]*?-->/);
  if (!commentMatch) {
    return {
      seoTitle: '', metaDescription: '', focusKeyphrase: '', urlSlug: '',
      canonical: '', featuredImageUrl: '', featuredImageAlt: '', category: '',
      tags: [], ogTitle: '', ogDescription: '', ogImage: '', ogType: 'article',
      twitterCard: 'summary_large_image',
    };
  }
  const comment = commentMatch[0];

  const extract = (key: string): string => {
    const regex = new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, 'i');
    const match = comment.match(regex);
    return match ? match[1].trim() : '';
  };

  return {
    seoTitle: extract('SEO Title').replace(/\s*[\[\(]\d+\s*chars?[\]\)]$/, ''),
    metaDescription: extract('Meta description'),
    focusKeyphrase: extract('Focus keyphrase'),
    urlSlug: extract('URL Slug'),
    canonical: extract('Canonical'),
    featuredImageUrl: extract('Featured Image').replace(/\s+Featured Image Alt.*$/, ''),
    featuredImageAlt: extract('Featured Image Alt'),
    category: extract('Category'),
    tags: extract('Tags').split(',').map(t => t.trim()).filter(Boolean),
    ogTitle: extract('OG Title') || extract('og:title'),
    ogDescription: extract('OG Description') || extract('og:description'),
    ogImage: extract('OG Image') || extract('og:image'),
    ogType: extract('OG Type') || 'article',
    twitterCard: extract('Twitter Card') || extract('twitter:card') || 'summary_large_image',
  };
}

export function extractJsonLD(html: string): string {
  const match = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return match ? match[1].trim() : '';
}

export function extractArticleBody(html: string): string {
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  return match ? match[1].trim() : '';
}

export function extractImages(htmlBody: string): BlogImage[] {
  const figureRegex = /<figure[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/g;
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*/g;

  const images: BlogImage[] = [];
  const seenUrls = new Set<string>();
  let position = 0;

  // First pass: extract from <figure> blocks (preferred, has captions)
  let match;
  while ((match = figureRegex.exec(htmlBody)) !== null) {
    const url = match[1];
    if (!seenUrls.has(url) && !url.includes('svg')) {
      seenUrls.add(url);
      images.push({
        url,
        alt: match[2] || '',
        caption: match[3]?.replace(/<[^>]+>/g, '').trim() || '',
        position: position++,
        isFeatured: position === 1,
      });
    }
  }

  // Second pass: catch any standalone <img> not in <figure>
  while ((match = imgRegex.exec(htmlBody)) !== null) {
    const url = match[1];
    if (!seenUrls.has(url) && !url.includes('svg')) {
      seenUrls.add(url);
      images.push({
        url,
        alt: match[2] || '',
        caption: '',
        position: position++,
        isFeatured: images.length === 0,
      });
    }
  }

  return images;
}

export function calculateMetrics(htmlBody: string): PostMetrics {
  const textOnly = htmlBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textOnly.split(' ').filter(w => w.length > 0);

  return {
    wordCount: words.length,
    emDashCount: (htmlBody.match(/\u2014/g) || []).length,
    externalLinkCount: (htmlBody.match(/target="_blank"/g) || []).length,
    internalLinkCount: (htmlBody.match(/href="\/[a-z]/g) || []).length,
    h2Count: (htmlBody.match(/<h2[\s>]/g) || []).length,
    h3Count: (htmlBody.match(/<h3[\s>]/g) || []).length,
    faqCount: (htmlBody.match(/<h3[^>]*>.*?\?.*?<\/h3>/g) || []).length,
    svgCount: (htmlBody.match(/<svg[\s>]/g) || []).length,
    imageCount: (htmlBody.match(/<img[\s>]/g) || []).length,
    bannedWordsFound: findBannedWords(textOnly),
  };
}

export function findBannedWords(text: string): string[] {
  const lower = text.toLowerCase();
  return BANNED_WORDS.filter(word => lower.includes(word.toLowerCase()));
}

// ---- Utility Functions ----

export function replaceImageUrl(html: string, oldUrl: string, newUrl: string): string {
  return html.split(oldUrl).join(newUrl);
}

// ---- Link Extraction ----

export interface BlogLink {
  url: string;
  anchorText: string;
  type: 'internal' | 'external';
  isTargetBlank: boolean;
  position: number;
  fullTag: string; // The complete <a ...>text</a> for precise replacement
}

export function extractLinks(htmlBody: string, clientDomain?: string): BlogLink[] {
  const linkRegex = /<a\s+([^>]*?)href="([^"]+)"([^>]*?)>([\s\S]*?)<\/a>/gi;
  const links: BlogLink[] = [];
  let match;
  let position = 0;

  while ((match = linkRegex.exec(htmlBody)) !== null) {
    const beforeHref = match[1] || '';
    const url = match[2];
    const afterHref = match[3] || '';
    const anchorText = match[4].replace(/<[^>]+>/g, '').trim();
    const fullAttrs = beforeHref + afterHref;
    const isTargetBlank = fullAttrs.includes('target="_blank"');

    // Classify: internal vs external
    let type: 'internal' | 'external' = 'external';
    if (url.startsWith('/') && !url.startsWith('//')) {
      type = 'internal';
    } else if (clientDomain && url.includes(clientDomain)) {
      type = 'internal';
    } else if (url.startsWith('#')) {
      continue; // Skip anchor links
    }

    links.push({
      url,
      anchorText: anchorText || url,
      type,
      isTargetBlank,
      position: position++,
      fullTag: match[0],
    });
  }

  return links;
}

export function replaceLinkUrl(html: string, oldUrl: string, newUrl: string): string {
  // Replace the URL inside href="..." preserving the rest of the tag
  return html.split(`href="${oldUrl}"`).join(`href="${newUrl}"`);
}

export function rebuildFullHTML(
  seo: SEOFields,
  jsonLd: string,
  htmlBody: string
): string {
  const tagStr = seo.tags.length > 0 ? seo.tags.join(', ') : '';

  return `<!-- ============================================================
  SEO META
  SEO Title:        ${seo.seoTitle}
  Meta description: ${seo.metaDescription}
  Focus keyphrase:  ${seo.focusKeyphrase}
  URL Slug:         ${seo.urlSlug}
  Canonical:        ${seo.canonical}
  Featured Image:   ${seo.featuredImageUrl}
  Featured Image Alt: ${seo.featuredImageAlt}
  Category:         ${seo.category}
  Tags:             ${tagStr}
============================================================ -->

<script type="application/ld+json">
${jsonLd}
</script>

<article>
${htmlBody}
</article>`;
}
