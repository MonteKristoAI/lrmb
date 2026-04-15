"use client";

import { useState } from "react";
import { Image as ImageIcon, Replace, Copy, Check, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { extractImages, replaceImageUrl } from "@/lib/blog-parser";

interface ImagesTabProps {
  htmlBody: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  platform: "wordpress" | "cloudflare-pages" | "manual";
  onHTMLChange: (html: string) => void;
  onFeaturedImageChange: (url: string) => void;
}

async function downloadImage(url: string, filename?: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename || url.split("/").pop()?.split("?")[0] || "image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    toast.success("Image downloading...");
  } catch {
    // Fallback: open in new tab
    window.open(url, "_blank");
    toast.info("Opened in new tab (direct download blocked by CORS)");
  }
}

export function ImagesTab({
  htmlBody,
  featuredImageUrl,
  featuredImageAlt,
  platform,
  onHTMLChange,
  onFeaturedImageChange,
}: ImagesTabProps) {
  const images = extractImages(htmlBody);
  const [replaceUrls, setReplaceUrls] = useState<Record<number, string>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const isWordPress = platform === "wordpress";

  const handleReplace = (position: number, oldUrl: string) => {
    const newUrl = replaceUrls[position];
    if (!newUrl || !newUrl.startsWith("http")) {
      toast.error("Enter a valid URL starting with http");
      return;
    }

    const updatedHTML = replaceImageUrl(htmlBody, oldUrl, newUrl);
    onHTMLChange(updatedHTML);

    if (oldUrl === featuredImageUrl) {
      onFeaturedImageChange(newUrl);
    }

    setReplaceUrls(prev => ({ ...prev, [position]: "" }));
    toast.success("Image replaced in HTML");
  };

  const handleCopy = async (url: string, idx: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    toast.success("Image URL copied");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Featured Image */}
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/60">Featured Image</h3>
          {isWordPress && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              WP: Upload separately in sidebar
            </span>
          )}
          {!isWordPress && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Placed after title in HTML
            </span>
          )}
        </div>

        {isWordPress && (
          <div className="flex items-start gap-2 mb-3 p-2.5 bg-amber-400/5 border border-amber-400/10 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-400/80">
              WordPress: Featured image is NOT in the HTML body. Download it below and upload it in the WordPress sidebar "Featured Image" panel.
            </p>
          </div>
        )}

        {featuredImageUrl ? (
          <div className="flex gap-4">
            <img
              src={featuredImageUrl}
              alt={featuredImageAlt || ""}
              className="w-32 h-20 rounded-md object-cover"
            />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  value={featuredImageUrl}
                  readOnly
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-white/[0.02] border border-white/5 rounded-md text-white/50 truncate"
                />
                <button
                  onClick={() => handleCopy(featuredImageUrl, -1)}
                  className="px-2 py-1.5 bg-white/5 border border-white/10 rounded-md text-white/40 hover:text-white transition-colors"
                  title="Copy URL"
                >
                  {copiedIdx === -1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => downloadImage(featuredImageUrl, `featured-${Date.now()}.jpg`)}
                  className="px-2 py-1.5 bg-white/5 border border-white/10 rounded-md text-white/40 hover:text-white transition-colors"
                  title="Download image"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-white/25">
                Alt: {featuredImageAlt || "(no alt text)"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white/25 text-sm">
            <ImageIcon className="w-4 h-4" />
            No featured image set
          </div>
        )}
      </div>

      {/* Body Images */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3">
          Body Images ({images.length})
        </h3>

        {images.length === 0 ? (
          <p className="text-white/25 text-sm">No images found in post body.</p>
        ) : (
          <div className="space-y-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="p-4 bg-white/[0.02] border border-white/5 rounded-lg space-y-3"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-24 h-16 rounded-md object-cover flex-shrink-0 bg-white/5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).className += " hidden";
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 truncate font-mono">{img.url}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">
                      Alt: {img.alt || "(empty)"}
                    </p>
                    {img.caption && (
                      <p className="text-[10px] text-white/20 mt-0.5">
                        Caption: {img.caption}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleCopy(img.url, idx)}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/40 hover:text-white transition-colors h-fit"
                      title="Copy URL"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => downloadImage(img.url)}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/40 hover:text-white transition-colors h-fit"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Replace URL */}
                <div className="flex gap-2">
                  <input
                    value={replaceUrls[img.position] || ""}
                    onChange={(e) => setReplaceUrls(prev => ({ ...prev, [img.position]: e.target.value }))}
                    placeholder="Enter new image URL to replace..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF5C5C]/50"
                  />
                  <button
                    onClick={() => handleReplace(img.position, img.url)}
                    disabled={!replaceUrls[img.position]}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#FF5C5C]/20 border border-[#FF5C5C]/30 text-[#FF5C5C] rounded-md hover:bg-[#FF5C5C]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Replace className="w-3 h-3" />
                    Replace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
