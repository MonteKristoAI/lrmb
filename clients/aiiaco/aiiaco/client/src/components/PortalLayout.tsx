/**
 * PortalLayout - Client dashboard layout with sidebar navigation.
 * Mirrors the admin console's dark gold aesthetic but scoped to client features.
 */

import { useState, useEffect, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { clearClientToken } from "@/lib/clientToken";
import { useLocation } from "wouter";
import {
  Bot, MessageSquare, Settings, CreditCard, Code2, BarChart3,
  LogOut, Menu, X, ChevronRight, Mic
} from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/portal", icon: <BarChart3 size={18} /> },
  { label: "My Agent", path: "/portal/agent", icon: <Bot size={18} /> },
  { label: "Conversations", path: "/portal/conversations", icon: <MessageSquare size={18} /> },
  { label: "Embed & Integrate", path: "/portal/embed", icon: <Code2 size={18} /> },
  { label: "Billing", path: "/portal/billing", icon: <CreditCard size={18} /> },
  { label: "Settings", path: "/portal/settings", icon: <Settings size={18} /> },
];

export default function PortalLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meQuery = trpc.vaas.auth.me.useQuery(undefined, { retry: false });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (meQuery.isError) {
      setLocation("/portal/login");
    }
  }, [meQuery.isError, setLocation]);

  const handleLogout = () => {
    clearClientToken();
    window.location.href = "/portal/login";
  };

  if (meQuery.isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#03050A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Mic size={32} style={{ color: "#B89C4A", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.55)" }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (meQuery.isError) return null;

  const client = meQuery.data;

  return (
    <div style={{ minHeight: "100vh", background: "#03050A", display: "flex" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 40, display: "none",
          }}
          className="portal-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          minHeight: "100vh",
          background: "rgba(8,14,24,0.92)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: sidebarOpen ? 0 : undefined,
          zIndex: 50,
          transition: "transform 0.2s ease",
        }}
        className={`portal-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        {/* Logo */}
        <div style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(184,156,74,0.15)",
            border: "1px solid rgba(184,156,74,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Mic size={18} style={{ color: "#B89C4A" }} />
          </div>
          <div>
            <div style={{ fontFamily: FFD, fontSize: 15, fontWeight: 700, color: "#B89C4A", letterSpacing: "0.02em" }}>
              AiiACo
            </div>
            <div style={{ fontFamily: FF, fontSize: 11, color: "rgba(200,215,230,0.45)", marginTop: 1 }}>
              Voice Agent Portal
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "rgba(200,215,230,0.45)", cursor: "pointer",
              display: "none",
            }}
            className="portal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path || (item.path !== "/portal" && location.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => { setLocation(item.path); setSidebarOpen(false); }}
                style={{
                  fontFamily: FF,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#B89C4A" : "rgba(200,215,230,0.65)",
                  background: isActive ? "rgba(184,156,74,0.10)" : "transparent",
                  border: isActive ? "1px solid rgba(184,156,74,0.20)" : "1px solid transparent",
                  borderRadius: 8,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s ease",
                }}
              >
                {item.icon}
                {item.label}
                {isActive && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div style={{
          padding: "16px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            fontFamily: FF, fontSize: 13, fontWeight: 600,
            color: "rgba(255,255,255,0.80)",
            marginBottom: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {client?.companyName}
          </div>
          <div style={{
            fontFamily: FF, fontSize: 11,
            color: "rgba(200,215,230,0.45)",
            marginBottom: 12,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {client?.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: FF, fontSize: 11, fontWeight: 600,
              color: client?.status === "active" ? "rgba(80,220,150,1)" :
                     client?.status === "trial" ? "rgba(184,156,74,0.90)" :
                     "rgba(255,100,100,0.80)",
              background: client?.status === "active" ? "rgba(80,220,150,0.12)" :
                          client?.status === "trial" ? "rgba(184,156,74,0.12)" :
                          "rgba(255,100,100,0.08)",
              border: `1px solid ${client?.status === "active" ? "rgba(80,220,150,0.30)" :
                                    client?.status === "trial" ? "rgba(184,156,74,0.25)" :
                                    "rgba(255,100,100,0.18)"}`,
              borderRadius: 4,
              padding: "3px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {client?.status}
            </span>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "auto", background: "none", border: "none",
                color: "rgba(200,215,230,0.40)", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                fontFamily: FF, fontSize: 11,
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 260, minHeight: "100vh" }}>
        {/* Mobile header */}
        <div
          style={{
            display: "none",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            alignItems: "center",
            gap: 12,
          }}
          className="portal-mobile-header"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", color: "rgba(200,215,230,0.65)", cursor: "pointer" }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: FFD, fontSize: 15, fontWeight: 700, color: "#B89C4A" }}>AiiACo</span>
        </div>

        <div style={{ padding: "32px 32px 48px", maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .portal-sidebar { transform: translateX(-100%); position: fixed !important; }
          .portal-sidebar.open { transform: translateX(0) !important; }
          .portal-overlay { display: block !important; }
          .portal-close-btn { display: block !important; }
          .portal-mobile-header { display: flex !important; }
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
