import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { LocalProduct } from "@/lib/productService";

export type SubscriptionFrequency = "2_weeks" | "1_month" | "2_months" | "3_months";

export const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  "2_weeks": "Every 2 Weeks",
  "1_month": "Every Month",
  "2_months": "Every 2 Months",
  "3_months": "Every 3 Months",
};

export interface LocalCartItem {
  handle: string;
  title: string;
  brand: string;
  variantId: string;
  variantLabel: string;
  price: number;
  quantity: number;
  image: string | null;
  isSubscription?: boolean;
  frequency?: SubscriptionFrequency;
}

interface CartStore {
  items: LocalCartItem[];
  isLoading: boolean;
  addItem: (item: LocalCartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  checkout: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        const { items } = get();
        set({
          items: items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        });
      },

      removeItem: (variantId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.variantId !== variantId) });
      },

      clearCart: () => set({ items: [] }),

      checkout: async () => {
        const { items } = get();
        const subscriptionItems = items.filter((i) => i.isSubscription);
        const oneTimeItems = items.filter((i) => !i.isSubscription);

        // Block mixed cart checkout
        if (subscriptionItems.length > 0 && oneTimeItems.length > 0) {
          toast.error("Mixed cart not supported", {
            description: "Please checkout subscriptions and one-time purchases separately.",
          });
          return;
        }

        // Auth required for subscriptions
        if (subscriptionItems.length > 0) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            throw new Error("AUTH_REQUIRED");
          }
        }

        // All checkout goes through /checkout page (NMI handles both one-time and subscriptions)
        window.location.href = "/checkout";
      },
    }),
    {
      name: "local-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
