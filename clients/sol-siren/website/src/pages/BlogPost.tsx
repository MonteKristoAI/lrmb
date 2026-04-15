import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/data/blog";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="bg-background pt-32 pb-24 px-6 text-center min-h-screen">
        <h1 className="font-display text-4xl text-foreground">Post not found</h1>
        <Link
          to="/blog"
          className="mt-6 inline-block font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Journal
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-background pt-24 md:pt-32">
      <article className="mx-auto max-w-3xl px-6 md:px-8 pb-24 md:pb-32">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-block font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Back to Journal
        </Link>

        {/* Meta */}
        <p className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-4">
          {post.date}
        </p>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
          {post.title}
        </h1>

        <p className="mt-6 font-body text-base text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        {/* Hero image */}
        <div className="mt-10 aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="mt-10 space-y-6">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-sm md:text-base text-foreground/80 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="w-12 h-[1px] bg-border my-12" />

        <Link
          to="/blog"
          className="inline-block font-body text-[10px] tracking-ultra-wide uppercase text-foreground border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity"
        >
          ← All Posts
        </Link>
      </article>

      <Footer />
    </main>
  );
};

export default BlogPost;
