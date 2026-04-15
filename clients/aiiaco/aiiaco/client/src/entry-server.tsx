/**
 * AiiACo SSG Entry Point
 * Used by the prerender script to render each route to static HTML.
 * This file is ONLY used at build time - not in the browser.
 *
 * Key SSR rules for react-helmet-async v2:
 * - Pass a plain object as `context` to HelmetProvider
 * - After renderToString, context.helmet is populated with toString() methods
 * - Script tags must use text children (NOT dangerouslySetInnerHTML) for SSR
 *
 * Note on StructuredDataSSR: it takes `pathname` as a prop rather than calling
 * useLocation() internally, because during renderToString the wouter hook is only
 * valid INSIDE a <Router>. Passing pathname explicitly decouples it and lets it
 * render anywhere in the tree without needing the Router context.
 *
 * Note on Framer Motion: we intentionally do NOT wrap the tree in MotionConfig
 * reducedMotion="always" because that only suppresses transitions - it does NOT
 * override `initial` state. Components with `initial={{ opacity: 0 }}` still render
 * invisible in the SSR snapshot. The fix for Googlebot LCP / screenshot visibility
 * is applied as a post-render HTML transform in scripts/prerender.mjs which rewrites
 * inline `opacity: 0` and `transform: translateY(...)` style strings to visible state.
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import StructuredDataSSR from "./seo/StructuredDataSSR";
// Pages
import Home from "./pages/Home";
import ManifestoPage from "./pages/ManifestoPage";
import MethodPage from "./pages/MethodPage";
import IndustriesPage from "./pages/IndustriesPage";
import ModelsPage from "./pages/ModelsPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import ResultsPage from "./pages/ResultsPage";
import UpgradePage from "./pages/UpgradePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";
import AIIntegrationPage from "./pages/AIIntegrationPage";
import AIImplementationPage from "./pages/AIImplementationPage";
import AIAutomationPage from "./pages/AIAutomationPage";
import AIGovernancePage from "./pages/AIGovernancePage";
import AICrmIntegrationPage from "./pages/AICrmIntegrationPage";
import AIWorkflowAutomationPage from "./pages/AIWorkflowAutomationPage";
import AIRevenueEnginePage from "./pages/AIRevenueEnginePage";
import AIForRealEstatePage from "./pages/AIForRealEstatePage";
import AIForVacationRentalsPage from "./pages/AIForVacationRentalsPage";
import WorkplacePage from "./pages/WorkplacePage";
import CorporatePage from "./pages/CorporatePage";
import AgentPackagePage from "./pages/AgentPackagePage";
import OperatorPage from "./pages/OperatorPage";
import DiagnosticDemoPage from "./pages/DiagnosticDemoPage";
import TalkPage from "./pages/TalkPage";
import IndustryMicrosite from "./pages/IndustryMicrosite";

// Static route → component map.
// Dynamic industry routes are matched by prefix in renderRoute().
const routeMap: Record<string, React.ComponentType> = {
  "/": Home,
  "/manifesto": ManifestoPage,
  "/method": MethodPage,
  "/industries": IndustriesPage,
  "/models": ModelsPage,
  "/case-studies": CaseStudiesPage,
  "/results": ResultsPage,
  "/upgrade": UpgradePage,
  "/privacy": PrivacyPage,
  "/terms": TermsPage,
  "/ai-integration": AIIntegrationPage,
  "/ai-implementation-services": AIImplementationPage,
  "/ai-automation-for-business": AIAutomationPage,
  "/ai-governance": AIGovernancePage,
  "/ai-crm-integration": AICrmIntegrationPage,
  "/ai-workflow-automation": AIWorkflowAutomationPage,
  "/ai-revenue-engine": AIRevenueEnginePage,
  "/ai-for-real-estate": AIForRealEstatePage,
  "/ai-for-vacation-rentals": AIForVacationRentalsPage,
  "/workplace": WorkplacePage,
  "/corporate": CorporatePage,
  "/agentpackage": AgentPackagePage,
  "/operator": OperatorPage,
  "/demo": DiagnosticDemoPage,
  "/talk": TalkPage,
};

export type HelmetContext = {
  helmet?: HelmetServerState;
};

export function renderRoute(url: string): { html: string; helmetContext: HelmetContext } {
  const helmetContext: HelmetContext = {};
  const { hook } = memoryLocation({ path: url, static: true });

  // Resolve the component: exact match first, then dynamic routes.
  // For dynamic routes, extract the slug and pass it via the ssrSlug prop
  // so page components do not rely on useParams() in SSR (which returns
  // empty when called outside a matched <Route>).
  let PageComponent: React.ComponentType<{ ssrSlug?: string }> = NotFound;
  let ssrSlug: string | undefined;
  if (routeMap[url]) {
    PageComponent = routeMap[url];
  } else if (url.startsWith("/industries/")) {
    PageComponent = IndustryMicrosite;
    ssrSlug = url.slice("/industries/".length);
  }
  // Note: /blog/* routes are handled by the separate aiiaco-blog static site
  // served via Cloudflare Worker proxy. Not rendered here.

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Router hook={hook}>
              {/* StructuredDataSSR must be rendered with an explicit pathname prop
                  because wouter's useLocation() is only valid inside <Router> at build time. */}
              <StructuredDataSSR pathname={url} />
              <Toaster />
              <PageComponent ssrSlug={ssrSlug} />
            </Router>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );

  // helmetContext.helmet is populated synchronously after renderToString
  return { html, helmetContext };
}
