import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrimaryHero from "@/components/PrimaryHero";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustSection from "@/components/TrustSection";
import EducationSection from "@/components/EducationSection";
import BlogPreview from "@/components/BlogPreview";
import NewsletterCTA from "@/components/NewsletterCTA";

import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import SubscribeSection from "@/components/SubscribeSection";
import CustomerAccountsSection from "@/components/CustomerAccountsSection";
import ComplianceBanner from "@/components/ComplianceBanner";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PrimaryHero />
        <div id="categories">
          <CategoryCards />
        </div>
        <FeaturedProducts />
        <ReviewsSection />
        <SubscribeSection />
        <CustomerAccountsSection />
        <TrustSection />
        <EducationSection />
        <div id="about">
          <AboutSection />
        </div>
        <BlogPreview />
        <ComplianceBanner />
        <NewsletterCTA />
        
      </main>
      <Footer />
    </div>
  );
};

export default Index;
