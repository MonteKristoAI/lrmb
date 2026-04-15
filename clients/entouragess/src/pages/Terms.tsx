import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";

const Terms = () => (
  <>
    <SiteHeader />
    <main className="pt-16">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-10 text-center">Terms of Use</h1>

          <div className="text-left space-y-2">
            {/* Section 1 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">1. Acceptance of the Terms of Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              These Terms of Use are entered into by and between You and K'town Squishes, LLC ("ENTOURAGE," "Company," "we," or "us"). The following terms and conditions, together with any documents they expressly incorporate by reference, collectively, ("Terms of Use") govern your access to and use of{" "}
              <a href="https://www.getentouragegummies.com" className="text-gold hover:underline">www.getentouragegummies.com</a>, including any content, functionality, and services offered on or through{" "}
              <a href="https://www.getentouragegummies.com" className="text-gold hover:underline">www.getentouragegummies.com</a>, (the "Website") whether as a guest or a registered user.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Please read the Terms of Use carefully before you start to use the Website. By using the Website, applying for an account, or placing an order, or by clicking or agree to the Terms of Use when this option is made available to you, you accept and agree to be bound and abide by these Terms of Use, our Privacy Policy, our Terms of Sale and Refund Policy, our Shipping Policy, and our Copyright Policy.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              This Website is offered and available to users who are 21 years or older and reside in the United States or any of its territories or possessions and approved business customers.
            </p>

            {/* Section 2 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">2. Changes to the Terms of Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We may revise and update these Terms of Use from time to time in our sole discretion. All changes are effective immediately when we post them.
            </p>

            {/* Section 3 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">3. Accessing the Website and Account Security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We reserve the right to withdraw or amend this Website, and any service or material we provide on the Website, in our sole discretion without notice.
            </p>

            {/* Section 4 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">4. Intellectual Property Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              This Website and its entire contents, features, and functionality are owned by the Company, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>

            {/* Section 5 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">5. Trademarks</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The Company name, the term TiME INFUSION, the Company logo, and all related names, logos, product and service names, designs, and slogans are trademarks of the Company or its affiliates or licensors.
            </p>

            {/* Section 6 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">6. Prohibited Uses</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You may use the Website only for lawful purposes and in accordance with these Terms of Use.
            </p>

            {/* Section 7 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">7. User Contributions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The Website may contain message boards, chat rooms, personal web pages or profiles, forums, bulletin boards, and other interactive features.
            </p>

            {/* Section 8 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">8. Monitoring and Enforcement; Termination</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground mb-4">
              <li>Remove or refuse to post any User Contributions</li>
              <li>Take any action with respect to any User Contribution</li>
              <li>Disclose your identity</li>
              <li>Take appropriate legal action</li>
              <li>Terminate or suspend your access</li>
            </ul>

            {/* Section 9 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">9. Content Standards</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              These content standards apply to any and all User Contributions and use of Interactive Services.
            </p>

            {/* Section 10 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">10. Copyright Infringement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              If you believe any User Contributions violate your copyright, please send us a notice pursuant to our Copyright Policy.
            </p>

            {/* Section 11 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">11. Reliance on Information Posted</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The information presented on or through the Website is made available solely for general information purposes. Any statements on this Website or any materials or products the Company sells or distributes have not been evaluated by the United States Food and Drug Administration (FDA).
            </p>

            {/* Section 12 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">12. Changes to the Website</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We may update the content on this Website from time to time, but its content is not necessarily complete or up-to-date.
            </p>

            {/* Section 13 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">13. Information About You and Your Visits to the Website</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              All information we collect on this Website is subject to our Privacy Policy.
            </p>

            {/* Section 14 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">14. Online Purchase and Other Terms and Conditions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              All purchases through our Website and other transactions for the sale of goods formed through the Website are governed by our Terms of Sale and Refund Policy and our Shipping Policy.
            </p>

            {/* Section 15 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">15. Order Acceptance and Cancellation</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You agree that your order is an offer to buy, under these Terms of Use and the Terms of Sale and Refund Policy, all products and services listed in your order.
            </p>

            {/* Section 16 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">16. Linking to the Website and Social Media Features</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You may link to our homepage, provided you do so in a way that is fair and legal.
            </p>

            {/* Section 17 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">17. Links from the Website</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              If the Website contains links to other sites and resources provided by third parties, these links are provided for your convenience only.
            </p>

            {/* Section 18 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">18. Geographic Restrictions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The owner of this Website is based in the State of North Carolina in the United States.
            </p>

            {/* Section 19 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">19. Disclaimer of Warranties</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 uppercase">
              Your use of this Website, its content, and any services or items obtained through the Website are at your own risk. The content, any services or items obtained through the Website are provided on an "as is" and "as available" basis, without any warranties of any kind.
            </p>

            {/* Section 20 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">20. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 uppercase">
              In no event shall we be liable to you or any third party for consequential, indirect, incidental, special, exemplary, punitive or enhanced damages.
            </p>

            {/* Section 21 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">21. Indemnification</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You agree to defend, indemnify, and hold harmless the Company, its affiliates, licensors, and service providers.
            </p>

            {/* Section 22 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">22. Governing Law and Jurisdiction</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              All matters relating to the Website and these Terms of Use shall be governed by and construed in accordance with the internal laws of the State of North Carolina.
            </p>

            {/* Section 23 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">23. Waiver of Jury Trials and Binding Arbitration</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 uppercase">
              You and Entourage are agreeing to give up any rights to litigate claims in a court or before a jury. Any claim, dispute or controversy will be resolved exclusively and finally by binding arbitration administered by the American Arbitration Association ("AAA") applying North Carolina law.
            </p>

            {/* Section 24 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">24. Limitation on Time to File Claims</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 uppercase">
              Any cause of action or claim you may have must be commenced within one (1) year after the cause of action accrues.
            </p>

            {/* Section 25 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">25. Waiver and Severability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              No waiver by the Company of any term or condition set forth in these Terms of Use shall be deemed a further or continuing waiver.
            </p>

            {/* Section 26 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">26. Entire Agreement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The Terms of Use, our Privacy Policy, our Terms of Sale and Refund Policy, our Shipping Policy, and our Copyright Policy constitute the sole and entire agreement between you and K'town Squishes, LLC.
            </p>

            {/* Section 27 */}
            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">27. Your Comments and Concerns</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              All feedback, comments, requests for technical support, and other communications relating to the Website should be directed to:{" "}
              <a href="mailto:info@getentouragegummies.com" className="text-gold hover:underline">info@getentouragegummies.com</a>
            </p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>
);

export default Terms;
