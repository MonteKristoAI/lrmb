import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/data/blogData";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Content */}
        <article className="container mx-auto px-4 max-w-3xl -mt-32 relative z-10 pb-20">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground mb-6 hover:text-primary">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
          </Button>

          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-4">
            {post.category}
          </span>

          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 pb-10 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>

          <div className="prose prose-invert prose-lg max-w-none [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6 [&_li]:text-muted-foreground [&_strong]:text-foreground [&_ul]:space-y-2 [&_ul]:mb-6">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return <h2 key={i}>{block.replace("## ", "")}</h2>;
              }
              if (block.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-6">
                    {block.split("\n").map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    ))}
                  </ul>
                );
              }
              return <p key={i} dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
            })}
          </div>
        </article>
      </main>
    </>
  );
};

export default BlogPost;
