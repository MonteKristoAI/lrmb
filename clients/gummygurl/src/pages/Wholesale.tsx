import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplianceBanner from "@/components/ComplianceBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Truck, BadgeCheck, Send } from "lucide-react";
import { toast } from "sonner";

const perks = [
  {
    icon: Store,
    title: "Retail-Ready Products",
    text: "High-quality, compliant hemp products with strong branding and customer appeal.",
  },
  {
    icon: Truck,
    title: "Flexible Fulfillment",
    text: "Competitive MOQs, reliable supply chain, and nationwide shipping where permitted.",
  },
  {
    icon: BadgeCheck,
    title: "Full Compliance Support",
    text: "COAs, lab results, and regulatory documentation provided for every product line.",
  },
];

export default function Wholesale() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    volume: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please fill in at least your name and email.");
      return;
    }
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      toast.success("Inquiry submitted!", { description: "Our wholesale team will be in touch shortly." });
      setForm({ name: "", company: "", email: "", phone: "", volume: "", message: "" });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 block text-primary">
              Partner With Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Wholesale
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Interested in carrying Gummy Gurl products in your store? We offer wholesale pricing, marketing support, and full compliance documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {perks.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl p-8 bg-card border border-border shadow-soft text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Wholesale Inquiry Form */}
          <div className="rounded-2xl p-8 lg:p-12 max-w-2xl mx-auto bg-card border border-border shadow-soft">
            <h2 className="font-heading text-2xl font-bold mb-2 text-foreground text-center">
              Wholesale Inquiry
            </h2>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              Fill out the form below and our wholesale team will get back to you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(555) 000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Estimated Order Volume</Label>
                <Input id="volume" name="volume" value={form.volume} onChange={handleChange} placeholder="e.g., 500 units/month" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your business and what products you're interested in..." rows={4} />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <ComplianceBanner />
      <Footer />
    </div>
  );
}
