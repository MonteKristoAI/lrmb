import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData, { buildBreadcrumbData, SITE_URL } from "@/components/StructuredData";
import { CLINIC } from "@/data/clinicData";

const Privacy = () => {
  const updated = new Date().toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
  const phoneTel = CLINIC.phone.replace(/[^\d+]/g, "");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy | Luxe Shutters"
        description="How Luxe Shutters collects, uses, stores, and protects your personal information in compliance with the Australian Privacy Principles."
        canonical="/privacy"
      />
      <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }, { name: "Privacy Policy", url: `${SITE_URL}/privacy` }])} id="ld-breadcrumb" />
      <Header />
      <main id="main" className="pt-32 pb-20">
        <article className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <header className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Legal</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          </header>

          <div className="prose prose-neutral max-w-none text-foreground [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-10 [&>h2]:mb-3 [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:text-muted-foreground [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-2">
            <p>
              Luxe Shutters ("we", "us", "our") is committed to protecting the privacy of individuals who visit our website or engage our services. This Privacy Policy explains how we collect, use, store, and disclose personal information in accordance with the Australian Privacy Principles (APPs) set out in the Privacy Act 1988 (Cth).
            </p>

            <h2>1. Information we collect</h2>
            <p>We collect personal information you provide when you:</p>
            <ul>
              <li>Request a quote or in-home consultation through our website form;</li>
              <li>Contact us by phone, email, or social media;</li>
              <li>Engage our services for installation, measurement, or product delivery;</li>
              <li>Subscribe to marketing communications.</li>
            </ul>
            <p>This information may include your name, email address, phone number, postal address, property details, preferred appointment times, and any additional information you choose to share about your project.</p>

            <h2>2. How we use your information</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Schedule and conduct consultations, measurements, and installations;</li>
              <li>Provide quotes and respond to enquiries;</li>
              <li>Process orders, invoices, and warranty claims;</li>
              <li>Communicate with you about your project, appointments, and service updates;</li>
              <li>Comply with our legal and regulatory obligations.</li>
            </ul>

            <h2>3. Cookies and website analytics</h2>
            <p>
              Our website uses cookies and analytics tools (including Google Analytics and Google Tag Manager) to understand how visitors use the site. These tools collect anonymised information such as pages visited, time spent on each page, device type, and general location (city-level). You can disable cookies in your browser settings at any time.
            </p>

            <h2>4. Disclosure of information</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li>Our installers and contractors who require it to deliver services to you;</li>
              <li>Our product suppliers to fulfil custom orders;</li>
              <li>Payment processors and accounting providers for invoicing;</li>
              <li>Government authorities when required by law.</li>
            </ul>

            <h2>5. Storage and security</h2>
            <p>
              We store personal information on secure servers and take reasonable steps to protect it from unauthorised access, use, disclosure, modification, or loss. We retain records for a minimum of seven years in line with Australian taxation and business record-keeping requirements.
            </p>

            <h2>6. Accessing or correcting your information</h2>
            <p>
              You may request access to the personal information we hold about you, or ask us to correct information you believe is inaccurate, by contacting us using the details below. We will respond within a reasonable time.
            </p>

            <h2>7. Withdrawing consent &amp; opting out</h2>
            <p>
              You can opt out of marketing communications at any time by clicking the unsubscribe link in any email we send, or by contacting us directly. Opting out of marketing will not affect communications required to deliver a project you have engaged us for.
            </p>

            <h2>8. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The current version will always be posted on this page with the "Last updated" date above. Material changes will be communicated where appropriate.
            </p>

            <h2>9. Contact us</h2>
            <p>If you have questions about this Privacy Policy or how we handle your personal information, please contact us:</p>
            <ul>
              <li>Email: <a href={`mailto:${CLINIC.email}`} className="text-primary hover:underline">{CLINIC.email}</a></li>
              <li>Phone: <a href={`tel:${phoneTel}`} className="text-primary hover:underline">{CLINIC.phone}</a></li>
              <li>Address: {CLINIC.address}</li>
            </ul>

            <p className="text-xs text-muted-foreground mt-8">
              If you are not satisfied with our response to a privacy concern, you may contact the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">oaic.gov.au</a>.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
