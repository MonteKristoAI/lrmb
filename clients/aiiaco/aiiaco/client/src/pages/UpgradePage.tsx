/*
 * AiiACo Upgrade Page - /upgrade
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";

export default function UpgradePage() {
  return (
    <>
      <SEO
        title="Initiate AI Upgrade | AiiACo Engagement"
        description="Begin your AI integration engagement. Submit a structured intake or request an executive call. AiiACo responds within 24 hours."
        path="/upgrade"
        keywords="AI integration engagement, AI upgrade, initiate AI integration, AI consulting intake, AI implementation request, AI strategy consultation"
      />
      <div className="min-h-screen flex flex-col" style={{ background: "#03050A" }}>
        <Navbar />
        <main className="flex-1" style={{ paddingTop: "80px" }}>
          <ContactSection />
          <RelatedServices current="/upgrade" max={4} />

      </main>
        <Footer />
      </div>
    </>
  );
}
