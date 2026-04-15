# AiiAco — Schema Reference

Every JSON-LD schema block that ships to production. Use this as source of truth for any schema audit or rebuild.

---

## Global schemas (in `client/index.html` shell)

These appear on EVERY page via the static HTML shell. They do NOT need to be re-emitted per page.

### Schema 1: Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://aiiaco.com/#organization",
  "name": "AiiACo",
  "alternateName": ["AiiAco", "AI Integration Authority"],
  "url": "https://aiiaco.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aiia_logo_pure_gold_transparent_8063797a.png",
    "width": 512,
    "height": 512
  },
  "image": "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aiia-og-image-v3_1b0f8ae3.png",
  "description": "AiiACo is the AI Integration Authority for the Corporate Age. We design, deploy, and manage complete AI operational systems for mid-market and enterprise businesses across 20+ industries. Services include enterprise AI integration, workflow automation, AI workforce deployment, and performance-based managed AI infrastructure.",
  "foundingDate": "2025",
  "founder": { "@id": "https://aiiaco.com/#nemr-hallak" },
  "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 15 },
  "areaServed": "Worldwide",
  "knowsAbout": [
    "Enterprise AI Integration",
    "AI Workflow Automation",
    "Managed AI Infrastructure",
    "AI Implementation Services",
    "Operational AI Systems",
    "AI Strategy Consulting",
    "Real Estate AI Automation",
    "Mortgage Industry AI",
    "Management Consulting AI"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "AI Integration Services",
    "itemListElement": [
      { "@type": "Offer", "name": "Strategic Intelligence Blueprint", "description": "Full operational diagnostic and AI integration architecture for enterprise businesses." },
      { "@type": "Offer", "name": "Full AI Integration", "description": "Complete AI operational infrastructure - design, deployment, and managed optimization." },
      { "@type": "Offer", "name": "Performance Partnership", "description": "Performance-based AI integration with success-linked fees tied to measurable outcomes." }
    ]
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Business Inquiry",
    "url": "https://aiiaco.com/upgrade",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.linkedin.com/company/aiiaco",
    "https://www.wikidata.org/wiki/Q138638897",
    "https://www.crunchbase.com/organization/aiiaco"
  ]
}
```

**Key facts**:
- `@name: "AiiACo"` (camelcase K) - schema identity
- `alternateName` includes "AiiAco" (marketing casing) and "AI Integration Authority"
- `foundingDate: "2025"` (matches Wikidata Q138638897)
- `founder @id` references Person schema (below)
- `sameAs` links to LinkedIn, Wikidata, Crunchbase

### Schema 2: WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://aiiaco.com/#website",
  "name": "AiiACo - AI Integration Authority",
  "url": "https://aiiaco.com",
  "description": "AiiACo designs, deploys, and manages complete AI operational systems for businesses that intend to lead. Enterprise AI integration, automation, and performance-based AI consulting across 20+ industries.",
  "publisher": { "@id": "https://aiiaco.com/#organization" }
}
```

### Schema 3: ProfessionalService

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://aiiaco.com/#service",
  "name": "AiiACo Enterprise AI Integration",
  "provider": { "@id": "https://aiiaco.com/#organization" },
  "serviceType": "AI Integration and Implementation Consulting",
  "areaServed": "Worldwide",
  "description": "End-to-end AI integration for mid-market and enterprise businesses. AiiACo designs operational AI systems, deploys AI workforce infrastructure, and manages ongoing AI optimization - all performance-based.",
  "category": "Artificial Intelligence Consulting"
}
```

### Schema 4: Person (Nemr Hallak)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://aiiaco.com/#nemr-hallak",
  "name": "Nemr Hallak",
  "givenName": "Nemr",
  "familyName": "Hallak",
  "jobTitle": "Founder and CEO",
  "description": "Nemr Hallak is the founder and CEO of AiiACo, an AI Systems Architect who designs and deploys operational AI infrastructure for enterprise and mid-market businesses in real estate, mortgage lending, commercial property, and management consulting.",
  "worksFor": { "@id": "https://aiiaco.com/#organization" },
  "url": "https://nemrhallak.com",
  "sameAs": [
    "https://www.linkedin.com/in/nemrhallak",
    "https://nemrhallak.com"
  ],
  "knowsAbout": [
    "Enterprise AI Integration",
    "AI Workflow Automation",
    "AI Revenue Systems",
    "Operational AI Infrastructure",
    "Real Estate AI Automation",
    "Mortgage Industry AI"
  ]
}
```

