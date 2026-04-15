"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkQualityGates } from "@/lib/utils/quality-gates";
import { rebuildFullHTML } from "@/lib/blog-parser";
import type { Post, Client } from "@/lib/supabase/types";

// ============================================================
// WordPress Publish
// ============================================================

export async function publishToWordPress(postId: string): Promise<{
  success: boolean;
  wpPostId?: number;
  wpUrl?: string;
  error?: string;
}> {
  const supabase = await createServerSupabaseClient();

  // 1. Fetch post + client
  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (postErr || !post) return { success: false, error: "Post not found" };

  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .select("*")
    .eq("id", post.client_id)
    .single();

  if (clientErr || !client) return { success: false, error: "Client not found" };
  if (client.platform !== "wordpress") return { success: false, error: "Client is not WordPress" };
  if (!client.wp_api_url || !client.wp_username) return { success: false, error: "WordPress credentials not configured" };

  // 2. Quality gate check
  const gates = checkQualityGates(post);
  if (!gates.blockersPassed) {
    return { success: false, error: "Quality gates failed: " + gates.gates.filter(g => !g.passed && g.severity === "blocker").map(g => g.name).join(", ") };
  }

  // 3. Get WP password from Vault (or fallback to env)
  let wpPassword = process.env.WP_DEFAULT_APP_PASSWORD || "";
  if (client.wp_password_vault_id) {
    try {
      const { data: secret } = await supabase.rpc("vault_read_secret", {
        secret_id: client.wp_password_vault_id,
      });
      if (secret) wpPassword = secret;
    } catch {
      // Vault not available, use env fallback
    }
  }

  if (!wpPassword) return { success: false, error: "WordPress password not found" };

  const authHeader = "Basic " + Buffer.from(`${client.wp_username}:${wpPassword}`).toString("base64");

  // 4. Upload featured image if set
  let featuredMediaId: number | null = null;
  if (post.featured_image_url) {
    try {
      const imageResp = await fetch(post.featured_image_url);
      if (imageResp.ok) {
        const imageBuffer = Buffer.from(await imageResp.arrayBuffer());
        const filename = post.featured_image_url.split("/").pop()?.split("?")[0] || "featured.jpg";
        const contentType = imageResp.headers.get("content-type") || "image/jpeg";

        const mediaResp = await fetch(`${client.wp_api_url}/media`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": contentType,
          },
          body: imageBuffer,
        });

        if (mediaResp.ok) {
          const media = await mediaResp.json();
          featuredMediaId = media.id;
        }
      }
    } catch {
      // Image upload failed, continue without featured image
    }
  }

  // 5. Build WP post payload
  const wpStatus = post.status === "scheduled" ? "future" : "publish";
  const wpPayload: Record<string, unknown> = {
    title: post.seo_title || post.title,
    content: post.html_body,
    status: wpStatus,
    slug: post.slug,
    excerpt: post.meta_description || "",
  };

  if (wpStatus === "future" && post.scheduled_at) {
    wpPayload.date = post.scheduled_at;
  }
  if (featuredMediaId) {
    wpPayload.featured_media = featuredMediaId;
  }

  // 6. Create or update post
  const endpoint = post.wp_post_id
    ? `${client.wp_api_url}/posts/${post.wp_post_id}`
    : `${client.wp_api_url}/posts`;
  const method = post.wp_post_id ? "PUT" : "POST";

  const wpResp = await fetch(endpoint, {
    method,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wpPayload),
  });

  if (!wpResp.ok) {
    const errBody = await wpResp.text();
    await logActivity(supabase, postId, client.id, "publish_failed", {
      platform: "wordpress",
      status: wpResp.status,
      error: errBody.slice(0, 500),
    });
    return { success: false, error: `WP API ${wpResp.status}: ${errBody.slice(0, 200)}` };
  }

  const wpPost = await wpResp.json();

  // 7. Update post record
  await supabase.from("posts").update({
    status: "published",
    published_at: new Date().toISOString(),
    wp_post_id: wpPost.id,
    wp_post_url: wpPost.link,
    publish_attempts: (post.publish_attempts || 0) + 1,
    last_publish_error: null,
  }).eq("id", postId);

  await logActivity(supabase, postId, client.id, "published", {
    platform: "wordpress",
    wp_post_id: wpPost.id,
    wp_url: wpPost.link,
    featured_media_id: featuredMediaId,
  });

  return { success: true, wpPostId: wpPost.id, wpUrl: wpPost.link };
}

// ============================================================
// Cloudflare Pages Publish (via GitHub API)
// ============================================================

