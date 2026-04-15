/**
 * Seed script for VaaS platform — 5 agent templates + 5 voice tiers + 1 promo code
 * Run: node seed-vaas.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await mysql.createConnection(DATABASE_URL);

// ─── Agent Templates ──────────────────────────────────────────────────────────

const templates = [
  {
    templateKey: "real_estate",
    displayName: "Real Estate",
    description: "Built for real estate agencies, brokerages, and property management firms. Handles buyer inquiries, listing questions, scheduling viewings, and qualifying leads based on budget, location, and timeline.",
    icon: "🏢",
    defaultPrompt: `You are an AI receptionist for a real estate company. Your role is to warmly greet callers, understand their property needs (buying, selling, renting), qualify them by asking about budget range, preferred locations, timeline, and property type, then either schedule a viewing or connect them with the right agent. Be professional, knowledgeable about real estate terminology, and always collect name, email, and phone number. If you don't know specific listing details, offer to have an agent follow up within the hour.`,
    defaultFirstMessage: "Welcome! I'm your AI assistant. Are you looking to buy, sell, or rent a property today? I'd love to help point you in the right direction.",
    defaultKnowledgeBase: JSON.stringify([
      "We handle residential and commercial properties",
      "Viewings can be scheduled same-day or next business day",
      "Our agents specialize in specific neighborhoods and property types"
    ]),
  },
  {
    templateKey: "mortgage",
    displayName: "Mortgage & Lending",
    description: "Designed for mortgage brokers, lenders, and financial advisors. Pre-qualifies borrowers, explains loan products, collects financial information, and books consultations with loan officers.",
    icon: "🏦",
    defaultPrompt: `You are an AI assistant for a mortgage and lending company. Your role is to help callers understand their financing options, pre-qualify them by asking about income range, credit score estimate, down payment availability, and property value, then schedule them with a loan officer. Be reassuring and professional — many callers are nervous about the mortgage process. Always collect name, email, and phone. Never give specific rate quotes — instead, explain that rates depend on their full profile and offer to connect them with a specialist.`,
    defaultFirstMessage: "Hello! I'm here to help you explore your mortgage and financing options. Are you looking to purchase a new home, refinance, or explore other lending solutions?",
    defaultKnowledgeBase: JSON.stringify([
      "We offer conventional, FHA, VA, and jumbo loan products",
      "Pre-qualification takes about 10 minutes with a loan officer",
      "Current market conditions are discussed during consultation"
    ]),
  },
  {
    templateKey: "law",
    displayName: "Law Firms",
    description: "Tailored for law firms and legal practices. Handles initial client intake, identifies practice area needs, assesses case urgency, collects preliminary case information, and schedules consultations with attorneys.",
    icon: "⚖️",
    defaultPrompt: `You are an AI receptionist for a law firm. Your role is to professionally greet callers, identify their legal needs (practice area), assess urgency, collect preliminary case information, and schedule a consultation with the appropriate attorney. Be empathetic but maintain professional boundaries — never provide legal advice or opinions on case outcomes. Always collect name, email, phone, and a brief description of their situation. For urgent matters, offer to escalate immediately.`,
    defaultFirstMessage: "Good day. Thank you for reaching out. I'm here to help connect you with the right attorney. Could you briefly describe the legal matter you need assistance with?",
    defaultKnowledgeBase: JSON.stringify([
      "We handle various practice areas including corporate, litigation, family, and real estate law",
      "Initial consultations are typically 30 minutes",
      "All communications are confidential"
    ]),
  },
  {
    templateKey: "hospitality",
    displayName: "Hospitality",
    description: "Built for hotels, resorts, vacation rentals, and hospitality businesses. Handles reservation inquiries, answers property questions, manages guest requests, and provides local recommendations.",
    icon: "🏨",
    defaultPrompt: `You are an AI concierge for a hospitality business. Your role is to warmly welcome guests and callers, assist with reservation inquiries (dates, room types, availability, pricing), answer property amenity questions, handle special requests (early check-in, dietary needs, celebrations), and provide local area recommendations. Be warm, attentive, and anticipate needs. Always collect name, email, and phone for follow-up. For complex booking changes, offer to connect them with the reservations team.`,
    defaultFirstMessage: "Welcome! I'm your virtual concierge. How can I make your experience exceptional today? Whether you're looking to make a reservation or need assistance with your stay, I'm here to help.",
    defaultKnowledgeBase: JSON.stringify([
      "Check-in is at 3 PM, check-out at 11 AM unless otherwise arranged",
      "We accommodate special requests with advance notice",
      "Local dining and activity recommendations are available"
    ]),
  },
  {
    templateKey: "manufacturing",
    displayName: "Manufacturing",
    description: "Designed for manufacturers, industrial suppliers, and B2B operations. Handles product inquiries, quote requests, order status checks, technical specifications, and routes calls to the right department.",
    icon: "🏭",
    defaultPrompt: `You are an AI receptionist for a manufacturing company. Your role is to professionally handle incoming inquiries about products, specifications, pricing, lead times, and order status. Qualify business leads by asking about volume requirements, application use case, timeline, and whether they're a new or existing customer. Route technical questions to engineering and pricing questions to sales. Always collect company name, contact name, email, and phone. Be knowledgeable about general manufacturing processes but defer specific technical specs to the engineering team.`,
    defaultFirstMessage: "Thank you for calling. I'm here to help with product inquiries, quotes, or order status. Are you an existing customer or looking to explore our capabilities for a new project?",
    defaultKnowledgeBase: JSON.stringify([
      "We handle custom and standard manufacturing orders",
      "Lead times vary by product complexity and volume",
      "Technical specifications sheets are available upon request",
      "Minimum order quantities apply to certain product lines"
    ]),
  },
];

// ─── Voice Tiers ──────────────────────────────────────────────────────────────

const voices = [
  {
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Warm, professional American female voice. Clear and authoritative — ideal for corporate and professional services.",
    tier: "free",
    monthlyCostCents: 0,
  },
  {
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    description: "Soft, friendly American female voice. Approachable and conversational — great for hospitality and customer service.",
    tier: "free",
    monthlyCostCents: 0,
  },
  {
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    name: "Daniel",
    description: "Deep, confident British male voice. Authoritative and trustworthy — perfect for law firms and financial services.",
    tier: "free",
    monthlyCostCents: 0,
  },
  {
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    name: "Lily",
    description: "Premium expressive female voice with natural emotional range. Adapts tone to conversation context — sounds remarkably human.",
    tier: "premium",
    monthlyCostCents: 14900,
  },
  {
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    name: "Liam",
    description: "Premium deep male voice with rich emotional delivery. Commanding presence with natural warmth — the executive voice.",
    tier: "premium",
    monthlyCostCents: 14900,
  },
];

// ─── Promo Code ───────────────────────────────────────────────────────────────

const promoCodes = [
  {
    code: "CORPORATE2025",
    discountType: "fixed",
    discountValue: 11100, // $111 off → $999 - $111 = $888
    resultPriceCents: 88800,
    maxUses: 100,
  },
];

// ─── Execute ──────────────────────────────────────────────────────────────────

console.log("Seeding agent templates...");
for (const t of templates) {
  await conn.execute(
    `INSERT INTO agent_templates (templateKey, displayName, description, icon, defaultPrompt, defaultFirstMessage, defaultKnowledgeBase)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE displayName=VALUES(displayName), description=VALUES(description), icon=VALUES(icon),
       defaultPrompt=VALUES(defaultPrompt), defaultFirstMessage=VALUES(defaultFirstMessage), defaultKnowledgeBase=VALUES(defaultKnowledgeBase)`,
    [t.templateKey, t.displayName, t.description, t.icon, t.defaultPrompt, t.defaultFirstMessage, t.defaultKnowledgeBase]
  );
  console.log(`  ✓ ${t.displayName}`);
}

console.log("\nSeeding voice tiers...");
for (const v of voices) {
  await conn.execute(
    `INSERT INTO voice_tiers (voiceId, name, description, tier, monthlyCostCents)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), tier=VALUES(tier), monthlyCostCents=VALUES(monthlyCostCents)`,
    [v.voiceId, v.name, v.description, v.tier, v.monthlyCostCents]
  );
  console.log(`  ✓ ${v.name} (${v.tier})`);
}

console.log("\nSeeding promo codes...");
for (const p of promoCodes) {
  await conn.execute(
    `INSERT INTO promo_codes (code, discountType, discountValue, resultPriceCents, maxUses)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE discountType=VALUES(discountType), discountValue=VALUES(discountValue), resultPriceCents=VALUES(resultPriceCents), maxUses=VALUES(maxUses)`,
    [p.code, p.discountType, p.discountValue, p.resultPriceCents, p.maxUses]
  );
  console.log(`  ✓ ${p.code}`);
}

console.log("\n✅ Seed complete!");
await conn.end();
