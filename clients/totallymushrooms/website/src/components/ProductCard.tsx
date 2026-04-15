import { Link } from "react-router-dom";
import { ShoppingCart, Repeat } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useState } from "react";
import type { Product } from "@/lib/data";

const ProductCard = ({ id, name, subtitle, price, subscriptionPrice, image, category, badge, benefits }: Product) => {
  const { addItem } = useCart();
  const [isSubscription, setIsSubscription] = useState(false);
  const displayPrice = isSubscription ? subscriptionPrice : price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price: displayPrice, image });
    toast.success(`${name} added to cart`);
  };

  const toggleSubscription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubscription(!isSubscription);
  };

  return (
    <Link to={`/product/${id}`} className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-card rounded-sm mb-5">
        <img src={image} alt={name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
        {badge && (
          <span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] bg-primary text-primary-foreground">
            {badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700">
          <div className="absolute bottom-4 left-4 right-4 space-y-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
            {benefits?.slice(0, 3).map((b) => (
              <div key={b} className="flex items-center gap-2 text-xs text-foreground/90">
                <span className="w-px h-3 bg-primary" />
                {b}
              </div>
            ))}
          </div>
          <button onClick={handleAddToCart}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-105"
          >
            <ShoppingCart size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.15em] text-foreground/60 font-medium">{category}</span>
          <button onClick={toggleSubscription}
            className={`text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 border transition-all duration-300 font-medium ${
              isSubscription
                ? "border-primary/50 text-primary bg-primary/10"
                : "border-foreground/20 text-foreground/50 hover:text-foreground/70 hover:border-foreground/30"
            }`}
          >
            <span className="flex items-center gap-1">
              <Repeat size={10} />
              {isSubscription ? "Subscribe" : "One-time"}
            </span>
          </button>
        </div>

        <h3 className="font-heading text-xl text-foreground group-hover:text-primary transition-colors duration-500">{name}</h3>

        {subtitle && (
          <p className="text-sm text-foreground/55 font-heading italic">{subtitle}</p>
        )}

        <div className="flex items-baseline gap-2.5 pt-1">
          <span className="text-xl font-heading text-primary font-medium">${displayPrice.toFixed(2)}</span>
          {isSubscription && (
            <>
              <span className="text-sm text-foreground/40 line-through">${price.toFixed(2)}</span>
              <span className="text-xs text-primary font-medium uppercase tracking-wider">-25%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
