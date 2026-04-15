import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  user_id: string;
  product_handle: string;
  frequency: string;
  status: string;
  discount_percent: number;
  current_period_end: string | null;
  created_at: string;
  subscription_ref: string | null;
  profiles: { email: string | null; full_name: string | null } | null;
}

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("subscriptions")
      .select("*, profiles(email, full_name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSubs((data as any) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-heading font-bold text-foreground">Subscriptions</h1>
        <span className="ml-auto text-sm text-muted-foreground">{subs.length} total</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : subs.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No subscriptions yet.</p>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Next Billing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="text-sm font-medium">{(s.profiles as any)?.email || "—"}</div>
                    <div className="text-xs text-muted-foreground">{(s.profiles as any)?.full_name || ""}</div>
                  </TableCell>
                  <TableCell className="font-medium">{s.product_handle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.frequency.replace("_", " ")}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "active" ? "default" : "secondary"}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{s.discount_percent}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.current_period_end
                      ? new Date(s.current_period_end).toLocaleDateString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
