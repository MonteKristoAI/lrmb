import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Building, Star, AlertTriangle, ChevronRight, Search } from "lucide-react";

interface PropertyRow {
  property_id: string;
  property_name: string;
  health_score: number;
  health_band: string;
  risk_band: string;
  arrivals_next_24h: number;
  vip_arrivals_next_48h: number;
  overdue_wo_count: number;
  blocked_wo_count: number;
  active_wo_count: number;
}

interface PropertiesOverviewBundle {
  properties: PropertyRow[];
  computed_at: string;
}

// v3.0 Wave 2 (2026-07-01): Admin properties overview at /admin/properties.
// Uses properties_overview_bundle RPC returning property + health + risk rows.
const AdminPropertiesOverview = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const { data: bundle, isLoading } = useQuery({
    queryKey: ["properties_overview_bundle"],
    queryFn: async (): Promise<PropertiesOverviewBundle> => {
      const { data, error } = await supabase.rpc("properties_overview_bundle");
      if (error) throw error;
      return (data ?? {}) as unknown as PropertiesOverviewBundle;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const filtered = (bundle?.properties ?? []).filter((p) =>
    !filter || p.property_name.toLowerCase().includes(filter.toLowerCase())
  );

  const bandColor = (b: string) =>
    b === "critical"
      ? "bg-red-500/20 text-red-400 border-red-500/40"
      : b === "at_risk"
        ? "bg-orange-500/15 text-orange-500 border-orange-500/30"
        : b === "watch"
          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
          : "bg-green-500/15 text-green-500 border-green-500/30";

  return (
    <AppShell title={t("Properties")}>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={t("Filter properties")}
              className="pl-7 h-8 text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground ml-auto">
            {filtered.length} {t("of")} {bundle?.properties.length ?? 0}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filtered.map((p) => (
                  <button
                    key={p.property_id}
                    onClick={() => navigate(`/admin/properties/${p.property_id}`)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground truncate">{p.property_name}</p>
                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${bandColor(p.risk_band)}`}>
                          {t(p.risk_band === "critical" ? "Critical" : p.risk_band === "at_risk" ? "At Risk" : p.risk_band === "watch" ? "Watch" : "Healthy")}
                        </Badge>
                        {p.vip_arrivals_next_48h > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                            <Star className="h-2.5 w-2.5 mr-1" />
                            {p.vip_arrivals_next_48h} VIP
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1">
                        <span className="whitespace-nowrap">
                          {t("Health")}: <span className="text-foreground font-semibold">{p.health_score}</span>
                        </span>
                        <span className="whitespace-nowrap">{p.active_wo_count} {t("active WO")}</span>
                        {p.overdue_wo_count > 0 && (
                          <span className="text-red-400 flex items-center gap-1 whitespace-nowrap">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            {p.overdue_wo_count} {t("overdue")}
                          </span>
                        )}
                        <span className="whitespace-nowrap">{p.arrivals_next_24h} {t("arriving 24h")}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">{t("No matching properties.")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
};

export default AdminPropertiesOverview;
