import { useScrollReveal } from "@/hooks/useScrollReveal";

const VideoSection = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 section-divider" ref={ref}>
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            See How It <span className="text-gold">Works</span>
          </h2>
          <p className="text-muted-foreground">The science behind the social gummy experience.</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-video bg-card border border-border">
          <iframe
            src="https://www.youtube.com/embed/zRwZX_PVTtI"
            title="How ENTOURAGE Gummies Work"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
