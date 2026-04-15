/*
 * AiiACo Results Page - /results
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";

export default function ResultsPage() {
  return (
    <>
      <SEO
        title="AI Integration Results | Proof Without Personalities - AiiACo"
        description="Measurable outcomes from structured AI integration: cycle time reduction, capacity increase, and operational visibility across real estate, mortgage, commercial property, and consulting."
        path="/results"
        keywords="AI integration results, AI implementation outcomes, AI automation ROI, operational AI results, AI cycle time reduction, AI capacity increase, measurable AI outcomes"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1" style={{ paddingTop: "80px" }}>
          <ResultsSection />
          <RelatedServices current="/results" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
