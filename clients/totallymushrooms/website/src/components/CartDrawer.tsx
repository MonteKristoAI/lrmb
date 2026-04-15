import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart ({totalItems})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag size={48} className="mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)} className="border-border hover:bg-secondary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="text-sm font-bold text-primary">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border rounded">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout</p>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <button onClick={() => setIsCartOpen(false)} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
