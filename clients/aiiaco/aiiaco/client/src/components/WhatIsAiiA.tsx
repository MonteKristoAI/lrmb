/*
 * AiiACo - What Is AiiA Section
 * The seductive brand story: not a tool, not a consultant - an AI Director
 */
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AIIA_ICONS = {
  brain: "/images/icon-brain.webp",
  target: "/images/icon-target.webp",
  users: "/images/icon-users.webp",
  efficiency: "/images/icon-efficiency.webp",
  trending: "/images/icon-trending.webp",
  shield: "/images/icon-shield.webp",
};

const pillars = [
  {
    icon: AIIA_ICONS.brain,
    title: "She Learns Your Business",
    desc: "AiA conducts a deep analysis of your goals, your history, your attempts, your competition, and your industry before making a single recommendation.",
    color: "#00E5FF",
  },
  {
    icon: AIIA_ICONS.target,
    title: "She Builds Your Strategy",
    desc: "A complete, custom AI roadmap - not a generic playbook. Every recommendation is calibrated to your specific business reality and growth targets.",
    color: "#C9A227",
  },
  {
    icon: AIIA_ICONS.users,
    title: "She Hires Your AI Staff",
    desc: "Instead of you sourcing, vetting, and managing dozens of AI tools and agents, AiA assembles and manages your entire AI workforce for you.",
    color: "#00E5FF",
  },
  {
    icon: AIIA_ICONS.efficiency,
    title: "She Does the Work",
    desc: "We don't just tell you how - we do it for you. Full implementation, integration, and ongoing management. You get results, not a to-do list.",
    color: "#C9A227",
  },
  {
    icon: AIIA_ICONS.trending,
    title: "Performance-Based Models",
    desc: "Opt for our success-based pricing - reduced upfront cost, and you only pay more when you hit your targets. We win when you win.",
    color: "#00E5FF",
  },
  {
    icon: AIIA_ICONS.shield,
    title: "Powered by AI Acquisition",
    desc: "Built on the AI Acquisition done-for-you package - battle-tested tools, tutorials, and implementation guides from a $24,800 professional program.",
    color: "#C9A227",
  },
];

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass rounded-xl p-6 flex flex-col gap-4 hover:border-[#00E5FF]/30 transition-all duration-300 group"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ background: `${pillar.color}15`, border: `1px solid ${pillar.color}30` }}
      >
        <img
          src={pillar.icon}
          alt={pillar.title}
          className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h3
        className="font-cinzel text-lg font-semibold"
        style={{ color: "#E8F4F8" }}
      >
        {pillar.title}
      </h3>
      <p className="font-dm text-[#7A9BB5] text-sm leading-relaxed">{pillar.desc}</p>
    </motion.div>
  );
}

export default function WhatIsAiiA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="what-is-aiia" className="py-24 md:py-32 bg-[#071428] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #00E5FF 0%, transparent 70%)" }}
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
            <div className="w-12 h-px bg-[#00E5FF]/40" />
            <span className="label-tag">The Difference</span>
            <div className="w-12 h-px bg-[#00E5FF]/40" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-6">
            Not a Tool.{" "}
            <span className="gradient-text-cyan">Not a Consultant.</span>
            <br />
            An AI Director.
          </h2>
          <p className="font-dm text-lg text-[#7A9BB5] max-w-2xl mx-auto leading-relaxed">
            Every other AI solution gives you more complexity to manage. AiA removes it.
            She is the single hire that replaces an entire AI department - and she delivers results,
            not workload.
          </p>
        </motion.div>

        {/* The Big Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden mb-16"
          style={{
            background: "linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(201,162,39,0.05) 100%)",
            border: "1px solid rgba(0,229,255,0.15)",
          }}
        >
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <p className="font-cinzel text-2xl md:text-3xl text-white leading-relaxed">
                  "Instead of hiring AI agents to fill different positions,{" "}
                  <span className="gradient-text-gold">you hire AiA</span> - and she hires and manages
                  all the AI agents for you and delivers the results, not the workload."
                </p>
              </div>
              <div className="flex flex-col gap-4 border-l border-[#00E5FF]/20 pl-8">
                <div className="flex flex-col">
                  <span className="font-cinzel text-3xl font-bold gradient-text-cyan">1 Hire</span>
                  <span className="font-rajdhani text-xs text-[#7A9BB5] tracking-widest uppercase">Replaces an entire AI dept</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-cinzel text-3xl font-bold gradient-text-gold">0 Workload</span>
                  <span className="font-rajdhani text-xs text-[#7A9BB5] tracking-widest uppercase">Added to your plate</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-cinzel text-3xl font-bold text-white">∞ Results</span>
                  <span className="font-rajdhani text-xs text-[#7A9BB5] tracking-widest uppercase">Delivered to your business</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
