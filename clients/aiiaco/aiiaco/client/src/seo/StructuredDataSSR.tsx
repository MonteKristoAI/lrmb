/**
 * AiiACo Structured Data - SSR-safe version
 *
 * react-helmet-async v2 SSR: script children must be text nodes, NOT dangerouslySetInnerHTML.
 *
 * IMPORTANT: This component takes pathname as a PROP, not via useLocation(), because
 * during renderToString the wouter Router's memoryLocation hook is only available inside
 * the Router tree - reading useLocation() outside the Router falls back to the browser
 * location hook, which throws on the server. Passing pathname explicitly decouples this
 * component from the wouter Router and makes it safe to render anywhere in the tree.
 *
 * The global Organization, WebSite, ProfessionalService, and Person schemas are defined
 * in the STATIC HTML shell (client/index.html). They are global and identical across
 * every page, so this component only injects PAGE-SPECIFIC schema based on the route:
 * - BreadcrumbList on non-homepage pages
 * - HowTo on /method
 * - FAQPage on pages with FAQ sections (ai-integration, ai-automation-for-business, plus new service pages)
 * - AboutPage on /manifesto
 */
import { Helmet } from "react-helmet-async";

const BASE_URL = "https://aiiaco.com";

// Slug tokens that should be rendered in uppercase/specific casing in breadcrumb labels.
// Extend this list as new routes are added.
const UPPER_TOKENS: Record<string, string> = {
  ai: "AI",
  crm: "CRM",
  ev: "EV",
  b2b: "B2B",
  b2c: "B2C",
  saas: "SaaS",
};

function titleCaseSegment(segment: string): string {
  return segment
    .split("-")
    .map(word => {
      const lower = word.toLowerCase();
      if (UPPER_TOKENS[lower]) return UPPER_TOKENS[lower];
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

type SchemaInput = Record<string, unknown>;

function buildBreadcrumb(pathname: string): SchemaInput | null {
  if (pathname === "/" || pathname === "") return null;
  const segments = pathname.split("/").filter(Boolean);
  const items: Array<Record<string, unknown>> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BASE_URL}/`,
    },
  ];
  let acc = "";
  segments.forEach((segment, idx) => {
    acc += `/${segment}`;
    items.push({
      "@type": "ListItem",
      position: idx + 2,
      name: titleCaseSegment(segment),
      item: `${BASE_URL}${acc}`,
    });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}${pathname}#breadcrumb`,
    itemListElement: items,
  };
}

function buildHowToMethod(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${BASE_URL}/method#howto`,
    name: "How AiiACo Deploys AI Integration: The 4-Phase Method",
    description:
      "AiiACo's operational AI integration method follows four phases to eliminate friction and deploy measurable AI infrastructure across a business.",
    totalTime: "PT4W",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Find the Friction",
        text: "Process mapping, bottleneck identification, coordination audit, and data reliability checks across all departments. AiiACo maps how work actually flows through the business, where tasks wait on people, where admins chase updates, and where coordination is consuming margin.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Implement the Fix",
        text: "Deploy workflow automation, CRM reactivation systems, and outreach automation. Implementation of practical AI systems that eliminate the specific friction points identified in the audit phase.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Measure the Improvement",
        text: "Build real-time dashboards, establish execution speed metrics, and create revenue visibility reporting. Every module is measured against KPIs defined before implementation begins.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Expand What Works",
        text: "Cross-department rollout of proven modules, playbook documentation, and team training. Scale the systems that demonstrate measurable results across the entire business.",
      },
    ],
  };
}

