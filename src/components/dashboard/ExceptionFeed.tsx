import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, AlertOctagon, Info } from "lucide-react";

interface ExceptionRow {
  severity: "P1" | "P2" | "P3" | string;
  title: string;
  subtitle?: string;
  entity_type: string;
  entity_id: string;
  entity_link?: string;
  dedupe_key: string;
  created_at: string;
}

interface ExceptionFeedProps {
  rows: ExceptionRow[];
  loading?: boolean;
}

// v3.0 Wave 3 (2026-07-01): live P1/P2/P3 severity feed on the Command Center.
// Polls every 15s via parent hook.
export function ExceptionFeed({ rows, loading }: ExceptionFeedProps) {
  const { t } = useI18n();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          {t("Loading exceptions…")}
        </CardContent>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          {t("No exceptions in the last hour.")}
        </CardContent>
      </Card>
    );
  }

  const iconFor = (sev: string) =>
    sev === "P1" ? <AlertOctagon className="h-4 w-4 text-red-500" />
    : sev === "P2" ? <AlertTriangle className="h-4 w-4 text-amber-500" />
    : <Info className="h-4 w-4 text-muted-foreground" />;

  const severityColor = (sev: string) =>
    sev === "P1" ? "bg-red-500/10 border-red-500/30"
    : sev === "P2" ? "bg-amber-500/10 border-amber-500/30"
    : "bg-secondary/30 border-border";

  return (
    <Card>
      <CardContent className="p-2 max-h-[520px] overflow-y-auto">
        <div className="space-y-1.5">
          {rows.map((r) => (
            <button
              key={r.dedupe_key}
              onClick={() => r.entity_link && navigate(r.entity_link)}
              className={`w-full text-left p-2.5 rounded-md border transition-colors hover:bg-secondary/50 ${severityColor(r.severity)}`}
            >
              <div className="flex items-start gap-2">
                <div className="shrink-0 mt-0.5">{iconFor(r.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{r.severity}</span>
                    <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  </div>
                  {r.subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.subtitle}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
