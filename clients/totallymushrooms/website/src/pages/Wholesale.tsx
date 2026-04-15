import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Building2,
  FlaskConical,
  Shield,
  Package,
  Users,
  Leaf,
  Dumbbell,
  Stethoscope,
  ShoppingBag,
  Gift,
  Palmtree,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const partnerReasons = [
  {
    icon: Building2,
    title: "Vertical Integration",
    description:
      "We grow, extract, and formulate in-house. No middlemen, no markup chains. From substrate to shelf, every step is under our roof.",
  },
  {
    icon: FlaskConical,
    title: "Proprietary Extraction",
    description:
      "Ultrasonic nano-emulsion technology delivers 85-95% bioavailability. Your customers feel the difference from day one.",
  },
  {
    icon: Shield,
    title: "Regulatory Compliance",
    description:
      "USDA Organic, GMP certified, with full Certificate of Analysis per batch. Built for retailers who refuse to compromise.",
  },
];

const tiers = [
  {
    name: "Wholesale",
    description: "Stock our proven formulas under the Totally Mushrooms brand.",
    moq: "100 units",
    features: [
      "30% off retail pricing",
      "Standard branded packaging",
      "COA included per batch",
      "Net 30 payment terms",
      "Reorder portal access",
    ],
    highlight: false,
  },
  {
    name: "White Label",
    description: "Our formulas, your brand. Launch your own mushroom line without the R&D overhead.",
    moq: "500 units",
    features: [
      "Your logo on our formulas",
      "Custom branded packaging",
      "Dedicated account manager",
      "Marketing asset templates",
      "Priority fulfillment",
    ],
    highlight: true,
  },
  {
    name: "Co-Manufacturing",
    description: "Bring your recipe. We bring the extraction technology, facility, and scale.",
    moq: "Custom",
    features: [
      "Custom formulations",
      "Your recipe + our extraction tech",
      "Full R&D support",
      "Pilot batches available",
      "Regulatory guidance included",
    ],
    highlight: false,
  },
];

const industries = [
  { icon: Leaf, name: "Health Food Stores" },
  { icon: Dumbbell, name: "Gyms & Studios" },
  { icon: Stethoscope, name: "Naturopathic Clinics" },
  { icon: ShoppingBag, name: "Online Retailers" },
  { icon: Gift, name: "Subscription Box Companies" },
  { icon: Palmtree, name: "Wellness Resorts" },
];

const Wholesale = () => (
  <Layout>
    {/* Hero */}
    <section className="relative pt-32 pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />
      <div className="container max-w-4xl text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          B2B & Wholesale Programs
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Partner With{" "}
          <span className="text-gradient-gold">Totally Mushrooms</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          White-label, wholesale, and co-manufacturing solutions for brands that
          demand the highest standard in mushroom supplements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="glow-gold text-base px-8">
            <Link to="/contact">
              Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-base px-8"
          >
            <Link to="/shop">Browse Our Catalog</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Why Partner With Us */}
    <section className="py-24 border-t border-border">
      <div className="container max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Partner With Us
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From farm to formula, we control every variable so you never have to
            worry about quality.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerReasons.map((reason) => (
            <div
              key={reason.title}
              className="group rounded-2xl border border-border bg-card p-8 hover-card-lift transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Partnership Tiers */}
    <section className="py-24 border-t border-border">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Partnership Tiers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Flexible programs designed to match your scale and ambition.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 hover-card-lift ${
                tier.highlight
                  ? "border-primary bg-primary/[0.04] shadow-[0_0_40px_-12px] shadow-primary/20"
                  : "border-border bg-card"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide uppercase">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {tier.description}
              </p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-sm text-muted-foreground">MOQ</span>
                <span className="text-xl font-bold text-primary">
                  {tier.moq}
                </span>
              </div>
              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={
                  tier.highlight
                    ? "glow-gold w-full"
                    : "w-full"
                }
                variant={tier.highlight ? "default" : "outline"}
              >
                <Link to="/contact">Request Quote</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Industries We Serve */}
    <section className="py-24 border-t border-border">
      <div className="container max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Industries We Serve
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trusted by businesses across the health and wellness ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 hover-card-lift transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <industry.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-sm">{industry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 border-t border-border">
      <div className="container max-w-3xl">
        <div className="text-center rounded-2xl border border-primary/20 bg-primary/[0.03] p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's <span className="text-gradient-gold">Talk</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            Whether you need 100 units or 100,000, we'll build a program that
            fits. Tell us about your business and we'll get back to you within
            24 hours.
          </p>
          <Button asChild size="lg" className="glow-gold text-base px-10">
            <Link to="/contact">
              Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default Wholesale;
