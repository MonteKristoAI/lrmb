import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
import { CLINIC } from "@/data/clinicData";
const LOCATION_LINKS = [
  { slug: "temora", name: "Temora" },
  { slug: "wagga-wagga", name: "Wagga Wagga" },
  { slug: "young", name: "Young" },
  { slug: "west-wyalong", name: "West Wyalong" },
  { slug: "cootamundra", name: "Cootamundra" },
  { slug: "junee", name: "Junee" },
  { slug: "griffith", name: "Griffith" },
  { slug: "cowra", name: "Cowra" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-serif font-bold text-xl">{CLINIC.name}</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              {CLINIC.slogan} Premium shutters, blinds, curtains, and outdoor screens — professionally installed across the Temora & Riverina region.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/Luxeshutters" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary/30 flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="https://www.instagram.com/luxe_shutters" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary/30 flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Services", "Blog", "Contact"].map((link) => (
                <li key={link}><Link to={`/${link.toLowerCase()}`} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{link}</Link></li>
              ))}
            </ul>
            <h4 className="font-serif font-semibold mb-3 mt-6">Service Areas</h4>
            <ul className="space-y-1.5">
              {LOCATION_LINKS.map((loc) => (
                <li key={loc.slug}><a href={`/${loc.slug}/`} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{loc.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-primary-foreground/60"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />{CLINIC.address}</li>
              <li className="flex items-center gap-2.5 text-sm text-primary-foreground/60"><Phone className="w-4 h-4 shrink-0 text-primary" /><a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, "")}`} className="hover:text-primary-foreground transition-colors">{CLINIC.phone}</a></li>
              <li className="flex items-center gap-2.5 text-sm text-primary-foreground/60"><Mail className="w-4 h-4 shrink-0 text-primary" /><a href={`mailto:${CLINIC.email}`} className="hover:text-primary-foreground transition-colors">{CLINIC.email}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Hours and Service Area</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-primary-foreground/60">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <div><p>{CLINIC.hours.weekday}</p><p>{CLINIC.hours.saturday}</p><p>{CLINIC.hours.sunday}</p></div>
              </li>
            </ul>
            <p className="text-xs text-primary-foreground/40 mt-4">Serving Temora, Wagga Wagga, Young, West Wyalong, Cootamundra, Junee, Griffith, Cowra, and surrounding areas across regional NSW.</p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} {CLINIC.name}. All rights reserved. Licensed and Insured.</p>
          <div className="flex gap-4 text-xs text-primary-foreground/40">
            <a href="#" className="hover:text-primary-foreground/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}