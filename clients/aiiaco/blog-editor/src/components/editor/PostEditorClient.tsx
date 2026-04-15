"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Code, Eye, Image as ImageIcon, Search, MessageSquare, Link2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Post, Client } from "@/lib/supabase/types";

import { SEOTab } from "@/components/editor/tabs/SEOTab";
import { HTMLTab } from "@/components/editor/tabs/HTMLTab";
import { PreviewTab } from "@/components/editor/tabs/PreviewTab";
import { ImagesTab } from "@/components/editor/tabs/ImagesTab";
import { LinksTab } from "@/components/editor/tabs/LinksTab";
import { AITab } from "@/components/editor/tabs/AITab";
import { PublishSidebar } from "@/components/editor/PublishSidebar";

type TabId = "seo" | "html" | "preview" | "images" | "links" | "ai";

const tabs: { id: TabId; label: string; icon: typeof Code }[] = [
  { id: "seo", label: "SEO Fields", icon: Search },
  { id: "html", label: "HTML Code", icon: Code },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "links", label: "Links", icon: Link2 },
  { id: "ai", label: "AI Assistant", icon: MessageSquare },
];

interface PostEditorClientProps {
  post: Post;
  client: Client;
}

export function PostEditorClient({ post: initialPost, client }: PostEditorClientProps) {
  const [post, setPost] = useState<Post>(initialPost);
  const [activeTab, setActiveTab] = useState<TabId>("seo");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const supabase = createClient();

  // ---- Handlers ----

  const updateField = useCallback(async (field: string, value: unknown) => {
    setPost(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const savePost = useCallback(async () => {
    const { error } = await supabase
      .from("posts")
      .update({
        seo_title: post.seo_title,
        meta_description: post.meta_description,
        focus_keyphrase: post.focus_keyphrase,
        canonical_url: post.canonical_url,
        category: post.category,
        og_title: post.og_title,
        og_description: post.og_description,
        og_image: post.og_image,
        html_body: post.html_body,
        json_ld: post.json_ld,
        featured_image_url: post.featured_image_url,
        featured_image_alt: post.featured_image_alt,
        status: post.status,
        scheduled_at: post.scheduled_at,
        notes: post.notes,
      })
      .eq("id", post.id);

    if (error) throw error;
    setHasUnsavedChanges(false);
  }, [post, supabase]);

  const handleSEOFieldSave = useCallback((field: string, value: string) => {
    updateField(field, value);
  }, [updateField]);

  const handleHTMLChange = useCallback((html: string) => {
    updateField("html_body", html);
  }, [updateField]);

  const handleStatusChange = useCallback((status: string) => {
    updateField("status", status);
  }, [updateField]);

  const handleSchedule = useCallback((date: string) => {
    updateField("scheduled_at", date);
  }, [updateField]);

  const handleFeaturedImageChange = useCallback((url: string) => {
    updateField("featured_image_url", url);
    updateField("og_image", url);
  }, [updateField]);

  const handlePublish = useCallback(async () => {
    // Save first
    await savePost();
    // Call publish Server Action
    const { publishPost } = await import("@/lib/actions/publish");
    const result = await publishPost(post.id);
    if (result.success) {
      setPost(prev => ({ ...prev, status: "published", published_at: new Date().toISOString() }));
      toast.success(`Published to ${client.platform}`);
    } else {
      toast.error(result.error || "Publish failed");
    }
  }, [savePost, post.id, client.platform]);

  // ---- Render ----

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${client.slug}`}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-medium truncate max-w-md">
              {post.title}
            </h1>
            <span className="text-[10px] text-white/25">
              {client.name} &middot; /{post.slug}/
              {hasUnsavedChanges && (
                <span className="ml-2 text-amber-400">Unsaved changes</span>
              )}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Area: Tab Content + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "seo" && (
            <SEOTab post={post} onFieldSave={handleSEOFieldSave} />
          )}
          {activeTab === "html" && (
            <HTMLTab
              htmlBody={post.html_body}
              jsonLd={post.json_ld || ""}
              onHTMLChange={handleHTMLChange}
            />
          )}
          {activeTab === "preview" && (
            <PreviewTab htmlBody={post.html_body} client={client} />
          )}
          {activeTab === "images" && (
            <ImagesTab
              htmlBody={post.html_body}
              featuredImageUrl={post.featured_image_url}
              featuredImageAlt={post.featured_image_alt}
              platform={client.platform}
              onHTMLChange={handleHTMLChange}
              onFeaturedImageChange={handleFeaturedImageChange}
            />
          )}
          {activeTab === "links" && (
            <LinksTab
              htmlBody={post.html_body}
              clientDomain={client.domain}
              onHTMLChange={handleHTMLChange}
            />
          )}
          {activeTab === "ai" && (
            <AITab
              postId={post.id}
              htmlBody={post.html_body}
              clientSlug={client.slug}
              postSlug={post.slug}
              sourceFilePath={post.source_file_path || undefined}
              onApplyChange={(oldText, newText) => {
                const updated = post.html_body.split(oldText).join(newText);
                handleHTMLChange(updated);
              }}
            />
          )}
        </div>

        {/* Publish Sidebar */}
        <PublishSidebar
          post={post}
          client={client}
          onStatusChange={handleStatusChange}
          onSchedule={handleSchedule}
          onPublish={handlePublish}
          onSave={savePost}
        />
      </div>
    </div>
  );
}