function buildFaqAiIntegration(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-integration#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is AI integration and how is it different from buying AI tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI integration embeds artificial intelligence into business operations as functional infrastructure, not a tool layer. Buying AI tools means subscribing to standalone software like ChatGPT. AI integration establishes an operational layer that handles repeatable decisions, automates complex workflows, surfaces intelligence from data, and scales execution without proportional headcount growth. AiiACo designs, deploys, and manages this operational system on your behalf.",
        },
      },
      {
        "@type": "Question",
        name: "How long does AI integration take for a mid-size business?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most operational modules are implemented within 2 to 4 weeks. A full AI integration engagement runs 4 to 9 weeks depending on the number of departments, existing system complexity, and integration scope. AiiACo follows a four-phase framework: Diagnostic Architecture, Integration Blueprint, Managed Deployment, and Continuous Optimization.",
        },
      },
      {
        "@type": "Question",
        name: "How does AI integration work with existing CRM systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AiiACo integrates AI directly into existing CRM and ERP infrastructure without requiring platform migration. The integration layer sits above existing systems, automating data entry, triggering outreach sequences, surfacing pipeline intelligence, and reactivating dormant contact databases. No replacement of existing software is required in most engagements.",
        },
      },
      {
        "@type": "Question",
        name: "What is performance-based AI integration?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Performance-based AI integration ties AiiACo's compensation directly to measurable client outcomes rather than billable hours or project milestones. Fees are structured against defined KPIs established at the start of each engagement, such as cycle time reduction, conversion rate improvement, or headcount efficiency gains.",
        },
      },
    ],
  };
}

function buildFaqAiCrmIntegration(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-crm-integration#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "How do you integrate AI into a CRM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AiiACo integrates AI into a CRM in four steps: map the current workflow, design an AI integration layer that matches specific friction points, deploy the layer via native APIs and webhooks, and manage it on an ongoing basis. The existing CRM is not replaced or migrated. Lead scoring, document extraction, conversational qualification, outbound sequence generation, and predictive pipeline intelligence all run as operational layers on top of Salesforce, HubSpot, Pipedrive, GoHighLevel, or whatever platform the client already uses.",
        },
      },
      {
        "@type": "Question",
        name: "Which CRMs does AiiACo work with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AiiACo integrates with Salesforce, HubSpot, Pipedrive, GoHighLevel, Follow Up Boss, Zoho CRM, Microsoft Dynamics 365, Close, Copper, Keap, ActiveCampaign, and industry-specific platforms like kvCORE (real estate), Encompass (mortgage), Kantata (consulting). For any platform with a documented API, AiiACo can build a custom integration layer.",
        },
      },
      {
        "@type": "Question",
        name: "Do we have to migrate off our current CRM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. AiiACo integrates with the CRM you already use. The AI layer sits above the CRM via APIs and webhooks. Your admins keep their existing workflows, reports, and dashboards. The AI automation runs alongside them, replacing manual coordination work without disrupting day-to-day operations.",
        },
      },
    ],
  };
}

function buildFaqAiWorkflowAutomation(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-workflow-automation#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "How does AI automate business operations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI automates business operations by replacing manual, repetitive, and decision-based tasks with systems that execute faster and more consistently than human workflows. It handles document processing, lead qualification, customer communication, pipeline tracking, and routine decision-making across revenue and operational functions.",
        },
      },
      {
        "@type": "Question",
        name: "What operational tasks can AI automate immediately?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The fastest-to-deploy automations include lead qualification and routing, document extraction from PDFs and images, customer outreach sequences, CRM data entry, pipeline status updates, report generation, and inbox triage. These typically deploy within 2 to 4 weeks per workflow. Deeper automation across multiple departments takes 8 to 14 weeks.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between AI workflow automation and RPA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RPA automates deterministic, rule-based tasks: clicking buttons, copying data, filling forms. AI workflow automation handles the decision-based and language-based work RPA cannot: reading and classifying documents, drafting communication, qualifying leads by intent, predicting outcomes, and adapting to new patterns.",
        },
      },
    ],
  };
}

