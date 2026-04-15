import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { publishToWordPress, publishToCloudflare } from "@/lib/actions/publish";

// This runs as a Vercel Cron Job (see vercel.json)
// Schedule: every hour at minute 0

export async function GET(request: Request) {
  // Verify cron secret (Vercel sets this header)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role client (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find posts ready to publish
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, client_id, clients(platform)")
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ published: 0, message: "No posts due for publishing" });
  }

  const results: Array<{ postId: string; success: boolean; error?: string }> = [];

  for (const post of posts) {
    try {
      const platform = (post as any).clients?.platform;

      let result;
      if (platform === "wordpress") {
        result = await publishToWordPress(post.id);
      } else if (platform === "cloudflare-pages") {
        result = await publishToCloudflare(post.id);
      } else {
        // Manual: just mark as published
        await supabase.from("posts").update({
          status: "published",
          published_at: new Date().toISOString(),
        }).eq("id", post.id);
        result = { success: true };
      }

      results.push({ postId: post.id, success: result.success, error: result.error });
    } catch (err: any) {
      // Mark as failed
      await supabase.from("posts").update({
        status: "failed",
        last_publish_error: err.message,
      }).eq("id", post.id);

      results.push({ postId: post.id, success: false, error: err.message });
    }
  }

  const successCount = results.filter((r) => r.success).length;

  return NextResponse.json({
    published: successCount,
    failed: results.length - successCount,
    results,
  });
}
