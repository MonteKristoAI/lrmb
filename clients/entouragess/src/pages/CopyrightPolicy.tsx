import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import silRelaxed from "@/assets/silhouette-relaxed-cutout.png";

const CopyrightPolicy = () => (
  <>
    <SiteHeader />
    <main className="pt-16">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={silRelaxed} alt="" className="w-[60%] max-w-2xl opacity-[0.06] translate-y-[15%] select-none" />
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-10 text-center">Copyright Policy</h1>
          <div className="text-left">

            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Reporting Claims of Copyright Infringement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We take claims of copyright infringement seriously. We will respond to notices of alleged copyright infringement that comply with applicable law. If you believe any materials accessible on or from this site (the "Website") infringe your copyright, you may request removal of those materials (or access to them) from the Website by submitting written notification to our copyright agent designated below. In accordance with the Online Copyright Infringement Liability Limitation Act of the Digital Millennium Copyright Act (17 U.S.C. &#167; 512) ("DMCA"), the written notice (the "DMCA Notice") must include substantially the following:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-sm text-muted-foreground mb-6">
              <li>Your physical or electronic signature.</li>
              <li>Identification of the copyrighted work you believe to have been infringed or, if the claim involves multiple works on the Website, a representative list of such works.</li>
              <li>Identification of the material you believe to be infringing in a sufficiently precise manner to allow us to locate that material.</li>
              <li>Adequate information by which we can contact you (including your name, postal address, telephone number, and, if available, email address).</li>
              <li>A statement that you have a good faith belief that use of the copyrighted material is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the written notice is accurate.</li>
              <li>A statement, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
            </ol>

            <p className="text-sm text-muted-foreground leading-relaxed mb-2">Our designated copyright agent to receive DMCA Notices is:</p>
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <p className="text-sm text-foreground font-semibold">K'town Squishes, LLC</p>
              <p className="text-sm text-muted-foreground">2918 Wicklow Place</p>
              <p className="text-sm text-muted-foreground">Charlotte, NC 28205</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              If you fail to comply with all of the requirements of Section 512(c)(3) of the DMCA, your DMCA Notice may not be effective. Please be aware that if you knowingly materially misrepresent that material or activity on the Website is infringing your copyright, you may be held liable for damages (including costs and attorneys' fees) under Section 512(f) of the DMCA.
            </p>

            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Counter Notification Procedures</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              If you believe that material you posted on the Website was removed or access to it was disabled by mistake or misidentification, you may file a counter notification with us (a "Counter Notice") by submitting written notification to our copyright agent designated below. Pursuant to the DMCA, the Counter Notice must include substantially the following:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-sm text-muted-foreground mb-6">
              <li>Your physical or electronic signature.</li>
              <li>An identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access disabled.</li>
              <li>Adequate information by which we can contact you (including your name, postal address, telephone number, and, if available, email address).</li>
              <li>A statement under penalty of perjury by you that you have a good faith belief that the material identified above was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled.</li>
              <li>A statement that you will consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or if you reside outside the United States for any judicial district in which the Website may be found) and that you will accept service from the person (or an agent of that person) who provided the Website with the complaint at issue.</li>
            </ol>

            <p className="text-sm text-muted-foreground leading-relaxed mb-2">Our designated agent to receive Counter Notices is:</p>
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <p className="text-sm text-foreground font-semibold">K'town Squishes, LLC</p>
              <p className="text-sm text-muted-foreground">2918 Wicklow Place</p>
              <p className="text-sm text-muted-foreground">Charlotte, NC 28205</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The DMCA allows us to restore the removed content if the party filing the original DMCA Notice does not file a court action against you within ten business days of receiving the copy of your Counter Notice.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Please be aware that if you knowingly materially misrepresent that material or activity on the Website was removed or disabled by mistake or misidentification, you may be held liable for damages (including costs and attorneys' fees) under Section 512(f) of the DMCA.
            </p>

            <h2 className="text-lg font-bold text-foreground mt-8 mb-3">Repeat Infringers</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              It is our policy in appropriate circumstances to disable and/or terminate the accounts of users who are repeat infringers.
            </p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>
);

export default CopyrightPolicy;
