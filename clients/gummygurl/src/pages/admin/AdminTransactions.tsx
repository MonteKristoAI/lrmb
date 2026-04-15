import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderRow {
  id: string;
  email: string;
  total: number;
  status: string;
  woo_order_id: number | null;
  transaction_id: string | null;
  created_at: string;
  items: Array<{ title: string; quantity: number; price: number }>;
}

export default function AdminTransactions() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await (
      supabase
        .from("orders" as any)
        .select("*")
        .in("status", ["paid", "processing", "completed"])
        .order("created_at", { ascending: false }) as any
    );
    if (!error) setOrders((data || []) as OrderRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const statusColors: Record<string, string> = {
    paid: "bg-blue-100 text-blue-800",
    processing: "bg-primary/10 text-primary",
    completed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    pending_payment: "bg-amber-100 text-amber-800",
    declined: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <DollarSign className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-heading font-bold text-foreground">Orders & Transactions</h1>
        <span className="text-sm text-muted-foreground">
          {orders.length} orders - ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} revenue
        </span>
        <Button size="sm" variant="outline" onClick={fetchOrders} className="ml-auto gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet.</p>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>WC Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{order.email}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {(order.items || []).map((i) => `${i.title} x${i.quantity}`).join(", ")}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ${Number(order.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`border-0 text-[10px] ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {order.woo_order_id ? `#${order.woo_order_id}` : "-"}
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
