import { useEffect, useRef, useState } from "react";
import {
  Phone,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Feather,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BUSINESS, SERVICES, type ServiceId } from "@/data/businessData";

/* ─── Types ─── */
type Urgency = "emergency" | "this-week" | "flexible";
type PropertyType = "residential" | "commercial";

interface FormData {
  service: ServiceId | "";
  urgency: Urgency | "";
  street: string;
  city: string;
  propertyType: PropertyType;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
}

const INITIAL: FormData = {
  service: "",
  urgency: "",
  street: "",
  city: "",
  propertyType: "residential",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  notes: "",
};

const STEPS = ["Service Type", "Urgency", "Location", "Contact"];

const urgencyOptions: {
  id: Urgency;
  label: string;
  desc: string;
  Icon: typeof AlertTriangle;
  urgent?: boolean;
}[] = [
  {
    id: "emergency",
    label: "Emergency",
    desc: "Need help right now",
    Icon: AlertTriangle,
    urgent: true,
  },
  {
    id: "this-week",
    label: "This Week",
    desc: "Soon but not urgent",
    Icon: Calendar,
  },
  {
    id: "flexible",
    label: "Flexible / Just Planning",
    desc: "No rush, want a quote",
    Icon: Feather,
  },
];

/* ─── Component ─── */
const BookingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const update = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const canAdvance = (): boolean => {
    if (step === 0) return form.service !== "";
    if (step === 1) return form.urgency !== "";
    if (step === 2) return form.street.trim() !== "" && form.city.trim() !== "";
    if (step === 3)
      return (
        form.firstName.trim() !== "" &&
        form.lastName.trim() !== "" &&
        form.phone.trim() !== ""
      );
    return false;
  };

  const handleSubmit = () => {
    if (!canAdvance()) return;
    setSubmitted(true);
  };

  const reset = () => {
    setForm(INITIAL);
    setStep(0);
    setSubmitted(false);
  };

  /* ─── Render helpers ─── */

  const renderProgress = () => (
    <div className="flex items-center gap-1 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-center">
            <div
              className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                i <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          </div>
          <span
            className={`text-[11px] tracking-wide uppercase font-medium transition-colors duration-300 ${
              i <= step ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );

  const renderStep0 = () => (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-semibold text-foreground">
        What service do you need?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((s) => {
          const active = form.service === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => update("service", s.id)}
              className={`flex items-start gap-4 p-4 rounded-sm border text-left transition-all duration-200 ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40 bg-secondary/30"
              }`}
            >
              <s.Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div>
                <span className="block text-sm font-semibold text-foreground">
                  {s.title}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {s.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-semibold text-foreground">
        How urgent is your request?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {urgencyOptions.map((opt) => {
          const active = form.urgency === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => update("urgency", opt.id)}
              className={`flex flex-col items-center text-center gap-2 p-5 rounded-sm border transition-all duration-200 ${
                active
                  ? opt.urgent
                    ? "border-destructive bg-destructive/10"
                    : "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40 bg-secondary/30"
              }`}
            >
              <opt.Icon
                className={`h-6 w-6 ${
                  active
                    ? opt.urgent
                      ? "text-destructive"
                      : "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  active && opt.urgent
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                {opt.label}
              </span>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Property & Location Details
      </h3>
      <div className="space-y-3">
        <Input
          placeholder="Street address *"
          value={form.street}
          onChange={(e) => update("street", e.target.value)}
          className="bg-secondary/40"
        />
        <Input
          placeholder="City *"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          className="bg-secondary/40"
        />
      </div>
      <div>
        <span className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
          Property Type
        </span>
        <div className="flex gap-2">
          {(["residential", "commercial"] as PropertyType[]).map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => update("propertyType", pt)}
              className={`px-5 py-2 rounded-sm text-sm font-medium capitalize transition-all duration-200 border ${
                form.propertyType === pt
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {pt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Your Contact Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          placeholder="First name *"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          className="bg-secondary/40"
        />
        <Input
          placeholder="Last name *"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          className="bg-secondary/40"
        />
      </div>
      <Input
        placeholder="Phone number *"
        type="tel"
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
        className="bg-secondary/40"
      />
      <Input
        placeholder="Email (optional)"
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        className="bg-secondary/40"
      />
      <Textarea
        placeholder="Anything we should know? (optional)"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        className="bg-secondary/40 min-h-[90px]"
      />
      <p className="text-xs text-muted-foreground">
        We'll only use your details to manage your service request.
      </p>
    </div>
  );

  const renderConfirmation = () => {
    const serviceName =
      SERVICES.find((s) => s.id === form.service)?.title ?? form.service;
    const urgencyName =
      urgencyOptions.find((o) => o.id === form.urgency)?.label ?? form.urgency;

    return (
      <div className="text-center space-y-6 py-6">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          We're on it!
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Your service request has been received. We'll get back to you within{" "}
          <span className="text-foreground font-medium">1 business hour</span>{" "}
          to confirm details.
        </p>

        {/* Summary */}
        <div className="text-left bg-secondary/30 rounded-sm p-5 max-w-md mx-auto space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service</span>
            <span className="text-foreground font-medium">{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Urgency</span>
            <span className="text-foreground font-medium">{urgencyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address</span>
            <span className="text-foreground font-medium text-right">
              {form.street}, {form.city}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="text-foreground font-medium">
              {form.firstName} {form.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="text-foreground font-medium">{form.phone}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            For emergencies, call us now:
          </p>
          <a
            href={BUSINESS.phoneTel}
            className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <Phone className="h-5 w-5" /> {BUSINESS.phone}
          </a>
        </div>

        <Button
          variant="outline"
          onClick={reset}
          className="border-primary/40 text-primary hover:bg-primary/10"
        >
          Submit another request
        </Button>
      </div>
    );
  };

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3];

  /* ─── Sidebar ─── */
  const renderSidebar = () => (
    <aside className="hidden lg:block space-y-8 sticky top-28">
      {/* Phone */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Call Us
        </span>
        <a
          href={BUSINESS.phoneTel}
          className="flex items-center gap-3 text-foreground text-lg font-semibold hover:text-primary transition-colors"
        >
          <Phone className="h-5 w-5 text-primary" />
          {BUSINESS.phone}
        </a>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Address
        </span>
        <p className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
          <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          {BUSINESS.address}
        </p>
      </div>

      {/* Hours */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Business Hours
        </span>
        <div className="space-y-1">
          {BUSINESS.hours.map((h) => (
            <p
              key={h.day}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>
                {h.day}:{" "}
                <span className="text-foreground font-medium">{h.time}</span>
              </span>
            </p>
          ))}
        </div>
      </div>

      {/* Service Areas */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Service Areas
        </span>
        <div className="flex flex-wrap gap-2">
          {BUSINESS.serviceAreas.map((area) => (
            <span
              key={area}
              className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-2">
        {BUSINESS.trustBadges.map((badge) => (
          <p
            key={badge}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <Shield className="h-4 w-4 text-primary" />
            {badge}
          </p>
        ))}
      </div>
    </aside>
  );

  return (
    <section
      ref={sectionRef}
      id="quote"
      className="bg-background py-20 lg:py-28"
      aria-label="Schedule your service"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
            Book a Service
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4">
            Schedule Your <span className="text-primary">Service</span>
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-primary/60" />
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Tell us what you need and we'll take care of the rest — fast
            response guaranteed.
          </p>
        </div>

        {/* Body */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-14 max-w-6xl mx-auto transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Form Card */}
          <div className="bg-card rounded-sm border border-border p-6 md:p-10">
            {submitted ? (
              renderConfirmation()
            ) : (
              <>
                {renderProgress()}
                <div className="min-h-[280px]">{stepRenderers[step]()}</div>
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
                  <Button
                    variant="ghost"
                    onClick={() => setStep((s) => s - 1)}
                    disabled={step === 0}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  {step < 3 ? (
                    <Button
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canAdvance()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                    >
                      Continue <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canAdvance()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                    >
                      Submit Request <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          {renderSidebar()}
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
