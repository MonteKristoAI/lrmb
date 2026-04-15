import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.webp";

const amounts = [50, 100, 150, 200] as const;
type Amount = (typeof amounts)[number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState<Amount | null>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  const closeModal = () => {
    setSelectedAmount(null);
    setRecipientName("");
    setRecipientEmail("");
    setMessage("");
    setAdded(false);
  };

  const handleAdd = () => {
    if (!selectedAmount) return;
    addItem({
      id: `gift-card-${selectedAmount}-${Date.now()}`,
      name: `Sol Siren Gift Card`,
      variant: `$${selectedAmount} Digital Gift Card${recipientName ? ` — for ${recipientName}` : ""}`,
      price: selectedAmount,
      image: logo,
    });
    setAdded(true);
    setTimeout(() => {
      closeModal();
    }, 1200);
  };

  return (
    <>
      <main className="bg-background">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 md:px-16 pt-28 pb-16">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-body text-[11px] tracking-fashion uppercase text-muted-foreground"
          >
            <Gift size={13} className="inline mr-2 mb-0.5" />
            Sol Siren Vintage
          </motion.p>

          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground leading-[0.95]"
          >
            Gift Cards
          </motion.h1>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="mt-8 max-w-lg font-body text-lg md:text-xl italic text-muted-foreground leading-relaxed"
          >
            Give the gift of a garment with a past — and the quiet thrill of
            choosing its next chapter.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="mt-14 w-20 h-[1px] bg-foreground/20 origin-center"
          />
        </section>

        {/* Card selection */}
        <section className="px-6 md:px-16 pb-24 md:pb-32">
          <div className="mx-auto max-w-5xl">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center font-body text-[10px] tracking-fashion uppercase text-muted-foreground/60 mb-10"
            >
              Choose an amount
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {amounts.map((amount, i) => (
                <motion.button
                  key={amount}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  custom={i}
                  onClick={() => setSelectedAmount(amount)}
                  className="group relative aspect-[4/5] overflow-hidden border border-border bg-muted/30 hover:border-foreground transition-colors duration-300"
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={logo}
                      alt=""
                      className="w-20 h-20 md:w-24 md:h-24 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
                    />
                  </div>

                  {/* Amount */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-body text-[9px] md:text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-3">
                      Gift Card
                    </p>
                    <p className="font-display text-5xl md:text-6xl font-light text-foreground">
                      ${amount}
                    </p>
                    <div className="mt-4 w-8 h-[1px] bg-foreground/30 group-hover:w-12 transition-all duration-300" />
                    <p className="mt-4 font-body text-[9px] md:text-[10px] tracking-ultra-wide uppercase text-muted-foreground/70 group-hover:text-foreground transition-colors duration-300">
                      Select
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="mt-20 md:mt-24 max-w-2xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-border" />
                <Gift size={14} className="text-muted-foreground/40" />
                <span className="w-8 h-[1px] bg-border" />
              </div>
              <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                Digital gift cards arrive by email, ready to be passed along
                with a note. They never expire, and they can be used across
                the entire collection — from shearling coats to Herkimer
                diamonds.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {selectedAmount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-background border border-border max-w-lg w-full p-8 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <p className="font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground">
                  Sol Siren Gift Card
                </p>
                <p className="mt-3 font-display text-4xl md:text-5xl font-light text-foreground">
                  ${selectedAmount}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-1.5">
                    Recipient Name (optional)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-1.5">
                    Recipient Email (optional)
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground mb-1.5">
                    Personal Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Something you've been looking at for a while..."
                    className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={added}
                className="mt-8 w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground py-4 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors duration-300 disabled:opacity-80"
              >
                {added ? (
                  <>
                    <Check size={14} /> Added to Cart
                  </>
                ) : (
                  `Add $${selectedAmount} Gift Card to Cart`
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GiftCards;
