import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Shield,
  Zap,
  ClipboardList,
  ArrowRight } from
"lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger } from
"@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import FAQSection from "@/components/FAQSection";
import SEOHead from "@/components/SEOHead";
import StructuredData, { buildBreadcrumbData, buildFAQData, buildAllServiceSchemas, SITE_URL } from "@/components/StructuredData";
import { FAQS } from "@/data/faqData";

import serviceShutters from "@/assets/service-shutters.webp";
import serviceBlinds from "@/assets/service-blinds.webp";
import serviceCurtains from "@/assets/service-curtains.webp";
import serviceZipscreens from "@/assets/service-zipscreens.webp";
import serviceAwnings from "@/assets/service-awnings.webp";
import serviceRollerShutters from "@/assets/service-roller-shutters.webp";

const SERVICES = [
{
  id: "shutters",
  title: "Shutters",
  pill: "Shutters",
  image: serviceShutters,
  summary: "Our shutters combine timeless elegance with exceptional craftsmanship, adding a touch of sophistication to any space.",
  intro: "Transform your home with our premium plantation shutters. Available in a range of materials and finishes, our shutters offer superior light control, privacy, and insulation while adding a timeless aesthetic to any room.",
  timeline: ["Free in-home consultation & measurement", "Material and style selection", "Custom manufacturing to your specs", "Professional installation", "Final adjustments and quality check", "Care and maintenance walkthrough"],
  goodToKnow: ["Custom-made to fit any window shape or size", "Available in timber, PVC, and aluminium", "Increases property value and street appeal"]
},
{
  id: "blinds",
  title: "Blinds",
  pill: "Blinds",
  image: serviceBlinds,
  summary: "With their versatility and functionality, our blinds are the perfect blend of fashion and practicality.",
  intro: "Our blinds come in a wide variety of styles — roller, venetian, vertical, and more — designed to suit every room and budget. With motorised options and a huge range of fabrics and colours, you'll find the perfect fit for your space.",
  timeline: ["In-home consultation and window assessment", "Style and fabric selection", "Precise measurement", "Custom manufacturing", "Professional installation", "Operation walkthrough"],
  goodToKnow: ["Motorised and smart-home compatible options", "Block-out and sunscreen fabrics available", "Child-safe designs as standard"]
},
{
  id: "curtains",
  title: "Curtains",
  pill: "Curtains",
  image: serviceCurtains,
  summary: "From sheer elegance to opulent drapes, our curtains offer a wide range of options to suit your personal taste and interior decor.",
  intro: "Add warmth, texture, and style to your home with our premium curtain range. From sheer voiles to heavy block-out drapes, we offer an extensive collection of fabrics, colours, and heading styles to complement any interior.",
  timeline: ["Design consultation", "Fabric selection and sampling", "Precise window measurement", "Custom tailoring and manufacturing", "Professional fitting and hanging", "Styling and final adjustments"],
  goodToKnow: ["Huge range of fabrics and colours", "S-fold, pinch pleat, and eyelet heading styles", "Block-out and thermal lining options"]
},
{
  id: "zipscreens",
  title: "Zipscreens",
  pill: "Zipscreens",
  image: serviceZipscreens,
  summary: "Sleek design, smooth operation, and customizable options, our zip screens seamlessly blend into your existing architecture.",
  intro: "Zipscreens are the modern solution for outdoor living areas. With a patented zip-guided system, they provide superior wind resistance, UV protection, and insect control while maintaining your view and airflow.",
  timeline: ["Site assessment and consultation", "Product and colour selection", "Precise measurement of openings", "Custom manufacturing", "Professional installation", "Motor programming and testing"],
  goodToKnow: ["Wind-rated for exposed areas", "UV protection up to 99%", "Motorised with remote or smart-home control"]
},
{
  id: "awnings",
  title: "Awnings",
  pill: "Awnings",
  image: serviceAwnings,
  summary: "Our awnings provide the perfect shade solution, protecting you from the scorching sun while adding a touch of elegance.",
  intro: "Extend your outdoor living with our range of retractable and fixed awnings. Designed to withstand harsh conditions, our awnings provide shade, reduce indoor temperatures, and add style to your home's exterior.",
  timeline: ["On-site consultation and measurement", "Style and fabric selection", "Engineering and structural assessment", "Custom manufacturing", "Professional installation", "Operation and care guide"],
  goodToKnow: ["Retractable and fixed options available", "Reduces indoor temperatures significantly", "Weather-resistant fabrics and frames"]
},
{
  id: "security-roller-shutters",
  title: "Security Roller Shutters",
  pill: "Security",
  image: serviceRollerShutters,
  summary: "Designed to protect your windows and doors, our shutters offer a robust defense against intruders, while adding a layer of privacy and insulation.",
  intro: "Our security roller shutters provide peace of mind with robust protection against break-ins, storms, and extreme weather. They also offer excellent insulation, noise reduction, and complete light block-out when closed.",
  timeline: ["Security assessment and consultation", "Product and colour selection", "Precise measurement", "Custom manufacturing", "Professional installation", "Motor setup and security testing"],
  goodToKnow: ["Insurance-approved security solution", "Excellent noise and thermal insulation", "Motorised with key-switch or remote control"]
}];


