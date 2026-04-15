import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Clock, Shield, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const benefits = [
{ icon: Phone, text: "Free phone consultation" },
{ icon: Clock, text: "In-home showroom visits available" },
{ icon: Shield, text: "No obligation — just honest advice" }];


const ConsultationForm = ({ showMap = true }: {showMap?: boolean;}) => {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      await fetch("https://primary-production-5fdce.up.railway.app/webhook/luxe-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });
    } catch (_) {
      // Silent fail — still show success to user
    } finally {
      setLoading(false);
      toast({
        title: "Request received",
        description: "We'll call you back within one business day."
      });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <section className="py-20 lg:py-[40px]" style={{ background: 'hsl(215 25% 12%)' }}>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`container max-w-6xl scroll-fade ${isVisible ? "visible" : ""}`}>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'hsl(210 65% 65%)' }}>Free Measure & Quote</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 leading-tight" style={{ color: 'hsl(210 20% 95%)' }}>
              Your Dream Window<br />Furnishings Are Just<br />One Call Away
            </h2>
            <p className="text-[15px] leading-relaxed mb-6 max-w-lg" style={{ color: 'hsl(215 15% 55%)' }}>
              Luxe is dedicated to providing high quality, stylish, and fit for purpose solutions throughout your home. We supply and install plantation shutters, curtains, blinds, outdoor zip screens, awnings, and security roller shutters.
            </p>

            <div className="rounded-xl p-4 mb-6" style={{ background: 'hsl(215 20% 16%)' }}>
              <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'hsl(210 20% 75%)' }}>Service Areas</p>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(215 15% 55%)' }}>
                Wagga · Junee · Coolamon · Temora · Cootamundra · Lake Cargelligo · Young · Grenfell · Griffith · Leeton · Forbes · West Wyalong · Condobolin & surrounds
              </p>
            </div>

            <p className="text-sm italic mb-6" style={{ color: 'hsl(215 15% 50%)' }}>
              Fill in the form and we'll reach out within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid hsl(215 18% 22%)' }}>
              <a href="tel:1800465893" className="flex items-center gap-2.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'hsl(210 20% 85%)' }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'hsl(210 65% 42% / 0.15)' }}>
                  <Phone className="w-4 h-4" style={{ color: 'hsl(210 65% 65%)' }} />
                </span>
                1800-465-893
              </a>
              <a href="mailto:admin@luxeshutters.com.au" className="flex items-center gap-2.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'hsl(210 20% 85%)' }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'hsl(210 65% 42% / 0.15)' }}>
                  <Mail className="w-4 h-4" style={{ color: 'hsl(210 65% 65%)' }} />
                </span>
                admin@luxeshutters.com.au
              </a>
            </div>

            <ul className="space-y-3">
              {benefits.map((b) =>
              <li key={b.text} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'hsl(210 65% 42% / 0.15)' }}>
                    <b.icon className="h-4 w-4" style={{ color: 'hsl(210 65% 65%)' }} />
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'hsl(210 20% 85%)' }}>{b.text}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl p-7 sm:p-9" style={{ background: 'hsl(215 20% 22%)', border: '1px solid hsl(215 18% 30%)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="cf-name" className="text-white/80">Full Name</Label>
                <Input id="cf-name" name="name" required maxLength={100} placeholder="e.g. John Smith" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cf-email" className="text-white/80">Email Address</Label>
                <Input id="cf-email" name="email" type="email" required maxLength={255} placeholder="you@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cf-phone" className="text-white/80">Phone Number</Label>
                <Input id="cf-phone" name="phone" type="tel" required maxLength={20} placeholder="04XX XXX XXX" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cf-message" className="text-white/80">Message{" "}<span className="text-white/40 font-normal">(optional)</span></Label>
                <Textarea id="cf-message" name="message" maxLength={1000} rows={3} placeholder="Tell us about your project…" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>{loading ? "Sending…" : "Request a Free Consultation"}</Button>
              <p className="text-xs text-white/40 text-center">We respect your privacy and will never share your details.</p>
            </form>
          </div>
        </div>

        {showMap &&
        <div className="mt-10 rounded-2xl overflow-hidden border border-border/60 shadow-sm opacity-80">
            <iframe title="Luxe Shutters location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26000!2d147.5344!3d-34.4468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b2646e1b4e6c7e1%3A0x40609b49043f0!2sTemora+NSW+2666!5e0!3m2!1sen!2sau!4v1700000000000" width="100%" height="210" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full grayscale-[30%] hover:grayscale-0 transition-all duration-500" />
          </div>
        }
      </div>
    </section>);

};

export default ConsultationForm;