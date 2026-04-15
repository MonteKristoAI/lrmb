import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { GlobalStats } from "@/components/dashboard/GlobalStats";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch clients
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("active", true)
    .order("name");

  // Fetch post counts per client
  const { data: posts } = await supabase
    .from("posts")
    .select("client_id, status");

  // Aggregate counts
  const postCounts = new Map<string, { total: number; draft: number; published: number; scheduled: number }>();
  (posts || []).forEach((p) => {
    const existing = postCounts.get(p.client_id) || { total: 0, draft: 0, published: 0, scheduled: 0 };
    existing.total++;
    if (p.status === "draft" || p.status === "review") existing.draft++;
    if (p.status === "published") existing.published++;
    if (p.status === "scheduled") existing.scheduled++;
    postCounts.set(p.client_id, existing);
  });

  const totalPosts = posts?.length || 0;
  const totalDrafts = posts?.filter(p => p.status === "draft" || p.status === "review").length || 0;
  const totalPublished = posts?.filter(p => p.status === "published").length || 0;
  const totalScheduled = posts?.filter(p => p.status === "scheduled").length || 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-poppins)] text-2xl font-semibold">
          Blog Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Manage blog posts across all clients
        </p>
      </div>

      {/* Global Stats */}
      <GlobalStats
        totalPosts={totalPosts}
        drafts={totalDrafts}
        published={totalPublished}
        scheduled={totalScheduled}
      />

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {(clients || []).map((client) => {
          const counts = postCounts.get(client.id) || { total: 0, draft: 0, published: 0, scheduled: 0 };
          return (
            <ClientCard
              key={client.id}
              client={client}
              postCount={counts.total}
              draftCount={counts.draft}
              publishedCount={counts.published}
              scheduledCount={counts.scheduled}
            />
          );
        })}
      </div>
    </div>
  );
}
