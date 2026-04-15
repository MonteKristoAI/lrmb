/*
 * AiiACo Industries Page - /industries
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Industries from "@/components/Industries";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";

export default function IndustriesPage() {
  return (
    <>
      <SEO
        title="AI Integration for Real Estate, Mortgage & Consulting | AiiACo"
        description="AiiACo deploys AI operational infrastructure for real estate brokerages, mortgage lenders, commercial property managers, and management consulting firms."
        path="/industries"
        keywords="AI for real estate, AI for mortgage lending, AI for commercial real estate, AI for management consulting, real estate AI integration, mortgage AI automation, consulting firm AI"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1" style={{ paddingTop: "80px" }}>
          <Industries />
          <RelatedServices current="/industries" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
