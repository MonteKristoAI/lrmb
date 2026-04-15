import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterCTA from "@/components/NewsletterCTA";
import ComplianceBanner from "@/components/ComplianceBanner";
import { BRAND } from "@/data/brandData";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () =>
<div className="min-h-screen bg-background">
    <Header />
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 block text-primary">
            Get in Touch
          </span>
          <h1 className="font-heading text-4xl font-bold mb-4 text-foreground">Contact Us</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Have questions about our products, compliance, or shipping? We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-md mx-auto text-center mb-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2.5 text-muted-foreground">
              <Mail className="w-5 h-5 text-primary" />
              <a href={`mailto:${BRAND.email}`} className="hover:opacity-80 transition-opacity">
                {BRAND.email}
              </a>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-muted-foreground">
              <Phone className="w-5 h-5 text-primary" />
              <a href="tel:+19784063946" className="hover:opacity-80 transition-opacity">
                (978) 406-3946
              </a>
            </div>
          </div>
        </div>
      </div>
      <NewsletterCTA />
      <ComplianceBanner />
    </main>
    <Footer />
  </div>;

export default Contact;
