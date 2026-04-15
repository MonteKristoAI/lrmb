import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { blogPosts } from "@/lib/data";
import { Button } from "@/components/ui/button";

const BlogList = () => (
  <Layout>
    <section className="pt-28 pb-24">
      <div className="container">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          The <span className="text-gradient-gold">Journal</span>
        </h1>
        <p className="text-muted-foreground mb-12 max-w-lg">Explore the science, culture, and wellness benefits of functional mushrooms.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group rounded-xl border border-border bg-card overflow-hidden hover-card-lift">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-foreground leading-snug">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return <Layout><div className="pt-28 pb-24 container text-center"><h1 className="text-2xl font-bold mb-4">Post not found</h1><Link to="/blog"><Button>Back to Blog</Button></Link></div></Layout>;
  }

  return (
    <Layout>
      <article className="pt-28 pb-24">
        <div className="container max-w-3xl">
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-8 inline-block">← Back to Journal</Link>
          <div className="flex gap-3 text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{post.title}</h1>
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover" />
          </div>
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-6">
            <p>{post.excerpt}</p>
            <p>Functional mushrooms have been used for centuries in traditional medicine across Asia and Europe. Modern research is finally catching up, validating what ancient healers knew all along — these remarkable organisms contain potent bioactive compounds that support our bodies in profound ways.</p>
            <h2 className="text-xl font-bold text-foreground">The Science Behind It</h2>
            <p>Beta-glucans, the primary active compounds in medicinal mushrooms, work by modulating the immune system. They don't simply "boost" immunity — they help regulate it, promoting a balanced immune response. This makes mushroom supplements beneficial whether you're looking to strengthen your defenses or calm an overactive immune system.</p>
            <h2 className="text-xl font-bold text-foreground">How to Get Started</h2>
            <p>Start with one mushroom that aligns with your primary health goal. Lion's Mane for cognitive support, Cordyceps for energy, Reishi for relaxation and sleep, or Chaga for immune defense. Consistency is key — most people notice benefits within 2-4 weeks of daily use.</p>
            <p>Remember to choose products made from fruiting bodies rather than mycelium on grain, and look for third-party lab testing to ensure purity and potency.</p>
          </div>
        </div>
      </article>
    </Layout>
  );
};

const Blog = () => {
  const { id } = useParams();
  return id ? <BlogPost /> : <BlogList />;
};

export default Blog;
