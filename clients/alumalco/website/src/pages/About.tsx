import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Wrench, FlaskConical, Ruler, Factory, ShieldCheck, HeadphonesIcon } from "lucide-react";

const processSteps = [
  {
    number: "01",
    title: "Cutting Edge Research",
    description:
      "Even before our product line is conceptualized, the best engineering minds in the windows and doors industry are already researching and developing the latest technological advancements.",
    icon: FlaskConical,
  },
  {
    number: "02",
    title: "Designed for Your Needs",
    description:
      "Alumalco collaborates with you to ensure every detail you requested has been looked over. Our team supports you with technical and engineering aspects, collaborating with your architects and project managers.",
    icon: Ruler,
  },
  {
    number: "03",
    title: "Fabrication",
    description:
      "Our in-house fabrication process is state of the art. We make sure that our tools and materials are up to date with all the latest advancements to offer you the highest quality products.",
    icon: Factory,
  },
  {
    number: "04",
    title: "Quality Control",
    description:
      "We have strict guidelines for quality control and conduct extensive testing on every single one of our products before they reach your home.",
    icon: ShieldCheck,
  },
  {
    number: "05",
    title: "Installation",
    description:
      "We have an in-house and certified installation crew with all the necessary equipment to execute custom-sized glass, even oversized ones. Count on our team's 20+ years of experience for a worry-free installation.",
    icon: Wrench,
  },
  {
    number: "06",
    title: "Ongoing Support",
    description:
      "Our team of highly trained specialists helps you along the entire process — from inception to installation — providing the most knowledgeable guidance at every step.",
    icon: HeadphonesIcon,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            Who We Are
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mt-4 mb-6">
            About Alumalco
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our fabrication experience coupled with European quality opening systems.
          </p>
        </div>
      </section>

      {/* About Intro — two columns */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
              About Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Premium Aluminum Windows &amp; Doors for Exceptional Homes
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Servicing Quebec and Ontario, Alumalco and their partner companies specialize in the fabrication and installation of high quality aluminum windows and doors.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We dedicate ourselves to exceeding our customer's expectations when it comes to the opening systems for their home. The windows and doors of a house are one of the most important elements for a high-quality home. They are the entryway to the outside elements.
            </p>
          </div>
          <div className="w-full aspect-[4/3] bg-muted/60 border border-border/50 flex items-center justify-center rounded-sm overflow-hidden">
            <img
              src="https://alumalco.ca/wp-content/uploads/2022/04/Alumalco-About-Building-cropped.jpg"
              alt="Alumalco fabrication facility"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Expertise Statement */}
      <section className="py-20 lg:py-28 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-8">
            We offer you a high level of specialized information and technical design support.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Our team is composed of installers, fabricators, design specialists and operations experts with a combined experience of over 50 years in the windows and doors business. Alumalco's products are tested and certified for North American (NAFS) and European standards.
          </p>
        </div>
      </section>

      {/* The Product + Installation — alternating */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-8 flex flex-col gap-24">
          {/* The Product */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-5">
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                The Product
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Engineered with Precision &amp; Elegance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We at Alumalco endeavor to combine our customer's personality and elegance into a high-quality product engineered with the most up to date machinery and technology. Our innovative products are tailored to each of your needs. We dedicate ourselves to supplying only the best aluminum products while offering outstanding customer service.
              </p>
            </div>
            <div className="w-full aspect-[4/3] rounded-sm overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
                alt="Premium aluminum window profile showing precision engineering"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Installation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1 w-full aspect-[4/3] rounded-sm overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
                alt="Professional window installation crew at work"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2 flex flex-col gap-5">
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                Installation Experience
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Expert Installation, Every Time
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A quality product deserves highly trained installation experts. Our designers and installation team work hand in hand from the time of conception until project completion to give you a great customer experience at every single step. We use the latest tools and machinery to ensure quality installation of your doors and windows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 lg:py-28 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
              Our Process
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4 mb-4">
              How We Work
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              At Alumalco, we work hard in order to offer you carefree products, service and installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="group bg-card/50 border border-border/50 p-8 rounded-sm hover:border-primary/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-3xl font-display font-semibold text-primary/30 group-hover:text-primary transition-colors duration-300">
                    {step.number}
                  </span>
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-sm tracking-wide">
            Our products are{" "}
            <span className="text-foreground font-semibold">certified</span>{" "}
            for North American standards (CAN/CSA, NAFS, AAMA/WDMA, A440-00).
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Send in Your Plans for a Quote
          </h2>
          <p className="text-muted-foreground mb-8">
            Ready to start your project? Get in touch with our team for a free, no-obligation quote.
          </p>
          <a
            href="/#quote"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            Get a Quote
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
