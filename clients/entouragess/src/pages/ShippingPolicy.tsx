import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";

const ShippingPolicy = () => (
  <>
    <SiteHeader />
    <main className="pt-16">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-10 text-center">Shipping Policy</h1>

          <div className="text-left">
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Shipments; Delivery; Title and Risk of Loss.</h2>

            <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground mb-4">
              <li className="leading-relaxed">
                Please check the website for specific delivery options. You will pay all shipping and handling charges unless otherwise specified in the order confirmation.
              </li>
              <li className="leading-relaxed">
                Title and risk of loss pass to you upon our transfer of the products to the carrier. Shipping and delivery dates are estimates only and cannot be guaranteed. We are not liable for any delays in shipments, lost, stolen, or seized shipments after carrier acceptance, law enforcement actions or inspections, or for any delay or loss due to incorrect, incomplete, or outdated shipping information provided by You.
              </li>
            </ol>

            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Damage due to Freight or Shipping.</h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              All of our products are tested for quality, and all shipments are carefully inspected before leaving our warehouse. Upon delivery of your order, please check the product carefully to ensure it has not been damaged during shipping. All claims for missing, defective, or damaged product must be made within forty-eight (48) hours after delivery. Please email our Customer Service Department at:{" "}
              <a href="mailto:info@getentouragegummies.com" className="text-gold hover:underline">info@getentouragegummies.com</a>.
              {" "}When you contact us, please provide detailed information including your order number and a full description of any potential issue with a product.
            </p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>
);

export default ShippingPolicy;
