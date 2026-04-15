import heroImage from "@/assets/hero-home.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToQuote = () => {
    const el = document.getElementById("quote");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Luxury modern home with expansive windows overlooking a scenic sunset landscape"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <p
              className="text-sm uppercase tracking-[0.3em] text-primary font-medium opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Premium Windows & Doors
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-foreground opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Crafted for
              <br />
              <span className="text-gradient-warm">Timeless Living</span>
            </h1>
            <p
              className="text-base sm:text-lg text-secondary-foreground max-w-lg leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              Elevate your home with handcrafted windows and doors designed for
              beauty, performance, and lasting value.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 pt-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.8s" }}
            >
              <button
                onClick={scrollToQuote}
                className="bg-primary text-primary-foreground px-8 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors text-center"
              >
                Get a Free Quote
              </button>
              <a
                href="/portfolio"
                className="border border-foreground/30 text-foreground px-8 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-foreground/10 transition-colors text-center"
              >
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
