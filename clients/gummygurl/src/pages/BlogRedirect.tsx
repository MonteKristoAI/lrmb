import { useEffect } from "react";

/**
 * Blog is now a separate static HTML site served via Cloudflare Workers.
 * This component redirects /blog visitors to the static blog.
 *
 * When on custom domain (gummygurl.com): CF Worker handles /blog/* directly,
 * so this redirect only fires on the Lovable subdomain.
 *
 * Update BLOG_URL when the static blog is deployed to CF Pages.
 */
const BLOG_URL = "https://gummygurl-blog.pages.dev";

export default function BlogRedirect() {
  useEffect(() => {
    // If we're on the custom domain with CF Worker, /blog/ is handled by the worker
    // This redirect is only needed on lovable.app subdomain
    window.location.replace(BLOG_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting to blog...</p>
    </div>
  );
}
