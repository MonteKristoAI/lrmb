"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Loader2, Globe, Clock, FileText, Send } from "lucide-react";
import { toast } from "sonner";
import { checkQualityGates, type QualityGate } from "@/lib/utils/quality-gates";
import type { Post, Client } from "@/lib/supabase/types";

interface PublishSidebarProps {
  post: Post;
  client: Client;
  onStatusChange: (status: string) => void;
  onSchedule: (date: string) => void;
  onPublish: () => Promise<void>;
  onSave: () => Promise<void>;
}

const statusOptions = [
  { value: "draft", label: "Draft", icon: FileText, color: "text-amber-400" },
  { value: "review", label: "In Review", icon: AlertTriangle, color: "text-yellow-400" },
  { value: "approved", label: "Approved", icon: CheckCircle, color: "text-blue-400" },
  { value: "scheduled", label: "Scheduled", icon: Clock, color: "text-violet-400" },
];

export function PublishSidebar({
  post,
  client,
  onStatusChange,
  onSchedule,
  onPublish,
  onSave,
}: PublishSidebarProps) {
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);

  const gates = checkQualityGates(post);

  const handlePublish = async () => {
    if (!gates.blockersPassed) {
      toast.error("Fix blocker issues before publishing");
      return;
    }
    setPublishing(true);
    try {
      await onPublish();
      toast.success("Published successfully");
    } catch (err: any) {
      toast.error(err.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      toast.success("Saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-72 border-l border-white/5 bg-white/[0.02] p-5 space-y-6 overflow-y-auto">
      {/* Status */}
      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Status</label>
        <select
          value={post.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#FF5C5C]/50"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#1a1f2e]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule */}
      {post.status === "scheduled" && (
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Schedule For</label>
          <input
            type="datetime-local"
            value={post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : ""}
            onChange={(e) => onSchedule(new Date(e.target.value).toISOString())}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#FF5C5C]/50"
          />
          {client.scheduling_pattern && (
            <p className="text-[10px] text-white/25 mt-1">
              Pattern: {client.scheduling_pattern}
            </p>
          )}
        </div>
      )}

      {/* Platform */}
      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">Platform</label>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Globe className="w-3.5 h-3.5" />
          <span className="capitalize">{client.platform.replace("-", " ")}</span>
        </div>
        <p className="text-[10px] text-white/20 mt-0.5">{client.domain}</p>
      </div>

      {/* Metrics */}
      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Metrics</label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/[0.03] rounded p-2">
            <span className="text-white/30 block">Words</span>
            <span className="font-mono">{post.word_count?.toLocaleString()}</span>
          </div>
          <div className="bg-white/[0.03] rounded p-2">
            <span className="text-white/30 block">Ext. Links</span>
            <span className="font-mono">{post.external_link_count}</span>
          </div>
          <div className="bg-white/[0.03] rounded p-2">
            <span className="text-white/30 block">Int. Links</span>
            <span className="font-mono">{post.internal_link_count}</span>
          </div>
          <div className={`bg-white/[0.03] rounded p-2 ${post.em_dash_count > 0 ? "border border-red-500/30" : ""}`}>
            <span className="text-white/30 block">Em Dashes</span>
            <span className={`font-mono ${post.em_dash_count > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {post.em_dash_count}
            </span>
          </div>
        </div>
      </div>

      {/* Quality Gates */}
      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
          Quality Gates
          {gates.allPassed ? (
            <CheckCircle className="w-3 h-3 text-emerald-400 inline ml-1.5" />
          ) : (
            <XCircle className="w-3 h-3 text-red-400 inline ml-1.5" />
          )}
        </label>
        <div className="space-y-1.5">
          {gates.gates.map((gate) => (
            <GateRow key={gate.name} gate={gate} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save Draft
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing || !gates.blockersPassed}
          className="w-full py-2 bg-[#FF5C5C] hover:bg-[#ff4444] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          title={!gates.blockersPassed ? "Fix blocker issues first" : "Publish to " + client.platform}
        >
          {publishing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          {publishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}

function GateRow({ gate }: { gate: QualityGate }) {
  return (
    <div className={`flex items-center justify-between text-[11px] px-2 py-1 rounded ${
      gate.passed ? "text-white/40" : gate.severity === "blocker" ? "text-red-400 bg-red-400/5" : "text-amber-400 bg-amber-400/5"
    }`}>
      <div className="flex items-center gap-1.5">
        {gate.passed ? (
          <CheckCircle className="w-3 h-3 text-emerald-400" />
        ) : gate.severity === "blocker" ? (
          <XCircle className="w-3 h-3" />
        ) : (
          <AlertTriangle className="w-3 h-3" />
        )}
        <span>{gate.name}</span>
      </div>
      <span className="font-mono text-[10px]">{gate.current}</span>
    </div>
  );
}
