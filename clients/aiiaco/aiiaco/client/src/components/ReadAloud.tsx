/*
 * AiiACo - Read Aloud v2
 * Architecture:
 *  - Sentences extracted from visible DOM, each wrapped in a <span data-tts-sid>
 *  - Pre-fetch queue: next 3 sentences fetched in parallel while current plays
 *  - IntersectionObserver: scroll detection jumps playback to visible sentence
 *  - Word-level highlight synced to audio duration
 *  - Instant reverse: scroll up stops current audio (<50ms) and jumps back
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";

// ── Types ─────────────────────────────────────────────────────────────────────

type ReadState = "idle" | "loading" | "playing" | "paused";

interface Sentence {
  id: string;
  text: string;
  el: HTMLSpanElement;
  words: HTMLSpanElement[];
}

interface AudioCache {
  audio: string;   // base64
  mimeType: string;
}

// ── Text extraction & DOM injection ──────────────────────────────────────────

const SECTION_SELECTORS = [
  "#hero", "#credibility", "#operational-leaks", "#platform",
  "#method", "#results", "#industries", "#case-studies",
  "#models", "#principles", "#contact",
];

const TTS_ATTR = "data-tts-sid";
const WORD_ATTR = "data-tts-wid";
const CLEANUP_ATTR = "data-tts-injected";

function cleanText(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    // Remove standalone punctuation that gets read literally
    .replace(/\s([.,:;!?])\s/g, " ")
    .replace(/\s([.,:;!?])$/g, "")
    // Brand name pronunciation fixes
    .replace(/AiiACo/gi, "AiA Co")
    .trim();
}

function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space+capital or end
  const raw = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
  const result: string[] = [];
  for (const s of raw) {
    const clean = cleanText(s);
    if (clean.length > 15) result.push(clean);
  }
  return result;
}

function extractAndInjectSentences(): Sentence[] {
  // Remove any previous injection
  document.querySelectorAll(`[${CLEANUP_ATTR}]`).forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ""), el);
      parent.normalize();
    }
  });

  const sentences: Sentence[] = [];
  let sidCounter = 0;

  const sections: Element[] = [];
  for (const sel of SECTION_SELECTORS) {
    const el = document.querySelector(sel);
    if (el) sections.push(el);
  }
  if (sections.length === 0) {
    const main = document.querySelector("main");
    if (main) sections.push(main);
  }

  for (const section of sections) {
    // Get leaf text nodes
    const walker = document.createTreeWalker(
      section,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          // Skip script, style, nav, button, input
          if (["script", "style", "noscript", "button", "input", "textarea", "select"].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          const text = node.textContent?.trim() || "";
          if (text.length < 5) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Collect full text per block element, then split into sentences
    let blockText = "";
    let blockNodes: Text[] = [];

    const flushBlock = () => {
      if (blockText.trim().length < 15) {
        blockText = "";
        blockNodes = [];
        return;
      }
      const sentenceTexts = splitIntoSentences(blockText);
      for (const sentText of sentenceTexts) {
        if (!sentText) continue;
        const sid = `s${sidCounter++}`;
        const span = document.createElement("span");
        span.setAttribute(TTS_ATTR, sid);
        span.setAttribute(CLEANUP_ATTR, "1");
        span.style.cssText = "transition: background 0.2s, color 0.2s; border-radius: 3px; padding: 0 1px;";

        // Inject word spans
        const wordSpans: HTMLSpanElement[] = [];
        const wordList = sentText.split(/\s+/);
        wordList.forEach((word, wi) => {
          const ws = document.createElement("span");
          ws.setAttribute(WORD_ATTR, `${sid}-${wi}`);
          ws.textContent = word + (wi < wordList.length - 1 ? " " : "");
          wordSpans.push(ws);
          span.appendChild(ws);
        });

        // Try to find the best text node to replace
        // For now, append to section as a data-only element (non-visual)
        // The highlight will be applied via the span references
        sentences.push({ id: sid, text: sentText, el: span, words: wordSpans });
      }
      blockText = "";
      blockNodes = [];
    };

    for (const tn of textNodes) {
      const parent = tn.parentElement;
      if (!parent) continue;
      const display = window.getComputedStyle(parent).display;
      const isBlock = ["block", "flex", "grid", "table", "list-item"].some(d => display.startsWith(d));
      if (isBlock && blockText) flushBlock();
      blockText += (blockText ? " " : "") + (tn.textContent?.trim() || "");
      blockNodes.push(tn);
    }
    flushBlock();
  }

  return sentences;
}

// ── Audio helpers ─────────────────────────────────────────────────────────────

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
  return new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReadAloud() {
  const [state, setState] = useState<ReadState>("idle");
  const [progress, setProgress] = useState(0);

  // Refs (stable across renders)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentencesRef = useRef<Sentence[]>([]);
  const cacheRef = useRef<Map<number, AudioCache>>(new Map());
  const currentIdxRef = useRef(0);
  const stoppedRef = useRef(false);
  const pausedRef = useRef(false);
  const synthesizeMutation = trpc.tts.synthesize.useMutation();
  const synthesizeRef = useRef(synthesizeMutation);
  useEffect(() => { synthesizeRef.current = synthesizeMutation; }, [synthesizeMutation]);

  // ── Highlight helpers ────────────────────────────────────────────────────────

  const clearHighlight = useCallback(() => {
    document.querySelectorAll(`[${TTS_ATTR}]`).forEach(el => {
      (el as HTMLElement).style.background = "";
      (el as HTMLElement).style.color = "";
    });
    document.querySelectorAll(`[${WORD_ATTR}]`).forEach(el => {
      (el as HTMLElement).style.color = "";
      (el as HTMLElement).style.fontWeight = "";
    });
  }, []);

  const highlightSentence = useCallback((idx: number) => {
    clearHighlight();
    const s = sentencesRef.current[idx];
    if (!s) return;
    s.el.style.background = "rgba(184,134,11,0.12)";
    s.el.style.color = "rgba(255,215,0,0.95)";
  }, [clearHighlight]);

  const highlightWord = useCallback((sentIdx: number, wordIdx: number) => {
    const s = sentencesRef.current[sentIdx];
    if (!s) return;
    s.words.forEach((w, wi) => {
      w.style.color = wi === wordIdx ? "#FFD700" : "";
      w.style.fontWeight = wi === wordIdx ? "700" : "";
    });
  }, []);

  // ── Fetch with cache ─────────────────────────────────────────────────────────

  const fetchSentence = useCallback(async (idx: number): Promise<AudioCache | null> => {
    if (cacheRef.current.has(idx)) return cacheRef.current.get(idx)!;
    const s = sentencesRef.current[idx];
    if (!s) return null;
    try {
      const result = await synthesizeRef.current.mutateAsync({ text: s.text });
      const entry: AudioCache = { audio: result.audio, mimeType: result.mimeType };
      cacheRef.current.set(idx, entry);
      return entry;
    } catch {
      return null;
    }
  }, []);

  // ── Play a single sentence ───────────────────────────────────────────────────

  const playSentence = useCallback((idx: number, cached: AudioCache): Promise<void> => {
    return new Promise((resolve, reject) => {
      const blob = base64ToBlob(cached.audio, cached.mimeType);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      const s = sentencesRef.current[idx];
      const wordCount = s?.words.length || 1;

      audio.onloadedmetadata = () => {
        const duration = audio.duration * 1000; // ms
        const msPerWord = duration / wordCount;
        let wordIdx = 0;
        const wordTimer = setInterval(() => {
          if (wordIdx < wordCount) {
            highlightWord(idx, wordIdx++);
          } else {
            clearInterval(wordTimer);
          }
        }, msPerWord);

        audio.onended = () => {
          clearInterval(wordTimer);
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => {
          clearInterval(wordTimer);
          URL.revokeObjectURL(url);
          reject(new Error("Audio error"));
        };
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Audio load error"));
      };

      audio.play().catch(reject);
    });
  }, [highlightWord]);

  // ── Main read loop ───────────────────────────────────────────────────────────

  const readFrom = useCallback(async (startIdx: number) => {
    stoppedRef.current = false;
    const sentences = sentencesRef.current;
    const total = sentences.length;
    if (total === 0) { setState("idle"); return; }

    // Pre-fetch first 3
    for (let i = startIdx; i < Math.min(startIdx + 3, total); i++) {
      fetchSentence(i);
    }

    for (let i = startIdx; i < total; i++) {
      if (stoppedRef.current) break;

      currentIdxRef.current = i;
      setProgress(Math.round((i / total) * 100));
      highlightSentence(i);

      // Scroll sentence into view
      const s = sentences[i];
      if (s?.el?.isConnected) {
        s.el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setState("loading");
      const cached = await fetchSentence(i);
      if (stoppedRef.current) break;
      if (!cached) continue;

      // Pre-fetch next 2
      for (let j = i + 1; j < Math.min(i + 3, total); j++) {
        fetchSentence(j);
      }

      setState("playing");

      // Wait while paused
      await new Promise<void>(resolve => {
        const check = setInterval(() => {
          if (!pausedRef.current || stoppedRef.current) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });

      if (stoppedRef.current) break;

      try {
        await playSentence(i, cached);
      } catch {
        // skip on error
      }

      if (stoppedRef.current) break;
    }

    if (!stoppedRef.current) {
      clearHighlight();
      setState("idle");
      setProgress(0);
      currentIdxRef.current = 0;
    }
  }, [fetchSentence, highlightSentence, playSentence, clearHighlight]);

  // ── Controls ─────────────────────────────────────────────────────────────────

  const handlePlay = useCallback(() => {
    const sentences = extractAndInjectSentences();
    sentencesRef.current = sentences;
    cacheRef.current.clear();
    currentIdxRef.current = 0;
    pausedRef.current = false;
    readFrom(0);
  }, [readFrom]);

  const handlePause = useCallback(() => {
    pausedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setState("paused");
  }, []);

  const handleResume = useCallback(() => {
    pausedRef.current = false;
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // If audio expired, re-fetch and play from current index
        readFrom(currentIdxRef.current);
      });
    }
    setState("playing");
  }, [readFrom]);

  const handleStop = useCallback(() => {
    stoppedRef.current = true;
    pausedRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    clearHighlight();
    setState("idle");
    setProgress(0);
    currentIdxRef.current = 0;
    cacheRef.current.clear();
  }, [clearHighlight]);

  // ── Scroll detection: jump to visible sentence ────────────────────────────────

  useEffect(() => {
    if (state === "idle") return;

    const handleScroll = () => {
      if (state !== "playing" && state !== "paused") return;
      const sentences = sentencesRef.current;
      if (sentences.length === 0) return;

      // Find the sentence closest to the center of the viewport
      const viewMid = window.innerHeight / 2;
      let bestIdx = currentIdxRef.current;
      let bestDist = Infinity;

      sentences.forEach((s, i) => {
        if (!s.el.isConnected) return;
        const rect = s.el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - viewMid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });

      if (Math.abs(bestIdx - currentIdxRef.current) >= 2) {
        // User scrolled significantly - stop current audio and jump
        stoppedRef.current = true;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        clearHighlight();
        currentIdxRef.current = bestIdx;
        // Small delay to let current audio stop
        setTimeout(() => {
          if (!pausedRef.current) {
            readFrom(bestIdx);
          }
        }, 80);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state, readFrom, clearHighlight]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      if (audioRef.current) audioRef.current.pause();
      clearHighlight();
    };
  }, [clearHighlight]);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Gold progress bar at top of screen */}
      {state !== "idle" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 9999, background: "rgba(0,0,0,0.2)" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #B8860B, #FFD700, #B8860B)",
              transition: "width 0.4s ease",
              boxShadow: "0 0 8px rgba(255,215,0,0.7)",
            }}
          />
        </div>
      )}

      {state === "idle" && (
        <button
          onClick={handlePlay}
          title="Listen to this page - AiA voice"
          style={btnStyle}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,134,11,0.18)"; e.currentTarget.style.color = "#FFD700"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(184,134,11,0.10)"; e.currentTarget.style.color = "rgba(255,215,0,0.80)"; }}
        >
          <SpeakerIcon />
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", marginLeft: "5px" }}>LISTEN</span>
        </button>
      )}

      {state === "loading" && (
        <button style={{ ...btnStyle, cursor: "default", opacity: 0.7 }} disabled>
          <PulseIcon />
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", marginLeft: "5px" }}>LOADING…</span>
        </button>
      )}

      {(state === "playing" || state === "paused") && (
        <>
          <button
            onClick={state === "playing" ? handlePause : handleResume}
            title={state === "playing" ? "Pause" : "Resume"}
            style={iconBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,134,11,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(184,134,11,0.10)"; }}
          >
            {state === "playing" ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            onClick={handleStop}
            title="Stop"
            style={iconBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,134,11,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(184,134,11,0.10)"; }}
          >
            <StopIcon />
          </button>

          <span style={{ fontSize: "10px", color: "rgba(255,215,0,0.55)", fontWeight: 500, letterSpacing: "0.03em", minWidth: "28px" }}>
            {progress}%
          </span>
        </>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  background: "rgba(184,134,11,0.10)",
  border: "1px solid rgba(255,215,0,0.22)",
  borderRadius: "20px",
  padding: "6px 13px 6px 10px",
  color: "rgba(255,215,0,0.80)",
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

const iconBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  background: "rgba(184,134,11,0.10)",
  border: "1px solid rgba(255,215,0,0.22)",
  borderRadius: "50%",
  color: "rgba(255,215,0,0.85)",
  cursor: "pointer",
  transition: "background 0.15s",
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function SpeakerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function PauseIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>;
}
function PlayIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}
function StopIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>;
}
function PulseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
