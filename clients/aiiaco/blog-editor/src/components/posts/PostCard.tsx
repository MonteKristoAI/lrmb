import Link from "next/link";
import { FileText, AlertTriangle, Clock, Globe, CheckCircle, XCircle } from "lucide-react";
import type { Post } from "@/lib/supabase/types";

interface PostCardProps {
  post: Post;
  clientSlug: string;
}

const statusConfig: Record<string, { icon: typeof FileText; label: string; color: string; bg: string }> = {
  draft: { icon: FileText, label: "Draft", color: "text-amber-400", bg: "bg-amber-400/10" },
  review: { icon: AlertTriangle, label: "Review", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  approved: { icon: CheckCircle, label: "Approved", color: "text-blue-400", bg: "bg-blue-400/10" },
  scheduled: { icon: Clock, label: "Scheduled", color: "text-violet-400", bg: "bg-violet-400/10" },
  published: { icon: Globe, label: "Published", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  failed: { icon: XCircle, label: "Failed", color: "text-red-400", bg: "bg-red-400/10" },
};

export function PostCard({ post, clientSlug }: PostCardProps) {
  const config = statusConfig[post.status] || statusConfig.draft;
  const StatusIcon = config.icon;

  const hasIssues = post.em_dash_count > 0 || (post.banned_words_found?.length || 0) > 0;

  return (
    <Link
      href={`/dashboard/${clientSlug}/${post.id}`}
      className="group flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:border-white/10 hover:bg-white/[0.04] transition-all"
    >
      {/* Thumbnail */}
      {post.featured_image_url ? (
        <img
          src={post.featured_image_url}
          alt=""
          className="w-16 h-16 rounded-md object-cover flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <div className="w-16 h-16 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-white/15" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate group-hover:text-white transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-white/30 mt-0.5 truncate">
          /{post.slug}/
        </p>

        <div className="flex items-center gap-3 mt-2">
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </span>

          {/* Word count */}
          <span className="text-[10px] text-white/20">
            {post.word_count?.toLocaleString()} words
          </span>

          {/* Quality score */}
          {post.quality_score != null && (
            <span className={`text-[10px] ${
              post.quality_score >= 90 ? "text-emerald-400" :
              post.quality_score >= 80 ? "text-amber-400" : "text-red-400"
            }`}>
              {post.quality_score}/100
            </span>
          )}

          {/* Issue indicator */}
          {hasIssues && (
            <span className="text-[10px] text-red-400 flex items-center gap-0.5">
              <AlertTriangle className="w-3 h-3" />
              {post.em_dash_count > 0 && `${post.em_dash_count} em-dash`}
              {post.em_dash_count > 0 && (post.banned_words_found?.length || 0) > 0 && ", "}
              {(post.banned_words_found?.length || 0) > 0 && `${post.banned_words_found.length} banned`}
            </span>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="text-right flex-shrink-0">
        <span className="text-[10px] text-white/20">
          {new Date(post.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </Link>
  );
}
