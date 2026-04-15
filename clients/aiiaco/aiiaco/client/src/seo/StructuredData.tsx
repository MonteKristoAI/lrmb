/**
 * AiiACo Structured Data - CLIENT-side dispatcher
 *
 * This component runs in the BROWSER after hydration. It looks up the current route
 * via wouter's useLocation hook and delegates to StructuredDataSSR with the pathname
 * as a prop.
 *
 * ARCHITECTURE NOTE:
 * - Global schemas (Organization, WebSite, ProfessionalService, Person) are defined
 *   exactly ONCE in client/index.html. They ship with every page as static HTML.
 * - Page-specific schemas (BreadcrumbList, FAQPage, HowTo, AboutPage) are dispatched
 *   by route through StructuredDataSSR. During SSR the entry-server.tsx passes pathname
 *   explicitly; in the browser this client-side dispatcher does the same via useLocation.
 *
 * DO NOT re-introduce global Organization/Service/WebSite schemas here. They would
 * duplicate the shell and cause Google to see each schema twice.
 *
 * DO NOT inject FAQPage or HowTo schemas globally. Google penalizes FAQPage schema
 * that does not match visible content on the page where it appears. Route-specific
 * dispatch in StructuredDataSSR enforces this constraint.
 */
import { useLocation } from "wouter";
import StructuredDataSSR from "./StructuredDataSSR";

/**
 * Normalize the pathname so client-side and server-side dispatch produce
 * byte-identical JSON-LD output. Without this, a route like `/method` vs
 * `/method/` produces different @id values and react-helmet-async reports
 * a hydration mismatch on first render.
 */
function normalize(pathname: string): string {
  if (!pathname || pathname === "") return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default function StructuredData() {
  const [pathname] = useLocation();
  return <StructuredDataSSR pathname={normalize(pathname)} />;
}
