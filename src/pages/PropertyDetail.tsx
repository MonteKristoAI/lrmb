import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { PropertyTaskList } from "@/components/property/PropertyTaskList";
import { Building, AlertTriangle, Timer, ClipboardList, MapPin, Star } from "lucide-react";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PropertyKpis {
  property: { id: string; name: string; region?: string; zone?: string; address?: string } | null;
  risk: { health_score: number; health_band: string; risk_band: string; vip_arrivals_next_48h: number; arrivals_next_24h: number } | null;
  active_wo_count: number;
  overdue_wo_count: number;
  avg_cycle_hours_30d: number;
  arrivals_today: Array<{ external_id: string; unit_code?: string; guest_name?: string; is_vip?: boolean; arrival_time?: string }>;
}

// v3.0 Wave 2 (2026-07-01): rich property detail page at /admin/properties/:id.
// Combines property_kpis RPC with the reused PropertyTaskList component.
const PropertyDetail = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const validId = id && UUID_RE.test(id);

  const { data: kpis, isLoading } = useQuery({
    enabled: !!validId,
    queryKey: ["property_kpis", id],
    queryFn: async (): Promise<PropertyKpis> => {
      const { data, error } = await supabase.rpc("property_kpis", { p_property_id: id });
      if (error) throw error;
      return (data ?? {}) as unknown as PropertyKpis;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  if (!validId) {
    return (
      <AppShell title={t("Property")}>
        <div className="p-4 text-center space-y-3">
          <p className="text-muted-foreground">{t("Invalid property URL.")}</p>
          <Link to="/admin/properties" className="text-primary underline text-sm">{t("Back to properties")}</Link>
        </div>
      </AppShell>
    );
  }

  const bandColor = (b: string) =>
    b === "critical" ? "bg-red-500/20 text-red-500 border-red-500/40"
    : b === "at_risk" ? "bg-orange-500/15 text-orange-500 border-orange-500/30"
    : b === "watch" ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
    : "bg-green-500/15 text-green-500 border-green-500/30";

  const propertyName = kpis?.property?.name ?? t("Property");

  return (
    <AppShell title={propertyName}>
      <div className="p-4 space-y-4">
        {isLoading ? (
          <Skeleton className="h-24" />
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-bold text-foreground">{propertyName}</h2>
                    {kpis?.risk && (
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${bandColor(kpis.risk.risk_band)}`}>
                        {t(kpis.risk.risk_band === "critical" ? "Critical" : kpis.risk.risk_band === "at_risk" ? "At Risk" : kpis.risk.risk_band === "watch" ? "Watch" : "Healthy")}
                      </Badge>
                    )}
                    {(kpis?.risk?.vip_arrivals_next_48h ?? 0) > 0 && (
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                        <Star className="h-2.5 w-2.5 mr-1" />
                        {kpis!.risk!.vip_arrivals_next_48h} VIP
                      </Badge>
                    )}
                  </div>
                  {kpis?.property?.address && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {kpis.property.address}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiTile
              label={t("Health")}
              value={kpis?.risk?.health_score ?? "—"}
              icon={Building}
              color={((kpis?.risk?.health_score ?? 0) < 70) ? "text-destructive" : "text-primary"}
            />
            <KpiTile
              label={t("Active WOs")}
              value={kpis?.active_wo_count ?? 0}
              icon={ClipboardList}
              color="text-primary"
            />
            <KpiTile
              label={t("Overdue")}
              value={kpis?.overdue_wo_count ?? 0}
              icon={AlertTriangle}
              color={(kpis?.overdue_wo_count ?? 0) > 0 ? "text-destructive" : "text-primary"}
            />
            <KpiTile
              label={t("Avg Cycle")}
              value={`${kpis?.avg_cycle_hours_30d ?? 0}h`}
              icon={Timer}
              color="text-primary"
              subtitle={t("30d")}
            />
          </div>
        )}

        {/* Arrivals today */}
        {!isLoading && kpis && kpis.arrivals_today.length > 0 && (
          <Card>
            <CardContent className="p-3">
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("Arrivals Today")}</h3>
              <div className="space-y-1.5">
                {kpis.arrivals_today.map((a) => (
                  <div key={a.external_id} className="flex items-center gap-2 text-sm">
                    {a.is_vip && <Star className="h-3 w-3 text-primary" />}
                    <span className="font-medium text-foreground">{a.guest_name || t("Guest")}</span>
                    <span className="text-xs text-muted-foreground">{a.unit_code}</span>
                    {a.arrival_time && (
                      <span className="text-xs text-muted-foreground ml-auto">{a.arrival_time}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">{t("Work Orders")}</h3>
          <PropertyTaskList propertyId={id!} />
        </div>
      </div>
    </AppShell>
  );
};

export default PropertyDetail;
