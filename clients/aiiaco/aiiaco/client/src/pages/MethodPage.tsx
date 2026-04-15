/*
 * AiiACo Method Page - /method
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import MethodSection from "@/components/MethodSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";

const methodFaqs = [
  {
    question: "What happens during the Business Intelligence Audit?",
    answer: "The Business Intelligence Audit is a structured diagnostic of your entire operational architecture. AiiACo maps your current workflows, identifies manual decision points and bottlenecks, assesses data readiness for AI (quality, accessibility, structure), quantifies revenue friction from operational inefficiency, and surfaces competitive exposure from AI gaps. The output is a clear picture of where AI integration delivers the highest ROI - before any system is built or deployed.",
  },
  {
    question: "What is a Strategic Architecture blueprint and what does it include?",
    answer: "The Strategic Architecture blueprint is a custom AI integration design document that maps each identified leverage point to a specific AI capability - LLMs for document processing and communication, automation agents for workflow orchestration, predictive models for demand forecasting or risk scoring. It includes: system selection rationale, integration architecture with your existing ERP/CRM/operational platforms, ROI projections per integration, governance framework, implementation timeline, and measurable success criteria.",
  },
  {
    question: "What does 'Future State Simulation' mean in practice?",
    answer: "Before any deployment begins, AiiACo models what your operations will look like after integration. This includes a future-state workflow map showing which processes are automated, which decisions are AI-assisted, and which human roles are freed from repetitive work. You see the expected outcome - throughput increases, cost reductions, cycle time improvements - before committing to full deployment. This eliminates the risk of building systems that don't match operational reality.",
  },
  {
    question: "Do I need to manage vendors, prompts, or AI tools during deployment?",
    answer: "No. AiiACo manages every component of the integration stack - vendor selection and contracting, API integrations, prompt engineering, model configuration, testing, and go-live. You do not interact with AI vendors, manage subscriptions, or troubleshoot integrations. Your team receives the operational output: automated workflows running, reports generated, decisions executed. AiiACo handles the complexity.",
  },
  {
    question: "What does ongoing managed optimization include?",
    answer: "Managed optimization covers: monthly performance reporting against defined KPIs, model retraining as your business data evolves, expansion of the integration footprint as new leverage points emerge, governance reviews to ensure compliance with evolving AI regulations, and proactive identification of new AI capabilities that improve your operational stack. AI integration is not a one-time project - it is infrastructure that requires ongoing management to maintain and compound performance.",
  },
  {
    question: "How is AiiACo's method different from a typical AI consulting engagement?",
    answer: "Traditional AI consulting delivers a strategy document and leaves implementation to your internal team. AiiACo's method is an execution protocol - we run every phase. Phase 01 is our diagnostic, not yours. Phase 04 is our deployment, not a handoff. Phase 05 is our ongoing management, not a maintenance contract you manage. The difference is accountability: AiiACo is responsible for outcomes at every milestone, not just deliverables.",
  },
];

export default function MethodPage() {
  return (
    <>
      <SEO
        title="AI Integration Method | 5-Phase Operational AI Deployment Framework"
        description="AiiACo's 5-phase AI integration method: Business Intelligence Audit, Strategic Architecture, Future State Simulation, Deployment, and Managed Optimization. No guesswork. Measurable outcomes at every milestone."
        path="/method"
        keywords="AI integration method, AI deployment framework, operational AI implementation, AI integration process, AI diagnostics, AI architecture, managed AI optimization, AI ROI, AI integration phases, business intelligence audit"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1" style={{ paddingTop: "80px" }}>
          <MethodSection />
          <FAQSection
            eyebrow="Method Questions"
            headline="How the AiiACo Method Works"
            subheadline="Detailed answers to the questions executives ask before engaging AiiACo."
            items={methodFaqs}
          />
          <RelatedServices current="/method" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
