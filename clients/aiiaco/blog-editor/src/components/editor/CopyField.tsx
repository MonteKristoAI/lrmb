"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyFieldProps {
  label: string;
  value: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  validRange?: [number, number];
  editable?: boolean;
  onSave?: (value: string) => void;
}

export function CopyField({
  label,
  value,
  multiline = false,
  rows = 3,
  maxLength,
  validRange,
  editable = false,
  onSave,
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const charCount = localValue.length;
  const isInRange = validRange
    ? charCount >= validRange[0] && charCount <= validRange[1]
    : true;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(localValue);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [localValue, label]);

  const handleBlur = useCallback(() => {
    if (editable && onSave && localValue !== value) {
      onSave(localValue);
    }
  }, [editable, onSave, localValue, value]);

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className="space-y-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
          {label}
        </label>
        {(maxLength || validRange) && (
          <span
            className={`text-[10px] font-mono ${
              isInRange ? "text-emerald-400/60" : "text-red-400"
            }`}
          >
            {charCount}
            {maxLength && `/${maxLength}`}
            {validRange && ` (${validRange[0]}-${validRange[1]})`}
            {isInRange ? " ✓" : " ✗"}
          </span>
        )}
      </div>

      {/* Input + Copy button */}
      <div className="flex gap-2">
        <InputComponent
          value={localValue}
          onChange={editable ? (e) => setLocalValue(e.target.value) : undefined}
          onBlur={handleBlur}
          readOnly={!editable}
          rows={multiline ? rows : undefined}
          className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors font-mono ${
            editable
              ? "bg-white/5 border-white/10 text-white focus:border-[#FF5C5C]/50 focus:outline-none focus:ring-1 focus:ring-[#FF5C5C]/20"
              : "bg-white/[0.02] border-white/5 text-white/70 cursor-default"
          } ${multiline ? "resize-none" : ""}`}
        />

        <button
          onClick={handleCopy}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md border transition-all ${
            copied
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
              : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
          }`}
          title={`Copy ${label}`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
