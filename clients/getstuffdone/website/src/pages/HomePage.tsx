import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PartnersStrip from "@/components/sections/PartnersStrip";
import ServicePillars from "@/components/sections/ServicePillars";
import CaseStudies from "@/components/sections/CaseStudies";
import ReviewsCarousel from "@/components/sections/ReviewsCarousel";
import AboutFounder from "@/components/sections/AboutFounder";
import BookingWizard from "@/components/sections/BookingWizard";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData, {
  ORGANIZATION_DATA,
  PROFESSIONAL_SERVICE_DATA,
  buildFAQData,
  buildBreadcrumbData,
} from "@/components/seo/StructuredData";
import { FAQS } from "@/data/faqs";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GSD with AI | Smart IT & AI Solutions — Affordable, Scalable, Impactful"
        description="Enterprise-level IT and AI solutions for SMBs. Workflow automation, AI implementation, CRM, digital transformation. Book a free discovery call."
        canonical="/"
      />
      <StructuredData data={ORGANIZATION_DATA} id="ld-org" />
      <StructuredData data={PROFESSIONAL_SERVICE_DATA} id="ld-service" />
      <StructuredData data={buildFAQData(FAQS)} id="ld-faq" />
      <StructuredData
        data={buildBreadcrumbData([{ name: "Home", url: "https://www.getsstuffdone.com/" }])}
        id="ld-breadcrumb"
      />
      <Header />
      <main id="main">
        <HeroSection />
        <PartnersStrip />
        <div className="section-divider" />
        <ServicePillars />
        <CaseStudies />
        <div className="section-divider" />
        <AboutFounder />
        <ReviewsCarousel />
        <div className="section-divider" />
        <BookingWizard />
        <FAQSection />
        <div className="section-divider" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
