import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { ClipboardList, LayoutDashboard, ShieldCheck, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem { label: string; icon: React.ElementType; path: string; }

export function MobileNav() {
  const { hasAdminAccess, hasRole } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const items: NavItem[] = [
    { label: t("Tasks"), icon: ClipboardList, path: "/tasks" },
  ];

  if (hasAdminAccess()) {
    items.push({ label: "Admin", icon: LayoutDashboard, path: "/admin" });
  }
  if (hasRole("supervisor") || hasRole("manager")) {
    items.push({ label: t("Supervisor"), icon: ShieldCheck, path: "/supervisor" });
  }
  items.push({ label: t("Completed"), icon: CheckSquare, path: "/tasks/completed" });

  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-card flex">
      {items.map((item) => {
        const isActive = item.path === "/tasks"
          ? location.pathname === "/tasks" || (location.pathname.startsWith("/tasks/") && !location.pathname.startsWith("/tasks/completed"))
          : location.pathname.startsWith(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2 tap-target transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
