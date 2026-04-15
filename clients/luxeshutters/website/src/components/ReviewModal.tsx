import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Communication",
  "Installation quality",
  "Craftsmanship",
  "Timeliness",
  "Cleanup",
  "Professionalism",
  "Other",
];

type Step = "rating" | "feedback" | "thanks";

export default function ReviewModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [improvement, setImprovement] = useState("");
  const [message, setMessage] = useState("");

  if (!open) return null;

  const reset = () => { setStep("rating"); setRating(0); setHover(0); setSelectedCategories([]); setImprovement(""); setMessage(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleRatingSubmit = () => {
    if (rating >= 4) {
      window.open("https://g.page/r/CW9V9yfTp18mEAE/review", "_blank");
      setStep("thanks");
      setTimeout(handleClose, 2000);
    } else {
      setStep("feedback");
    }
  };

  const toggleCategory = (cat: string) => { setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]); };
  const handleFeedbackSubmit = () => {
    fetch("https://primary-production-5fdce.up.railway.app/webhook/luxe-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, categories: selectedCategories, improvement, message }),
    }).catch(() => {});
    setStep("thanks");
    setTimeout(handleClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
      <div className="bg-card rounded-2xl shadow-elevated max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-semibold">
            {step === "rating" && "Rate Your Experience"}
            {step === "feedback" && "We're Sorry to Hear That"}
            {step === "thanks" && "Thank You!"}
          </h3>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        {step === "thanks" && (
          <div className="text-center py-8 animate-fade-in">
            <p className="font-serif text-lg font-semibold text-primary mb-2">Thank you!</p>
            <p className="text-sm text-muted-foreground">{rating >= 4 ? "Redirecting you to Google Reviews..." : "Your feedback has been submitted."}</p>
          </div>
        )}

        {step === "rating" && (
          <div className="animate-fade-in">
            <p className="text-sm text-muted-foreground mb-6">How was your experience with Luxe Shutters?</p>
            <div className="flex gap-1 justify-center mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
                  <Star className={`w-10 h-10 transition-colors ${s <= (hover || rating) ? "text-accent fill-accent" : "text-muted"}`} />
                </button>
              ))}
            </div>
            <Button variant="hero" className="w-full" onClick={handleRatingSubmit} disabled={rating === 0}>{rating === 0 ? "Select a Rating" : "Continue"}</Button>
          </div>
        )}

        {step === "feedback" && (
          <div className="animate-fade-in">
            <p className="text-sm text-muted-foreground mb-6">Help us improve by sharing your feedback.</p>
            <div className="mb-5">
              <label className="text-sm font-medium mb-2 block">What could we improve?</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => toggleCategory(cat)} className={`border rounded-full px-4 py-2 text-sm transition-colors ${selectedCategories.includes(cat) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="mb-5"><label className="text-sm font-medium mb-2 block">How can we do better?</label><Input value={improvement} onChange={(e) => setImprovement(e.target.value)} placeholder="Tell us what we could improve" /></div>
            <div className="mb-6"><label className="text-sm font-medium mb-2 block">Message</label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any additional details..." className="min-h-[100px]" /></div>
            <Button variant="hero" className="w-full" onClick={handleFeedbackSubmit}>Submit Feedback</Button>
            <p className="text-center text-xs text-muted-foreground/60 mt-4">
              Prefer a public review?{" "}
              <a href="https://g.page/r/CW9V9yfTp18mEAE/review" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors">
                Leave one on Google.
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
