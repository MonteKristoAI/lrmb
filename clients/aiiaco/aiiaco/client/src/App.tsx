import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import StructuredData from "./seo/StructuredData";
import NoindexRoute from "./seo/NoindexRoute";

// Pages - eagerly imported because prerender.mjs walks them OR entry-server.tsx imports them
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
import AIIntegrationPage from "./pages/AIIntegrationPage";
import AIImplementationPage from "./pages/AIImplementationPage";
import AIAutomationPage from "./pages/AIAutomationPage";
import AICrmIntegrationPage from "./pages/AICrmIntegrationPage";
import AIWorkflowAutomationPage from "./pages/AIWorkflowAutomationPage";
import AIRevenueEnginePage from "./pages/AIRevenueEnginePage";
import AIForRealEstatePage from "./pages/AIForRealEstatePage";
import AIForVacationRentalsPage from "./pages/AIForVacationRentalsPage";
import AIGovernancePage from "./pages/AIGovernancePage";
import WorkplacePage from "./pages/WorkplacePage";
import IndustryMicrosite from "./pages/IndustryMicrosite";
import CorporatePage from "./pages/CorporatePage";
import AgentPackagePage from "./pages/AgentPackagePage";
import OperatorPage from "./pages/OperatorPage";
import DiagnosticDemoPage from "./pages/DiagnosticDemoPage";
import TalkPage from "./pages/TalkPage";
import AiiAVoiceWidget from "./components/AiiAVoiceWidget";
import CookieConsent from "./components/CookieConsent";

// Lazy-loaded pages - admin, portal, demo-walkthrough are noindex and never hit by prerender.mjs,
// so they can ship as separate bundles to shrink the main chunk
const AdminLeadsPage = lazy(() => import("./pages/AdminLeadsPage"));
const AdminConsolePage = lazy(() => import("./pages/AdminConsolePage"));
const AdminAgentPage = lazy(() => import("./pages/AdminAgentPage"));
const AdminKnowledgePage = lazy(() => import("./pages/AdminKnowledgePage"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage"));
const DemoWalkthroughPage = lazy(() => import("./pages/DemoWalkthroughPage"));
const PortalAuth = lazy(() => import("./pages/portal/PortalAuth"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const PortalAgent = lazy(() => import("./pages/portal/PortalAgent"));
const PortalConversations = lazy(() => import("./pages/portal/PortalConversations"));
const PortalEmbed = lazy(() => import("./pages/portal/PortalEmbed"));
const PortalBilling = lazy(() => import("./pages/portal/PortalBilling"));
const PortalSettings = lazy(() => import("./pages/portal/PortalSettings"));

// Immediate external redirect component - fires window.location.href on mount
// This is the reliable fallback in case the Express server redirect is bypassed
function VideoStudioRedirect() {
  useEffect(() => {
    window.location.href = "https://aiivideo-zyf9pqt6.manus.space";
  }, []);
  return null;
}

function Router() {
  // StructuredData is rendered here (inside the wouter Router context) so its
  // internal useLocation() call resolves correctly and matches SSR dispatch.
  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <StructuredData />
      <div id="main-content" tabIndex={-1}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/manifesto" component={ManifestoPage} />
      <Route path="/method" component={MethodPage} />
      <Route path="/industries" component={IndustriesPage} />
      <Route path="/models" component={ModelsPage} />
      <Route path="/case-studies" component={CaseStudiesPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/upgrade" component={UpgradePage} />
      <Route path="/corporate" component={CorporatePage} />
      <Route path="/agentpackage" component={AgentPackagePage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/ai-integration" component={AIIntegrationPage} />
      <Route path="/ai-implementation-services" component={AIImplementationPage} />
      <Route path="/ai-automation-for-business" component={AIAutomationPage} />
      <Route path="/ai-governance" component={AIGovernancePage} />
      <Route path="/ai-crm-integration" component={AICrmIntegrationPage} />
      <Route path="/ai-workflow-automation" component={AIWorkflowAutomationPage} />
      <Route path="/ai-revenue-engine" component={AIRevenueEnginePage} />
      <Route path="/ai-for-real-estate" component={AIForRealEstatePage} />
      <Route path="/ai-for-vacation-rentals" component={AIForVacationRentalsPage} />
      <Route path="/workplace" component={WorkplacePage} />
      <Route path="/industries/:slug" component={IndustryMicrosite} />
      {/* Admin routes - all noindex, lazy-loaded */}
      <Route path="/admin/leads">
        <NoindexRoute><Suspense fallback={null}><AdminLeadsPage /></Suspense></NoindexRoute>
      </Route>
      <Route path="/admin/agent">
        <NoindexRoute><Suspense fallback={null}><AdminAgentPage /></Suspense></NoindexRoute>
      </Route>
      <Route path="/admin/knowledge">
        <NoindexRoute><Suspense fallback={null}><AdminKnowledgePage /></Suspense></NoindexRoute>
      </Route>
      <Route path="/admin/analytics">
        <NoindexRoute><Suspense fallback={null}><AdminAnalyticsPage /></Suspense></NoindexRoute>
      </Route>
      <Route path="/admin-opsteam">
        <NoindexRoute><Suspense fallback={null}><AdminConsolePage /></Suspense></NoindexRoute>
      </Route>
      <Route path="/operator">
        <NoindexRoute><OperatorPage /></NoindexRoute>
      </Route>
      <Route path="/demo" component={DiagnosticDemoPage} />
      <Route path="/demo-walkthrough">
        <NoindexRoute><Suspense fallback={null}><DemoWalkthroughPage /></Suspense></NoindexRoute>
      </Route>
      {/* Client Portal - all noindex, lazy-loaded */}
      <Route path="/portal/login">
        <NoindexRoute><Suspense fallback={null}><PortalAuth /></Suspense></NoindexRoute>
      </Route>
      <Route path="/portal">
        <NoindexRoute><Suspense fallback={null}><PortalDashboard /></Suspense></NoindexRoute>
      </Route>
      <Route path="/portal/agent">
        <NoindexRoute><Suspense fallback={null}><PortalAgent /></Suspense></NoindexRoute>
      </Route>
      <Route path="/portal/conversations">
        <NoindexRoute><Suspense fallback={null}><PortalConversations /></Suspense></NoindexRoute>
      </Route>
      <Route path="/portal/embed">
        <NoindexRoute><Suspense fallback={null}><PortalEmbed /></Suspense></NoindexRoute>
      </Route>
      <Route path="/portal/billing">
        <NoindexRoute><Suspense fallback={null}><PortalBilling /></Suspense></NoindexRoute>
      </Route>
      <Route path="/portal/settings">
        <NoindexRoute><Suspense fallback={null}><PortalSettings /></Suspense></NoindexRoute>
      </Route>
      <Route path="/talk" component={TalkPage} />
      <Route path="/videostudio" component={VideoStudioRedirect} />
      {/* Final fallback - wouter Switch matches this when nothing else did, so any unknown URL renders NotFound */}
      <Route component={NotFound} />
    </Switch>
      </div>
    </>
  );
}

function App() {
  // Signal to vite-plugin-prerender that the app is ready to snapshot
  useEffect(() => {
    document.dispatchEvent(new Event("prerender-ready"));
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {/*
            Router owns client-side routing. StructuredData is rendered INSIDE Router
            (see Router() function) so that wouter's useLocation hook resolves against
            the same context that SSR uses via memoryLocation. This prevents a hydration
            mismatch between the SSR-injected JSON-LD and the client re-render.
          */}
          <Router />
          <AiiAVoiceWidget />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