function buildFaqAiRevenueEngine(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-revenue-engine#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an AI revenue system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An AI revenue system is a connected set of AI-powered workflows that generate, qualify, nurture, convert, and reactivate pipeline without proportional human effort. It sits across the five revenue functions (lead generation, nurture, pipeline intelligence, dormant database reactivation, and closed-loop attribution) and replaces the manual coordination work that consumes sales and marketing time.",
        },
      },
      {
        "@type": "Question",
        name: "How much revenue can an AI revenue system generate from a dormant customer database?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most CRMs carry 50 to 80 percent of contacts that have gone cold. A well-architected reactivation layer typically converts 15 to 25 percent of those into re-engaged responders, and a single-digit percentage back into active pipeline. For a brokerage, consultancy, or SaaS company with 10,000 dormant contacts, that translates to 100 to 500 new active opportunities without adding headcount or ad spend.",
        },
      },
      {
        "@type": "Question",
        name: "How long does AiiACo take to deploy an AI revenue system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The first operational module (usually either inbound lead scoring or dormant database reactivation) ships in 3 to 5 weeks. A full five-component AI revenue system running across lead gen, nurture, pipeline intelligence, reactivation, and attribution takes 8 to 14 weeks depending on CRM complexity, data quality, and the number of channels in use.",
        },
      },
    ],
  };
}

function buildFaqAiForRealEstate(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-for-real-estate#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "How does AI help real estate brokerages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI for real estate brokerages embeds artificial intelligence into lead qualification, listing content generation, transaction coordination, and agent productivity workflows. It replaces manual follow-up with multi-touch sequences, generates MLS-compliant listing copy in seconds, and surfaces deal intelligence for brokers managing dozens of agents.",
        },
      },
      {
        "@type": "Question",
        name: "Does AI replace real estate agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. AI replaces the coordination and administrative work that consumes agent time: lead qualification, follow-up scheduling, content drafting, reporting, and transaction tracking. Agents keep the judgment work: client relationships, negotiations, showings, deal structuring. Brokerages that deploy AI typically see agent capacity increase 2 to 3 times without hiring.",
        },
      },
      {
        "@type": "Question",
        name: "Can AI write MLS listings without violating Fair Housing Act rules?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. AiiACo deploys content generation systems with Fair Housing Act language filters and NAR advertising compliance built in. Listing descriptions adhere to protected-class language rules and can be reviewed by compliance officers before publication.",
        },
      },
    ],
  };
}

function buildFaqAiForVacationRentals(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-for-vacation-rentals#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What does AI do for a vacation rental operator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI handles the repeatable coordination work that consumes operator time: guest messaging across every channel, maintenance dispatch to field teams, pricing adjustments based on occupancy signals, review analysis, owner financial reporting, and new unit onboarding. Operators keep the judgment work: owner relationships, guest escalations, strategic pricing calls, and property acquisition.",
        },
      },
      {
        "@type": "Question",
        name: "Isn't Hostaway, Hospitable, or Jurny already an AI vacation rental platform?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, and AiiACo works with them, not against them. Hostaway, Hospitable, Jurny, RentalReady, and Boom are product platforms that handle specific parts of vacation rental operations. AiiACo is an integration layer that ties those platforms together and adds AI coordination between them.",
        },
      },
      {
        "@type": "Question",
        name: "How long does AI integration take for a vacation rental operator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A focused guest communication deployment takes 3 to 5 weeks. Full integration across guest comms, maintenance dispatch, pricing, review analysis, and financial reporting runs 6 to 12 weeks depending on unit count and PMS complexity.",
        },
      },
    ],
  };
}

