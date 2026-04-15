/*
 * AiiACo - Dream State Section
 * The emotional core: help the visitor see their AI-powered future
 * "Your brand has reached its level" - make them feel it
 */
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const visions = [
  {
    before: "Spending hours on tasks AI could do in seconds",
    after: "Your AI staff handles operations while you focus on growth",
  },
  {
    before: "Watching competitors pull ahead with AI you don't understand",
    after: "You're the AI-powered business your competitors are studying",
  },
  {
    before: "Paying for AI tools that sit unused and underperform",
    after: "Every AI investment delivers measurable, tracked results",
  },
  {
    before: "Hiring, training, and managing an ever-growing team",
    after: "AiiA manages your AI staff - you manage your vision",
  },
];

export default function DreamState() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-[#071428] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #00E5FF 0%, transparent 60%)" }}
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
            <span className="label-tag">Your Future State</span>
            <div className="w-12 h-px bg-[#00E5FF]/40" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-6">
            See Your Business
            <br />
            <span className="gradient-text-cyan">After AiiA</span>
          </h2>
          <p className="font-dm text-lg text-[#7A9BB5] max-w-2xl mx-auto">
            AiA doesn't just show you what's possible - she makes you feel it.
            Your brand at its peak. Your goals achieved. Your future, visible now.
          </p>
        </motion.div>

        {/* Before / After grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-16">
          {/* Before column header */}
          <div className="text-center pb-4 border-b border-[#0A1E35]">
            <span className="font-rajdhani text-xs text-[#7A9BB5] tracking-widest uppercase">Before AiiA</span>
          </div>
          <div className="text-center pb-4 border-b border-[#00E5FF]/20">
            <span className="font-rajdhani text-xs text-[#00E5FF] tracking-widest uppercase">After AiiA</span>
          </div>

          {visions.map((v, i) => (
            <motion.div key={`pair-${i}`} className="contents">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-3 py-4 border-b border-[#0A1E35]"
              >
                <div className="w-5 h-5 rounded-full bg-[#7A9BB5]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7A9BB5]/40" />
                </div>
                <p className="font-dm text-sm text-[#7A9BB5]">{v.before}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.1 }}
                className="flex items-start gap-3 py-4 border-b border-[#00E5FF]/10"
                style={{ background: "rgba(0,229,255,0.02)" }}
              >
                <div className="w-5 h-5 rounded-full bg-[#00E5FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                </div>
                <p className="font-dm text-sm text-[#E8F4F8]">{v.after}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* The Big Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="relative rounded-2xl overflow-hidden text-center p-12"
          style={{
            background: "linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(201,162,39,0.08) 50%, rgba(0,229,255,0.05) 100%)",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-[#C9A227] to-transparent" />
          <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-[#C9A227] to-transparent" />

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-px bg-[#C9A227]/40" />
            <div className="w-3 h-3 rounded-full border border-[#C9A227] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
            </div>
            <div className="w-16 h-px bg-[#C9A227]/40" />
          </div>

          <h3 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-4">
            "We are not just the solution.
            <br />
            <span className="gradient-text-gold">We are the turnkey solution</span>
            <br />
            with the done-for-you agent."
          </h3>
          <p className="font-dm text-[#7A9BB5] max-w-xl mx-auto">
            You don't need to learn AI. You don't need to manage AI. You need results.
            AiiA delivers them.
          </p>

          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 px-10 py-4 bg-[#C9A227] hover:bg-[#E8C84A] text-[#020B18] font-rajdhani font-700 text-sm tracking-[0.12em] uppercase rounded-lg transition-all duration-300 glow-gold hover:scale-105 active:scale-95"
          >
            I'm Ready - Hire AiiA
          </button>
        </motion.div>
      </div>
    </section>
  );
}
