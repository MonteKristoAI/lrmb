/*
 * AiiACo SEO Configuration
 * Central source of truth for all meta tags, OG, and structured data.
 *
 * Round 4 optimization pass:
 *   - All titles target 50-60 characters (Google SERP truncation limit)
 *   - All descriptions target 140-160 characters (Google SERP truncation limit)
 *   - Primary keyword placed in first 50 characters of every description
 *   - Every title has the brand name and a descriptive modifier
 */

export const SITE = {
  name: "AiiACo",
  domain: "https://aiiaco.com",
  defaultTitle: "AiiACo | Enterprise AI Integration Company",
  defaultDescription:
    "AiiACo is an enterprise AI integration company. We design, deploy, and manage operational AI systems for real estate, mortgage, and consulting firms.",
  ogImage: "https://aiiaco.com/images/og-default.webp",
  twitterHandle: "@aiiaco",
  keywords:
    "AI integration, enterprise AI integration, AI integration company, AI revenue systems, AI CRM integration, AI workflow automation, managed AI integration, operational AI infrastructure, AI workforce, done-for-you AI, performance-based AI, AI for real estate, AI for vacation rentals, AI for property management, AI integration authority",
};

export const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": {
    // 58 chars
    title: "AiiACo | Enterprise AI Integration Company",
    // 157 chars
    description:
      "AiiACo designs, deploys, and manages operational AI systems for enterprise and mid-market firms. Real estate, mortgage, hospitality, consulting.",
  },
  "/manifesto": {
    // 42 chars (intentionally short for brand + concept pairing)
    title: "AiiACo Manifesto | The Corporate Age of AI",
    // 160 chars
    description:
      "AI is no longer a tool. It is infrastructure. Read the AiiACo manifesto on operational AI integration and the next corporate evolution, by Nemr Hallak.",
  },
  "/method": {
    // 53 chars
    title: "AI Integration Method | 4-Phase Framework | AiiACo",
    // 158 chars
    description:
      "AiiACo's 4-phase AI integration method: find friction, implement the fix, measure the improvement, expand what works. A disciplined deployment framework.",
  },
  "/industries": {
    // 58 chars
    title: "AI Integration by Industry | 20 Verticals | AiiACo",
    // 156 chars
    description:
      "AI integration for real estate, mortgage, hospitality, consulting, financial services, and 15 other verticals. Operational AI built for your industry.",
  },
  "/models": {
    // 60 chars
    title: "AiiACo Engagement Models | Blueprint, Managed, Partner",
    // 155 chars
    description:
      "Three ways to work with AiiACo: Strategic Blueprint (diagnostic), Full Integration (managed deployment), Performance Partnership (outcome-aligned).",
  },
  "/case-studies": {
    // 59 chars
    title: "AI Integration Case Studies | AiiACo Outcomes",
    // 157 chars
    description:
      "AiiACo case studies: 66% cycle time reduction, 3x capacity, 75% faster document processing. Measured operational outcomes from real AI integrations.",
  },
  "/results": {
    // 58 chars
    title: "AiiACo AI Integration Results | Engineered Outcomes",
    // 156 chars
    description:
      "Measured outcomes from AiiACo AI integrations: cycle time reduction, capacity increase, automation coverage, operational visibility across 20 industries.",
  },
  "/upgrade": {
    // 49 chars
    title: "Initiate AI Upgrade | AiiACo Engagement Intake",
    // 157 chars
    description:
      "Start your AiiACo AI integration engagement. Submit a structured intake or book a strategy call. Response within 24 hours with a scenario-specific plan.",
  },
  "/privacy": {
    // 48 chars
    title: "Privacy Policy | AiiACo AI Integration Company",
    // 154 chars
    description:
      "AiiACo privacy policy: how we collect, use, store, and protect customer information across our website, engagement services, and AI integration platform.",
  },
  "/terms": {
    // 50 chars
    title: "Terms of Service | AiiACo AI Integration Company",
    // 153 chars
    description:
      "AiiACo terms of service: governance for our website, AI integration engagements, performance partnerships, and platform services. Effective 2025.",
  },
  "/ai-integration": {
    // 51 chars
    title: "AI Integration Services for Enterprise | AiiACo",
    // 159 chars
    description:
      "AI integration embeds AI into business operations as infrastructure, not bolt-on tools. AiiACo designs, deploys, and manages the full integration stack.",
  },
  "/ai-implementation-services": {
    // 54 chars
    title: "AI Implementation Services | Managed Stack | AiiACo",
    // 158 chars
    description:
      "End-to-end AI implementation: diagnostic audit, architecture, deployment, managed optimization. AiiACo runs the full stack. Your team receives outcomes.",
  },
  "/ai-automation-for-business": {
    // 56 chars
    title: "AI Automation for Business at Scale | AiiACo",
    // 159 chars
    description:
      "AI automation replaces repetitive and decision-based tasks with systems that execute faster and more accurately. AiiACo deploys the operational infrastructure.",
  },
  "/ai-governance": {
    // 55 chars
    title: "AI Governance Framework | Compliance & Audit | AiiACo",
    // 158 chars
    description:
      "AI governance framework: policy, compliance, audit trails, exception handling, and oversight. Built into every AiiACo integration from day one, not later.",
  },
  "/ai-crm-integration": {
    // 54 chars
    title: "AI CRM Integration | Salesforce, HubSpot | AiiACo",
    // 160 chars
    description:
      "How to integrate AI into a CRM: lead scoring, document extraction, outbound sequences, pipeline intelligence. Deployed on Salesforce, HubSpot, Pipedrive, GHL.",
  },
  "/ai-workflow-automation": {
    // 52 chars
    title: "AI Workflow Automation | 6 Categories | AiiACo",
    // 159 chars
    description:
      "How AI automates operations: revenue, client, document, financial, workforce, and infrastructure workflows. AiiACo builds the integration layer on your stack.",
  },
  "/ai-revenue-engine": {
    // 56 chars
    title: "AI Revenue Engine | AI Revenue Systems | AiiACo",
    // 158 chars
    description:
      "What is an AI revenue system? Five connected workflows that generate, qualify, nurture, convert, and reactivate pipeline without proportional human effort.",
  },
  "/ai-for-real-estate": {
    // 55 chars
    title: "AI for Real Estate Brokerages & Teams | AiiACo",
    // 160 chars
    description:
      "AI integration for real estate brokerages: lead qualification, MLS listing content, and pipeline AI on Follow Up Boss, kvCORE, BoomTown, Lofty, BoldTrail.",
  },
  "/ai-for-vacation-rentals": {
    // 56 chars
    title: "AI for Vacation Rentals | Scale Without Headcount",
    // 160 chars
    description:
      "AI for vacation rental operators on Hostaway, Guesty, Hospitable. Guest communication, maintenance coordination, review intelligence, owner reporting.",
  },
  "/workplace": {
    // 53 chars
    title: "AiiACo Workplace | AI for Field Service Teams",
    // 159 chars
    description:
      "AI integration for service businesses with field teams: mobile-first workflows, admin reduction, real-time coordination, dormant database reactivation.",
  },
  "/corporate": {
    // 56 chars
    title: "AiiACo Corporate | Enterprise AI Integration Partner",
    // 155 chars
    description:
      "AiiACo is the enterprise AI integration partner for the corporate age. Complete operational AI infrastructure, delivered, managed, and performance-aligned.",
  },
  "/agentpackage": {
    // 55 chars
    title: "Agent Package | AI Tools for Your Team | AiiACo",
    // 157 chars
    description:
      "The AiiACo Agent Package: AI tools configured, deployed, and ready for your team to operate. Done-for-you setup with tracking and ongoing optimization.",
  },
  "/demo": {
    // 55 chars
    title: "Diagnostic Intelligence Demo | Voice AI | AiiACo",
    // 158 chars
    description:
      "See AiiACo Diagnostic Intelligence in action: voice AI agents that live on your site, diagnose visitor needs, automate booking, and route leads in real time.",
  },
  "/talk": {
    // 56 chars
    title: "Talk to AiA | AiiACo Voice AI Consultation",
    // 158 chars
    description:
      "Talk to AiA, the AiiACo voice AI assistant. Get immediate answers about AI integration, engagement models, timelines, and scenarios specific to your business.",
  },
  // Note: /blog is served as a separate static HTML site via Cloudflare
  // Worker proxy at aiiaco.com/blog/* from the aiiaco-blog repo. Its meta
  // tags live in that repo's templates/ directory, not here.
};

/*
 * Industry microsite meta helper.
 * Called by IndustryMicrosite.tsx to build per-industry title/description dynamically.
 */
export function buildIndustryMeta(slug: string, industryName: string): {
  title: string;
  description: string;
} {
  return {
    title: `AI Integration for ${industryName} | AiiACo`,
    description: `Operational AI integration for ${industryName}. AiiACo designs, deploys, and manages AI systems that eliminate friction, automate workflows, and unlock measurable throughput without adding headcount.`,
  };
}
