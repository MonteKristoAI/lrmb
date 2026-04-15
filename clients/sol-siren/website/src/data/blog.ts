export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "the-art-of-vintage-dressing",
    title: "The Art of Vintage Dressing",
    excerpt:
      "Discovering timeless silhouettes that transcend trends and seasons — a guide to building a wardrobe that lasts.",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80&auto=format&fit=crop",
    date: "February 2026",
    content:
      "Vintage dressing is more than nostalgia — it's a conscious choice to invest in quality, craftsmanship, and individuality. The best vintage-inspired pieces carry the elegance of past decades while fitting seamlessly into a modern lifestyle.\n\nStart with foundational pieces: a well-cut blazer, a silk camisole, high-waisted trousers. These are the building blocks of a wardrobe that doesn't rely on fast fashion cycles.\n\nThe key is intentionality. Each piece should feel like it was chosen, not simply bought. When you dress with purpose, confidence follows naturally.",
  },
  {
    slug: "sustainable-fashion-choices",
    title: "Sustainable Fashion Choices",
    excerpt:
      "Why choosing fewer, better garments is the most powerful statement you can make with your wardrobe.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
    date: "January 2026",
    content:
      "The fashion industry is one of the largest polluters on the planet. But as consumers, we have more power than we think. Choosing vintage and vintage-inspired pieces is one of the simplest ways to reduce your environmental footprint.\n\nEvery garment that finds a second life is one less garment in a landfill. And when we invest in quality fabrics and timeless cuts, we break free from the disposable mindset that fast fashion encourages.\n\nAt Sol Siren Vintage, sustainability isn't a marketing buzzword — it's woven into everything we do.",
  },
  {
    slug: "styling-for-every-season",
    title: "Styling for Every Season",
    excerpt:
      "How to transition your favourite vintage pieces from summer warmth to winter layers with effortless ease.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&auto=format&fit=crop",
    date: "December 2025",
    content:
      "One of the greatest advantages of a well-curated wardrobe is versatility. A linen wrap dress that breathes in summer becomes a layering piece under a tailored coat in autumn.\n\nThe trick is investing in transitional pieces: lightweight knits, structured blazers, and scarves that add warmth without bulk. Think of your wardrobe as a palette — each piece should complement the others across seasons.\n\nWhen your clothes work harder, you buy less. And that's the most elegant solution of all.",
  },
];
