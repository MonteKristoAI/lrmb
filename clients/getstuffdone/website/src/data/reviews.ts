export interface Review {
  name: string;
  company: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Sarah Mitchell",
    company: "Brightline Financial",
    role: "COO",
    text: "GSD transformed our entire back-office operation. What used to take our team 3 days of manual data entry now happens automatically. The ROI was visible within the first month. Maxine's team doesn't just implement — they understand the business problem first.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James Rodriguez",
    company: "Apex Energy Solutions",
    role: "VP of Operations",
    text: "We went from 5 disconnected tools to one unified platform. The AI-powered CRM they built for us catches leads we used to miss entirely. Our sales team is 3X more productive and actually enjoys the tools now.",
    rating: 5,
    avatar: "JR",
  },
  {
    name: "Linda Chen",
    company: "Pacific Coast Logistics",
    role: "CEO",
    text: "The procurement automation GSD built saved us $180K in the first year. But more importantly, it freed my team to focus on strategic work instead of drowning in spreadsheets. This is what digital transformation actually looks like.",
    rating: 5,
    avatar: "LC",
  },
  {
    name: "David Okafor",
    company: "Meridian Consulting Group",
    role: "Managing Partner",
    text: "Maxine's background in enterprise data systems shows in everything GSD delivers. They don't over-engineer — they find the 80/20 solution that gets results fast. Our AI voice agent handles 60% of inbound calls now.",
    rating: 5,
    avatar: "DO",
  },
  {
    name: "Rachel Kim",
    company: "Horizon SaaS",
    role: "Head of Growth",
    text: "The AI SDR and outreach automation GSD set up for us generated 147 qualified meetings in the first quarter. We're scaling without adding headcount. Their approach to AI is practical, not hype-driven.",
    rating: 5,
    avatar: "RK",
  },
  {
    name: "Marcus Thompson",
    company: "Ironwood Manufacturing",
    role: "IT Director",
    text: "GSD handled our entire cloud migration and cybersecurity overhaul. Zero downtime, zero data loss, and our monthly IT costs dropped 30%. They're now our ongoing managed IT partner.",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "Elena Vasquez",
    company: "TrueNorth Advisory",
    role: "Founder",
    text: "As a small firm, we thought enterprise-level AI was out of reach. GSD proved us wrong. The predictive analytics dashboard they built helps us forecast client needs before they even ask. Game-changer.",
    rating: 5,
    avatar: "EV",
  },
  {
    name: "Robert Chen",
    company: "Summit Ventures",
    role: "CTO",
    text: "Working with GSD felt like adding a senior tech team overnight. Their workflow automation eliminated 15 hours of weekly admin across our organization. Maxine's vision for connected systems is exactly what SMBs need.",
    rating: 5,
    avatar: "RC",
  },
];
