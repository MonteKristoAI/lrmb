import Link from "next/link";
import { ArrowRight, Globe, FileCode, Wrench } from "lucide-react";
import type { Client } from "@/lib/supabase/types";

interface ClientCardProps {
  client: Client;
  postCount: number;
  draftCount: number;
  publishedCount: number;
  scheduledCount: number;
}

const platformConfig: Record<string, { icon: typeof Globe; label: string }> = {
  wordpress: { icon: Globe, label: "WordPress" },
  "cloudflare-pages": { icon: FileCode, label: "CF Pages" },
  manual: { icon: Wrench, label: "Manual" },
};

export function ClientCard({
  client,
  postCount,
  draftCount,
  publishedCount,
  scheduledCount,
}: ClientCardProps) {
  const { icon: PlatformIcon, label: platformLabel } = platformConfig[client.platform] || platformConfig.manual;

  return (
    <Link
      href={`/dashboard/${client.slug}`}
      className="group block bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-[family-name:var(--font-poppins)] font-bold text-sm"
            style={{ backgroundColor: client.brand_accent + "20", color: client.brand_accent }}
          >
            {client.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-sm group-hover:text-white transition-colors">
              {client.name}
            </h3>
            <span className="text-xs text-white/30">{client.domain}</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <span className="block text-lg font-semibold">{postCount}</span>
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Posts</span>
        </div>
        <div className="h-8 w-px bg-white/5" />
        <div className="text-center">
          <span className="block text-lg font-semibold text-amber-400">{draftCount}</span>
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Drafts</span>
        </div>
        <div className="h-8 w-px bg-white/5" />
        <div className="text-center">
          <span className="block text-lg font-semibold text-emerald-400">{publishedCount}</span>
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Live</span>
        </div>
        {scheduledCount > 0 && (
          <>
            <div className="h-8 w-px bg-white/5" />
            <div className="text-center">
              <span className="block text-lg font-semibold text-violet-400">{scheduledCount}</span>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Sched</span>
            </div>
          </>
        )}
      </div>

      {/* Platform Badge */}
      <div className="flex items-center gap-1.5 text-xs text-white/25">
        <PlatformIcon className="w-3 h-3" />
        <span>{platformLabel}</span>
      </div>
    </Link>
  );
}
