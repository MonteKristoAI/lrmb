import { COMPLIANCE_NOTICES } from "@/data/brandData";
import OptimizedImage from "@/components/OptimizedImage";
import sectionCompliance from "@/assets/section-compliance.webp";

export default function ComplianceBanner() {
  return (
    <section className="py-12" style={{ background: "hsl(210 20% 96%)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden">
            <OptimizedImage
              src={sectionCompliance}
              alt="Lab technician inspecting THC gummies with Certificate of Analysis"
              aspectRatio="16/11"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-foreground">
              Compliance & Transparency
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {COMPLIANCE_NOTICES.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
