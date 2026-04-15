"use client";

import { useState, useMemo } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react";
import type { Client } from "@/lib/supabase/types";

interface PreviewTabProps {
  htmlBody: string;
  client: Client;
}

const viewports = [
  { name: "Desktop", width: "100%", icon: Monitor },
  { name: "Tablet", width: "768px", icon: Tablet },
  { name: "Mobile", width: "375px", icon: Smartphone },
] as const;

export function PreviewTab({ htmlBody, client }: PreviewTabProps) {
  const [viewport, setViewport] = useState<string>("100%");

  const srcdoc = useMemo(() => {
    const cssLinks = (client.preview_css_urls || [])
      .map(url => `<link rel="stylesheet" href="${url}" crossorigin="anonymous">`)
      .join("\n");

    const customCSS = client.preview_css_custom || "";
    const bodyClass = client.preview_body_class || "";

    // Split wrapper HTML on {{content}} placeholder
    const wrapperParts = (client.preview_wrapper_html || "{{content}}").split("{{content}}");
    const wrapperBefore = wrapperParts[0] || "";
    const wrapperAfter = wrapperParts[1] || "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${cssLinks}
  <style>
    ${customCSS}
    /* Editor preview defaults */
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      color: #1a1a2e;
      background: #ffffff;
    }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    h1 { font-size: 2rem; line-height: 1.2; margin-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; margin-top: 2rem; }
    h3 { font-size: 1.2rem; margin-top: 1.5rem; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th, td { padding: 0.75rem; border: 1px solid #e0e0e0; text-align: left; font-size: 0.9rem; }
    th { background: #f5f5f5; font-weight: 600; }
    figure { margin: 2rem 0; }
    figcaption { font-size: 0.85rem; text-align: center; margin-top: 0.5rem; color: #666; }
    svg { max-width: 100%; height: auto; }
    .key-takeaways, [class*="takeaway"] {
      border-left: 4px solid #22c55e;
      background: rgba(34,197,94,0.08);
      padding: 1.25rem 1.5rem;
      margin: 1.5rem 0;
      border-radius: 0 8px 8px 0;
    }
  </style>
</head>
<body class="${bodyClass}">
  ${wrapperBefore}
  <article>${htmlBody}</article>
  ${wrapperAfter}
</body>
</html>`;
  }, [htmlBody, client]);

  const openInNewTab = () => {
    const blob = new Blob([srcdoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {viewports.map((vp) => {
            const Icon = vp.icon;
            return (
              <button
                key={vp.name}
                onClick={() => setViewport(vp.width)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  viewport === vp.width
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {vp.name}
              </button>
            );
          })}
        </div>

        <button
          onClick={openInNewTab}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open in New Tab
        </button>
      </div>

      {/* Preview iframe */}
      <div
        className="mx-auto transition-all duration-300 ease-in-out"
        style={{ width: viewport, maxWidth: "100%" }}
      >
        <div className="rounded-lg border border-white/10 overflow-hidden bg-white">
          <iframe
            srcDoc={srcdoc}
            sandbox="allow-same-origin"
            className="w-full border-0"
            style={{ height: "700px" }}
            title="Blog post preview"
          />
        </div>
      </div>
    </div>
  );
}
