import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We'll get back to you shortly.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mt-4 mb-6">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Have a project in mind or need more information? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                Contact Information
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-3 mb-4">
                Let's Start a Conversation
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're planning a new build or renovation, our team is ready to help you find the perfect aluminum window and door solutions.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <a
                href="tel:18558266799"
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-sm shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-muted-foreground text-sm">1 (855) 826-6799</p>
                </div>
              </a>

              <a
                href="mailto:info@alumalco.ca"
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-sm shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-muted-foreground text-sm">info@alumalco.ca</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-sm shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-muted-foreground text-sm">
                    Servicing Quebec &amp; Ontario, Canada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="bg-muted/40 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="bg-muted/40 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={20}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="bg-muted/40 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Subject <span className="text-primary">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-muted/40 border border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors rounded-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="quote">Request a Quote</option>
                    <option value="products">Product Inquiry</option>
                    <option value="installation">Installation Question</option>
                    <option value="support">After-Sales Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  className="bg-muted/40 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors rounded-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start bg-primary text-primary-foreground px-10 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
