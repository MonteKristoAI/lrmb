import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";

import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import FloatingCallButton from "./components/FloatingCallButton";
import StickyCallBar from "./components/StickyCallBar";
import { usePrerenderReady } from "./hooks/usePrerenderReady";

function AppRoutes() {
  usePrerenderReady(500);
  return (
    <>
      <StickyCallBar />
      <FloatingCallButton />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
