export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  metrics: { label: string; value: string }[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "erp-unified-crm",
    title: "Automated Workflows with ERP Unified CRM",
    category: "Workflow Automation",
    description: "This shift moved the team from administrative firefighting to high-value client strategy and brand growth. By unifying ERP and CRM systems, we eliminated data silos and created a single source of truth for all client interactions.",
    metrics: [
      { label: "Admin Time Saved", value: "75%" },
      { label: "Lead Response Time", value: "< 2min" },
      { label: "Revenue Increase", value: "40%" },
    ],
  },
  {
    id: "crm-productivity",
    title: "3X More Productive with CRM",
    category: "CRM Implementation",
    description: "For this financial consultancy, automating the financial compliance reminders, deadline tracking dashboard and CRM integration replaced slow, error-prone manual processes — freeing leaders to focus on clients, not admin work.",
    metrics: [
      { label: "Productivity Gain", value: "3X" },
      { label: "Manual Errors Reduced", value: "92%" },
      { label: "Client Retention", value: "+35%" },
    ],
  },
  {
    id: "procurement-efficiency",
    title: "Transforming Procurement Efficiency",
    category: "Process Automation",
    description: "Delivering a 40% reduction in administrative procurement workload and a 50% acceleration in scheduling through intelligent automation and connected systems.",
    metrics: [
      { label: "Admin Workload Cut", value: "40%" },
      { label: "Scheduling Speed", value: "2X" },
      { label: "Cost Savings", value: "$180K/yr" },
    ],
  },
];
