import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import FeaturedProducts from "@/components/FeaturedProducts";
import SystemicMatrix from "@/components/SystemicMatrix";
import MarqueeStatement from "@/components/MarqueeStatement";
import SectionDivider from "@/components/SectionDivider";
import CategoriesSection from "@/components/CategoriesSection";
import ReviewsSection from "@/components/ReviewsSection";
import AboutSection from "@/components/AboutSection";
import BlogPreview from "@/components/BlogPreview";
import FAQSection from "@/components/FAQSection";
import GetInTouch from "@/components/GetInTouch";

const Index = () => (
  <Layout>
    <HeroSection />
    <TrustBar />
    <SystemicMatrix />
    <MarqueeStatement />
    <FeaturedProducts />
    <SectionDivider />
    <CategoriesSection />
    <AboutSection />
    <SectionDivider label="What People Say" />
    <ReviewsSection />
    <SectionDivider />
    <BlogPreview />
    <FAQSection />
    <GetInTouch />
  </Layout>
);

export default Index;
