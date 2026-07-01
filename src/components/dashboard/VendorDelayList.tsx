import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { AlertTriangle, Truck } from "lucide-react";

interface VendorDelayRow {
  vendor_id: string;
  vendor_name: string;
  pending_count: number;
  sla_missed_count: number;
}

interface VendorDelayListProps {
  rows: VendorDelayRow[];
}

// v3.0 Wave 1 (2026-07-01): vendors falling behind, shown on Supervisor Today Brief.
// A vendor lands here when they have 3+ pending assignments or 1+ SLA-missed WOs.
export function VendorDelayList({ rows }: VendorDelayListProps) {
  const { t } = useI18n();

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          {t("No vendor delays today.")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-3">
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.vendor_id} className="flex items-center gap-3 p-2 rounded-md bg-secondary/30">
              <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.vendor_name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {r.pending_count} {t("pending")} · {r.sla_missed_count} {t("SLA missed")}
                </p>
              </div>
              {r.sla_missed_count > 0 && (
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
