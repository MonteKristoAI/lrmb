import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchAllProducts,
  fetchProductOverrides,
  getBrands,
  getEffects,
  type LocalProduct,
  type EffectTag,
} from "@/lib/productService";

interface UseProductsReturn {
  products: LocalProduct[];
  overrides: Record<string, any>;
  brands: string[];
  effects: EffectTag[];
  loading: boolean;
  refetch: () => void;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [overrides, setOverrides] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, ovr] = await Promise.all([
        fetchAllProducts(),
        fetchProductOverrides(),
      ]);
      setProducts(prods);
      setOverrides(ovr);
    } catch {
      // fetchAllProducts already falls back to hardcoded
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const brands = useMemo(() => getBrands(products), [products]);
  const effects = useMemo(() => getEffects(products), [products]);

  return { products, overrides, brands, effects, loading, refetch: load };
}
