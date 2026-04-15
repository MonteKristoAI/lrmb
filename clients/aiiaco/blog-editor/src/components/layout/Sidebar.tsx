"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Hexagon } from "lucide-react";
import type { Client } from "@/lib/supabase/types";

interface SidebarProps {
  clients: Pick<Client, "name" | "slug" | "brand_accent" | "platform">[];
}

const platformLabel: Record<string, string> = {
  wordpress: "WP",
  "cloudflare-pages": "CF",
  manual: "Manual",
};

export function Sidebar({ clients }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#0d1117] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Hexagon className="w-7 h-7 text-[#FF5C5C]" strokeWidth={2.5} />
          <div>
            <span className="font-[family-name:var(--font-poppins)] font-semibold text-sm tracking-wide">
              MK Blog Editor
            </span>
            <span className="block text-[10px] text-white/30 tracking-widest uppercase">
              MonteKristo AI
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
            pathname === "/dashboard"
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white hover:bg-white/5"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>

        <div className="pt-4 pb-2 px-3">
          <span className="text-[10px] font-medium tracking-widest uppercase text-white/25">
            Clients
          </span>
        </div>

        {clients.map((client) => {
          const isActive = pathname.startsWith(`/dashboard/${client.slug}`);
          return (
            <Link
              key={client.slug}
              href={`/dashboard/${client.slug}`}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: client.brand_accent }}
                />
                <span className="truncate max-w-[140px]">{client.name}</span>
              </div>
              <span className="text-[10px] text-white/25 font-mono">
                {platformLabel[client.platform]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
