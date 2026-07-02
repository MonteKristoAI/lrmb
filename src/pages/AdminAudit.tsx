import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// v3.0 L10 (SPRINT-06): /admin/audit view over audit_logs with entity filter
// + CSV export. Filters by entity_type, entity_id, or actor.
interface AuditRow {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  before_json: Record<string, unknown> | null;
  after_json: Record<string, unknown> | null;
  created_at: string;
}

export default function AdminAudit() {
  const { t } = useI18n();
  const [entityType, setEntityType] = useState<string>("");
  const [entityId, setEntityId] = useState<string>("");
  const [limit, setLimit] = useState<number>(200);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["audit_logs", entityType, entityId, limit],
    queryFn: async () => {
      let q = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);
      if (entityType) q = q.eq("entity_type", entityType);
      if (entityId) q = q.eq("entity_id", entityId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as AuditRow[];
    },
    staleTime: 15_000,
  });

  const downloadCsv = () => {
    const header = ["created_at", "actor_email", "action", "entity_type", "entity_id"];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [r.created_at, r.actor_email ?? "", r.action, r.entity_type ?? "", r.entity_id ?? ""]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title={t("Audit Log")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-40">
              <label className="text-xs text-muted-foreground">{t("Entity type")}</label>
              <Select value={entityType || "any"} onValueChange={(v) => setEntityType(v === "any" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder={t("any")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("any")}</SelectItem>
                  <SelectItem value="task">{t("task")}</SelectItem>
                  <SelectItem value="unit">{t("unit")}</SelectItem>
                  <SelectItem value="property">{t("property")}</SelectItem>
                  <SelectItem value="vendor">{t("vendor")}</SelectItem>
                  <SelectItem value="user">{t("user")}</SelectItem>
                  <SelectItem value="sla_targets">sla_targets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-40">
              <label className="text-xs text-muted-foreground">{t("Entity ID")}</label>
              <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="UUID" />
            </div>
            <div className="w-24">
              <label className="text-xs text-muted-foreground">{t("Limit")}</label>
              <Input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value) || 200)} />
            </div>
            <Button variant="outline" onClick={downloadCsv} disabled={rows.length === 0}>
              <Download className="h-4 w-4 mr-1" />
              {t("Export CSV")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">{t("When")}</th>
                    <th className="p-2 text-left">{t("Actor")}</th>
                    <th className="p-2 text-left">{t("Action")}</th>
                    <th className="p-2 text-left">{t("Entity")}</th>
                    <th className="p-2 text-left">{t("Entity ID")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr><td className="p-4 text-center text-muted-foreground" colSpan={5}>{t("Loading…")}</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td className="p-4 text-center text-muted-foreground" colSpan={5}>{t("No entries.")}</td></tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id}>
                        <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                        <td className="p-2">{r.actor_email ?? "-"}</td>
                        <td className="p-2 font-mono text-xs">{r.action}</td>
                        <td className="p-2">{r.entity_type ?? "-"}</td>
                        <td className="p-2 font-mono text-xs truncate max-w-40">{r.entity_id ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
