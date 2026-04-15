import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blog";

const BlogSection = () => {
  const featured = blogPosts.slice(0, 3);

  return (
    <section className="bg-background py-24 md:py-32 px-6 md:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-4">
            Stories & Style
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-foreground">
            From the Journal
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {featured.map((post) => (
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

        {/* View All */}
        <div className="text-center mt-14">
          <Link
            to="/blog"
            className="inline-block border border-foreground bg-transparent text-foreground px-10 py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground hover:text-primary-foreground transition-colors duration-300"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
