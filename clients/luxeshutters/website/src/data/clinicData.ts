export const CLINIC = {
  name: "Luxe Shutters",
  slogan: "Where Style Meets Everyday Comfort.",
  address: "Temora, New South Wales 2666, Australia",
  phone: "1800-465-893",
  email: "admin@luxeshutters.com.au",
  hours: {
    weekday: "Monday – Friday: 9:00 am – 5:00 pm",
    saturday: "Saturday: Closed",
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
    role: "Owner & Lead Estimator",
    focus: "15+ years designing and installing premium window furnishings — from shutters and blinds to outdoor screens",
    image: "team-ryan",
  },
  {
    name: "Marco Vasquez",
    role: "Senior Project Manager",
    focus: "Full-scale shutter and blind installation projects, from initial measurement to final inspection",
    image: "team-marco",
  },
  {
    name: "Jenna Park",
    role: "Design Consultant",
    focus: "Custom window furnishing selection, style recommendations, and client collaboration on home aesthetics",
    image: "team-jenna",
  },
  {
    name: "Derek Sullivan",
    role: "Lead Installer",
    focus: "Precision shutter fitting, blind installation, zipscreen mounting, and finish detailing",
    image: "team-derek",
  },
  {
    name: "Lisa Nguyen",
    role: "Estimator & Project Planner",
    focus: "On-site measurements, project scoping, timelines, and detailed cost planning",
    image: "team-lisa",
  },
];

export const SERVICES = [
  {
    title: "Shutters",
    description: "Our shutters combine timeless elegance with exceptional craftsmanship, adding a touch of sophistication to any space.",
    icon: "blinds",
  },
  {
    title: "Blinds",
    description: "With their versatility and functionality, our blinds are the perfect blend of fashion and practicality.",
    icon: "sliders-horizontal",
  },
  {
    title: "Curtains",
    description: "From sheer elegance to opulent drapes, our curtains offer a wide range of options to suit your personal taste and interior decor.",
    icon: "curtains",
  },
  {
    title: "Zipscreens",
    description: "Sleek design, smooth operation, and customizable options, our zip screens seamlessly blend into your existing architecture.",
    icon: "monitor",
  },
  {
    title: "Awnings",
    description: "Our awnings provide the perfect shade solution, protecting you from the scorching sun while adding a touch of elegance.",
    icon: "umbrella",
  },
  {
    title: "Security Roller Shutters",
    description: "Designed to protect your home, our roller shutters offer a robust defense against intruders, while adding a layer of privacy and insulation.",
    icon: "shield",
  },
];

export interface Review {
  name: string;
  rating: number;
  treatment: string;
  text: string;
  location: string;
  timeAgo: string;
  avatar: string;
  profilePhoto?: string;
  photos?: string[];
}

