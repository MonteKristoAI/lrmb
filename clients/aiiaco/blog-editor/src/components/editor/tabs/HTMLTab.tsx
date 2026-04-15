"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Dynamic import for CodeMirror (SSR-incompatible)
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

interface HTMLTabProps {
  htmlBody: string;
  jsonLd: string;
  onHTMLChange?: (html: string) => void;
}

export function HTMLTab({ htmlBody, jsonLd, onHTMLChange }: HTMLTabProps) {
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const copyHTML = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(htmlBody);
      setCopiedHTML(true);
      toast.success("HTML body copied");
      setTimeout(() => setCopiedHTML(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [htmlBody]);

  const copySchema = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonLd);
      setCopiedSchema(true);
      toast.success("JSON-LD schema copied");
      setTimeout(() => setCopiedSchema(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [jsonLd]);

  return (
    <div className="space-y-6">
      {/* HTML Body Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white/60">Post HTML Body</h3>
          <button
            onClick={copyHTML}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all ${
              copiedHTML
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {copiedHTML ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedHTML ? "Copied!" : "Copy All HTML"}
          </button>
        </div>

        <div className="rounded-lg border border-white/10 overflow-hidden">
          <CodeMirror
            value={htmlBody}
            height="500px"
            theme="dark"
            onChange={(value) => onHTMLChange?.(value)}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
            }}
            style={{
              fontSize: "13px",
            }}
          />
        </div>
      </div>

      {/* JSON-LD Section */}
      {jsonLd && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white/60">JSON-LD Schema</h3>
            <button
              onClick={copySchema}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all ${
                copiedSchema
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              {copiedSchema ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedSchema ? "Copied!" : "Copy JSON-LD"}
            </button>
          </div>

          <div className="rounded-lg border border-white/10 overflow-hidden">
            <CodeMirror
              value={jsonLd}
              height="300px"
              theme="dark"
              readOnly
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
              }}
              style={{
                fontSize: "13px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