export async function publishToCloudflare(postId: string): Promise<{
  success: boolean;
  sha?: string;
  error?: string;
}> {
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase.from("posts").select("*").eq("id", postId).single();
  if (!post) return { success: false, error: "Post not found" };

  const { data: client } = await supabase.from("clients").select("*").eq("id", post.client_id).single();
  if (!client) return { success: false, error: "Client not found" };
  if (client.platform !== "cloudflare-pages") return { success: false, error: "Client is not CF Pages" };
  if (!client.github_owner || !client.github_repo) return { success: false, error: "GitHub repo not configured" };

  // Quality gate check
  const gates = checkQualityGates(post);
  if (!gates.blockersPassed) {
    return { success: false, error: "Quality gates failed" };
  }

  // Get GitHub token
  let githubToken = process.env.GITHUB_TOKEN || "";
  if (client.github_token_vault_id) {
    try {
      const { data: secret } = await supabase.rpc("vault_read_secret", {
        secret_id: client.github_token_vault_id,
      });
      if (secret) githubToken = secret;
    } catch {
      // fallback to env
    }
  }

  if (!githubToken) return { success: false, error: "GitHub token not found" };

  // Rebuild full HTML file
  const fullHTML = rebuildFullHTML(
    {
      seoTitle: post.seo_title || post.title,
      metaDescription: post.meta_description || "",
      focusKeyphrase: post.focus_keyphrase || "",
      urlSlug: post.slug,
      canonical: post.canonical_url || "",
      featuredImageUrl: post.featured_image_url || "",
      featuredImageAlt: post.featured_image_alt || "",
      category: post.category || "",
      tags: post.tags || [],
      ogTitle: post.og_title || post.seo_title || "",
      ogDescription: post.og_description || post.meta_description || "",
      ogImage: post.og_image || post.featured_image_url || "",
      ogType: post.og_type || "article",
      twitterCard: post.twitter_card || "summary_large_image",
    },
    post.json_ld || "",
    post.html_body
  );

  const filePath = `posts/${post.slug}.html`;
  const content = Buffer.from(fullHTML).toString("base64");
  const branch = client.github_branch || "main";

  // Check if file exists (need SHA for update)
  let existingSha: string | null = null;
  const checkResp = await fetch(
    `https://api.github.com/repos/${client.github_owner}/${client.github_repo}/contents/${filePath}?ref=${branch}`,
    { headers: { Authorization: `token ${githubToken}`, "User-Agent": "MK-Blog-Editor" } }
  );
  if (checkResp.ok) {
    const existing = await checkResp.json();
    existingSha = existing.sha;
  }

  // Push file
  const payload: Record<string, unknown> = {
    message: `${existingSha ? "Update" : "Add"} post: ${post.title}`,
    content,
    branch,
  };
  if (existingSha) payload.sha = existingSha;

  const pushResp = await fetch(
    `https://api.github.com/repos/${client.github_owner}/${client.github_repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
        "User-Agent": "MK-Blog-Editor",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!pushResp.ok) {
    const errBody = await pushResp.text();
    await logActivity(supabase, postId, client.id, "publish_failed", {
      platform: "cloudflare-pages",
      status: pushResp.status,
      error: errBody.slice(0, 500),
    });
    return { success: false, error: `GitHub API ${pushResp.status}: ${errBody.slice(0, 200)}` };
  }

  const result = await pushResp.json();

  await supabase.from("posts").update({
    status: "published",
    published_at: new Date().toISOString(),
    github_sha: result.content?.sha,
    publish_attempts: (post.publish_attempts || 0) + 1,
    last_publish_error: null,
  }).eq("id", postId);

  await logActivity(supabase, postId, client.id, "published", {
    platform: "cloudflare-pages",
    sha: result.content?.sha,
    repo: `${client.github_owner}/${client.github_repo}`,
  });

  return { success: true, sha: result.content?.sha };
}

// ============================================================
// Unified publish dispatcher
// ============================================================

export async function publishPost(postId: string): Promise<{
  success: boolean;
  error?: string;
  details?: Record<string, unknown>;
}> {
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase.from("posts").select("client_id").eq("id", postId).single();
  if (!post) return { success: false, error: "Post not found" };

  const { data: client } = await supabase.from("clients").select("platform").eq("id", post.client_id).single();
  if (!client) return { success: false, error: "Client not found" };

  switch (client.platform) {
    case "wordpress":
      return publishToWordPress(postId);
    case "cloudflare-pages":
      return publishToCloudflare(postId);
    case "manual":
      // Just mark as published
      await supabase.from("posts").update({
        status: "published",
        published_at: new Date().toISOString(),
      }).eq("id", postId);
      return { success: true };
    default:
      return { success: false, error: `Unknown platform: ${client.platform}` };
  }
}

// ============================================================
// Activity log helper
// ============================================================

async function logActivity(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  postId: string,
  clientId: string,
  action: string,
  details: Record<string, unknown>
) {
  await supabase.from("activity_log").insert({
    post_id: postId,
    client_id: clientId,
    action,
    details,
    performed_by: "editor",
  });
}