export const REVIEWS: Review[] = [
  {
    name: "Jo Tuck-Lee", rating: 5, treatment: "Curtains & Blinds",
    text: "Thank you Chris, Campbell and team for my beautiful curtains and blinds. Great service and high quality products. I couldn't be happier and highly recommend Luxe Shutters — they really went out of their way to help me achieve the results I wanted. I will definitely be getting them back to install some shutters.",
    location: "NSW, Australia", timeAgo: "2 years ago", avatar: "JT",
    profilePhoto: "/assets/reviews/prof-jo-tuck-lee.webp",
    photos: ["/assets/reviews/jo-tuck-lee-1.webp", "/assets/reviews/jo-tuck-lee-2.webp", "/assets/reviews/jo-tuck-lee-3.webp"],
  },
  {
    name: "Kirsty Hanlon", rating: 5, treatment: "Automatic Skylight Shutters",
    text: "Posting on behalf of my parents. My wife and I searched statewide trying to find someone to fit automatic shutters to our skylight. We had given up, then by chance we came across Luxe Shutters in Temora. Chris and Campbell came across, measured up and gave us quite a few options. They were honest and realistic with timeframes. They are automatic and so simple to open and close with a remote. Not only do they do exactly what we wanted but they look great too! We have no hesitation in recommending Luxe Shutters to everyone!",
    location: "NSW, Australia", timeAgo: "2 years ago", avatar: "KH",
    photos: ["/assets/reviews/kirsty-hanlon-1.webp", "/assets/reviews/kirsty-hanlon-2.webp", "/assets/reviews/kirsty-hanlon-3.webp"],
  },
  {
    name: "Pete Broady", rating: 5, treatment: "Outdoor Patio Screens",
    text: "We just had outdoor patio screens installed and the whole process from start to finish was fantastic. Chris and the boys were professional, courteous and did a magnificent job. The screens have improved our property and will make the back patio usable 52 weeks of the year regardless of the weather. We highly recommend LUXE Shutters to anyone looking to improve the amenity and value of their property.",
    location: "NSW, Australia", timeAgo: "11 weeks ago", avatar: "PB",
    profilePhoto: "/assets/reviews/prof-pete-broady.webp",
    photos: ["/assets/reviews/pete-broady-1.webp", "/assets/reviews/pete-broady-2.webp", "/assets/reviews/pete-broady-3.webp", "/assets/reviews/pete-broady-4.webp"],
  },
  {
    name: "Bec Tidd", rating: 5, treatment: "Curtains & Blinds",
    text: "Chris and Cam are so easy to work with. We had Chris come out to provide a free quote. He is very knowledgeable and came prepared bringing out a range of samples and colours for us to look at. He was happy to answer our questions. We were very impressed with the quick turn around from finalising our order to installation. We highly recommend Luxe Shutters! You won't be disappointed!",
    location: "NSW, Australia", timeAgo: "2 years ago", avatar: "BT",
    photos: ["/assets/reviews/bec-tidd-1.webp", "/assets/reviews/bec-tidd-2.webp"],
  },
  {
    name: "Ellen Edis", rating: 5, treatment: "Blinds & Sheers",
    text: "Our blinds and sheers look AMAZING! Very professional installation and great after sales service.",
    location: "NSW, Australia", timeAgo: "2 years ago", avatar: "EE",
    photos: ["/assets/reviews/ellen-edis-1.webp", "/assets/reviews/ellen-edis-2.webp"],
  },
  {
    name: "Bron Atkinson", rating: 5, treatment: "Plantation Shutters",
    text: "Luxe Shutters are amazing. Chris and Cam are so friendly, professional and deliver what they promise. I can't believe how much shutters have transformed our home. Feels like luxury!",
    location: "NSW, Australia", timeAgo: "3 years ago", avatar: "BA",
    profilePhoto: "/assets/reviews/prof-bron-atkinson.webp",
    photos: ["/assets/reviews/bron-atkinson-1.webp"],
  },
  {
    name: "Be Patrick", rating: 5, treatment: "Shutters, Blinds & Crimsafe",
    text: "Terrific job well done by Ethan and Chris. So nice to have professionals in their chosen field come into your home with more than just a sales pitch. The team at Luxe also come with thoughts, ideas and recommendations to contribute, bounce off and navigate. The knowledge and ideas from both Chris and Campbell were exceptional. We cannot recommend Luxe highly enough.",
    location: "NSW, Australia", timeAgo: "1 year ago", avatar: "BP",
    profilePhoto: "/assets/reviews/prof-be-patrick.webp",
  },
  {
    name: "Cheryl Harmer", rating: 5, treatment: "Motorised Zip Screens",
    text: "Fantastic service. We love our Motorised Zip Screens.",
    location: "NSW, Australia", timeAgo: "2 years ago", avatar: "CH",
    profilePhoto: "/assets/reviews/prof-cheryl-harmer.webp",
    photos: ["/assets/reviews/cheryl-harmer-1.webp", "/assets/reviews/cheryl-harmer-2.webp"],
  },
  {
    name: "Joe O'Brien", rating: 5, treatment: "Window Furnishings",
    text: "Excellent service and communication — our house looks amazing, thanks Chris! Will definitely use you guys again!",
    location: "NSW, Australia", timeAgo: "6 months ago", avatar: "JO",
  },
  {
    name: "Kate Leith", rating: 5, treatment: "Shutters",
    text: "Chris and The Team at Luxe Shutters are brilliant. They are always on time, measure up in a fast, professional manner, and keep you informed of installment dates. They will not disappoint.",
    location: "Grenfell, NSW", timeAgo: "2 years ago", avatar: "KL",
  },
  {
    name: "Genine Smith", rating: 5, treatment: "Window Furnishings",
    text: "Prompt professional service. Product delivered as stated. Highly recommend.",
    location: "NSW, Australia", timeAgo: "4 weeks ago", avatar: "GS",
    profilePhoto: "/assets/reviews/prof-genine-smith.webp",
  },
  {
    name: "Benny C", rating: 5, treatment: "Zip Blind & Crimsafe",
    text: "Chris and the team were so easy to deal with. A simple phone call and before I knew it they were in Griffith measuring up. Received a large zip blind for our back area and a front crimsafe security door. Quality of the products are amazing and they look so good.",
    location: "Griffith, NSW", timeAgo: "1 year ago", avatar: "BC",
  },
  {
    name: "Neil Smith", rating: 5, treatment: "Plantation Shutters",
    text: "We used Luxe Shutters for the plantation shutters in our house — the product was great and professionally installed with no problems. We highly recommend them.",
    location: "NSW, Australia", timeAgo: "2 years ago", avatar: "NS",
  },
  {
    name: "Robert Quodling", rating: 5, treatment: "Window Furnishings",
    text: "LUXE SHUTTERS AIM TO PLEASE. Customer Service 'par excellence'. Very responsive. Swift and congenial replies. Extensive product knowledge and great pricing. 10/10.",
    location: "NSW, Australia", timeAgo: "6 months ago", avatar: "RQ",
    profilePhoto: "/assets/reviews/prof-robert-quodling.webp",
  },
  {
    name: "Pippa May", rating: 5, treatment: "Plantation Shutters",
    text: "Chris, Cam and the Team from Luxe Shutters provide a top quality product and fantastic customer service. The Plantation Shutters they installed in our house look amazing. Highly Recommend this business.",
    location: "NSW, Australia", timeAgo: "2 years ago", avatar: "PM",
  },
  {
    name: "Diana Edis", rating: 5, treatment: "Interior Shutters",
    text: "Wonderful job. Would highly recommend.",
    location: "NSW, Australia", timeAgo: "1 year ago", avatar: "DE",
    profilePhoto: "/assets/reviews/prof-diana-edis.webp",
  },
];

