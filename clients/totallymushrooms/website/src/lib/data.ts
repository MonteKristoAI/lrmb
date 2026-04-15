import productLionsManeTincture from "@/assets/product-lions-mane-tincture.webp";
import productEnergized from "@/assets/product-totally-energized.webp";
import productFocused from "@/assets/product-totally-focused.webp";
import productHolistic from "@/assets/product-totally-holistic.webp";
import productImmune from "@/assets/product-totally-immune.webp";
import productReviveThrive from "@/assets/product-revive-thrive.webp";
import productWellnessBundle from "@/assets/product-wellness-bundle.webp";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  subscriptionPrice: number;
  category: string;
  zone: string;
  image: string;
  description: string;
  badge: string | null;
  mushroom: string;
  extractRatio: string;
  activeEquivalent: string;
  servingSize: string;
  benefits: string[];
  targetBiomarker: string;
  kineticAdvantage: string;
  idealApplication: string;
  isBundle?: boolean;
  isTincture?: boolean;
}

// ─── THE TOTAL SERIES: SYSTEMIC MASTERY ─────────────────────────────
// Clinical-grade bioactives delivered with unrivaled precision.
// 40:1 Extract Ratio | 95%+ Bioavailability | 178x Efficiency Multiplier

export const products: Product[] = [
  // ─── TINCTURE LINE ──────────────────────────────────────────────────
  {
    id: "lions-mane-tincture",
    name: "Lion's Mane Tincture 30ml",
    subtitle: "Ultrasonic Nano Extract",
    price: 35.00,
    subscriptionPrice: 26.25,
    category: "Focus",
    zone: "Zone 1: Cognitive Regeneration",
    image: productLionsManeTincture,
    description: "USDA certified organic freeze-dried Lion's Mane fruiting body, ultrasonically refined into a sub-micron tincture. Our cold-process extraction (<45C) preserves fragile neurotrophic compounds while stripping indigestible chitin. 40:1 concentration ratio delivers 2,000mg equivalent per dose.",
    badge: "Bestseller",
    mushroom: "Hericium erinaceus",
    extractRatio: "40:1",
    activeEquivalent: "50mg Active = 2,000mg Dried Hericium erinaceus",
    servingSize: "1ml (1 full dropper)",
    benefits: ["NGF Synthesis", "Blood-brain barrier permeability", "Synaptic density", "Flow state optimization"],
    targetBiomarker: "NGF Synthesis",
    kineticAdvantage: "Focus & Synaptic Density",
    idealApplication: "Deep Work & Flow State",
    isTincture: true,
  },

  // ─── THE TOTAL SERIES GUMMIES ───────────────────────────────────────
  {
    id: "total-neuro",
    name: "Total Neuro",
    subtitle: "Lion's Mane Nano Extract",
    price: 35.00,
    subscriptionPrice: 26.25,
    category: "Focus",
    zone: "Zone 1: Cognitive Regeneration",
    image: productFocused,
    description: "Engineered for maximum kinetic response during deep work. 40:1 nano-extracted Lion's Mane delivers intact neurotrophic compounds across the blood-brain barrier at 100-500nm scale. Cold-process ultrasonic cavitation preserves fragile bioactives that heat-based extraction destroys.",
    badge: "Kinetic Focus",
    mushroom: "Hericium erinaceus",
    extractRatio: "40:1",
    activeEquivalent: "50mg Active = 2,000mg Dried Hericium erinaceus",
    servingSize: "1 gummy (50mg nano extract)",
    benefits: ["NGF Synthesis", "Intact neurotrophic bioactives", "100-500nm barrier permeability", "Synaptic branching"],
    targetBiomarker: "NGF Synthesis",
    kineticAdvantage: "Focus & Synaptic Density",
    idealApplication: "Deep Work & Flow State",
  },
  {
    id: "total-velocity",
    name: "Total Velocity",
    subtitle: "Cordyceps Nano Extract",
    price: 35.00,
    subscriptionPrice: 26.25,
    category: "Energy",
    zone: "Zone 2: Cellular Propulsion",
    image: productEnergized,
    description: "Re-engineering Cordyceps militaris for maximum survival and pure metabolic propulsion. 40:1 nano-extraction optimizes ATP synthesis at the mitochondrial level. Chitinous walls removed to ensure zero energy is wasted on digestion. Clean cellular fuel, not stimulant jitter.",
    badge: "Kinetic Energy",
    mushroom: "Cordyceps militaris",
    extractRatio: "40:1",
    activeEquivalent: "50mg Active = 2,000mg Dried Cordyceps militaris",
    servingSize: "1 gummy (50mg nano extract)",
    benefits: ["ATP optimization", "VO2 Max support", "Zero digestive waste", "Sustained metabolic output"],
    targetBiomarker: "ATP Synthesis",
    kineticAdvantage: "Energy & VO2 Max",
    idealApplication: "Physical Exertion & Endurance",
  },
  {
    id: "total-aegis",
    name: "Total Aegis",
    subtitle: "Golden Oyster Nano Extract",
    price: 35.00,
    subscriptionPrice: 26.25,
    category: "Defense",
    zone: "Zone 3: Systemic Defense",
    image: productImmune,
    description: "A paradigm shift in immune modulation and mitochondrial preservation. Golden Oyster delivers the highest natural concentration of L-Ergothioneine (EGT), utilizing your body's dedicated OCTN1 gateway to concentrate defense exactly where needed: brain, liver, kidneys. Nano-scale precision targeting.",
    badge: "Systemic Defense",
    mushroom: "Pleurotus citrinopileatus",
    extractRatio: "40:1",
    activeEquivalent: "50mg Active = 2,000mg Dried Pleurotus citrinopileatus",
    servingSize: "1 gummy (50mg nano extract)",
    benefits: ["L-Ergothioneine (EGT) payload", "OCTN1 precision targeting", "Mitochondrial fortress", "Oxidative stress neutralization"],
    targetBiomarker: "L-Ergothioneine (EGT)",
    kineticAdvantage: "Immunity & Mitochondrial Defense",
    idealApplication: "Daily Longevity Maintenance",
  },

  // ─── LEGACY CONSUMER LINE (SHOPIFY) ─────────────────────────────────
  {
    id: "totally-holistic",
    name: "Totally Holistic",
    subtitle: "Five-Mushroom Synergy Blend",
    price: 35.00,
    subscriptionPrice: 26.25,
    category: "Wellness",
    zone: "Full Spectrum",
    image: productHolistic,
    description: "Five-mushroom synergy blend: Cordyceps, Chaga, Lion's Mane, Turkey Tail, and Reishi. 30 count gummy pack covering all three optimization zones in a single daily dose. The entry point to systemic wellness.",
    badge: null,
    mushroom: "Multi-species blend",
    extractRatio: "Standard",
    activeEquivalent: "1,000mg total per serving",
    servingSize: "2 gummies (1,000mg)",
    benefits: ["Full-spectrum coverage", "Adaptogenic balance", "Systemic equilibrium", "Daily vitality"],
    targetBiomarker: "Multi-pathway",
    kineticAdvantage: "Broad systemic support",
    idealApplication: "Daily Wellness Baseline",
  },

  // ─── BUNDLES ────────────────────────────────────────────────────────
  {
    id: "systemic-mastery",
    name: "Systemic Mastery Pack",
    subtitle: "The Complete Total Series Protocol",
    price: 165.00,
    subscriptionPrice: 123.75,
    category: "Bundles",
    zone: "All Three Zones",
    image: productReviveThrive,
    description: "The complete Systemic Mastery protocol. All three Total Series gummies (Neuro + Velocity + Aegis) plus the Lion's Mane Tincture for acute kinetic spiking. Cover every optimization zone. Bypass the gauntlet entirely.",
    badge: "Best Value",
    mushroom: "Lion's Mane + Cordyceps + Golden Oyster",
    extractRatio: "40:1 across all",
    activeEquivalent: "Full daily protocol",
    servingSize: "Complete protocol",
    benefits: ["All 3 zones covered", "Tincture + Gummies", "178x efficiency across the board", "Maximum systemic mastery"],
    targetBiomarker: "NGF + ATP + EGT",
    kineticAdvantage: "Complete optimization",
    idealApplication: "Peak Performance Protocol",
    isBundle: true,
  },
  {
    id: "total-series-bundle",
    name: "Total Series Bundle",
    subtitle: "All Three Gummies",
    price: 105.00,
    subscriptionPrice: 78.75,
    category: "Bundles",
    zone: "All Three Zones",
    image: productWellnessBundle,
    description: "All three Total Series nano-extract gummies: Neuro, Velocity, and Aegis. Cover cognitive regeneration, cellular propulsion, and systemic defense in one protocol. Save when you commit to systemic mastery.",
    badge: "Save $",
    mushroom: "Lion's Mane + Cordyceps + Golden Oyster",
    extractRatio: "40:1 across all",
    activeEquivalent: "Full gummy protocol",
    servingSize: "Complete gummy protocol",
    benefits: ["All 3 zones covered", "25% savings", "40:1 nano-extract across all", "Full systemic coverage"],
    targetBiomarker: "NGF + ATP + EGT",
    kineticAdvantage: "Complete optimization",
    idealApplication: "Full Systemic Protocol",
    isBundle: true,
  },
];