**Graph integrity**:
- Organization.founder → Person @id
- Person.worksFor → Organization @id
- WebSite.publisher → Organization @id
- ProfessionalService.provider → Organization @id

All four schemas are in the same document (index.html), so @id cross-references resolve correctly.

---

## Page-specific schemas (dispatched by `StructuredDataSSR.tsx`)

These are added on top of the global schemas, per route, via react-helmet-async.

### BreadcrumbList (every non-homepage route)

Generated automatically from URL segments. Example for `/ai-crm-integration`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://aiiaco.com/ai-crm-integration#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://aiiaco.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "AI CRM Integration",
      "item": "https://aiiaco.com/ai-crm-integration"
    }
  ]
}
```

**Title casing rule**: `titleCaseSegment()` function in StructuredDataSSR.tsx splits on `-`, capitalizes each word, and applies UPPER_TOKENS dictionary (`ai → AI`, `crm → CRM`, `ev → EV`, etc.)

### HowTo (only on `/method`)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://aiiaco.com/method#howto",
  "name": "How AiiAco Deploys AI Integration: The 4-Phase Method",
  "description": "AiiAco's operational AI integration method follows four phases to eliminate friction and deploy measurable AI infrastructure across a business.",
  "totalTime": "PT4W",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Find the Friction",
      "text": "Process mapping, bottleneck identification, coordination audit, and data reliability checks across all departments. AiiAco maps how work actually flows through the business, where tasks wait on people, where admins chase updates, and where coordination is consuming margin."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Implement the Fix",
      "text": "Deploy workflow automation, CRM reactivation systems, and outreach automation. Implementation of practical AI systems that eliminate the specific friction points identified in the audit phase."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Measure the Improvement",
      "text": "Build real-time dashboards, establish execution speed metrics, and create revenue visibility reporting. Every module is measured against KPIs defined before implementation begins."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Expand What Works",
      "text": "Cross-department rollout of proven modules, playbook documentation, and team training. Scale the systems that demonstrate measurable results across the entire business."
    }
  ]
}
```

**Note**: Page copy on `/method` and `about.txt` both align with this wording (Phase B+C critic fix).

### FAQPage on `/ai-integration` (4 Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/ai-integration#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is AI integration and how is it different from buying AI tools?",
      "acceptedAnswer": { "@type": "Answer", "text": "AI integration embeds artificial intelligence into business operations as functional infrastructure, not a tool layer. Buying AI tools means subscribing to standalone software like ChatGPT. AI integration establishes an operational layer that handles repeatable decisions, automates complex workflows, surfaces intelligence from data, and scales execution without proportional headcount growth. AiiAco designs, deploys, and manages this operational system on your behalf." }
    },
    {
      "@type": "Question",
      "name": "How long does AI integration take for a mid-size business?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most operational modules are implemented within 2 to 4 weeks. A full AI integration engagement runs 4 to 9 weeks depending on the number of departments, existing system complexity, and integration scope. AiiAco follows a four-phase framework: Diagnostic Architecture, Integration Blueprint, Managed Deployment, and Continuous Optimization." }
    },
    {
      "@type": "Question",
      "name": "How does AI integration work with existing CRM systems?",
      "acceptedAnswer": { "@type": "Answer", "text": "AiiAco integrates AI directly into existing CRM and ERP infrastructure without requiring platform migration. The integration layer sits above existing systems, automating data entry, triggering outreach sequences, surfacing pipeline intelligence, and reactivating dormant contact databases. No replacement of existing software is required in most engagements." }
    },
    {
      "@type": "Question",
      "name": "What is performance-based AI integration?",
      "acceptedAnswer": { "@type": "Answer", "text": "Performance-based AI integration ties AiiAco's compensation directly to measurable client outcomes rather than billable hours or project milestones. Fees are structured against defined KPIs established at the start of each engagement, such as cycle time reduction, conversion rate improvement, or headcount efficiency gains." }
    }
  ]
}
```

### FAQPage on `/ai-automation-for-business` (3 Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/ai-automation-for-business#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI automate business operations?",
      "acceptedAnswer": { "@type": "Answer", "text": "AI automates business operations by replacing manual, repetitive, and decision-based tasks with systems that execute faster and more consistently than human workflows. It handles document processing, lead qualification, customer communication, pipeline tracking, and routine decision-making across revenue and operational functions." }
    },
    {
      "@type": "Question",
      "name": "What operational tasks can AI automate immediately?",
      "acceptedAnswer": { "@type": "Answer", "text": "The fastest-to-deploy AI automations include lead qualification and routing, document extraction from PDFs and images, customer outreach sequences, CRM data entry, pipeline status updates, report generation, and inbox triage. These typically deploy within 2 to 4 weeks per workflow." }
    },
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a mid-market business?",
      "acceptedAnswer": { "@type": "Answer", "text": "Engagement structures vary. AiiAco offers three models: a fixed-fee Strategic Blueprint for diagnostic and architecture, a structured retainer for Full Integration including deployment and managed optimization, and Performance Partnership with reduced upfront cost and milestone-based fees tied to defined outcomes." }
    }
  ]
}
```

