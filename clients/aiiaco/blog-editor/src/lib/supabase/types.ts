// Database types for MK Blog Editor
// These match the Supabase schema exactly

export interface Client {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo_url: string | null;
  brand_primary: string;
  brand_accent: string;
  platform: 'wordpress' | 'cloudflare-pages' | 'manual';
  wp_api_url: string | null;
  wp_username: string | null;
  wp_password_vault_id: string | null;
  github_owner: string | null;
  github_repo: string | null;
  github_branch: string;
  github_token_vault_id: string | null;
  preview_css_urls: string[] | null;
  preview_css_custom: string | null;
  preview_wrapper_html: string | null;
  preview_body_class: string | null;
  post_url_pattern: string;
  internal_link_prefix: string;
  scheduling_pattern: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  client_id: string;
  title: string;
  slug: string;
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'failed';
  scheduled_at: string | null;
  published_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyphrase: string | null;
  canonical_url: string | null;
  url_slug: string | null;
  category: string | null;
  tags: string[];
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string;
  twitter_card: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  body_images: Array<{ url: string; alt: string; caption: string; placeholder_id?: string }>;
  html_body: string;
  json_ld: string | null;
  full_source: string | null;
  word_count: number;
  quality_score: number | null;
  em_dash_count: number;
  banned_words_found: string[];
  external_link_count: number;
  internal_link_count: number;
  wp_post_id: number | null;
  wp_post_url: string | null;
  github_sha: string | null;
  source_file_path: string | null;
  notes: string | null;
  last_edited_by: string | null;
  publish_attempts: number;
  last_publish_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  post_id: string | null;
  client_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  performed_by: string;
  performed_at: string;
}

export interface AIConversation {
  id: string;
  post_id: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  model: string;
  total_input_tokens: number;
  total_output_tokens: number;
  created_at: string;
  updated_at: string;
}

// Joined types
export interface PostWithClient extends Post {
  clients: Client;
}

export interface ClientWithPostCount extends Client {
  post_count: number;
  draft_count: number;
  published_count: number;
  scheduled_count: number;
}
