/*
 * AiiACo - Team Section
 * The humans behind AiiA: Nemr Hallak & Marylou Castronovo from Volentixlabs
 */
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Globe } from "lucide-react";

const TEAM_BG = "/images/team-bg.webp";

const team = [
  {
    name: "Nemr Hallak",
    role: "Co-Founder & AI Strategy Director",
    bio: "Two decades of cross-industry business development spanning the Middle East, Caribbean, and North America. Nemr has brought technology solutions to presidents, ministers, and Fortune-level enterprises across real estate, fintech, energy, health, and more. He brings the rare combination of deep business intuition and AI implementation expertise.",
    expertise: ["Business Development", "AI Strategy", "Cross-Industry Consulting", "International Markets"],
    avatar: "NH",
    color: "#00E5FF",
  },
  {
    name: "Marylou Castronovo",
    role: "Co-Founder & Operations Director",
    bio: "A seasoned operator with deep experience in building and scaling service businesses. Marylou brings the operational excellence and client relationship mastery that ensures every AiiA engagement delivers on its promise - not just in strategy, but in execution and results.",
    expertise: ["Operations Management", "Client Success", "Service Delivery", "Business Scaling"],
    avatar: "MC",
    color: "#C9A227",
  },
];

function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      className="glass rounded-2xl p-8 flex flex-col gap-6 hover:border-opacity-40 transition-all duration-300"
      style={{ borderColor: `${member.color}20` }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-cinzel font-bold"
          style={{
            background: `linear-gradient(135deg, ${member.color}20 0%, ${member.color}05 100%)`,
            border: `2px solid ${member.color}40`,
            color: member.color,
            boxShadow: `0 0 30px ${member.color}20`,
          }}
        >
          {member.avatar}
        </div>
        <div>
          <h3 className="font-cinzel text-xl font-bold text-white">{member.name}</h3>
          <p className="font-rajdhani text-xs tracking-widest uppercase mt-1" style={{ color: member.color }}>
            {member.role}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="font-dm text-[#7A9BB5] text-sm leading-relaxed">{member.bio}</p>

      {/* Expertise tags */}
      <div className="flex flex-wrap gap-2">
        {member.expertise.map((tag) => (
          <span
            key={tag}
            className="font-rajdhani text-xs px-3 py-1 rounded-full tracking-wider"
            style={{
              background: `${member.color}10`,
              border: `1px solid ${member.color}25`,
              color: member.color,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url(${TEAM_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020B18] via-[#071428]/90 to-[#020B18]" />

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
            <span className="label-tag">The Humans Behind AiiA</span>
            <div className="w-12 h-px bg-[#00E5FF]/40" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-6">
            Built by People Who{" "}
            <span className="gradient-text-cyan">Know Business</span>
          </h2>
          <p className="font-dm text-lg text-[#7A9BB5] max-w-2xl mx-auto">
            AiiA is powered by the team from{" "}
            <a
              href="https://volentixlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00E5FF] hover:text-[#E8C84A] transition-colors inline-flex items-center gap-1"
            >
              Volentixlabs.com
              <ExternalLink size={12} />
            </a>
            {" "}- operators, builders, and strategists who have navigated real business challenges
            across two decades in real estate, mortgage, commercial property, and management consulting.
          </p>
        </motion.div>

        {/* Team cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* Volentixlabs link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="https://volentixlabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 glass rounded-full px-8 py-4 hover:border-[#00E5FF]/30 transition-all duration-300 group"
          >
            <Globe size={16} className="text-[#00E5FF]" />
            <span className="font-dm text-sm text-[#7A9BB5] group-hover:text-[#E8F4F8] transition-colors">
              Learn more about Volentixlabs
            </span>
            <ExternalLink size={14} className="text-[#7A9BB5] group-hover:text-[#00E5FF] transition-colors" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
