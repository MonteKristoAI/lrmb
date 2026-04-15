import { useState, useEffect } from "react";
import goldLogo from "@/assets/Entourage_gold_logo.png";

const AgeGate = ({ children }: { children: React.ReactNode }) => {
  const [verified, setVerified] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("age_verified") === "true") {
      setVerified(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("age_verified", "true");
    setVerified(true);
  };

  if (verified) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <img src={goldLogo} alt="Entourage" className="h-14 w-auto mx-auto mb-2" />
        <div className="w-12 h-px bg-primary mx-auto my-6" />
        {denied ? (
          <>
            <p className="text-lg font-bold text-foreground mb-4">
              Sorry, you must be 21 or older to visit this site.
            </p>
            <p className="text-sm text-muted-foreground">
              Please come back when you meet the age requirement.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-foreground mb-2">
              Are you 21 or older?
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You must be of legal age to view this website.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                className="px-10 py-3 rounded-lg gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Yes, I'm 21+
              </button>
              <button
                onClick={() => setDenied(true)}
                className="px-10 py-3 rounded-lg border border-border text-foreground font-bold text-sm hover:bg-secondary transition-colors"
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgeGate;
