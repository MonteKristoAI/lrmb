import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { POLICIES } from "@/data/policies";

export default function PolicyPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, "");
  const policy = POLICIES[slug] || null;

  if (!policy) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 text-center pb-16">
          <h1 className="text-2xl font-bold text-foreground mb-4">Policy not found</h1>
          <Link to="/" className="text-primary underline">Return to homepage</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 shadow-soft">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              {policy.title}
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Effective Date: {policy.effectiveDate} | Last Updated: {policy.lastUpdated}
            </p>

            <div className="space-y-8">
              {policy.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-lg font-semibold text-foreground mb-3">
                    {section.heading}
                  </h2>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
