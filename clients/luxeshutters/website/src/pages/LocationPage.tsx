import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingSection from "@/components/BookingSection";
import FAQSection from "@/components/FAQSection";
import SEOHead from "@/components/SEOHead";
import StructuredData, {
  buildBreadcrumbData,
  buildServiceData,
  SITE_URL,
  LOCAL_BUSINESS_DATA,
} from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getLocationBySlug, LOCATIONS } from "@/data/locationData";
import { CLINIC } from "@/data/clinicData";
import NotFound from "./NotFound";

import serviceShutters from "@/assets/service-shutters.webp";
import serviceBlinds from "@/assets/service-blinds.webp";
import serviceCurtains from "@/assets/service-curtains.webp";
import serviceZipscreens from "@/assets/service-zipscreens.webp";
import serviceAwnings from "@/assets/service-awnings.webp";
import serviceRollerShutters from "@/assets/service-roller-shutters.webp";
import heroShutters from "@/assets/hero-shutters.webp";

const PRODUCTS = [
  {
    name: "Shutters",
    image: serviceShutters,
    description: "Timeless plantation shutters in timber, PVC, and aluminium. Superior light control and insulation.",
    link: "/services#shutters",
  },
  {
    name: "Blinds",
    image: serviceBlinds,
    description: "Roller, venetian, and vertical blinds in a wide range of fabrics, colours, and motorised options.",
    link: "/services#blinds",
  },
  {
    name: "Curtains",
    image: serviceCurtains,
    description: "From sheer voiles to heavy block-out drapes. S-fold, pinch pleat, and eyelet heading styles.",
    link: "/services#curtains",
  },
  {
    name: "Zipscreens",
    image: serviceZipscreens,
    description: "Wind-rated outdoor screens with UV protection up to 99%. Motorised with smart-home control.",
    link: "/services#zipscreens",
  },
  {
    name: "Awnings",
    image: serviceAwnings,
    description: "Retractable and fixed awnings to extend your outdoor living and reduce indoor temperatures.",
    link: "/services#awnings",
  },
  {
    name: "Security Roller Shutters",
    image: serviceRollerShutters,
    description: "Insurance-approved security with excellent noise and thermal insulation. Motorised operation.",
    link: "/services#security-roller-shutters",
  },
];

function ProductCard({ product }: { product: (typeof PRODUCTS)[0] }) {
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <div
      ref={ref}
      className={`group rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>
        <Link
          to={product.link}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          Learn more <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function LocationPage() {
  const { location: slug } = useParams<{ location: string }>();
  const location = slug ? getLocationBySlug(slug) : undefined;

  if (!location) {
    return <NotFound />;
  }

  const otherLocations = LOCATIONS.filter((l) => l.slug !== location.slug);

  const locationBusinessData = {
    ...LOCAL_BUSINESS_DATA,
    description: `Premium shutters, blinds, curtains, zipscreens, and awnings in ${location.name}, ${location.region}. Custom-made and professionally installed by Luxe Shutters.`,
    areaServed: {
      "@type": "City" as const,
      name: location.name,
    },
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`Shutters, Blinds & Curtains in ${location.name} | Luxe Shutters`}
        description={location.metaDescription}
        canonical={`/${location.slug}`}
      />
      <StructuredData
        data={buildBreadcrumbData([
          { name: "Home", url: `${SITE_URL}/` },
          { name: location.name, url: `${SITE_URL}/${location.slug}` },
        ])}
        id="ld-breadcrumb"
      />
      <StructuredData data={locationBusinessData} id="ld-local-business" />
      <StructuredData
        data={buildServiceData(
          `Window Furnishings in ${location.name}`,
          `Premium shutters, blinds, curtains, zipscreens, and awnings. Custom-made and professionally installed in ${location.name} and surrounding ${location.region} areas.`
        )}
        id="ld-service"
      />
      <Header />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroShutters}
            alt={`Premium shutters and blinds in ${location.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f2e]/95 via-[#1a1f2e]/75 to-[#1a1f2e]/30" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-32 lg:py-40">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm uppercase tracking-[0.15em] text-white/60 font-medium">
                {location.name}, {location.region} NSW
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6">
              Premium Shutters, Blinds & Curtains in{" "}
              <span className="text-accent">{location.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-8 leading-relaxed">
              {location.tagline}. Custom-made, professionally installed, and
              backed by our quality guarantee.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="xl"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg"
                onClick={() =>
                  document
                    .getElementById("booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get a Free Quote
              </Button>
              <a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`}>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/30 text-white bg-transparent hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {CLINIC.phone}
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location.distance} | Free in-home consultations</span>
            </div>
          </div>
        </div>
      </section>

      {/* About this location */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Serving {location.name}
            </span>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Your Local Window Furnishing Experts
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mb-10">
            {location.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {location.highlights.map((highlight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-card rounded-xl p-5 shadow-sm border border-border/40"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Our Products
            </span>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Available in {location.name}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Every product custom-made to your specifications and
              professionally installed.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA before booking */}
      <section className="bg-primary/5 py-14 md:py-18">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Ready to transform your {location.name} home?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Request a free in-home consultation. We'll measure your windows,
            show you samples, and provide a detailed quote with no obligation.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="hero"
              size="lg"
              onClick={() =>
                document
                  .getElementById("booking")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Get a free quote
            </Button>
            <a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`}>
              <Button variant="outline" size="lg" className="gap-2">
                <Phone className="h-4 w-4" />
                Call {CLINIC.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <BookingSection />

      {/* FAQ */}
      <FAQSection />

      {/* Other locations */}
      <section className="py-14 md:py-18 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
              We also serve
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {otherLocations.map((loc) => (
              <Link
                key={loc.slug}
                to={`/${loc.slug}`}
                className="rounded-full px-5 py-2.5 text-sm font-medium bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors shadow-sm"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
