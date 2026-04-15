/**
 * Admin - AiiA Knowledge Base Management
 *
 * View, create, edit, and push knowledge entries to the live ElevenLabs agent.
 * Each entry is a named piece of knowledge (e.g., "Agent Package Details").
 * "Push to AiiA" rebuilds the full prompt with all active entries and pushes to ElevenLabs.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Loader2, Brain, Plus, Pencil, Trash2, Upload, ToggleLeft, ToggleRight,
  ChevronDown, ChevronRight, FileText, Globe, MessageSquare, PenTool,
  Package, Building2, Cog, HelpCircle, Layers, CheckCircle2, AlertCircle,
} from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

// Category metadata
const CATEGORIES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  packages: { label: "Packages", icon: <Package size={14} />, color: "rgba(184,156,74,0.90)" },
  company: { label: "Company", icon: <Building2 size={14} />, color: "rgba(120,200,255,0.90)" },
  processes: { label: "Processes", icon: <Cog size={14} />, color: "rgba(80,220,150,0.90)" },
  faq: { label: "FAQ", icon: <HelpCircle size={14} />, color: "rgba(200,160,255,0.90)" },
  other: { label: "Other", icon: <Layers size={14} />, color: "rgba(200,215,230,0.55)" },
};

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  document: <FileText size={12} />,
  website: <Globe size={12} />,
  conversation: <MessageSquare size={12} />,
  manual: <PenTool size={12} />,
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: "14px", color: "rgba(255,255,255,0.88)",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "8px", padding: "10px 14px", width: "100%", outline: "none", boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle, minHeight: "200px", resize: "vertical", lineHeight: 1.6,
  fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace", fontSize: "13px",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: "pointer", appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
};

const btnGold: React.CSSProperties = {
  fontFamily: FF, fontSize: "14px", fontWeight: 700, color: "#03050A",
  background: "rgba(184,156,74,0.90)", border: "none", borderRadius: "8px",
  padding: "11px 28px", cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(200,215,230,0.55)",
  background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px", padding: "7px 16px", cursor: "pointer",
};

// ─── Entry Editor Modal ──────────────────────────────────────────────────────

interface EntryForm {
  title: string;
  content: string;
  category: string;
  source: string;
  sourceFile: string;
}

function EntryEditor({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: EntryForm;
  onSave: (form: EntryForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<EntryForm>(
    initial ?? { title: "", content: "", category: "other", source: "manual", sourceFile: "" }
  );

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
      <h3 style={{ fontFamily: FFD, fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "0 0 20px" }}>
        {initial ? "Edit Knowledge Entry" : "New Knowledge Entry"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div>
          <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Title *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Agent Package - Full Details"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Category</label>
            <select style={selectStyle} value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="packages">Packages</option>
              <option value="company">Company</option>
              <option value="processes">Processes</option>
              <option value="faq">FAQ</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Source</label>
            <select style={selectStyle} value={form.source} onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))}>
              <option value="manual">Manual</option>
              <option value="document">Document</option>
              <option value="website">Website</option>
              <option value="conversation">Conversation</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>
          Content * <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "normal", color: "rgba(200,215,230,0.30)" }}>- This is what AiiA will know</span>
        </label>
        <textarea
          style={textareaStyle}
          placeholder="Enter the knowledge content here. Be specific and detailed - this is exactly what AiiA will use to answer questions."
          value={form.content}
          onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
        />
        <div style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.30)", marginTop: "4px", textAlign: "right" }}>
          {form.content.length.toLocaleString()} characters
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button style={btnGhost} onClick={onCancel}>Cancel</button>
        <button
          style={{ ...btnGold, opacity: saving || !form.title || !form.content ? 0.5 : 1 }}
          disabled={saving || !form.title || !form.content}
          onClick={() => onSave(form)}
        >
          {saving ? "Saving…" : initial ? "Update Entry" : "Create Entry"}
        </button>
      </div>
    </div>
  );
}

// ─── Knowledge Entry Row ─────────────────────────────────────────────────────

function KnowledgeRow({
  entry,
  onEdit,
  onDelete,
  onToggle,
}: {
  entry: any;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES[entry.category] ?? CATEGORIES.other;
  const isActive = entry.isActive === 1;
  const isPushed = !!entry.lastPushedAt;
  const isStale = entry.lastPushedAt && new Date(entry.updatedAt) > new Date(entry.lastPushedAt);

  return (
    <div style={{
      background: isActive ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)",
      border: `1px solid ${isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
      borderRadius: "10px",
      marginBottom: "8px",
      opacity: isActive ? 1 : 0.5,
      transition: "all 0.2s ease",
    }}>
      {/* Header */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown size={16} style={{ color: "rgba(200,215,230,0.40)", flexShrink: 0 }} /> : <ChevronRight size={16} style={{ color: "rgba(200,215,230,0.40)", flexShrink: 0 }} />}

        {/* Category badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
          color: cat.color, background: `${cat.color}15`, border: `1px solid ${cat.color}30`,
          borderRadius: "4px", padding: "2px 8px", textTransform: "uppercase", flexShrink: 0,
        }}>
          {cat.icon} {cat.label}
        </span>

        {/* Title */}
        <span style={{ fontFamily: FF, fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.88)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {entry.title}
        </span>

        {/* Source icon */}
        <span style={{ color: "rgba(200,215,230,0.30)", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontFamily: FF, flexShrink: 0 }}>
          {SOURCE_ICONS[entry.source]} {entry.source}
        </span>

        {/* Push status */}
        {isPushed && !isStale && (
          <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "rgba(80,220,150,0.70)", fontSize: "11px", fontFamily: FF, flexShrink: 0 }}>
            <CheckCircle2 size={12} /> Synced
          </span>
        )}
        {isStale && (
          <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "rgba(212,180,80,0.80)", fontSize: "11px", fontFamily: FF, flexShrink: 0 }}>
            <AlertCircle size={12} /> Stale
          </span>
        )}
        {!isPushed && isActive && (
          <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "rgba(200,215,230,0.30)", fontSize: "11px", fontFamily: FF, flexShrink: 0 }}>
            Not pushed
          </span>
        )}

        {/* Content length */}
        <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.25)", flexShrink: 0 }}>
          {entry.content.length.toLocaleString()} chars
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 18px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <pre style={{
            fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: "12px", lineHeight: 1.7, color: "rgba(200,215,230,0.60)",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            background: "rgba(0,0,0,0.20)", borderRadius: "8px", padding: "16px",
            margin: "14px 0", maxHeight: "400px", overflow: "auto",
          }}>
            {entry.content}
          </pre>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button style={btnGhost} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              {isActive ? <><ToggleRight size={14} /> Deactivate</> : <><ToggleLeft size={14} /> Activate</>}
            </button>
            <button style={{ ...btnGhost, display: "flex", alignItems: "center", gap: "4px" }} onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Pencil size={12} /> Edit
            </button>
            <button
              style={{ ...btnGhost, color: "rgba(255,100,100,0.70)", borderColor: "rgba(255,100,100,0.15)", display: "flex", alignItems: "center", gap: "4px" }}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${entry.title}"? This cannot be undone.`)) onDelete();
              }}
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminKnowledgePage() {
  const { data: entries, isLoading, refetch } = trpc.knowledge.list.useQuery();
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const createMutation = trpc.knowledge.create.useMutation({
    onSuccess: () => { toast.success("Knowledge entry created"); setEditing(null); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.knowledge.update.useMutation({
    onSuccess: () => { toast.success("Knowledge entry updated"); setEditing(null); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.knowledge.delete.useMutation({
    onSuccess: () => { toast.success("Entry deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const toggleMutation = trpc.knowledge.toggleActive.useMutation({
    onSuccess: () => { refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const pushMutation = trpc.knowledge.pushToAgent.useMutation({
    onSuccess: (data) => {
      toast.success(`Pushed ${data.entriesPushed} entries to AiiA (${data.promptLength.toLocaleString()} chars)`);
      refetch();
    },
    onError: (e) => toast.error(`Push failed: ${e.message}`),
  });

  const filteredEntries = entries?.filter(e =>
    filterCategory === "all" || e.category === filterCategory
  ) ?? [];

  const activeCount = entries?.filter(e => e.isActive === 1).length ?? 0;
  const staleCount = entries?.filter(e =>
    e.isActive === 1 && e.lastPushedAt && new Date(e.updatedAt) > new Date(e.lastPushedAt)
  ).length ?? 0;
  const unpushedCount = entries?.filter(e => e.isActive === 1 && !e.lastPushedAt).length ?? 0;

  if (isLoading) {
    return (
      <div style={{ background: "#03050A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} style={{ color: "rgba(184,156,74,0.60)" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: "#03050A", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Brain size={28} style={{ color: "rgba(184,156,74,0.80)" }} />
            <div>
              <h1 style={{ fontFamily: FFD, fontSize: "28px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
                AiiA Knowledge Base
              </h1>
              <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.40)", margin: "4px 0 0" }}>
                {entries?.length ?? 0} entries · {activeCount} active · {staleCount + unpushedCount > 0 ? `${staleCount + unpushedCount} need push` : "all synced"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <a href="/admin-opsteam" style={{ ...btnGhost, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>← Console</a>
            <button
              style={{ ...btnGhost, display: "flex", alignItems: "center", gap: "6px" }}
              onClick={() => setEditing("new")}
            >
              <Plus size={14} /> Add Entry
            </button>
            <button
              style={{
                ...btnGold,
                display: "flex", alignItems: "center", gap: "8px",
                opacity: pushMutation.isPending || activeCount === 0 ? 0.5 : 1,
              }}
              disabled={pushMutation.isPending || activeCount === 0}
              onClick={() => pushMutation.mutate()}
            >
              {pushMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Push to AiiA
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            style={{
              ...btnGhost,
              fontSize: "12px", padding: "5px 14px",
              background: filterCategory === "all" ? "rgba(255,255,255,0.06)" : "transparent",
              color: filterCategory === "all" ? "rgba(255,255,255,0.80)" : "rgba(200,215,230,0.40)",
            }}
            onClick={() => setFilterCategory("all")}
          >
            All ({entries?.length ?? 0})
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const count = entries?.filter(e => e.category === key).length ?? 0;
            if (count === 0) return null;
            return (
              <button
                key={key}
                style={{
                  ...btnGhost,
                  fontSize: "12px", padding: "5px 14px",
                  display: "flex", alignItems: "center", gap: "4px",
                  background: filterCategory === key ? `${cat.color}12` : "transparent",
                  color: filterCategory === key ? cat.color : "rgba(200,215,230,0.40)",
                  borderColor: filterCategory === key ? `${cat.color}30` : "rgba(255,255,255,0.08)",
                }}
                onClick={() => setFilterCategory(key)}
              >
                {cat.icon} {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Editor */}
        {editing === "new" && (
          <EntryEditor
            saving={createMutation.isPending}
            onCancel={() => setEditing(null)}
            onSave={(form) => createMutation.mutate({
              title: form.title,
              content: form.content,
              category: form.category as any,
              source: form.source as any,
              sourceFile: form.sourceFile || undefined,
            })}
          />
        )}

        {typeof editing === "number" && entries && (
          <EntryEditor
            initial={(() => {
              const e = entries.find(x => x.id === editing);
              if (!e) return undefined;
              return { title: e.title, content: e.content, category: e.category, source: e.source, sourceFile: e.sourceFile ?? "" };
            })()}
            saving={updateMutation.isPending}
            onCancel={() => setEditing(null)}
            onSave={(form) => updateMutation.mutate({
              id: editing,
              title: form.title,
              content: form.content,
              category: form.category as any,
              source: form.source as any,
            })}
          />
        )}

        {/* Entry list */}
        {filteredEntries.length === 0 && !editing && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Brain size={48} style={{ color: "rgba(200,215,230,0.15)", margin: "0 auto 16px", display: "block" }} />
            <p style={{ fontFamily: FF, fontSize: "15px", color: "rgba(200,215,230,0.40)", margin: "0 0 8px" }}>
              No knowledge entries yet
            </p>
            <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.25)", margin: 0 }}>
              Add entries to teach AiiA about your packages, processes, and company.
            </p>
          </div>
        )}

        {filteredEntries.map((entry) => (
          <KnowledgeRow
            key={entry.id}
            entry={entry}
            onEdit={() => setEditing(entry.id)}
            onDelete={() => deleteMutation.mutate({ id: entry.id })}
            onToggle={() => toggleMutation.mutate({ id: entry.id, isActive: entry.isActive === 1 ? 0 : 1 })}
          />
        ))}
      </div>
    </div>
  );
}
