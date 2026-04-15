import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  'https://pplolmxyagikhhhzruul.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbG9sbXh5YWdpa2hoaHpydXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTc4OTcsImV4cCI6MjA5MTc5Mzg5N30.Wpgs9Dyp4jeNDbDKeaAZvyZG_taSmZ59Xq14uwBBXPE'
);

const posts = JSON.parse(readFileSync(join(process.env.HOME, 'Desktop', 'mk-blog-editor', 'scripts', 'parsed-posts.json'), 'utf8'));

async function updateAll() {
  let success = 0;
  for (const p of posts) {
    const { error } = await supabase
      .from('posts')
      .update({ html_body: p.html_body })
      .eq('slug', p.slug)
      .eq('client_id', p.client_id);

    if (error) {
      console.log(`FAIL: ${p.slug} - ${error.message}`);
    } else {
      console.log(`Updated: ${p.slug}`);
      success++;
    }
  }
  console.log(`\nDone: ${success}/${posts.length} updated`);
}

updateAll().catch(console.error);
