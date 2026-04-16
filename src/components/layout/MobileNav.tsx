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
    <nav className="sticky bottom-0 z-30 flex" style={{ background: "rgba(8,14,26,0.97)", borderTop: "1px solid rgba(196,186,177,0.06)", backdropFilter: "blur(12px)" }}>
      {items.map((item) => {
        const isActive = item.path === "/tasks"
          ? location.pathname === "/tasks" || (location.pathname.startsWith("/tasks/") && !location.pathname.startsWith("/tasks/completed"))
          : location.pathname.startsWith(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 tap-target transition-colors relative"
            style={{ color: isActive ? "#C4BAB1" : "#4A4540" }}
          >
            {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: "#C4BAB1" }} />}
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
