import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertCircle, CheckCircle2, Clock, RefreshCw, Wrench, Sparkles,
  ArrowDownToLine, ArrowUpFromLine, Camera, Activity, Building2,
  Image as ImageIcon, ShieldAlert, TrendingUp, TrendingDown, Minus,
  ListChecks, MapPin, Users, AlertTriangle,
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
  kpis: { hkCompleted: KpiPeriodCount; maintCompleted: KpiPeriodCount };
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

function deltaIcon(curr: number, prev: number) {
  if (prev === 0 && curr === 0) return { Icon: Minus, color: "text-muted-foreground", label: "no change" };
  if (prev === 0) return { Icon: TrendingUp, color: "text-emerald-600", label: "new" };
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (Math.abs(pct) < 5) return { Icon: Minus, color: "text-muted-foreground", label: `${pct}%` };
  if (pct > 0) return { Icon: TrendingUp, color: "text-emerald-600", label: `+${pct}%` };
  return { Icon: TrendingDown, color: "text-rose-600", label: `${pct}%` };
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
  if (priority === "high" || priority === "urgent") return { className: "bg-rose-100 text-rose-700 border-rose-200", label: "High" };
  if (priority === "low") return { className: "bg-slate-100 text-slate-600 border-slate-200", label: "Low" };
  return null;
}

