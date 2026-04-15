import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplianceBanner from "@/components/ComplianceBanner";
import { FlaskConical, FileCheck, ShieldCheck, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";
import OptimizedImage from "@/components/OptimizedImage";

const features = [
  {
    icon: FlaskConical,
    title: "Third-Party Lab Tested",
    text: "Every product batch is independently verified by accredited laboratories for potency, purity, and safety.",
  },
  {
    icon: FileCheck,
    title: "Certificates of Analysis",
    text: "COAs are available for every product we sell. Each certificate details cannabinoid content, terpene profiles, and confirms the absence of harmful contaminants.",
  },
  {
    icon: ShieldCheck,
    title: "Farm Bill Compliant",
    text: "All products meet federal regulations under the 2018 Farm Bill, containing less than 0.3% THC by dry weight.",
  },
];

// COA overrides: map products that share COAs with other products
const COA_OVERRIDES: Record<string, string> = {
  "10000mg-thc-gummies": "/coas/magnum-coa.pdf",
  "megadose-mushroom-gummies-3500mg": "/coas/rize-mushroom-gummy-coa.jpg",
  "thc-lollipops-70mg-420mg": "/coas/420-lollipop-coa.pdf",
  "50mg-milk-chocolate-thc-cbd-edible": "/coas/milk-chocolate-coa.pdf",
  "peanut-butter-soft-chews-pet-treat": "/coas/peanut-butter-pet-treat-coa.pdf",
  "mean-green-5000mg-muscle-rub": "/coas/mean-green-coa.pdf",
  "100mg-delta-8-caramel-cubes": "/coas/caramel-cubes-coa.pdf",
};

// Products to exclude from Lab Reports page
const LAB_REPORTS_EXCLUDE = [
  "intimacy-gummy",  // Seamus: doesn't need a report
];

export default function LabResults() {
  const { products: ALL_PRODUCTS, loading } = useProducts();
  const getCategoryLabel = (slug: string) =>
    PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  // Filter: remove bundles and excluded products
  const labProducts = ALL_PRODUCTS.filter((p) => {
    if (p.hidden) return false;
    if (p.category === "bundles") return false;
    if (LAB_REPORTS_EXCLUDE.includes(p.handle)) return false;
    return true;
  }).map((p) => ({
    ...p,
    coaPdf: COA_OVERRIDES[p.handle] || p.coaPdf,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 block text-primary">
              Transparency & Quality
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Lab Reports
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We believe in full transparency. Every Gummy Gurl product is third-party lab tested, and Certificates of Analysis (COAs) are available for each product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-8 bg-card border border-border shadow-soft text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>

          {/* Product Lab Reports Grid */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-8 text-foreground text-center">
              Product Lab Reports
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {labProducts.map((product) => (
                <Link
                  key={product.handle}
                  to={`/product/${product.handle}`}
                  className="rounded-xl overflow-hidden bg-card border border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    {product.image ? (
                      <OptimizedImage
                        src={product.image}
                        alt={product.title}
                        wrapperClassName="w-full h-full"
                        aspectRatio="1/1"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FlaskConical className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary font-medium">
                        {getCategoryLabel(product.category)}
                      </span>
                      <span>{product.brand}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <FlaskConical className="w-3 h-3" />
                        <span>COA Available</span>
                      </div>
                      {product.coaPdf && (
                        <a
                          href={product.coaPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                        >
                          View COA
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-8 lg:p-12 text-center bg-muted border border-border max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">
              Need a Specific COA?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you have questions about our testing process or need a specific Certificate of Analysis, please contact us at hello@gummygurl.com.
            </p>
            <p className="text-xs text-muted-foreground/70">
              All products are independently tested by accredited third-party laboratories.
            </p>
          </div>
        </div>
      </main>
      <ComplianceBanner />
      <Footer />
    </div>
  );
}
