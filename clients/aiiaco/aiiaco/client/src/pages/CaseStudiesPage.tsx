/*
 * AiiACo Case Studies Page - /case-studies
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import CaseStudiesSection from "@/components/caseStudies/CaseStudiesSection";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";

export default function CaseStudiesPage() {
  return (
    <>
      <SEO
        title="AI Integration Case Studies | Anonymized Operational Upgrades"
        description="See how structured AI integration improves operational speed, capacity, and governance across industries."
        path="/case-studies"
        keywords="AI integration case studies, AI implementation results, AI operational upgrades, AI automation case studies, enterprise AI results, AI governance case studies, anonymized AI case studies"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1" style={{ paddingTop: "80px" }}>
          <CaseStudiesSection />
          <RelatedServices current="/case-studies" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