export const BLOG_POSTS = [
  {
    id: "1",
    title: "5 Signs It's Time to Update Your Window Furnishings",
    excerpt: "Faded curtains, broken blinds, and outdated shutters can drag down your home's look. Here are the telltale signs it's time for a refresh.",
    category: "Tips",
    date: "12 February 2026",
    image: "blog-1",
    featured: true,
  },
  {
    id: "2",
    title: "How Plantation Shutters Add Value to Your Home",
    excerpt: "Quality shutters are one of the smartest upgrades you can make. We break down why buyers love them and how they boost resale value.",
    category: "Value",
    date: "28 January 2026",
    image: "blog-2",
  },
  {
    id: "3",
    title: "Zipscreens for Outdoor Living: The Complete Guide",
    excerpt: "Extend your living space outdoors with zipscreens. Everything you need to know about styles, pricing, and installation for patios and alfresco areas.",
    category: "Design",
    date: "15 January 2026",
    image: "blog-3",
  },
  {
    id: "4",
    title: "Motorised Blinds: Are They Worth the Investment?",
    excerpt: "Smart-home convenience at the touch of a button. Here's how motorised blinds work and whether they make sense for your home.",
    category: "Technology",
    date: "5 January 2026",
    image: "blog-4",
  },
  {
    id: "5",
    title: "Curtain Care & Maintenance: A Seasonal Guide",
    excerpt: "Keep your curtains looking fresh all year. Simple tips for cleaning, care, and knowing when it's time for a replacement.",
    category: "Maintenance",
    date: "20 December 2025",
    image: "blog-5",
  },
];