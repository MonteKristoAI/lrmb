import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { portfolioProjects } from "@/data/portfolioData";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {portfolioProjects.map((project) => (
        <section
          key={project.id}
          className="relative h-[95vh] w-full overflow-hidden group cursor-pointer"
        >
          {/* Image */}
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Default vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Text content — bottom center */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-2">
              {project.title}
            </h2>
            <p className="text-white/80 text-lg mb-6 font-body">
              {project.location}
            </p>
            <span className="text-xs uppercase tracking-[0.25em] text-white/70 story-link">
              Click for more info
            </span>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
};

export default Portfolio;
