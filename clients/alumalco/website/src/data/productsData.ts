export interface Product {
  id: string;
  name: string;
  category: "Windows" | "Doors";
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "tilt-turn-al680",
    name: "Tilt and Turn AL680",
    category: "Windows",
    description:
      "The AL680 Tilt and Turn window offers superior ventilation flexibility and effortless cleaning. Engineered with premium aluminum profiles, it delivers exceptional thermal performance and sound insulation for modern residential and commercial applications.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "casement-al480",
    name: "Casement AL480",
    category: "Windows",
    description:
      "The AL480 Casement window combines sleek, narrow sightlines with robust structural integrity. Its outward-opening design maximizes airflow while maintaining a refined aesthetic, perfect for both contemporary and traditional architecture.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "lift-slide-sl550",
    name: "Lift and Slide SL550",
    category: "Doors",
    description:
      "The SL550 Lift and Slide door system effortlessly glides open to create expansive openings that seamlessly connect indoor and outdoor living spaces. Built for large-format glazing, it offers smooth operation and outstanding weatherproofing.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "slimline-sl650",
    name: "Slimline SL650",
    category: "Doors",
    description:
      "The SL650 Slimline sliding door features ultra-narrow profiles that maximize glass area and natural light. Its minimalist design creates an almost frameless appearance, delivering an uninterrupted panoramic view.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bifold-bf850",
    name: "Bifold BF850",
    category: "Doors",
    description:
      "The BF850 Bifold door folds neatly to one side, opening up entire walls to merge your interior with the outdoors. Available in multiple panel configurations, it offers architectural flexibility without compromising on performance.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "entry-doors",
    name: "Entry Doors",
    category: "Doors",
    description:
      "Our premium Entry Doors make a bold first impression with customizable designs, superior security features, and exceptional energy efficiency. Available in a wide range of styles, finishes, and hardware options to complement any façade.",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
  },
];
