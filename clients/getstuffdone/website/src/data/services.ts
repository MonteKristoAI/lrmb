export interface Service {
  name: string;
  nickname: string;
  description: string;
  icon: string;
}

export interface ServicePillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "gold" | "teal" | "blue";
  services: Service[];
}

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: "digital-foundations",
    title: "Digital Foundations",
    description: "Turning Technical Expertise into a Lead Machine",
    icon: "Zap",
    color: "gold",
    services: [
      { name: "Ads", nickname: "The Fuel", description: "Targeted digital advertising campaigns that drive qualified leads and measurable ROI.", icon: "Megaphone" },
      { name: "CRM", nickname: "The Brain", description: "Unified customer relationship management that connects your entire sales pipeline.", icon: "Users" },
      { name: "Outreach", nickname: "The Scout", description: "Automated multi-channel prospecting that identifies and engages ideal customers.", icon: "Mail" },
      { name: "AI SDR", nickname: "The Closer", description: "AI-powered sales development that qualifies leads and books meetings 24/7.", icon: "Bot" },
      { name: "Call Analyzer", nickname: "The Coach", description: "AI call analysis that improves sales performance with actionable conversation insights.", icon: "PhoneCall" },
      { name: "Mobile App Development", nickname: "The Interface", description: "Custom mobile applications that put your business in your customers' pockets.", icon: "Smartphone" },
      { name: "Educational Platforms", nickname: "The Authority", description: "LMS and knowledge base platforms that establish thought leadership and train teams.", icon: "GraduationCap" },
    ],
  },
  {
    id: "ai-powered-growth",
    title: "AI Powered Growth",
    description: "Boost efficiency and sales with smart technology",
    icon: "Brain",
    color: "teal",
    services: [
      { name: "AI Voice Solutions", nickname: "The Communicator", description: "AI voice agents that handle calls, qualify leads, and provide 24/7 customer support.", icon: "Mic" },
      { name: "Sales Enablement Tools", nickname: "The Multiplier", description: "Smart tools that arm your sales team with AI-driven insights and automation.", icon: "TrendingUp" },
      { name: "Predictive Analytics", nickname: "The Navigator", description: "Data-driven forecasting that turns historical patterns into actionable business intelligence.", icon: "BarChart3" },
      { name: "Robotic Process Automation", nickname: "The Worker", description: "Automated workflows that eliminate repetitive tasks and reduce human error by 90%+.", icon: "Cog" },
      { name: "AI SEO, AEO & GEO", nickname: "The Map", description: "AI-powered search optimization for Google, AI Overviews, ChatGPT, and Perplexity.", icon: "Search" },
    ],
  },
  {
    id: "secure-scalable-it",
    title: "Secure & Scalable IT",
    description: "Keep your business safe, connected, and ready to grow",
    icon: "Shield",
    color: "blue",
    services: [
      { name: "AI & Workflow Automation", nickname: "", description: "Intelligent process automation that connects your systems and eliminates bottlenecks.", icon: "Workflow" },
      { name: "Cloud Strategy & Migration", nickname: "", description: "Seamless cloud transitions that reduce costs and increase operational flexibility.", icon: "Cloud" },
      { name: "Cybersecurity & Risk Management", nickname: "", description: "Enterprise-grade security protocols that protect your data, clients, and reputation.", icon: "ShieldCheck" },
      { name: "Network & Infrastructure", nickname: "", description: "Reliable, scalable infrastructure that grows with your business without downtime.", icon: "Server" },
      { name: "Proactive Managed IT Support", nickname: "", description: "24/7 monitoring and maintenance that prevents problems before they impact your business.", icon: "Headphones" },
      { name: "Legacy Modernization & Integration", nickname: "", description: "Transform outdated systems into modern, connected platforms without losing data or uptime.", icon: "RefreshCw" },
    ],
  },
];
