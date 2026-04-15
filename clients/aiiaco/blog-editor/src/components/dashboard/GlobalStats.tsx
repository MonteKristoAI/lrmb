import { FileText, FilePen, Globe, Clock } from "lucide-react";

interface GlobalStatsProps {
  totalPosts: number;
  drafts: number;
  published: number;
  scheduled: number;
}

export function GlobalStats({ totalPosts, drafts, published, scheduled }: GlobalStatsProps) {
  const stats = [
    { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-white/80" },
    { label: "Drafts", value: drafts, icon: FilePen, color: "text-amber-400" },
    { label: "Published", value: published, icon: Globe, color: "text-emerald-400" },
    { label: "Scheduled", value: scheduled, icon: Clock, color: "text-violet-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/[0.03] border border-white/5 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-xs text-white/40">{stat.label}</span>
          </div>
          <span className={`text-2xl font-semibold font-[family-name:var(--font-poppins)] ${stat.color}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
