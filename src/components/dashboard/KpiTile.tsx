import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

// v3.0 Wave 1 (2026-07-01): shared KPI tile used by SupervisorTodayBrief.
// Wave 2 will reuse this on ExecutiveCommandCenter. Extracted so we do not
// keep two divergent StatCard copies in AdminDashboard + SupervisorDashboard.
interface KpiTileProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color?: string;
  subtitle?: string;
  chips?: ReactNode;
  onClick?: () => void;
}

export function KpiTile({ label, value, icon: Icon, color = "text-primary", subtitle, chips, onClick }: KpiTileProps) {
  // L10 fix: when interactive, expose as button role with keyboard handler so
  // keyboard-only users can activate the tile and screen readers announce it.
  const interactiveProps = onClick
    ? {
        role: "button" as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        },
        "aria-label": typeof value === "string" || typeof value === "number" ? `${label}: ${value}` : label,
      }
    : {};
  return (
    <Card
      className={onClick ? "cursor-pointer transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring tap-target" : ""}
      onClick={onClick}
      {...interactiveProps}
    >
      {/* p-3 on very narrow viewports (<640) so KPI values + labels have room
          to breathe. Icon shrinks to h-4 to reclaim more px for text. */}
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight break-words">{value}</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-snug">{label}</p>
            {subtitle && (
              // v3.0 polish (2026-07-04): line-clamp-2 + title tooltip on subtitle
              // so vendor lists like "Service Cleaning Pro (75), Lux Handyman (68),
              // ROD Cleaning Solution Inc (59)" wrap at most 2 lines on narrow tiles
              // instead of stretching the card 5 lines tall on tablet portrait.
              // Full text still reachable via hover tooltip.
              <p
                className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug"
                title={subtitle}
              >
                {subtitle}
              </p>
            )}
          </div>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${color}`} />
        </div>
        {chips && <div className="flex flex-wrap gap-1 mt-2">{chips}</div>}
      </CardContent>
    </Card>
  );
}
