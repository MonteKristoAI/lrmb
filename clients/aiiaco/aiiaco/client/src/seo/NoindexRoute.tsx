/**
 * NoindexRoute - helper wrapper that injects ONLY `<meta name="robots" content="noindex,nofollow">`
 * alongside its children, without overriding the child page's title or description.
 *
 * Why this is minimal: earlier versions wrapped children in a full `<SEO noindex>` component,
 * which also emitted title/description tags with placeholder values like "Private - AiiACo".
 * react-helmet-async merges tags across components with last-one-wins for `<title>`, which
 * meant admin page titles were being clobbered or behaving inconsistently depending on
 * mount order. By injecting only the robots directive here, the child component remains
 * the authoritative source for title/description/canonical.
 *
 * Usage in App.tsx:
 *   <Route path="/admin/leads">
 *     <NoindexRoute><AdminLeadsPage /></NoindexRoute>
 *   </Route>
 */
import React from "react";
import { Helmet } from "react-helmet-async";

type NoindexRouteProps = {
  children: React.ReactNode;
};

export default function NoindexRoute({ children }: NoindexRouteProps) {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>
      {children}
    </>
  );
}
