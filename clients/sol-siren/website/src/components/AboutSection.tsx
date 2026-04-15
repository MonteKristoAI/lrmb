import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const ABOUT_IMAGE =
"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&q=80&auto=format&fit=crop";

const AboutSection = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"]
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="about" className="bg-background py-24 md:py-32 px-6 md:px-16 overflow-hidden">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 md:gap-16 items-center">
        {/* Image */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative aspect-[3/4] overflow-hidden">
          
          <motion.img
            src={ABOUT_IMAGE}
            alt="Editorial fashion lifestyle"
            className="h-full w-full object-cover"
            style={{ y: imgY }}
            loading="lazy" />
          
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col justify-center">
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-foreground">
            Timeless Pieces.<br />Modern Attitude.
          </h2>

          <h3 className="mt-6 font-display text-lg md:text-xl font-light leading-relaxed text-foreground">
            Clothing with a past.<br />Ready for its next chapter.
          </h3>

          <div className="w-12 h-[1px] bg-border my-8" />

          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Not relics. Not replicas.<br />
            But soulful remembrance.<br />
            Garments with memory, worn with intention, as they were always meant to be.
          </p>

          <p className="mt-5 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Each coat is chosen for its presence as much as its construction —<br />
            For its drape,<br />
            the weight of its fabric,<br />
            and the quiet confidence stitched into its seams.
          </p>

          <p className="mt-5 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Not costumes of another decade.<br />
            Garments that have lived.<br />
            Built to outlive time.
          </p>

          <p className="mt-5 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Vintage, here, is not about nostalgia.<br />
            It's about honoring craftsmanship of another era — one that no longer exists.
          </p>

          <p className="mt-5 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Each garment is gathered slowly, preserved with reverence, and then released when it is ready to be found again.
          </p>

          <p className="mt-5 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            This is not about trends.
          </p>

          <p className="mt-5 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            At Sol Siren Vintage we believe that a coat should feel familiar.<br />
            That some garments carry the memory of the life they were meant for all along — waiting quietly for the one they belong to.
          </p>

          <p className="mt-5 font-body text-sm md:text-base font-medium text-foreground leading-relaxed max-w-md italic">
            Some garments simply remember how to be worn.
          </p>

          <Link to="/shop" className="mt-10 inline-flex items-center gap-2 font-body text-[10px] tracking-ultra-wide uppercase text-foreground border-b border-foreground pb-1 hover:opacity-70 transition-opacity duration-300 self-start">
            
            Explore the Collection →
          </Link>
        </motion.div>
      </div>
    </section>);

};

export default AboutSection;