export const categories = [
  { name: "Focus", icon: "🧠", description: "Cognitive Regeneration", slug: "focus" },
  { name: "Energy", icon: "⚡", description: "Cellular Propulsion", slug: "energy" },
  { name: "Defense", icon: "🛡️", description: "Systemic Defense", slug: "defense" },
  { name: "Wellness", icon: "🌿", description: "Full Spectrum", slug: "wellness" },
  { name: "Bundles", icon: "📦", description: "Complete Protocols", slug: "bundles" },
];

export const reviews = [
  { name: "Sarah M.", rating: 5, text: "The Lion's Mane Tincture has completely transformed my focus at work. I feel sharper and more productive than ever.", avatar: "S", verified: true },
  { name: "James K.", rating: 5, text: "Best mushroom supplements I've found. The nano-extract gummies are on another level compared to standard capsules.", avatar: "J", verified: true },
  { name: "Emily R.", rating: 5, text: "Total Velocity before my morning runs is a game changer. The energy is clean and sustained, no crash.", avatar: "E", verified: true },
  { name: "Michael D.", rating: 4, text: "The Systemic Mastery Pack covers everything. Noticeable results within two weeks. Worth the investment.", avatar: "M", verified: true },
];

export const blogPosts = [
  { id: "medicinal-mushrooms-guide", title: "The Complete Guide to Medicinal Mushrooms", excerpt: "Discover the ancient wisdom and modern science behind the world's most powerful functional mushrooms.", image: blog1, date: "Mar 10, 2026", readTime: "8 min read" },
  { id: "mushroom-coffee-ritual", title: "How to Create the Perfect Mushroom Coffee Ritual", excerpt: "Elevate your morning routine with adaptogenic mushroom blends that support focus and calm energy.", image: blog2, date: "Mar 5, 2026", readTime: "5 min read" },
  { id: "wellness-routine", title: "Building a Holistic Wellness Routine with Fungi", excerpt: "Learn how to incorporate mushroom supplements into your daily wellness practice for optimal health.", image: blog3, date: "Feb 28, 2026", readTime: "6 min read" },
];

