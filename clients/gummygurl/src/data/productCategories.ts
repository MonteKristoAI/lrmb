import type { CategorySlug, SubcategorySlug } from "./products";

export interface Subcategory {
  slug: SubcategorySlug;
  label: string;
}

export interface ProductCategory {
  slug: CategorySlug;
  label: string;
  subcategories: Subcategory[];
  comingSoon?: boolean;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: "thc-edibles",
    label: "THC Edibles",
    subcategories: [
      { slug: "gummies", label: "Gummies" },
      { slug: "cookies-dessert-edibles", label: "Cookies & Dessert Edibles" },
      { slug: "chocolate-candy", label: "Chocolate & Candy" },
      { slug: "drink-mixes", label: "Drink Mixes" },
      { slug: "specialty-edibles", label: "Specialty Edibles" },
    ],
  },
  {
    slug: "thca-flower",
    label: "THCA Flower",
    subcategories: [],
  },
  {
    slug: "mushroom-products",
    label: "Mushroom Products",
    subcategories: [
      { slug: "mushroom-gummies", label: "Mushroom Gummies" },
      { slug: "mushroom-chocolate", label: "Mushroom Chocolate" },
    ],
  },
  {
    slug: "health-wellness",
    label: "Health & Wellness",
    subcategories: [
      { slug: "cbd-gummies", label: "CBD Gummies" },
      { slug: "tinctures", label: "Tinctures" },
      { slug: "sleep-support", label: "Sleep Support" },
      { slug: "intimacy-support", label: "Intimacy Support" },
      { slug: "topicals", label: "Topicals" },
    ],
  },
  {
    slug: "pet-wellness",
    label: "Pet Wellness",
    subcategories: [
      { slug: "crunchy-treats", label: "Crunchy Treats" },
      { slug: "soft-chews", label: "Soft Chews" },
      { slug: "protein-treats", label: "Protein Treats" },
    ],
  },
  {
    slug: "bundles",
    label: "Bundles",
    subcategories: [],
  },
];
