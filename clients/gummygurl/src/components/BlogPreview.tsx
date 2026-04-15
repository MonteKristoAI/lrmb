import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/brandData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import blogHero from "@/assets/blog-featured-hero.webp";

export default function BlogPreview() {
  const featured = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-14 lg:py-20 overflow-hidden bg-background">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span
            className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 block"
            style={{ color: "hsl(217 91% 50%)" }}
          >
            From the Blog
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Hemp education, wellness tips & more
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Learn how hemp-derived products work, what's legal, and how to shop confidently. No medical claims.
          </p>
        </div>

        {/* Featured card */}
        <div className={`max-w-3xl mx-auto scroll-fade ${isVisible ? "visible" : ""}`}>
          <div
            className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group bg-card border border-border shadow-card hover:shadow-elevated"
          >
            <div className="h-52 md:h-72 overflow-hidden">
              <img
                src={blogHero}
                alt="Hemp gummies and tincture bottle"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{ background: "hsl(217 91% 50% / 0.1)", color: "hsl(217 91% 50%)" }}
                >
                  {featured.category}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {featured.date}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 leading-snug text-foreground">
                {featured.title}
              </h3>
              <p className="text-sm leading-relaxed mb-6 line-clamp-2 text-muted-foreground">
                {featured.excerpt}
              </p>
              <div className="flex gap-3">
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80 bg-primary text-primary-foreground"
                >
                  Read more <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80 border border-border text-muted-foreground"
                >
                  View all posts
                </a>
              </div>
            </div>
          </div>

          {/* Compliance micro-line */}
          <p className="text-center mt-8 text-[11px] tracking-wide text-muted-foreground">
            21+ required &nbsp;•&nbsp; COAs available on product pages &nbsp;•&nbsp; No medical claims
          </p>
        </div>
      </div>
    </section>
  );
}
