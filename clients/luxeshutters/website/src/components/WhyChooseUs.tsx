import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import whyChooseBg from "@/assets/hero-shutters.webp";

const steps = [
  { number: "01", title: "Get in Touch With Us", body: "Request a Free Quote, Book a discovery call or Upload your plans. We will then organize a time to visit your home for a Free Measure & Quote consultation." },
  { number: "02", title: "Mobile Showroom", body: "Our consultants will come to your home and discuss your needs for each window. We bring our Mobile Showroom so you can see and feel the quality of the products we offer, right in your own home." },
  { number: "03", title: "Fast Quote & Follow Up", body: "You will receive a quote in 48 hours. Our team will follow up with you to answer any questions and make sure you're completely happy before moving forward." },
  { number: "04", title: "Swift Order Processing & Transparent Lead Times", body: "As soon as the quote has been accepted and the 50% deposit is paid, we place your order immediately. We keep you informed with clear lead times so you always know what to expect." },
  { number: "05", title: "Preparation for a Smooth Installation Experience", body: "A couple of weeks prior to your install, we'll be in touch to confirm dates, access requirements, and any final details to ensure everything runs seamlessly on the day." },
  { number: "06", title: "Installation Day", body: "The Big Day Arrives! Installation time varies depending on the scope of work. Our professional installers treat your home with care and ensure a flawless finish." },
  { number: "07", title: "Post Install Support for your New Products", body: "Once the installation is finished, we walk you through your new products, answer any questions, and make sure you're 100% satisfied. We're always just a call away for ongoing support." },
];


export default function WhyChooseUs() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(210 20% 95%), hsl(210 18% 97%))' }}>
      <div className="absolute inset-0 overflow-hidden">
        <img src={whyChooseBg} alt="" className="w-full h-full object-cover opacity-[0.55]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(210 20% 95% / 0.88), hsl(210 18% 97% / 0.90))' }} />
      </div>
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-20">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">Our Process</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground leading-[1.15] mb-6">
            How Does it Work?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Here at Luxe Shutters, we pride ourselves on being a service based company who supplies and installs the highest quality window furnishings and outdoor screens. We help our clients with a simple, step by step process that removes all stress and offers transparency and communication along the way.
          </p>
        </div>

        <div className={`border-t border-border scroll-fade ${isVisible ? "visible" : ""}`}>
          {steps.map((item) =>
          <div key={item.number} className="grid grid-cols-1 md:grid-cols-[4rem_1fr_1.5fr] gap-4 md:gap-8 py-8 md:py-10 border-b border-border items-start">
              <span className="font-serif text-3xl md:text-4xl font-semibold text-foreground/15">{item.number}</span>
              <h3 className="text-xl md:text-2xl font-medium text-foreground font-sans">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">{item.body}</p>
            </div>
          )}
        </div>

        <div className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden scroll-fade ${isVisible ? "visible" : ""}`}>
          {[
          { value: "4.9 / 5", label: "Average customer rating" },
          { value: "10+ yrs", label: "Industry experience" },
          { value: "5,000+", label: "Products installed" }].
          map((stat) =>
          <div key={stat.label} className="bg-card p-10 text-center">
              <div className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground tracking-wide">{stat.label}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}