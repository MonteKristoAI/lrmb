import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, BadgePercent, CalendarClock } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import sectionSubscribe from "@/assets/section-subscribe-save.webp";

const benefits = [
  {
    icon: BadgePercent,
    title: "Save 10% Every Order",
    description: "Get 10% off every recurring delivery. The discount applies automatically when you subscribe.",
  },
  {
    icon: CalendarClock,
    title: "Choose Your Frequency",
    description: "Delivered every 2 weeks, monthly, every 2 months, or every 3 months. Change anytime from your account.",
  },
  {
    icon: RefreshCw,
    title: "Cancel Anytime",
    description: "No commitments. Manage, pause, or cancel your subscription from your account dashboard.",
  },
];

const SubscribeSection = () => {
  return (
    <section id="subscribe" className="py-12 bg-secondary">
      <div className="container mx-auto px-4 max-w-5xl">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center mb-2">
          Subscribe &amp; Save
        </p>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground text-center mb-3">
          Subscribe &amp; Save 10%
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6 text-base leading-relaxed">
          Save 10% on recurring product orders. Choose your delivery frequency, manage your subscriptions through your account, and cancel anytime.
        </p>

        <div className="max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden">
          <OptimizedImage
            src={sectionSubscribe}
            alt="Subscribe and save – featured product bundles"
            aspectRatio="16/10"
            className="w-full h-full object-contain bg-secondary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {benefits.map((b) => (
            <Card key={b.title} className="border-border/60 shadow-none bg-card">
              <CardContent className="p-6 text-center flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-base">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <a href="/shop" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Browse &amp; Subscribe
          </a>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
