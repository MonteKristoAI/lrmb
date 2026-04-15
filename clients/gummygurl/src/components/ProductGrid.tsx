import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";
import type { LocalProduct } from "@/lib/productService";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showHeader?: boolean;
}

export default function ProductGrid({
  title = "Shop Our Products",
  subtitle = "Premium hemp-derived products, wellness supplements, and pet CBD — all third-party lab tested.",
  limit = 12,
  showHeader = true,
}: ProductGridProps) {
  const { products: allProducts } = useProducts();
  const products = allProducts.slice(0, limit);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (product: LocalProduct) => {
    const variant = product.variants[0];
    if (!variant) return;
    addItem({
      handle: product.handle,
      title: product.title,
      brand: product.brand,
      variantId: variant.id,
      variantLabel: variant.label,
      price: variant.price,
      quantity: 1,
      image: product.image,
    });
    toast.success("Added to cart", { description: product.title });
  };

  if (products.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          {showHeader && (
            <>
              <h2 className="text-3xl font-bold mb-4 text-foreground">{title}</h2>
              <p className="mb-8 text-muted-foreground">{subtitle}</p>
            </>
          )}
          <div className="rounded-2xl p-12 max-w-md mx-auto bg-muted border border-border">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No products found yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="w-12 h-0.5 mb-6 rounded-full mx-auto bg-primary" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">{title}</h2>
            <p className="leading-relaxed text-lg text-muted-foreground">{subtitle}</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.handle}
              className="rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col hover:-translate-y-1 bg-card border border-border shadow-soft hover:shadow-elevated"
            >
              <Link to={`/product/${product.handle}`} className="block">
                <div className="aspect-square overflow-hidden bg-muted relative">
                  {product.image ? (
                    <>
                      <OptimizedImage
                        src={product.image}
                        alt={product.title}
                        wrapperClassName="w-full h-full"
                        aspectRatio="1/1"
                        className={`transition-all duration-300 group-hover:scale-105 ${product.productImage && product.productImage !== product.image ? "group-hover:opacity-0" : ""}`}
                      />
                      {product.productImage && product.productImage !== product.image && (
                        <div className="absolute inset-0">
                          <OptimizedImage
                            src={product.productImage}
                            alt={`${product.title} - hover`}
                            wrapperClassName="w-full h-full"
                            aspectRatio="1/1"
                            className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                      <ShoppingCart className="w-12 h-12 opacity-20 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-5 flex-1 flex flex-col">
                <Link to={`/product/${product.handle}`}>
                  <h3 className="font-semibold mb-1 transition-colors line-clamp-2 text-foreground">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-sm mb-3 line-clamp-2 flex-1 text-muted-foreground">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="text-sm line-through text-muted-foreground">${product.comparePrice.toFixed(2)}</span>
                    )}
                  </div>
                  <Button size="sm" onClick={() => handleAddToCart(product)} className="gap-1.5">
                    <ShoppingCart className="w-4 h-4" />Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
