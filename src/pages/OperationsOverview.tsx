import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, Home, RefreshCw, Wrench, Eye, Sparkles, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

type Health =
  | { collection_name: string; health: "healthy" | "degraded" | "failing" | "stale" | "never_ran"; last_run_at: string | null; seconds_since_last_run: number | null }
  | { collection_name: string; health: string; last_run_at: string | null; seconds_since_last_run: number | null };

interface ReservationCard {
  externalId: string;
  unitId: number | null;
  arrivalDate: string | null;
  departureDate: string | null;
  status: string | null;
  occupants: number | null;
  nights: number | null;
}

interface TaskCard {
  id: string;
  title: string;
  status: string;
  unitId: string | null;
  externalId: string | null;
  dueAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

interface OverviewPayload {
  viewer: string | null;
  generatedAt: string;
  windowUTC: { start: string; end: string };
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

export default function OperationsOverview() {
  const [params] = useSearchParams();
  const token = params.get("t") ?? "";

  const { data, error, isLoading, dataUpdatedAt, refetch, isFetching } = useQuery({
    queryKey: ["track-overview", token],
    queryFn: () => fetchOverview(token),
    enabled: token.length > 0,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
    retry: (failureCount, err) => {
      const code = (err as { code?: string } | null)?.code;
      // Don't retry on auth/format failures - they won't resolve.
      if (code && ["expired", "bad_signature", "bad_format", "missing_token", "unsupported_version"].includes(code)) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Manual refresh button state for visual feedback
  const [justRefreshed, setJustRefreshed] = useState(false);
  useEffect(() => {
    if (!isFetching && justRefreshed) {
      const t = setTimeout(() => setJustRefreshed(false), 1200);
      return () => clearTimeout(t);
    }
  }, [isFetching, justRefreshed]);

  if (!token) return <ErrorState title="Missing share link token" detail="Open this page via the shareable URL with a token in the query string." />;
  if (isLoading) return <LoadingState />;
  if (error) {
    const code = (error as { code?: string }).code ?? "";
    if (code === "expired") return <ErrorState title="Share link has expired" detail="Ask your contact at LRMB to issue a new link." />;
    if (code === "bad_signature" || code === "bad_format") return <ErrorState title="Invalid share link" detail="The token in this URL has been tampered with or is malformed." />;
    return <ErrorState title="Could not load operations data" detail={String(error.message ?? error)} />;
  }
  if (!data) return <ErrorState title="No data" detail="The overview returned empty." />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">LRMB Operations Overview</h1>
            <p className="text-sm text-muted-foreground">
              Live view of TRACK reservations and AiiA work orders. Read-only.
              {data.viewer ? ` Shared with ${data.viewer}.` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {dataUpdatedAt ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true }) : "—"}</span>
            <button
              type="button"
              onClick={() => { setJustRefreshed(true); refetch(); }}
              disabled={isFetching}
              className={cn(
                "ml-2 inline-flex items-center gap-1 rounded border px-2 py-1 hover:bg-muted/50 transition",
                isFetching && "opacity-50 cursor-wait",
              )}
              aria-label="Refresh now"
            >
              <RefreshCw className={cn("h-3 w-3", (isFetching || justRefreshed) && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        <PollHealthBanner health={data.pollHealth} />

        <section aria-labelledby="reservations-heading" className="space-y-4">
          <SectionHeading id="reservations-heading" icon={Home} title="Reservation pipeline (today)" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReservationStat icon={ArrowDownToLine} label="Arrivals today" value={data.reservations.arrivalsToday.length} cards={data.reservations.arrivalsToday} />
            <ReservationStat icon={Eye} label="In house now" value={data.reservations.inHouse.length} cards={data.reservations.inHouse} />
            <ReservationStat icon={ArrowUpFromLine} label="Checkouts today" value={data.reservations.checkoutsToday.length} cards={data.reservations.checkoutsToday} />
            <ReservationStat icon={Clock} label="Upcoming next 7d" value={data.reservations.upcoming7d.length} cards={data.reservations.upcoming7d.slice(0, 10)} />
          </div>
        </section>

        <section aria-labelledby="housekeeping-heading" className="space-y-4">
          <SectionHeading id="housekeeping-heading" icon={Sparkles} title="Housekeeping" />
          <div className="grid gap-4 lg:grid-cols-3">
            <TaskQueueCard title="Scheduled today" tasks={data.housekeeping.scheduledToday} emptyLabel="Nothing on today's queue" />
            <TaskQueueCard title="In progress" tasks={data.housekeeping.inProgress} emptyLabel="No cleaners on the clock" />
            <TaskQueueCard title="Pending verification" tasks={data.housekeeping.completedPendingVerify} emptyLabel="Caught up" tone="warning" />
          </div>
        </section>

        <section aria-labelledby="maintenance-heading" className="space-y-4">
          <SectionHeading id="maintenance-heading" icon={Wrench} title="Maintenance" />
          <div className="grid gap-4 lg:grid-cols-4">
            <TaskQueueCard title="Open" tasks={data.maintenance.open} emptyLabel="No open tickets" />
            <TaskQueueCard title="Overdue" tasks={data.maintenance.overdue} emptyLabel="Nothing past due" tone="danger" />
            <TaskQueueCard title="Blocked" tasks={data.maintenance.blocked} emptyLabel="Nothing blocked" tone="warning" />
            <TaskQueueCard title="Pending verification" tasks={data.maintenance.completedPendingVerify} emptyLabel="Caught up" tone="warning" />
          </div>
        </section>

        <footer className="text-xs text-muted-foreground border-t pt-4">
          Auto-refresh every 5 minutes. Generated {format(new Date(data.generatedAt), "PPpp")}.
          This page is read-only. To make changes, log into AiiA Admin.
        </footer>
      </main>
    </div>
  );
}

function SectionHeading({ id, icon: Icon, title }: { id: string; icon: React.ElementType; title: string }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-lg font-semibold">
      <Icon className="h-5 w-5 text-primary" />
      {title}
    </h2>
  );
}

function ReservationStat({
  icon: Icon,
  label,
  value,
  cards,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  cards: ReservationCard[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold mb-2">{value}</p>
        <ul className="space-y-1 text-xs text-muted-foreground max-h-32 overflow-auto" aria-label={`${label} details`}>
          {cards.length === 0 && <li className="italic">none</li>}
          {cards.slice(0, 8).map((c) => (
            <li key={c.externalId} className="flex items-center justify-between gap-2">
              <span className="truncate">
                #{c.externalId} {c.unitId !== null && c.unitId !== undefined ? `· unit ${c.unitId}` : ""}
              </span>
              <span className="tabular-nums">
                {c.arrivalDate ? format(new Date(c.arrivalDate), "MM/dd") : "—"}
                {" → "}
                {c.departureDate ? format(new Date(c.departureDate), "MM/dd") : "—"}
              </span>
            </li>
          ))}
          {cards.length > 8 && <li className="text-xs italic">+ {cards.length - 8} more</li>}
        </ul>
      </CardContent>
    </Card>
  );
}

function TaskQueueCard({
  title,
  tasks,
  emptyLabel,
  tone = "default",
}: {
  title: string;
  tasks: TaskCard[];
  emptyLabel: string;
  tone?: "default" | "warning" | "danger";
}) {
  const toneCls =
    tone === "danger" ? "border-destructive/40 bg-destructive/5" :
    tone === "warning" ? "border-amber-400/40 bg-amber-50 dark:bg-amber-950/20" :
    "";
  return (
    <Card className={cn(toneCls)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>{title}</span>
          <Badge variant={tone === "danger" ? "destructive" : "secondary"}>{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="space-y-2 text-sm max-h-72 overflow-auto" aria-label={title}>
            {tasks.slice(0, 25).map((t) => (
              <li key={t.id} className="flex flex-col rounded border bg-card p-2">
                <span className="font-medium truncate" title={t.title}>{t.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {t.externalId ? `TRACK #${t.externalId}` : "AiiA-only"} ·{" "}
                  {t.dueAt
                    ? `due ${formatDistanceToNow(new Date(t.dueAt), { addSuffix: true })}`
                    : t.startedAt
                      ? `started ${formatDistanceToNow(new Date(t.startedAt), { addSuffix: true })}`
                      : `updated ${formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}`}
                </span>
              </li>
            ))}
            {tasks.length > 25 && <li className="text-xs italic">+ {tasks.length - 25} more</li>}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function PollHealthBanner({ health }: { health: Health[] }) {
  const issues = useMemo(() => health.filter((h) => h.health !== "healthy"), [health]);
  if (issues.length === 0) return null;
  return (
    <div className="flex items-center gap-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <div>
        <strong>Polling status:</strong>{" "}
        {issues.map((h) => `${h.collection_name}=${h.health}`).join(", ")}
        {". Data on this page may be stale. Check track_poll_state."}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
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
