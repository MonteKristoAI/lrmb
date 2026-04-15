/**
 * Bulk Import Script
 *
 * Imports all .html blog post files from Blog/clients/{slug}/posts/ into Supabase.
 * Run with: npx tsx scripts/bulk-import.ts
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";
import { config } from "dotenv";

// Load env
config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Blog parser (inline since we can't use path aliases in scripts)
function extractSEOFields(html: string) {
  const commentMatch = html.match(/<!--[\s\S]*?-->/);
  if (!commentMatch) return {};
  const comment = commentMatch[0];

  const extract = (key: string): string => {
    const regex = new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, "i");
    const match = comment.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    seo_title: extract("SEO Title").replace(/\s*\[\d+\s*chars?\]$/, ""),
    meta_description: extract("Meta description"),
    focus_keyphrase: extract("Focus keyphrase"),
    url_slug: extract("URL Slug"),
    canonical_url: extract("Canonical"),
    featured_image_url: extract("Featured Image"),
    featured_image_alt: extract("Featured Image Alt"),
    category: extract("Category"),
    tags: extract("Tags").split(",").map((t: string) => t.trim()).filter(Boolean),
    og_title: extract("OG Title") || extract("og:title"),
    og_description: extract("OG Description") || extract("og:description"),
    og_image: extract("OG Image") || extract("og:image"),
  };
}

function extractJsonLD(html: string): string {
  const match = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return match ? match[1].trim() : "";
}

function extractArticleBody(html: string): string {
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  return match ? match[1].trim() : "";
}

const BLOG_ROOT = join(process.env.HOME || "", "Desktop", "MonteKristo AI", "Blog", "clients");

async function importClient(clientSlug: string) {
  const postsDir = join(BLOG_ROOT, clientSlug, "posts");

  if (!existsSync(postsDir)) {
    console.log(`  No posts directory for ${clientSlug}`);
    return 0;
  }

  // Get client ID
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("slug", clientSlug)
    .single();

  if (!client) {
    console.log(`  Client ${clientSlug} not found in DB`);
    return 0;
  }

  const files = readdirSync(postsDir).filter((f: string) => f.endsWith(".html"));
  let imported = 0;

  for (const file of files) {
    const filePath = join(postsDir, file);
    const html = readFileSync(filePath, "utf-8");

    const seo = extractSEOFields(html);
    const jsonLd = extractJsonLD(html);
    const htmlBody = extractArticleBody(html);

    if (!htmlBody) {
      console.log(`  Skipping ${file}: no <article> body found`);
      continue;
    }

    const slug = seo.url_slug || basename(file, ".html").replace(/^blog\d+-/, "");
    const title = seo.seo_title || basename(file, ".html");

    // Check if already exists
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("client_id", client.id)
      .eq("slug", slug)
      .single();

    if (existing) {
      console.log(`  Skipping ${file}: slug "${slug}" already exists`);
      continue;
    }

    const { error } = await supabase.from("posts").insert({
      client_id: client.id,
      title,
      slug,
      status: "draft",
      seo_title: seo.seo_title,
      meta_description: seo.meta_description,
      focus_keyphrase: seo.focus_keyphrase,
      canonical_url: seo.canonical_url,
      url_slug: seo.url_slug,
      category: seo.category,
      tags: seo.tags,
      og_title: seo.og_title,
      og_description: seo.og_description,
      og_image: seo.og_image,
      featured_image_url: seo.featured_image_url,
      featured_image_alt: seo.featured_image_alt,
      html_body: htmlBody,
      json_ld: jsonLd,
      full_source: html,
      source_file_path: `Blog/clients/${clientSlug}/posts/${file}`,
    });

    if (error) {
      console.log(`  ERROR importing ${file}: ${error.message}`);
    } else {
      console.log(`  Imported: ${file} -> ${slug}`);
      imported++;
    }
  }

  return imported;
}

async function main() {
  console.log("MK Blog Editor - Bulk Import");
  console.log("============================\n");

  const clients = ["reig-solar", "breathmastery", "luxeshutters", "gummygurl", "entouragess", "sds", "aiiaco"];
  let totalImported = 0;

  for (const slug of clients) {
    console.log(`\nProcessing ${slug}...`);
    const count = await importClient(slug);
    totalImported += count;
    console.log(`  -> ${count} posts imported`);
  }

  console.log(`\n============================`);
  console.log(`Total imported: ${totalImported} posts`);
}

main().catch(console.error);
