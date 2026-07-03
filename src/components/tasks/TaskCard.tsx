import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import type { Task } from "@/types/task";
import { MapPin, Clock, ChevronRight, User, Bot, Calendar, Zap } from "lucide-react";
import { isPast, isToday, isTomorrow } from "date-fns";
import { safeDistance, safeFormat } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface TaskUnit { unit_code: string; short_name?: string | null; bedrooms?: number | null }
interface TaskProperty { name: string; region?: string | null; zone?: string | null }
interface TaskCardProps {
  task: Task & { properties?: TaskProperty | null; units?: TaskUnit | null };
  // v3.0 Wave 3: optional Smart Queue score badge with reason tooltip. Only
  // rendered by OpenTasksQueue / MyTasks when sort=smart is active. Prevents
  // cluttering the layout in every other list.
  scoreBadge?: { score: number; reason: string };
}

export function TaskCard({ task, scoreBadge }: TaskCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const isTerminalStatus = ["cancelled", "completed", "verified", "processed"].includes(task.status);
  const isOverdue = task.due_at && isPast(new Date(task.due_at)) && !isTerminalStatus;

  // Emma 2026-06-09 feedback: "we don't know what day things are scheduled
  // or if It is past due" — surface scheduled_for on the card. TRACK
  // populates this for HK WOs (Final Clean, Inspection, etc.) more often
  // than due_at, so for many cards this will be the only timing signal.
  const scheduledDate = task.scheduled_for ? new Date(task.scheduled_for) : null;
  const isScheduledPast = scheduledDate && isPast(scheduledDate) && !isToday(scheduledDate) && !isTerminalStatus;
  const scheduledLabel = scheduledDate
    ? isToday(scheduledDate)
      ? "Today"
      : isTomorrow(scheduledDate)
        ? "Tomorrow"
        : safeFormat(task.scheduled_for, "MMM d")
    : null;

  const unitLabel = task.units?.short_name || task.units?.unit_code || null;

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-secondary/50 tap-target ${isOverdue ? "border-destructive/50" : ""}`}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-foreground truncate flex-1 min-w-0">{task.title}</p>
            {scoreBadge && (
              <span
                title={scoreBadge.reason || t("Smart Queue score")}
                className="text-[10px] font-bold bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0"
              >
                <Zap className="h-2.5 w-2.5" />
                {scoreBadge.score}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.is_guest_facing && (
              <span className="text-[10px] bg-blue-500/20 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <User className="h-2.5 w-2.5" />Guest
              </span>
            )}
            {task.external_source === "aiia_generated" && (
              <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Auto-created by AiiA Final Clean orchestrator">
                <Bot className="h-2.5 w-2.5" />Auto
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {task.properties && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {task.properties.name}
                {unitLabel && ` - ${unitLabel}`}
              </span>
            )}
            {scheduledLabel && (
              <span className={`flex items-center gap-1 ${isScheduledPast ? "text-destructive font-medium" : ""}`}>
                <Calendar className="h-3 w-3" />
                {isScheduledPast ? "Past due " : ""}{scheduledLabel}
              </span>
            )}
            {task.due_at && (
              <span className={`flex items-center gap-1 ${isOverdue ? "text-destructive font-medium" : ""}`}>
                <Clock className="h-3 w-3" />
                {isOverdue ? "Overdue " : "Due "}
                {safeDistance(task.due_at)}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </CardContent>
    </Card>
  );
}