function buildFaqAiImplementation(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-implementation-services#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What does AI implementation actually involve for a business?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI implementation is the process of taking an AI integration design and making it operational inside your business. It includes configuring AI models for your specific data, building API integrations with existing CRM and ERP platforms, setting up data pipelines and automation triggers, testing outputs against accuracy thresholds, and deploying systems into production. AiiACo handles every step so you receive a running system, not a technical specification.",
        },
      },
      {
        "@type": "Question",
        name: "How long does AI implementation take at a mid-market company?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Implementation timelines depend on scope. A single workflow automation typically goes live in 4 to 6 weeks. A multi-system integration across several operational functions typically takes 8 to 16 weeks for initial deployment. AiiACo manages the entire timeline, so internal teams do not need to allocate engineering resources or manage vendor relationships.",
        },
      },
      {
        "@type": "Question",
        name: "Do we need internal engineers to support AI implementation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. AiiACo implementation engagements are designed to be run by the AiiACo team end to end. Internal stakeholders participate in discovery and validation sessions but do not need to write code, build integrations, or manage vendors. The deliverable is a working operational system, not a project your team has to finish.",
        },
      },
      {
        "@type": "Question",
        name: "What platforms does AiiACo implement AI into?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AiiACo implements AI into Salesforce, HubSpot, Pipedrive, GoHighLevel, Microsoft Dynamics 365, Follow Up Boss, kvCORE, BoomTown, Encompass, Yardi, MRI, Kantata, Opera PMS, Hostaway, Guesty, Hospitable, and most major CRM, ERP, PMS, and PSA platforms via documented APIs and webhook infrastructure.",
        },
      },
      {
        "@type": "Question",
        name: "How does AiiACo measure AI implementation success?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every AiiACo implementation is scoped against specific, measurable KPIs defined at engagement kickoff: cycle time reduction, automation coverage percentage, capacity increase without headcount, conversion rate lift, error rate reduction, or revenue impact. Success is evaluated against those KPIs during and after deployment.",
        },
      },
      {
        "@type": "Question",
        name: "What happens after AI implementation ships?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AiiACo offers ongoing managed optimization as part of the Full Integration and Performance Partnership engagement models. This covers monitoring, retraining as business data evolves, expanding the integration to new workflows, compliance updates, and resolving exceptions. Implementation is the start, not the end, of the engagement.",
        },
      },
    ],
  };
}

function buildFaqAiGovernance(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-governance#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is AI governance and why does an enterprise need it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI governance is the framework of policies, controls, audit mechanisms, and oversight processes that keep AI systems accountable, compliant, and aligned with business objectives. Enterprises need AI governance because regulators require it, clients demand it for data handling assurance, and boards need it to manage AI risk. AiiACo builds governance into every integration from day one, not as an afterthought.",
        },
      },
      {
        "@type": "Question",
        name: "Does AiiACo implement the EU AI Act and similar frameworks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. AiiACo classifies every deployed AI component against the EU AI Act risk tiers (minimal, limited, high, unacceptable). For limited and high-risk classifications, we implement required transparency disclosures, technical documentation, human oversight gates, and post-market monitoring. The same approach applies to NIST AI RMF, ISO 42001, and state-level AI regulations.",
        },
      },
      {
        "@type": "Question",
        name: "How are AI decisions audited and logged?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every AiiACo AI decision is logged with input data, model version, output, confidence score, and any human override. Audit trails are retained per client-specific compliance requirements (typically 3 to 7 years). Compliance officers can query any decision and trace it through the full chain of data transformations.",
        },
      },
      {
        "@type": "Question",
        name: "How does AiiACo handle AI bias and fairness concerns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AiiACo runs bias testing on every model before deployment against protected categories relevant to the use case (employment, credit, housing). Models that fail fairness thresholds are retrained, retuned, or replaced. Ongoing monitoring surfaces bias drift. For high-stakes decisions, human review gates remain mandatory regardless of model accuracy.",
        },
      },
      {
        "@type": "Question",
        name: "Who owns the AI policies AiiACo implements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Client companies own their AI policies. AiiACo drafts policy frameworks tailored to the specific regulatory environment, but final policy language and adoption decisions remain with client legal, compliance, and executive stakeholders. AiiACo operates the integration within the approved policy envelope.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if an AI system produces an incorrect output?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AiiACo deploys every AI system with exception handling: confidence thresholds that route low-confidence outputs to human reviewers, escalation paths for out-of-scope requests, rollback mechanisms for deployed changes, and incident response playbooks. Nothing goes to production without a documented path for handling errors.",
        },
      },
    ],
  };
}

