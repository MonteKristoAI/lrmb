import { SquareStack, DoorOpen, DoorClosed, SlidersHorizontal } from "lucide-react";

export const BUSINESS = {
  name: "Alumalco",
  phone: "1 (855) 826-6799",
  phoneTel: "tel:18558266799",
  address: "Servicing Quebec & Ontario, Canada",
  email: "info@alumalco.ca",
  hours: [
    { day: "Mon – Fri", time: "8:00 AM – 5:00 PM" },
    { day: "Saturday", time: "By Appointment" },
    { day: "Sunday", time: "Closed" },
  ],
  serviceAreas: ["Montreal", "Quebec City", "Laval", "Gatineau", "Ottawa", "Toronto"],
  trustBadges: ["Licensed & Insured", "Free Estimates", "NAFS Certified"],
} as const;

export const SERVICES = [
  {
    id: "windows",
    title: "Windows",
    description: "Premium aluminum windows crafted for clarity and insulation",
    Icon: SquareStack,
  },
  {
    id: "patio-doors",
    title: "Patio Doors",
    description: "Seamless indoor-outdoor transitions",
    Icon: DoorOpen,
  },
  {
    id: "entry-doors",
    title: "Entry Doors",
    description: "Grand entrances that make a statement",
    Icon: DoorClosed,
  },
  {
    id: "sliding-systems",
    title: "Sliding Systems",
    description: "Expansive glass walls with precision engineering",
    Icon: SlidersHorizontal,
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];
