import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import bearPink from "@/assets/hero-gummy-bear.webp";
import bearOrange from "@/assets/bear-orange.webp";
import bearPurple from "@/assets/bear-purple.webp";
import bearYellow from "@/assets/bear-yellow.webp";
import bearGreen from "@/assets/bear-green.webp";
import bearBlue from "@/assets/bear-blue.webp";

const VIBES = [
  { name: "Berry Bliss", color: "#EC4899", img: bearPink },
  { name: "Sunset Peach", color: "#F97316", img: bearOrange },
  { name: "Grape Chill", color: "#7C3AED", img: bearPurple },
  { name: "Lemon Drop", color: "#EAB308", img: bearYellow },
  { name: "Mint Cool", color: "#16A34A", img: bearGreen },
  { name: "Blue Dream", color: "#0EA5E9", img: bearBlue },
];

const SHAPES = ["Bear", "Cube", "Drop"] as const;
type Shape = (typeof SHAPES)[number];

export default function HeroSection() {
  const navigate = useNavigate();
  const [selectedVibe, setSelectedVibe] = useState(0);
  const [selectedShape, setSelectedShape] = useState<Shape>("Bear");
  const [fading, setFading] = useState(false);

  const activeColor = VIBES[selectedVibe].color;

  const handleVibeChange = (i: number) => {
    if (i === selectedVibe) return;
    setFading(true);
    setTimeout(() => {
      setSelectedVibe(i);
      setFading(false);
    }, 180);
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "hsl(210 25% 97%)" }}>
      {/* Section header */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 mb-12 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: "hsl(217 91% 50%)" }}>
          Choose Your Vibe
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Find Your Perfect Gummy
        </h2>
      </div>

      {/* Subtle bg accent blob */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 transition-colors duration-700"
        style={{ background: activeColor }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-[100px] opacity-8 transition-colors duration-700"
        style={{ background: "hsl(210 80% 70%)" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center max-w-4xl mx-auto">

          {/* LEFT — Hero media */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-[2rem] overflow-hidden border border-border bg-white flex items-center justify-center">
              {/* Radial glow behind bear */}
              <div
                className="absolute inset-0 animate-glow-pulse"
                style={{
                  background: `radial-gradient(circle at center, ${activeColor}20 0%, transparent 70%)`,
                  transition: "background 0.7s ease",
                }}
              />

              {selectedShape === "Bear" ? (
                <img
                  key={selectedVibe}
                  src={VIBES[selectedVibe].img}
                  alt={`GummyGurl ${VIBES[selectedVibe].name} gummy bear`}
                  className="relative z-10 w-[70%] h-auto animate-float drop-shadow-2xl transition-[filter] duration-300"
                  style={{
                    opacity: fading ? 0 : 1,
                    transition: "opacity 0.18s ease",
                    willChange: "transform",
                  }}
                />
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <span className="text-foreground/70 text-lg font-bold tracking-wide">
                    {selectedShape} Shape
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-border text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Pick your vibe */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[280px] bg-white shadow-card border border-border rounded-2xl p-6 space-y-5">
              <h3 className="text-foreground font-bold text-sm tracking-wide">
                Pick your vibe
              </h3>

              {/* Color swatches */}
              <div className="space-y-2.5">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                  Flavor
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {VIBES.map((vibe, i) => (
                    <button
                      key={vibe.name}
                      title={vibe.name}
                      onClick={() => handleVibeChange(i)}
                      className="relative w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110"
                      style={{ background: vibe.color }}
                    >
                      {selectedVibe === i && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-foreground ring-offset-2 ring-offset-white" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs font-medium transition-colors duration-300" style={{ color: activeColor }}>
                  {VIBES[selectedVibe].name}
                </p>
              </div>

              {/* Effect meanings */}
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                  Effects
                </span>
                {[
                  { label: "Sleep", desc: "Deep relaxation & better nights" },
                  { label: "Focus", desc: "Clear mind & productivity" },
                  { label: "Calm", desc: "Stress relief & balance" },
                ].map((e) => (
                  <div key={e.label} className="flex items-baseline gap-2">
                    <span className="text-[11px] font-semibold text-foreground/50 w-10 shrink-0">{e.label}</span>
                    <span className="text-[10px] text-muted-foreground">{e.desc}</span>
                  </div>
                ))}
              </div>

              {/* Shape toggle */}
              <div className="space-y-2.5">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                  Shape
                </span>
                <div className="flex gap-1.5 bg-muted rounded-xl p-1">
                  {SHAPES.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all duration-200 ${
                        selectedShape === shape
                          ? "bg-white text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full font-semibold text-sm transition-colors duration-300"
                style={{ background: activeColor }}
                onClick={() => navigate("/shop")}
              >
                Shop {VIBES[selectedVibe].name} Gummies
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
