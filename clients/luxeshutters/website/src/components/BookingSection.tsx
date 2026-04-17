import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLINIC } from "@/data/clinicData";
import { MapPin, Phone, Clock, CheckCircle2, ChevronLeft } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const serviceOptions = [
"Shutters",
"Blinds",
"Curtains",
"Zipscreens",
"Awnings",
"Security Roller Shutters",
"General Estimate"];


const urgencyOptions = [
{ label: "Just exploring options", description: "Flexible timeline" },
{ label: "Planning to start soon", description: "Within the next 1–3 months" },
{ label: "Ready to get started", description: "Want to schedule ASAP" }];


// n8n webhook — source of truth in clients/luxeshutters/INTEGRATIONS.md
const QUOTE_WEBHOOK = "https://primary-production-5fdce.up.railway.app/webhook/luxe-quote-generate";

export default function BookingSection() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [urgency, setUrgency] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", address: "", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(QUOTE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, service, urgency }),
      });
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="booking" ref={ref} className="relative py-20 lg:py-28 overflow-hidden bg-background">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-lg mx-auto text-center bg-card rounded-2xl p-10 shadow-elevated animate-scale-in">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Quote request received</h2>
            <p className="text-muted-foreground mb-2"><strong>{form.firstName} {form.lastName}</strong> — {service}</p>
            <p className="text-muted-foreground mb-2">{form.address}, {form.city}</p>
            <p className="text-muted-foreground mb-6">Timeline: {urgency}</p>
            <p className="text-sm text-muted-foreground">We'll contact you within 1 business day to schedule your free consultation.</p>
          </div>
        </div>
      </section>);

  }

  return (
    <section id="booking" ref={ref} className="relative py-20 lg:py-28 overflow-hidden bg-background">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">Start your project</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-sans">Request a free quote</h2>
          <p className="text-muted-foreground leading-relaxed">Tell us about your home, your style preferences, and your timeline — we'll handle the rest.</p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-fade ${isVisible ? "visible" : ""}`}>
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-elevated p-6 md:p-8">
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4].map((s) =>
              <div key={s} className="flex items-center gap-2">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors", step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{s}</div>
                  {s < 4 && <div className={cn("w-8 md:w-16 h-0.5", step > s ? "bg-primary" : "bg-muted")} />}
                </div>
              )}
            </div>

            {step === 1 &&
            <div className="animate-fade-in">
                <h3 className="font-serif text-xl font-semibold mb-4">What are you interested in?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceOptions.map((s) =>
                <button key={s} onClick={() => {setService(s);nextStep();}} className={cn("text-left p-4 rounded-xl border transition-all hover:shadow-soft", service === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                      <span className="font-medium text-foreground">{s}</span>
                    </button>
                )}
                </div>
              </div>
            }

            {step === 2 &&
            <div className="animate-fade-in">
                <button onClick={prevStep} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
                <h3 className="font-serif text-xl font-semibold mb-4">What's your timeline?</h3>
                <div className="grid grid-cols-1 gap-3">
                  {urgencyOptions.map((u) =>
                <button key={u.label} onClick={() => {setUrgency(u.label);nextStep();}} className={cn("text-left p-4 rounded-xl border transition-all hover:shadow-soft", urgency === u.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                      <span className="font-medium text-foreground">{u.label}</span>
                      <p className="text-xs text-muted-foreground mt-1">{u.description}</p>
                    </button>
                )}
                </div>
              </div>
            }

            {step === 3 &&
            <div className="animate-fade-in">
                <button onClick={prevStep} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
                <h3 className="font-serif text-xl font-semibold mb-4">Your location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="sm:col-span-2"><label className="text-sm text-muted-foreground mb-1 block">Street address *</label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="e.g. 12 Main St" /></div>
                  <div className="sm:col-span-2"><label className="text-sm text-muted-foreground mb-1 block">City *</label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Temora" /></div>
                </div>
                {form.address && form.city && <Button variant="hero" className="w-full" onClick={nextStep}>Continue</Button>}
              </div>
            }

            {step === 4 &&
            <div className="animate-fade-in">
                <button onClick={prevStep} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
                <h3 className="font-serif text-xl font-semibold mb-4">Contact details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div><label className="text-sm text-muted-foreground mb-1 block">First name *</label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                  <div><label className="text-sm text-muted-foreground mb-1 block">Last name *</label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                  <div><label className="text-sm text-muted-foreground mb-1 block">Phone *</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div><label className="text-sm text-muted-foreground mb-1 block">Email (optional)</label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div className="bg-muted/50 rounded-xl p-5 mb-6">
                  <h4 className="font-serif font-semibold text-foreground mb-3">Quote request summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Product:</span><span className="text-foreground">{service}</span>
                    <span className="text-muted-foreground">Timeline:</span><span className="text-foreground">{urgency}</span>
                    <span className="text-muted-foreground">Location:</span><span className="text-foreground">{form.address}, {form.city}</span>
                  </div>
                </div>
                <Button variant="hero" size="lg" className="w-full" onClick={handleSubmit} disabled={!form.firstName || !form.lastName || !form.phone || submitting}>{submitting ? "Submitting…" : "Submit quote request"}</Button>
                {errorMsg && (
                  <div role="alert" aria-live="assertive" className="mt-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
                    <p className="font-medium text-destructive mb-1">We couldn't submit your request.</p>
                    <p className="text-muted-foreground mb-2">
                      Please try again, or call us directly at <a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`} className="font-medium text-foreground hover:text-primary transition-colors">{CLINIC.phone}</a> and we'll book your consultation over the phone.
                    </p>
                    <p className="text-xs text-muted-foreground/70">Error: {errorMsg}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center mt-3">We'll contact you within 1 business day to schedule your free consultation.</p>
              </div>
            }
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 h-fit lg:sticky lg:top-28">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-5">Have questions?</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`} className="font-medium text-foreground hover:text-primary transition-colors">{CLINIC.phone}</a>
                  <p className="text-xs text-accent font-medium mt-0.5">Call us during business hours</p>
                </div>
              </div>
              <div><div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><p className="text-sm text-muted-foreground">{CLINIC.address}</p></div></div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground"><p>{CLINIC.hours.weekday}</p><p>{CLINIC.hours.saturday}</p><p>{CLINIC.hours.sunday}</p></div>
              </div>
              <div className="border-t border-border pt-5">
                <h4 className="font-serif font-semibold text-foreground mb-3 text-sm">Service area</h4>
                <p className="text-sm text-muted-foreground mb-2">Regional NSW & surrounding areas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Temora", "Wagga Wagga", "Young", "West Wyalong", "Cootamundra", "Junee", "Griffith", "Cowra"].map((city) =>
                  <span key={city} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{city}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">+ surrounding areas across regional NSW</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}