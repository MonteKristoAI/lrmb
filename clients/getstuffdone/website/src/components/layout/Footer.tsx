import { COMPANY } from "@/data/companyInfo";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import gsdLogo from "@/assets/gsd-logo.png";

const QUICK_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
] as const;

const SERVICES = [
  "AI Agent Development",
  "CRM Automation",
  "Sales Outreach",
  "Data Integration",
  "Process Optimization",
] as const;

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
    <section className="border-t border-[hsl(214_20%_90%)] bg-gradient-to-r from-[hsl(175_72%_38%/0.04)] via-white to-[hsl(175_72%_38%/0.04)] py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-extrabold text-[hsl(220_25%_14%)] sm:text-3xl">Ready to transform your business?</h2>
        <p className="mx-auto mt-3 max-w-lg text-[hsl(215_15%_46%)]">Book a free 30-minute discovery call and get a custom AI roadmap for your business.</p>
        <a href="/#booking" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[hsl(175_72%_38%)] px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_14px_hsl(175_72%_38%/0.3)] transition-all hover:shadow-[0_8px_25px_hsl(175_72%_38%/0.4)] hover:brightness-110">
          Book a Discovery Call <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
    <footer className="bg-[hsl(210_25%_97%)] border-t border-[hsl(214_20%_90%)]">
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={gsdLogo} alt="GSD with AI" className="h-16 w-auto" />
            <p className="text-sm text-[hsl(215_15%_46%)] leading-relaxed max-w-xs">
              {COMPANY.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* LinkedIn */}
              <a
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] hover:bg-[hsl(175_72%_38%/0.08)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={COMPANY.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-lg text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] hover:bg-[hsl(175_72%_38%/0.08)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[hsl(220_25%_14%)] tracking-wide uppercase">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[hsl(220_25%_14%)] tracking-wide uppercase">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {SERVICES.map((service) => (
                <li key={service}>
                  <a
                    href="/services"
                    className="text-sm text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[hsl(220_25%_14%)] tracking-wide uppercase">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[hsl(175_72%_38%)] mt-0.5 shrink-0" />
                <span className="text-sm text-[hsl(215_15%_46%)]">
                  {COMPANY.location}
                </span>
              </div>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-sm text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] transition-colors"
              >
                <Phone className="w-4 h-4 text-[hsl(175_72%_38%)] shrink-0" />
                {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 text-sm text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[hsl(175_72%_38%)] shrink-0" />
                {COMPANY.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[hsl(214_20%_90%)]">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6">
          <p className="text-xs text-[hsl(215_15%_46%)]">
            &copy; {year} {COMPANY.legal}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              title="Coming soon"
              className="text-xs text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              title="Coming soon"
              className="text-xs text-[hsl(215_15%_46%)] hover:text-[hsl(175_72%_38%)] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
