import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blog";
import Footer from "@/components/Footer";

const Blog = () => {
  return (
    <main className="bg-background pt-24 md:pt-32">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 md:px-16 mb-16 text-center">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground">
          The Journal
        </h1>
        <p className="mt-4 font-body text-sm text-muted-foreground">
          Stories, style guides, and reflections on timeless fashion.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-16 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-5">
                <p className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-2">
                  {post.date}
                </p>
                <h3 className="font-display text-xl md:text-2xl font-light text-foreground group-hover:opacity-70 transition-opacity">
                  {post.title}
                </h3>
                <p className="mt-2 font-body text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-block font-body text-[10px] tracking-ultra-wide uppercase text-foreground border-b border-foreground pb-0.5">
                  Read More
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Blog;
