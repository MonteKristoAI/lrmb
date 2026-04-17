import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesPreview from "@/components/ServicesPreview";
import WhyChooseUs from "@/components/WhyChooseUs";
import GallerySection from "@/components/GallerySection";
import AboutTeam from "@/components/AboutTeam";
import BookingSection from "@/components/BookingSection";
import ReviewsSection from "@/components/ReviewsSection";
import BlogPreview from "@/components/BlogPreview";
import ConsultationForm from "@/components/ConsultationForm";
import FAQSection from "@/components/FAQSection";
import SEOHead from "@/components/SEOHead";
import StructuredData, {
  ORGANIZATION_DATA,
  buildFAQData,
  buildBreadcrumbData,
  buildLocalBusinessWithReviews,
  SITE_URL,
} from "@/components/StructuredData";
import { REVIEWS } from "@/data/clinicData";
import { FAQS } from "@/data/faqData";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }, 500);
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }, 1200);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Luxe Shutters | Premium Shutters, Blinds & Curtains — Temora & the Riverina NSW"
        description="Premium shutters, blinds, curtains, zipscreens, and awnings — custom-made and professionally installed in Temora & the Riverina. Free in-home consultation. Call 1800-465-893."
        canonical="/"
      />
      <StructuredData data={buildLocalBusinessWithReviews(REVIEWS)} id="ld-local-business" />
      <StructuredData data={ORGANIZATION_DATA} id="ld-organization" />
      <StructuredData data={buildFAQData(FAQS)} id="ld-faq" />
      <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }])} id="ld-breadcrumb" />
      <Header />
      <main id="main">
        <HeroSection />
        <ServicesPreview />
        <div className="section-shadow-top"><WhyChooseUs /></div>
        <GallerySection />
        <div className="section-shadow-top"><AboutTeam /></div>
        <BookingSection />
        <div className="section-shadow-top"><ReviewsSection /></div>
        <BlogPreview />
        <FAQSection />
        <ConsultationForm showMap={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
