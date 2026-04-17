import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData, { buildBreadcrumbData, SITE_URL } from "@/components/StructuredData";
import { CLINIC } from "@/data/clinicData";

const Terms = () => {
  const updated = new Date().toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
  const phoneTel = CLINIC.phone.replace(/[^\d+]/g, "");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Service | Luxe Shutters"
        description="Terms of service governing the use of the Luxe Shutters website, quotes, product supply, and installation services across Temora and the Riverina."
        canonical="/terms"
      />
      <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }, { name: "Terms of Service", url: `${SITE_URL}/terms` }])} id="ld-breadcrumb" />
      <Header />
      <main id="main" className="pt-32 pb-20">
        <article className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <header className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Legal</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          </header>

          <div className="prose prose-neutral max-w-none text-foreground [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-10 [&>h2]:mb-3 [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:text-muted-foreground [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-2">
            <p>
              These Terms of Service ("Terms") govern your use of the Luxe Shutters website and the supply of our products and installation services. By visiting our website, requesting a quote, or engaging our services, you agree to these Terms.
            </p>

            <h2>1. About us</h2>
            <p>
              Luxe Shutters is a family-owned business based in Temora, New South Wales, supplying and installing custom shutters, blinds, curtains, zipscreens, awnings, and security roller shutters across the Riverina and regional NSW.
            </p>

            <h2>2. Quotes and estimates</h2>
            <p>
              All quotes and estimates we provide are indicative and are valid for 30 days unless otherwise stated. Final pricing is confirmed in writing once product selection, measurements, and installation requirements are finalised. Quotes do not constitute a binding contract until accepted in writing by both parties.
            </p>

            <h2>3. Orders, deposits and payment</h2>
            <p>
              A deposit is typically required to commence custom manufacturing. The balance is payable on completion of installation. Payment terms are specified on each invoice. Products remain the property of Luxe Shutters until paid in full.
            </p>

            <h2>4. Custom products</h2>
            <p>
              Because our products are custom-made to your specifications, they cannot be returned or exchanged except as required by Australian Consumer Law. We will always make every reasonable effort to rectify defects in workmanship or product quality.
            </p>

            <h2>5. Warranties</h2>
            <p>
              Our products come with manufacturer warranties, and our installation work carries a workmanship warranty. Warranty terms and durations vary by product and are provided in writing at the time of order. These warranties do not exclude or limit your rights under the Australian Consumer Law.
            </p>

            <h2>6. Installation</h2>
            <p>
              Installation timelines are indicative and depend on product lead times, weather, and site conditions. You agree to provide safe access to the installation site and to make reasonable arrangements for our installers to complete the work.
            </p>

            <h2>7. Australian Consumer Law</h2>
            <p>
              Nothing in these Terms excludes, restricts, or modifies any rights or remedies you have under the Australian Consumer Law. Our goods come with guarantees that cannot be excluded. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage.
            </p>

            <h2>8. Limitation of liability</h2>
            <p>
              To the extent permitted by law, our liability for any loss or damage arising from the supply of products or services is limited, at our option, to the repair, replacement, or re-supply of the relevant product or service, or to the cost of doing so.
            </p>

            <h2>9. Intellectual property</h2>
            <p>
              All content on the Luxe Shutters website — including text, images, logos, and design — is our property or used with permission. You may not reproduce, modify, or distribute it without our prior written consent.
            </p>

            <h2>10. Governing law</h2>
            <p>
              These Terms are governed by the laws of New South Wales, Australia. Any dispute arising from these Terms will be subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>

            <h2>11. Contact us</h2>
            <p>For questions about these Terms or your order, please contact us:</p>
            <ul>
              <li>Email: <a href={`mailto:${CLINIC.email}`} className="text-primary hover:underline">{CLINIC.email}</a></li>
              <li>Phone: <a href={`tel:${phoneTel}`} className="text-primary hover:underline">{CLINIC.phone}</a></li>
              <li>Address: {CLINIC.address}</li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
