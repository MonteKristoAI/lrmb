import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useInspection, useTemplateItems, useInspectionResponses, useSaveResponse, useUpdateInspection } from "@/hooks/useInspections";
import { useCreateTask } from "@/hooks/useTasks";
import { useAuth } from "@/lib/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const InspectionChecklist = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: inspection, isLoading: loadingInsp } = useInspection(id);
  const { data: items = [] } = useTemplateItems(inspection?.template_id);
  const { data: responses = [] } = useInspectionResponses(id);
  const saveResponse = useSaveResponse();
  const updateInspection = useUpdateInspection();
  const createTask = useCreateTask();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const sections = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((item) => {
      const list = map.get(item.section_name) || [];
      list.push(item);
      map.set(item.section_name, list);
    });
    return Array.from(map.entries());
  }, [items]);

  const getResponse = (itemId: string) => responses.find((r) => r.template_item_id === itemId);

  const handleToggle = async (itemId: string, checked: boolean) => {
    if (!id) return;
    try {
      await saveResponse.mutateAsync({ inspection_id: id, template_item_id: itemId, response_value: checked ? "pass" : "fail" });
    } catch {
      toast({ title: "Failed to save response", variant: "destructive" });
    }
  };

  const handleFlag = async (itemId: string, item: typeof items[0]) => {
    if (!id || !inspection) return;
    try {
      await saveResponse.mutateAsync({ inspection_id: id, template_item_id: itemId, flagged_issue: true, note: notes[itemId] || "Issue flagged" });
      if (item.auto_create_task_on_flag) {
        await createTask.mutateAsync({
          title: `[Inspection] ${item.label}`,
          description: `Flagged during inspection: ${inspection.inspection_templates?.name || ""}. ${notes[itemId] || ""}`.trim(),
          property_id: inspection.property_id,
          unit_id: inspection.unit_id,
          task_category: item.auto_task_category || "maintenance",
          priority: "high",
          source_type: "inspection",
          requires_photo: true,
          requires_note: true,
          created_by: user?.id ?? null,
        });
      }
      toast({ title: item.auto_create_task_on_flag ? "Issue flagged & task created" : "Issue flagged" });
    } catch {
      toast({ title: "Failed to flag issue", variant: "destructive" });
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    const required = items.filter((i) => i.required);
    const answered = required.filter((i) => responses.some((r) => r.template_item_id === i.id && r.response_value));
    if (answered.length < required.length) {
      toast({ title: "Incomplete", description: `${required.length - answered.length} required items remaining.`, variant: "destructive" });
      return;
    }
    try {
      await updateInspection.mutateAsync({ id, status: "completed", completed_at: new Date().toISOString() });
      toast({ title: "Inspection completed" });
    } catch {
      toast({ title: "Failed to complete inspection", variant: "destructive" });
    }
  };

  if (loadingInsp) return <AppShell title="Inspection"><div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div></AppShell>;
  if (!inspection) return <AppShell title="Inspection"><div className="p-4 text-muted-foreground">Not found.</div></AppShell>;

  return (
    <AppShell title={inspection.inspection_templates?.name || "Inspection"}>
      <div className="p-4 space-y-4">
        <div className="text-xs text-muted-foreground">
          {inspection.properties?.name}{inspection.units ? ` - ${inspection.units.short_name || inspection.units.unit_code}` : ""}
        </div>

        {/* Progress indicator */}
        {items.length > 0 && (
          <div className="sticky top-14 z-20 rounded-lg border border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">
                {responses.filter((r) => r.response_value || r.flagged_issue).length} / {items.length} addressed
              </span>
            </div>
            <Progress value={items.length > 0 ? (responses.filter((r) => r.response_value || r.flagged_issue).length / items.length) * 100 : 0} className="h-2" />
          </div>
        )}

        {sections.map(([section, sectionItems]) => (
          <div key={section} className="space-y-2">
            <h3 className="text-sm font-semibold text-primary">{section}</h3>
            {sectionItems.map((item) => {
              const resp = getResponse(item.id);
              const passed = resp?.response_value === "pass";
              const flagged = resp?.flagged_issue;
              return (
                <Card key={item.id} className={flagged ? "border-destructive/50" : ""}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={passed}
                        onCheckedChange={(checked) => handleToggle(item.id, !!checked)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {item.label}
                          {item.required && <span className="text-destructive"> *</span>}
                          {item.min_photos && item.min_photos > 0 && <span className="text-xs text-muted-foreground ml-1">({item.min_photos} photos)</span>}
                        </p>
                        {flagged && <span className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertTriangle className="h-3 w-3" />Flagged</span>}
                      </div>
                    </div>
                    {!passed && !flagged && (
                      <div className="pl-7 space-y-1">
                        <Textarea
                          placeholder="Note (optional)…"
                          value={notes[item.id] || ""}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          rows={2}
                          className="text-xs"
                        />
                        <Button size="sm" variant="destructive" onClick={() => handleFlag(item.id, item)} className="tap-target text-xs gap-1">
                          <AlertTriangle className="h-3 w-3" /> Flag Issue
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))}

        {inspection.status !== "completed" && inspection.status !== "verified" && (
          <Button onClick={handleComplete} disabled={updateInspection.isPending} className="w-full tap-target gap-2 bg-status-completed hover:bg-status-completed/90 text-primary-foreground">
            <CheckCircle2 className="h-4 w-4" /> Complete Inspection
          </Button>
        )}
      </div>
    </AppShell>
  );
};

export default InspectionChecklist;
