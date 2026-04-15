import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gem, Sparkles, Heart } from "lucide-react";
import products from "@/data/products";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

const jewelryProducts = products.filter((p) => p.category === "jewelry");

const cancerCollection = jewelryProducts.filter((p) => p.id.includes("cancer"));
const herkimerCollection = jewelryProducts.filter((p) => p.id.includes("herkimer"));

const Jewelry = () => {
  return (
    <>
      <main className="bg-background">
        {/* ─── Hero ─── */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 md:px-16 pt-28 pb-16">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-body text-[11px] tracking-fashion uppercase text-muted-foreground"
          >
            Sol Siren Design
          </motion.p>

          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground leading-[0.95]"
          >
            Jewelry
          </motion.h1>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="mt-8 max-w-lg font-body text-lg md:text-xl text-muted-foreground leading-relaxed italic"
          >
            Pieces born from purpose. Each necklace carries a story, a
            sentiment, a quiet act of defiance or devotion.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="mt-10 flex items-center gap-8 font-body text-[10px] tracking-ultra-wide uppercase text-muted-foreground/60"
          >
            <span className="flex items-center gap-2">
              <Gem size={13} /> 14K Gold-Filled
            </span>
            <span className="w-[1px] h-3 bg-border" />
            <span>Free Shipping</span>
            <span className="w-[1px] h-3 bg-border" />
            <span>Handcrafted</span>
          </motion.div>

          {/* decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="mt-16 w-24 h-[1px] bg-foreground/20 origin-center"
          />
        </section>

        {/* ─── Cancer Awareness Collection ─── */}
        <section className="relative px-6 md:px-16 lg:px-24 py-20 md:py-28">
          {/* Collection intro */}
          <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0}
              className="font-body text-[10px] tracking-fashion uppercase text-muted-foreground/50"
            >
              Collection I
            </motion.p>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
              className="mt-4 font-display text-3xl md:text-5xl font-light text-foreground tracking-wide"
            >
              In Her Honor
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={2}
              className="mt-8 max-w-2xl mx-auto"
            >
              <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                Nineteen years ago, a daughter lost her mother to Ewing's
                sarcoma. What remained was grief, silence, and an unbearable
                absence at every holiday table, every milestone, every quiet
                Sunday morning.
              </p>
              <p className="mt-5 font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                These necklaces were born from that silence. Not as protest, but
                as recognition. A way to say the thing so many of us carry but
                rarely speak aloud.
              </p>
              <p className="mt-5 font-body text-sm text-muted-foreground/70 italic leading-relaxed">
                Gift her this necklace. Then give her a hug and just listen.
                Don't try to fill the silence. Just be there for her.
              </p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="mt-10 w-12 h-[1px] bg-foreground/15 mx-auto origin-center"
            />
          </div>

          {/* Cancer products grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14">
            {cancerCollection.map((product, i) => (
              <JewelryCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* Material callout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-20 md:mt-28 max-w-2xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-border" />
              <Heart size={14} className="text-muted-foreground/40" />
              <span className="w-8 h-[1px] bg-border" />
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Each pendant is laser engraved on{" "}
              <span className="text-foreground font-medium">
                14K gold-filled
              </span>{" "}
              disc or tag with a{" "}
              <span className="text-foreground font-medium">
                16-18 inch adjustable chain
              </span>
              . Free shipping on every order.
            </p>
          </motion.div>
        </section>

        {/* ─── Divider ─── */}
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="h-[1px] bg-border" />
        </div>

        {/* ─── Herkimer Diamond Collection ─── */}
        <section className="relative px-6 md:px-16 lg:px-24 py-20 md:py-28">
          {/* Collection intro */}
          <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0}
              className="font-body text-[10px] tracking-fashion uppercase text-muted-foreground/50"
            >
              Collection II
            </motion.p>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
              className="mt-4 font-display text-3xl md:text-5xl font-light text-foreground tracking-wide"
            >
              The Stone of Attunement
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={2}
              className="mt-8 max-w-2xl mx-auto"
            >
              <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                She decided that "balance" was a lie and that she'd stop chasing
                it. She decided to accept that there were seasons in her life.
                Some treacherous, some embarrassingly easy.
              </p>
              <p className="mt-5 font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                Instead of chasing balance, she would chase{" "}
                <span className="italic text-foreground">happy</span>,{" "}
                <span className="italic text-foreground">good enough</span>, and{" "}
                <span className="italic text-foreground">right for me</span>.
              </p>
            </motion.div>

            {/* Custom made notice */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              custom={3}
              className="mt-10 inline-flex items-center gap-3 border border-border px-6 py-3"
            >
              <Sparkles size={14} className="text-muted-foreground/50" />
              <p className="font-body text-[11px] tracking-wide text-muted-foreground">
                Each necklace is custom made for{" "}
                <span className="text-foreground">you and only you</span>.
                Every Herkimer Diamond is unique.
              </p>
            </motion.div>
          </div>

          {/* Herkimer products - side by side editorial */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16">
            {herkimerCollection.map((product, i) => (
              <JewelryCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* Stone info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-20 md:mt-28 max-w-xl mx-auto text-center space-y-4"
          >
            <p className="font-display text-sm tracking-widest uppercase text-foreground/80">
              Herkimer Diamond
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Genuine Herkimer Diamonds sourced from Herkimer, New York. Each
              stone is 8-10mm and rests on a{" "}
              <span className="text-foreground font-medium">
                14K gold-filled chain
              </span>
              . If you would like to approve your stone before shipment, please
              reach out. Custom lengths available on request.
            </p>
          </motion.div>
        </section>

        {/* ─── Free Shipping Banner ─── */}
        <section className="bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-center md:text-left">
            <div>
              <p className="font-display text-lg md:text-xl font-light text-foreground tracking-wide">
                Complimentary Shipping
              </p>
              <p className="mt-1 font-body text-sm text-muted-foreground">
                Every piece ships free. Beautifully wrapped and ready for its
                next chapter.
              </p>
            </div>
            <Link
              to="/shop"
              className="flex-shrink-0 border border-foreground bg-foreground text-primary-foreground px-8 py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground/90 transition-colors duration-300"
            >
              Explore Outerwear
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

/* ─── Jewelry Product Card ─── */
const JewelryCard = ({
  product,
  index,
}: {
  product: (typeof products)[number];
  index: number;
}) => {
  const slug = (product as any).slug || product.id;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      custom={index}
      className="group"
    >
      <Link
        to={`/product/${slug}`}
        className="relative block aspect-square overflow-hidden border border-border bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
      </Link>

      <Link to={`/product/${slug}`} className="block mt-5 space-y-1.5">
        <h3 className="font-display text-base md:text-lg font-light text-foreground group-hover:opacity-70 transition-opacity duration-300">
          {product.name}
        </h3>
        <p className="font-body text-xs tracking-wide text-muted-foreground line-clamp-1">
          {product.variant}
        </p>
        <p className="font-body text-sm font-medium text-foreground">
          ${product.price}.00
        </p>
      </Link>

      <Link
        to={`/product/${slug}`}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-foreground text-foreground py-3 font-body text-[10px] tracking-ultra-wide uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
      >
        View Details
      </Link>
    </motion.div>
  );
};

export default Jewelry;
