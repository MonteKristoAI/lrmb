import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, FileText } from "lucide-react";

import shopRelaxed from "@/assets/shop-relaxed.jpg";
import shopBalanced from "@/assets/shop-balanced.jpg";
import shopUplifted from "@/assets/shop-uplifted.jpg";

interface Terpene {
  name: string;
  amount: string;
}

interface BlendData {
  name: string;
  tagline: string;
  description: string;
  color: string;
  textColor: string;
  borderColor: string;
  img: string;
  terpenes: Terpene[];
  ingredients: string;
}

const blends: Record<string, BlendData> = {
  relaxed: {
    name: "RELAXED",
    tagline: "Calm body, clear mind.",
    description:
      "Myrcene, Linalool, and β-Caryophyllene produce a calm, unwinding effect. Designed for evenings, recovery, and deep relaxation without sedation.",
    color: "bg-effect-relaxed",
    textColor: "text-effect-relaxed",
    borderColor: "border-effect-relaxed",
    img: shopRelaxed,
    terpenes: [
      { name: "Myrcene", amount: "1.5mg" },
      { name: "Linalool", amount: "0.9mg" },
      { name: "β-Caryophyllene", amount: "0.6mg" },
    ],
    ingredients:
      "Sugar, Tapioca Syrup, Water, Pectin, Citric Acid, Natural Flavors, Hemp Extract (Delta-9 THC, CBD), Terpenes (Myrcene, Linalool, β-Caryophyllene), Sodium Citrate, Natural Colors.",
  },
  balanced: {
    name: "BALANCED",
    tagline: "Clarity, enjoyment, connection.",
    description:
      "Limonene, Linalool, and β-Caryophyllene create a centred, social experience. Perfect for gatherings, creativity, and everyday enjoyment.",
    color: "bg-effect-balanced",
    textColor: "text-effect-balanced",
    borderColor: "border-effect-balanced",
    img: shopBalanced,
    terpenes: [
      { name: "Limonene", amount: "1.2mg" },
      { name: "Linalool", amount: "0.9mg" },
      { name: "β-Caryophyllene", amount: "0.9mg" },
    ],
    ingredients:
      "Sugar, Tapioca Syrup, Water, Pectin, Citric Acid, Natural Flavors, Hemp Extract (Delta-9 THC, CBD), Terpenes (Limonene, Linalool, β-Caryophyllene), Sodium Citrate, Natural Colors.",
  },
  uplifted: {
    name: "UPLIFTED",
    tagline: "Energy, creativity, euphoria.",
    description:
      "Limonene, α-Pinene, and β-Caryophyllene deliver an energising, euphoric lift. Ideal for daytime activities, social events, and creative pursuits.",
    color: "bg-effect-uplifted",
    textColor: "text-effect-uplifted",
    borderColor: "border-effect-uplifted",
    img: shopUplifted,
    terpenes: [
      { name: "Limonene", amount: "1.8mg" },
      { name: "α-Pinene", amount: "0.75mg" },
      { name: "β-Caryophyllene", amount: "0.45mg" },
    ],
    ingredients:
      "Sugar, Tapioca Syrup, Water, Pectin, Citric Acid, Natural Flavors, Hemp Extract (Delta-9 THC, CBD), Terpenes (Limonene, α-Pinene, β-Caryophyllene), Sodium Citrate, Natural Colors.",
  },
};

const strengths = ["10mg", "25mg"] as const;

const getPackages = (strength: "10mg" | "25mg") => {
  const thc = strength === "10mg" ? 10 : 25;
  const gummiesIn100 = strength === "10mg" ? 10 : 4;
  return [
    {
      label: "Single Gummy Pack",
      servings: 1,
      servingSize: "1 gummy",
      thcPerServing: thc,
      cbdPerServing: 5,
      totalThc: thc,
    },
    {
      label: `100mg Total THC Pack`,
      servings: gummiesIn100,
      servingSize: "1 gummy",
      thcPerServing: thc,
      cbdPerServing: 5,
      totalThc: 100,
    },
  ];
};

const Product = () => {
  const { blend } = useParams<{ blend: string }>();
  const data = blend ? blends[blend.toLowerCase()] : undefined;

  if (!data) {
    return (
      <>
        <SiteHeader />
        <main className="pt-32 pb-24 text-center container">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-gold underline">
            Back to Shop
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const terpTotal = data.terpenes.reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        {/* Back link */}
        <div className="container pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>
        </div>

        {/* Hero */}
        <section className="py-12">
          <div className="container grid md:grid-cols-2 gap-10 items-center">
            <div className={`rounded-2xl overflow-hidden border-t-2 ${data.borderColor}`}>
              <img src={data.img} alt={data.name} className="w-full aspect-square object-cover" />
            </div>
            <div>
              <div className={`inline-block text-xs font-black tracking-wider uppercase mb-3 ${data.textColor}`}>
                {blend}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">{data.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{data.tagline}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{data.description}</p>

              {/* Terpene Blend */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Terpene Blend (per serving)
                </h3>
                <div className="space-y-2">
                  {data.terpenes.map((t) => (
                    <div key={t.name} className="flex justify-between text-sm">
                      <span className="text-foreground">{t.name}</span>
                      <span className={`font-bold ${data.textColor}`}>{t.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm border-t border-border pt-2">
                    <span className="font-bold text-foreground">Total Terpenes</span>
                    <span className={`font-bold ${data.textColor}`}>{terpTotal.toFixed(2)}mg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strength Tabs */}
        <section className="pb-20">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Strength</h2>
            <Tabs defaultValue="10mg" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                {strengths.map((s) => (
                  <TabsTrigger key={s} value={s} className="font-bold">
                    {s} THC · 5mg CBD
                  </TabsTrigger>
                ))}
              </TabsList>

              {strengths.map((s) => {
                const packages = getPackages(s);
                return (
                  <TabsContent key={s} value={s}>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.label}
                          className={`bg-card border rounded-xl p-6 ${data.borderColor} border-t-2`}
                        >
                          <h3 className="text-lg font-bold mb-4">{pkg.label}</h3>

                          <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Serving Size</span>
                              <span className="font-semibold">{pkg.servingSize}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Servings per Package</span>
                              <span className="font-semibold">{pkg.servings}</span>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between">
                              <span className="text-muted-foreground">THC per Serving</span>
                              <span className={`font-bold ${data.textColor}`}>{pkg.thcPerServing}mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">CBD per Serving</span>
                              <span className="font-bold">{pkg.cbdPerServing}mg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Terpenes per Serving</span>
                              <span className={`font-bold ${data.textColor}`}>{terpTotal.toFixed(2)}mg</span>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between">
                              <span className="text-muted-foreground">Total THC per Package</span>
                              <span className="font-bold text-foreground">{pkg.totalThc}mg</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>

        {/* Ingredients */}
        <section className="pb-16">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <p className="text-muted-foreground leading-relaxed">{data.ingredients}</p>
          </div>
        </section>

        {/* COA */}
        <section className="pb-24">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Certificate of Analysis (COA)</h2>
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center">
              <FileText className="text-muted-foreground mb-3" size={32} />
              <p className="text-muted-foreground">
                Third-party lab results for this blend will be available here soon. Check back for full COA documentation.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
};

export default Product;
