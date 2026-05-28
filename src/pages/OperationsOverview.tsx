import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AlertCircle, CheckCircle2, Clock, RefreshCw, Wrench, Sparkles,
  ArrowDownToLine, ArrowUpFromLine, Camera, Activity, Building2,
  Image as ImageIcon, ShieldAlert, TrendingUp, TrendingDown, Minus,
  ListChecks, MapPin, Users, AlertTriangle, X, Calendar, FileText, Tag,
  Link2, History, User, Search, Filter, Printer,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// ============================================================
// Types
// ============================================================
type Health = { collection_name: string; health: string; last_run_at: string | null; seconds_since_last_run: number | null };

interface ReservationCard {
  externalId: string;
  unitId: number | null;
  unitCode: string | null;
  propertyName: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  status: string | null;
  occupants: number | Record<string, number> | null;
  nights: number | null;
}

interface TaskCard {
  id: string;
  title: string;
  status: string;
  category: "housekeeping" | "maintenance";
  priority: string;
  housekeepingType: string | null;
  unitId: string | null;
  unitCode: string | null;
  propertyName: string | null;
  externalId: string | null;
  reservationId: string | null;
  dueAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  scheduledFor: string | null;
  blockedReason: string | null;
  updatedAt: string;
}

interface ActivityRow {
  id: string;
  created_at: string;
  task_id: string;
  task_title: string | null;
  task_category: string;
  actor_name: string | null;
  update_type: string;
  old_status: string | null;
  new_status: string | null;
  note: string | null;
  photo_count: number;
}

interface PhotoRow {
  photo_id: string;
  uploaded_at: string;
  task_id: string;
  storage_path: string;
  photo_subtype: string | null;
  caption: string | null;
  task_title: string | null;
  task_category: string;
  task_status: string;
  uploaded_by_name: string | null;
  signed_url: string | null;
}

interface DamageClaim {
  task_id: string;
  track_wo: string | null;
  title: string;
  damage_classification: string;
  claim_status: string | null;
  claim_filed_amount: number | null;
  claim_approved_amount: number | null;
  claim_id: string | null;
  claim_provider: string | null;
  claim_filed_at: string | null;
  claim_deadline_at: string | null;
  deadline_status: "overdue" | "urgent" | "approaching" | "fine" | null;
  hours_to_deadline: number | null;
  unit_code: string | null;
  property: string | null;
}

interface KpiPeriodCount {
  thisWeek: number;
  lastWeek: number;
}

