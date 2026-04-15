export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  image: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "luxury-residence",
    title: "Luxury Residence",
    location: "Westmount, Montreal",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80&auto=format&fit=crop",
  },
  {
    id: "modern-townhome",
    title: "Modern Townhome",
    location: "Plateau Mont-Royal, Montreal",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&auto=format&fit=crop",
  },
  {
    id: "commercial-tower",
    title: "Commercial Tower",
    location: "Downtown Montreal",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80&auto=format&fit=crop",
  },
  {
    id: "waterfront-condo",
    title: "Waterfront Condo",
    location: "Old Port, Montreal",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80&auto=format&fit=crop",
  },
  {
    id: "corporate-headquarters",
    title: "Corporate Headquarters",
    location: "Ottawa, Ontario",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format&fit=crop",
  },
  {
    id: "heritage-renovation",
    title: "Heritage Renovation",
    location: "Old Quebec, Quebec City",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80&auto=format&fit=crop",
  },
];
