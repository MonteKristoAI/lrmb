export const CLINIC = {
  name: "MonteKristo Landscaping",
  slogan: "Transform your outdoor space",
  address: "4720 Sunset Blvd, Suite 200, Scottsdale, AZ 85251",
  phone: "(480) 555-0192",
  email: "hello@montekristolandscaping.com",
  hours: {
    weekday: "Monday – Friday: 7:00am – 6:00pm",
    saturday: "Saturday: 8:00am – 2:00pm",
    sunday: "Sunday: Closed",
  },
};

export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  image: string;
  credentials?: string[];
}

export const TEAM: TeamMember[] = [
  {
    name: "Ryan Caldwell",
    role: "Owner & Lead Designer",
    focus: "15+ years designing and building residential landscapes — from concept sketches to finished outdoor spaces",
    image: "team-ryan",
    credentials: ["Certified Landscape Professional", "Licensed Contractor"],
  },
  {
    name: "Marco Vasquez",
    role: "Senior Project Manager",
    focus: "Full-scale landscaping projects, hardscaping, and irrigation installations from start to finish",
    image: "team-marco",
    credentials: ["NALP Certified", "OSHA Certified"],
  },
  {
    name: "Jenna Park",
    role: "Garden Design Consultant",
    focus: "Custom garden design, plant selection, color palettes, and client collaboration on outdoor aesthetics",
    image: "team-jenna",
  },
  {
    name: "Derek Sullivan",
    role: "Lead Installer",
    focus: "Hardscape construction, patio installation, retaining walls, and irrigation system setup",
    image: "team-derek",
    credentials: ["ICPI Certified Installer"],
  },
  {
    name: "Lisa Nguyen",
    role: "Estimator & Project Planner",
    focus: "On-site assessments, project scoping, timelines, and detailed cost planning",
    image: "team-lisa",
    credentials: ["NALP Associate"],
  },
];

export const SERVICES = [
  {
    title: "Lawn Care",
    description: "Professional lawn mowing, fertilization, aeration, and weed control — keeping your yard green, healthy, and perfectly manicured year-round.",
    icon: "leaf",
  },
  {
    title: "Garden Design",
    description: "Custom garden layouts with curated plant selections, flower beds, ornamental grasses, and decorative features — designed to complement your home.",
    icon: "palette",
  },
  {
    title: "Planting & Maintenance",
    description: "Expert planting of trees, shrubs, flowers, and perennials with seasonal maintenance plans to keep your landscape thriving in every season.",
    icon: "sprout",
  },
  {
    title: "Irrigation Systems",
    description: "Smart irrigation design, installation, and repair — efficient watering solutions that save water and keep your landscape lush and healthy.",
    icon: "droplets",
  },
  {
    title: "Outdoor Transformations",
    description: "Complete backyard makeovers including patios, walkways, fire pits, retaining walls, and outdoor living spaces — built to last and designed to impress.",
    icon: "trees",
  },
];

export const REVIEWS = [
  { name: "Karen Wilson", rating: 5, treatment: "Lawn Care", text: "MonteKristo Landscaping transformed our neglected yard into the best-looking lawn on the block. Their weekly maintenance program is incredible — we don't have to lift a finger.", location: "Scottsdale, AZ", timeAgo: "2 weeks ago", avatar: "KW" },
  { name: "David Ramirez", rating: 5, treatment: "Garden Design", text: "Jenna designed a stunning front garden with native plants and colorful perennials. Our neighbors keep asking who did the work. The curb appeal has completely changed.", location: "Phoenix, AZ", timeAgo: "1 month ago", avatar: "DR" },
  { name: "Michelle Torres", rating: 5, treatment: "Outdoor Transformation", text: "They built a gorgeous patio with a fire pit and stone walkway in our backyard. It's like having a private resort. The attention to detail was outstanding.", location: "Tempe, AZ", timeAgo: "3 weeks ago", avatar: "MT" },
  { name: "Tom Brennan", rating: 5, treatment: "Irrigation Systems", text: "Our old sprinkler system was wasting water and leaving brown spots. MonteKristo installed a smart irrigation system that cut our water bill by 40% and our lawn has never looked better.", location: "Paradise Valley, AZ", timeAgo: "1 month ago", avatar: "TB" },
  { name: "Lisa Moreno", rating: 4, treatment: "Lawn Care", text: "Beautiful work on our lawn. The edging is perfect and the fertilization program has made a huge difference. Only wish they could come twice a week during summer!", location: "Mesa, AZ", timeAgo: "2 months ago", avatar: "LM" },
  { name: "James Park", rating: 5, treatment: "Garden Design", text: "From the first consultation to the final planting, MonteKristo was exceptional. Ryan personally checked every detail. Our garden is producing even more blooms than we expected.", location: "Chandler, AZ", timeAgo: "3 weeks ago", avatar: "JP" },
  { name: "Angela Simmons", rating: 5, treatment: "Planting & Maintenance", text: "They planted 15 trees and a full perennial garden for us. Their seasonal maintenance keeps everything looking amazing. Truly a set-it-and-forget-it experience.", location: "Gilbert, AZ", timeAgo: "1 month ago", avatar: "AS" },
  { name: "Robert Kim", rating: 5, treatment: "Outdoor Transformation", text: "MonteKristo designed and built a custom stone patio with built-in seating and landscape lighting. The craftsmanship is top-notch and it's become our favorite space.", location: "Peoria, AZ", timeAgo: "6 weeks ago", avatar: "RK" },
  { name: "Patricia Hayes", rating: 5, treatment: "Garden Design", text: "Got estimates from three companies. MonteKristo wasn't the cheapest but they were the most thorough — detailed design plans, plant selection guide, and a clear timeline. Our garden is perfection.", location: "Scottsdale, AZ", timeAgo: "2 months ago", avatar: "PH" },
  { name: "Steve Gonzalez", rating: 5, treatment: "Lawn Care", text: "These guys actually show up on time, protect your property, and clean up every day. The lawn is lush and green even in Arizona heat. Highly recommend.", location: "Tempe, AZ", timeAgo: "3 months ago", avatar: "SG" },
];

