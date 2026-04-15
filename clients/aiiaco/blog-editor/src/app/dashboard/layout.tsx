import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  // Auth check (server-side, uses getUser not getSession)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch clients for sidebar
  const { data: clients } = await supabase
    .from("clients")
    .select("name, slug, brand_accent, platform")
    .eq("active", true)
    .order("name");

  return (
    <div className="flex min-h-screen">
      <Sidebar clients={clients || []} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
