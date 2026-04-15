/*
 * AiiACo - How It Works Section
 * 5-step process: Learn → Analyze → Strategize → Implement → Deliver
 */
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const PROCESS_BG = "/images/process-bg.webp";

const steps = [
  {
    number: "01",
    title: "AiiA Learns Your Business",
    desc: "We begin with a deep discovery session. AiiA learns your goals, your history, your past attempts, your competitive landscape, and your industry dynamics. No assumptions. No templates. Pure understanding.",
    detail: "Business goals · Revenue targets · Current tools · Past AI attempts · Competitive analysis · Industry benchmarks",
    color: "#00E5FF",
  },
  {
    number: "02",
    title: "AiiA Analyzes & Strategizes",
    desc: "AiiA synthesizes everything into a clear picture of where AI can create the highest leverage in your business. She identifies the exact opportunities, prioritizes by ROI, and designs your transformation roadmap.",
    detail: "Gap analysis · Opportunity mapping · ROI prioritization · Risk assessment · Technology selection · Timeline planning",
    color: "#C9A227",
  },
  {
    number: "03",
    title: "You See Your Future State",
    desc: "Before a single dollar is spent on implementation, you'll see a vivid, detailed vision of your AI-powered business. You'll feel the certainty of the outcome. You'll know exactly what's achievable - and how.",
    detail: "Custom AI roadmap · Visual transformation plan · Expected outcomes · Success metrics · Investment breakdown",
    color: "#00E5FF",
  },
  {
    number: "04",
    title: "AiiA Hires & Manages Your AI Staff",
    desc: "AiiA assembles your complete AI workforce - the exact tools, agents, and automations your business needs. She configures, integrates, and manages them. You never have to touch a single AI tool.",
    detail: "AI agent selection · Tool integration · Workflow automation · Staff management · Quality control · Performance monitoring",
    color: "#C9A227",
  },
  {
    number: "05",
    title: "Results Delivered. Not Workload.",
    desc: "You receive the outcomes - not the complexity. Ongoing optimization, reporting, and management ensure your AI investment keeps compounding. Performance-based clients only pay more when targets are hit.",
    detail: "Ongoing management · Performance reporting · Continuous optimization · Success-based billing · Scaling support",
    color: "#00E5FF",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start"
    >
      {/* Left content or spacer */}
      {isEven ? (
        <div className="glass rounded-xl p-6 md:p-8 group hover:border-[#00E5FF]/30 transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <span
              className="font-cinzel text-4xl font-bold opacity-30"
              style={{ color: step.color }}
            >
              {step.number}
            </span>
          </div>
          <h3 className="font-cinzel text-xl font-semibold text-white mb-3">{step.title}</h3>
          <p className="font-dm text-[#7A9BB5] text-sm leading-relaxed mb-4">{step.desc}</p>
          <div className="pt-4 border-t border-[#071428]">
            <p className="font-rajdhani text-xs text-[#00E5FF]/60 tracking-wider">{step.detail}</p>
          </div>
        </div>
      ) : (
        <div className="hidden md:block" />
      )}

      {/* Center line + dot */}
      <div className="hidden md:flex flex-col items-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `${step.color}15`,
            border: `2px solid ${step.color}`,
            boxShadow: `0 0 20px ${step.color}40`,
          }}
        >
          <span className="font-cinzel text-sm font-bold" style={{ color: step.color }}>
            {step.number}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div
            className="w-px flex-1 mt-2"
            style={{ background: `linear-gradient(to bottom, ${step.color}40, transparent)`, minHeight: "60px" }}
          />
        )}
      </div>

      {/* Right content or spacer */}
      {!isEven ? (
        <div className="glass rounded-xl p-6 md:p-8 group hover:border-[#C9A227]/30 transition-all duration-300">
          <div className="flex items-start gap-4 mb-4 md:hidden">
            <span
              className="font-cinzel text-4xl font-bold opacity-30"
              style={{ color: step.color }}
            >
              {step.number}
            </span>
          </div>
          <h3 className="font-cinzel text-xl font-semibold text-white mb-3">{step.title}</h3>
          <p className="font-dm text-[#7A9BB5] text-sm leading-relaxed mb-4">{step.desc}</p>
          <div className="pt-4 border-t border-[#071428]">
            <p className="font-rajdhani text-xs text-[#C9A227]/60 tracking-wider">{step.detail}</p>
          </div>
        </div>
      ) : (
        <div className="hidden md:block" />
      )}

      {/* Mobile: show left cards on mobile too */}
      {isEven && (
        <div className="md:hidden glass rounded-xl p-6 group">
          <h3 className="font-cinzel text-xl font-semibold text-white mb-3">{step.title}</h3>
          <p className="font-dm text-[#7A9BB5] text-sm leading-relaxed">{step.desc}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "#020B18" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${PROCESS_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020B18] via-transparent to-[#020B18]" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-[#C9A227]/40" />
            <span className="label-tag-gold">The Process</span>
            <div className="w-12 h-px bg-[#C9A227]/40" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-6">
            How AiiA{" "}
            <span className="gradient-text-gold">Transforms</span>
            <br />
            Your Business
          </h2>
          <p className="font-dm text-lg text-[#7A9BB5] max-w-2xl mx-auto">
            A seamless journey from where you are today to a fully AI-powered business -
            without the complexity, the learning curve, or the management overhead.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
