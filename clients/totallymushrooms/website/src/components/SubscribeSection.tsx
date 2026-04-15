import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24">
      <div className="container">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe & <span className="text-gradient-gold">Save</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Get 15% off your first order and stay updated on new products, exclusive deals, and wellness tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border"
            />
            <Button className="shrink-0">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
