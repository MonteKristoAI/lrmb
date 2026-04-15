import { MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import foundersCampbell from "@/assets/founders-campbell-claire.webp";
import foundersChris from "@/assets/founders-chris-amber.webp";

export default function AboutTeam() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" ref={ref} className="relative py-20 lg:py-28 overflow-hidden bg-secondary/30">
      <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(210 65% 42% / 0.05), transparent 70%)' }} />
      <div className="absolute bottom-10 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(24 75% 50% / 0.04), transparent 70%)' }} />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">Meet the Founders</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">The families behind Luxe Shutters</h2>
          <p className="text-muted-foreground leading-relaxed">Built on trust, integrity, and a shared passion for transforming homes — Luxe Shutters is a family business at heart.</p>
        </div>

        {/* Founder 1 — Campbell & Claire: photo left, text right */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 scroll-fade-left ${isVisible ? "visible" : ""}`}>
          <div className="overflow-hidden rounded-2xl shadow-elevated">
            <img src={foundersCampbell} alt="Campbell & Claire Maxwell" className="w-full h-[450px] lg:h-[520px] object-cover object-top" />
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">Campbell & Claire Maxwell</h3>
            <p className="text-sm font-medium text-primary mb-6">Campbell Maxwell — Director of Operations</p>
            <blockquote className="space-y-4 text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-5">
              <p>"Having been around the industry for 10 years now, it is clear to me that the cornerstone of our success is the experience we provide for our customers.</p>
              <p>We are dedicated to continuously improving our service whether that be during the measure and quote, the installation or as part of our after sales care.</p>
              <p>Having been involved in hundreds of home transformations, I have seen first hand the profound effect that new window furnishings can have on the look and feel of a home."</p>
            </blockquote>
          </div>
        </div>

        {/* Founder 2 — Chris & Amber: text left, photo right */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 scroll-fade-right ${isVisible ? "visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
          <div className="lg:order-2 overflow-hidden rounded-2xl shadow-elevated">
            <img src={foundersChris} alt="Chris & Amber Hanlon" className="w-full h-[650px] lg:h-[750px] object-cover object-[center_45%]" />
          </div>
          <div className="lg:order-1">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">Chris & Amber Hanlon</h3>
            <p className="text-sm font-medium text-primary mb-6">Chris Hanlon — Director of Sales and Marketing</p>
            <blockquote className="space-y-4 text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-5">
              <p>"Raising a young family and growing a business are 2 of the hardest and yet most rewarding adventures we have chosen. Amber and I are passionate about creating a business based on trust, integrity and fun.</p>
              <p>Our goal is to ensure our clients feel the love, commitment and dedication we have towards their home transformations.</p>
              <p>We are extremely grateful to have such incredible business partners in Campbell and Claire and are excited to grow LUXE into a company that benefits generations to come."</p>
            </blockquote>
          </div>
        </div>

        {/* Map */}
        <div className={`scroll-fade ${isVisible ? "visible" : ""}`}>
          <div className="text-center mb-8">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">Our Location</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Where to find us</h2>
            <p className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Temora, New South Wales 2666, Australia
            </p>
          </div>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border/60 shadow-card">
            <iframe
              title="Luxe Shutters location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26000!2d147.5344!3d-34.4468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b2646e1b4e6c7e1%3A0x40609b49043f0!2sTemora+NSW+2666!5e0!3m2!1sen!2sau!4v1700000000000"
              className="w-full h-[350px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}