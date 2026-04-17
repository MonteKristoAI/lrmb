// Single source of truth for FAQs across the site.
// Schema.org FAQPage emitters MUST consume the same list that renders visually.

export interface FAQ {
  q: string;
  a: string;
}

// Homepage + Services FAQs — identical so FAQ schema matches rendered content
export const FAQS: FAQ[] = [
  {
    q: "How long does installation take?",
    a: "Most standard installations take 1–3 hours per window. Larger projects like whole-home shutters or zipscreens may take 1–2 days. We provide detailed timelines during your consultation.",
  },
  {
    q: "Do you offer free estimates?",
    a: "Yes. In-home consultations and estimates are completely free with no obligation. We bring samples to your home so you can see colours and fabrics in your own space.",
  },
  {
    q: "What products do you recommend for maximum privacy?",
    a: "Shutters and security roller shutters offer the best privacy. Block-out blinds and curtains with thermal lining are also excellent options for bedrooms and living areas.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. We're fully licensed and insured with experienced installers on every project, giving you complete peace of mind.",
  },
  {
    q: "Do you offer motorised options?",
    a: "Yes. Most of our products are available with motorised operation, including smart-home integration with remotes, wall switches, or app control.",
  },
  {
    q: "What about warranty coverage?",
    a: "All our products come with manufacturer warranties. We also provide a workmanship warranty on every installation. Ask about specific coverage during your consultation.",
  },
  {
    q: "Which areas do you service?",
    a: "We service the Riverina region including Temora, Wagga Wagga, Young, Cootamundra, West Wyalong, Junee, Griffith, Cowra, and surrounding areas across regional NSW.",
  },
  {
    q: "Can you match my existing decor?",
    a: "Yes. We offer a huge range of colours, fabrics, and finishes across all product lines. Bring a sample or photo during your consultation and we'll find the perfect match.",
  },
];