function buildHowToCrmIntegration(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${BASE_URL}/ai-crm-integration#howto`,
    name: "How to Integrate AI Into a CRM",
    description:
      "AiiACo's 4-step process for integrating AI into Salesforce, HubSpot, Pipedrive, GoHighLevel, or any major CRM without platform migration.",
    totalTime: "PT6W",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Map the CRM Workflow",
        text: "Audit every touchpoint in the existing CRM: lead capture, qualification, routing, follow-up, status updates, reporting, and handoff. Identify where manual work lives and where AI can remove it without disrupting the existing workflow or agent experience.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Design the Integration Layer",
        text: "Match AI capabilities to the mapped friction points: document extraction for inbound PDFs, conversational AI for qualification, generative content for outbound sequences, predictive scoring for pipeline intelligence. Every capability is scoped with a measurable outcome target.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Deploy Without Platform Migration",
        text: "Connect the AI layer to the existing CRM via native APIs and webhook pipelines. No data export, no platform switch, no disruption. CRM admins keep their existing workflows. The AI automation runs on top.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Manage and Optimize",
        text: "Monitor every AI decision, retrain models as business data evolves, expand the integration as new friction points emerge. CRM integration is operational infrastructure, not a one-time project.",
      },
    ],
  };
}

function buildHowToWorkflowAutomation(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${BASE_URL}/ai-workflow-automation#howto`,
    name: "How AI Automates Operations Across Business Functions",
    description:
      "AiiACo's approach to deploying AI workflow automation across revenue, client, document, financial, workforce, and operational infrastructure categories.",
    totalTime: "PT8W",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Identify Repeatable Work",
        text: "Find the coordination and administrative work that consumes the most human time with the least judgment value. These are the candidates for AI automation: follow-up scheduling, status reporting, data entry, document review, routing decisions.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Build the Integration Layer",
        text: "Connect AI capabilities to existing operational platforms via APIs and webhooks. AiiACo builds on top of the CRMs, ERPs, and PSAs you already run rather than replacing them. The integration sits above the stack and coordinates work automatically.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Deploy With Human Oversight Gates",
        text: "Route every AI decision through confidence thresholds. High-confidence decisions execute automatically. Low-confidence or high-stakes decisions escalate to human reviewers. Over time, thresholds tighten as model accuracy improves against client-specific data.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Measure and Expand",
        text: "Track cycle time, error rate, and throughput per workflow. Expand automation coverage by identifying adjacent workflows that benefit from the same AI infrastructure. Automation compounds: each new workflow benefits from existing data pipelines and model investments.",
      },
    ],
  };
}

function buildArticleCaseStudies(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/case-studies#collection`,
    name: "AiiACo AI Integration Case Studies",
    description:
      "Measured operational outcomes from AiiACo AI integration engagements across real estate, mortgage lending, commercial property, and management consulting.",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#service` },
    author: { "@id": `${BASE_URL}/#nemr-hallak` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Article",
            headline: "Real Estate Lead Operations AI Integration",
            description:
              "3x lead-to-meeting conversion and 70 percent reduction in manual follow-up for a mid-size real estate brokerage operating on Follow Up Boss and kvCORE.",
            author: { "@id": `${BASE_URL}/#nemr-hallak` },
            publisher: { "@id": `${BASE_URL}/#organization` },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Article",
            headline: "Mortgage Origination Cycle Time Reduction",
            description:
              "75 to 85 percent document processing time reduction and 35 to 45 percent clear-to-close acceleration for a regional mortgage lender on Encompass.",
            author: { "@id": `${BASE_URL}/#nemr-hallak` },
            publisher: { "@id": `${BASE_URL}/#organization` },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Article",
            headline: "Commercial Property Management AI Integration",
            description:
              "60 to 70 percent tenant communication overhead reduction and 30 to 40 percent reactive maintenance reduction for a commercial property operator on Yardi.",
            author: { "@id": `${BASE_URL}/#nemr-hallak` },
            publisher: { "@id": `${BASE_URL}/#organization` },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "Article",
            headline: "Management Consulting Proposal Automation",
            description:
              "55 to 65 percent proposal preparation time reduction and 35 to 45 percent project overrun rate reduction for a management consulting firm on Kantata.",
            author: { "@id": `${BASE_URL}/#nemr-hallak` },
            publisher: { "@id": `${BASE_URL}/#organization` },
          },
        },
      ],
    },
  };
}

