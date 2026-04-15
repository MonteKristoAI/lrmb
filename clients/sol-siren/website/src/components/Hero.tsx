import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HERO_IMAGE =
"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80&auto=format&fit=crop";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen bg-foreground overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center min-h-screen">
        {/* Text Block — Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 pb-12 md:py-0 md:w-1/2">
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wide text-background leading-[1.1]">
            She's Been<br />Here Before
          </h1>

          <div className="mt-4 font-body text-sm md:text-base text-background/80 max-w-md leading-relaxed">
            <p>Clothing with a past.</p>
            <p>Ready for its new chapter.</p>
          </div>

          <p className="mt-4 font-body italic text-sm md:text-base text-background/60 max-w-md leading-relaxed">
            Intentionally curated, soulful vintage outerwear.
          </p>

          <Link to="/shop"
            className="mt-8 inline-block font-body text-[11px] tracking-ultra-wide uppercase text-background/80 hover:text-background border-b border-background/30 hover:border-background pb-1 transition-all duration-300 w-fit">
            Discover the collection
          </Link>
        </motion.div>

        {/* Image — Right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="md:w-1/2 w-full h-[60vh] md:h-screen relative">
          
          <img
            src={HERO_IMAGE}
            alt="Model wearing new collection"
            className="absolute inset-0 w-full h-full object-cover object-center shadow-[-30px_0_60px_-15px_rgba(0,0,0,0.5)]" />
          
        </motion.div>
      </div>
    </section>);

};

export default Hero;