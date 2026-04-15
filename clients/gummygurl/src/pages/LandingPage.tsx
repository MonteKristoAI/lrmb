import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FlaskConical, FileCheck, Truck } from "lucide-react";
import logoBlack from "@/assets/logo-black.webp";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header — Logo Only */}
      <header className="py-4 border-b border-border/50">
        <div className="container mx-auto px-4">
          <img src={logoBlack} alt="Gummy Gurl" className="h-7 md:h-9 mx-auto" />
        </div>
      </header>

      {/* Hero Section — Compact */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-3">
            Headline Goes Here
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto mb-6">
            Supporting copy for the campaign offer or product highlight.
          </p>
          <div className="w-full max-w-xs mx-auto aspect-square rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground/50 text-sm shadow-sm mb-6">
            Product Image
          </div>
          <Button variant="hero" size="lg">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Trust Indicators — Close to Hero */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="rounded-xl bg-muted/40 border border-border/50 py-5 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
              {[
                { icon: Shield, label: "21+ Verified" },
                { icon: FlaskConical, label: "Lab Tested" },
                { icon: FileCheck, label: "COA Available" },
                { icon: Truck, label: "Fast Shipping" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/8 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] md:text-xs font-medium text-foreground/70 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product — Primary Focus */}
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display text-xl md:text-2xl font-bold text-center mb-6">
            Featured Product
          </h2>
          <Card className="max-w-sm mx-auto overflow-hidden shadow-md border-border/60">
            <div className="aspect-[4/3] bg-muted/40 flex items-center justify-center text-muted-foreground/50 text-sm">
              Product Image
            </div>
            <CardContent className="p-5 text-center">
              <h3 className="text-lg font-semibold mb-1">Product Name</h3>
              <p className="text-xs text-muted-foreground mb-3 max-w-[260px] mx-auto">
                Brief product description or key benefit.
              </p>
              <p className="text-xl font-bold text-primary mb-4">$XX.XX</p>
              <Button variant="hero" size="lg" className="w-full">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-muted/50 border-t border-border/50 mt-4">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-[11px] leading-relaxed text-muted-foreground/50">
            These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease. Products containing THC may not be legal in all states. Please check your local laws before purchasing.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
