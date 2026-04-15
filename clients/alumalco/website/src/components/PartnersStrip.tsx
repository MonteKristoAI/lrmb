import energyStar from "@/assets/partners/energy-star.png";
import nfrc from "@/assets/partners/nfrc.png";
import ferco from "@/assets/partners/ferco.png";
import interpon from "@/assets/partners/interpon.png";
import laurier from "@/assets/partners/laurier.png";
import oldcastle from "@/assets/partners/oldcastle.jpg";
import xtm from "@/assets/partners/xtm.png";
import regieQuebec from "@/assets/partners/regie-quebec.png";
import acq from "@/assets/partners/acq.png";

const PARTNERS = [
  { name: "Energy Star", logo: energyStar },
  { name: "NFRC", logo: nfrc },
  { name: "Ferco", logo: ferco },
  { name: "Interpon", logo: interpon },
  { name: "Laurier Architectural", logo: laurier },
  { name: "Oldcastle BuildingEnvelope", logo: oldcastle },
  { name: "XTM Powder Coating", logo: xtm },
  { name: "Régie du bâtiment du Québec", logo: regieQuebec },
  { name: "ACQ", logo: acq },
];

const PartnersStrip = () => {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-12 bg-card/50 border-y border-border/50 overflow-hidden">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
          Trusted Partners & Certifications
        </span>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card/50 to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-12 [animation:partners-marquee_35s_linear_infinite] hover:[animation-play-state:paused] w-max">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center bg-white/95 rounded-lg px-5 py-3 hover:bg-white hover:scale-105 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 w-auto max-w-[160px] object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersStrip;
