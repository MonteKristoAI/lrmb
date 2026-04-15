import SiteHeader from "@/components/SiteHeader";
import SilhouetteHero from "@/components/SilhouetteHero";
import FeaturedProducts from "@/components/FeaturedProducts";

import WhyDifferent from "@/components/WhyDifferent";

import ScienceComparison from "@/components/ScienceComparison";
import AboutTime from "@/components/AboutTime";
import EffectsShowcase from "@/components/EffectsShowcase";
import ReviewsSection from "@/components/ReviewsSection";

import FaqSection from "@/components/FaqSection";
import NewsletterSection from "@/components/NewsletterSection";
import SiteFooter from "@/components/SiteFooter";

const Index = () => (
  <>
    <SiteHeader />
    <main>
      <SilhouetteHero />
      <FeaturedProducts />
      
      <WhyDifferent />
      
      <ScienceComparison />
      <AboutTime />
      <EffectsShowcase />
      <ReviewsSection />
      
      <FaqSection />
      <NewsletterSection />
    </main>
    <SiteFooter />
  </>
);

export default Index;
