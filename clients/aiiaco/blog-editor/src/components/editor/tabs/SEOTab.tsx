"use client";

import { CopyField } from "@/components/editor/CopyField";
import type { Post } from "@/lib/supabase/types";

interface SEOTabProps {
  post: Post;
  onFieldSave?: (field: string, value: string) => void;
}

export function SEOTab({ post, onFieldSave }: SEOTabProps) {
  const save = (field: string) => (value: string) => onFieldSave?.(field, value);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4 border-b border-white/5">
        <h3 className="text-sm font-medium text-white/60">SEO Plugin Fields</h3>
        <p className="text-xs text-white/25 mt-0.5">Copy each field into Yoast / AIOSEO</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <CopyField
          label="SEO Title"
          value={post.seo_title || ""}
          maxLength={60}
          validRange={[40, 60]}
          editable
          onSave={save("seo_title")}
        />

        <CopyField
          label="Meta Description"
          value={post.meta_description || ""}
          multiline
          rows={2}
          maxLength={160}
          validRange={[140, 160]}
          editable
          onSave={save("meta_description")}
        />

        <CopyField
          label="Focus Keyphrase"
          value={post.focus_keyphrase || ""}
          editable
          onSave={save("focus_keyphrase")}
        />

        <CopyField
          label="URL Slug"
          value={post.slug || ""}
        />

        <CopyField
          label="Canonical URL"
          value={post.canonical_url || ""}
          editable
          onSave={save("canonical_url")}
        />
      </div>

      {/* Sidebar Fields */}
      <div className="pt-4 border-t border-white/5">
        <h3 className="text-sm font-medium text-white/60 mb-4">Sidebar / Taxonomy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CopyField
            label="Category"
            value={post.category || ""}
            editable
            onSave={save("category")}
          />
          <CopyField
            label="Tags"
            value={(post.tags || []).join(", ")}
          />
        </div>
      </div>

      {/* JSON-LD */}
      <div className="pt-4 border-t border-white/5">
        <h3 className="text-sm font-medium text-white/60 mb-4">JSON-LD Schema</h3>
        <CopyField
          label="Schema Markup"
          value={post.json_ld || ""}
          multiline
          rows={8}
        />
      </div>
    </div>
  );
}