export const trustBadges = [
  { label: "USDA Organic", icon: "organic" },
  { label: "Third-Party Lab Tested", icon: "lab" },
  { label: "GMP Certified", icon: "gmp" },
  { label: "Non-GMO", icon: "nongmo" },
  { label: "Vegan Friendly", icon: "vegan" },
  { label: "Made in USA", icon: "usa" },
];

// ─── THE GASTRIC GAUNTLET ─────────────────────────────────────────────
// Legacy supplements: 80% potency loss. Total Series: 95%+ bioavailability.

export const extractionSteps = [
  {
    step: 1,
    title: "Organic Cultivation",
    description: "In-house USDA certified organic cultivation. Pure fruiting body, no grain substrates, no fillers. Every mushroom grown under controlled conditions for maximum bioactive density.",
    metric: "100% Fruiting Body",
  },
  {
    step: 2,
    title: "Freeze Drying",
    description: "Immediate freeze-drying locks bioactive compounds at peak potency. Beta-glucans, terpenes, and polysaccharides preserved before any degradation can occur.",
    metric: "< 4% Moisture",
  },
  {
    step: 3,
    title: "Ultrasonic Nano-Refinement",
    description: "Cold-process ultrasonic cavitation (<45C) shatters rigid chitinous cell walls without destructive heat. Eliminates metabolic waste while preserving fragile structural compounds entirely intact. Maximum kinetic yield.",
    metric: "< 45C Cold Process",
  },
  {
    step: 4,
    title: "Sub-Micron Nano-Emulsion",
    description: "Centrifuge extraction creates 100-500nm sub-micron particles that evade the digestive gauntlet entirely. 178-fold efficiency multiplier over unrefined powders. 7.0x bioavailability advantage over conventional capsules.",
    metric: "100-500nm Particles",
  },
  {
    step: 5,
    title: "40:1 Concentration",
    description: "Final nano-extract concentrated to a 40:1 ratio. 50mg of active extract delivers the equivalent of 2,000mg dried mushroom. Every milligram engineered for cellular uptake, not digestive waste.",
    metric: "40:1 Extract Ratio",
  },
];

