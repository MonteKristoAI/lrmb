/*
 * AiiACo Models Page - /models
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import EngagementModels from "@/components/EngagementModels";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";

export default function ModelsPage() {
  return (
    <>
      <SEO
        title="AI Implementation Models | Strategic, Managed & Performance-Based"
        description="Choose your AI upgrade path: strategic blueprint, full managed integration, or performance-aligned partnership."
        path="/models"
        keywords="AI implementation models, strategic AI blueprint, managed AI integration, performance-based AI implementation, done-for-you AI integration, AI engagement models, AI partnership"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1" style={{ paddingTop: "80px" }}>
          <EngagementModels />
          <RelatedServices current="/models" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
