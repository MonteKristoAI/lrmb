import { Link } from "react-router-dom";

const categories = [
{
  name: "Fur",
  image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
  link: "/shop?category=fur"
},
{
  name: "Leather",
  image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80&auto=format&fit=crop",
  link: "/shop?category=leather"
},
{
  name: "Penny Lane / Afghan",
  image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80&auto=format&fit=crop",
  link: "/shop?category=penny-lane-afghan"
},
{
  name: "Overcoat",
  image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80&auto=format&fit=crop",
  link: "/shop?category=overcoat"
},
{
  name: "Apres Ski",
  image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80&auto=format&fit=crop",
  link: "/shop?category=apres-ski"
},
{
  name: "Jewelry",
  image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=800&q=80&auto=format&fit=crop",
  link: "/jewelry"
}];


const ShopByCategory = () => {
  return (
    <section className="bg-background py-20 md:py-28 px-6 md:px-16 lg:px-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
          Find Your Style
        </h2>
        <p className="mt-4 font-body text-lg md:text-xl tracking-wide text-muted-foreground">
          Vintage, arranged by category
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {categories.map((cat) =>
        <Link
          key={cat.name}
          to={cat.link}
          className="group relative block aspect-[3/4] overflow-hidden">
          
            <img
            src={cat.image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          
            <div className="absolute inset-0 bg-foreground/30 transition-colors duration-500 group-hover:bg-foreground/45" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-xs tracking-[0.3em] uppercase text-background">
                {cat.name}
              </span>
            </div>
          </Link>
        )}
      </div>
    </section>);

};

export default ShopByCategory;