import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AgeGate from "./components/AgeGate";
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import ExploreTechnology from "./pages/ExploreTechnology.tsx";
import Contact from "./pages/Contact.tsx";
import Effects from "./pages/Effects.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import ShippingPolicy from "./pages/ShippingPolicy.tsx";
import Product from "./pages/Product.tsx";
import CopyrightPolicy from "./pages/CopyrightPolicy.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AgeGate>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/explore-technology" element={<ExploreTechnology />} />
            <Route path="/effects" element={<Effects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/product/:blend" element={<Product />} />
            <Route path="/copyright-policy" element={<CopyrightPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AgeGate>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