// ============================================================
// Top-level component
// ============================================================
export default function OperationsOverview() {
  const [params] = useSearchParams();
  const token = params.get("t") ?? "";
  const [propertyFilter, setPropertyFilter] = useState<string>("ALL");

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

  // Apply property filter
  const filtered = useMemo(() => {
    if (!data) return null;
    const filterTask = (t: TaskCard) => propertyMatchesFilter(t, propertyFilter);
    const filterRes = (r: ReservationCard) => propertyMatchesFilter(r, propertyFilter);
    return {
      reservations: {
        arrivalsToday: data.reservations.arrivalsToday.filter(filterRes),
        inHouse: data.reservations.inHouse.filter(filterRes),
        checkoutsToday: data.reservations.checkoutsToday.filter(filterRes),
        upcoming7d: data.reservations.upcoming7d.filter(filterRes),
      },
      housekeeping: {
        scheduledToday: data.housekeeping.scheduledToday.filter(filterTask),
        inProgress: data.housekeeping.inProgress.filter(filterTask),
        completedPendingVerify: data.housekeeping.completedPendingVerify.filter(filterTask),
      },
      maintenance: {
        open: data.maintenance.open.filter(filterTask),
        overdue: data.maintenance.overdue.filter(filterTask),
        blocked: data.maintenance.blocked.filter(filterTask),
        completedPendingVerify: data.maintenance.completedPendingVerify.filter(filterTask),
      },
    };
  }, [data, propertyFilter]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0680A2] font-bold text-white">L</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">LRMB Operations</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live view {data.viewer ? `· ${data.viewer}` : ""} · {data.totals.activeUnits} units · {data.totals.activeProperties} properties
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <PropertyFilter
                propertyList={data.propertyList}
                value={propertyFilter}
                onChange={setPropertyFilter}
              />
              <span className="hidden items-center gap-1.5 sm:flex">
                <Clock className="h-3.5 w-3.5" />
                <span>{dataUpdatedAt ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true }) : "—"}</span>
              </span>
              <button
                type="button"
                onClick={() => { setJustRefreshed(true); refetch(); }}
                disabled={isFetching}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 transition",
                  isFetching && "opacity-50 cursor-wait",
                )}
                aria-label="Refresh now"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", (isFetching || justRefreshed) && "animate-spin")} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <PollHealthBanner health={data.pollHealth} />

        {/* KPI STRIP */}
        <section aria-label="Key metrics">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <KpiTile
              icon={Sparkles}
              accent="#0680A2"
              label="Cleans completed (7d)"
              value={data.kpis.hkCompleted.thisWeek}
              delta={deltaIcon(data.kpis.hkCompleted.thisWeek, data.kpis.hkCompleted.lastWeek)}
              context={`vs ${data.kpis.hkCompleted.lastWeek} last week`}
            />
            <KpiTile
              icon={Wrench}
              accent="#1D1F28"
              label="Maintenance completed (7d)"
              value={data.kpis.maintCompleted.thisWeek}
              delta={deltaIcon(data.kpis.maintCompleted.thisWeek, data.kpis.maintCompleted.lastWeek)}
              context={`vs ${data.kpis.maintCompleted.lastWeek} last week`}
            />
            <KpiTile
              icon={Activity}
              accent="#FF5C5C"
              label="In progress now"
              value={filtered.housekeeping.inProgress.length + filtered.maintenance.open.filter((t) => t.status === "in_progress").length}
              context={`${filtered.housekeeping.inProgress.length} hk · ${filtered.maintenance.open.filter((t) => t.status === "in_progress").length} maint`}
            />
            <KpiTile
              icon={AlertTriangle}
              accent={filtered.maintenance.overdue.length > 0 ? "#cc0000" : "#999"}
              label="Overdue maintenance"
              value={filtered.maintenance.overdue.length}
              context={filtered.maintenance.overdue.length === 0 ? "all on track" : "needs attention"}
              alert={filtered.maintenance.overdue.length > 0}
            />
          </div>
        </section>

        {/* TABS */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="flex w-full justify-start overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
            <TabsTrigger value="today" className="data-[state=active]:bg-[#0680A2] data-[state=active]:text-white">
              <ListChecks className="h-3.5 w-3.5 mr-1.5" />Today
            </TabsTrigger>
            <TabsTrigger value="housekeeping" className="data-[state=active]:bg-[#0680A2] data-[state=active]:text-white">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />Cleaning ({filtered.housekeeping.scheduledToday.length + filtered.housekeeping.inProgress.length + filtered.housekeeping.completedPendingVerify.length})
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-[#0680A2] data-[state=active]:text-white">
              <Wrench className="h-3.5 w-3.5 mr-1.5" />Maintenance ({filtered.maintenance.open.length + filtered.maintenance.blocked.length})
            </TabsTrigger>
            {data.recentPhotos && data.recentPhotos.length > 0 && (
              <TabsTrigger value="photos" className="data-[state=active]:bg-[#0680A2] data-[state=active]:text-white">
                <ImageIcon className="h-3.5 w-3.5 mr-1.5" />Photos ({data.recentPhotos.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#0680A2] data-[state=active]:text-white">
              <Activity className="h-3.5 w-3.5 mr-1.5" />Activity ({data.recentActivity?.length ?? 0})
            </TabsTrigger>
            {data.damageClaims && data.damageClaims.total > 0 && (
              <TabsTrigger value="claims" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
                <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />Claims ({data.damageClaims.total})
              </TabsTrigger>
            )}
          </TabsList>

          {/* TODAY */}
          <TabsContent value="today" className="space-y-6">
            <section>
              <SectionHeading title="Reservation pipeline" subtitle={`${filtered.reservations.arrivalsToday.length} arriving · ${filtered.reservations.inHouse.length} in house · ${filtered.reservations.checkoutsToday.length} checking out`} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 mt-3">
                <ReservationPanel icon={ArrowDownToLine} accent="#0680A2" label="Arrivals today" cards={filtered.reservations.arrivalsToday} />
                <ReservationPanel icon={Users} accent="#0680A2" label="In house now" cards={filtered.reservations.inHouse} />
                <ReservationPanel icon={ArrowUpFromLine} accent="#FF5C5C" label="Checkouts today" cards={filtered.reservations.checkoutsToday} />
                <ReservationPanel icon={Clock} accent="#1D1F28" label="Upcoming 7 days" cards={filtered.reservations.upcoming7d} />
              </div>
            </section>

            <section>
              <SectionHeading title="Today's queue" subtitle="Cleans and maintenance scheduled or in progress today" />
              <div className="grid gap-3 lg:grid-cols-2 mt-3">
                <TaskPanel
                  title="Cleans in motion"
                  icon={Sparkles}
                  accent="#0680A2"
                  tasks={[...filtered.housekeeping.scheduledToday, ...filtered.housekeeping.inProgress]}
                  emptyLabel="No cleans scheduled for today"
                />
                <TaskPanel
                  title="Active maintenance"
                  icon={Wrench}
                  accent="#1D1F28"
                  tasks={filtered.maintenance.open.filter((t) => t.status === "in_progress" || t.status === "assigned")}
                  emptyLabel="No maintenance in flight"
                />
              </div>
            </section>
          </TabsContent>

          {/* HOUSEKEEPING */}
          <TabsContent value="housekeeping" className="space-y-6">
            <SectionHeading title="Housekeeping" subtitle="Cleans across the portfolio" />
            <div className="grid gap-3 lg:grid-cols-3">
              <TaskPanel title="Scheduled today" icon={Clock} accent="#0680A2" tasks={filtered.housekeeping.scheduledToday} emptyLabel="Nothing scheduled today" />
              <TaskPanel title="In progress" icon={Activity} accent="#0680A2" tasks={filtered.housekeeping.inProgress} emptyLabel="No cleaners on the clock" />
              <TaskPanel title="Pending verification" icon={CheckCircle2} accent="#FF5C5C" tasks={filtered.housekeeping.completedPendingVerify} emptyLabel="Caught up" tone="warning" />
            </div>
          </TabsContent>

          {/* MAINTENANCE */}
          <TabsContent value="maintenance" className="space-y-6">
            <SectionHeading title="Maintenance" subtitle="Work orders across the portfolio" />
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
              <TaskPanel title="Open" icon={ListChecks} accent="#1D1F28" tasks={filtered.maintenance.open} emptyLabel="No open tickets" />
              <TaskPanel title="Overdue" icon={AlertTriangle} accent="#cc0000" tasks={filtered.maintenance.overdue} emptyLabel="Nothing past due" tone="danger" />
              <TaskPanel title="Blocked" icon={AlertCircle} accent="#FF5C5C" tasks={filtered.maintenance.blocked} emptyLabel="Nothing blocked" tone="warning" />
              <TaskPanel title="Pending verification" icon={CheckCircle2} accent="#FF5C5C" tasks={filtered.maintenance.completedPendingVerify} emptyLabel="Caught up" tone="warning" />
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
              ? <ActivityFeed activity={data.recentActivity} />
              : <EmptyState message="No activity in the last 24 hours yet." />}
          </TabsContent>

          {/* CLAIMS */}
          {data.damageClaims && data.damageClaims.total > 0 && (
            <TabsContent value="claims" className="space-y-3">
              <SectionHeading title="Active damage claims" subtitle="Guest-damage tasks with deadline tracking" />
              <DamageClaimsTable claims={data.damageClaims} />
            </TabsContent>
          )}
        </Tabs>

        <footer className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Auto-refresh every 5 minutes · Generated {format(new Date(data.generatedAt), "PPpp")} · Read-only view
        </footer>
      </main>
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
      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0680A2]/30 dark:border-slate-700 dark:bg-slate-900"
      aria-label="Filter by property"
    >
      <option value="ALL">All properties ({propertyList.length})</option>
      {propertyList.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
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
    <Card className={cn("border", alert && "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30")}>
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
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</p>
        {context && <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">{context}</p>}
      </CardContent>
    </Card>
  );
}

function ReservationPanel({ icon: Icon, accent, label, cards }: {
  icon: React.ElementType;
  accent: string;
  label: string;
  cards: ReservationCard[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
            {label}
          </span>
          <Badge variant="secondary" className="rounded-full">{cards.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cards.length === 0 ? (
          <p className="text-xs italic text-slate-400">none</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-auto" aria-label={label}>
            {cards.slice(0, 12).map((c) => (
              <li key={c.externalId} className="flex flex-col gap-0.5 rounded-md border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span className="text-xs font-medium truncate">{locationLabel(c)}</span>
                  {c.status && <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4">{c.status}</Badge>}
                </div>
                <div className="text-[11px] text-slate-500 tabular-nums">
                  {c.arrivalDate ? format(new Date(c.arrivalDate), "MMM d") : "—"}
                  {" → "}
                  {c.departureDate ? format(new Date(c.departureDate), "MMM d") : "—"}
                  {c.nights ? ` · ${c.nights}n` : ""}
                  {" · "}{occupantsLabel(c.occupants)}
                </div>
              </li>
            ))}
            {cards.length > 12 && <li className="text-[11px] italic text-slate-400">+ {cards.length - 12} more</li>}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function TaskPanel({ title, icon: Icon, accent, tasks, emptyLabel, tone = "default" }: {
  title: string;
  icon: React.ElementType;
  accent: string;
  tasks: TaskCard[];
  emptyLabel: string;
  tone?: "default" | "warning" | "danger";
}) {
  const toneCls =
    tone === "danger" ? "border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20" :
    tone === "warning" ? "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20" :
    "";
  return (
    <Card className={cn(toneCls)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
            {title}
          </span>
          <Badge variant={tone === "danger" ? "destructive" : "secondary"} className="rounded-full">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-xs italic text-slate-400">{emptyLabel}</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-auto" aria-label={title}>
            {tasks.slice(0, 30).map((t) => {
              const pri = priorityBadge(t.priority);
              return (
                <li key={t.id} className="flex flex-col gap-0.5 rounded-md border border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="text-xs font-medium truncate" title={locationLabel(t)}>{locationLabel(t)}</span>
                    {pri && <Badge variant="outline" className={cn("ml-auto text-[10px] py-0 h-4", pri.className)}>{pri.label}</Badge>}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate" title={t.title}>{t.title}</div>
                  <div className="text-[11px] text-slate-400 tabular-nums">
                    {t.dueAt ? `Due ${formatDistanceToNow(new Date(t.dueAt), { addSuffix: true })}`
                      : t.startedAt ? `Started ${formatDistanceToNow(new Date(t.startedAt), { addSuffix: true })}`
                      : `Updated ${formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}`}
                    {t.blockedReason ? ` · blocked: ${t.blockedReason}` : ""}
                  </div>
                </li>
              );
            })}
            {tasks.length > 30 && <li className="text-[11px] italic text-slate-400">+ {tasks.length - 30} more</li>}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function PhotoGallery({ photos }: { photos: PhotoRow[] }) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {photos.map((p) => (
        <a
          key={p.photo_id}
          href={p.signed_url ?? "#"}
          target="_blank"
          rel="noreferrer noopener"
          className="group relative overflow-hidden rounded-md border border-slate-200 bg-white hover:ring-2 hover:ring-[#0680A2]/40 transition aspect-square dark:border-slate-800 dark:bg-slate-900"
          title={`${p.task_title ?? ""} — ${p.task_status} — ${p.uploaded_by_name ?? "unknown"}`}
        >
          {p.signed_url ? (
            <img src={p.signed_url} alt={p.caption ?? p.task_title ?? "Photo proof"} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400 dark:bg-slate-800">No preview</div>
          )}
          <span className="absolute bottom-0 inset-x-0 truncate bg-gradient-to-t from-black/85 to-transparent px-2 py-1 text-[10px] text-white">
            {p.task_title ?? "Photo"} · {formatDistanceToNow(new Date(p.uploaded_at), { addSuffix: true })}
          </span>
        </a>
      ))}
    </div>
  );
}

function ActivityFeed({ activity }: { activity: ActivityRow[] }) {
  // Group by hour for scannability
  const grouped = useMemo(() => {
    const groups: { hourLabel: string; items: ActivityRow[] }[] = [];
    let currentHour: string | null = null;
    for (const a of activity) {
      const date = new Date(a.created_at);
      const hourKey = format(date, "MMM d, h a");
      if (hourKey !== currentHour) {
        currentHour = hourKey;
        groups.push({ hourLabel: hourKey, items: [] });
      }
      groups[groups.length - 1].items.push(a);
    }
    return groups;
  }, [activity]);

  return (
    <Card>
      <CardContent className="p-0">
        {grouped.map((g, gi) => (
          <div key={`${g.hourLabel}-${gi}`}>
            <div className="sticky top-0 bg-slate-100/95 dark:bg-slate-800/95 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              {g.hourLabel}
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800" aria-label="Activity events">
              {g.items.map((a) => {
                const icon = a.new_status === "completed" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  : a.new_status === "blocked" ? <AlertCircle className="h-4 w-4 text-rose-600" />
                  : a.new_status === "verified" ? <CheckCircle2 className="h-4 w-4 text-[#0680A2]" />
                  : a.new_status === "in_progress" ? <Activity className="h-4 w-4 text-[#0680A2]" />
                  : <Activity className="h-4 w-4 text-slate-400" />;
                const verb = a.update_type === "status_change" && a.old_status && a.new_status
                  ? `moved to ${a.new_status.replace(/_/g, " ")}`
                  : a.update_type === "priority_change" ? "priority updated"
                  : a.update_type === "create" ? "created"
                  : a.update_type.replace(/_/g, " ");
                return (
                  <li key={a.id} className="flex items-start gap-3 p-3 text-sm">
                    <span className="mt-0.5 shrink-0">{icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{a.task_title ?? `Task (no title)`}</p>
                      <p className="text-xs text-slate-500">
                        {a.actor_name && a.actor_name !== "System" ? a.actor_name : "System"} · {verb}
                        {a.photo_count > 0 ? ` · ${a.photo_count} 📷` : ""}
                      </p>
                      {a.note && <p className="mt-1 text-xs italic text-slate-500 line-clamp-2">"{a.note}"</p>}
                    </div>
                    <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                      {format(new Date(a.created_at), "h:mm a")}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PollHealthBanner({ health }: { health: Health[] }) {
  const issues = useMemo(() => health.filter((h) => h.health !== "healthy"), [health]);
  if (issues.length === 0) return null;
  return (
    <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm dark:border-amber-700 dark:bg-amber-950/40">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
      <div className="flex-1">
        <p className="font-medium text-amber-900 dark:text-amber-100">Data sync notice</p>
        <p className="text-xs text-amber-800 dark:text-amber-200">
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
          {claims.urgent > 0 && <Badge className="bg-amber-500 text-amber-50 text-xs">{claims.urgent} urgent</Badge>}
          {claims.approaching > 0 && <Badge variant="secondary" className="text-xs">{claims.approaching} approaching</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="text-left py-2 pr-3 font-medium">Deadline</th>
                <th className="text-left py-2 pr-3 font-medium">Property / Unit</th>
                <th className="text-left py-2 pr-3 font-medium">Task</th>
                <th className="text-left py-2 pr-3 font-medium">Status</th>
                <th className="text-right py-2 pr-3 font-medium">Filed amount</th>
              </tr>
            </thead>
            <tbody>
              {claims.items.slice(0, 20).map((c) => (
                <tr key={c.task_id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 pr-3">
                    {c.deadline_status === "overdue" && <Badge variant="destructive" className="text-[10px]">Overdue</Badge>}
                    {c.deadline_status === "urgent" && <Badge className="bg-amber-500 text-amber-50 text-[10px]">Urgent</Badge>}
                    {c.deadline_status === "approaching" && <Badge variant="secondary" className="text-[10px]">Approaching</Badge>}
                    {c.deadline_status === "fine" && <span className="text-slate-400">—</span>}
                    {c.hours_to_deadline != null && (
                      <span className="ml-2 text-slate-500 tabular-nums">
                        {Math.abs(c.hours_to_deadline) < 48 ? `${Math.round(c.hours_to_deadline)}h` : `${Math.round(c.hours_to_deadline / 24)}d`}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <div className="font-medium">{c.property ?? "—"}</div>
                    {c.unit_code && <div className="text-slate-500 text-[11px]">{c.unit_code}</div>}
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

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-8 text-center text-sm text-slate-500">
        {message}
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">{detail}</p>
        </CardContent>
      </Card>
    </div>
  );
}
