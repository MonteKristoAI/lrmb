import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";

const RefundPolicy = () => (
  <>
    <SiteHeader />
    <main className="pt-16">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-10 text-center">Terms of Sale and Refund Policy</h1>

          <div className="text-left">
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Terms of Sale.</h2>

            <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground mb-4">
              <li className="leading-relaxed">
                All prices, discounts, and promotions posted on this Website are subject to change without notice. The price charged for a product or service will be the price advertised on this Website at the time the order is placed, subject to the Terms of Use and this Terms of Sale and Refund Policy along with any promotions or discounts that may be applicable. The price charged will be clearly stated in your order confirmation email. Price increases will only apply to orders placed after the time of the increase. Posted prices do not include taxes or charges for shipping and handling. All such taxes and charges will be added to your total price, and will be itemized in your shopping cart and in your order confirmation email. We strive to display accurate price information, however we may, on occasion, make inadvertent typographical errors, inaccuracies or omissions related to pricing and availability. We reserve the right to correct any errors, inaccuracies, or omissions at any time and to cancel any orders arising from such occurrences.
              </li>
              <li className="leading-relaxed">
                <p className="mb-2">Terms of payment are within our sole discretion and payment must be received by us before our acceptance of an order. We accept Mastercard, Visa, American Express and Discover credit cards for all purchases. By purchasing with a credit card, you represent and warrant that:</p>
                <ol className="list-[lower-roman] pl-6 space-y-1">
                  <li>The credit card information you supply to us is true, correct and complete.</li>
                  <li>You are duly authorized to use such credit card for the purchase.</li>
                  <li>Charges incurred by you will be honored by your credit card company.</li>
                  <li>You will pay charges incurred by you at the posted prices, including shipping and handling charges and all applicable taxes.</li>
                </ol>
              </li>
              <li className="leading-relaxed">
                By agreeing to the Terms of Use or purchasing products on the Website you understand that the products available on this Website contain cannabinoids from hemp. They are not for use by or sale to persons who are under the age of 21 or who are pregnant or nursing. Products may have potential for abuse, could lead to addiction or dependency, and may cause users to fail a drug test. Products may cause drowsiness or impairment and may take two hours or more to take effect. Finally, our products have not been evaluated by the FDA, and we make no claims as to any capacity for our products to diagnose, treat, mitigate, cure or prevent any disease. Always consult with a licensed healthcare professional before trying any hemp product.
              </li>
            </ol>

            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Refund Policy.</h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Except for any products designated on the Website as non-returnable, we will accept a return of the products for a refund of your purchase price, less the original shipping and handling costs, provided such return is made within ten (10) days of delivery with valid proof of purchase and provided such products are returned in their original condition. Please email our Customer Service Department at{" "}
              <a href="mailto:info@getentouragegummies.com" className="text-gold hover:underline">info@getentouragegummies.com</a>
              {" "}to obtain a Return Merchandise Authorization ("RMA") number before shipping your product. No returns of any type will be accepted without an RMA number.
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You are responsible for all shipping and handling charges on returned items unless otherwise specified. You bear the risk of loss during shipment. We therefore strongly recommend that you fully insure your return shipment against loss or damage and that you use a carrier that can provide you with proof of delivery for your protection.
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Refunds are processed within approximately three (3) business days of our receipt of your merchandise. Your refund will be credited back to the same payment method used to make the original purchase on the Website. WE OFFER NO REFUNDS ON ANY PRODUCTS DESIGNATED ON THIS SITE AS NON-RETURNABLE.
            </p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>
);

export default RefundPolicy;
