import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { useTask, useTaskUpdates, useTaskPhotos, useUpdateTask, useAddTaskUpdate, useUploadTaskPhoto, useDeleteTaskPhoto } from "@/hooks/useTasks";
import { useWorkOrderSubtasks, useToggleSubtask } from "@/hooks/useWorkOrderSubtasks";
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
  X, DollarSign, FileCheck, Truck, User, Building2, Calendar, Hourglass
} from "lucide-react";
import { isPast } from "date-fns";
import { safeFormat, safeDistance } from "@/lib/utils";
import { preparePhotoForUpload } from "@/lib/photo-prep";
import {
  TASK_CATEGORY_LABELS,
  TASK_CATEGORY_LABELS_ES,
  HOUSEKEEPING_TYPE_LABELS,
  HOUSEKEEPING_TYPE_LABELS_ES,
  DAMAGE_CLASSIFICATION_LABELS,
  DAMAGE_CLASSIFICATION_LABELS_ES,
  UPDATE_TYPE_LABELS,
  UPDATE_TYPE_LABELS_ES,
  type TaskStatus,
  type HousekeepingType,
  type DamageClassification,
} from "@/types/task";

// UUID v4 shape — defensive guard so typo URLs like /tasks/open don't fire
// 3 bad-UUID PostgREST queries against tasks / task_updates / task_photos
// (was generating noise in Supabase logs + showing "Work order not found"
// instead of a clear "page doesn't exist" cue).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile, hasAdminAccess } = useAuth();
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const UPDATE_TYPE_MAP = locale === "es" ? UPDATE_TYPE_LABELS_ES : UPDATE_TYPE_LABELS;
  const validId = id && UUID_RE.test(id) ? id : undefined;
  const { data: task, isLoading } = useTask(validId);
  const { data: updates = [] } = useTaskUpdates(validId);
  const { data: photos = [] } = useTaskPhotos(validId);
  // Emma feedback 2026-05-29: per-WO checklist from TRACK.
  // Gated on task_category=housekeeping so maintenance/inspection WOs
  // don't surface HK checklist leakage from TRACK upstream.
  const { data: subtasks = [] } = useWorkOrderSubtasks(
    validId,
    (task as { external_source?: string | null } | undefined)?.external_source ?? null,
    (task as { external_id?: string | null } | undefined)?.external_id ?? null,
    (task as { task_category?: string | null } | undefined)?.task_category ?? null,
  );
  const toggleSubtask = useToggleSubtask(validId);
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

  // QA Agent B P2-09 (2026-05-29): reset all modal/form state when the
  // active WO changes. Without this, blockReason / noteText / ownerCharges
  // / waitingReason / billingNotes typed into WO #X bleed into WO #Y when
  // the user navigates between detail pages in the same session — both a
  // PII leak and a wrong-data submit risk (typing a block reason on the
  // wrong WO).
  useEffect(() => {
    setNoteOpen(false);
    setBlockOpen(false);
    setWaitingOpen(false);
    setCompleteOpen(false);
    setBillingOpen(false);
    setNoteText("");
    setBlockReason("");
    setWaitingReason("");
    setOwnerCharges("");
    setBillingNotes("");
    setDeletePhotoId(null);
    setPhotoUrls({});
    loadedPathsRef.current = new Set();
    transitioningRef.current = false;
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [id]);

  useEffect(() => {
    const loadUrls = async () => {
      const newPhotos = photos.filter((p) => !loadedPathsRef.current.has(p.storage_path));
      if (newPhotos.length === 0) return;
      // QA P1 Q-PERF-3: batch signed-URL creation in a single round-trip
      // instead of N parallel HTTP calls. Falls back to per-photo on error.
      const paths = newPhotos.map((p) => p.storage_path);
      const urls: Record<string, string> = {};
      try {
        const { data: signed, error } = await supabase.storage
          .from("task-photos")
          .createSignedUrls(paths, 86400);
        if (error) throw error;
        for (const r of signed ?? []) {
          if (r.signedUrl && r.path) {
            urls[r.path] = r.signedUrl;
            loadedPathsRef.current.add(r.path);
          }
        }
      } catch {
        const fallback = await Promise.all(
          newPhotos.map((p) =>
            supabase.storage.from("task-photos").createSignedUrl(p.storage_path, 86400)
              .then(({ data }) => ({ path: p.storage_path, url: data?.signedUrl }))
          )
        );
        for (const r of fallback) {
          if (r.url) {
            urls[r.path] = r.url;
            loadedPathsRef.current.add(r.path);
          }
        }
      }
      if (Object.keys(urls).length > 0) {
        setPhotoUrls((prev) => ({ ...prev, ...urls }));
      }
    };
    if (photos.length > 0) loadUrls();
  }, [photos]);

  if (isLoading) return <AppShell title={t("Work Order")}><div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div></AppShell>;
  if (!task) return <AppShell title={t("Work Order")}><div className="p-4 text-muted-foreground">{t("Work order not found.")}</div></AppShell>;

  const isOverdue = task.due_at && isPast(new Date(task.due_at)) && !["cancelled", "completed", "verified", "processed"].includes(task.status);
  // v33: unassigned "new" tasks should be claimable by any field staff (not just the
  // person they're already assigned to). Previously Accept never appeared for
  // unclaimed work, so cleaners had no way to grab their own next job.
  // Emma round 4 (2026-05-29): vendor-membership grants action permission.
  // Previously canAct required task.assigned_to === user.id, which locked
  // out vendor team members on WOs that only had a vendor_id linkage (no
  // per-person assigned_to). TEST WO #30726 surfaced this — vendor was
  // Emma's "Emma Benson CO Test", assigned_to=NULL, status=Assigned, and
  // she had no Photo / Note / Waiting Parts buttons because canAct=false.
  const vendorMember = !!(task.vendor_id && profile?.vendor_id && task.vendor_id === profile.vendor_id);
  const canAct = task.assigned_to === user?.id
    || hasAdminAccess()
    || vendorMember
    || (task.status === "new" && !task.assigned_to);
  const isTerminal = ["cancelled", "completed", "verified", "processed"].includes(task.status);

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
      toast({ title: `${t("Work order")} ${t(`status:${newStatus}`)}` });
    } catch {
      toast({ title: t("Action failed"), description: t("Could not update work order status."), variant: "destructive" });
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
      toast({ title: t("Note added") });
    } catch {
      toast({ title: t("Failed to add note"), variant: "destructive" });
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
      await addUpdate.mutateAsync({ task_id: task.id, actor_id: user.id, update_type: "status_change", old_status: task.status, new_status: "in_progress", note: "Work order reopened" });
      toast({ title: t("Work order reopened") });
    } catch {
      toast({ title: t("Failed to reopen work order"), variant: "destructive" });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: t("File too large"), description: t("Maximum photo size is 10 MB."), variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    try {
      // L10 wave 9 (2026-06-10): client-side resize + EXIF strip BEFORE
      // upload. Maria's iPhone HEIC goes from ~5 MB to ~400 KB on 3G,
      // and GPS coordinates + camera serial in EXIF never leave the
      // device. See src/lib/photo-prep.ts for the rationale.
      const prepared = await preparePhotoForUpload(file);
      await uploadPhoto.mutateAsync({ taskId: task.id, propertyId: task.property_id, file: prepared.file, userId: user.id });
      toast({ title: t("Photo uploaded") });
      await bumpStartedIfPending();
    } catch (err) {
      toast({ title: t("Upload failed"), description: err instanceof Error ? err.message : t("Unknown error"), variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Emma feedback 2026-05-29: every WO starts at "Not Started" (TRACK's
  // not-started maps to vendor_not_started, our default for new rows is
  // new). First real action — checklist tick OR photo upload — should
  // auto-bump the WO to In Progress so the queue tells the team which
  // ones are actually being worked.
  const bumpStartedIfPending = async () => {
    if (!task || !user) return;
    if (task.status === "vendor_not_started" || task.status === "new") {
      try {
        await updateTask.mutateAsync({ id: task.id, status: "in_progress", started_at: new Date().toISOString() });
        await addUpdate.mutateAsync({
          task_id: task.id,
          actor_id: user.id,
          update_type: "status_change",
          old_status: task.status,
          new_status: "in_progress",
        });
      } catch { /* swallow — race / idempotency trigger may reject; UI stays */ }
    }
  };

  const handleComplete = async () => {
    // Emma feedback 2026-05-29: photos required + checklist required.
    // Notes optional. Each WO needs all checklist items checked off and
    // (when applicable) at least one photo of completion proof.
    if (task.requires_photo && photos.length === 0) {
      toast({ title: t("Photo required"), description: t("Upload at least one photo before completing."), variant: "destructive" });
      return;
    }
    // L10 audit 2026-06-09 P1-7: requires_note was cosmetic only — dialog
    // showed a warning, but the Confirm button still fired. Now actually
    // blocks completion when no note exists.
    if (task.requires_note && !updates.some((u) => u.update_type === "note")) {
      toast({ title: t("Note required"), description: t("Add a completion note before completing."), variant: "destructive" });
      return;
    }
    if (subtasks.length > 0) {
      const unchecked = subtasks.filter((s) => !s.is_completed);
      if (unchecked.length > 0) {
        toast({
          title: t("Checklist incomplete"),
          description: `${unchecked.length} ${unchecked.length === 1 ? t("item still needs to be checked off.") : t("items still need to be checked off.")}`,
          variant: "destructive",
        });
        return;
      }
    }
    await transition("completed");
    setCompleteOpen(false);
  };

  const handleProcessBilling = async () => {
    // QA Agent B P2-10 (2026-05-29): parseFloat alone happily accepts
    // "1e20", "Infinity", "-Infinity" and feeds NaN downstream. Reject
    // scientific notation and clamp to the same 0..100000 window the DB
    // CHECK constraint enforces (mig 20260529007000).
    const safeParseAmount = (raw: string): number | null => {
      const trimmed = raw.trim();
      if (!trimmed) return null;
      if (/[eE]/.test(trimmed)) return null;
      if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(trimmed)) return null;
      const n = Number(trimmed);
      if (!Number.isFinite(n) || n < 0 || n > 100000) return null;
      return n;
    };
    const charges = ownerCharges ? safeParseAmount(ownerCharges) : null;
    if (ownerCharges && charges === null) {
      toast({ title: t("Invalid amount"), description: t("Enter 0 to 100000 with up to 2 decimals (no scientific notation)."), variant: "destructive" });
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
    <AppShell title={t("Work Order Detail")}>
      <div className="p-4 space-y-4 pb-24">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{task.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {isOverdue && <span className="text-xs text-red-300 font-semibold flex items-center gap-1" aria-label={t("Overdue")}><AlertTriangle className="h-3 w-3" aria-hidden="true" />{t("OVERDUE")}</span>}
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
            {task.due_at && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Due {safeFormat(task.due_at, "MMM d, h:mm a")}</span>}
            {/* 2026-05-29 Emma polish: surface scheduled_for (from TRACK
                scheduledAt). Important for HK shift planning — was missing
                from the detail page entirely. */}
            {task.scheduled_for && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Scheduled {safeFormat(task.scheduled_for, "MMM d, h:mm a")}</span>}
            {/* 2026-05-29 Emma polish: surface TRACK timeEstimate (minutes).
                Treat 0 as null upstream. Format as "Est: 2h" or "Est: 90m". */}
            {task.time_estimate_minutes != null && task.time_estimate_minutes > 0 && (
              <span className="flex items-center gap-1">
                <Hourglass className="h-3 w-3" />
                Est: {task.time_estimate_minutes >= 60
                  ? `${Math.floor(task.time_estimate_minutes / 60)}h${task.time_estimate_minutes % 60 ? ` ${task.time_estimate_minutes % 60}m` : ""}`
                  : `${task.time_estimate_minutes}m`}
              </span>
            )}
            <span>Category: {TASK_CATEGORY_LABELS[task.task_category]}</span>
            {/* 2026-05-29 Emma polish: hide redundant "Type: checkout_turnover"
                for housekeeping. Every HK WO from TRACK is hard-coded to
                checkout_turnover by track-poll, so the row adds no signal
                — Category + clean_type_name already cover it. Keep for
                maintenance where task_type can vary. */}
            {task.task_type && task.task_category !== "housekeeping" && <span>Type: {task.task_type}</span>}
            {/* 2026-05-29 Emma polish: rename "HK:" prefix to "Clean type:"
                — "HK" is internal jargon. */}
            {hkType && <span>Clean type: {HOUSEKEEPING_TYPE_LABELS[hkType]}</span>}
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
              {task.vendor_invoice_amount != null && <span className="ml-2">${task.vendor_invoice_amount.toFixed(2)}</span>}
            </div>
          )}

          {/* Billing Info */}
          {task.billing_ready && (
            <div className="flex items-center gap-1 pt-1 text-xs text-emerald-600">
              <DollarSign className="h-3 w-3" />
              Billing processed
              {task.owner_charges_amount != null && <span className="ml-2">Owner charges: ${task.owner_charges_amount.toFixed(2)}</span>}
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
            {/* Emma feedback 2026-05-29: Block reserved for admin /
                supervisor / manager. LRMB policy is that field staff do
                not block a residence directly — they flag it up and a
                manager makes the call. hasAdminAccess() covers all three
                roles (admin, supervisor, manager). */}
            {hasAdminAccess() && (
              <Button variant="outline" onClick={() => setBlockOpen(true)} disabled={updateTask.isPending} className="tap-target gap-2 text-destructive">
                <Ban className="h-4 w-4" /> Block
              </Button>
            )}
            {/* Emma feedback 2026-05-29: Waiting Parts only applies to
                maintenance WOs — housekeeping has no parts to wait on. */}
            {task.task_category === "maintenance" && (
              <Button variant="outline" onClick={() => setWaitingOpen(true)} disabled={updateTask.isPending} className="tap-target gap-2 text-status-waiting">
                <Pause className="h-4 w-4" /> Waiting Parts
              </Button>
            )}
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

        {/* Emma feedback 2026-05-29: TRACK per-WO checklist. Surfaces the
            specific tasks-within-a-clean-type that the cleaner needs to
            complete. Lazy-fetched on first detail view via track-wo-
            subtasks edge fn. Toggles persist via PostgREST UPDATE
            (RLS gates by parent-task visibility). */}
        {subtasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              Checklist ({subtasks.filter((s) => s.is_completed).length} / {subtasks.length})
            </h3>
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {subtasks.map((st) => (
                <label key={st.track_id} className="flex items-start gap-3 p-3 cursor-pointer hover:bg-secondary/30">
                  <input
                    type="checkbox"
                    checked={st.is_completed}
                    onChange={(e) => {
                      toggleSubtask.mutate({ trackId: st.track_id, isCompleted: e.target.checked });
                      bumpStartedIfPending();
                    }}
                    disabled={!canAct || isTerminal}
                    className="mt-0.5 h-5 w-5 shrink-0"
                  />
                  <span className={`text-sm ${st.is_completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {st.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Photos ({photos.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <div key={p.id} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                  {photoUrls[p.storage_path] ? (
                    <img src={photoUrls[p.storage_path]} alt="Work order proof" loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
          <h3 className="text-sm font-semibold text-foreground">{t("Activity")}</h3>
          {updates.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("No activity yet.")}</p>
          ) : (
            <div className="space-y-2">
              {updates.map((u) => (
                <div key={u.id} className="rounded border border-border bg-card p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">
                      {UPDATE_TYPE_MAP[u.update_type] ?? u.update_type.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground">{safeDistance(u.created_at)}</span>
                  </div>
                  {u.note && <p className="text-muted-foreground">{u.note}</p>}
                  {u.old_status && u.new_status && <p className="text-muted-foreground">{t(`status:${u.old_status}`)} &rarr; {t(`status:${u.new_status}`)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Modal */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Add Note")}</DialogTitle></DialogHeader>
          <Textarea placeholder={t("Enter note...")} value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} />
          <DialogFooter>
            <Button onClick={handleNote} disabled={!noteText.trim()} className="tap-target">{t("Save Note")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Modal */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Block Work Order")}</DialogTitle></DialogHeader>
          <Textarea placeholder={t("Reason for blocking...")} value={blockReason} onChange={(e) => setBlockReason(e.target.value)} rows={3} />
          <DialogFooter>
            <Button variant="destructive" onClick={handleBlock} disabled={!blockReason.trim()} className="tap-target">{t("Block Work Order")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiting Parts Modal */}
      <Dialog open={waitingOpen} onOpenChange={setWaitingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Waiting for Parts")}</DialogTitle></DialogHeader>
          <Textarea placeholder={t("What parts are needed...")} value={waitingReason} onChange={(e) => setWaitingReason(e.target.value)} rows={3} />
          <DialogFooter>
            <Button onClick={handleWaitingParts} disabled={!waitingReason.trim()} className="tap-target">{t("Mark Waiting")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Confirmation */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Complete Work Order")}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{t("Mark this work order as completed?")}</p>
          {task.requires_photo && photos.length === 0 && <p className="text-sm text-destructive">{t("Warning: Photo proof is required.")}</p>}
          {task.requires_note && !updates.some((u) => u.update_type === "note") && <p className="text-sm text-destructive">{t("Warning: A note is required.")}</p>}
          <DialogFooter>
            <Button onClick={handleComplete} disabled={updateTask.isPending} className="tap-target bg-status-completed hover:bg-status-completed/90">
              {updateTask.isPending ? t("Completing...") : t("Confirm Complete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Billing Modal (for verified maintenance/HK tasks) */}
      <Dialog open={billingOpen} onOpenChange={setBillingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Complete Billing")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {task.task_category === "housekeeping"
                ? t("Housekeeping: confirm invoice received before processing.")
                : t("Maintenance: add any owner charges before processing.")}
            </p>
            <div className="space-y-2">
              <Label>{t("Owner Charges ($)")}</Label>
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
              <Label>{t("Billing Notes")}</Label>
              <Textarea
                placeholder={t("Any billing notes...")}
                value={billingNotes}
                onChange={(e) => setBillingNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleProcessBilling} disabled={updateTask.isPending} className="tap-target bg-emerald-600 hover:bg-emerald-700 text-white">
              <DollarSign className="h-4 w-4 mr-1" /> {updateTask.isPending ? t("Processing...") : t("Process Billing")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Photo Confirmation */}
      <Dialog open={!!deletePhotoId} onOpenChange={(open) => { if (!open) setDeletePhotoId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Remove Photo")}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{t("Are you sure you want to remove this photo?")}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePhotoId(null)}>{t("Cancel")}</Button>
            <Button
              variant="destructive"
              disabled={deletePhoto.isPending}
              onClick={() => {
                if (!deletePhotoId) return;
                deletePhoto.mutate({ id: deletePhotoId.id, storagePath: deletePhotoId.path }, {
                  onSuccess: () => { toast({ title: t("Photo removed") }); setDeletePhotoId(null); },
                  onError: () => toast({ title: t("Failed to remove photo"), variant: "destructive" }),
                });
              }}
            >
              {deletePhoto.isPending ? t("Removing...") : t("Remove")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default TaskDetail;
