import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/data/clinicData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Props {
  title?: string;
}

export default function ComingSoon({ title = "This section" }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${title} Coming Soon | Luxe Shutters`}
        description={`${title} is coming soon to Luxe Shutters. Contact us for premium shutters, blinds, and curtains in Temora & the Riverina.`}
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {title} is coming soon
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We're putting the finishing touches on this section ahead of launch. In the meantime, we'd love to help you directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/#booking")}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book an appointment
              </Button>
              <a href={`tel:${CLINIC.phone.replace(/\s/g, "")}`}>
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  Call {CLINIC.phone}
                </Button>
              </a>
            </div>

            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