interface OverviewPayload {
  viewer: string | null;
  generatedAt: string;
  windowUTC: { start: string; end: string };
  totals: { trackMirroredTasks: number; activeUnits: number; activeProperties: number };
  kpis: {
    hkCompleted: KpiPeriodCount;
    maintCompleted: KpiPeriodCount;
    hkInProgress?: number;
    maintInProgress?: number;
    maintOverdue?: number;
  };
  // v16: per-property KPI breakdown so filtered view shows true per-property metrics
  kpisByProperty?: Array<{
    property: string;
    hkInProgress: number;
    maintInProgress: number;
    maintOverdue: number;
    hkCompleted: KpiPeriodCount;
    maintCompleted: KpiPeriodCount;
  }>;
  propertyList: string[];
  reservations: {
    arrivalsToday: ReservationCard[];
    inHouse: ReservationCard[];
    checkoutsToday: ReservationCard[];
    upcoming7d: ReservationCard[];
  };
  housekeeping: {
    scheduledToday: TaskCard[];
    inProgress: TaskCard[];
    completedPendingVerify: TaskCard[];
  };
  maintenance: {
    open: TaskCard[];
    overdue: TaskCard[];
    blocked: TaskCard[];
    completedPendingVerify: TaskCard[];
  };
  pollHealth: Health[];
  recentActivity?: ActivityRow[];
  recentPhotos?: PhotoRow[];
  damageClaims?: {
    total: number;
    overdue: number;
    urgent: number;
    approaching: number;
    items: DamageClaim[];
  };
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

async function fetchOverview(token: string): Promise<OverviewPayload> {
  if (!SUPABASE_URL) throw new Error("VITE_SUPABASE_URL not configured");
  const res = await fetch(`${SUPABASE_URL}/functions/v1/track-overview-data?t=${encodeURIComponent(token)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const reason: string = body?.error ?? `HTTP ${res.status}`;
    const err = new Error(reason);
    (err as unknown as { code: string }).code = reason;
    throw err;
  }
  return res.json();
}

// ============================================================
// Helpers
// ============================================================
function propertyMatchesFilter(item: { propertyName: string | null }, filter: string): boolean {
  if (filter === "ALL") return true;
  return item.propertyName === filter;
}

// Safe date formatters — production crashed with "Invalid time value" because
// new Date(null|undefined|"") yields Invalid Date and format()/formatDistanceToNow()
// then throw a RangeError that takes down the whole modal.
// Use these everywhere instead of calling format() directly.
function safeFormat(value: string | null | undefined, pattern: string, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  try { return format(d, pattern); } catch { return fallback; }
}
function safeDistance(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  try { return formatDistanceToNow(d, { addSuffix: true }); } catch { return fallback; }
}

function searchMatchesTask(t: TaskCard, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase().trim();
  return (
    (t.title?.toLowerCase().includes(needle) ?? false) ||
    (t.unitCode?.toLowerCase().includes(needle) ?? false) ||
    (t.propertyName?.toLowerCase().includes(needle) ?? false) ||
    (t.externalId?.toLowerCase().includes(needle) ?? false) ||
    (t.id?.toLowerCase().includes(needle) ?? false)
  );
}

function searchMatchesRes(r: ReservationCard, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase().trim();
  return (
    (r.externalId?.toLowerCase().includes(needle) ?? false) ||
    (r.unitCode?.toLowerCase().includes(needle) ?? false) ||
    (r.propertyName?.toLowerCase().includes(needle) ?? false) ||
    (r.status?.toLowerCase().includes(needle) ?? false)
  );
}

function priorityMatchesFilter(t: TaskCard, prio: string): boolean {
  if (prio === "ALL") return true;
  // Coalesce "urgent" into "high" (the displayTitle/badge logic groups them)
  const p = t.priority === "urgent" ? "high" : t.priority;
  return p === prio;
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    if (!seen.has(it.id)) {
      seen.add(it.id);
      out.push(it);
    }
  }
  return out;
}

function deltaIcon(curr: number, prev: number) {
  if (prev === 0 && curr === 0) return { Icon: Minus, color: "text-muted-foreground", label: "no change" };
  if (prev === 0) return { Icon: TrendingUp, color: "text-[hsl(152_60%_60%)]", label: "new" };
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (Math.abs(pct) < 5) return { Icon: Minus, color: "text-muted-foreground", label: `${pct}%` };
  if (pct > 0) return { Icon: TrendingUp, color: "text-[hsl(152_60%_60%)]", label: `+${pct}%` };
  return { Icon: TrendingDown, color: "text-destructive", label: `${pct}%` };
}

function locationLabel(item: { unitCode: string | null; propertyName: string | null; unitId: unknown }) {
  if (item.propertyName && item.unitCode) return `${item.unitCode} · ${item.propertyName}`;
  if (item.propertyName) return item.propertyName;
  if (item.unitCode) return item.unitCode;
  if (typeof item.unitId === "number") return `Unmapped unit #${item.unitId}`;
  return "Unknown property";
}

function occupantsLabel(o: ReservationCard["occupants"]): string {
  if (typeof o === "number") return `${o} guest${o === 1 ? "" : "s"}`;
  if (o && typeof o === "object") {
    const total = Object.values(o).reduce<number>((acc, n) => acc + (typeof n === "number" ? n : 0), 0);
    if (total) return `${total} guest${total === 1 ? "" : "s"}`;
  }
  return "—";
}

function priorityBadge(priority: string) {
  if (priority === "high" || priority === "urgent") return { className: "bg-destructive/20 text-destructive border-destructive/30", label: "High" };
  if (priority === "low") return { className: "bg-muted text-muted-foreground border-border", label: "Low" };
  return null;
}

function displayTitle(t: TaskCard): string {
  // Most TRACK titles are like "Clean - TRACK WO #31451" — replace with human-friendly derived title.
  if (t.category === "housekeeping") {
    const hkLabel = t.housekeepingType ? hkTypeLabel(t.housekeepingType) : "Clean";
    return hkLabel;
  }
  // Maintenance: title is usually description summary, keep but trim TRACK fluff
  const raw = t.title ?? "Maintenance work order";
  if (raw.includes("TRACK") && raw.length < 30) return "Maintenance work order";
  return raw;
}

function hkTypeLabel(type: string): string {
  switch (type) {
    case "checkout_clean": return "Checkout clean";
    case "mid_stay_clean": return "Mid-stay clean";
    case "deep_clean": return "Deep clean";
    case "linen_change": return "Linen change";
    case "owner_specific_clean": return "Owner clean";
    case "intermittent_clean": return "Intermittent clean";
    default: return "Clean";
  }
}

function statusLabel(s: string): string {
  switch (s) {
    case "new": return "New";
    case "assigned": return "Assigned";
    case "in_progress": return "In progress";
    case "completed": return "Completed";
    case "verified": return "Verified";
    case "blocked": return "Blocked";
    case "waiting_parts": return "Waiting on parts";
    case "processed": return "Processed";
    default: return s.replace(/_/g, " ");
  }
}

// ============================================================
// Top-level component
// ============================================================
export default function OperationsOverview() {
  const [params, setParams] = useSearchParams();
  const token = params.get("t") ?? "";
  // v27: derive filter state directly from URL params so browser back/forward
  // navigation keeps the UI in sync. Previously these were copied into local
  // state on first render and never re-synced.
  const propertyFilter = params.get("property") ?? "ALL";
  const searchQuery = params.get("q") ?? "";
  const priorityFilter = params.get("prio") ?? "ALL";
  const activeTab = params.get("tab") ?? "today";
  const detailParam = params.get("detail"); // "task:UUID" or "res:ID"

  const setTab = useCallback((v: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v === "today") next.delete("tab");
      else next.set("tab", v);
      return next;
    });
  }, [setParams]);

  const setProperty = useCallback((v: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v === "ALL") next.delete("property");
      else next.set("property", v);
      return next;
    });
  }, [setParams]);

  const setSearch = useCallback((v: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v.trim() === "") next.delete("q");
      else next.set("q", v);
      return next;
    });
  }, [setParams]);

  const setPriority = useCallback((v: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v === "ALL") next.delete("prio");
      else next.set("prio", v);
      return next;
    });
  }, [setParams]);

  const openDetail = useCallback((kind: "task" | "res", id: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("detail", `${kind}:${id}`);
      return next;
    });
  }, [setParams]);

  const closeDetail = useCallback(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("detail");
      return next;
    });
  }, [setParams]);

  const { data, error, isLoading, dataUpdatedAt, refetch, isFetching } = useQuery({
    queryKey: ["track-overview", token],
    queryFn: () => fetchOverview(token),
    enabled: token.length > 0,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
    retry: (failureCount, err) => {
      const code = (err as { code?: string } | null)?.code;
      if (code && ["expired", "bad_signature", "bad_format", "missing_token", "unsupported_version"].includes(code)) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const [justRefreshed, setJustRefreshed] = useState(false);
  useEffect(() => {
    if (!isFetching && justRefreshed) {
      const t = setTimeout(() => setJustRefreshed(false), 1200);
      return () => clearTimeout(t);
    }
  }, [isFetching, justRefreshed]);

  // Apply property + search + priority filters (compose)
  const filtered = useMemo(() => {
    if (!data) return null;
    const filterTask = (t: TaskCard) =>
      propertyMatchesFilter(t, propertyFilter) &&
      searchMatchesTask(t, searchQuery) &&
      priorityMatchesFilter(t, priorityFilter);
    const filterRes = (r: ReservationCard) =>
      propertyMatchesFilter(r, propertyFilter) &&
      searchMatchesRes(r, searchQuery);
    // Defensive: any of these can be missing if backend returns partial payload
    const res = data.reservations ?? {};
    const hk = data.housekeeping ?? {};
    const mt = data.maintenance ?? {};
    return {
      reservations: {
        arrivalsToday: (res.arrivalsToday ?? []).filter(filterRes),
        inHouse: (res.inHouse ?? []).filter(filterRes),
        checkoutsToday: (res.checkoutsToday ?? []).filter(filterRes),
        upcoming7d: (res.upcoming7d ?? []).filter(filterRes),
      },
      housekeeping: {
        scheduledToday: (hk.scheduledToday ?? []).filter(filterTask),
        inProgress: (hk.inProgress ?? []).filter(filterTask),
        completedPendingVerify: (hk.completedPendingVerify ?? []).filter(filterTask),
      },
      maintenance: {
        open: (mt.open ?? []).filter(filterTask),
        overdue: (mt.overdue ?? []).filter(filterTask),
        blocked: (mt.blocked ?? []).filter(filterTask),
        completedPendingVerify: (mt.completedPendingVerify ?? []).filter(filterTask),
      },
    };
  }, [data, propertyFilter, searchQuery, priorityFilter]);

  const hasActiveFilter = propertyFilter !== "ALL" || searchQuery !== "" || priorityFilter !== "ALL";
  const totalFilteredItems =
    (filtered?.reservations?.arrivalsToday.length ?? 0) +
    (filtered?.reservations?.inHouse.length ?? 0) +
    (filtered?.reservations?.checkoutsToday.length ?? 0) +
    (filtered?.reservations?.upcoming7d.length ?? 0) +
    (filtered?.housekeeping?.scheduledToday.length ?? 0) +
    (filtered?.housekeeping?.inProgress.length ?? 0) +
    (filtered?.housekeeping?.completedPendingVerify.length ?? 0) +
    (filtered?.maintenance?.open.length ?? 0) +
    (filtered?.maintenance?.overdue.length ?? 0) +
    (filtered?.maintenance?.blocked.length ?? 0) +
    (filtered?.maintenance?.completedPendingVerify.length ?? 0);

  const clearAllFilters = useCallback(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("property"); next.delete("q"); next.delete("prio");
      return next;
    });
  }, [setParams]);

  if (!token) return <ErrorState title="Missing share link token" detail="Open this page via the shareable URL with a token in the query string." />;
  if (isLoading) return <LoadingState />;
  if (error) {
    const code = (error as { code?: string }).code ?? "";
    if (code === "expired") return <ErrorState title="Share link has expired" detail="Ask your contact at LRMB for a new link." />;
    if (code === "bad_signature" || code === "bad_format") return <ErrorState title="Invalid share link" detail="The token in this URL has been tampered with or is malformed." />;
    return <ErrorState title="Could not load operations data" detail={String(error.message ?? error)} />;
  }
  if (!data || !filtered) return <ErrorState title="No data" detail="The overview returned empty." />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground">L</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">LRMB Operations</h1>
                <p className="text-xs text-muted-foreground">
                  Live view {data.viewer ? `· ${data.viewer}` : ""} · {data.totals.activeUnits} units · {data.totals.activeProperties} properties
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3">
              <PropertyFilter
                propertyList={data.propertyList}
                value={propertyFilter}
                onChange={setProperty}
              />
              <span className="hidden items-center gap-1.5 sm:flex">
                <Clock className="h-3.5 w-3.5" />
                <span>{dataUpdatedAt ? safeDistance(new Date(dataUpdatedAt).toISOString()) : "—"}</span>
              </span>
              <button
                type="button"
                onClick={() => { setJustRefreshed(true); refetch(); }}
                disabled={isFetching}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition",
                  isFetching && "opacity-50 cursor-wait",
                )}
                aria-label="Refresh now"
                data-print="hide"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", (isFetching || justRefreshed) && "animate-spin")} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
                aria-label="Print or save as PDF"
                data-print="hide"
                title="Print or save as PDF (Cmd/Ctrl+P)"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <PollHealthBanner health={data.pollHealth ?? []} />

        {/* FILTER BAR */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearch}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriority}
          hasActiveFilter={hasActiveFilter}
          totalFilteredItems={totalFilteredItems}
          onClear={clearAllFilters}
        />

        {/* KPI STRIP — v16: per-property breakdown when property filter is active.
            Backend serves a kpisByProperty[] array (sourced from mv_ops_dashboard_kpis_by_property,
            refreshed every 2 minutes) so even week-over-week tiles reflect the filtered property. */}
        <section aria-label="Key metrics">
          {(() => {
            const propertyFiltered = propertyFilter !== "ALL";
            const perPropertyKpi = propertyFiltered
              ? data.kpisByProperty?.find((p) => p.property === propertyFilter)
              : null;

            const hkCompletedTW = perPropertyKpi?.hkCompleted.thisWeek ?? data.kpis.hkCompleted.thisWeek;
            const hkCompletedLW = perPropertyKpi?.hkCompleted.lastWeek ?? data.kpis.hkCompleted.lastWeek;
            const maintCompletedTW = perPropertyKpi?.maintCompleted.thisWeek ?? data.kpis.maintCompleted.thisWeek;
            const maintCompletedLW = perPropertyKpi?.maintCompleted.lastWeek ?? data.kpis.maintCompleted.lastWeek;
            const hkInProgressNow = perPropertyKpi?.hkInProgress
              ?? (propertyFiltered ? filtered.housekeeping.inProgress.length : (data.kpis.hkInProgress ?? filtered.housekeeping.inProgress.length));
            const maintInProgressNow = perPropertyKpi?.maintInProgress
              ?? (propertyFiltered ? filtered.maintenance.open.filter((t) => t.status === "in_progress").length : (data.kpis.maintInProgress ?? 0));
            const maintOverdueNow = perPropertyKpi?.maintOverdue
              ?? (propertyFiltered ? filtered.maintenance.overdue.length : (data.kpis.maintOverdue ?? filtered.maintenance.overdue.length));
            const labelSuffix = propertyFiltered ? ` — ${propertyFilter}` : "";

            return (
              <>
                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                  <KpiTile
                    icon={Sparkles}
                    accent="#0680A2"
                    label={`Cleans completed (7d)${labelSuffix}`}
                    value={hkCompletedTW}
                    delta={deltaIcon(hkCompletedTW, hkCompletedLW)}
                    context={`vs ${hkCompletedLW} last week`}
                  />
                  <KpiTile
                    icon={Wrench}
                    accent="#1D1F28"
                    label={`Maintenance completed (7d)${labelSuffix}`}
                    value={maintCompletedTW}
                    delta={deltaIcon(maintCompletedTW, maintCompletedLW)}
                    context={`vs ${maintCompletedLW} last week`}
                  />
                  <KpiTile
                    icon={Activity}
                    accent="#FF5C5C"
                    label={`In progress now${labelSuffix}`}
                    value={hkInProgressNow + maintInProgressNow}
                    context={`${hkInProgressNow} cleans · ${maintInProgressNow} maint`}
                  />
                  <KpiTile
                    icon={AlertTriangle}
                    accent={maintOverdueNow > 0 ? "#cc0000" : "#999"}
                    label={`Overdue maintenance${labelSuffix}`}
                    value={maintOverdueNow}
                    context={maintOverdueNow === 0 ? "all on track" : "needs attention"}
                    alert={maintOverdueNow > 0}
                  />
                </div>
                {propertyFiltered && !perPropertyKpi && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Per-property breakdown for <strong className="text-foreground">{propertyFilter}</strong> not in cache yet — showing live counts; week-over-week is portfolio-wide.
                  </p>
                )}
              </>
            );
          })()}
        </section>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setTab} className="space-y-6">
          <TabsList className="flex w-full justify-start overflow-x-auto bg-card border border-border p-1">
            <TabsTrigger value="today" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <ListChecks className="h-3.5 w-3.5 mr-1.5" />Today
            </TabsTrigger>
            <TabsTrigger value="housekeeping" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />Cleaning ({filtered.housekeeping.scheduledToday.length + filtered.housekeeping.inProgress.length + filtered.housekeeping.completedPendingVerify.length})
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Wrench className="h-3.5 w-3.5 mr-1.5" />Maintenance ({filtered.maintenance.open.length + filtered.maintenance.blocked.length})
            </TabsTrigger>
            {data.recentPhotos && data.recentPhotos.length > 0 && (
              <TabsTrigger value="photos" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <ImageIcon className="h-3.5 w-3.5 mr-1.5" />Photos ({data.recentPhotos.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="activity" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Activity className="h-3.5 w-3.5 mr-1.5" />Activity ({data.recentActivity?.length ?? 0})
            </TabsTrigger>
            {data.damageClaims && data.damageClaims.total > 0 && (
              <TabsTrigger value="claims" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />Claims ({data.damageClaims.total})
              </TabsTrigger>
            )}
          </TabsList>

          {/* TODAY */}
          <TabsContent value="today" className="space-y-6">
            <section>
              <SectionHeading title="Reservation pipeline" subtitle={`${filtered.reservations.arrivalsToday.length} arriving · ${filtered.reservations.inHouse.length} in house · ${filtered.reservations.checkoutsToday.length} checking out`} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 mt-3">
                <ReservationPanel icon={ArrowDownToLine} accent="#0680A2" label="Arrivals today" cards={filtered.reservations.arrivalsToday} onOpenDetail={openDetail} />
                <ReservationPanel icon={Users} accent="#0680A2" label="In house now" cards={filtered.reservations.inHouse} onOpenDetail={openDetail} />
                <ReservationPanel icon={ArrowUpFromLine} accent="#FF5C5C" label="Checkouts today" cards={filtered.reservations.checkoutsToday} onOpenDetail={openDetail} />
                <ReservationPanel icon={Clock} accent="#1D1F28" label="Upcoming 7 days" cards={filtered.reservations.upcoming7d} onOpenDetail={openDetail} />
              </div>
            </section>

            <section>
              <SectionHeading title="Today's queue" subtitle="Cleans and maintenance scheduled or in progress today" />
              <div className="grid gap-3 lg:grid-cols-2 mt-3">
                <TaskPanel
                  title="Cleans in motion"
                  icon={Sparkles}
                  accent="#0680A2"
                  tasks={dedupeById([...filtered.housekeeping.scheduledToday, ...filtered.housekeeping.inProgress])}
                  emptyLabel="No cleans scheduled for today"
                onOpenDetail={openDetail} />
                <TaskPanel
                  title="Active maintenance"
                  icon={Wrench}
                  accent="#1D1F28"
                  tasks={filtered.maintenance.open.filter((t) => t.status === "in_progress" || t.status === "assigned")}
                  emptyLabel="No maintenance in flight"
                  onOpenDetail={openDetail}
                />
              </div>
            </section>
          </TabsContent>

          {/* HOUSEKEEPING */}
          <TabsContent value="housekeeping" className="space-y-6">
            <SectionHeading title="Housekeeping" subtitle="Cleans across the portfolio" />
            <div className="grid gap-3 lg:grid-cols-3">
              <TaskPanel title="Scheduled today" icon={Clock} accent="#0680A2" tasks={filtered.housekeeping.scheduledToday} emptyLabel="Nothing scheduled today" onOpenDetail={openDetail} />
              <TaskPanel title="In progress" icon={Activity} accent="#0680A2" tasks={filtered.housekeeping.inProgress} emptyLabel="No cleaners on the clock" onOpenDetail={openDetail} />
              <TaskPanel title="Pending verification" icon={CheckCircle2} accent="#FF5C5C" tasks={filtered.housekeeping.completedPendingVerify} emptyLabel="Caught up" tone="warning" onOpenDetail={openDetail} />
            </div>
          </TabsContent>

          {/* MAINTENANCE */}
          <TabsContent value="maintenance" className="space-y-6">
            <SectionHeading title="Maintenance" subtitle="Work orders across the portfolio" />
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
              <TaskPanel title="Open" icon={ListChecks} accent="#1D1F28" tasks={filtered.maintenance.open} emptyLabel="No open work orders" onOpenDetail={openDetail} />
              <TaskPanel title="Overdue" icon={AlertTriangle} accent="#cc0000" tasks={filtered.maintenance.overdue} emptyLabel="Nothing past due" tone="danger" onOpenDetail={openDetail} />
              <TaskPanel title="Blocked" icon={AlertCircle} accent="#FF5C5C" tasks={filtered.maintenance.blocked} emptyLabel="Nothing blocked" tone="warning" onOpenDetail={openDetail} />
              <TaskPanel title="Pending verification" icon={CheckCircle2} accent="#FF5C5C" tasks={filtered.maintenance.completedPendingVerify} emptyLabel="Caught up" tone="warning" onOpenDetail={openDetail} />
            </div>
          </TabsContent>

          {/* PHOTOS */}
          {data.recentPhotos && data.recentPhotos.length > 0 && (
            <TabsContent value="photos" className="space-y-3">
              <SectionHeading title="Recent photo proof" subtitle={`${data.recentPhotos.length} photos uploaded by field staff`} />
              <PhotoGallery photos={data.recentPhotos} />
            </TabsContent>
          )}

          {/* ACTIVITY */}
          <TabsContent value="activity" className="space-y-3">
            <SectionHeading title="Recent activity" subtitle="Last 24 hours · status changes, completions, assignments" />
            {data.recentActivity && data.recentActivity.length > 0
              ? <ActivityFeed activity={data.recentActivity} onOpenDetail={openDetail} />
              : <EmptyState icon={Activity} message="No activity in the last 24 hours yet." hint="Status changes, completions, and notes from field staff show up here in real time." />}
          </TabsContent>

          {/* CLAIMS */}
          {data.damageClaims && data.damageClaims.total > 0 && (
            <TabsContent value="claims" className="space-y-3">
              <SectionHeading title="Active damage claims" subtitle="Guest-damage work orders with deadline tracking" />
              <DamageClaimsTable claims={data.damageClaims} />
            </TabsContent>
          )}
        </Tabs>

        <footer className="border-t border-border pt-4 text-xs text-muted-foreground">
          Auto-refresh every 5 minutes · Generated {safeFormat(data.generatedAt, "PPpp")} · Read-only view
        </footer>
      </main>

      {/* Drill-down modal — controlled by ?detail=task:UUID or res:ID URL param */}
      <DetailModal token={token} detailParam={detailParam} onClose={closeDetail} onOpenDetail={openDetail} />
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function PropertyFilter({ propertyList, value, onChange }: { propertyList: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/30"
      aria-label="Filter by property"
    >
      <option value="ALL">All properties ({propertyList.length})</option>
      {propertyList.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  );
}

function FilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  hasActiveFilter,
  totalFilteredItems,
  onClear,
}: {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  priorityFilter: string;
  onPriorityChange: (v: string) => void;
  hasActiveFilter: boolean;
  totalFilteredItems: number;
  onClear: () => void;
}) {
  const priorities = [
    { value: "ALL", label: "All priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ] as const;

  return (
    <section
      aria-label="Search and filters"
      data-print="hide"
      className="rounded-lg border border-border bg-card/50 px-3 py-3 sm:px-4 sm:py-3"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search work orders, units, properties, IDs…"
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            aria-label="Search work orders and reservations"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Priority chips */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Filter by priority">
          <Filter className="hidden h-4 w-4 text-muted-foreground sm:inline" aria-hidden="true" />
          {priorities.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onPriorityChange(p.value)}
              aria-pressed={priorityFilter === p.value}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                priorityFilter === p.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Active filter summary + clear */}
        {hasActiveFilter && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:ml-auto">
            <span>
              {totalFilteredItems} item{totalFilteredItems === 1 ? "" : "s"} match
            </span>
            <button
              type="button"
              onClick={onClear}
              className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium hover:bg-muted"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

function KpiTile({ icon: Icon, accent, label, value, delta, context, alert }: {
  icon: React.ElementType;
  accent: string;
  label: string;
  value: number;
  delta?: { Icon: React.ElementType; color: string; label: string };
  context?: string;
  alert?: boolean;
}) {
  return (
    <Card className={cn("border", alert && "border-destructive/30 bg-destructive/10")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: `${accent}15`, color: accent }}>
            <Icon className="h-4 w-4" />
          </div>
          {delta && (
            <div className={cn("flex items-center gap-0.5 text-xs font-medium", delta.color)}>
              <delta.Icon className="h-3 w-3" />
              {delta.label}
            </div>
          )}
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
        <p className="text-xs font-medium text-foreground">{label}</p>
        {context && <p className="text-[11px] text-muted-foreground mt-0.5">{context}</p>}
      </CardContent>
    </Card>
  );
}

function ReservationPanel({ icon: Icon, accent, label, cards, onOpenDetail }: {
  icon: React.ElementType;
  accent: string;
  label: string;
  cards: ReservationCard[];
  onOpenDetail?: (kind: "task" | "res", id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
            {label}
          </span>
          <Badge variant="secondary" className="rounded-full">{cards.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cards.length === 0 ? (
          <p className="text-xs italic text-muted-foreground">none</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-auto" aria-label={label}>
            {cards.slice(0, 12).map((c) => (
              <li
                key={`${c.externalId ?? "no-id"}-${c.arrivalDate ?? ""}-${c.unitId ?? ""}`}
                onClick={() => onOpenDetail?.("res", c.externalId)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenDetail?.("res", c.externalId); } }}
                role={onOpenDetail ? "button" : undefined}
                tabIndex={onOpenDetail ? 0 : undefined}
                className={cn(
                  "flex flex-col gap-0.5 rounded-md border border-border bg-muted/40 p-2",
                  onOpenDetail && "cursor-pointer hover:bg-muted hover:border-accent/40 transition",
                )}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium truncate">{locationLabel(c)}</span>
                  {c.status && <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4">{c.status}</Badge>}
                </div>
                <div className="text-[11px] text-muted-foreground tabular-nums">
                  {safeFormat(c.arrivalDate, "MMM d")}
                  {" → "}
                  {safeFormat(c.departureDate, "MMM d")}
                  {c.nights ? ` · ${c.nights}n` : ""}
                  {" · "}{occupantsLabel(c.occupants)}
                </div>
              </li>
            ))}
            {cards.length > 12 && <li className="text-[11px] italic text-muted-foreground">+ {cards.length - 12} more</li>}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function TaskPanel({ title, icon: Icon, accent, tasks, emptyLabel, tone = "default", onOpenDetail }: {
  title: string;
  icon: React.ElementType;
  accent: string;
  tasks: TaskCard[];
  emptyLabel: string;
  tone?: "default" | "warning" | "danger";
  onOpenDetail?: (kind: "task" | "res", id: string) => void;
}) {
  const toneCls =
    tone === "danger" ? "border-destructive/30 bg-destructive/10" :
    tone === "warning" ? "border-amber-500/30 bg-amber-500/10" :
    "";
  return (
    <Card className={cn(toneCls)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
            {title}
          </span>
          <Badge variant={tone === "danger" ? "destructive" : "secondary"} className="rounded-full">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-xs italic text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-auto" aria-label={title}>
            {tasks.slice(0, 30).map((t) => {
              const pri = priorityBadge(t.priority);
              return (
                <li
                  key={t.id}
                  onClick={() => onOpenDetail?.("task", t.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenDetail?.("task", t.id); } }}
                  role={onOpenDetail ? "button" : undefined}
                  tabIndex={onOpenDetail ? 0 : undefined}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-md border border-border bg-card p-2",
                    onOpenDetail && "cursor-pointer hover:bg-muted hover:border-accent/40 transition",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium truncate" title={locationLabel(t)}>{locationLabel(t)}</span>
                    {pri && <Badge variant="outline" className={cn("ml-auto text-[10px] py-0 h-4", pri.className)}>{pri.label}</Badge>}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate" title={t.title}>{displayTitle(t)} · {statusLabel(t.status)}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">
                    {t.dueAt ? `Due ${safeDistance(t.dueAt)}`
                      : t.startedAt ? `Started ${safeDistance(t.startedAt)}`
                      : t.updatedAt ? `Updated ${safeDistance(t.updatedAt)}` : ""}
                    {t.blockedReason ? ` · blocked: ${t.blockedReason}` : ""}
                  </div>
                </li>
              );
            })}
            {tasks.length > 30 && <li className="text-[11px] italic text-muted-foreground">+ {tasks.length - 30} more</li>}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function PhotoGallery({ photos }: { photos: PhotoRow[] }) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {(photos ?? []).map((p) => {
        const tooltip = `${p.task_title ?? ""} — ${p.task_status} — ${p.uploaded_by_name ?? "unknown"}`;
        const caption = (
          <span className="absolute bottom-0 inset-x-0 truncate bg-gradient-to-t from-black/85 to-transparent px-2 py-1 text-[10px] text-white">
            {p.task_title ?? "Photo"} · {safeDistance(p.uploaded_at)}
          </span>
        );
        // Render <a> only when there's an actual URL; otherwise a non-clickable div.
        return p.signed_url ? (
          <a
            key={p.photo_id}
            href={p.signed_url}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative overflow-hidden rounded-md border border-border bg-card hover:ring-2 hover:ring-accent/40 transition aspect-square"
            title={tooltip}
          >
            <img src={p.signed_url} alt={p.caption ?? p.task_title ?? "Photo proof"} loading="lazy" className="h-full w-full object-cover" />
            {caption}
          </a>
        ) : (
          <div
            key={p.photo_id}
            className="group relative overflow-hidden rounded-md border border-border bg-card aspect-square"
            title={tooltip}
          >
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">No preview</div>
            {caption}
          </div>
        );
      })}
    </div>
  );
}

function ActivityFeed({ activity, onOpenDetail }: { activity: ActivityRow[]; onOpenDetail?: (kind: "task" | "res", id: string) => void }) {
  const [categoryFilter, setCategoryFilter] = useState<"all" | "housekeeping" | "maintenance">("all");
  const [eventFilter, setEventFilter] = useState<"all" | "completed" | "blocked" | "in_progress" | "with_note" | "with_photo">("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // v30: track IDs seen on previous render so we can show "N new since last refresh"
  // on auto-refetch (default 5-min interval). Cleared when user clicks the badge.
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isFirstRenderRef = useRef(true);
  const [newSinceRefresh, setNewSinceRefresh] = useState<string[]>([]);
  useEffect(() => {
    if (isFirstRenderRef.current) {
      // First render — seed seen set without showing badge
      isFirstRenderRef.current = false;
      seenIdsRef.current = new Set(activity.map((a) => a.id));
      return;
    }
    const fresh = activity.filter((a) => !seenIdsRef.current.has(a.id)).map((a) => a.id);
    if (fresh.length > 0) {
      setNewSinceRefresh((prev) => [...new Set([...prev, ...fresh])]);
      for (const id of fresh) seenIdsRef.current.add(id);
    }
  }, [activity]);
  const dismissNewBadge = useCallback(() => setNewSinceRefresh([]), []);

  const filtered = useMemo(() => {
    return activity.filter((a) => {
      if (categoryFilter !== "all" && a.task_category !== categoryFilter) return false;
      if (eventFilter === "completed" && a.new_status !== "completed") return false;
      if (eventFilter === "blocked" && a.new_status !== "blocked") return false;
      if (eventFilter === "in_progress" && a.new_status !== "in_progress") return false;
      if (eventFilter === "with_note" && !a.note) return false;
      if (eventFilter === "with_photo" && a.photo_count <= 0) return false;
      return true;
    });
  }, [activity, categoryFilter, eventFilter]);

  // Group by hour for scannability
  const grouped = useMemo(() => {
    const groups: { hourLabel: string; items: ActivityRow[] }[] = [];
    let currentHour: string | null = null;
    for (const a of filtered) {
      const hourKey = safeFormat(a.created_at, "MMM d, h a", "Unknown time");
      if (hourKey !== currentHour) {
        currentHour = hourKey;
        groups.push({ hourLabel: hourKey, items: [] });
      }
      groups[groups.length - 1].items.push(a);
    }
    return groups;
  }, [filtered]);

  const totalEvents = filtered.length;
  // v27: compute category counts in a single pass instead of filtering twice per render
  const categoryCounts = useMemo(() => {
    let hk = 0, mt = 0;
    for (const a of activity) {
      if (a.task_category === "housekeeping") hk++;
      else if (a.task_category === "maintenance") mt++;
    }
    return { all: activity.length, housekeeping: hk, maintenance: mt };
  }, [activity]);
  const categoryChips = [
    { value: "all" as const, label: `All (${categoryCounts.all})` },
    { value: "housekeeping" as const, label: `Housekeeping (${categoryCounts.housekeeping})` },
    { value: "maintenance" as const, label: `Maintenance (${categoryCounts.maintenance})` },
  ];
  const eventChips = [
    { value: "all" as const, label: "All events" },
    { value: "completed" as const, label: "Completed" },
    { value: "in_progress" as const, label: "Started" },
    { value: "blocked" as const, label: "Blocked" },
    { value: "with_note" as const, label: "With note" },
    { value: "with_photo" as const, label: "With photo" },
  ];

  return (
    <div className="space-y-3">
      {/* Filter chips */}
      <div className="flex flex-col gap-2 rounded-md border border-border bg-card/40 p-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter activity by category">
          {categoryChips.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategoryFilter(c.value)}
              aria-pressed={categoryFilter === c.value}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                categoryFilter === c.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter activity by event type">
          {eventChips.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setEventFilter(c.value)}
              aria-pressed={eventFilter === c.value}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                eventFilter === c.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {newSinceRefresh.length > 0 && (
            <button
              type="button"
              onClick={dismissNewBadge}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent hover:bg-accent/15 transition"
              aria-label={`${newSinceRefresh.length} new event${newSinceRefresh.length === 1 ? "" : "s"} since last refresh — click to dismiss`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" aria-hidden="true"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              <span>{newSinceRefresh.length} new</span>
            </button>
          )}
          <span>{totalEvents} event{totalEvents === 1 ? "" : "s"} shown</span>
        </div>
      </div>

      {totalEvents === 0 ? (
        <EmptyState icon={Filter} message="No activity matches the current filters." hint="Try widening the category or event filter." />
      ) : (
        <Card>
          <CardContent className="p-0">
            {grouped.map((g, gi) => (
              <div key={`${g.hourLabel}-${gi}`}>
                <div className="sticky top-0 z-10 bg-muted/95 backdrop-blur px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground border-b border-border">
                  {g.hourLabel}
                </div>
                <ul className="divide-y divide-border" aria-label="Activity events">
                  {g.items.map((a) => {
                    const isExpanded = expanded[a.id] ?? false;
                    const icon = a.new_status === "completed" ? <CheckCircle2 className="h-4 w-4 text-[hsl(152_60%_60%)]" />
                      : a.new_status === "blocked" ? <AlertCircle className="h-4 w-4 text-destructive" />
                      : a.new_status === "verified" ? <CheckCircle2 className="h-4 w-4 text-[#0680A2]" />
                      : a.new_status === "in_progress" ? <Activity className="h-4 w-4 text-[#0680A2]" />
                      : <Activity className="h-4 w-4 text-muted-foreground" />;
                    const verb = a.update_type === "status_change" && a.old_status && a.new_status
                      ? `moved to ${a.new_status.replace(/_/g, " ")}`
                      : a.update_type === "priority_change" ? "priority updated"
                      : a.update_type === "create" ? "created"
                      : a.update_type.replace(/_/g, " ");
                    const hasExpandableContent = !!a.note;
                    const handleRowClick = () => {
                      if (onOpenDetail && a.task_id) onOpenDetail("task", a.task_id);
                    };
                    return (
                      <li
                        key={a.id}
                        className={cn(
                          "group flex items-start gap-3 p-3 text-sm hover:bg-muted/40 transition",
                          newSinceRefresh.includes(a.id) && "bg-accent/[0.06] border-l-2 border-accent/60",
                        )}
                      >
                        <span className="mt-0.5 shrink-0">{icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <button
                              type="button"
                              onClick={handleRowClick}
                              className="truncate text-left font-medium hover:underline focus:outline-none focus:underline"
                              title={a.task_title ?? undefined}
                            >
                              {a.task_title ?? "Work Order (no title)"}
                            </button>
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0 text-[10px] uppercase tracking-wide",
                                a.task_category === "housekeeping"
                                  ? "border-accent/40 text-accent"
                                  : "border-amber-500/40 text-amber-400",
                              )}
                            >
                              {a.task_category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {a.actor_name && a.actor_name !== "System" ? a.actor_name : "System"} · {verb}
                            {a.photo_count > 0 ? ` · ${a.photo_count} 📷` : ""}
                          </p>
                          {a.note && (
                            <div className="mt-1 text-xs italic text-muted-foreground">
                              <p className={isExpanded ? "" : "line-clamp-2"}>"{a.note}"</p>
                              {a.note.length > 120 && (
                                <button
                                  type="button"
                                  onClick={() => setExpanded((s) => ({ ...s, [a.id]: !isExpanded }))}
                                  className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-accent hover:underline"
                                  aria-expanded={isExpanded}
                                >
                                  {isExpanded ? "Show less" : "Show more"}
                                </button>
                              )}
                            </div>
                          )}
                          {hasExpandableContent || onOpenDetail ? (
                            <button
                              type="button"
                              onClick={handleRowClick}
                              className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-accent hover:underline"
                            >
                              Open work order →
                            </button>
                          ) : null}
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                          {safeFormat(a.created_at, "h:mm a")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PollHealthBanner({ health }: { health: Health[] }) {
  const issues = useMemo(() => health.filter((h) => h.health !== "healthy"), [health]);
  if (issues.length === 0) return null;
  return (
    <div className="flex items-start gap-3 rounded-md border border-amber-600/40 bg-amber-500/10 px-4 py-3 text-sm">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
      <div className="flex-1">
        <p className="font-medium text-amber-200">Data sync notice</p>
        <p className="text-xs text-amber-300/80">
          Some live data feeds are slightly delayed (
          {issues.map((h) => h.collection_name).join(", ")}
          ). The numbers below may be a few minutes behind. We're investigating.
        </p>
      </div>
    </div>
  );
}

function DamageClaimsTable({ claims }: { claims: { total: number; overdue: number; urgent: number; approaching: number; items: DamageClaim[] } }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span>{claims.total} active claim{claims.total !== 1 ? "s" : ""}</span>
          {claims.overdue > 0 && <Badge variant="destructive" className="text-xs">{claims.overdue} overdue</Badge>}
          {claims.urgent > 0 && <Badge className="bg-amber-500 text-white text-xs">{claims.urgent} urgent</Badge>}
          {claims.approaching > 0 && <Badge variant="secondary" className="text-xs">{claims.approaching} approaching</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left py-2 pr-3 font-medium">Deadline</th>
                <th className="text-left py-2 pr-3 font-medium">Property / Unit</th>
                <th className="text-left py-2 pr-3 font-medium">Work Order</th>
                <th className="text-left py-2 pr-3 font-medium">Status</th>
                <th className="text-right py-2 pr-3 font-medium">Filed amount</th>
              </tr>
            </thead>
            <tbody>
              {claims.items.slice(0, 20).map((c) => (
                <tr key={c.task_id} className="border-b border-border">
                  <td className="py-2 pr-3">
                    {c.deadline_status === "overdue" && <Badge variant="destructive" className="text-[10px]">Overdue</Badge>}
                    {c.deadline_status === "urgent" && <Badge className="bg-amber-500 text-white text-[10px]">Urgent</Badge>}
                    {c.deadline_status === "approaching" && <Badge variant="secondary" className="text-[10px]">Approaching</Badge>}
                    {c.deadline_status === "fine" && <span className="text-muted-foreground">—</span>}
                    {c.hours_to_deadline != null && (
                      <span className="ml-2 text-muted-foreground tabular-nums">
                        {Math.abs(c.hours_to_deadline) < 48 ? `${Math.round(c.hours_to_deadline)}h` : `${Math.round(c.hours_to_deadline / 24)}d`}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <div className="font-medium">{c.property ?? "—"}</div>
                    {c.unit_code && <div className="text-muted-foreground text-[11px]">{c.unit_code}</div>}
                  </td>
                  <td className="py-2 pr-3 max-w-md truncate">{c.title}</td>
                  <td className="py-2 pr-3">{c.claim_status ?? "pending"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{c.claim_filed_amount != null ? `$${c.claim_filed_amount.toLocaleString()}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message, icon: Icon = CheckCircle2, hint }: { message: string; icon?: React.ElementType; hint?: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border">
          <Icon className="h-6 w-6 text-muted-foreground/70" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-foreground">{message}</p>
        {hint && <p className="text-xs text-muted-foreground max-w-sm">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton — mirror real header so transition to data is seamless */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Filter bar skeleton */}
        <div className="rounded-lg border border-border bg-card/50 px-4 py-3 flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-full sm:max-w-md" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        {/* KPI strip skeleton */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs strip skeleton */}
        <Skeleton className="h-10 w-full max-w-xl" />

        {/* Reservation pipeline skeleton */}
        <div>
          <Skeleton className="h-5 w-44 mb-3" />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-1.5 rounded-md border border-border bg-muted/40 p-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-3/4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Today's queue skeleton */}
        <div>
          <Skeleton className="h-5 w-44 mb-3" />
          <div className="grid gap-3 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground" aria-live="polite">
          Loading operations data…
        </p>
      </main>
    </div>
  );
}

function ErrorState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// Drill-down detail modal
// ============================================================
interface TaskDetailPayload {
  task: {
    id: string;
    title: string | null;
    description: string | null;
    status: string;
    priority: string;
    task_category: string;
    housekeeping_type: string | null;
    task_type: string | null;
    external_source: string | null;
    external_id: string | null;
    reservation_id: string | null;
    blocked_reason: string | null;
    due_at: string | null;
    scheduled_for: string | null;
    started_at: string | null;
    completed_at: string | null;
    processed_at: string | null;
    updated_at: string;
    created_at: string;
    requires_photo: boolean;
    requires_note: boolean;
    requires_timestamp: boolean;
    damage_classification: string | null;
    claim_status: string | null;
    claim_filed_amount: number | null;
    claim_deadline_at: string | null;
    units: { unit_code: string | null; short_name: string | null; track_id: number | null } | null;
    properties: { name: string; address: string | null } | null;
  };
  photos: Array<{ id: string; storage_path: string; photo_type: string; photo_subtype: string | null; caption: string | null; created_at: string; signed_url: string | null; track_attachment_id: string | null; track_synced_at: string | null }>;
  activity: Array<{ id: string; action: string; actor_name: string | null; payload_json: Record<string, unknown>; description: string | null; created_at: string }>;
  linkedReservation: Record<string, unknown> | null;
}

interface ResDetailPayload {
  reservation: Record<string, unknown>;
  eventHistory: Array<{ eventType: string; eventAt: string; createdAt: string }>;
  linkedTasks: Array<{ id: string; title: string; status: string; priority: string; task_category: string; housekeeping_type: string | null; task_type: string | null; external_id: string | null; description: string | null; due_at: string | null; scheduled_for: string | null; started_at: string | null; completed_at: string | null; updated_at: string | null; units: { unit_code: string | null; short_name: string | null } | null; properties: { name: string } | null }>;
}

async function fetchDetail(token: string, detailParam: string): Promise<TaskDetailPayload | ResDetailPayload> {
  if (!SUPABASE_URL) throw new Error("VITE_SUPABASE_URL not configured");
  const [kind, id] = detailParam.split(":");
  const qs = kind === "task" ? `id=${encodeURIComponent(id)}` : `reservation=${encodeURIComponent(id)}`;
  const res = await fetch(`${SUPABASE_URL}/functions/v1/track-detail?t=${encodeURIComponent(token)}&${qs}`);
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error(b?.message ?? b?.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

function DetailModal({ token, detailParam, onClose, onOpenDetail }: {
  token: string;
  detailParam: string | null;
  onClose: () => void;
  onOpenDetail: (kind: "task" | "res", id: string) => void;
}) {
  const isOpen = !!detailParam;
  const kind = detailParam?.split(":")[0] as "task" | "res" | undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["detail", token, detailParam],
    queryFn: () => fetchDetail(token, detailParam!),
    enabled: isOpen && !!detailParam,
    staleTime: 30_000,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
          <DialogTitle className="text-base">
            {kind === "task" ? "Work Order Detail" : kind === "res" ? "Reservation Detail" : "Detail"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Read-only · click outside or press Esc to close
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-90px)]">
          <div className="p-6">
            {isLoading && <ModalSkeleton />}
            {error && <ModalError detail={String((error as Error).message)} />}
            {data && kind === "task" && <TaskDetailView payload={data as TaskDetailPayload} onOpenDetail={onOpenDetail} />}
            {data && kind === "res" && <ReservationDetailView payload={data as ResDetailPayload} onOpenDetail={onOpenDetail} />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function ModalSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

function ModalError({ detail }: { detail: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm font-medium">Could not load detail</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function TaskDetailView({ payload, onOpenDetail }: { payload: TaskDetailPayload; onOpenDetail: (kind: "task" | "res", id: string) => void }) {
  const t = payload.task;
  const u = t.units;
  const p = t.properties;
  // Defensive: API may return null/missing arrays on partial deploy or DB error
  const taskPhotos = payload.photos ?? [];
  const taskActivity = payload.activity ?? [];
  const displayName = t.task_category === "housekeeping"
    ? (t.housekeeping_type ? hkTypeLabel(t.housekeeping_type) : "Clean")
    : (t.title ?? "Maintenance work order");
  const locLabel = u && p
    ? `${u.short_name ?? u.unit_code ?? ""} · ${p.name}`
    : (p?.name ?? "Unknown property");

  return (
    <div className="space-y-5">
      {/* Header block */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">{displayName}</h3>
          <Badge variant="outline" className="capitalize">{statusLabel(t.status)}</Badge>
          {priorityBadge(t.priority) && (
            <Badge variant="outline" className={cn(priorityBadge(t.priority)!.className)}>
              {priorityBadge(t.priority)!.label} priority
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{locLabel}</span>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <KV icon={Tag} label="Type" value={t.task_category === "housekeeping" ? `Housekeeping · ${hkTypeLabel(t.housekeeping_type ?? "")}` : "Maintenance"} />
        {t.due_at && <KV icon={Calendar} label="Due" value={safeFormat(t.due_at, "PPp")} />}
        {t.scheduled_for && <KV icon={Calendar} label="Scheduled" value={safeFormat(t.scheduled_for, "PPp")} />}
        {t.started_at && <KV icon={Activity} label="Started" value={safeFormat(t.started_at, "PPp")} />}
        {t.completed_at && <KV icon={CheckCircle2} label="Completed" value={safeFormat(t.completed_at, "PPp")} />}
        {t.updated_at && <KV icon={Clock} label="Last update" value={safeDistance(t.updated_at)} tooltip={safeFormat(t.updated_at, "PPpp")} />}
        {t.external_id && <KV icon={Link2} label="TRACK ref" value={`#${t.external_id}`} />}
      </div>

      {/* Description / blocked reason */}
      {t.description && (
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{t.description}</p>
        </div>
      )}
      {t.blocked_reason && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3">
          <p className="text-xs font-medium text-destructive mb-1">Blocked</p>
          <p className="text-sm">{t.blocked_reason}</p>
        </div>
      )}

      {/* Photos */}
      {taskPhotos.length > 0 && (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Photos ({taskPhotos.length})</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {taskPhotos.map((ph) =>
              ph.signed_url ? (
                <a key={ph.id} href={ph.signed_url} target="_blank" rel="noreferrer noopener" className="block aspect-square overflow-hidden rounded-md border border-border bg-card hover:ring-2 hover:ring-accent/40 transition">
                  <img src={ph.signed_url} alt={ph.caption ?? "Photo proof"} loading="lazy" className="h-full w-full object-cover" />
                </a>
              ) : (
                <div key={ph.id} className="flex aspect-square w-full items-center justify-center rounded-md border border-border bg-card text-xs text-muted-foreground" title="No preview available">
                  No preview
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Linked reservation */}
      {payload.linkedReservation && t.reservation_id && (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Linked reservation</h4>
          <button
            onClick={() => onOpenDetail("res", t.reservation_id!)}
            className="w-full text-left rounded-md border border-border bg-muted/30 p-3 hover:bg-muted hover:border-accent/40 transition"
          >
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="h-3.5 w-3.5 text-accent" />
              <span className="font-medium">Reservation #{t.reservation_id}</span>
              {payload.linkedReservation.status && (
                <Badge variant="outline" className="ml-auto text-[10px]">{String(payload.linkedReservation.status)}</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {safeFormat(payload.linkedReservation.arrivalDate as string | null | undefined, "PP")}
              {" → "}
              {safeFormat(payload.linkedReservation.departureDate as string | null | undefined, "PP")}
              {payload.linkedReservation.nights ? ` · ${payload.linkedReservation.nights} nights` : ""}
            </div>
          </button>
        </div>
      )}

      {/* Activity history */}
      {taskActivity.length > 0 && (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <History className="h-3 w-3" />
            Activity history ({taskActivity.length})
          </h4>
          <ul className="space-y-1.5 max-h-64 overflow-auto rounded-md border border-border bg-muted/20">
            {taskActivity.map((a) => (
              <li key={a.id} className="px-3 py-2 text-xs border-b border-border/40 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{describeActivity(a)}</span>
                  <span className="text-muted-foreground tabular-nums shrink-0" title={safeFormat(a.created_at, "PPpp")}>
                    {safeDistance(a.created_at)}
                  </span>
                </div>
                {a.actor_name && a.actor_name !== "System" && (
                  <div className="text-muted-foreground mt-0.5"><User className="inline h-3 w-3 mr-0.5" />{a.actor_name}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ReservationDetailView({ payload, onOpenDetail }: { payload: ResDetailPayload; onOpenDetail: (kind: "task" | "res", id: string) => void }) {
  const r = (payload.reservation ?? {}) as Record<string, unknown>;
  const linkedTasks = payload.linkedTasks ?? [];
  const eventHistory = payload.eventHistory ?? [];
  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">Reservation #{String(r.id ?? "")}</h3>
          {r.status && <Badge variant="outline">{String(r.status)}</Badge>}
        </div>
        {r.unitId != null && <p className="text-sm text-muted-foreground">TRACK unit #{String(r.unitId)}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {r.arrivalDate && <KV icon={ArrowDownToLine} label="Arrival" value={safeFormat(String(r.arrivalDate), "PPP")} />}
        {r.departureDate && <KV icon={ArrowUpFromLine} label="Departure" value={safeFormat(String(r.departureDate), "PPP")} />}
        {r.nights != null && <KV icon={Clock} label="Nights" value={String(r.nights)} />}
        {r.occupants != null && <KV icon={Users} label="Occupants" value={occupantsLabel(r.occupants as ReservationCard["occupants"])} />}
      </div>

      {linkedTasks.length > 0 && (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <ListChecks className="h-3 w-3" />
            Linked work orders ({linkedTasks.length})
          </h4>
          <ul className="space-y-1.5">
            {linkedTasks.map((t) => {
              // TRACK PMS creates a separate "Inspection" task alongside every Checkout clean WO.
              // Detect it from description so the two rows aren't indistinguishable in the UI.
              const isInspection = (t.description ?? "").toLowerCase().includes("inspection");
              const subLabel = isInspection
                ? "Inspection"
                : t.housekeeping_type
                  ? hkTypeLabel(t.housekeeping_type)
                  : (t.title ?? "—");
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onOpenDetail("task", t.id)}
                    className="w-full text-left rounded-md border border-border bg-muted/30 p-2 hover:bg-muted hover:border-accent/40 transition"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium capitalize">{t.task_category}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{subLabel}</span>
                      {t.external_id && (
                        <span className="text-[10px] font-mono text-muted-foreground/70">
                          WO #{t.external_id}
                        </span>
                      )}
                      <Badge variant="outline" className="ml-auto text-[10px]">{statusLabel(t.status)}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.units?.short_name ?? t.units?.unit_code ?? ""}{t.properties?.name ? ` · ${t.properties.name}` : ""}
                      {" · "}
                      {t.due_at
                        ? `Due ${safeDistance(t.due_at)}`
                        : t.scheduled_for
                          ? `Scheduled ${safeDistance(t.scheduled_for)}`
                          : t.started_at
                            ? `Started ${safeDistance(t.started_at)}`
                            : t.updated_at
                              ? `Updated ${safeDistance(t.updated_at)}`
                              : ""}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {eventHistory.length > 0 && (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <History className="h-3 w-3" />
            Event history ({eventHistory.length})
          </h4>
          <ul className="text-xs space-y-1 max-h-48 overflow-auto rounded-md border border-border bg-muted/20 p-2">
            {eventHistory.map((ev, i) => (
              <li key={`${ev.eventType}-${ev.eventAt}-${ev.createdAt}-${i}`} className="flex items-center justify-between gap-2">
                <span className="font-mono">{ev.eventType}</span>
                <span className="text-muted-foreground tabular-nums" title={safeFormat(ev.eventAt, "PPpp")}>
                  {safeDistance(ev.eventAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KV({ icon: Icon, label, value, tooltip }: { icon: React.ElementType; label: string; value: string; tooltip?: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-2.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="text-sm font-medium mt-0.5 truncate" title={tooltip ?? value}>{value}</p>
    </div>
  );
}

function describeActivity(a: { action: string; payload_json: Record<string, unknown>; description: string | null }): string {
  if (a.description) return a.description;
  if (a.action === "status_change") {
    const old_s = (a.payload_json?.old as { status?: string } | undefined)?.status;
    const new_s = (a.payload_json?.new as { status?: string } | undefined)?.status;
    if (old_s && new_s) return `Status: ${statusLabel(old_s)} → ${statusLabel(new_s)}`;
  }
  return a.action.replace(/_/g, " ");
}
