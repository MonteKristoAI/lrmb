import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, CheckCircle2, Sparkles, Play, Zap, Bot, BarChart3 } from "lucide-react";

const TRUST_ITEMS = [
  "20+ Years Experience",
  "Fortune 100 Background",
  "Texas-Based",
];

const ROTATING_WORDS = [
  "Scale Your Business",
  "Automate Everything",
  "Replace Busywork",
  "Accelerate Growth",
];

function RotatingText() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span
        className={cn(
          "inline-block text-gradient-teal transition-all duration-[350ms] ease-out",
          isAnimating ? "-translate-y-[110%] opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        {ROTATING_WORDS[index]}
      </span>
    </span>
  );
}

const CAPABILITIES = [
  { icon: Bot, label: "AI Agents", desc: "24/7 intelligent automation" },
  { icon: Zap, label: "Workflow Automation", desc: "Eliminate manual processes" },
  { icon: BarChart3, label: "Smart Analytics", desc: "Data-driven decisions" },
];

export default function HeroSection() {
  const { ref, isVisible } = useScrollAnimation(0.02);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Primary bg image — abstract AI/network visualization */}
        <img
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop&q=80"
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        {/* Strong white overlay from left for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/[0.93] to-white/50 lg:via-white/[0.88] lg:to-white/20" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white" />
        {/* Top fade for header blend */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-6">
        <div className="flex min-h-[92vh] items-center py-28 lg:py-36">
          <div className="max-w-[640px]">
            {/* Badge */}
            <div className={cn("hero-animate hero-delay-1", isVisible && "visible")}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(175_72%_38%/0.2)] bg-white/90 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-[hsl(175_72%_38%)] shadow-sm">
                <Sparkles className="h-4 w-4" />
                AI-Powered Business Solutions
              </span>
            </div>

            {/* Headline */}
            <h1 className={cn("hero-animate hero-delay-2 mt-8", isVisible && "visible")}>
              <span className="block text-[2.75rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-[hsl(220_25%_10%)] sm:text-[3.25rem] lg:text-[3.75rem]">
                We Build AI Systems
              </span>
              <span className="mt-1 block text-[2.75rem] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[3.25rem] lg:text-[3.75rem]">
                That <RotatingText />
              </span>
            </h1>

            {/* Subtitle */}
            <p className={cn(
              "hero-animate hero-delay-3 mt-7 max-w-[520px] text-[1.125rem] leading-[1.7] text-[hsl(215_15%_32%)]",
              isVisible && "visible"
            )}>
              From CRM automation to AI voice agents — we design, build, and
              deploy intelligent systems so SMBs can scale without adding headcount.
            </p>

            {/* CTAs */}
            <div className={cn("hero-animate hero-delay-4 mt-10 flex flex-wrap gap-4", isVisible && "visible")}>
              <a
                href="#booking"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[hsl(175_72%_38%)] px-8 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_4px_14px_hsl(175_72%_38%/0.3)] transition-all duration-300 hover:shadow-[0_8px_25px_hsl(175_72%_38%/0.4)] hover:brightness-110 hover:-translate-y-0.5"
              >
                Book a Free Discovery Call
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="/services"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-[hsl(220_25%_14%/0.12)] bg-white/70 backdrop-blur-sm px-8 py-4 text-[0.9375rem] font-semibold text-[hsl(220_25%_14%)] transition-all duration-300 hover:border-[hsl(175_72%_38%/0.3)] hover:bg-white hover:shadow-md hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 text-[hsl(175_72%_38%)]" />
                See How It Works
              </a>
            </div>

            {/* Capabilities mini cards */}
            <div className={cn("hero-animate hero-delay-5 mt-12 grid grid-cols-3 gap-3", isVisible && "visible")}>
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.label}
                  className="group rounded-xl border border-[hsl(214_20%_90%/0.6)] bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:border-[hsl(175_72%_38%/0.3)] hover:shadow-md hover:-translate-y-0.5"
                >
                  <cap.icon className="h-5 w-5 text-[hsl(175_72%_38%)] mb-2" />
                  <span className="block text-sm font-bold text-[hsl(220_25%_14%)]">{cap.label}</span>
                  <span className="block text-xs text-[hsl(215_15%_46%)] mt-0.5">{cap.desc}</span>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className={cn("hero-animate hero-delay-6 mt-8 flex flex-wrap gap-x-6 gap-y-2", isVisible && "visible")}>
              {TRUST_ITEMS.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-sm text-[hsl(215_15%_40%)]">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(175_72%_38%)]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-t border-[hsl(214_20%_90%/0.5)] bg-white/90 backdrop-blur-md">
        <div className={cn(
          "container mx-auto grid grid-cols-3 divide-x divide-[hsl(214_20%_90%)] px-6 py-8",
          "hero-animate hero-delay-6",
          isVisible && "visible"
        )}>
          {[
            { value: "20+", label: "Years of Experience" },
            { value: "100+", label: "Automations Deployed" },
            { value: "3X", label: "Avg. Productivity Boost" },
          ].map((stat) => (
            <div key={stat.label} className="px-4 text-center sm:px-8">
              <span className="block text-2xl font-extrabold text-[hsl(175_72%_38%)] sm:text-3xl">{stat.value}</span>
              <span className="mt-1 block text-xs font-medium text-[hsl(215_15%_50%)] sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
