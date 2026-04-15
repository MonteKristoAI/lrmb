/*
 * AiiACo - Pricing Section
 * Three models: Strategy Only, Done For You, Performance-Based
 */
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
// AiiA proprietary gold icons replace Lucide icons
const AIIA_ICON_EFFICIENCY = "/images/icon-efficiency.webp";
const AIIA_ICON_TRENDING = "/images/icon-trending.webp";

const plans = [
  {
    name: "AI Strategy",
    tagline: "Know exactly what to do",
    price: "Custom",
    priceNote: "One-time engagement",
    color: "#00E5FF",
    highlight: false,
    features: [
      "Deep business discovery session",
      "Competitive & industry analysis",
      "Custom AI opportunity mapping",
      "Prioritized ROI roadmap",
      "Technology recommendations",
      "Implementation guide",
      "30-day follow-up support",
    ],
    cta: "Get My Strategy",
    desc: "Perfect for businesses that want clarity before committing to full implementation.",
  },
  {
    name: "Done For You",
    tagline: "We implement everything",
    price: "Custom",
    priceNote: "Monthly retainer",
    color: "#C9A227",
    highlight: true,
    features: [
      "Everything in AI Strategy",
      "Full AI tool implementation",
      "AI agent hiring & configuration",
      "Workflow automation build-out",
      "System integrations",
      "Ongoing management & optimization",
      "Monthly performance reporting",
      "Priority support & scaling",
    ],
    cta: "Hire AiiA",
    desc: "The complete solution. AiiA manages your entire AI operation so you can focus on your business.",
  },
  {
    name: "Performance-Based",
    tagline: "We win when you win",
    price: "Reduced Upfront",
    priceNote: "Success-based billing",
    color: "#00E5FF",
    highlight: false,
    features: [
      "Everything in Done For You",
      "Significantly reduced upfront cost",
      "Success-based fee structure",
      "Aligned incentives - we only earn more when you hit targets",
      "Milestone-based payment schedule",
      "Full transparency on metrics",
      "Long-term partnership model",
    ],
    cta: "Explore Performance Model",
    desc: "For businesses that want skin-in-the-game alignment. We share the risk - and the reward.",
  },
];

function PlanCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative rounded-2xl flex flex-col overflow-hidden ${
        plan.highlight
          ? "border-2 border-[#C9A227] shadow-[0_0_40px_rgba(201,162,39,0.2)]"
          : "border border-[#00E5FF]/15"
      }`}
      style={{ background: plan.highlight ? "rgba(201,162,39,0.05)" : "rgba(7,20,40,0.7)" }}
    >
      {/* Popular badge */}
      {plan.highlight && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="bg-[#C9A227] text-[#020B18] px-6 py-1 rounded-b-lg flex items-center gap-2">
            <img src={AIIA_ICON_TRENDING} alt="Most Popular" style={{ width: "14px", height: "14px", objectFit: "contain" }} />
            <span className="font-rajdhani text-xs font-700 tracking-widest uppercase">Most Popular</span>
          </div>
        </div>
      )}

      <div className="p-8 flex flex-col gap-6 flex-1 mt-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src={AIIA_ICON_EFFICIENCY} alt="" style={{ width: "18px", height: "18px", objectFit: "contain" }} />
            <span className="label-tag" style={{ color: plan.color }}>{plan.name}</span>
          </div>
          <h3 className="font-cinzel text-2xl font-bold text-white">{plan.tagline}</h3>
          <p className="font-dm text-sm text-[#7A9BB5] mt-2">{plan.desc}</p>
        </div>

        {/* Price */}
        <div className="py-4 border-y border-[#071428]">
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-bold" style={{ color: plan.color }}>
              {plan.price}
            </span>
          </div>
          <span className="font-rajdhani text-xs text-[#7A9BB5] tracking-wider uppercase">{plan.priceNote}</span>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0" style={{ color: plan.color }}>
                <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-dm text-sm text-[#E8F4F8]/80">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          className={`w-full py-4 rounded-lg font-rajdhani font-600 text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${
            plan.highlight
              ? "bg-[#C9A227] text-[#020B18] hover:bg-[#E8C84A] glow-gold"
              : "border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]"
          }`}
        >
          {plan.cta}
        </button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#020B18] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #C9A227 0%, transparent 70%)" }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-[#C9A227]/40" />
            <span className="label-tag-gold">Investment Models</span>
            <div className="w-12 h-px bg-[#C9A227]/40" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-6">
            Choose How You{" "}
            <span className="gradient-text-gold">Work With AiiA</span>
          </h2>
          <p className="font-dm text-lg text-[#7A9BB5] max-w-2xl mx-auto">
            Every engagement is custom-priced to your business size and scope.
            What never changes: our commitment to delivering results, not just recommendations.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 glass rounded-full px-8 py-4">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <p className="font-dm text-sm text-[#7A9BB5]">
              All engagements begin with a{" "}
              <span className="text-[#E8F4F8]">free discovery call</span>.
              No commitment. No pressure. Just clarity.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
