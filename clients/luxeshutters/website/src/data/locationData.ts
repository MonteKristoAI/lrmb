export interface LocationInfo {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  metaDescription: string;
  distance: string;
  highlights: string[];
}

export const LOCATIONS: LocationInfo[] = [
  {
    slug: "temora",
    name: "Temora",
    region: "Riverina",
    tagline: "Our home base in the heart of the Riverina",
    description: "Based right here in Temora, Luxe Shutters is your local specialist for premium shutters, blinds, curtains, zipscreens, and awnings. As a Temora business, we understand the local climate and architecture, delivering window furnishings that keep your home comfortable through hot summers and cold winters.",
    metaDescription: "Premium shutters, blinds & curtains in Temora NSW. Local specialists with free in-home consultations. Custom-made, professionally installed. Call 1800-465-893.",
    distance: "Home base",
    highlights: [
      "Same-day consultations available",
      "Local showroom for hands-on product viewing",
      "Deep understanding of Temora's climate and housing styles",
    ],
  },
  {
    slug: "wagga-wagga",
    name: "Wagga Wagga",
    region: "Riverina",
    tagline: "Premium window furnishings for the Riverina's largest city",
    description: "Luxe Shutters provides Wagga Wagga homes and businesses with premium shutters, blinds, curtains, zipscreens, and awnings. We travel regularly to Wagga for consultations and installations, bringing the same quality and personal service our Riverina clients know us for.",
    metaDescription: "Shutters, blinds & curtains in Wagga Wagga NSW. Free in-home consultation, custom-made products, professional installation. Luxe Shutters - call 1800-465-893.",
    distance: "~1 hour from Temora",
    highlights: [
      "Regular consultation days in Wagga Wagga",
      "Serving residential and commercial properties",
      "Full product range available including motorised options",
    ],
  },
  {
    slug: "young",
    name: "Young",
    region: "South West Slopes",
    tagline: "Quality shutters and blinds for the Cherry Capital",
    description: "From heritage homes to new builds, Luxe Shutters serves Young and the surrounding South West Slopes with custom shutters, blinds, curtains, and outdoor screens. We provide free in-home consultations and professional installation for every project.",
    metaDescription: "Shutters, blinds & curtains in Young NSW. Free in-home measurement, custom products, expert installation by Luxe Shutters. Call 1800-465-893.",
    distance: "~1 hour from Temora",
    highlights: [
      "Experience with heritage and period homes",
      "Free in-home measurement and consultation",
      "Custom solutions for unique window shapes",
    ],
  },
  {
    slug: "west-wyalong",
    name: "West Wyalong",
    region: "Central West",
    tagline: "Custom window furnishings for West Wyalong homes",
    description: "Luxe Shutters brings premium shutters, blinds, and curtains to West Wyalong and the surrounding Central West region. Whether you're after plantation shutters for a new build or zipscreens for your outdoor area, we handle everything from consultation to installation.",
    metaDescription: "Shutters, blinds & curtains in West Wyalong NSW. Free consultation, custom-made, professionally installed by Luxe Shutters. Call 1800-465-893.",
    distance: "~45 minutes from Temora",
    highlights: [
      "Serving the Central West for years",
      "Products suited to the region's hot, dry summers",
      "Energy-efficient options to reduce cooling costs",
    ],
  },
  {
    slug: "cootamundra",
    name: "Cootamundra",
    region: "Riverina",
    tagline: "Shutters, blinds and curtains for Cootamundra homes",
    description: "Luxe Shutters is the go-to choice for Cootamundra homeowners looking for quality shutters, blinds, curtains, and outdoor screens. We offer free in-home consultations, precise measurement, and professional installation on every job.",
    metaDescription: "Shutters, blinds & curtains in Cootamundra NSW. Local expertise, free in-home quotes, custom installation by Luxe Shutters. Call 1800-465-893.",
    distance: "~30 minutes from Temora",
    highlights: [
      "Quick turnaround from nearby Temora base",
      "Wide range of colours and materials to match any home",
      "Motorised and smart-home compatible options",
    ],
  },
  {
    slug: "junee",
    name: "Junee",
    region: "Riverina",
    tagline: "Premium window furnishings for Junee's heritage homes",
    description: "Junee's stunning heritage architecture deserves window furnishings to match. Luxe Shutters provides custom shutters, blinds, curtains, and security screens for Junee homes, from classic federation properties to modern builds.",
    metaDescription: "Shutters, blinds & curtains in Junee NSW. Heritage-friendly designs, free quotes, professional installation by Luxe Shutters. Call 1800-465-893.",
    distance: "~40 minutes from Temora",
    highlights: [
      "Specialists in heritage and period window solutions",
      "Custom sizing for non-standard windows",
      "Security roller shutters for added peace of mind",
    ],
  },
  {
    slug: "griffith",
    name: "Griffith",
    region: "Riverina",
    tagline: "Shutters and outdoor screens for Griffith's sunny climate",
    description: "Griffith's warm climate makes quality window furnishings essential. Luxe Shutters supplies and installs premium shutters, blinds, curtains, zipscreens, and awnings to keep Griffith homes cool, comfortable, and stylish year-round.",
    metaDescription: "Shutters, blinds & zipscreens in Griffith NSW. Beat the heat with custom window furnishings by Luxe Shutters. Free quotes - call 1800-465-893.",
    distance: "~2 hours from Temora",
    highlights: [
      "UV-blocking zipscreens and awnings for extreme heat",
      "Energy-efficient shutters to reduce cooling bills",
      "Outdoor living solutions for alfresco areas",
    ],
  },
  {
    slug: "cowra",
    name: "Cowra",
    region: "Central West",
    tagline: "Custom shutters and blinds delivered to Cowra",
    description: "Luxe Shutters extends its premium service to Cowra and the Central West, offering custom shutters, blinds, curtains, and outdoor screens. From initial consultation to professional installation, we bring the same quality and attention to detail to every Cowra project.",
    metaDescription: "Shutters, blinds & curtains in Cowra NSW. Custom-made, professionally installed by Luxe Shutters. Free in-home consultation - call 1800-465-893.",
    distance: "~1.5 hours from Temora",
    highlights: [
      "Full product range available",
      "Free in-home consultation and measurement",
      "Professional installation by experienced fitters",
    ],
  },
];

export function getLocationBySlug(slug: string): LocationInfo | undefined {
  return LOCATIONS.find((loc) => loc.slug === slug);
}
