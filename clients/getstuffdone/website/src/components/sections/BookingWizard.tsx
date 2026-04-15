import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Zap,
  Brain,
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  MapPin,
  DollarSign,
  Loader2,
  Check,
} from "lucide-react";
import { COMPANY } from "@/data/companyInfo";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

interface FormData {
  pillar: string;
  companyName: string;
  industry: string;
  companySize: string;
  selectedDate: string;
  selectedTime: string;
  timezone: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  pillar: "",
  companyName: "",
  industry: "",
  companySize: "",
  selectedDate: "",
  selectedTime: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

const PILLARS = [
  {
    id: "digital-foundations",
    label: "Digital Foundations",
    description: "Websites, CRM, outreach & lead gen",
    icon: Zap,
  },
  {
    id: "ai-powered-growth",
    label: "AI Powered Growth",
    description: "Voice AI, analytics & automation",
    icon: Brain,
  },
  {
    id: "secure-scalable-it",
    label: "Secure & Scalable IT",
    description: "Cloud, security & infrastructure",
    icon: Shield,
  },
];

const INDUSTRIES = [
  "Energy",
  "Finance",
  "SaaS",
  "Manufacturing",
  "Consulting",
  "Healthcare",
  "Other",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "200+"];

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

const STEPS = [
  "What can we help with?",
  "About your business",
  "Pick a time",
  "Your details",
];

const SIDEBAR_BULLETS = [
  { icon: Clock, text: "30-min video call" },
  { icon: FileCheck, text: "Custom AI roadmap" },
  { icon: DollarSign, text: "No obligation" },
  { icon: MapPin, text: "Clear pricing" },
];

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ------------------------------------------------------------------ */
/*  Shared input style                                                 */
/* ------------------------------------------------------------------ */

const inputCls = cn(
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground",
  "placeholder:text-muted-foreground transition-all",
  "focus:outline-none focus:ring-2 focus:ring-[hsl(175_72%_38%/0.3)] focus:border-[hsl(175_72%_38%)]",
);

/* ------------------------------------------------------------------ */
/*  Calendar helpers                                                   */
/* ------------------------------------------------------------------ */

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const days: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  // Pad to fill last row
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

function isDateAvailable(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Available if weekday (Mon-Fri) and in the future
  const dow = date.getDay();
  return date > today && dow >= 1 && dow <= 5;
}

function formatDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BookingWizard() {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Calendar state
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return form.pillar !== "";
      case 1:
        return form.companyName.trim() !== "" && form.industry !== "" && form.companySize !== "";
      case 2:
        return form.selectedDate !== "" && form.selectedTime !== "";
      case 3:
        return (
          form.firstName.trim() !== "" &&
          form.lastName.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        );
      default:
        return false;
    }
  }, [step, form]);

  const handleSubmit = async () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    try {
      await fetch(COMPANY.webhooks.booking, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPillar = PILLARS.find((p) => p.id === form.pillar);
  const calendarDays = getCalendarDays(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Steps                                                            */
  /* ---------------------------------------------------------------- */

  const renderStep = () => {
    switch (step) {
      /* Step 1 -- Pillar selection */
      case 0:
        return (
          <div className="grid gap-4 sm:grid-cols-3">
            {PILLARS.map((pillar) => {
              const active = form.pillar === pillar.id;
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => {
                    set("pillar", pillar.id);
                    setTimeout(() => setStep(1), 250);
                  }}
                  className={cn(
                    "group flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all",
                    active
                      ? "border-[hsl(175_72%_38%)] bg-[hsl(175_72%_38%/0.05)] ring-2 ring-[hsl(175_72%_38%/0.3)]"
                      : "border-border bg-white hover:border-[hsl(175_72%_38%/0.4)] hover:bg-[hsl(175_72%_38%/0.02)]",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-[hsl(175_72%_38%/0.1)]"
                        : "bg-[hsl(210_25%_97%)] group-hover:bg-[hsl(175_72%_38%/0.08)]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        active
                          ? "text-[hsl(175_72%_38%)]"
                          : "text-muted-foreground group-hover:text-[hsl(175_72%_38%)]",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "font-heading text-sm font-semibold transition-colors",
                      active ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {pillar.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pillar.description}
                  </span>
                </button>
              );
            })}
          </div>
        );

      /* Step 2 -- Business info */
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="bw-company" className="mb-1.5 block text-sm font-medium text-foreground/70">
                Company Name
              </label>
              <input
                id="bw-company"
                type="text"
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                placeholder="Acme Corp"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="bw-industry" className="mb-1.5 block text-sm font-medium text-foreground/70">
                Industry
              </label>
              <select
                id="bw-industry"
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
                className={cn(inputCls, "appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat")}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239BA4B0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                }}
              >
                <option value="" disabled>
                  Select your industry
                </option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                Company Size
              </label>
              <div className="flex flex-wrap gap-3">
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => set("companySize", size)}
                    className={cn(
                      "rounded-lg border px-5 py-2.5 text-sm font-medium transition-all",
                      form.companySize === size
                        ? "border-[hsl(175_72%_38%)] bg-[hsl(175_72%_38%/0.05)] text-[hsl(175_72%_38%)] ring-2 ring-[hsl(175_72%_38%/0.2)]"
                        : "border-border bg-white text-foreground/60 hover:border-[hsl(175_72%_38%/0.4)] hover:text-foreground/80",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      /* Step 3 -- Calendly-style calendar */
      case 2:
        return (
          <div className="space-y-6">
            {/* Calendar */}
            <div>
              {/* Month header */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-[hsl(210_25%_97%)] hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-heading text-base font-semibold text-foreground">
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-[hsl(210_25%_97%)] hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Day names */}
              <div className="mb-2 grid grid-cols-7 text-center">
                {DAY_NAMES.map((d) => (
                  <span key={d} className="text-xs font-medium text-muted-foreground py-1">
                    {d}
                  </span>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="h-10" />;
                  }
                  const available = isDateAvailable(calYear, calMonth, day);
                  const dateStr = formatDateString(calYear, calMonth, day);
                  const isSelected = form.selectedDate === dateStr;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={!available}
                      onClick={() => set("selectedDate", dateStr)}
                      className={cn(
                        "flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all",
                        isSelected
                          ? "bg-[hsl(175_72%_38%)] text-white shadow-sm"
                          : available
                            ? "text-foreground hover:bg-[hsl(175_72%_38%/0.08)] hover:text-[hsl(175_72%_38%)]"
                            : "text-muted-foreground/40 cursor-not-allowed",
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {form.selectedDate && (
              <div>
                <label className="mb-3 block text-sm font-medium text-foreground/70">
                  Select a time
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => set("selectedTime", time)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        form.selectedTime === time
                          ? "border-[hsl(175_72%_38%)] bg-[hsl(175_72%_38%)] text-white shadow-sm"
                          : "border-border bg-white text-foreground hover:border-[hsl(175_72%_38%/0.5)] hover:text-[hsl(175_72%_38%)]",
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Timezone */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-[hsl(210_25%_97%)] px-4 py-3">
              <Clock className="h-4 w-4 text-[hsl(175_72%_38%)]" />
              <span className="text-sm text-muted-foreground">
                Timezone:{" "}
                <span className="font-medium text-foreground">
                  {form.timezone}
                </span>
              </span>
            </div>
          </div>
        );

      /* Step 4 -- Contact details */
      case 3:
        return (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="bw-first" className="mb-1.5 block text-sm font-medium text-foreground/70">
                  First Name
                </label>
                <input
                  id="bw-first"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Jane"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="bw-last" className="mb-1.5 block text-sm font-medium text-foreground/70">
                  Last Name
                </label>
                <input
                  id="bw-last"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Doe"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="bw-email" className="mb-1.5 block text-sm font-medium text-foreground/70">
                Email <span className="text-[hsl(175_72%_38%)]">*</span>
              </label>
              <input
                id="bw-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="jane@company.com"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="bw-phone" className="mb-1.5 block text-sm font-medium text-foreground/70">
                Phone
              </label>
              <input
                id="bw-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="bw-message" className="mb-1.5 block text-sm font-medium text-foreground/70">
                Message
              </label>
              <textarea
                id="bw-message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Tell us a bit about your project or challenges..."
                rows={3}
                className={cn(inputCls, "resize-none")}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Error state                                                      */
  /* ---------------------------------------------------------------- */

  if (submitError) {
    return (
      <section id="booking" className="bg-[hsl(210_25%_97%)] py-20 lg:py-28">
        <div className="container mx-auto flex flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="text-3xl">!</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Something went wrong</h2>
          <p className="mt-3 max-w-md text-muted-foreground">We couldn't submit your booking. Please try again or call us directly at {COMPANY.phone}.</p>
          <button onClick={() => { setSubmitError(false); }} className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:brightness-110 transition-all">Try Again</button>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Success state                                                    */
  /* ---------------------------------------------------------------- */

  if (submitted) {
    return (
      <section
        id="booking"
        className="bg-[hsl(210_25%_97%)] py-20 lg:py-28"
      >
        <div className="container mx-auto flex flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(175_72%_38%/0.1)]">
            <CheckCircle2 className="h-10 w-10 text-[hsl(175_72%_38%)]" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            You&rsquo;re All Set!
          </h2>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            We&rsquo;ve received your booking request. Maxine or a team member
            will reach out within 24 hours to confirm your discovery call.
          </p>
          <a
            href="#top"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[hsl(175_72%_38%/0.3)] px-6 py-3 font-heading text-sm font-semibold text-[hsl(175_72%_38%)] transition-all hover:border-[hsl(175_72%_38%)] hover:bg-[hsl(175_72%_38%/0.05)]"
          >
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Main render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <section
      id="booking"
      ref={ref}
      className="relative bg-[hsl(210_25%_97%)] bg-texture-grid py-20 lg:py-28"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=1080&fit=crop&q=80" alt="" className="h-full w-full object-cover opacity-[0.025]" />
      </div>
      <div
        className={cn(
          "container mx-auto",
          "reveal",
          isVisible && "visible",
        )}
      >
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-4 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(175_72%_38%)]">
            Get Started
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Book Your Free Discovery Call
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            A 30-minute conversation to understand your challenges, explore
            solutions, and map out a clear path forward -- no strings attached.
          </p>
        </div>

        {/* Grid: form + sidebar */}
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-3">
          {/* ---- Form card (2/3) ---- */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-white p-8 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_6px_24px_0_rgb(0_0_0/0.04)]">
              {/* Step indicator */}
              <div className="mb-10 flex items-center justify-center gap-0">
                {STEPS.map((label, i) => {
                  const isCompleted = i < step;
                  const isCurrent = i === step;
                  return (
                    <div key={label} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => i < step && setStep(i)}
                          disabled={i > step}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                            isCompleted
                              ? "border-[hsl(175_72%_38%)] bg-[hsl(175_72%_38%)] text-white"
                              : isCurrent
                                ? "border-[hsl(175_72%_38%)] bg-[hsl(175_72%_38%/0.08)] text-[hsl(175_72%_38%)]"
                                : "border-border bg-[hsl(210_25%_97%)] text-muted-foreground/50",
                            i < step && "cursor-pointer hover:brightness-95",
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            i + 1
                          )}
                        </button>
                        <span
                          className={cn(
                            "mt-2 hidden text-[11px] sm:block",
                            isCurrent
                              ? "text-[hsl(175_72%_38%)] font-medium"
                              : "text-muted-foreground/50",
                          )}
                        >
                          {label}
                        </span>
                      </div>
                      {/* Connector line */}
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn(
                            "mx-2 h-px w-8 sm:w-14 transition-colors",
                            i < step ? "bg-[hsl(175_72%_38%)]" : "bg-border",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step title */}
              <h3 className="mb-6 font-heading text-xl font-semibold text-foreground">
                {STEPS[step]}
              </h3>

              {/* Dynamic step content */}
              {renderStep()}

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => setStep((s) => s + 1)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-heading text-sm font-semibold transition-all",
                      canContinue
                        ? "bg-[hsl(175_72%_38%)] text-white hover:bg-[hsl(175_72%_32%)] shadow-[0_2px_8px_hsl(175_72%_38%/0.25)]"
                        : "cursor-not-allowed bg-[hsl(210_25%_97%)] text-muted-foreground/40",
                    )}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canContinue || submitting}
                    onClick={handleSubmit}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-heading text-sm font-semibold transition-all",
                      canContinue && !submitting
                        ? "bg-[hsl(175_72%_38%)] text-white hover:bg-[hsl(175_72%_32%)] shadow-[0_2px_8px_hsl(175_72%_38%/0.25)]"
                        : "cursor-not-allowed bg-[hsl(210_25%_97%)] text-muted-foreground/40",
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Book My Call
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ---- Sidebar ---- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h4 className="mb-5 font-heading text-base font-semibold text-foreground">
                What to expect
              </h4>

              <ul className="space-y-3">
                {SIDEBAR_BULLETS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[hsl(175_72%_38%)]" />
                    {text}
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="my-6 h-px bg-border" />

              {/* Selection summary */}
              {(selectedPillar || form.companyName) && (
                <div className="mb-6 space-y-2">
                  <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Your Selections
                  </h5>
                  {selectedPillar && (
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <selectedPillar.icon className="h-3.5 w-3.5 text-[hsl(175_72%_38%)]" />
                      {selectedPillar.label}
                    </div>
                  )}
                  {form.companyName && (
                    <p className="text-sm text-foreground/70">
                      {form.companyName}
                      {form.industry ? ` \u00B7 ${form.industry}` : ""}
                      {form.companySize ? ` \u00B7 ${form.companySize} people` : ""}
                    </p>
                  )}
                  {form.selectedDate && (
                    <p className="text-sm text-foreground/70">
                      {form.selectedDate}
                      {form.selectedTime ? ` \u00B7 ${form.selectedTime}` : ""}
                    </p>
                  )}
                  <div className="my-4 h-px bg-border" />
                </div>
              )}

              {/* Contact */}
              <div className="space-y-2">
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4 text-[hsl(175_72%_38%)]" />
                  {COMPANY.phone}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 text-[hsl(175_72%_38%)]" />
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
