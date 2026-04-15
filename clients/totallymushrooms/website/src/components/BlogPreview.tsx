import { Link } from "react-router-dom";
import { blogPosts } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const BlogPreview = () => (
  <section className="py-28">
    <div className="container">
      <div className="flex items-end justify-between mb-16">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">The Journal</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light">
            Research &amp; <span className="text-gradient-gold italic">Insights</span>
          </h2>
        </div>
        <Link to="/blog"
          className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-foreground/60 hover:text-primary transition-colors duration-300 group font-medium"
        >
          All Articles
          <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/15 rounded-sm overflow-hidden">
        {blogPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="group bg-card hover:bg-card/80 transition-all duration-500">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={post.image} alt={post.title}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
            </div>
            <div className="p-8 space-y-4">
              <div className="flex gap-4 text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-lg font-heading text-foreground group-hover:text-primary transition-colors duration-500 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default BlogPreview;
