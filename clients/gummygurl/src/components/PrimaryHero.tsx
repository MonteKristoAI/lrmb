import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileCheck, MapPin, FlaskConical, Sun, Wind, Moon, Heart, Dumbbell, Users, Zap, Flame, Brain } from "lucide-react";
import heroGummyGurl from "@/assets/hero-gummygurl-collage.webp";

const trustIndicators = [
  { icon: ShieldCheck, label: "21+ Verified" },
  { icon: FlaskConical, label: "Third-Party Lab Tested" },
  { icon: FileCheck, label: "COA on Every Product" },
  { icon: MapPin, label: "Nationwide Shipping Where Permitted" },
];

const effects = [
  { icon: Sun, label: "Uplift" },
  { icon: Wind, label: "Unwind" },
  { icon: Moon, label: "Sleep" },
  { icon: Heart, label: "Relief" },
  { icon: Dumbbell, label: "Recovery" },
  { icon: Zap, label: "Performance" },
  { icon: Flame, label: "Intimacy" },
  { icon: Brain, label: "Clarity" },
  { icon: Users, label: "Social" },
];

const categoryButtons = [
  { label: "Shop Edibles", query: "thc-edibles" },
  { label: "Shop Wellness", query: "health-wellness" },
  { label: "Shop Pet Products", query: "pet-wellness" },
  { label: "Shop THCA Flower", query: "thca-flower" },
];

export default function PrimaryHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden" style={{ background: "hsl(210 25% 97%)" }}>
      {/* Gradient accents from gummy section */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
        style={{ background: "hsl(217 91% 50%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.08]"
        style={{ background: "hsl(210 80% 70%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 50%, hsl(var(--primary) / 0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 85% 30%, hsl(var(--primary) / 0.04) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-16 lg:py-22">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — Copy */}
          <div className="space-y-7 max-w-xl">
            {/* Eyebrow */}
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">
              Gummy Gurl – Hemp &amp; Wellness Products
            </p>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-foreground leading-[1.06] tracking-tight">
              Premium Products.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Real Results.
              </span>
            </h1>

            {/* Subheader */}
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Lab-tested edibles, wellness formulations, pet products, and premium THCA flower — crafted for quality and shipped nationwide where permitted.
            </p>

            {/* Category CTAs */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap gap-3">
                {categoryButtons.map(({ label, query }) => (
                  <Button
                    key={query}
                    size="lg"
                    variant="outline"
                    className="font-semibold tracking-wide hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => navigate(`/shop?category=${query}`)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate("/shop?category=bundles")}
              >
                Save with Bundles &amp; Subscriptions
              </Button>
            </div>

            {/* Shop by Effect */}
            <div className="pt-2">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.15em] mb-3">
                Shop by Effect
              </p>
              <div className="flex gap-2 flex-wrap">
                {effects.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => navigate(`/shop?effect=${label.toLowerCase()}`)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary border border-border hover:border-primary/30 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap gap-x-5 gap-y-2.5 pt-4 mt-2 border-t border-border">
              {trustIndicators.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-muted-foreground text-xs font-medium"
                >
                  <Icon className="w-4 h-4 shrink-0 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Hero image */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative max-w-[480px] w-full">
              <div
                className="absolute inset-4 rounded-3xl blur-[50px] opacity-10"
                style={{ background: "linear-gradient(160deg, hsl(var(--primary) / 0.5), hsl(var(--primary)))" }}
              />
              <img
                src={heroGummyGurl}
                alt="Gummy Gurl premium hemp gummies — lab tested, COA certified"
                className="relative z-10 w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 rounded-full backdrop-blur-xl text-xs font-semibold whitespace-nowrap bg-background/80 text-foreground shadow-card border border-border">
                ★ Customer-trusted formulas · Lab-verified potency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