export const gastricGauntlet = {
  legacy: {
    label: "Legacy Supplements",
    process: "Crude Capsule → pH 1.5-3.5 Acidic Zone → Bioinactive Fragments",
    potencyLoss: "80%",
    description: "Most legacy mushroom extracts are trapped in indigestible cell walls and destroyed by stomach acid before your body can use them.",
  },
  totalSeries: {
    label: "The Total Series",
    process: "Micro-Spheres → pH 1.5-3.5 Acidic Zone → Cellular Membrane → Bioactive Uptake",
    bioavailability: "95%+",
    description: "Sub-micron nano-spheres bypass the gastric gauntlet entirely, delivering intact bioactives directly to cellular membranes.",
  },
};

export const systemicMatrix = [
  {
    product: "Total Neuro",
    color: "gray",
    mushroomCore: "Lion's Mane",
    targetBiomarker: "NGF Synthesis",
    kineticAdvantage: "Focus & Synaptic Density",
    idealApplication: "Deep Work & Flow State",
  },
  {
    product: "Total Velocity",
    color: "red",
    mushroomCore: "Cordyceps",
    targetBiomarker: "ATP Synthesis",
    kineticAdvantage: "Energy & VO2 Max",
    idealApplication: "Physical Exertion & Endurance",
  },
  {
    product: "Total Aegis",
    color: "gold",
    mushroomCore: "Golden Oyster",
    targetBiomarker: "L-Ergothioneine (EGT)",
    kineticAdvantage: "Immunity & Mitochondrial Defense",
    idealApplication: "Daily Longevity Maintenance",
  },
];

export const dosingProtocol = [
  {
    name: "Baseline Maintenance",
    time: "06:00",
    instruction: "1 gummy daily for systemic equilibrium.",
  },
  {
    name: "Peak Demand",
    time: "12:00",
    instruction: "1 gummy twice daily during high-stress periods.",
  },
  {
    name: "Kinetic Spiking",
    time: "18:00",
    instruction: "Consume exactly 20 minutes before deep work (Neuro) or physical exertion (Velocity).",
  },
];

