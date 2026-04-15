import { cn } from "@/lib/utils"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SERVICE_PILLARS, type ServicePillar } from "@/data/services"
import {
  Zap,
  Brain,
  Shield,
  Megaphone,
  Users,
  Mail,
  Bot,
  PhoneCall,
  Smartphone,
  GraduationCap,
  Mic,
  TrendingUp,
  BarChart3,
  Cog,
  Search,
  Workflow,
  Cloud,
  ShieldCheck,
  Server,
  Headphones,
  RefreshCw,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Brain, Shield, Megaphone, Users, Mail, Bot, PhoneCall,
  Smartphone, GraduationCap, Mic, TrendingUp, BarChart3, Cog,
  Search, Workflow, Cloud, ShieldCheck, Server, Headphones, RefreshCw,
}

const PILLAR_IMAGES: Record<string, string> = {
  "digital-foundations":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&q=80",
  "ai-powered-growth":
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=300&fit=crop&q=80",
  "secure-scalable-it":
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=300&fit=crop&q=80",
}

const PILLAR_ALTS: Record<string, string> = {
  "digital-foundations": "Analytics dashboard showing business metrics",
  "ai-powered-growth": "Abstract AI technology visualization",
  "secure-scalable-it": "Modern data center server room",
}

const ICON_BG: Record<ServicePillar["color"], string> = {
  teal: "bg-teal-50",
  gold: "bg-amber-50",
  blue: "bg-blue-50",
}

const ICON_TEXT: Record<ServicePillar["color"], string> = {
  teal: "text-[hsl(175_72%_38%)]",
  gold: "text-[hsl(40_80%_52%)]",
  blue: "text-blue-500",
}

export default function ServicePillars() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section
      id="services"
      ref={ref}
      className={cn("relative overflow-hidden bg-white bg-texture-grid bg-warm-gradient py-20 lg:py-28", "reveal", isVisible && "visible")}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1920&h=1080&fit=crop&q=80" alt="" className="h-full w-full object-cover opacity-[0.03]" />
      </div>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(175_72%_38%)]">
            What We Deliver
          </span>
          <h2 className="text-3xl font-extrabold text-[hsl(220_25%_14%)] md:text-4xl">
            Enterprise-Level Solutions, SMB-Friendly Pricing
          </h2>
          <p className="mt-4 text-[hsl(215_15%_46%)]">
            Three interconnected pillars that cover every stage of your digital
            transformation — from foundational infrastructure to AI-powered
            growth engines.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {SERVICE_PILLARS.map((pillar, i) => {
            const PillarIcon = ICON_MAP[pillar.icon] ?? Zap
            return (
              <div
                key={pillar.id}
                className={cn(
                  "group flex flex-col rounded-2xl border border-[hsl(214_20%_90%)] bg-white p-8 shadow-sm",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(175_72%_38%_/_0.3)] hover:shadow-lg",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Pillar image */}
                {PILLAR_IMAGES[pillar.id] && (
                  <div className="relative h-40 -mx-8 -mt-8 mb-6 rounded-t-2xl overflow-hidden">
                    <img
                      src={PILLAR_IMAGES[pillar.id]}
                      alt={PILLAR_ALTS[pillar.id] ?? pillar.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(175_72%_38%/0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "mb-5 flex h-10 w-10 items-center justify-center rounded-full",
                    ICON_BG[pillar.color],
                  )}
                >
                  <PillarIcon className={cn("h-5 w-5", ICON_TEXT[pillar.color])} />
                </div>

                {/* Title & description */}
                <h3 className="text-xl font-bold text-[hsl(220_25%_14%)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[hsl(215_15%_46%)]">
                  {pillar.description}
                </p>

                {/* Service chips */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {pillar.services.map((service) => (
                    <span
                      key={service.name}
                      className="rounded-full bg-[hsl(214_20%_96%)] px-3 py-1 text-xs text-[hsl(215_15%_46%)]"
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Full-width team image */}
        <div className="mt-14">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=500&fit=crop&q=80"
            alt="Team collaborating in a modern office"
            loading="lazy"
            className="h-[320px] w-full rounded-2xl object-cover lg:h-[400px]"
          />
        </div>
      </div>
    </section>
  )
}
