import { useState } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-40 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-[hsl(175_72%_38%)] text-white shadow-lg",
          "hover:bg-[hsl(175_72%_32%)] hover:shadow-[0_4px_20px_hsl(175_72%_38%/0.35)]",
          "transition-all",
          "bottom-20 right-6 lg:bottom-8 lg:right-8",
        )}
        aria-label="Open AI assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        >
          <div
            className="relative mx-6 w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(175_72%_38%/0.08)]">
                <MessageCircle className="h-8 w-8 text-[hsl(175_72%_38%)]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                AI Assistant Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI-powered assistant is coming soon. In the meantime, feel
                free to book a discovery call or reach out directly.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-[hsl(175_72%_38%)] px-6 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-[hsl(175_72%_32%)]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
