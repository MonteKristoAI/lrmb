import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import type { Task } from "@/types/task";
import { useI18n } from "@/lib/i18n";
import { MapPin, Play, Calendar, Zap } from "lucide-react";
import { isPast, isToday, isTomorrow } from "date-fns";
import { safeFormat } from "@/lib/utils";

interface NextUpHeroProps {
  task: Task & {
    properties?: { name: string } | null;
    units?: { unit_code: string; short_name?: string | null } | null;
    smart_queue_score?: number;
    smart_queue_reason?: string;
  };
}

// v3.0 Wave 3 (2026-07-01): full-width hero card at the top of MyTasks
// showing the top-ranked task with big Start button. First thing field
// staff see when they open the app.
export function NextUpHero({ task }: NextUpHeroProps) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const scheduledDate = task.scheduled_for ? new Date(task.scheduled_for) : null;
  const isScheduledPast = scheduledDate && isPast(scheduledDate) && !isToday(scheduledDate);
  const scheduledLabel = scheduledDate
    ? isToday(scheduledDate)
      ? t("Today")
      : isTomorrow(scheduledDate)
        ? t("Tomorrow")
        : safeFormat(task.scheduled_for, "MMM d")
    : null;

  const unitLabel = task.units?.short_name || task.units?.unit_code || null;
  const propertyLabel = task.properties?.name;

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-secondary/40 border-primary/30 bg-primary/5"
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {t("Next Up")}
          </p>
          {typeof task.smart_queue_score === "number" && (
            <span
              title={task.smart_queue_reason || ""}
              className="text-[10px] font-bold bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              {task.smart_queue_score}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-foreground leading-tight">
          {task.title}
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {(propertyLabel || unitLabel) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {propertyLabel}{unitLabel ? ` · ${unitLabel}` : ""}
            </span>
          )}
          {scheduledLabel && (
            <span className={`flex items-center gap-1.5 ${isScheduledPast ? "text-destructive font-medium" : ""}`}>
              <Calendar className="h-3.5 w-3.5" />
              {isScheduledPast ? `${t("Past due")} ` : ""}{scheduledLabel}
            </span>
          )}
        </div>

        {task.smart_queue_reason && (
          <p className="text-xs text-muted-foreground italic">
            {task.smart_queue_reason}
          </p>
        )}

        <Button
          size="lg"
          className="w-full gap-2"
          onClick={(e) => { e.stopPropagation(); navigate(`/tasks/${task.id}`); }}
        >
          <Play className="h-4 w-4" />
          {t("Open work order")}
        </Button>
      </CardContent>
    </Card>
  );
}
