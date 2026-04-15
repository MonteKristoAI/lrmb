import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import CaseStudiesPage from "@/pages/CaseStudiesPage";
import AboutPage from "@/pages/AboutPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ScrollToTop from "@/components/layout/ScrollToTop";
import FloatingMobileCTA from "@/components/layout/FloatingMobileCTA";
import ChatbotWidget from "@/components/shared/ChatbotWidget";

export default function App() {
  return (
    <BrowserRouter>
      <FloatingMobileCTA />
      <ChatbotWidget />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
