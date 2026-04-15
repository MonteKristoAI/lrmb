import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { CASE_STUDIES } from "@/data/caseStudies";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=500&fit=crop&q=80",
];

const IMAGE_ALTS = [
  "Analytics dashboard showing ERP and CRM data integration",
  "Team collaborating around a table with CRM productivity tools",
  "Business professional reviewing procurement documents and analytics",
];

const EXPANDED = [
  {
    description:
      "A fast-growing property management firm was drowning in disconnected systems — their ERP handled financials while a separate CRM tracked client relationships, leaving staff toggling between platforms and manually reconciling data. Leads slipped through cracks, response times ballooned, and leadership had zero visibility into the full client lifecycle. They needed a unified solution before growth outpaced their ability to serve clients.",
    challenge:
      "The company relied on three separate platforms for lead tracking, invoicing, and project management. Sales reps spent over 60% of their time on admin — copying data between systems, chasing down status updates, and manually generating reports. Lead response times averaged 48 hours, and the lack of a single customer view meant upsell opportunities were consistently missed.",
    solution:
      "We unified their ERP and CRM into a single connected platform with automated data flows between every department. Custom workflow automations handled lead assignment, follow-up sequences, invoice generation, and reporting — all triggered by real-time events rather than manual input. A centralized dashboard gave leadership instant visibility into pipeline health, revenue forecasts, and team performance.",
    results: CASE_STUDIES[0].metrics,
  },
  {
    description:
      "A mid-sized financial consultancy was losing competitive ground because their advisors spent more time wrestling with spreadsheets and compliance checklists than actually advising clients. Their legacy CRM was a glorified contact list — no automation, no reminders, no integration with their compliance calendar. Client retention was slipping as service quality suffered under the weight of manual processes.",
    challenge:
      "Financial advisors were manually tracking compliance deadlines across dozens of clients using spreadsheets, sticky notes, and calendar reminders. Missed deadlines led to regulatory penalties and eroded client trust. The existing CRM captured contact information but offered no workflow automation, no task management, and no integration with their document management system. Onboarding a single new client took an average of 6 hours of pure admin work.",
    solution:
      "We implemented a fully automated CRM with built-in compliance tracking, deadline alerts, and client lifecycle management. Automated workflows now handle document collection, compliance reminders, meeting scheduling, and follow-up sequences. A real-time dashboard surfaces upcoming deadlines, at-risk clients, and advisor workload — enabling proactive management instead of reactive firefighting.",
    results: CASE_STUDIES[1].metrics,
  },
  {
    description:
      "A national facilities management company was hemorrhaging time and money through an outdated procurement process that relied on email chains, phone calls, and manual purchase order approvals. With hundreds of vendors and thousands of monthly transactions, their procurement team was buried in paperwork while costs spiraled and scheduling delays cascaded across projects.",
    challenge:
      "Purchase orders were initiated via email, approved through a chain of phone calls, and tracked in disconnected spreadsheets. The procurement team spent 70% of their time on administrative tasks — chasing approvals, comparing vendor quotes manually, and reconciling invoices against POs. Scheduling maintenance crews required cross-referencing availability across three different systems, leading to frequent double-bookings and idle crews.",
    solution:
      "We built an intelligent procurement automation system with digital PO workflows, automated three-way matching (PO, receipt, invoice), and a centralized vendor management portal. Smart scheduling algorithms now optimize crew assignment based on location, skillset, and availability in real time. Approval workflows route automatically based on dollar thresholds and department, with full audit trails and spend analytics.",
    results: CASE_STUDIES[2].metrics,
  },
];

