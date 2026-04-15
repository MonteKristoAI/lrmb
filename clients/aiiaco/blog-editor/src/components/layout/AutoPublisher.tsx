"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

/**
 * AutoPublisher listens for posts that get moved to "approved" by pg_cron
 * and triggers the actual publish API call (WP REST / GitHub).
 *
 * This runs in the background while the editor is open.
 * When the editor is closed, posts stay as "approved" and will be
 * picked up the next time someone opens the dashboard.
 */
export function AutoPublisher() {
  const supabase = createClient();

  useEffect(() => {
    // Check for approved posts on mount
    checkAndPublish();

    // Listen for realtime changes to posts table
    const channel = supabase
      .channel("auto-publish")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
          filter: "status=eq.approved",
        },
        (payload) => {
          // A post was just approved (possibly by pg_cron)
          const post = payload.new as { id: string; title: string; notes: string };
          if (post.notes?.includes("[cron]")) {
            // This was a cron-triggered approval, auto-publish it
            publishPost(post.id, post.title);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function checkAndPublish() {
    // Find any posts stuck in "approved" from previous cron runs
    const { data: posts } = await supabase
      .from("posts")
      .select("id, title, notes")
      .eq("status", "approved")
      .like("notes", "%[cron]%");

    if (posts && posts.length > 0) {
      toast.info(`Found ${posts.length} scheduled post(s) ready to publish`);
      for (const post of posts) {
        await publishPost(post.id, post.title);
      }
    }
  }

  async function publishPost(postId: string, title: string) {
    toast.loading(`Publishing: ${title}...`, { id: postId });

    try {
      const { publishPost: doPublish } = await import("@/lib/actions/publish");
      const result = await doPublish(postId);

      if (result.success) {
        toast.success(`Published: ${title}`, { id: postId });
      } else {
        toast.error(`Failed: ${title} - ${result.error}`, { id: postId });
      }
    } catch (err: any) {
      toast.error(`Error publishing ${title}: ${err.message}`, { id: postId });
    }
  }

  // This component renders nothing - it's a background listener
  return null;
}
