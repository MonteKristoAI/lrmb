import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface SlaRow {
  id: string;
  task_category: string;
  task_type: string | null;
  priority: string | null;
  target_hours: number;
  active: boolean;
  updated_at: string;
}

// v3.0 Wave 2 (2026-07-01): mini admin page to tune SLA target hours per
// (category, type, priority) tuple without SQL.
const AdminSlaConfig = () => {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [edits, setEdits] = useState<Record<string, { target_hours?: number; active?: boolean }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["sla_targets"],
    queryFn: async (): Promise<SlaRow[]> => {
      const { data, error } = await supabase.from("sla_targets").select("*").order("task_category").order("priority", { nullsFirst: false });
      if (error) throw error;
      return data as unknown as SlaRow[];
    },
  });

  const saveRow = async (row: SlaRow) => {
    const edit = edits[row.id];
    if (!edit) return;
    setSaving(row.id);
    try {
      const patch: { target_hours?: number; active?: boolean; updated_at: string } = {
        updated_at: new Date().toISOString(),
      };
      if (edit.target_hours !== undefined) patch.target_hours = edit.target_hours;
      if (edit.active !== undefined) patch.active = edit.active;
      const { error } = await supabase.from("sla_targets").update(patch).eq("id", row.id);
      if (error) throw error;
      toast({ title: t("SLA target saved") });
      qc.invalidateQueries({ queryKey: ["sla_targets"] });
      setEdits((prev) => { const next = { ...prev }; delete next[row.id]; return next; });
    } catch (e) {
      toast({ title: t("Failed to save"), description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  return (
    <AppShell title={t("SLA Config")}>
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          {t("Target hours per category/type/priority. Resolver picks the most specific active row.")}
        </p>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="p-3">{t("Category")}</th>
                    <th className="p-3">{t("Type")}</th>
                    <th className="p-3">{t("Priority")}</th>
                    <th className="p-3">{t("Target hours")}</th>
                    <th className="p-3">{t("Active")}</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((r) => {
                    const edit = edits[r.id];
                    const dirty = edit !== undefined;
                    return (
                      <tr key={r.id} className={dirty ? "bg-primary/5" : ""}>
                        <td className="p-3 font-medium capitalize">{r.task_category}</td>
                        <td className="p-3 text-muted-foreground">{r.task_type ?? <span className="italic opacity-60">any</span>}</td>
                        <td className="p-3 text-muted-foreground capitalize">{r.priority ?? <span className="italic opacity-60">any</span>}</td>
                        <td className="p-3">
                          <Input
                            type="number"
                            min={1}
                            max={720}
                            value={edit?.target_hours ?? r.target_hours}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [r.id]: { ...prev[r.id], target_hours: Number(e.target.value) } }))}
                            className="h-8 w-24"
                          />
                        </td>
                        <td className="p-3">
                          <Switch
                            checked={edit?.active ?? r.active}
                            onCheckedChange={(v) => setEdits((prev) => ({ ...prev, [r.id]: { ...prev[r.id], active: v } }))}
                          />
                        </td>
                        <td className="p-3">
                          {dirty && (
                            <Button size="sm" onClick={() => saveRow(r)} disabled={saving === r.id}>
                              <Save className="h-3 w-3 mr-1" />
                              {saving === r.id ? t("Saving") : t("Save")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
};

export default AdminSlaConfig;
