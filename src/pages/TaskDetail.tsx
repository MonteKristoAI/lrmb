import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { useTask, useTaskUpdates, useTaskPhotos, useUpdateTask, useAddTaskUpdate, useUploadTaskPhoto, useDeleteTaskPhoto } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin, Clock, Camera, MessageSquare, Ban, CheckCircle2, Play,
  UserCheck, Image as ImageIcon, AlertTriangle, Pause, RotateCcw,
  X, DollarSign, FileCheck, Truck, User, Building2
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  TASK_CATEGORY_LABELS,
  HOUSEKEEPING_TYPE_LABELS,
  DAMAGE_CLASSIFICATION_LABELS,
  type TaskStatus,
  type HousekeepingType,
  type DamageClassification,
} from "@/types/task";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, hasAdminAccess } = useAuth();
  const { toast } = useToast();
  const { data: task, isLoading } = useTask(id);
  const { data: updates = [] } = useTaskUpdates(id);
  const { data: photos = [] } = useTaskPhotos(id);
  const updateTask = useUpdateTask();
  const addUpdate = useAddTaskUpdate();
  const uploadPhoto = useUploadTaskPhoto();
  const deletePhoto = useDeleteTaskPhoto();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const transitioningRef = useRef(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [waitingOpen, setWaitingOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [waitingReason, setWaitingReason] = useState("");
  const [deletePhotoId, setDeletePhotoId] = useState<{ id: string; path: string } | null>(null);
  const [ownerCharges, setOwnerCharges] = useState("");
  const [billingNotes, setBillingNotes] = useState("");

  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const loadedPathsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadUrls = async () => {
      const newPhotos = photos.filter((p) => !loadedPathsRef.current.has(p.storage_path));
      if (newPhotos.length === 0) return;
      const results = await Promise.all(
        newPhotos.map((p) => supabase.storage.from("task-photos").createSignedUrl(p.storage_path, 86400).then(({ data }) => ({ path: p.storage_path, url: data?.signedUrl })))
      );
      const urls: Record<string, string> = {};
      for (const r of results) {
        if (r.url) {
          urls[r.path] = r.url;
          loadedPathsRef.current.add(r.path);
        }
      }
      if (Object.keys(urls).length > 0) {
        setPhotoUrls((prev) => ({ ...prev, ...urls }));
      }
    };
    if (photos.length > 0) loadUrls();
  }, [photos]);

  if (isLoading) return <AppShell title="Task"><div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div></AppShell>;
  if (!task) return <AppShell title="Task"><div className="p-4 text-muted-foreground">Task not found.</div></AppShell>;

  const isOverdue = task.due_at && isPast(new Date(task.due_at)) && !["completed", "verified", "processed"].includes(task.status);
  const canAct = task.assigned_to === user?.id || hasAdminAccess();
  const isTerminal = ["completed", "verified", "processed"].includes(task.status);

  const transition = async (newStatus: TaskStatus, extra?: Record<string, unknown>) => {
    if (!user || transitioningRef.current) return;
    transitioningRef.current = true;
    try {
      const now = new Date().toISOString();
      const taskUpdates: Record<string, unknown> = { status: newStatus, ...extra };
      if (newStatus === "in_progress" && !task.started_at) taskUpdates.started_at = now;
      if (newStatus === "completed") taskUpdates.completed_at = now;
      if (newStatus === "verified") taskUpdates.verified_at = now;
      if (newStatus === "processed") { taskUpdates.processed_at = now; taskUpdates.processed_by = user.id; }

      await updateTask.mutateAsync({ id: task.id, ...taskUpdates });
      try {
        await addUpdate.mutateAsync({ task_id: task.id, actor_id: user.id, update_type: "status_change", old_status: task.status, new_status: newStatus });
      } catch {
        // Status changed but audit trail failed - log but don't block the user
      }
      toast({ title: `Task ${newStatus.replace(/_/g, " ")}` });
    } catch {
      toast({ title: "Action failed", description: "Could not update task status.", variant: "destructive" });
    } finally {
      transitioningRef.current = false;
    }
  };

  const handleNote = async () => {
    if (!noteText.trim() || !user) return;
    try {
      await addUpdate.mutateAsync({ task_id: task.id, actor_id: user.id, update_type: "note", note: noteText.trim() });
      setNoteText("");
      setNoteOpen(false);
      toast({ title: "Note added" });
    } catch {
      toast({ title: "Failed to add note", variant: "destructive" });
    }
  };

  const handleBlock = async () => {
    if (!blockReason.trim()) return;
    await transition("blocked", { blocked_reason: blockReason.trim() });
    setBlockReason("");
    setBlockOpen(false);
  };

  const handleWaitingParts = async () => {
    if (!waitingReason.trim()) return;
    await transition("waiting_parts", { blocked_reason: waitingReason.trim() });
    setWaitingReason("");
    setWaitingOpen(false);
  };

  const handleReopen = async () => {
    if (!user) return;
    try {
      await updateTask.mutateAsync({ id: task.id, status: "in_progress", completed_at: null, verified_at: null, processed_at: null, processed_by: null, reopened_count: (task.reopened_count || 0) + 1 });
      await addUpdate.mutateAsync({ task_id: task.id, actor_id: user.id, update_type: "status_change", old_status: task.status, new_status: "in_progress", note: "Task reopened" });
      toast({ title: "Task reopened" });
    } catch {
      toast({ title: "Failed to reopen task", variant: "destructive" });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum photo size is 10 MB.", variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    try {
      await uploadPhoto.mutateAsync({ taskId: task.id, propertyId: task.property_id, file, userId: user.id });
      toast({ title: "Photo uploaded" });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleComplete = async () => {
    if (task.requires_photo && photos.length === 0) {
      toast({ title: "Photo required", description: "Upload at least one photo before completing.", variant: "destructive" });
      return;
    }
    const hasNote = updates.some((u) => u.update_type === "note");
    if (task.requires_note && !hasNote) {
      toast({ title: "Note required", description: "Add a note before completing.", variant: "destructive" });
      return;
    }
    await transition("completed");
    setCompleteOpen(false);
  };

  const handleProcessBilling = async () => {
    const charges = ownerCharges ? parseFloat(ownerCharges) : null;
    if (charges !== null && isNaN(charges)) {
      toast({ title: "Invalid amount", description: "Enter a valid number for owner charges.", variant: "destructive" });
      return;
    }
    await transition("processed", {
      billing_ready: true,
      owner_charges_amount: charges,
      billing_notes: billingNotes || null,
    });
    setBillingOpen(false);
    setOwnerCharges("");
    setBillingNotes("");
  };

  const hkType = task.housekeeping_type as HousekeepingType | null;
  const dmgClass = task.damage_classification as DamageClassification | null;

  return (
    <AppShell title="Task Detail">
      <div className="p-4 space-y-4 pb-24">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{task.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {isOverdue && <span className="text-xs text-destructive font-semibold flex items-center gap-1"><AlertTriangle className="h-3 w-3" />OVERDUE</span>}
            {task.reopened_count > 0 && <span className="text-xs bg-status-in-progress/20 text-foreground px-2 py-0.5 rounded">Reopened x{task.reopened_count}</span>}
            {task.is_guest_facing && <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-0.5 rounded flex items-center gap-1"><User className="h-3 w-3" />Guest-Facing</span>}
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 text-sm">
          {task.description && <p className="text-foreground">{task.description}</p>}
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            {task.properties && (
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{task.properties.name}</span>
            )}
            {task.units && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.units.short_name || task.units.unit_code}</span>
            )}
            {task.due_at && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(task.due_at), "MMM d, h:mm a")}</span>}
            <span>Category: {TASK_CATEGORY_LABELS[task.task_category]}</span>
            {task.task_type && <span>Type: {task.task_type}</span>}
            {hkType && <span>HK: {HOUSEKEEPING_TYPE_LABELS[hkType]}</span>}
            {dmgClass && dmgClass !== "unclassified" && <span>Damage: {DAMAGE_CLASSIFICATION_LABELS[dmgClass]}</span>}
          </div>

          {/* Guest Info */}
          {(task.guest_name || task.reservation_id) && (
            <div className="flex gap-2 pt-1 text-xs text-blue-600">
              {task.guest_name && <span>Guest: {task.guest_name}</span>}
              {task.reservation_id && <span>Reservation: {task.reservation_id}</span>}
            </div>
          )}

          {/* Vendor Info */}
          {task.assigned_vendor_name && (
            <div className="flex items-center gap-1 pt-1 text-xs text-orange-600">
              <Truck className="h-3 w-3" />
              Vendor: {task.assigned_vendor_name}
              {task.vendor_invoice_received && <span className="ml-2 text-green-600">Invoice received</span>}
              {task.vendor_invoice_amount && <span className="ml-2">${task.vendor_invoice_amount.toFixed(2)}</span>}
            </div>
          )}

          {/* Billing Info */}
          {task.billing_ready && (
            <div className="flex items-center gap-1 pt-1 text-xs text-emerald-600">
              <DollarSign className="h-3 w-3" />
              Billing processed
              {task.owner_charges_amount && <span className="ml-2">Owner charges: ${task.owner_charges_amount.toFixed(2)}</span>}
              {task.billing_notes && <span className="ml-2">- {task.billing_notes}</span>}
            </div>
          )}

          {/* Blocked / Waiting */}
          {task.blocked_reason && task.status === "blocked" && (
            <p className="text-xs text-destructive">Blocked: {task.blocked_reason}</p>
          )}
          {task.blocked_reason && task.status === "waiting_parts" && (
            <p className="text-xs text-status-waiting">Waiting: {task.blocked_reason}</p>
          )}

          {/* Requirements */}
          {(task.requires_photo || task.requires_note) && (
            <div className="flex gap-2 pt-1">
              {task.requires_photo && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Photo required</span>}
              {task.requires_note && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Note required</span>}
            </div>
          )}
        </div>

        {/* Action Buttons - Active States */}
        {canAct && !isTerminal && (
          <div className="grid grid-cols-2 gap-2">
            {task.status === "assigned" && (
              <Button onClick={() => transition("in_progress")} disabled={updateTask.isPending} className="tap-target gap-2">
                <Play className="h-4 w-4" /> Start
              </Button>
            )}
            {task.status === "vendor_not_started" && (
              <Button onClick={() => transition("in_progress")} disabled={updateTask.isPending} className="tap-target gap-2">
                <Play className="h-4 w-4" /> Vendor Started
              </Button>
            )}
            {task.status === "new" && (
              <Button onClick={() => transition("assigned", { assigned_to: user?.id })} disabled={updateTask.isPending} className="tap-target gap-2">
                <UserCheck className="h-4 w-4" /> Accept
              </Button>
            )}
            {(task.status === "blocked" || task.status === "waiting_parts") && (
              <Button onClick={() => transition("in_progress", { blocked_reason: null })} disabled={updateTask.isPending} className="tap-target gap-2">
                <Play className="h-4 w-4" /> Resume
              </Button>
            )}
            <Button variant="outline" onClick={() => setNoteOpen(true)} className="tap-target gap-2">
              <MessageSquare className="h-4 w-4" /> Note
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="tap-target gap-2">
              <Camera className="h-4 w-4" /> Photo
            </Button>
            <Button variant="outline" onClick={() => setBlockOpen(true)} disabled={updateTask.isPending} className="tap-target gap-2 text-destructive">
              <Ban className="h-4 w-4" /> Block
            </Button>
            <Button variant="outline" onClick={() => setWaitingOpen(true)} disabled={updateTask.isPending} className="tap-target gap-2 text-status-waiting">
              <Pause className="h-4 w-4" /> Waiting Parts
            </Button>
            {["in_progress", "assigned", "vendor_not_started", "waiting_parts"].includes(task.status) && (
              <Button onClick={() => setCompleteOpen(true)} className="tap-target gap-2 col-span-2 bg-status-completed hover:bg-status-completed/90 text-primary-foreground">
                <CheckCircle2 className="h-4 w-4" /> Complete
              </Button>
            )}
          </div>
        )}

        {/* Verify for supervisors */}
        {canAct && task.status === "completed" && hasAdminAccess() && (
          <div className="flex gap-2">
            <Button onClick={() => transition("verified")} disabled={updateTask.isPending} className="flex-1 tap-target gap-2 bg-status-verified hover:bg-status-verified/90 text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Verify
            </Button>
            <Button variant="outline" onClick={handleReopen} disabled={updateTask.isPending} className="tap-target gap-2">
              <RotateCcw className="h-4 w-4" /> Reopen
            </Button>
          </div>
        )}

        {/* Process Billing for verified tasks (admin only) */}
        {canAct && task.status === "verified" && hasAdminAccess() && (
          <div className="flex gap-2">
            {task.task_category === "inspection" ? (
              <Button onClick={() => transition("processed")} disabled={updateTask.isPending} className="flex-1 tap-target gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <FileCheck className="h-4 w-4" /> Mark Processed
              </Button>
            ) : (
              <Button onClick={() => setBillingOpen(true)} className="flex-1 tap-target gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <DollarSign className="h-4 w-4" /> Complete Billing
              </Button>
            )}
            <Button variant="outline" onClick={handleReopen} disabled={updateTask.isPending} className="tap-target gap-2">
              <RotateCcw className="h-4 w-4" /> Reopen
            </Button>
          </div>
        )}

        {/* Processed - show reopen only */}
        {canAct && task.status === "processed" && hasAdminAccess() && (
          <Button variant="outline" onClick={handleReopen} disabled={updateTask.isPending} className="w-full tap-target gap-2">
            <RotateCcw className="h-4 w-4" /> Reopen
          </Button>
        )}

        {/* Note/Photo for admins on terminal tasks (documentation) */}
        {canAct && isTerminal && hasAdminAccess() && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setNoteOpen(true)} className="flex-1 tap-target gap-2">
              <MessageSquare className="h-4 w-4" /> Add Note
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1 tap-target gap-2">
              <Camera className="h-4 w-4" /> Add Photo
            </Button>
          </div>
        )}

        {/* Hidden file input for photo upload (shared by action buttons) */}
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />

        {/* Photos */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Photos ({photos.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <div key={p.id} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                  {photoUrls[p.storage_path] ? (
                    <img src={photoUrls[p.storage_path]} alt="Task proof" className="w-full h-full object-cover" />
                  ) : (
                    <Skeleton className="w-full h-full" />
                  )}
                  {canAct && (
                    <button
                      onClick={() => setDeletePhotoId({ id: p.id, path: p.storage_path })}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 max-sm:opacity-90 min-w-[28px] min-h-[28px] flex items-center justify-center"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Activity</h3>
          {updates.length === 0 ? (
            <p className="text-xs text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {updates.map((u) => (
                <div key={u.id} className="rounded border border-border bg-card p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground capitalize">{u.update_type.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground">{formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}</span>
                  </div>
                  {u.note && <p className="text-muted-foreground">{u.note}</p>}
                  {u.old_status && u.new_status && <p className="text-muted-foreground">{u.old_status} &rarr; {u.new_status}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Modal */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
          <Textarea placeholder="Enter note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} />
          <DialogFooter>
            <Button onClick={handleNote} disabled={!noteText.trim()} className="tap-target">Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Modal */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Block Task</DialogTitle></DialogHeader>
          <Textarea placeholder="Reason for blocking..." value={blockReason} onChange={(e) => setBlockReason(e.target.value)} rows={3} />
          <DialogFooter>
            <Button variant="destructive" onClick={handleBlock} disabled={!blockReason.trim()} className="tap-target">Block Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiting Parts Modal */}
      <Dialog open={waitingOpen} onOpenChange={setWaitingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Waiting for Parts</DialogTitle></DialogHeader>
          <Textarea placeholder="What parts are needed..." value={waitingReason} onChange={(e) => setWaitingReason(e.target.value)} rows={3} />
          <DialogFooter>
            <Button onClick={handleWaitingParts} disabled={!waitingReason.trim()} className="tap-target">Mark Waiting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Confirmation */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Complete Task</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Mark this task as completed?</p>
          {task.requires_photo && photos.length === 0 && <p className="text-sm text-destructive">Warning: Photo proof is required.</p>}
          {task.requires_note && !updates.some((u) => u.update_type === "note") && <p className="text-sm text-destructive">Warning: A note is required.</p>}
          <DialogFooter>
            <Button onClick={handleComplete} disabled={updateTask.isPending} className="tap-target bg-status-completed hover:bg-status-completed/90">
              {updateTask.isPending ? "Completing..." : "Confirm Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Billing Modal (for verified maintenance/HK tasks) */}
      <Dialog open={billingOpen} onOpenChange={setBillingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Complete Billing</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {task.task_category === "housekeeping"
                ? "Housekeeping: confirm invoice received before processing."
                : "Maintenance: add any owner charges before processing."}
            </p>
            <div className="space-y-2">
              <Label>Owner Charges ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={ownerCharges}
                onChange={(e) => setOwnerCharges(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Billing Notes</Label>
              <Textarea
                placeholder="Any billing notes..."
                value={billingNotes}
                onChange={(e) => setBillingNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleProcessBilling} disabled={updateTask.isPending} className="tap-target bg-emerald-600 hover:bg-emerald-700 text-white">
              <DollarSign className="h-4 w-4 mr-1" /> {updateTask.isPending ? "Processing..." : "Process Billing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Photo Confirmation */}
      <Dialog open={!!deletePhotoId} onOpenChange={(open) => { if (!open) setDeletePhotoId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove Photo</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to remove this photo?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePhotoId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deletePhoto.isPending}
              onClick={() => {
                if (!deletePhotoId) return;
                deletePhoto.mutate({ id: deletePhotoId.id, storagePath: deletePhotoId.path }, {
                  onSuccess: () => { toast({ title: "Photo removed" }); setDeletePhotoId(null); },
                  onError: () => toast({ title: "Failed to remove photo", variant: "destructive" }),
                });
              }}
            >
              {deletePhoto.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default TaskDetail;
