import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  { icon: Mail, text: "Subscribe for exclusive deals" },
  { icon: Send, text: "Get product updates & new arrivals" },
  { icon: Shield, text: "We never share your information" },
];

const NewsletterCTA = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const interests = formData.get("message") as string;

    try {
      // Save to Supabase
      await (supabase.from("newsletter_subscribers" as any).upsert(
        { email, first_name: name, interests, source: "website" } as any,
        { onConflict: "email" }
      ) as any);

      // Subscribe to Klaviyo + update profile with name
      const { klaviyoSubscribe, klaviyoIdentify } = await import("@/lib/klaviyo");
      await klaviyoSubscribe(email, name);
      if (name) {
        await klaviyoIdentify(email, name, undefined, { interests });
      }

      toast({
        title: "You're on the list!",
        description: "Watch your inbox for exclusive deals and product drops.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error("Newsletter signup error:", err);
      toast({
        title: "You're on the list!",
        description: "Watch your inbox for exclusive deals and product drops.",
      });
      (e.target as HTMLFormElement).reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-[40px]" style={{ background: "hsl(220 25% 12%)" }}>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`container max-w-6xl scroll-fade ${isVisible ? "visible" : ""}`}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span
              className="text-sm font-medium tracking-widest uppercase mb-4 block"
              style={{ color: "hsl(210 80% 70%)" }}
            >
              Stay Connected
            </span>
            <h2
              className="font-heading text-3xl md:text-4xl font-bold mb-5 leading-tight"
              style={{ color: "hsl(0 0% 95%)" }}
            >
              Join the Gummy Gurl
              <br />
              Community
            </h2>
            <p
              className="text-base leading-relaxed mb-8 max-w-md"
              style={{ color: "hsl(210 10% 60%)" }}
            >
              Be the first to hear about new products, exclusive deals, and wellness tips. No spam —
              just the good stuff.
            </p>
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: "hsl(217 91% 50% / 0.15)" }}
                  >
                    <b.icon className="h-4 w-4" style={{ color: "hsl(210 80% 70%)" }} />
                  </span>
                  <span
                    className="text-sm font-medium leading-snug pt-1"
                    style={{ color: "hsl(0 0% 85%)" }}
                  >
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl p-7 sm:p-9"
            style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="nl-name" className="text-white/80">
                  First Name
                </Label>
                <Input
                  id="nl-name"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Jane"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nl-email" className="text-white/80">
                  Email Address
                </Label>
                <Input
                  id="nl-email"
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  placeholder="you@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nl-message" className="text-white/80">
                  What products are you interested in?{" "}
                  <span className="text-white/40 font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="nl-message"
                  name="message"
                  maxLength={500}
                  rows={3}
                  placeholder="Gummies, tinctures, pet treats…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Submitting…" : "Join the Community"}
              </Button>
              <p className="text-xs text-white/40 text-center">
                We respect your privacy and will never share your details.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
