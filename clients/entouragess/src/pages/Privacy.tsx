import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";

const Privacy = () => (
  <>
    <SiteHeader />
    <main className="pt-16">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-6 text-center">Privacy Policy</h1>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            This Privacy Policy is a part of our Terms of Use. By using this Website or our online store, you agree to be bound by and comply with this Privacy Policy and our Terms of Use.
          </p>

          {/* 1. Age Restrictions */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">1. Age Restrictions on Access and Purchases</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            You must be at least 21 years old to access this site. If you are under 21 years old you are not permitted to use this site for any reason. You must be of legal age required by the state or province you are in to purchase our products. It is your responsibility to know whether you are legally able to purchase our products.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            If we learn we have collected or received personal information from a person under the age of 21 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a person under the age of 21, please contact us at:{" "}
            <a href="mailto:info@getentouragegummies.com" className="text-gold hover:underline">info@getentouragegummies.com</a>
          </p>

          {/* 2. What Information */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">2. What Information Do We Gather and What Do We Do With It?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            When you purchase something from our online store, as part of the buying and selling process, we collect the personal information you give us such as your name, address and email address, account credentials, order history and communications with our support team. We also use cookies, web beacons or other tools that collect information that make it easier to use our store and our site.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            When you visit our site, some information is automatically collected. This may include information such as the Operating System (OS) running on your device, Internet Protocol (IP) address (which may be used to obtain your geolocation), access times, browser type and language, and the website you visited before our site. We also collect information about how you use our site, including the elements you have interacted with, metadata and other details about these elements, change states and other user actions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            In general, we use the information we collect primarily to provide, maintain, protect and improve our current site and products and to develop new products. We use personal information collected through our site as described below and described elsewhere in this Policy to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground mb-4">
            <li>Facilitate the creation of and securing of your Account on our network;</li>
            <li>Identify you as a user in our system;</li>
            <li>Improve our products, site, and how we operate our business;</li>
            <li>Understand and enhance user experience of our site and products;</li>
            <li>Provide and deliver the products and services you request;</li>
            <li>Respond to your comments or questions and for our support team to provide service;</li>
            <li>Send you related information, including confirmations, invoices, technical notices, updates, security alerts and support and administrative messages;</li>
            <li>Communicate with you about promotions, upcoming events and news about products and services offered by ENTOURAGE and our selected partners, and for other marketing purposes of ENTOURAGE;</li>
            <li>Link or combine your information with other information we get from third parties to help understand your needs and provide you with better service; and</li>
            <li>Protect, investigate and deter against fraudulent, unauthorized or illegal activity.</li>
          </ul>

          <h3 className="text-base font-bold text-foreground mt-6 mb-2">California Privacy Rights</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            If you are a California resident, California law may provide you with additional rights regarding the use of your personal information.
          </p>

          <h3 className="text-base font-bold text-foreground mt-6 mb-2">Email Marketing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            By providing us with your email address, you are giving us permission to send you emails about our store, new products and other updates. You have the opportunity to unsubscribe from these emails at any time by clicking the "Unsubscribe" button included at the bottom of each email.
          </p>

          {/* 3. Behavioral Advertising */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">3. Behavioral Advertising</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            As described above, we may use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground mb-4">
            <li>We may use Google Analytics to help us understand how our customers use the Site.</li>
            <li>We may share information about your use of the Site, your purchases, and your interaction with our ads on other websites with our advertising partners.</li>
            <li>We may use services such as Shopify Audiences to help us show ads on other websites.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            You can opt out of targeted advertising by:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground mb-4">
            <li>FACEBOOK</li>
            <li>GOOGLE</li>
            <li>BING</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Additionally, you can opt out of some of these services by visiting the Digital Advertising Alliance's opt-out portal at:{" "}
            <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">https://optout.aboutads.info/</a>
          </p>

          {/* 4. Cookies */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">4. More Information on Cookies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A cookie is a small amount of information that's downloaded to your computer or device when you visit our Site. We use a number of different cookies, including functional, performance, advertising, and social media or content cookies.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Most browsers automatically accept cookies, but you can choose whether or not to accept cookies through your browser controls.
          </p>

          {/* 5. Consent */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">5. Consent</h2>
          <h3 className="text-base font-bold text-foreground mt-6 mb-2">A. How do you get my consent?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            By executing a transaction, and any time you provide us with personal information for the purpose of completing a transaction, placing an order, arranging for a delivery or return of a purchase you consent to us collecting and using your information as described herein.
          </p>
          <h3 className="text-base font-bold text-foreground mt-6 mb-2">B. How do I withdraw my consent?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            You may withdraw your consent for us to use your personal information and from receiving email communications by clicking the "Unsubscribe" button included at the bottom of each email or contacting us at:{" "}
            <a href="mailto:info@getentouragegummies.com" className="text-gold hover:underline">info@getentouragegummies.com</a>
          </p>

          {/* 6. Disclosure */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">6. Disclosure</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We do not share your personal information with third parties without your consent other than with the following:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground mb-4">
            <li>Third Party Service Providers</li>
            <li>Lawful Requests</li>
            <li>Protection of Rights and Property</li>
            <li>Emergency</li>
            <li>Corporate Restructuring</li>
          </ul>

          {/* 7. Payment Processing */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">7. Payment Processing</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            If you provide us with your credit card information during the payment process, we send it to our PCI-DSS compliant payment gateway for processing using SSL encryption technology. Your credit card information is never stored for use beyond the transaction for which it was supplied.
          </p>

          {/* 8. Third-Party Services */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">8. Third-Party Services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Our Policy does not cover any third-party services. To learn about those third parties' privacy practices, please read their privacy policies.
          </p>

          {/* 9. Security */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">9. Security</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            To protect your personal information, we take reasonable precautions and follow generally accepted industry practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
          </p>

          {/* 10. Age of Consent */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">10. Age of Consent</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Our website is not intended for children under 21 years of age. No one under the age of 21 may provide information to or on the website. We do not knowingly collect personal information from persons under 21.
          </p>

          {/* 11. United States Law */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">11. United States Law Applies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            This site is intended for users located in the United States.
          </p>

          {/* 12. Changes */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">12. Changes to This Privacy Policy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We reserve the right to modify this Privacy Policy at any time, so please review it frequently.
          </p>

          {/* Contact */}
          <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Questions and Contact Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information, please email our customer service team at:{" "}
            <a href="mailto:info@getentouragegummies.com" className="text-gold hover:underline">info@getentouragegummies.com</a>
          </p>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>
);

export default Privacy;
