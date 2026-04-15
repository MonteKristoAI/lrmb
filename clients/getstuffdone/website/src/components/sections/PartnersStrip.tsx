const LOGOS = [
  { name: "n8n", src: "https://n8n.io/favicon.ico", width: 36 },
  { name: "GoHighLevel", src: "https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_9ef4b253ee28e37dab65adbeed203f54/gohighlevel.png", width: 130 },
  { name: "Apollo", src: "https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_1e6b79d556cd91dd115ef8f8ea81e4f4/apollo-io.png", width: 110 },
  { name: "Instantly", src: "https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_fa4025b1c97a0e40eb40cade44e0cd53/instantly.png", width: 110 },
  { name: "Anthropic", src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", width: 120 },
  { name: "OpenAI", src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", width: 110 },
  { name: "Salesforce", src: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", width: 110 },
  { name: "HubSpot", src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg", width: 110 },
  { name: "Zapier", src: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Zapier_logo.svg", width: 100 },
  { name: "Slack", src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", width: 40 },
  { name: "Make", src: "https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_0dc43e1bd1de35d15b3c9d4a3d04674e/make.png", width: 90 },
  { name: "Retell AI", src: "https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_d81f3e3abec6e0094bfd0a6df6795be2/retell-ai.png", width: 110 },
];

function LogoImage({ logo }: { logo: (typeof LOGOS)[number] }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: logo.width, height: 44 }}
    >
      <img
        src={logo.src}
        alt={logo.name}
        className="max-h-[40px] max-w-full w-auto object-contain opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
        draggable={false}
        loading="lazy"
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = "none";
          const span = document.createElement("span");
          span.textContent = logo.name;
          span.className = "text-sm font-bold text-gray-300 whitespace-nowrap";
          t.parentElement?.appendChild(span);
        }}
      />
    </div>
  );
}

function LogoRow() {
  return (
    <>
      {LOGOS.map((logo) => (
        <LogoImage key={logo.name} logo={logo} />
      ))}
    </>
  );
}

export default function PartnersStrip() {
  return (
    <section className="relative overflow-hidden border-y border-[hsl(214_20%_92%)] bg-[hsl(210_20%_98%)] py-10">
      {/* Label */}
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[hsl(215_15%_62%)]">
        Trusted tools powering our solutions
      </p>

      {/* Single-row infinite marquee — full width, no container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-40 bg-gradient-to-r from-[hsl(210_20%_98%)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-40 bg-gradient-to-l from-[hsl(210_20%_98%)] to-transparent" />

        {/* Marquee track */}
        <div className="flex w-max items-center gap-16 marquee-track" aria-label="Partner tools and integrations">
          <LogoRow />
          <div aria-hidden="true" className="flex items-center gap-16">
            <LogoRow />
          </div>
        </div>
      </div>
    </section>
  );
}
