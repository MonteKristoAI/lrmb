import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// Blog is now a separate static HTML site (gummygurl-blog repo)
// This redirect sends /blog visitors to the static blog
import BlogRedirect from "./pages/BlogRedirect";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import LabResults from "./pages/LabResults";
import Wholesale from "./pages/Wholesale";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminTransactions from "./pages/admin/AdminTransactions";
import Checkout from "./pages/Checkout";
import PolicyPage from "./pages/PolicyPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import AgeVerification from "./components/AgeVerification";
import { useCartSync } from "./hooks/useCartSync";

const queryClient = new QueryClient();

function AppInner() {
  useCartSync();

  return (
    <>
      <AgeVerification />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<BlogRedirect />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lab-results" element={<LabResults />} />
        <Route path="/wholesale" element={<Wholesale />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/privacy-policy" element={<PolicyPage />} />
        <Route path="/terms-of-service" element={<PolicyPage />} />
        <Route path="/shipping-policy" element={<PolicyPage />} />
        <Route path="/return-policy" element={<PolicyPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/lp/:slug" element={<LandingPage />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/edit/:handle" element={<AdminProductForm />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
