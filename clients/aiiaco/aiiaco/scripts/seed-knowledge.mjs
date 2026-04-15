/**
 * Seed the knowledge base with initial entries from all uploaded documents.
 * Run: npx tsx scripts/seed-knowledge.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const entries = [
  {
    title: "AiiACo - Company Overview & Philosophy",
    content: `AiiACo is an AI infrastructure firm focused on integrating artificial intelligence directly into the operational and revenue systems that run modern businesses. Instead of offering isolated AI tools or experiments, AiiACo designs structured AI architectures that connect sales, operations, communication, and decision systems into a unified operational layer.

CORE PHILOSOPHY: Most organizations approach AI as a collection of disconnected tools. While these tools can perform impressive individual tasks, they rarely produce a meaningful operational advantage when deployed in isolation. AiiACo approaches AI differently by embedding AI systems inside the workflows that drive revenue and operations.

CORE PRINCIPLE: "We do not sell software. We do not sell strategy decks. We build the operational nervous system that connects your data, your people, and your revenue into a single intelligent layer - then we run it."

The distinction is foundational. Most AI implementations are additive - tools layered on top of existing processes. AiiACo's approach is integrative. We embed AI into the core of how a business operates: how it communicates, how it tracks performance, how it converts pipeline, and how it delivers at scale.

WHAT AiiACo BUILDS:
- AI agents embedded inside CRM and operational workflows
- Automation that connects departments and removes manual friction
- Revenue systems that reactivate dormant customer databases
- AI-assisted outbound prospecting and pipeline generation
- Operational dashboards that provide leadership-level visibility
- Cross-system integrations that allow business systems to communicate in real time

TARGET ORGANIZATIONS: Established operators generating $5M-$100M annually with meaningful revenue but inefficient operational systems. These companies experience friction across CRM usage, departmental coordination, and workflow visibility.

SECTORS: Real Estate & Brokerage, Mortgage & Lending, Commercial Real Estate & Property Management, Management Consulting, Luxury Rental & Hospitality, Service Businesses with Distributed Field Teams.

STRATEGIC VISION: AiiACo is developing a modular AI operating system that integrates sales systems, operational workflows, customer communication, and analytics into a unified infrastructure layer. The companies that deploy this infrastructure first will operate at a structural advantage that compounds every quarter. This is not a competitive edge. It is a new operating standard.`,
    category: "company",
    source: "document",
    sourceFile: "AiiACo_Overview.pdf, aiia-overview-masterpiece.html, aiia-one-pager.html",
  },
  {
    title: "Three Service Pillars - Database Reactivation, AI Revenue Engine, Operational AI",
    content: `Every AiiACo engagement is structured around three interconnected infrastructure pillars. Each pillar is a standalone capability and a component of a larger operational system.

PILLAR 1 - DATABASE REACTIVATION:
Cleaning, structuring, and reactivating dormant CRM databases to generate new conversations from existing assets. Most companies are sitting on years of untapped relationship capital. We import, clean, and segment existing databases, deploy automated "Initial Spark" SMS/Email campaigns, and identify high-intent leads who are ready to re-engage.

PILLAR 2 - AI REVENUE ENGINE:
AI-assisted outbound prospecting infrastructure designed to generate consistent pipeline. Automated qualification, follow-up sequencing, and conversion intelligence built into the revenue workflow. This includes cold email campaigns, AI-powered lead scoring, and automated appointment booking.

PILLAR 3 - OPERATIONAL AI SYSTEMS:
Custom AI integrations embedded within field operations, communications, and reporting. Reduces manual overhead, improves coordination, and creates real-time operational visibility. Includes AI agents for customer communication, automated data flows between systems, and executive dashboards.

HOW THEY CONNECT: The three pillars operate as a unified infrastructure layer. Database Reactivation feeds the Revenue Engine. The Revenue Engine generates pipeline that flows into Operational Systems. Operational Systems create the data that continuously improves both upstream pillars. The system compounds over time.

Each engagement begins with a diagnostic assessment to determine which pillar delivers the highest immediate return, then expands systematically across the full architecture.`,
    category: "company",
    source: "document",
    sourceFile: "aiia-overview-masterpiece.html",
  },
  {
    title: "Agent Package - RE Agents Digital Growth System (Full Details)",
    content: `THE AGENT PACKAGE - "AiiA: The Digital Growth System for High-Performance Agents"

TARGET: Real estate agents (solo or small team, 1-4 people)
TAGLINE: "Beyond the Brochure: A Living Sales Engine"

PROBLEM: Most agents struggle with fragmented tools - website doesn't talk to CRM, database sits dormant, calendar requires constant manual back-and-forth.

SOLUTION: AiiA replaces this chaos with a unified Digital Growth System. Integrates front-end brand with high-powered back-end automation engine (GoHighLevel), turning digital presence into a measurable production line for deals.

THE CORE PILLARS:

1. Custom-Coded High-Conversion Web App (built via Lovable, not generic templates)
   - Segmented Intake: Multi-step qualification flows for Buyers, Sellers, Investors, Commercial leads
   - Trust Architecture: Integrated Google Reviews widgets and social proof
   - Intelligent Chatbot: AI assistant with deep knowledge base (FAQs, neighborhood data, process guides) 24/7

2. Database Reactivation Engine ("The Gold Mine")
   - Mass Reactivation: Automated Email and SMS sequences to spark conversations with old leads
   - Intent Tracking: Identifies who is "raising their hand" and pushes them into CRM as "Warm Lead"
   - Smart Segmentation: Organizing 1,000+ (or 35,000+) contacts into actionable lists

3. GoHighLevel: Central Command
   - Mobile Command: Manage entire business from GHL mobile app
   - Universal Inbox: SMS, Email, and DMs in one unified conversation stream
   - Pipeline Visibility: Visual CRM to track every deal from "New Lead" to "Closed Won"

LEAD-TO-APPOINTMENT WORKFLOW:
   Step 1: Capture & Qualify - leads enter qualification flow capturing intent, budget, urgency
   Step 2: Instant CRM Routing - lead created as Contact + Opportunity, agent notified on phone in seconds
   Step 3: Automated Booking - qualified leads prompted to book consultation, appointment includes full context

OPERATIONAL BENEFITS (Before vs After):
   - Lead Response: Manual/Delayed → Instant/Automated
   - Old Database: Dormant/Forgotten → Active Revenue Source
   - Appointment Setting: 5-10 texts/calls → Zero-touch self-scheduling
   - Business Visibility: Guessing/Spreadsheets → Real-time ROI Reporting
   - Follow-up: Inconsistent → Persistent & Automated

SEARCH ENGINE & TRUST FOUNDATION:
   - On-Site SEO: Structural optimization (H-tags, metadata, clean page architecture)
   - Review Generation: Automated engine that prompts happy clients to leave Google reviews

INVESTMENT & ROLLOUT:
   Performance-Based Partnership: designed to pay for itself. Even one additional deal per month = several hundred percent ROI.
   
   Phased Rollout Plan:
   Phase 1: The Foundation (Days 1-14) - Launch custom website, connect lead-capture forms, configure GHL CRM/pipelines/calendar, set up mobile command center
   Phase 2: The Reactivation Launch (Days 15-30) - Import/clean/segment existing database, deploy "Initial Spark" SMS/Email campaigns, identify high-intent leads
   Phase 3: The Optimization (Ongoing) - Refine automation messaging, expand chatbot knowledge base, review reporting dashboards

   Value-Based Pricing:
   - Implementation Fee: Covers custom build, CRM architecture, database cleaning
   - Monthly Integration Management: Covers hosting, CRM access, ongoing automation support, "Database Reactivation" management

   "AiiA Guarantee": Build for measurable outcomes. See exactly how many leads captured, reactivated, and which deals originated from AiiA engine.`,
    category: "packages",
    source: "document",
    sourceFile: "REAgentsAiiAIntroOffer.pdf",
  },
  {
    title: "Operator Package - RE Operators Intelligence Layer (Full Details)",
    content: `THE OPERATOR PACKAGE - "AiiA: The Intelligence Layer for Real Estate Operations"

TARGET: Real estate operators/property managers (teams of 5+, managing 100+ units)
TAGLINE: "Stop Managing Chaos. Start Scaling Value."

PROBLEM: Most RE Operators don't have a "software" problem - they have a "Data Gap." They have a PMS, CRM, 24/7 staff, yet office is still a hub for manual coordination, missing photos, and "he-said-she-said" maintenance disputes.

SOLUTION: AiiA doesn't ask you to replace your stack. We install an Intelligence Layer on top of it to automate the friction between field staff, tenants, and bottom line.

THE THREE PILLARS OF AN INTELLIGENT ESTATE:

1. The Autonomous Field Bridge
   - Mobile-first interface allows field staff to capture data at the source - no apps to download, no passwords to lose
   - Instant Verification: Every task is geofenced, timestamped, and photo-verified
   - Auto-Sync: Data flows directly into PMS (TravelNet, Yardi, AppFolio) without admin typing a single word

2. Predictive Asset Protection
   - Transition from reactive repairs to predictive maintenance
   - Risk Triage: AI identifies "High-Risk" anomalies before they become $20k insurance claims
   - Vision AI: Automated damage tagging from field photos to categorize wear-and-tear vs. tenant negligence

3. The "Executive Dashboard" (NOI Intelligence)
   - Real-Time EBITDA: See exactly how maintenance spikes are affecting portfolio's performance today
   - Admin Elimination: Target 40-60% reduction in manual coordination tasks

WHY AiiA (THE COMPETITIVE EDGE):
   - "No Rip and Replace": Work with your current tools
   - "Old-School Friendly": If your janitor can send a text, they can use AiiA
   - Montreal/Miami Expertise: Built for luxury condos and high-volume multifamily portfolios

THE 4-WEEK OPERATIONAL SPRINT (RISK-FREE PILOT):
   Week 1: The Audit - Map current "Admin Touches" and identify biggest time-leaks
   Week 2: The Wedge - Deploy mobile interface to 10-20 "Pilot Properties"
   Week 3: The Data Flow - Office receives real-time, verified field data without picking up the phone
   Week 4: The Proof - "Before vs. After" ROI analysis. If we haven't measurably reduced admin time, we walk away.

QUANTIFIABLE IMPACT:
   - Admin Time per Task: 15-20 Minutes → < 2 Minutes
   - Maintenance Proof: Verbal/Text → GPS/Timestamped Photo
   - Data Accuracy: 70-80% (Manual) → 99%+ (Automated)
   - Portfolio Scalability: Hire 1 Admin per 100 Units → Scale 5x without New Staff

PRICING OPTIONS:
   Option A: Portfolio Scalability Model - $2-$5 per door/month (Volume-tiered). Best for 100+ units.
   Option B: Efficiency-Linked Model - Base Subscription + % of Recovered Labor Value. Pay based on Hours Saved.

WHAT'S INCLUDED:
   - Custom Integration Bridge (no manual data entry between field and PMS)
   - Unlimited Field Access (no per-seat fees)
   - Liability Vault (secure, timestamped storage of every photo and work order)
   - Monthly ROI Audit ("Executive Brief" showing hours saved)

THE "AiiA GUARANTEE":
   1. $0 Onboarding Pilot: Set up first 10-20 units at our expense
   2. The Proof Point: If after 30 days we haven't reduced admin coordination by at least 30%, you keep your data and we part ways
   3. The Partnership: Stay because of the ROI, not the contract`,
    category: "packages",
    source: "document",
    sourceFile: "OperatorsAiiAintroOffer.pdf",
  },
  {
    title: "Corporate/Enterprise Package - Full AI Infrastructure (Agent + Operator + Ongoing Management)",
    content: `THE CORPORATE/ENTERPRISE PACKAGE - The Complete AiiA Infrastructure

The Corporate Package is AiiACo's most comprehensive offering. It combines the RE Agent Package and the Operator Package into a single, unified engagement - plus ongoing maintenance and management of key operational areas.

WHAT'S INCLUDED:

1. EVERYTHING FROM THE AGENT PACKAGE:
   - Custom-coded high-conversion web app with multi-step qualification flows
   - Database reactivation engine (automated SMS/Email campaigns)
   - GoHighLevel CRM setup with pipeline visibility and mobile command
   - Lead-to-appointment automation workflow
   - SEO foundation and review generation engine

2. EVERYTHING FROM THE OPERATOR PACKAGE:
   - Autonomous Field Bridge (mobile-first data capture, geofenced verification)
   - Predictive Asset Protection (AI risk triage, Vision AI damage tagging)
   - Executive Dashboard with real-time NOI/EBITDA intelligence
   - PMS integration (TravelNet, Yardi, AppFolio auto-sync)
   - 4-week operational sprint pilot

3. ONGOING MANAGEMENT & MAINTENANCE (Corporate Exclusive):
   - Cold Email Campaign Management: Continuous AI-powered outbound prospecting, list building, and campaign optimization
   - Corporate Image Management: Brand consistency, digital presence maintenance, and reputation monitoring
   - Operational Infrastructure Management: Ongoing monitoring, optimization, and expansion of all AI systems
   - Monthly Strategic Reviews: Executive-level reporting on ROI across all three pillars
   - Priority Support: Dedicated account management and rapid response

WHO IT'S FOR:
   - Established companies ($5M-$100M revenue) that want the full AiiA infrastructure
   - Organizations ready to make AI their operational backbone, not just a tool
   - Companies that want a true partnership - not a one-time project

THE CORPORATE ADVANTAGE:
   - Single point of accountability for all AI infrastructure
   - Systems that compound over time (database feeds revenue engine feeds operations)
   - No need to hire internal AI staff - AiiA IS your AI department
   - Performance-based pricing aligned with measurable outcomes

This is the engagement model for companies that understand: the question is not whether to integrate AI, but how fast and how deeply.`,
    category: "packages",
    source: "manual",
    sourceFile: "Composite: REAgentsAiiAIntroOffer.pdf + OperatorsAiiAintroOffer.pdf + conversation",
  },
  {
    title: "AiiACo Engagement Process & How We Work",
    content: `HOW AiiACo ENGAGES WITH CLIENTS:

INITIAL CONTACT:
   - Prospect speaks with AiiA (our AI voice agent) or fills out the qualification form on aiiaco.com
   - AiiA collects: name, company, email, phone, and understands their pain points
   - A diagnostic report is automatically generated and sent to the AiiACo team

DIAGNOSTIC PHASE:
   - Every engagement begins with a diagnostic assessment
   - We map current systems, identify friction points, and determine which pillar delivers the highest immediate return
   - This is NOT a sales call - it's an operational audit

PILOT/PROOF PHASE:
   - For Agents: 14-day foundation build (website + CRM + automation)
   - For Operators: 4-week operational sprint with 10-20 pilot properties
   - For Corporate: Combined timeline with phased rollout

ONGOING PARTNERSHIP:
   - Monthly ROI audits and executive briefs
   - Continuous optimization of all systems
   - Expansion across additional pillars as value is proven

PRICING PHILOSOPHY:
   - Performance-based: We only win when you win
   - No long-term contracts for Agent/Operator packages - stay because of ROI
   - Corporate packages include ongoing management at a predictable monthly rate
   - Implementation fees cover the initial build; monthly fees cover hosting, CRM access, and ongoing optimization

KEY DIFFERENTIATORS:
   - We don't sell software - we build infrastructure
   - We don't replace your existing tools - we integrate them
   - We don't charge per-user - we charge for value delivered
   - We prove value before asking for commitment (pilots and guarantees)
   - Montreal/Miami expertise in luxury real estate and high-volume operations`,
    category: "processes",
    source: "manual",
    sourceFile: "Composite: all documents",
  },
  {
    title: "Common Questions AiiA Should Be Able to Answer",
    content: `FREQUENTLY ASKED QUESTIONS - AiiA Voice Agent Reference

Q: What does AiiACo do?
A: AiiACo designs, deploys, and manages AI infrastructure directly inside the systems that run modern businesses. We don't sell isolated tools - we build the operational nervous system that connects your data, your people, and your revenue into a single intelligent layer.

Q: What's the difference between AiiACo and other AI companies?
A: Most AI companies sell you a tool. We build infrastructure. The distinction matters because tools sit on top of your processes - infrastructure becomes part of them. We embed AI into how you communicate, track performance, convert pipeline, and deliver at scale.

Q: What industries do you serve?
A: We focus on established operators in Real Estate & Brokerage, Mortgage & Lending, Commercial Real Estate & Property Management, Management Consulting, Luxury Rental & Hospitality, and Service Businesses with distributed field teams. Our sweet spot is companies generating $5M-$100M annually.

Q: How much does it cost?
A: Our pricing is performance-based - we only win when you win. For Agents, there's an implementation fee plus monthly management. For Operators, it's either per-door ($2-$5/month) or efficiency-linked (pay based on hours saved). For Corporate, it's a comprehensive monthly engagement. We always start with a pilot to prove value before asking for commitment.

Q: How long does implementation take?
A: For Agents: 14 days for the foundation, 30 days for full reactivation launch. For Operators: 4-week sprint. For Corporate: phased rollout combining both timelines. We move fast because we've done this before.

Q: Do I need to replace my current software?
A: No. "No Rip and Replace" is a core principle. We integrate with your existing tools - GoHighLevel, TravelNet, Yardi, AppFolio, whatever you're using. We build the glue that connects them.

Q: What's the guarantee?
A: For Operators: If after 30 days we haven't reduced admin coordination by at least 30%, you keep your data and we part ways. For Agents: We build for measurable outcomes - you see exactly how many leads captured and which deals originated from the AiiA engine. For all packages: We prove value before asking for commitment.

Q: Who is JCB/the founder?
A: JCB (Jean-Christophe Bedard) is the founder of AiiACo. He has deep expertise in AI integration, real estate operations, and building systems that scale. Based in Montreal with operations extending to Miami.

Q: Can I see a demo?
A: You're talking to one right now! I'm AiiA, the AI voice agent. But beyond me, we can arrange a full walkthrough of the platform, dashboards, and automation workflows. Just let me get your contact info and we'll set that up.

Q: What if I'm not in real estate?
A: While our current packages are optimized for real estate, the underlying infrastructure - database reactivation, AI revenue engines, and operational AI systems - applies to any established business with operational friction. If you're generating $5M+ and your systems don't talk to each other, we should talk.`,
    category: "faq",
    source: "manual",
    sourceFile: "Composite: all documents + conversation",
  },
];

async function seed() {
  const conn = await mysql.createConnection(DB_URL);
  
  // Check if entries already exist
  const [existing] = await conn.execute("SELECT COUNT(*) as cnt FROM knowledge_base");
  if (existing[0].cnt > 0) {
    console.log(`Knowledge base already has ${existing[0].cnt} entries. Skipping seed.`);
    console.log("To re-seed, first run: DELETE FROM knowledge_base;");
    await conn.end();
    return;
  }

  for (const entry of entries) {
    await conn.execute(
      `INSERT INTO knowledge_base (title, content, category, source, sourceFile, isActive) VALUES (?, ?, ?, ?, ?, 1)`,
      [entry.title, entry.content, entry.category, entry.source, entry.sourceFile]
    );
    console.log(`✓ Created: ${entry.title} (${entry.content.length} chars)`);
  }

  console.log(`\n✅ Seeded ${entries.length} knowledge entries.`);
  console.log("Next: Go to /admin/knowledge and click 'Push to AiiA' to sync with the live agent.");
  await conn.end();
}

seed().catch(err => { console.error("Seed failed:", err); process.exit(1); });
