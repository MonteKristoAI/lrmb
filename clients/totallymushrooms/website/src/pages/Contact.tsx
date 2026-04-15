import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <section className="pt-28 pb-24">
        <div className="container max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-gradient-gold">Touch</span>
          </h1>
          <p className="text-muted-foreground mb-12">
            Have a question or want to work together? Fill out the form below and we'll get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-4">
              <div className="text-4xl">✓</div>
              <h2 className="text-xl font-bold">Message Sent!</h2>
              <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)} className="border-border hover:bg-secondary mt-4">Send Another</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input placeholder="Your name" required className="bg-card border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="your@email.com" required className="bg-card border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <Textarea placeholder="How can we help?" required rows={6} className="bg-card border-border resize-none" />
              </div>
              <Button type="submit" size="lg" className="w-full">Send Message</Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
