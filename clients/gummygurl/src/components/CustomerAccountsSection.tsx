import { ClipboardList, CalendarSync, FileCheck } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import sectionManageOrders from "@/assets/section-manage-orders.webp";

const features = [
  { icon: ClipboardList, text: "Track your order history" },
  { icon: CalendarSync, text: "Manage subscriptions and delivery schedules" },
  { icon: FileCheck, text: "Access product lab results (COAs)" },
];

const CustomerAccountsSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center mb-2">
          Your Account
        </p>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground text-center mb-3">
          Manage Your Orders &amp; Subscriptions
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6 text-base leading-relaxed">
          Create a personal account to track orders, manage subscriptions, view lab results, and update your delivery preferences — all in one convenient place.
        </p>

        <div className="max-w-2xl mx-auto mb-10 rounded-2xl overflow-hidden">
          <OptimizedImage
            src={sectionManageOrders}
            alt="Package delivered with care"
            aspectRatio="16/9"
            className="w-full h-full object-cover"
          />
        </div>

        <ul className="space-y-4 max-w-md mx-auto mb-8">
          {features.map((f) => (
            <li key={f.text} className="flex items-center gap-4">
              <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground text-[15px]">{f.text}</span>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <a href="/account" className="text-sm font-medium text-primary hover:underline">
            Go to My Account →
          </a>
        </div>
      </div>
    </section>
  );
};

export default CustomerAccountsSection;