function buildFaqAiAutomation(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/ai-automation-for-business#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "How does AI automate business operations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI automates business operations by replacing manual, repetitive, and decision-based tasks with systems that execute faster and more consistently than human workflows. It handles document processing, lead qualification, customer communication, pipeline tracking, and routine decision-making across revenue and operational functions.",
        },
      },
      {
        "@type": "Question",
        name: "What operational tasks can AI automate immediately?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The fastest-to-deploy AI automations include lead qualification and routing, document extraction from PDFs and images, customer outreach sequences, CRM data entry, pipeline status updates, report generation, and inbox triage. These typically deploy within 2 to 4 weeks per workflow.",
        },
      },
      {
        "@type": "Question",
        name: "How much does AI automation cost for a mid-market business?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Engagement structures vary. AiiACo offers three models: a fixed-fee Strategic Blueprint for diagnostic and architecture, a structured retainer for Full Integration including deployment and managed optimization, and Performance Partnership with reduced upfront cost and milestone-based fees tied to defined outcomes.",
        },
      },
    ],
  };
}

function buildAboutPageManifesto(): SchemaInput {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE_URL}/manifesto#webpage`,
    name: "The Corporate Age of AI - AiiACo Manifesto",
    url: `${BASE_URL}/manifesto`,
    description:
      "AiiACo's operating principles for enterprise AI integration: why intelligence is infrastructure, why the window for first-mover advantage is closing, and why execution matters more than strategy.",
    about: { "@id": `${BASE_URL}/#organization` },
    author: { "@id": `${BASE_URL}/#nemr-hallak` },
    isPartOf: { "@id": `${BASE_URL}/#website` },
  };
}

type StructuredDataSSRProps = {
  pathname: string;
};

export default function StructuredDataSSR({ pathname }: StructuredDataSSRProps) {
  // Normalize: strip trailing slash except for root
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  const schemas: SchemaInput[] = [];

  const breadcrumb = buildBreadcrumb(normalized);
  if (breadcrumb) schemas.push(breadcrumb);

  if (normalized === "/method") {
    schemas.push(buildHowToMethod());
  }

  if (normalized === "/ai-integration") {
    schemas.push(buildFaqAiIntegration());
  }

  if (normalized === "/ai-implementation-services") {
    schemas.push(buildFaqAiImplementation());
  }

  if (normalized === "/ai-governance") {
    schemas.push(buildFaqAiGovernance());
  }

  if (normalized === "/ai-automation-for-business") {
    schemas.push(buildFaqAiAutomation());
  }

  if (normalized === "/ai-crm-integration") {
    schemas.push(buildFaqAiCrmIntegration());
    schemas.push(buildHowToCrmIntegration());
  }

  if (normalized === "/ai-workflow-automation") {
    schemas.push(buildFaqAiWorkflowAutomation());
    schemas.push(buildHowToWorkflowAutomation());
  }

  if (normalized === "/case-studies") {
    schemas.push(buildArticleCaseStudies());
  }

  if (normalized === "/ai-revenue-engine") {
    schemas.push(buildFaqAiRevenueEngine());
  }

  if (normalized === "/ai-for-real-estate") {
    schemas.push(buildFaqAiForRealEstate());
  }

  if (normalized === "/ai-for-vacation-rentals") {
    schemas.push(buildFaqAiForVacationRentals());
  }

  if (normalized === "/manifesto") {
    schemas.push(buildAboutPageManifesto());
  }

  if (schemas.length === 0) return null;

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
