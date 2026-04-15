/*
 * AiiACo Case Studies - Focused Niche: Real Estate, Mortgage, CRE, Management Consulting
 * Anonymized, verifiable in structure. No client names. No theatre.
 */

export type CaseMetric = {
  label: string;
  value: string;
  note?: string;
};

export type CaseStudy = {
  id: string;
  sector: string;
  type: string;
  situation: string;
  constraints: string[];
  approach: string[];
  systemsDeployed: string[];
  outcomes: CaseMetric[];
  timeline: string;
  governance: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "realestate-lead-ops",
    sector: "Real Estate",
    type: "Brokerage",
    situation:
      "Lead response times were inconsistent, follow-up sequences were manual, and pipeline visibility was fragmented across agents.",
    constraints: ["CRM integration required", "Agent adoption risk", "Compliance with disclosure rules"],
    approach: [
      "Mapped lead lifecycle from inquiry to close",
      "Automated qualification and routing logic",
      "Built structured follow-up sequences with override controls",
    ],
    systemsDeployed: [
      "Lead qualification automation",
      "CRM workflow integration",
      "Automated follow-up sequences",
      "Pipeline reporting dashboard",
    ],
    outcomes: [
      { label: "Lead response time", value: "< 5 min (from avg. 4+ hours)" },
      { label: "Follow-up consistency", value: "100% structured sequence coverage" },
      { label: "Pipeline visibility", value: "Unified dashboard with stage-level KPIs" },
    ],
    timeline: "3-6 weeks",
    governance: ["Agent override controls", "Compliance review gates", "Activity logging"],
  },
  {
    id: "mortgage-origination",
    sector: "Mortgage & Lending",
    type: "Regional lender",
    situation:
      "A regional mortgage lender was losing closings to faster competitors due to document-heavy underwriting queues and inconsistent borrower communication.",
    constraints: [
      "RESPA and TRID compliance requirements",
      "Legacy LOS integration",
      "Loan officer adoption risk",
    ],
    approach: [
      "Mapped full origination lifecycle from application to CTC",
      "Automated document extraction and validation for income, asset, and identity files",
      "Built borrower status update sequences triggered by pipeline milestones",
      "Implemented pre-underwriting compliance flag logic",
    ],
    systemsDeployed: [
      "AI document extraction and validation layer",
      "Automated borrower communication sequences",
      "Pre-underwriting compliance monitoring",
      "Pipeline velocity dashboard",
    ],
    outcomes: [
      { label: "Document processing time", value: "Reduced 75-85%", note: "Across income, asset, and identity document types" },
      { label: "Borrower inbound call volume", value: "Reduced 50-60%" },
      { label: "Clear-to-close timeline", value: "Reduced 35-45%" },
    ],
    timeline: "6-9 weeks",
    governance: ["RESPA/TRID compliance gates", "Human review on exception files", "Audit trail on all automated decisions"],
  },
  {
    id: "cre-portfolio-ops",
    sector: "Commercial Real Estate",
    type: "Property management group",
    situation:
      "A commercial property management group was managing 200+ leases manually - critical dates were missed, tenant communication was reactive, and maintenance was entirely unplanned.",
    constraints: [
      "Multiple property management systems",
      "Tenant data privacy requirements",
      "Maintenance contractor coordination",
    ],
    approach: [
      "Mapped tenant lifecycle from onboarding to renewal",
      "Built lease critical date monitoring and automated alert logic",
      "Deployed tenant communication sequences for maintenance, renewals, and escalations",
      "Implemented predictive maintenance scheduling from historical work order data",
    ],
    systemsDeployed: [
      "Lease administration intelligence layer",
      "Tenant communication automation",
      "Predictive maintenance scheduling",
      "Portfolio performance dashboard",
    ],
    outcomes: [
      { label: "Missed lease critical dates", value: "Reduced to zero" },
      { label: "Tenant communication overhead", value: "Reduced 60-70%" },
      { label: "Reactive maintenance work orders", value: "Reduced 30-40%" },
    ],
    timeline: "5-8 weeks",
    governance: ["Tenant data access controls", "Contractor coordination review gates", "Lease change audit trail"],
  },
  {
    id: "consulting-delivery-ops",
    sector: "Management Consulting",
    type: "Mid-market consulting firm",
    situation:
      "A management consulting firm was losing margin on every engagement due to proposal overhead, inconsistent project monitoring, and institutional knowledge locked in individual consultants.",
    constraints: [
      "Client confidentiality requirements",
      "Variable engagement formats",
      "Consultant adoption risk",
    ],
    approach: [
      "Audited consultant time allocation across proposal, delivery, and admin tasks",
      "Built AI-assisted proposal and SOW generation from engagement briefs",
      "Deployed project health monitoring from communication and milestone data",
      "Implemented AI-powered knowledge base from past engagement materials",
    ],
    systemsDeployed: [
      "Proposal and SOW generation automation",
      "Project risk monitoring system",
      "Knowledge base intelligence layer",
      "Account expansion signal detection",
    ],
    outcomes: [
      { label: "Proposal preparation time", value: "Reduced 55-65%" },
      { label: "Project overrun rate", value: "Reduced 35-45%" },
      { label: "Knowledge retrieval time", value: "Reduced from days to minutes" },
    ],
    timeline: "4-7 weeks",
    governance: ["Client confidentiality controls", "Consultant review gate on all outputs", "Knowledge base access tiers"],
  },
];
