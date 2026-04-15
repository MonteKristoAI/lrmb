import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const supabase = createClient(
  'https://pplolmxyagikhhhzruul.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbG9sbXh5YWdpa2hoaHpydXVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIxNzg5NywiZXhwIjoyMDkxNzkzODk3fQ.placeholder',
  // We'll use the anon key with a workaround
);

// Since we can't get service_role key, we'll generate SQL via MCP instead
// This script outputs the parsed data for manual SQL insert

const BLOG_ROOT = join(process.env.HOME, 'Desktop', 'MonteKristo AI', 'Blog', 'clients');

const CLIENT_IDS = {
  'reig-solar': '5fcacf48-2911-4e48-9939-09abe4f0de08',
  'breathmastery': 'ffbef2aa-0180-46ce-a390-4b7fd5964050',
  'gummygurl': '0acc41dc-effa-419b-8e4d-9160ce61b8c9',
};

function extractField(comment, key) {
  const regex = new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, 'i');
  const match = comment.match(regex);
  return match ? match[1].trim() : '';
}

function parsePost(html, clientSlug, filename) {
  const commentMatch = html.match(/<!--[\s\S]*?-->/);
  const comment = commentMatch ? commentMatch[0] : '';

  const bodyMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  const htmlBody = bodyMatch ? bodyMatch[1].trim() : '';

  const jsonLdMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const jsonLd = jsonLdMatch ? jsonLdMatch[1].trim() : '';

  const seoTitle = extractField(comment, 'SEO Title').replace(/\s*\[\d+\s*chars?\]$/, '');
  const slug = extractField(comment, 'URL Slug') || basename(filename, '.html').replace(/^blog\d+-/, '');

  return {
    client_id: CLIENT_IDS[clientSlug],
    title: seoTitle || basename(filename, '.html'),
    slug,
    seo_title: seoTitle,
    meta_description: extractField(comment, 'Meta description'),
    focus_keyphrase: extractField(comment, 'Focus keyphrase'),
    canonical_url: extractField(comment, 'Canonical'),
    category: extractField(comment, 'Category'),
    tags: extractField(comment, 'Tags').split(',').map(t => t.trim()).filter(Boolean),
    og_title: extractField(comment, 'OG Title') || extractField(comment, 'og:title'),
    og_description: extractField(comment, 'OG Description') || extractField(comment, 'og:description'),
    og_image: extractField(comment, 'OG Image') || extractField(comment, 'og:image'),
    featured_image_url: extractField(comment, 'Featured Image'),
    featured_image_alt: extractField(comment, 'Featured Image Alt'),
    html_body: htmlBody,
    json_ld: jsonLd,
    source_file_path: `Blog/clients/${clientSlug}/posts/${filename}`,
  };
}

// Collect all posts
const allPosts = [];

for (const [clientSlug, clientId] of Object.entries(CLIENT_IDS)) {
  const postsDir = join(BLOG_ROOT, clientSlug, 'posts');
  if (!existsSync(postsDir)) continue;

  const files = readdirSync(postsDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const html = readFileSync(join(postsDir, file), 'utf-8');
    const parsed = parsePost(html, clientSlug, file);
    if (parsed.html_body) {
      allPosts.push(parsed);
      console.log(`Parsed: ${clientSlug}/${file} -> ${parsed.slug}`);
    }
  }
}

console.log(`\nTotal: ${allPosts.length} posts parsed`);

// Output as JSON for import
const outputPath = join(process.env.HOME, 'Desktop', 'mk-blog-editor', 'scripts', 'parsed-posts.json');
import('fs').then(fs => {
  fs.writeFileSync(outputPath, JSON.stringify(allPosts, null, 2));
  console.log(`Saved to: ${outputPath}`);
});
