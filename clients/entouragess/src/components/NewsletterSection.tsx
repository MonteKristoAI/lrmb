import { useState } from "react";
import { BRAND_NAME } from "@/lib/brand";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useScrollReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-24" ref={ref}>
      <div className="container max-w-2xl">
        <div className="text-center glass-card rounded-2xl p-12 md:p-16">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Stay in the Loop</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            New {BRAND_NAME} products, effect guides, and exclusive drops, delivered to your inbox.
          </p>
          {submitted ? (
            <p className="text-gold font-bold text-lg">Thanks for subscribing! 🎉</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-w-0 bg-secondary border border-border rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full gold-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