const TRUST_POINTS = [
{ icon: MessageSquare, text: "Clear, jargon-free communication" },
{ icon: Shield, text: "Licensed and insured" },
{ icon: Zap, text: "Quality craftsmanship" },
{ icon: ClipboardList, text: "Free in-home measurements" }];


function ServiceCard({ service }: {service: (typeof SERVICES)[0];}) {
  return (
    <button
      onClick={() => {document.getElementById(service.id)?.scrollIntoView({ behavior: "smooth", block: "start" });}}
      className="group text-left rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring">

      <div className="aspect-[16/10] overflow-hidden">
        <img src={service.image} alt={service.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-lg font-semibold text-foreground">{service.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{service.summary}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">Learn more <ArrowRight className="h-3.5 w-3.5" /></span>
      </div>
    </button>);

}

function ServiceDetail({ service, index }: {service: (typeof SERVICES)[0];index: number;}) {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const navigate = useNavigate();
  const imageLeft = index % 2 === 0;

  return (
    <section ref={ref} id={service.id} className={`scroll-mt-36 py-16 md:py-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${index > 0 ? "border-t border-border/30" : ""}`}>
      <div className={`container mx-auto px-4 lg:px-8 grid gap-10 lg:gap-16 items-start ${imageLeft ? "lg:grid-cols-[1fr_1.15fr]" : "lg:grid-cols-[1.15fr_1fr]"}`}>
        <div className={`${imageLeft ? "" : "lg:order-2"}`}>
          <img src={service.image} alt={service.title} className="w-full rounded-2xl object-cover shadow-card aspect-[4/3]" />
        </div>
        <div className={`${imageLeft ? "" : "lg:order-1"}`}>
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{service.title}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{service.intro}</p>
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">What to expect</h3>
            <ol className="space-y-3">
              {service.timeline.map((step, i) =>
              <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                  <span className="text-sm text-foreground pt-0.5">{step}</span>
                </li>
              )}
            </ol>
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Good to know</h3>
            <ul className="space-y-2">
              {service.goodToKnow.map((point, i) =>
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground"><span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary/50" />{point}</li>
              )}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate("/#booking")} className="gap-2"><Calendar className="h-4 w-4" />Get a free quote</Button>
            <Link to="/contact"><Button variant="outline" size="lg">Contact us</Button></Link>
          </div>
        </div>
      </div>
    </section>);

}

export default function Services() {
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(SERVICES[0].id);


  useEffect(() => {
    const ids = SERVICES.map((s) => s.id);
    const observer = new IntersectionObserver((entries) => {const visible = entries.filter((e) => e.isIntersecting);if (visible.length > 0) setActiveId(visible[0].target.id);}, { rootMargin: "-30% 0px -60% 0px" });
    ids.forEach((id) => {const el = document.getElementById(id);if (el) observer.observe(el);});
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const btn = navRef.current?.querySelector(`[data-cat="${activeId}"]`) as HTMLElement | null;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  const scrollTo = (id: string) => {document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });};

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Our Services | Luxe Shutters — Shutters, Blinds, Curtains & More"
        description="Premium shutters, blinds, curtains, zipscreens, awnings, and security roller shutters — custom-made and professionally installed in Temora & the Riverina."
        canonical="/services"
      />
      <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }, { name: "Services", url: `${SITE_URL}/services` }])} id="ld-breadcrumb" />
      <StructuredData data={buildAllServiceSchemas()} id="ld-services" />
      <StructuredData data={buildFAQData(FAQS)} id="ld-faq-services" />
      <Header />
      <main id="main">

      <section className="bg-secondary/50 pt-32 pb-14 md:pt-36 md:pb-20">
        <div className="container mx-auto px-4 lg:px-8 grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">Our Services</span>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">Premium shutters, blinds & curtains, installed right.</h1>
            <p className="mt-4 max-w-lg text-muted-foreground leading-relaxed">From plantation shutters and zipscreens to curtains and security roller shutters — we'll measure your home, recommend the right products, and install everything with precision.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" onClick={() => navigate("/#booking")} className="gap-2"><Calendar className="h-4 w-4" />Get a free quote</Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img src={serviceShutters} alt="Luxe Shutters showroom" className="rounded-2xl shadow-card object-cover w-full aspect-[4/3]" />
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div ref={navRef} className="container mx-auto flex gap-2 overflow-x-auto px-4 py-3 lg:px-8 scrollbar-none">
          {SERVICES.map((s) =>
          <button key={s.id} data-cat={s.id} onClick={() => scrollTo(s.id)} className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeId === s.id ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>{s.pill}</button>
          )}
        </div>
      </div>

      <section className="container mx-auto px-4 lg:px-8 py-14 md:py-18">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </section>

      {SERVICES.map((s, i) => <ServiceDetail key={s.id} service={s} index={i} />)}

      <FAQSection />

      <section className="bg-primary/5 py-14 md:py-18 text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Ready to transform your home?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Request a free quote and we'll provide a detailed estimate before any work begins.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="lg" onClick={() => navigate("/#booking")} className="gap-2"><Calendar className="h-4 w-4" />Get a free quote</Button>
            <Link to="/contact"><Button variant="outline" size="lg">Contact us</Button></Link>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>);

}