export const quizQuestions = [
  {
    id: 1,
    question: "What's your primary optimization zone?",
    options: [
      { text: "Cognitive regeneration - sharper focus, deeper flow states", value: "focus" },
      { text: "Cellular propulsion - more energy, greater endurance", value: "energy" },
      { text: "Systemic defense - immune strength, longevity", value: "defense" },
      { text: "All of the above - full systemic mastery", value: "wellness" },
    ],
  },
  {
    id: 2,
    question: "When do you need peak performance?",
    options: [
      { text: "Deep work sessions, coding, creative flow", value: "focus" },
      { text: "Training, competition, physical output", value: "energy" },
      { text: "Recovery, stress resilience, daily maintenance", value: "defense" },
      { text: "I operate at high demand across all zones", value: "wellness" },
    ],
  },
  {
    id: 3,
    question: "What delivery format fits your protocol?",
    options: [
      { text: "Tincture drops - fast-acting, sublingual, kinetic spiking", value: "tincture" },
      { text: "Nano-extract gummies - convenient, precise dosing", value: "gummy" },
      { text: "Full protocol - give me the complete systemic mastery stack", value: "bundle" },
    ],
  },
];

export const quizResults: Record<string, { productId: string; headline: string; reason: string }> = {
  "focus-tincture": { productId: "lions-mane-tincture", headline: "Lion's Mane Tincture is your match", reason: "Fast-acting sublingual delivery for immediate NGF synthesis. Consume 20 minutes before deep work for kinetic spiking." },
  "focus-gummy": { productId: "total-neuro", headline: "Total Neuro is your match", reason: "40:1 nano-extracted Lion's Mane. 100-500nm particles cross the blood-brain barrier for direct neurotrophic delivery." },
  "focus-bundle": { productId: "systemic-mastery", headline: "Systemic Mastery Pack is your match", reason: "Tincture for acute kinetic spiking + Total Neuro gummies for baseline NGF synthesis + full zone coverage." },
  "energy-tincture": { productId: "lions-mane-tincture", headline: "Start with Lion's Mane Tincture", reason: "Cognitive clarity fuels physical output. Pair with Total Velocity gummies for the complete energy stack." },
  "energy-gummy": { productId: "total-velocity", headline: "Total Velocity is your match", reason: "40:1 Cordyceps nano-extract optimizes ATP synthesis and VO2 Max. Zero digestive waste, pure metabolic propulsion." },
  "energy-bundle": { productId: "total-series-bundle", headline: "Total Series Bundle is your match", reason: "Velocity for energy + Neuro for focus + Aegis for recovery. All three zones at 40:1 concentration." },
  "defense-tincture": { productId: "lions-mane-tincture", headline: "Start with Lion's Mane Tincture", reason: "Neural health is the foundation of systemic defense. Add Total Aegis for OCTN1-targeted immune modulation." },
  "defense-gummy": { productId: "total-aegis", headline: "Total Aegis is your match", reason: "Golden Oyster nano-extract delivers L-Ergothioneine via the OCTN1 gateway. Precision targeting to brain, liver, kidneys." },
  "defense-bundle": { productId: "systemic-mastery", headline: "Systemic Mastery Pack is your match", reason: "Complete defense requires complete coverage. All three zones plus tincture for maximum protocol flexibility." },
  "wellness-tincture": { productId: "lions-mane-tincture", headline: "Start with Lion's Mane Tincture", reason: "The foundation of any systemic protocol. Add the Total Series gummies for full-zone optimization." },
  "wellness-gummy": { productId: "totally-holistic", headline: "Totally Holistic is your match", reason: "Five-mushroom synergy blend covering all zones in a single daily dose. The broadest single-product coverage." },
  "wellness-bundle": { productId: "systemic-mastery", headline: "Systemic Mastery Pack is your match", reason: "You want it all. Three nano-extract gummies + tincture = complete systemic mastery across every optimization zone." },
};
