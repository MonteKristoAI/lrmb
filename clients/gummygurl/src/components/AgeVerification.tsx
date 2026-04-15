import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoAgeGate from "@/assets/logo-agegate.webp";

const AGE_KEY = "gummygurl-age-verified";
const AGE_EXPIRY_MS = 24 * 60 * 60 * 1000;

function isAgeVerified(): boolean {
  const stored = localStorage.getItem(AGE_KEY);
  if (!stored) return false;
  try {
    const { timestamp } = JSON.parse(stored);
    return Date.now() - timestamp < AGE_EXPIRY_MS;
  } catch {
    return false;
  }
}

export default function AgeVerification() {
  const [show, setShow] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!isAgeVerified()) setShow(true);
  }, []);

  const handleYes = () => {
    localStorage.setItem(AGE_KEY, JSON.stringify({ timestamp: Date.now() }));
    setShow(false);
  };

  const handleNo = () => {
    setDenied(true);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-background rounded-2xl p-8 text-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)]">
        <img
          src={logoAgeGate}
          alt="Gummy Gurl"
          className="h-40 mx-auto mb-6 object-contain"
        />

        <h2 className="text-xl font-semibold text-foreground mb-2">
          Age Verification
        </h2>

        {denied ? (
          <p className="text-sm text-destructive mb-6 leading-relaxed">
            You must be 21 or older to access this site.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            You must be 21 years or older to enter this website.
          </p>
        )}

        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={handleNo}
          >
            No
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={handleYes}
          >
            Yes, I am 21+
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground/50 mt-6 leading-relaxed">
          Products containing THC may not be legal in all states.
          <br />
          Please check your local laws before purchasing.
        </p>
      </div>
    </div>
  );
}