### FAQPage on `/ai-crm-integration` (3 Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/ai-crm-integration#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you integrate AI into a CRM?",
      "acceptedAnswer": { "@type": "Answer", "text": "AiiAco integrates AI into a CRM in four steps: map the current workflow, design an AI integration layer that matches specific friction points, deploy the layer via native APIs and webhooks, and manage it on an ongoing basis. The existing CRM is not replaced or migrated. Lead scoring, document extraction, conversational qualification, outbound sequence generation, and predictive pipeline intelligence all run as operational layers on top of Salesforce, HubSpot, Pipedrive, GoHighLevel, or whatever platform the client already uses." }
    },
    {
      "@type": "Question",
      "name": "Which CRMs does AiiAco work with?",
      "acceptedAnswer": { "@type": "Answer", "text": "AiiAco integrates with Salesforce, HubSpot, Pipedrive, GoHighLevel, Follow Up Boss, Zoho CRM, Microsoft Dynamics 365, Close, Copper, Keap, ActiveCampaign, and industry-specific platforms like kvCORE (real estate), Encompass (mortgage), Kantata (consulting). For any platform with a documented API, AiiAco can build a custom integration layer." }
    },
    {
      "@type": "Question",
      "name": "Do we have to migrate off our current CRM?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. AiiAco integrates with the CRM you already use. The AI layer sits above the CRM via APIs and webhooks. Your admins keep their existing workflows, reports, and dashboards. The AI automation runs alongside them, replacing manual coordination work without disrupting day-to-day operations." }
    }
  ]
}
```

### FAQPage on `/ai-workflow-automation` (3 Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/ai-workflow-automation#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI automate business operations?",
      "acceptedAnswer": { "@type": "Answer", "text": "AI automates business operations by replacing manual, repetitive, and decision-based tasks with systems that execute faster and more consistently than human workflows. It handles document processing, lead qualification, customer communication, pipeline tracking, and routine decision-making across revenue and operational functions." }
    },
    {
      "@type": "Question",
      "name": "What operational tasks can AI automate immediately?",
      "acceptedAnswer": { "@type": "Answer", "text": "The fastest-to-deploy automations include lead qualification and routing, document extraction from PDFs and images, customer outreach sequences, CRM data entry, pipeline status updates, report generation, and inbox triage. These typically deploy within 2 to 4 weeks per workflow. Deeper automation across multiple departments takes 8 to 14 weeks." }
    },
    {
      "@type": "Question",
      "name": "What is the difference between AI workflow automation and RPA?",
      "acceptedAnswer": { "@type": "Answer", "text": "RPA automates deterministic, rule-based tasks: clicking buttons, copying data, filling forms. AI workflow automation handles the decision-based and language-based work RPA cannot: reading and classifying documents, drafting communication, qualifying leads by intent, predicting outcomes, and adapting to new patterns." }
    }
  ]
}
```

