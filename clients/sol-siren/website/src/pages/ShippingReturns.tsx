import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Footer from "@/components/Footer";

const ShippingReturns = () => (
  <>
    <main className="bg-background pt-28 md:pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6 md:px-16">
        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground text-center">
          Shipping &amp; Returns
        </h1>

        <div className="mt-16 space-y-10 font-body text-sm text-muted-foreground leading-relaxed">
          <p>
            Orders are processed within 2–4 business days unless otherwise noted. You will receive tracking information once your order has been dispatched.
          </p>

          <p>
            Each piece from Sol Siren Vintage is carefully prepared and shipped with intention. Whether it becomes yours or is passed on as a gift, your coat will arrive impeccably wrapped — ready for its next chapter.
          </p>

          <p>
            Each coat is presented on a custom engraved wooden hanger bearing its name — not a label, but a recognition. A quiet honoring of what it has been and what it is becoming.
          </p>

          <p>
            Alongside it, a written history and information card — a record of its era, its construction, and the life it lived before you, as we have known it. This is not simply a purchase. It is a continuation.
          </p>

          <p>
            Sol Siren Vintage is not fast fashion. It is a meaningful, luxury vintage shopping experience.
          </p>

          <div className="w-10 h-[1px] bg-border my-4" />

          <h2 className="font-display text-2xl font-light text-foreground">On Fit &amp; Details:</h2>

          <p className="italic">Vintage is not new.</p>

          <p>It lived a rich and storied life before it found you.</p>

          <p>
            Each coat carries the quiet evidence of time — a softened lining; a faint crease at the cuff; a button that has been fastened a hundred times. These are not flaws, but traces. They are proof of life.
          </p>

          <p>
            We source pieces for their construction, integrity and wearability. Any notable imperfections are disclosed with care. Still, the gentle signs of time should be expected — and respected — as part of the garment's rich history.
          </p>

          <p>
            To choose vintage is to choose character over perfection. It's to value the hand that stitched it, the shoulders that carried it and the decades it endured. We believe this is where beauty deepens — not in untouched, preserved condition, but in longevity.
          </p>

          <div className="w-10 h-[1px] bg-border my-4" />

          <p>Orders are carefully prepared and shipped within 3–5 days.</p>

          <p className="font-medium text-foreground">Please choose with intention. All sales are final.</p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ShippingReturns;
