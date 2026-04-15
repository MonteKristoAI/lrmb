import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Users, CreditCard, DollarSign, Loader2, TrendingUp } from "lucide-react";

interface Stats {
  totalProducts: number;
  customProducts: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalTransactions: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [profilesRes, subsRes, wooRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
        (supabase.from("woo_products" as any).select("id", { count: "exact", head: true }).eq("woo_status", "publish") as any),
        (supabase.from("orders" as any).select("total").in("status", ["paid", "processing", "completed"]) as any),
      ]);

      const paidOrders = ordersRes.data || [];
      const revenue = paidOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

      setStats({
        totalProducts: wooRes.count || 0,
        customProducts: 0,
        totalUsers: profilesRes.count || 0,
        activeSubscriptions: subsRes.count || 0,
        totalTransactions: paidOrders.length,
        totalRevenue: revenue,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      sub: `${stats?.customProducts ?? 0} custom`,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Registered Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
    },
    {
      label: "Active Subscriptions",
      value: stats?.activeSubscriptions ?? 0,
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
    },
    {
      label: "Paid Transactions",
      value: stats?.totalTransactions ?? 0,
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-600/10",
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-600/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-6 flex items-start gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              {card.sub && <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