export default function CaseStudiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Case Studies | GSD with AI"
        description="See how GSD with AI has delivered measurable results for real businesses — from ERP/CRM unification to procurement automation. Explore our detailed case studies."
        canonical="/case-studies"
      />
      <Header />

      <main id="main">
        {/* ── Page Hero ── */}
        <section className="bg-white pb-16 pt-32 lg:pb-24 lg:pt-40">
          <div className="container mx-auto px-6 text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(175_72%_38%)]">
              Our Work
            </span>
            <h1 className="text-4xl font-extrabold text-[hsl(220_25%_14%)] md:text-5xl lg:text-6xl">
              Case{" "}
              <span className="text-[hsl(175_72%_38%)]">Studies</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[hsl(215_15%_46%)]">
              Real results from real businesses. Explore how we help companies
              automate operations, eliminate busywork, and unlock sustainable
              growth.
            </p>
          </div>
        </section>

        {/* ── Case Study Sections ── */}
        {CASE_STUDIES.map((study, i) => {
          const expanded = EXPANDED[i];
          return (
            <section
              key={study.id}
              className={
                i % 2 === 0
                  ? "bg-white py-16 lg:py-24"
                  : "bg-[hsl(210_20%_98%)] py-16 lg:py-24"
              }
            >
              <div className="container mx-auto px-6">
                {/* Hero image */}
                <div className="mb-10 overflow-hidden rounded-2xl">
                  <img
                    src={HERO_IMAGES[i]}
                    alt={IMAGE_ALTS[i]}
                    className="h-[280px] w-full object-cover md:h-[400px] lg:h-[460px]"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>

                {/* Category badge + title */}
                <div className="mx-auto max-w-3xl">
                  <span className="mb-4 inline-block rounded-full bg-[hsl(175_72%_38%/0.1)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(175_72%_38%)]">
                    {study.category}
                  </span>
                  <h2 className="text-3xl font-extrabold text-[hsl(220_25%_14%)] md:text-4xl">
                    {study.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-[hsl(215_15%_46%)] md:text-lg">
                    {expanded.description}
                  </p>
                </div>

                {/* Challenge → Solution → Results */}
                <div className="mx-auto mt-14 max-w-3xl space-y-12">
                  {/* The Challenge */}
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-500">
                        !
                      </span>
                      <h3 className="text-xl font-bold text-[hsl(220_25%_14%)]">
                        The Challenge
                      </h3>
                    </div>
                    <p className="leading-relaxed text-[hsl(215_15%_46%)]">
                      {expanded.challenge}
                    </p>
                  </div>

                  {/* Our Solution */}
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(175_72%_38%/0.1)] text-sm font-bold text-[hsl(175_72%_38%)]">
                        &#10003;
                      </span>
                      <h3 className="text-xl font-bold text-[hsl(220_25%_14%)]">
                        Our Solution
                      </h3>
                    </div>
                    <p className="leading-relaxed text-[hsl(215_15%_46%)]">
                      {expanded.solution}
                    </p>
                  </div>

                  {/* The Results */}
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-sm font-bold text-amber-500">
                        &#9733;
                      </span>
                      <h3 className="text-xl font-bold text-[hsl(220_25%_14%)]">
                        The Results
                      </h3>
                    </div>
                    <div
                      className={`grid gap-4 ${
                        expanded.results.length === 2
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {expanded.results.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-xl border border-[hsl(175_72%_38%/0.15)] bg-[hsl(175_72%_38%/0.04)] p-6 text-center"
                        >
                          <p className="text-3xl font-extrabold text-[hsl(175_72%_38%)] md:text-4xl">
                            {metric.value}
                          </p>
                          <p className="mt-2 text-sm font-medium text-[hsl(215_15%_46%)]">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mx-auto mt-12 max-w-3xl text-center">
                  <a
                    href="/#booking"
                    className="inline-flex items-center gap-2 rounded-full bg-[hsl(175_72%_38%)] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_-3px_hsl(175_72%_38%/0.4)] transition-all hover:bg-[hsl(175_60%_30%)] hover:shadow-[0_6px_20px_-3px_hsl(175_72%_38%/0.5)]"
                  >
                    Get Similar Results
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Separator between case studies (not after the last one) */}
              {i < CASE_STUDIES.length - 1 && (
                <div className="container mx-auto mt-16 px-6 lg:mt-24">
                  <div className="border-t border-[hsl(215_20%_90%)]" />
                </div>
              )}
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
