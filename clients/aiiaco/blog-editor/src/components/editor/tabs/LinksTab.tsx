"use client";

import { useState } from "react";
import { ExternalLink, Link as LinkIcon, Copy, Check, Replace, Globe, Home } from "lucide-react";
import { toast } from "sonner";
import { extractLinks, replaceLinkUrl, type BlogLink } from "@/lib/blog-parser";

interface LinksTabProps {
  htmlBody: string;
  clientDomain: string | null;
  onHTMLChange: (html: string) => void;
}

export function LinksTab({ htmlBody, clientDomain, onHTMLChange }: LinksTabProps) {
  const allLinks = extractLinks(htmlBody, clientDomain || undefined);
  const internalLinks = allLinks.filter(l => l.type === "internal");
  const externalLinks = allLinks.filter(l => l.type === "external");

  const [replaceUrls, setReplaceUrls] = useState<Record<number, string>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleReplace = (link: BlogLink) => {
    const newUrl = replaceUrls[link.position];
    if (!newUrl || (!newUrl.startsWith("http") && !newUrl.startsWith("/"))) {
      toast.error("Enter a valid URL");
      return;
    }
    const updated = replaceLinkUrl(htmlBody, link.url, newUrl);
    onHTMLChange(updated);
    setReplaceUrls(prev => ({ ...prev, [link.position]: "" }));
    toast.success("Link replaced");
  };

  const handleCopy = async (url: string, idx: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    toast.success("URL copied");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Internal Links */}
      <LinkSection
        title="Internal Links"
        icon={<Home className="w-3.5 h-3.5" />}
        count={internalLinks.length}
        color="blue"
        links={internalLinks}
        replaceUrls={replaceUrls}
        copiedIdx={copiedIdx}
        onReplace={handleReplace}
        onCopy={handleCopy}
        onReplaceUrlChange={(pos, val) => setReplaceUrls(prev => ({ ...prev, [pos]: val }))}
      />

      {/* External Links */}
      <LinkSection
        title="External Links"
        icon={<Globe className="w-3.5 h-3.5" />}
        count={externalLinks.length}
        color="amber"
        links={externalLinks}
        replaceUrls={replaceUrls}
        copiedIdx={copiedIdx}
        onReplace={handleReplace}
        onCopy={handleCopy}
        onReplaceUrlChange={(pos, val) => setReplaceUrls(prev => ({ ...prev, [pos]: val }))}
      />

      {allLinks.length === 0 && (
        <p className="text-white/25 text-sm text-center py-8">No links found in post body.</p>
      )}
    </div>
  );
}

function LinkSection({
  title,
  icon,
  count,
  color,
  links,
  replaceUrls,
  copiedIdx,
  onReplace,
  onCopy,
  onReplaceUrlChange,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  color: "blue" | "amber";
  links: BlogLink[];
  replaceUrls: Record<number, string>;
  copiedIdx: number | null;
  onReplace: (link: BlogLink) => void;
  onCopy: (url: string, idx: number) => void;
  onReplaceUrlChange: (position: number, value: string) => void;
}) {
  if (links.length === 0) return null;

  const colorMap = {
    blue: { badge: "bg-blue-400/10 text-blue-400 border-blue-400/20", dot: "bg-blue-400" },
    amber: { badge: "bg-amber-400/10 text-amber-400 border-amber-400/20", dot: "bg-amber-400" },
  };
  const c = colorMap[color];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border ${c.badge}`}>
          {icon}
          {title}
        </span>
        <span className="text-xs text-white/25">{count}</span>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.position}
            className="p-3.5 bg-white/[0.02] border border-white/5 rounded-lg space-y-2.5"
          >
            {/* Link info row */}
            <div className="flex items-start gap-3">
              <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${c.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 truncate">{link.anchorText}</p>
                <p className="text-xs text-white/30 font-mono truncate mt-0.5">{link.url}</p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => window.open(link.url, "_blank")}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/40 hover:text-white transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onCopy(link.url, link.position)}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/40 hover:text-white transition-colors"
                  title="Copy URL"
                >
                  {copiedIdx === link.position ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Replace URL */}
            <div className="flex gap-2 pl-4">
              <input
                value={replaceUrls[link.position] || ""}
                onChange={(e) => onReplaceUrlChange(link.position, e.target.value)}
                placeholder="Enter new URL to replace..."
                className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF5C5C]/50"
              />
              <button
                onClick={() => onReplace(link)}
                disabled={!replaceUrls[link.position]}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#FF5C5C]/20 border border-[#FF5C5C]/30 text-[#FF5C5C] rounded-md hover:bg-[#FF5C5C]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Replace className="w-3 h-3" />
                Replace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
