import { Mail, MapPin, Clock, Store } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";
import silSocial from "@/assets/silhouette-social-cutout.png";

const Contact = () => {
  return (
    <>
      <SiteHeader />
      <main className="pt-16">
        {/* Header */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
          </div>
          <div className="container text-center max-w-2xl mx-auto fade-in relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-muted-foreground">
              Product questions, partnership inquiries, or general feedback. We're here to help.
            </p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="pb-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="fade-in">
                <form className="bg-card border border-border rounded-xl p-6 md:p-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">Full Name <span className="text-destructive">*</span></label>
                    <input id="name" type="text" required placeholder="Your name" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))]" />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">Email Address <span className="text-destructive">*</span></label>
                    <input id="email" type="email" required placeholder="your@email.com" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))]" />
                  </div>
                  <div>
                    <label htmlFor="company" className="text-sm font-medium text-foreground mb-1.5 block">Company / Brand</label>
                    <input id="company" type="text" placeholder="Your company (optional)" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))]" />
                  </div>
                  <div>
                    <label htmlFor="rep-code" className="text-sm font-medium text-foreground mb-1.5 block">Sales Rep Code</label>
                    <input id="rep-code" type="text" placeholder="Enter rep code (if applicable)" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))]" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-foreground mb-1.5 block">Subject <span className="text-destructive">*</span></label>
                    <select id="subject" required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))] appearance-none">
                      <option value="">Select a topic</option>
                      <option>Product Question</option>
                      <option>Partnership Inquiry</option>
                      <option>Wholesale Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">Message <span className="text-destructive">*</span></label>
                    <textarea id="message" rows={5} required placeholder="How can we help?" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--gold))] resize-none" />
                  </div>
                  <button type="submit" className="gold-gradient text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                    Send Message
                  </button>
                  <p className="text-xs text-muted-foreground text-center">We respect your privacy. No spam, ever.</p>
                </form>
              </div>

              {/* Info Cards */}
              <div className="fade-in stagger-1 flex flex-col gap-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg gold-check-bg flex items-center justify-center mb-3">
                      <Mail size={18} className="text-gold" />
                    </div>
                    <div className="text-sm font-bold text-foreground mb-1">Email</div>
                    <a href="mailto:info@getentouragegummies.com" className="text-xs text-muted-foreground hover:text-gold transition-colors break-all">info@getentouragegummies.com</a>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg gold-check-bg flex items-center justify-center mb-3">
                      <MapPin size={18} className="text-gold" />
                    </div>
                    <div className="text-sm font-bold text-foreground mb-1">Location</div>
                    <p className="text-xs text-muted-foreground">Charlotte, North Carolina, USA</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg gold-check-bg flex items-center justify-center mb-3">
                      <Clock size={18} className="text-gold" />
                    </div>
                    <div className="text-sm font-bold text-foreground mb-1">Business Hours</div>
                    <p className="text-xs text-muted-foreground">Monday to Friday, 9AM to 5PM MST</p>
                  </div>
                </div>

                {/* Wholesale Inquiries */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg gold-check-bg flex items-center justify-center flex-shrink-0">
                      <Store size={18} className="text-gold" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-2">Wholesale Inquiries</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Interested in carrying ENTOURAGE gummies in your retail location or distribution network? We'd love to hear from you. Reach out to discuss wholesale pricing, minimum orders, and partnership opportunities.
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gold flex-shrink-0" />
                          <a href="mailto:info@getentouragegummies.com" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                            info@getentouragegummies.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gold flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">Monday to Friday, 9am to 5pm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
};

export default Contact;
