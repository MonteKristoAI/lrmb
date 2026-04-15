import { AppShell } from "@/components/layout/AppShell";
import { useInspections } from "@/hooks/useInspections";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { INSPECTION_STATUS_LABELS } from "@/types/inspection";

const InspectionQueue = () => {
  const { data: inspections = [], isLoading } = useInspections();
  const navigate = useNavigate();

  return (
    <AppShell title="Inspections">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />) : (
          inspections.length ? inspections.map((ins) => (
            <Card key={ins.id} className="cursor-pointer hover:bg-secondary/50 tap-target" onClick={() => navigate(`/inspections/${ins.id}`)}>
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-foreground">{ins.inspection_templates?.name || "Inspection"}</p>
                  <Badge variant="outline" className="text-xs">{INSPECTION_STATUS_LABELS[ins.status]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{ins.properties?.name}{ins.units ? ` - ${ins.units.short_name || ins.units.unit_code}` : ""}</p>
              </CardContent>
            </Card>
          )) : <p className="text-muted-foreground text-center py-8">No inspections.</p>
        )}
      </div>
    </AppShell>
  );
};

export default InspectionQueue;
