import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Dev telemetry only — in production this should go to an error tracker.
    if (import.meta.env.DEV) {
      console.warn("404 — non-existent route visited:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <SEOHead
        title="Page Not Found | Luxe Shutters"
        description="The page you're looking for doesn't exist. Return to Luxe Shutters for premium shutters, blinds, and curtains in Temora & the Riverina."
        noindex
      />
      <main id="main" className="text-center px-4">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Error 404</p>
        <h1 className="mb-4 font-serif text-5xl font-bold text-foreground">Page not found</h1>
        <p className="mb-6 text-lg text-muted-foreground max-w-md mx-auto">
          We couldn't find the page you were looking for. It may have been moved or removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Return to home
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors">
            Contact us
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
