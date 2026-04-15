import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  'https://pplolmxyagikhhhzruul.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbG9sbXh5YWdpa2hoaHpydXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTc4OTcsImV4cCI6MjA5MTc5Mzg5N30.Wpgs9Dyp4jeNDbDKeaAZvyZG_taSmZ59Xq14uwBBXPE'
);

const posts = JSON.parse(readFileSync(join(process.env.HOME, 'Desktop', 'mk-blog-editor', 'scripts', 'parsed-posts.json'), 'utf8'));

async function importAll() {
  console.log(`Importing ${posts.length} posts...\n`);
  let success = 0;
  let failed = 0;

  for (const p of posts) {
    const { data, error } = await supabase.from('posts').insert({
      client_id: p.client_id,
      title: p.title || 'Untitled',
      slug: p.slug,
      status: 'draft',
      seo_title: p.seo_title || null,
      meta_description: p.meta_description || null,
      focus_keyphrase: p.focus_keyphrase || null,
      canonical_url: p.canonical_url || null,
      url_slug: p.slug,
      category: p.category || null,
      tags: p.tags || [],
      og_title: p.og_title || null,
      og_description: p.og_description || null,
      og_image: p.og_image || null,
      featured_image_url: p.featured_image_url || null,
      featured_image_alt: p.featured_image_alt || null,
      html_body: p.html_body,
      json_ld: p.json_ld || null,
      source_file_path: p.source_file_path || null,
    }).select('id');

    if (error) {
      console.log(`FAIL: ${p.slug} - ${error.message}`);
      failed++;
    } else {
      console.log(`OK: ${p.slug}`);
      success++;
    }
  }

  console.log(`\nDone: ${success} imported, ${failed} failed`);
}

importAll().catch(console.error);
