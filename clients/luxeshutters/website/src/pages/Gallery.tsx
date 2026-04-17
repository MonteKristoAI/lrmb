import { useState } from "react";
import { X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData, { buildBreadcrumbData, SITE_URL } from "@/components/StructuredData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { galleryImages, galleryTabs, type GalleryTab } from "@/data/galleryData";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const filtered = activeTab === "All" ? galleryImages : galleryImages.filter((img) => img.tab === activeTab);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Gallery | Luxe Shutters — Our Work & Installations"
        description="Browse our portfolio of shutters, blinds, curtains, zipscreens, and awning installations across Temora and the Riverina region."
        canonical="/gallery"
      />
      <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }, { name: "Gallery", url: `${SITE_URL}/gallery` }])} id="ld-breadcrumb" />
      <Header />
      <main id="main" className="pt-24 lg:pt-32">
        <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden bg-background">
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-medium text-primary tracking-widest uppercase mb-3 block font-sans text-3xl">Our Work</span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Browse our full portfolio</h1>
              <p className="text-muted-foreground leading-relaxed">From zipscreens to outdoor blinds and shutters — explore all our completed installations.</p>
            </div>

            <div className="flex justify-center gap-2 mb-10 flex-wrap">
              {galleryTabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{tab}</button>
              ))}
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 scroll-fade ${isVisible ? "visible" : ""}`}>
              {filtered.map((img, i) => (
                <button key={i} onClick={() => setLightbox(i)} className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
                  <span className="absolute bottom-3 left-3 text-xs font-medium text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/50 backdrop-blur-sm px-2 py-1 rounded-md">{img.alt}</span>
                </button>
              ))}
            </div>
          </div>

          {lightbox !== null && (
            <div className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
              <button className="absolute top-6 right-6 text-primary-foreground/80 hover:text-primary-foreground" onClick={() => setLightbox(null)}><X className="w-8 h-8" /></button>
              <img src={filtered[lightbox].src} alt={filtered[lightbox].alt} className="max-w-full max-h-[85vh] rounded-2xl shadow-elevated object-contain animate-scale-in" onClick={(e) => e.stopPropagation()} />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
