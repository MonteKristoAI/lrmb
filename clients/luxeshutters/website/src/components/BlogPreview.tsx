import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/data/clinicData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import galleryWork23 from "@/assets/gallery-work-23.webp";
import galleryWork1 from "@/assets/gallery-work-1.webp";
import galleryWork20 from "@/assets/gallery-work-20.webp";
import galleryWork25 from "@/assets/gallery-work-25.webp";
import galleryWork29 from "@/assets/gallery-work-29.webp";
import blogBg from "@/assets/hero-shutters.webp";

const imageMap: Record<string, string> = {
  "blog-1": galleryWork23,
  "blog-2": galleryWork25,
  "blog-3": galleryWork1,
  "blog-4": galleryWork29,
  "blog-5": galleryWork20,
};

export default function BlogPreview() {
  const featured = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img src={blogBg} alt="" className="w-full h-full object-cover opacity-[0.06]" />
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">From the blog</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-sans">Tips, guides & window furnishing insights</h2>
        </div>

        <div className={`max-w-3xl mx-auto scroll-fade ${isVisible ? "visible" : ""}`}>
          <div className="bg-card rounded-2xl overflow-hidden shadow-elevated group">
            <div className="h-64 md:h-80 overflow-hidden">
              <img src={imageMap[featured.image] || galleryWork23} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{featured.category}</span>
                <span className="text-xs text-muted-foreground">{featured.date}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{featured.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex gap-4">
                <Link to="/blog"><Button variant="hero" className="gap-2">Read more <ArrowRight className="w-4 h-4" /></Button></Link>
                <Link to="/blog"><Button variant="outline">View all posts</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