export const BLOG_POSTS = [
  {
    id: "1",
    title: "5 Signs Your Yard Needs Professional Landscaping",
    excerpt: "Not sure if it's time to call a landscaper? Here are the telltale signs your outdoor space could use a professional touch.",
    category: "Planning",
    date: "12 February 2026",
    image: "blog-landscaping-tips",
    featured: true,
  },
  {
    id: "2",
    title: "How Landscaping Boosts Your Home's Value",
    excerpt: "Studies show professional landscaping can increase property value by 10–15%. Here's how to maximize your return on investment.",
    category: "Value",
    date: "5 February 2026",
    image: "blog-landscaping-value",
  },
  {
    id: "3",
    title: "Landscaping Costs in 2026: What to Expect",
    excerpt: "From basic lawn care to full backyard transformations, we break down what drives the cost of residential landscaping.",
    category: "Budgeting",
    date: "28 January 2026",
    image: "blog-landscaping-seasonal",
  },
  {
    id: "4",
    title: "Native vs. Non-Native Plants: What's Best for Arizona?",
    excerpt: "Both have pros and cons. We compare water usage, maintenance, aesthetics, and longevity to help you choose the right plants.",
    category: "Design",
    date: "20 January 2026",
    image: "blog-landscaping-tips",
  },
  {
    id: "5",
    title: "Smart Irrigation: Is It Worth the Investment?",
    excerpt: "Smart sprinkler systems can cut water usage by 30–50%. Here's how to decide if upgrading makes financial sense for your yard.",
    category: "Technology",
    date: "12 January 2026",
    image: "blog-landscaping-value",
  },
  {
    id: "6",
    title: "What to Expect During a Landscaping Project",
    excerpt: "Getting your yard professionally landscaped can feel overwhelming. Here's a step-by-step look at what happens from design to completion.",
    category: "Planning",
    date: "5 January 2026",
    image: "blog-landscaping-seasonal",
  },
  {
    id: "7",
    title: "The ROI of Curb Appeal: Is It Worth It?",
    excerpt: "First impressions matter. Here's how to maximize your landscaping investment for the biggest impact on curb appeal and home value.",
    category: "Value",
    date: "22 December 2025",
    image: "blog-landscaping-value",
  },
  {
    id: "8",
    title: "Seasonal Lawn Care Guide for Arizona",
    excerpt: "Arizona's climate requires a different approach to lawn care. Here's what to do each season to keep your lawn healthy year-round.",
    category: "Maintenance",
    date: "15 December 2025",
    image: "blog-landscaping-tips",
  },
  {
    id: "9",
    title: "How Long Does a Landscaping Project Take?",
    excerpt: "Timeline expectations vary by project scope. We break down realistic schedules from simple garden beds to full outdoor transformations.",
    category: "Planning",
    date: "8 December 2025",
    image: "blog-landscaping-seasonal",
  },
  {
    id: "10",
    title: "Garden Maintenance: What You Need to Know",
    excerpt: "Gardens require ongoing care to thrive. Learn about pruning schedules, fertilization, mulching, and seasonal plant care.",
    category: "Maintenance",
    date: "1 December 2025",
    image: "blog-landscaping-tips",
  },
  {
    id: "11",
    title: "Why You Should Never DIY a Sprinkler System",
    excerpt: "Poor irrigation design wastes water and damages plants. Here's why hiring a professional installer is worth every penny.",
    category: "Tips",
    date: "24 November 2025",
    image: "blog-landscaping-seasonal",
  },
  {
    id: "12",
    title: "How to Choose the Right Landscaping Company",
    excerpt: "Certifications, portfolio, and real reviews matter more than the lowest bid. Here's what to look for in a landscaping company.",
    category: "Tips",
    date: "17 November 2025",
    image: "blog-landscaping-value",
  },
];