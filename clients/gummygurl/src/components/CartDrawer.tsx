import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, RefreshCw, Loader2, Truck, Lock } from "lucide-react";
import { useCartStore, FREQUENCY_LABELS } from "@/stores/cartStore";

const SHIPPING_FLAT_RATE = 8.0;
const FREE_SHIPPING_THRESHOLD = 99.0;
import AuthRequiredDialog from "@/components/AuthRequiredDialog";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { items, isLoading, updateQuantity, removeItem, checkout } = useCartStore();

  const handleCheckout = async () => {
    try {
      await checkout();
    } catch (err: any) {
      if (err?.message === "AUTH_REQUIRED") {
        setShowAuthDialog(true);
      }
    }
  };
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasSubscriptions = items.some((i) => i.isSubscription);

  return (
    <>
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-2">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart className="w-6 h-6 text-muted-foreground opacity-30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.brand} · {item.variantLabel}</p>
                        {item.isSubscription && item.frequency && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <RefreshCw className="w-3 h-3 text-primary" />
                            <span className="text-xs text-primary font-medium">{FREQUENCY_LABELS[item.frequency]}</span>
                          </div>
                        )}
                        <p className="font-semibold text-foreground">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.variantId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-3 pt-4 border-t bg-background">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {!hasSubscriptions && (
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        Shipping
                      </span>
                      {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                        <span className="text-emerald-600 font-medium">FREE</span>
                      ) : (
                        <span>${SHIPPING_FLAT_RATE.toFixed(2)}</span>
                      )}
                    </div>
                  )}
                  {!hasSubscriptions && totalPrice > 0 && totalPrice < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-[11px] text-muted-foreground/70">
                      Add ${(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    ${(totalPrice + (hasSubscriptions ? 0 : (totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE))).toFixed(2)}
                  </span>
                </div>
                <p className="text-[9px] leading-relaxed text-muted-foreground/70 text-center">
                  All hemp-derived products are Farm Bill compliant and contain less than 0.3% THC by dry weight. These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease. Must be 21+ to purchase. Ships only where legally permitted.
                </p>
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={items.length === 0 || isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  {hasSubscriptions ? "Subscribe & Checkout" : "Secure Checkout"}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Secure encrypted checkout
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
    <AuthRequiredDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
}
