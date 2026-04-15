import Hero from "@/components/Hero";
import FeaturedShop from "@/components/FeaturedShop";
import ShopByCategory from "@/components/ShopByCategory";
import ReviewsSection from "@/components/ReviewsSection";
import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="bg-background">
      <Hero />
      <FeaturedShop />
      <ShopByCategory />
      <ReviewsSection />
      <AboutSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
