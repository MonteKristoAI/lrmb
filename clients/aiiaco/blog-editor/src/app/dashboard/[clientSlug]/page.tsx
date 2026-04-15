import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/posts/PostCard";
import { Plus, Upload } from "lucide-react";

export default async function ClientPostsPage({
  params,
}: {
  params: Promise<{ clientSlug: string }>;
}) {
  const { clientSlug } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch client
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", clientSlug)
    .single();

  if (!client) notFound();

  // Fetch posts for this client
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("client_id", client.id)
    .order("updated_at", { ascending: false });

  const statusGroups = {
    draft: (posts || []).filter(p => p.status === "draft" || p.status === "review"),
    approved: (posts || []).filter(p => p.status === "approved"),
    scheduled: (posts || []).filter(p => p.status === "scheduled"),
    published: (posts || []).filter(p => p.status === "published"),
    failed: (posts || []).filter(p => p.status === "failed"),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: client.brand_accent + "20", color: client.brand_accent }}
            >
              {client.name.charAt(0)}
            </div>
            <h1 className="font-[family-name:var(--font-poppins)] text-2xl font-semibold">
              {client.name}
            </h1>
          </div>
          <p className="text-white/40 text-sm">{client.domain} &middot; {posts?.length || 0} posts</p>
        </div>

        <Link
          href={`/dashboard/${clientSlug}/import`}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF5C5C] hover:bg-[#ff4444] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Import Post
        </Link>
      </div>

      {/* Post Groups */}
      {statusGroups.failed.length > 0 && (
        <Section title="Failed" count={statusGroups.failed.length} color="text-red-400">
          {statusGroups.failed.map(post => (
            <PostCard key={post.id} post={post} clientSlug={clientSlug} />
          ))}
        </Section>
      )}

      {statusGroups.draft.length > 0 && (
        <Section title="Drafts" count={statusGroups.draft.length} color="text-amber-400">
          {statusGroups.draft.map(post => (
            <PostCard key={post.id} post={post} clientSlug={clientSlug} />
          ))}
        </Section>
      )}

      {statusGroups.approved.length > 0 && (
        <Section title="Approved" count={statusGroups.approved.length} color="text-blue-400">
          {statusGroups.approved.map(post => (
            <PostCard key={post.id} post={post} clientSlug={clientSlug} />
          ))}
        </Section>
      )}

      {statusGroups.scheduled.length > 0 && (
        <Section title="Scheduled" count={statusGroups.scheduled.length} color="text-violet-400">
          {statusGroups.scheduled.map(post => (
            <PostCard key={post.id} post={post} clientSlug={clientSlug} />
          ))}
        </Section>
      )}

      {statusGroups.published.length > 0 && (
        <Section title="Published" count={statusGroups.published.length} color="text-emerald-400">
          {statusGroups.published.map(post => (
            <PostCard key={post.id} post={post} clientSlug={clientSlug} />
          ))}
        </Section>
      )}

      {(posts || []).length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm mb-4">No posts yet for this client.</p>
          <Link
            href={`/dashboard/${clientSlug}/import`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Import your first post
          </Link>
        </div>
      )}
    </div>
  );
}

function Section({ title, count, color, children }: { title: string; count: number; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className={`text-sm font-medium ${color}`}>{title}</h2>
        <span className="text-xs text-white/20 bg-white/5 px-1.5 py-0.5 rounded">{count}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}
