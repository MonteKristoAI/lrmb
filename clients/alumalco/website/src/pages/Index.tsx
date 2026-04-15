import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PartnersStrip from "@/components/PartnersStrip";
import TrustStrip from "@/components/TrustStrip";
import FeaturedCollections from "@/components/FeaturedCollections";
import WhyChooseUs from "@/components/WhyChooseUs";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";
import BookingSection from "@/components/BookingSection";
import WallOfLove from "@/components/WallOfLove";
import BlogSection from "@/components/BlogSection";
import CtaSection from "@/components/CtaSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PartnersStrip />
        <TrustStrip />
        <FeaturedCollections />
        <WhyChooseUs />
        <GallerySection />
        <AboutSection />
        <WallOfLove />
        <BookingSection />
        <BlogSection />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