### FAQPage on `/ai-revenue-engine` (3 Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/ai-revenue-engine#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an AI revenue system?",
      "acceptedAnswer": { "@type": "Answer", "text": "An AI revenue system is a connected set of AI-powered workflows that generate, qualify, nurture, convert, and reactivate pipeline without proportional human effort. It sits across the five revenue functions (lead generation, nurture, pipeline intelligence, dormant database reactivation, and closed-loop attribution) and replaces the manual coordination work that consumes sales and marketing time." }
    },
    {
      "@type": "Question",
      "name": "How much revenue can an AI revenue system generate from a dormant customer database?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most CRMs carry 50 to 80 percent of contacts that have gone cold. A well-architected reactivation layer typically converts 15 to 25 percent of those into re-engaged responders, and a single-digit percentage back into active pipeline. For a brokerage, consultancy, or SaaS company with 10,000 dormant contacts, that translates to 100 to 500 new active opportunities without adding headcount or ad spend." }
    },
    {
      "@type": "Question",
      "name": "How long does AiiAco take to deploy an AI revenue system?",
      "acceptedAnswer": { "@type": "Answer", "text": "The first operational module (usually either inbound lead scoring or dormant database reactivation) ships in 3 to 5 weeks. A full five-component AI revenue system running across lead gen, nurture, pipeline intelligence, reactivation, and attribution takes 8 to 14 weeks depending on CRM complexity, data quality, and the number of channels in use." }
    }
  ]
}
```

### FAQPage on `/ai-for-real-estate` (3 Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/ai-for-real-estate#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI help real estate brokerages?",
      "acceptedAnswer": { "@type": "Answer", "text": "AI for real estate brokerages embeds artificial intelligence into lead qualification, listing content generation, transaction coordination, and agent productivity workflows. It replaces manual follow-up with multi-touch sequences, generates MLS-compliant listing copy in seconds, and surfaces deal intelligence for brokers managing dozens of agents." }
    },
    {
      "@type": "Question",
      "name": "Does AI replace real estate agents?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. AI replaces the coordination and administrative work that consumes agent time: lead qualification, follow-up scheduling, content drafting, reporting, and transaction tracking. Agents keep the judgment work: client relationships, negotiations, showings, deal structuring. Brokerages that deploy AI typically see agent capacity increase 2 to 3 times without hiring." }
    },
    {
      "@type": "Question",
      "name": "Can AI write MLS listings without violating Fair Housing Act rules?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. AiiAco deploys content generation systems with Fair Housing Act language filters and NAR advertising compliance built in. Listing descriptions adhere to protected-class language rules and can be reviewed by compliance officers before publication." }
    }
  ]
}
```

### FAQPage on `/ai-for-vacation-rentals` (3 Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/ai-for-vacation-rentals#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does AI do for a vacation rental operator?",
      "acceptedAnswer": { "@type": "Answer", "text": "AI handles the repeatable coordination work that consumes operator time: guest messaging across every channel, maintenance dispatch to field teams, pricing adjustments based on occupancy signals, review analysis, owner financial reporting, and new unit onboarding. Operators keep the judgment work: owner relationships, guest escalations, strategic pricing calls, and property acquisition." }
    },
    {
      "@type": "Question",
      "name": "Isn't Hostaway, Hospitable, or Jurny already an AI vacation rental platform?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, and AiiAco works with them, not against them. Hostaway, Hospitable, Jurny, RentalReady, and Boom are product platforms that handle specific parts of vacation rental operations. AiiAco is an integration layer that ties those platforms together and adds AI coordination between them." }
    },
    {
      "@type": "Question",
      "name": "How long does AI integration take for a vacation rental operator?",
      "acceptedAnswer": { "@type": "Answer", "text": "A focused guest communication deployment takes 3 to 5 weeks. Full integration across guest comms, maintenance dispatch, pricing, review analysis, and financial reporting runs 6 to 12 weeks depending on unit count and PMS complexity." }
    }
  ]
}
```

### AboutPage on `/manifesto`

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://aiiaco.com/manifesto#webpage",
  "name": "The Corporate Age of AI - AiiACo Manifesto",
  "url": "https://aiiaco.com/manifesto",
  "description": "AiiACo's operating principles for enterprise AI integration: why intelligence is infrastructure, why the window for first-mover advantage is closing, and why execution matters more than strategy.",
  "about": { "@id": "https://aiiaco.com/#organization" },
  "author": { "@id": "https://aiiaco.com/#nemr-hallak" },
  "isPartOf": { "@id": "https://aiiaco.com/#website" }
}
```

