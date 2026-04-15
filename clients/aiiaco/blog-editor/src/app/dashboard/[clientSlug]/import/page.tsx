"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, FileText, ArrowRight, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { parseBlogHTML, type ParsedBlogPost } from "@/lib/blog-parser";
import { toast } from "sonner";

export default function ImportPage() {
  const params = useParams();
  const clientSlug = params.clientSlug as string;
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rawHTML, setRawHTML] = useState("");
  const [parsed, setParsed] = useState<ParsedBlogPost | null>(null);
  const [importing, setImporting] = useState(false);

  // Step 1: Parse
  const handleParse = () => {
    if (!rawHTML.trim()) {
      toast.error("Paste your blog HTML first");
      return;
    }
    try {
      const result = parseBlogHTML(rawHTML);
      setParsed(result);
      setStep(2);
    } catch (err: any) {
      toast.error("Failed to parse HTML: " + err.message);
    }
  };

  // Step 2: File drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".html")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRawHTML(ev.target?.result as string);
        toast.success(`Loaded ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // Step 3: Import
  const handleImport = async () => {
    if (!parsed) return;
    setImporting(true);

    try {
      // Get client ID
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("slug", clientSlug)
        .single();

      if (!client) throw new Error("Client not found");

      const { data: post, error } = await supabase
        .from("posts")
        .insert({
          client_id: client.id,
          title: parsed.seo.seoTitle || "Untitled",
          slug: parsed.seo.urlSlug || "untitled-" + Date.now(),
          seo_title: parsed.seo.seoTitle,
          meta_description: parsed.seo.metaDescription,
          focus_keyphrase: parsed.seo.focusKeyphrase,
          canonical_url: parsed.seo.canonical,
          url_slug: parsed.seo.urlSlug,
          category: parsed.seo.category,
          tags: parsed.seo.tags,
          og_title: parsed.seo.ogTitle,
          og_description: parsed.seo.ogDescription,
          og_image: parsed.seo.ogImage,
          og_type: parsed.seo.ogType,
          twitter_card: parsed.seo.twitterCard,
          featured_image_url: parsed.seo.featuredImageUrl,
          featured_image_alt: parsed.seo.featuredImageAlt,
          html_body: parsed.htmlBody,
          json_ld: parsed.jsonLd,
          full_source: parsed.fullSource,
          status: "draft",
        })
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Post imported as draft");
      router.push(`/dashboard/${clientSlug}/${post.id}`);
    } catch (err: any) {
      toast.error(err.message || "Import failed");
      setImporting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/dashboard/${clientSlug}`} className="text-white/30 hover:text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-poppins)] text-xl font-semibold">Import Blog Post</h1>
          <p className="text-white/40 text-sm">Paste HTML or drop a .html file</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
              step >= s ? "bg-[#FF5C5C] text-white" : "bg-white/5 text-white/30"
            }`}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            <span className={`text-xs ${step >= s ? "text-white/60" : "text-white/20"}`}>
              {s === 1 ? "Paste HTML" : s === 2 ? "Review" : "Import"}
            </span>
            {s < 3 && <ArrowRight className="w-3 h-3 text-white/15 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Paste/Upload */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors"
          >
            <Upload className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">Drop .html file here</p>
            <p className="text-xs text-white/20 mt-1">or paste HTML below</p>
          </div>

          <textarea
            value={rawHTML}
            onChange={(e) => setRawHTML(e.target.value)}
            placeholder="Paste your blog HTML here..."
            rows={16}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-sm font-mono text-white/70 placeholder:text-white/15 focus:outline-none focus:border-[#FF5C5C]/50 resize-none"
          />

          <button
            onClick={handleParse}
            disabled={!rawHTML.trim()}
            className="px-6 py-2.5 bg-[#FF5C5C] hover:bg-[#ff4444] disabled:opacity-30 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            Parse & Review
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Review parsed fields */}
      {step === 2 && parsed && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReviewField label="SEO Title" value={parsed.seo.seoTitle} valid={parsed.seo.seoTitle.length >= 40 && parsed.seo.seoTitle.length <= 60} />
            <ReviewField label="Focus Keyphrase" value={parsed.seo.focusKeyphrase} valid={!!parsed.seo.focusKeyphrase} />
            <ReviewField label="Meta Description" value={parsed.seo.metaDescription} valid={parsed.seo.metaDescription.length >= 140} />
            <ReviewField label="Slug" value={parsed.seo.urlSlug} valid={!!parsed.seo.urlSlug} />
            <ReviewField label="Category" value={parsed.seo.category} valid={!!parsed.seo.category} />
            <ReviewField label="Tags" value={parsed.seo.tags.join(", ")} valid={parsed.seo.tags.length > 0} />
            <ReviewField label="Featured Image" value={parsed.seo.featuredImageUrl ? "Set" : "Missing"} valid={!!parsed.seo.featuredImageUrl} />
            <ReviewField label="JSON-LD" value={parsed.jsonLd ? `${parsed.jsonLd.length} chars` : "Missing"} valid={!!parsed.jsonLd} />
          </div>

          {/* Metrics */}
          <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Content Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <MetricBox label="Words" value={parsed.metrics.wordCount} ok={parsed.metrics.wordCount >= 2000} />
              <MetricBox label="Em Dashes" value={parsed.metrics.emDashCount} ok={parsed.metrics.emDashCount === 0} />
              <MetricBox label="Ext. Links" value={parsed.metrics.externalLinkCount} ok={parsed.metrics.externalLinkCount >= 3} />
              <MetricBox label="Images" value={parsed.metrics.imageCount} ok={parsed.metrics.imageCount >= 2} />
              <MetricBox label="H2 Sections" value={parsed.metrics.h2Count} ok={parsed.metrics.h2Count >= 4} />
              <MetricBox label="FAQ Q&A" value={parsed.metrics.faqCount} ok={parsed.metrics.faqCount >= 3} />
              <MetricBox label="SVG Charts" value={parsed.metrics.svgCount} ok={true} />
              <MetricBox
                label="Banned Words"
                value={parsed.metrics.bannedWordsFound.length}
                ok={parsed.metrics.bannedWordsFound.length === 0}
              />
            </div>
            {parsed.metrics.bannedWordsFound.length > 0 && (
              <p className="text-xs text-red-400 mt-2">
                Found: {parsed.metrics.bannedWordsFound.join(", ")}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => { setStep(3); handleImport(); }}
              className="px-6 py-2.5 bg-[#FF5C5C] hover:bg-[#ff4444] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              Import as Draft
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Importing */}
      {step === 3 && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-[#FF5C5C] animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Importing post to Supabase...</p>
        </div>
      )}
    </div>
  );
}

function ReviewField({ label, value, valid }: { label: string; value: string; valid: boolean }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>
        {valid ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
      </div>
      <p className="text-sm text-white/70 truncate">{value || "(empty)"}</p>
    </div>
  );
}

function MetricBox({ label, value, ok }: { label: string; value: number; ok: boolean }) {
  return (
    <div className={`p-2 rounded ${ok ? "bg-white/[0.02]" : "bg-red-500/5 border border-red-500/20"}`}>
      <span className="text-white/30 text-[10px] block">{label}</span>
      <span className={`font-mono text-sm ${ok ? "text-white/70" : "text-red-400"}`}>{value}</span>
    </div>
  );
}
