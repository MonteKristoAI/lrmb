import { useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, MessageSquarePlus, BadgeCheck, MapPin, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REVIEWS } from "@/data/clinicData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ReviewModal from "@/components/ReviewModal";

const AVATAR_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-amber-600",
  "bg-rose-600", "bg-teal-600", "bg-indigo-600", "bg-orange-600",
  "bg-cyan-600", "bg-pink-600",
];

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const avgRating = "5.0";
const totalReviews = 16;

export default function ReviewsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useScrollAnimation();

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  const openLightbox = (photos: string[], index: number) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const lightboxPrev = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length } : lb);
  const lightboxNext = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.photos.length } : lb);

  return (
    <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(210 22% 90%), hsl(210 18% 93%))' }}>
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="absolute top-10 -right-20 w-[450px] h-[450px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(210 65% 42% / 0.05), transparent 70%)' }} />
      <div className="absolute -bottom-16 left-1/4 w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(210 40% 50% / 0.04), transparent 70%)' }} />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">Customer reviews</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-5">What our customers say</h2>
            <div className="inline-flex items-center gap-4 bg-card rounded-xl px-5 py-3.5 shadow-card border border-border/60">
              <div className="flex items-center gap-1.5">
                <GoogleIcon className="w-6 h-6" />
                <span className="text-2xl font-bold text-foreground">{avgRating}</span>
              </div>
              <div className="border-l border-border/60 pl-4">
                <div className="flex items-center gap-0.5 mb-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Based on {totalReviews}+ Google reviews</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Review cards */}
        <div
          ref={scrollRef}
          className={`flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-fade ${isVisible ? "visible" : ""}`}
          style={{ scrollbarWidth: "none" }}
        >
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="shrink-0 w-[360px] bg-card rounded-xl border border-border/50 p-5 snap-start hover:shadow-elevated transition-shadow duration-300 flex flex-col"
            >
              {/* Profile row */}
              <div className="flex items-start gap-3 mb-3.5">
                {review.profilePhoto ? (
                  <img
                    src={review.profilePhoto}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
                    {review.avatar}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground truncate">{review.name}</span>
                    <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">{review.timeAgo}</span>
                    {review.location !== "NSW, Australia" && (
                      <>
                        <span className="text-muted-foreground/40 text-xs">·</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{review.location}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <GoogleIcon className="w-5 h-5 shrink-0 opacity-40" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                ))}
              </div>

              {/* Review text */}
              <p className={`text-sm text-foreground/80 leading-relaxed mb-3.5 ${!review.photos?.length ? "flex-1" : ""}`}>{review.text}</p>

              {/* Photos grid */}
              {review.photos && review.photos.length > 0 && (
                <div className={`grid gap-1.5 mb-3.5 flex-1 min-h-[120px] ${review.photos.length === 1 ? "grid-cols-1" : review.photos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {review.photos.slice(0, 3).map((photo, pi) => (
                    <button
                      key={pi}
                      onClick={() => openLightbox(review.photos!, pi)}
                      className="relative rounded-lg overflow-hidden group w-full h-full"
                    >
                      <img
                        src={photo}
                        alt={`${review.name} photo ${pi + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      {pi === 2 && review.photos!.length > 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <span className="text-white text-sm font-semibold">+{review.photos!.length - 3}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Service tag */}
              <div className="pt-3 border-t border-border/40">
                <span className="text-xs font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-md">
                  {review.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button size="lg" onClick={() => setModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <MessageSquarePlus className="w-5 h-5" />
            Leave a review
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {lightbox.photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={lightbox.photos[lightbox.index]}
            alt="Review photo"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {lightbox.photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {lightbox.photos.map((_, pi) => (
                <button
                  key={pi}
                  onClick={(e) => { e.stopPropagation(); setLightbox((lb) => lb ? { ...lb, index: pi } : lb); }}
                  className={`w-2 h-2 rounded-full transition-colors ${pi === lightbox.index ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <ReviewModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