---

## Industry microsite schemas (in `IndustryMicrosite.tsx`)

Generated inline per industry in the component. Example for `/industries/real-estate-brokerage`:

### Service schema (per industry)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://aiiaco.com/industries/real-estate-brokerage#service",
  "name": "AI Integration for Real Estate & Brokerage",
  "serviceType": "AI Integration and Implementation Consulting",
  "provider": { "@id": "https://aiiaco.com/#organization" },
  "areaServed": "Worldwide",
  "description": "[industry.directAnswer or industry.description]",
  "url": "https://aiiaco.com/industries/real-estate-brokerage",
  "category": "Artificial Intelligence Consulting"
}
```

### BreadcrumbList (per industry)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://aiiaco.com/industries/real-estate-brokerage#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aiiaco.com/" },
    { "@type": "ListItem", "position": 2, "name": "Industries", "item": "https://aiiaco.com/industries" },
    { "@type": "ListItem", "position": 3, "name": "Real Estate & Brokerage", "item": "https://aiiaco.com/industries/real-estate-brokerage" }
  ]
}
```

### FAQPage (only if `industry.faq` populated)

Dynamically generated from `industry.faq` array:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aiiaco.com/industries/[slug]#faq",
  "mainEntity": [
    /* mapped from industry.faq */
  ]
}
```

---

## Schema graph summary

```
Organization (global, index.html)
├── founder → Person
├── sameAs → [LinkedIn, Wikidata, Crunchbase]
└── hasOfferCatalog → 3 Offer items

WebSite (global, index.html)
└── publisher → Organization

ProfessionalService (global, index.html)
└── provider → Organization

Person (global, index.html)
├── worksFor → Organization
└── sameAs → [LinkedIn personal, nemrhallak.com]

Per-route (from StructuredDataSSR.tsx):
├── BreadcrumbList (every non-homepage route)
├── HowTo (/method)
├── FAQPage (7 pages: /ai-integration, /ai-automation-for-business, 5 new service pages)
└── AboutPage (/manifesto)
    ├── about → Organization
    ├── author → Person
    └── isPartOf → WebSite

Per-industry (from IndustryMicrosite.tsx):
├── Service (provider → Organization)
├── BreadcrumbList
└── FAQPage (only 5 priority industries)
```

## Validation checklist

Before declaring schema work done, run through:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Test each new route
   - Verify: Organization, Person, BreadcrumbList, FAQPage, Service, HowTo, AboutPage all recognized
   - Fix any "missing required property" warnings

2. **Schema.org validator**: https://validator.schema.org/
   - Test homepage (catches global schemas)
   - Test /ai-revenue-engine (catches FAQPage + BreadcrumbList)
   - Test /industries/real-estate-brokerage (catches Service + FAQPage + BreadcrumbList + global)

3. **Manual @id resolution check**:
   ```bash
   # Extract all @id and references across all schemas
   curl -s -A "Googlebot" https://aiiaco.com/ | grep -oE '"@id":\s*"[^"]+"' | sort -u
   ```
   Every @id reference should either be defined in the document OR point to a valid global @id from the shell.

4. **Brand casing check in schemas**:
   ```bash
   curl -s -A "Googlebot" https://aiiaco.com/ | grep -oE '"name":\s*"[^"]+"' | grep -i aiia
   ```
   Should show "AiiACo" in Organization/WebSite/ProfessionalService, "AiiAco" in content descriptions.
