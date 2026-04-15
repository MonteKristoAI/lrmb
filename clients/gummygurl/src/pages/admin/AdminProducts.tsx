import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/hooks/useProducts";
import type { LocalProduct } from "@/lib/productService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Package, Search, Plus, Star } from "lucide-react";
import { toast } from "sonner";

type ProductStatus = "active" | "out_of_stock" | "restock_coming_soon" | "draft";

const STATUS_OPTIONS: { value: ProductStatus; label: string; color: string }[] = [
  { value: "active", label: "Active", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "out_of_stock", label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "restock_coming_soon", label: "Restock Soon", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-600 border-gray-200" },
];

interface Override {
  handle: string;
  is_available: boolean;
  status: string;
  is_featured: boolean;
  subscription_eligible: boolean;
}

interface CustomProduct {
  id: string;
  handle: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  compare_price: number | null;
  image_url: string | null;
  status: string;
  is_featured: boolean;
  subscription_eligible: boolean;
  created_at: string;
}

interface UnifiedProduct {
  handle: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  image: string | null;
  status: ProductStatus;
  is_featured: boolean;
  subscription_eligible: boolean;
  isCustom: boolean;
}

export default function AdminProducts() {
  const { products: allProducts, overrides: productOverrides, loading: productsLoading } = useProducts();
  const [localOverrides, setLocalOverrides] = useState<Record<string, Override>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Sync overrides from hook
  useEffect(() => {
    const map: Record<string, Override> = {};
    Object.entries(productOverrides).forEach(([handle, ov]: [string, any]) => {
      map[handle] = ov as Override;
    });
    setLocalOverrides(map);
    if (!productsLoading) setLoading(false);
  }, [productOverrides, productsLoading]);

  // Build unified list from synced products
  const unified: UnifiedProduct[] = allProducts.map((p): UnifiedProduct => {
    const ov = localOverrides[p.handle];
    return {
      handle: p.handle,
      title: p.title,
      brand: p.brand,
      category: p.category,
      price: p.price,
      image: p.image,
      status: (ov?.status as ProductStatus) || "active",
      is_featured: ov?.is_featured ?? false,
      subscription_eligible: ov?.subscription_eligible ?? false,
      isCustom: false,
    };
  });

  const filtered = unified.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.handle.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOverride = async (handle: string, field: string, value: any) => {
    setUpdating(handle);
    const existing = localOverrides[handle] || { handle, is_available: true, status: "active", is_featured: false, subscription_eligible: false };
    const updated = { ...existing, [field]: value, updated_at: new Date().toISOString() };
    
    // Sync is_available with status
    if (field === "status") {
      updated.is_available = value === "active";
    }

    const { error } = await (supabase.from("product_overrides" as any).upsert(updated as any, { onConflict: "handle" }) as any);
    if (error) {
      toast.error("Failed to update");
    } else {
      setLocalOverrides((prev) => ({ ...prev, [handle]: updated as Override }));
      toast.success("Updated");
    }
    setUpdating(null);
  };

  const getStatusBadge = (status: ProductStatus) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${opt.color}`}>{opt.label}</span>;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Package className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-heading font-bold text-foreground">Product Management</h1>
        <span className="text-sm text-muted-foreground">{unified.length} products</span>
        <Button asChild size="sm" className="ml-auto gap-1.5">
          <Link to="/admin/products/new"><Plus className="w-4 h-4" /> Add Product</Link>
        </Button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((product) => {
            const isUpdating = updating === product.handle;

            return (
              <div
                key={product.handle}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  product.status === "active"
                    ? "border-border bg-card"
                    : product.status === "draft"
                    ? "border-border/50 bg-muted/50"
                    : "border-amber-200/50 bg-amber-50/30"
                }`}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0"
                  />
                )}
                {!product.image && (
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm text-foreground truncate">{product.title}</p>
                    {product.is_featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {product.brand} · ${product.price.toFixed(2)} · {product.category}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                  {getStatusBadge(product.status)}

                  <Select
                    value={product.status}
                    onValueChange={(val) => updateOverride(product.handle, "status", val)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Featured</span>
                    <Switch
                      checked={product.is_featured}
                      onCheckedChange={(val) => updateOverride(product.handle, "is_featured", val)}
                    />
                  </div>

                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
