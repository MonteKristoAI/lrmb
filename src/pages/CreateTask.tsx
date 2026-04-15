import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateTask, useSimilarTasks } from "@/hooks/useTasks";
import { useProperties, useUnits, useProfiles } from "@/hooks/useProperties";
import { useActiveVendors } from "@/hooks/useVendors";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  TASK_CATEGORY_LABELS,
  TASK_PRIORITY_LABELS,
  HOUSEKEEPING_TYPE_LABELS,
  DAMAGE_CLASSIFICATION_LABELS,
  type TaskCategory,
  type TaskPriority,
  type HousekeepingType,
  type DamageClassification,
} from "@/types/task";

const CreateTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createTask = useCreateTask();
  const { data: properties = [] } = useProperties();
  const { data: profiles = [] } = useProfiles();
  const { data: vendors = [] } = useActiveVendors();

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_id: "",
    unit_id: "",
    task_category: "maintenance" as TaskCategory,
    task_type: "",
    priority: "medium" as TaskPriority,
    assigned_to: "",
    vendor_id: "",
    housekeeping_type: "" as HousekeepingType | "",
    damage_classification: "" as DamageClassification | "",
    guest_name: "",
    reservation_id: "",
    is_guest_facing: false,
    requires_photo: true,
    requires_note: true,
    due_at: "",
    scheduled_for: "",
  });

  const { data: units = [] } = useUnits(form.property_id || undefined);
  const { data: similarTasks = [] } = useSimilarTasks(
    form.property_id || undefined,
    form.unit_id || undefined,
    form.title || undefined
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  if (!mounted) return <AppShell title="Create Task"><div className="p-4">Loading...</div></AppShell>;

  const isHousekeeping = form.task_category === "housekeeping";
  const showDamage = form.task_category === "maintenance";
  const showGuestFields = form.is_guest_facing;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.property_id) {
      toast({ title: "Missing fields", description: "Title and property are required.", variant: "destructive" });
      return;
    }

    const hasAssignee = !!form.assigned_to;
    const hasVendor = !!form.vendor_id;
    let initialStatus: "new" | "assigned" | "vendor_not_started" = "new";
    if (hasAssignee) initialStatus = "assigned";
    else if (hasVendor) initialStatus = "vendor_not_started";

    try {
      await createTask.mutateAsync({
        title: form.title,
        description: form.description || null,
        property_id: form.property_id,
        unit_id: form.unit_id || null,
        task_category: form.task_category,
        task_type: form.task_type || null,
        priority: form.priority,
        assigned_to: form.assigned_to || null,
        vendor_id: form.vendor_id || null,
        assigned_vendor_name: form.vendor_id ? vendors.find(v => v.id === form.vendor_id)?.name ?? null : null,
        housekeeping_type: isHousekeeping && form.housekeeping_type ? form.housekeeping_type as HousekeepingType : null,
        damage_classification: showDamage && form.damage_classification ? form.damage_classification as DamageClassification : null,
        guest_name: form.guest_name || null,
        reservation_id: form.reservation_id || null,
        is_guest_facing: form.is_guest_facing,
        requires_photo: form.requires_photo,
        requires_note: form.requires_note,
        due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
        scheduled_for: form.scheduled_for ? new Date(form.scheduled_for).toISOString() : null,
        status: initialStatus,
        created_by: user?.id ?? null,
        source_type: "manual",
      });
      toast({ title: "Task created" });
      navigate("/admin");
    } catch {
      toast({ title: "Failed to create task", variant: "destructive" });
    }
  };

  return (
    <AppShell title="Create Task">
      <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-24">
        {/* Title & Description */}
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Task title" className="tap-target" required />
        </div>
        {/* Duplicate detection warning */}
        {similarTasks.length > 0 && (
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 space-y-1">
            <p className="text-xs font-semibold text-amber-700">Possible duplicate - similar open tasks found:</p>
            {similarTasks.map((st) => (
              <p key={st.id} className="text-xs text-amber-600">
                {st.title} ({st.status})
              </p>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Details..." rows={3} />
        </div>

        {/* Property & Unit (Residence) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Building *</Label>
            <Select value={form.property_id || undefined} onValueChange={(v) => { set("property_id", v); set("unit_id", ""); }}>
              <SelectTrigger className="tap-target"><SelectValue placeholder="Select building" /></SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} <span className="text-muted-foreground text-xs ml-1">({p.zone})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Residence</Label>
            <Select value={form.unit_id || undefined} onValueChange={(v) => set("unit_id", v)} disabled={!form.property_id}>
              <SelectTrigger className="tap-target"><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.short_name || u.unit_code}
                    {u.bedrooms ? ` (${u.bedrooms}BR)` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.task_category} onValueChange={(v) => { set("task_category", v); set("housekeeping_type", ""); set("damage_classification", ""); }}>
              <SelectTrigger className="tap-target"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_CATEGORY_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
              <SelectTrigger className="tap-target"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_PRIORITY_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Housekeeping Type (conditional) */}
        {isHousekeeping && (
          <div className="space-y-2">
            <Label>Housekeeping Type</Label>
            <Select value={form.housekeeping_type || undefined} onValueChange={(v) => set("housekeeping_type", v)}>
              <SelectTrigger className="tap-target"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {Object.entries(HOUSEKEEPING_TYPE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Damage Classification (conditional) */}
        {showDamage && (
          <div className="space-y-2">
            <Label>Damage Classification</Label>
            <Select value={form.damage_classification || undefined} onValueChange={(v) => set("damage_classification", v)}>
              <SelectTrigger className="tap-target"><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                {Object.entries(DAMAGE_CLASSIFICATION_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Task Type */}
        <div className="space-y-2">
          <Label>Task Type</Label>
          <Input value={form.task_type} onChange={(e) => set("task_type", e.target.value)} placeholder="e.g. plumbing, AC repair, light bulb" className="tap-target" />
        </div>

        {/* Assignment: Staff or Vendor */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Assign to Staff</Label>
            <Select value={form.assigned_to || "__none__"} onValueChange={(v) => set("assigned_to", v === "__none__" ? "" : v)}>
              <SelectTrigger className="tap-target"><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Unassigned</SelectItem>
                {profiles.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assign to Vendor</Label>
            <Select value={form.vendor_id || "__none__"} onValueChange={(v) => set("vendor_id", v === "__none__" ? "" : v)}>
              <SelectTrigger className="tap-target"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="datetime-local" value={form.due_at} onChange={(e) => set("due_at", e.target.value)} className="tap-target" />
          </div>
          <div className="space-y-2">
            <Label>Scheduled For</Label>
            <Input type="datetime-local" value={form.scheduled_for} onChange={(e) => set("scheduled_for", e.target.value)} className="tap-target" />
          </div>
        </div>

        {/* Guest Context */}
        <div className="flex items-center justify-between py-2">
          <Label>Guest-Facing Task</Label>
          <Switch checked={form.is_guest_facing} onCheckedChange={(v) => set("is_guest_facing", v)} />
        </div>
        {showGuestFields && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Guest Name</Label>
              <Input value={form.guest_name} onChange={(e) => set("guest_name", e.target.value)} placeholder="Guest name" className="tap-target" />
            </div>
            <div className="space-y-2">
              <Label>Reservation ID</Label>
              <Input value={form.reservation_id} onChange={(e) => set("reservation_id", e.target.value)} placeholder="TRACK ID" className="tap-target" />
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="flex items-center justify-between py-2">
          <Label>Require Photo Proof</Label>
          <Switch checked={form.requires_photo} onCheckedChange={(v) => set("requires_photo", v)} />
        </div>
        <div className="flex items-center justify-between py-2">
          <Label>Require Completion Note</Label>
          <Switch checked={form.requires_note} onCheckedChange={(v) => set("requires_note", v)} />
        </div>

        <Button type="submit" className="w-full tap-target text-base font-semibold" disabled={createTask.isPending}>
          {createTask.isPending ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </AppShell>
  );
};

export default CreateTask;
