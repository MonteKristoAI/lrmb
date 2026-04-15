import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { COMPANY } from "@/data/companyInfo";

const inputCls = cn(
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground",
  "placeholder:text-muted-foreground transition-all",
  "focus:outline-none focus:ring-2 focus:ring-[hsl(175_72%_38%/0.3)] focus:border-[hsl(175_72%_38%)]",
);

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(COMPANY.webhooks.contact, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSuccess(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  const CONTACT_INFO = [
    {
      icon: Phone,
      label: COMPANY.phone,
      href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
    },
    {
      icon: MapPin,
      label: COMPANY.location,
      href: undefined,
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="border-t border-border bg-white bg-warm-gradient bg-texture-dots py-20 lg:py-28"
    >
      <div
        className={cn(
          "container mx-auto reveal",
          isVisible && "visible",
        )}
      >
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left -- info */}
          <div className="flex flex-col">
            <span className="mb-4 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(175_72%_38%)]">
              Get in Touch
            </span>

            <h2 className="font-heading text-3xl font-bold text-foreground leading-tight md:text-4xl lg:text-5xl">
              Let&rsquo;s Talk
            </h2>

            <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
              Book a free 30-minute discovery call and we&rsquo;ll map out
              exactly how AI-powered workflows can remove the bottlenecks
              slowing your business down.
            </p>

            {/* Contact info */}
            <div className="mt-10 flex flex-col gap-4">
              {CONTACT_INFO.map(({ icon: Icon, label, href }) => {
                const content = (
                  <span className="inline-flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(175_72%_38%/0.08)]">
                      <Icon className="h-5 w-5 text-[hsl(175_72%_38%)]" />
                    </span>
                    <span className="text-sm text-foreground/80 sm:text-base">
                      {label}
                    </span>
                  </span>
                );
                return href ? (
                  <a
                    key={label}
                    href={href}
                    className="transition-colors hover:text-foreground"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </div>

            {/* Image */}
            <div className="mt-10 overflow-hidden rounded-2xl shadow-md">
              <img
                src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=600&h=400&fit=crop&q=80"
                alt="Modern workspace with technology"
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right -- form */}
          <div>
            <div className="rounded-2xl border border-border bg-white p-7 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_6px_24px_0_rgb(0_0_0/0.04)]">
              {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(175_72%_38%/0.1)]">
                    <CheckCircle className="h-7 w-7 text-[hsl(175_72%_38%)]" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    Message Sent!
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    We&rsquo;ll get back to you within one business day. Looking
                    forward to connecting.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-foreground/70">
                      Full Name
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      name="name"
                      required
                      placeholder="John Smith"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-company" className="mb-1.5 block text-sm font-medium text-foreground/70">
                      Company
                    </label>
                    <input
                      id="cf-company"
                      type="text"
                      name="company"
                      placeholder="Acme Corp"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium text-foreground/70">
                      Email
                    </label>
                    <input
                      id="cf-email"
                      type="email"
                      name="email"
                      required
                      placeholder="john@acme.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-phone" className="mb-1.5 block text-sm font-medium text-foreground/70">
                      Phone
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-foreground/70">
                      Message
                    </label>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Tell us about your project or challenge..."
                      className={cn(inputCls, "resize-none")}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-heading text-sm font-semibold",
                      "bg-[hsl(175_72%_38%)] text-white transition-all",
                      "hover:bg-[hsl(175_72%_32%)] shadow-[0_2px_8px_hsl(175_72%_38%/0.25)]",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                    We respect your privacy. Your information is only used to
                    respond to your inquiry and is never shared with third
                    parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
