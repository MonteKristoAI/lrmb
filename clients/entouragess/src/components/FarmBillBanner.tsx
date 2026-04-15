import { BRAND_NAME } from "@/lib/brand";

const FarmBillBanner = () => (
  <div className="py-4 border-t border-border">
    <div className="container">
      <p className="text-[0.65rem] text-muted-foreground/70 text-center leading-relaxed">
        All {BRAND_NAME} products are derived from hemp and comply with the 2018 Farm Bill, containing less than 0.3% Delta 9 THC by dry weight.
      </p>
      <p className="text-[0.65rem] text-muted-foreground/70 text-center leading-relaxed mt-1">
        These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </div>
  </div>
);

export default FarmBillBanner;
