import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BLOG_POSTS } from "@/data/brandData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import blogDelta from "@/assets/blog-delta.webp";
import blogPetCbd from "@/assets/blog-pet-cbd.webp";
import blogCoa from "@/assets/blog-coa.webp";
import blogBeginners from "@/assets/blog-beginners.webp";
import blogLegal from "@/assets/blog-legal.webp";
import blogRoutine from "@/assets/blog-routine.webp";

const blogImages: Record<string, string> = {
  "blog-delta": blogDelta,
  "blog-pet-cbd": blogPetCbd,
  "blog-coa": blogCoa,
  "blog-beginners": blogBeginners,
  "blog-legal": blogLegal,
  "blog-routine": blogRoutine,
};

const categories = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = BLOG_POSTS.filter((post) => {
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 block text-primary">
              Our Blog
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Hemp Education & Wellness Tips
            </h1>
            <p className="max-w-xl mx-auto leading-relaxed text-muted-foreground">
              Clear, honest information about hemp products, compliance, and wellness — no jargon, just answers.
            </p>
          </div>
        </section>

        <section
          className="py-5 sticky top-[72px] z-30 backdrop-blur-md bg-white/95 border-b border-border"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={
                      activeCategory === cat
                        ? { background: "hsl(217 91% 50%)", color: "white" }
                        : { color: "hsl(210 10% 45%)" }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {filtered.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">No posts match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <article
                    key={post.id}
                    className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group animate-fade-in cursor-pointer bg-card border border-border shadow-soft hover:shadow-elevated"
                    style={{
                      animationDelay: `${i * 0.06}s`,
                    }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blogImages[post.image] || blogDelta}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: "hsl(217 91% 50% / 0.08)", color: "hsl(217 91% 50%)" }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 leading-snug transition-colors text-foreground">
                        {post.title}
                      </h3>
                      <p className="text-sm leading-relaxed line-clamp-3 text-muted-foreground">
                        {post.excerpt}
                      </p>
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
