"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Zap, Bot, User, AlertTriangle, Type, Link2, FileSearch, Sparkles } from "lucide-react";
import { toast } from "sonner";

const LOCAL_PROXY_URL = "http://localhost:3100";
const TUNNEL_PROXY_URL = "https://ai-proxy.montekristobelgrade.com";

interface AITabProps {
  postId: string;
  htmlBody: string;
  clientSlug?: string;
  postSlug?: string;
  sourceFilePath?: string;
  onApplyChange?: (oldText: string, newText: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickActions = [
  { label: "Check banned words", prompt: "Scan the post HTML for any banned words from your list and report what you find with exact locations.", icon: AlertTriangle },
  { label: "Fix em dashes", prompt: "Find all em dashes in the post and suggest REPLACE/WITH replacements for each one.", icon: Type },
  { label: "Improve readability", prompt: "Analyze the readability of this post. Flag long sentences, uniform paragraph lengths, and missing transition words. Suggest specific fixes.", icon: FileSearch },
  { label: "Add external links", prompt: "Identify 3-5 places in this post where an external authority link (government, academic, industry standard) should be added. Suggest specific URLs.", icon: Link2 },
  { label: "Rewrite for anti-AI", prompt: "Flag any AI-sounding patterns in this post: uniform structure, missing opinions, lack of specific expertise signals, banned phrases. Suggest rewrites.", icon: Sparkles },
  { label: "Generate meta description", prompt: "Write a meta description for this post that is exactly 150-160 characters, includes the focus keyphrase, and contains a specific statistic or benefit.", icon: Zap },
];

export function AITab({ postId, htmlBody, clientSlug, postSlug, sourceFilePath, onApplyChange }: AITabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [proxyStatus, setProxyStatus] = useState<"checking" | "local" | "api">("checking");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check proxy: try localhost first, then tunnel, then API fallback
  useEffect(() => {
    async function checkProxy() {
      // Try localhost first (fastest, direct)
      try {
        const r = await fetch(`${LOCAL_PROXY_URL}/health`, { signal: AbortSignal.timeout(2000) });
        const data = await r.json();
        if (data.status === "ok") { setProxyStatus("local"); return; }
      } catch {}

      // Try Cloudflare tunnel (works from any device)
      try {
        const r = await fetch(`${TUNNEL_PROXY_URL}/health`, { signal: AbortSignal.timeout(5000) });
        const data = await r.json();
        if (data.status === "ok") { setProxyStatus("local"); return; }
      } catch {}

      // Fallback to API
      setProxyStatus("api");
    }
    checkProxy();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Use proxy (subscription) if available, fallback to API
      let endpoint = "/api/ai/chat";
      if (proxyStatus === "local") {
        // Try localhost first, tunnel as backup
        try {
          await fetch(`${LOCAL_PROXY_URL}/health`, { signal: AbortSignal.timeout(1000) });
          endpoint = `${LOCAL_PROXY_URL}/chat`;
        } catch {
          endpoint = `${TUNNEL_PROXY_URL}/chat`;
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          message: content.trim(),
          htmlBody: htmlBody,
          clientSlug: clientSlug,
          postSlug: postSlug,
          sourceFilePath: sourceFilePath,
          postHtml: htmlBody,
          conversationHistory: messages.slice(-10),
        }),
      });

      if (!response.ok) throw new Error("AI request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n").filter(l => l.startsWith("data: "));

          for (const line of lines) {
            const data = JSON.parse(line.replace("data: ", ""));

            if (data.type === "text") {
              fullResponse += data.text;
              // Update the assistant message in real-time
              setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg?.role === "assistant") {
                  lastMsg.content = fullResponse;
                } else {
                  updated.push({
                    role: "assistant",
                    content: fullResponse,
                    timestamp: new Date().toISOString(),
                  });
                }
                return [...updated];
              });
            } else if (data.type === "error") {
              toast.error(data.error);
            }
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  // Parse REPLACE/WITH blocks from AI response
  const parseChanges = (text: string): Array<{ old: string; new: string }> => {
    const changes: Array<{ old: string; new: string }> = [];
    const regex = /REPLACE:\s*`([^`]+)`\s*\nWITH:\s*`([^`]+)`/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      changes.push({ old: match[1], new: match[2] });
    }
    return changes;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Connection Status */}
      <div className="flex items-center gap-2 mb-3 text-[10px]">
        <div className={`w-1.5 h-1.5 rounded-full ${
          proxyStatus === "local" ? "bg-emerald-400" : proxyStatus === "api" ? "bg-amber-400" : "bg-white/20 animate-pulse"
        }`} />
        <span className="text-white/30">
          {proxyStatus === "local" && "Claude CLI (subscription, full MK system access)"}
          {proxyStatus === "api" && "API mode (start local-proxy for free usage)"}
          {proxyStatus === "checking" && "Checking connection..."}
        </span>
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-xs text-white/30 mb-3">Quick actions:</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 bg-white/[0.03] border border-white/5 rounded-lg hover:bg-white/[0.06] hover:text-white/70 hover:border-white/10 transition-all text-left"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 text-[#FF5C5C]/60" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-[#FF5C5C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-[#FF5C5C]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-white/10 text-white/80"
                  : "bg-white/[0.03] border border-white/5 text-white/70"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>

              {/* Apply buttons for REPLACE/WITH blocks */}
              {msg.role === "assistant" && onApplyChange && (() => {
                const changes = parseChanges(msg.content);
                if (changes.length === 0) return null;
                return (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                    {changes.map((change, ci) => (
                      <button
                        key={ci}
                        onClick={() => {
                          onApplyChange(change.old, change.new);
                          toast.success("Change applied");
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        Apply change {ci + 1}
                      </button>
                    ))}
                    {changes.length > 1 && (
                      <button
                        onClick={() => {
                          changes.forEach(c => onApplyChange(c.old, c.new));
                          toast.success(`Applied ${changes.length} changes`);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-[#FF5C5C]/10 border border-[#FF5C5C]/20 text-[#FF5C5C] rounded hover:bg-[#FF5C5C]/20 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        Apply all {changes.length} changes
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-white/40" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-white/5 pt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Ask the AI editor..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF5C5C]/50 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-[#FF5C5C] hover:bg-[#ff4444] disabled:opacity-30 text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
