import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PostEditorClient } from "@/components/editor/PostEditorClient";

export default async function PostEditorPage({
  params,
}: {
  params: Promise<{ clientSlug: string; postId: string }>;
}) {
  const { clientSlug, postId } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch client
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", clientSlug)
    .single();

  if (!client) notFound();

  // Fetch post
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("client_id", client.id)
    .single();

  if (!post) notFound();

  return <PostEditorClient post={post} client={client} />;
}
