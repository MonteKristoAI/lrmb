import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Loader2, LogOut, Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface OrderInfo {
  id: string;
  items: Array<{ handle: string; title: string; price: number; quantity: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  woo_order_id: number | null;
  created_at: string;
}

interface SubscriptionInfo {
  id: string;
  status: string;
  current_period_end: string;
  product_name: string;
  product_handle: string | null;
  frequency: string | null;
  amount: number;
  interval: string;
  interval_count: number;
}

export default function Account() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo[]>([]);
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await (
        supabase.from("orders" as any).select("*").order("created_at", { ascending: false }) as any
      );
      if (error) throw error;
      setOrders((data || []) as OrderInfo[]);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      // Read subscriptions from Supabase
      const { data, error } = await (
        supabase.from("subscriptions" as any).select("*").order("created_at", { ascending: false }) as any
      );
      if (error) throw error;

      const FREQ_LABELS: Record<string, { interval: string; interval_count: number }> = {
        "2_weeks": { interval: "week", interval_count: 2 },
        "1_month": { interval: "month", interval_count: 1 },
        "2_months": { interval: "month", interval_count: 2 },
        "3_months": { interval: "month", interval_count: 3 },
      };

      const mapped: SubscriptionInfo[] = (data || []).map((sub: any) => {
        const freq = FREQ_LABELS[sub.frequency] || FREQ_LABELS["1_month"];
        return {
          id: sub.id,
          status: sub.status,
          current_period_end: sub.current_period_end || new Date().toISOString(),
          product_name: sub.product_handle?.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Subscription",
          product_handle: sub.product_handle,
          frequency: sub.frequency,
          amount: 0, // Price stored on product, not subscription record
          interval: freq.interval,
          interval_count: freq.interval_count,
        };
      });

      setSubscriptions(mapped);
    } catch (err: any) {
      console.error("Failed to fetch subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subId: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      const { error } = await (
        supabase.from("subscriptions" as any).update({ status: "cancelled" }).eq("id", subId) as any
      );
      if (error) throw error;
      toast.success("Subscription cancelled");
      fetchSubscriptions();
    } catch (err) {
      toast.error("Failed to cancel subscription");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">My Account</h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Subscriptions
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Order History</h2>
                  <Button variant="ghost" size="sm" onClick={fetchOrders} disabled={ordersLoading}>
                    <RefreshCw className={`w-4 h-4 mr-1 ${ordersLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No orders yet.</p>
                    <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusColors: Record<string, string> = {
                        pending: "bg-amber-100 text-amber-800",
                        paid: "bg-blue-100 text-blue-800",
                        processing: "bg-primary/10 text-primary",
                        completed: "bg-emerald-100 text-emerald-800",
                        cancelled: "bg-red-100 text-red-800",
                      };
                      return (
                        <div key={order.id} className="p-4 bg-secondary/50 rounded-xl border border-border">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                  year: "numeric", month: "short", day: "numeric",
                                })}
                                {order.woo_order_id && (
                                  <span className="ml-2 font-medium">Order #{order.woo_order_id}</span>
                                )}
                              </p>
                            </div>
                            <Badge variant="secondary" className={`w-fit border-0 text-[10px] uppercase tracking-wider ${statusColors[order.status] || ""}`}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            {(order.items || []).map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-foreground">{item.title} x{item.quantity}</span>
                                <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                            <span className="text-muted-foreground">
                              Shipping: {order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : "FREE"}
                            </span>
                            <span className="font-semibold text-foreground">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Active Subscriptions</h2>
                  <Button variant="ghost" size="sm" onClick={fetchSubscriptions} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No active subscriptions yet.</p>
                    <Button onClick={() => navigate("/shop")}>Browse Products</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/50 rounded-xl border border-border"
                      >
                        <div>
                          <p className="font-medium text-foreground">{sub.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {sub.interval_count > 1 ? `Every ${sub.interval_count} ` : "Every "}
                            {sub.interval}{sub.interval_count > 1 ? "s" : ""} - 10% off
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Next billing: {new Date(sub.current_period_end).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`w-fit border-0 ${sub.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                            {sub.status}
                          </Badge>
                          {sub.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-destructive hover:text-destructive"
                              onClick={() => cancelSubscription(sub.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
