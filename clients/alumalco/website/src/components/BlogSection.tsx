import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/data/blogData";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const featured = BLOG_POSTS[0];

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-4">
            Insights
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Our <span className="text-gradient-warm">Blog</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Expert advice, industry trends, and project inspiration from the Alumalco team.
          </p>
        </div>

        {/* Featured Post */}
        <Link to={`/blog/${featured.id}`} className="group block">
          <div className="relative rounded-lg overflow-hidden border border-border bg-card hover:border-primary/30 transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-4">
                  {featured.category}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {featured.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {featured.readTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10">
            <Link to="/blog">
              View All Articles <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
