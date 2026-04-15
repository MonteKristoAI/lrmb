import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/productsData";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            Our Collection
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mt-4 mb-6">
            Our Products
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Discover our complete range of premium aluminum windows and doors,
            engineered for performance, durability, and timeless design.
          </p>
        </div>
      </section>

      {/* Products List */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 flex flex-col gap-24">
          {products.map((product, index) => {
            const isImageLeft = index % 2 === 0;

            const imageBlock = (
              <div className="w-full aspect-[4/3] rounded-sm overflow-hidden group">
                <img
                  src={product.image}
                  alt={`${product.name} — ${product.category}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            );

            const textContent = (
              <div className="flex flex-col justify-center gap-4">
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                  {product.category}
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                  {product.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div>
                  <a
                    href="/#quote"
                    className="mt-2 inline-block bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    Request a Quote
                  </a>
                </div>
              </div>
            );

            return (
              <div
                key={product.id}
                id={product.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {isImageLeft ? (
                  <>
                    {imageBlock}
                    {textContent}
                  </>
                ) : (
                  <>
                    <div className="order-2 md:order-1">{textContent}</div>
                    <div className="order-1 md:order-2">{imageBlock}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
