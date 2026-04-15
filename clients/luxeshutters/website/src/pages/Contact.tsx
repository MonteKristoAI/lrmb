import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationForm from "@/components/ConsultationForm";
import SEOHead from "@/components/SEOHead";
import StructuredData, { buildBreadcrumbData, SITE_URL } from "@/components/StructuredData";

const Contact = () => (
  <div className="min-h-screen">
    <SEOHead
      title="Contact Us | Luxe Shutters — Free In-Home Consultation"
      description="Get in touch with Luxe Shutters for a free in-home consultation. Call 1800-465-893 or fill out our form. Serving Temora & the Riverina region."
      canonical="/contact"
    />
    <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }, { name: "Contact", url: `${SITE_URL}/contact` }])} id="ld-breadcrumb" />
    <Header />
    <main className="pt-24">
      <ConsultationForm />
    </main>
    <Footer />
  </div>
);

export default Contact;
