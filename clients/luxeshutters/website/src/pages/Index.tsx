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
import StructuredData, { LOCAL_BUSINESS_DATA, ORGANIZATION_DATA, buildFAQData, buildBreadcrumbData, SITE_URL } from "@/components/StructuredData";

const HOME_FAQS = [
  { q: "How long does installation take?", a: "Most standard installations take 1–3 hours per window. Larger projects like whole-home shutters or zipscreens may take 1–2 days." },
  { q: "Do you offer free estimates?", a: "Yes! In-home consultations and estimates are completely free with no obligation." },
  { q: "What products do you recommend for maximum privacy?", a: "Shutters and security roller shutters offer the best privacy. Block-out blinds and curtains with thermal lining are also excellent options." },
  { q: "Are you licensed and insured?", a: "Absolutely. We're fully licensed and insured with experienced installers on every project." },
  { q: "Do you offer motorised options?", a: "Yes! Most of our products are available with motorised operation, including smart-home integration." },
  { q: "What about warranty coverage?", a: "All our products come with manufacturer warranties. We also provide a workmanship warranty on every installation." },
  { q: "Which areas do you service?", a: "We service the Riverina region including Temora, Wagga Wagga, Young, Cootamundra, West Wyalong, and surrounding areas." },
  { q: "Can you match my existing decor?", a: "Absolutely. We offer a huge range of colours, fabrics, and finishes across all product lines." },
];

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // Longer delay to allow images/layout to settle before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 500);
      // Second scroll to correct for any late layout shifts
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 1200);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Luxe Shutters | Premium Shutters, Blinds & Curtains — Temora NSW"
        description="Premium shutters, blinds, curtains, zipscreens, and awnings — custom-made and professionally installed in Temora & the Riverina. Free in-home consultation."
        canonical="/"
      />
      <StructuredData data={LOCAL_BUSINESS_DATA} id="ld-local-business" />
      <StructuredData data={ORGANIZATION_DATA} id="ld-organization" />
      <StructuredData data={buildFAQData(HOME_FAQS)} id="ld-faq" />
      <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }])} id="ld-breadcrumb" />
      <Header />
      <main>
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
