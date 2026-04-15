import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BLOG_POSTS } from "@/data/clinicData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData, { buildBreadcrumbData, SITE_URL } from "@/components/StructuredData";

import galleryWork23 from "@/assets/gallery-work-23.webp";
import galleryWork25 from "@/assets/gallery-work-25.webp";
import galleryWork1 from "@/assets/gallery-work-1.webp";
import galleryWork29 from "@/assets/gallery-work-29.webp";
import galleryWork20 from "@/assets/gallery-work-20.webp";

const imageMap: Record<string, string> = {
  "blog-1": galleryWork23,
  "blog-2": galleryWork25,
  "blog-3": galleryWork1,
  "blog-4": galleryWork29,
  "blog-5": galleryWork20,
};

const categories = ["All", "Tips", "Value", "Design", "Technology", "Maintenance"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = BLOG_POSTS.filter((post) => {
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog | Luxe Shutters — Tips, Guides & Window Furnishing Insights"
        description="Practical advice on shutters, blinds, curtains and more from our team — no jargon, just clear answers to questions homeowners actually ask."
        canonical="/blog"
      />
      <StructuredData data={buildBreadcrumbData([{ name: "Home", url: `${SITE_URL}/` }, { name: "Blog", url: `${SITE_URL}/blog` }])} id="ld-breadcrumb" />
      <Header />
      <main>
        <section className="pt-32 pb-16 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">Our blog</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Tips, Guides & Window Furnishing Insights</h1>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">Practical advice on shutters, blinds, curtains, and more from our team — no jargon, just clear answers to questions homeowners actually ask.</p>
          </div>
        </section>

        <section className="py-8 bg-background border-b border-border sticky top-[72px] z-30 backdrop-blur-md bg-background/95">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{cat}</button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No posts match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <article key={post.id} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group animate-fade-in cursor-pointer" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="h-48 overflow-hidden">
                      <img src={imageMap[post.image] || galleryWork23} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{post.category}</span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
