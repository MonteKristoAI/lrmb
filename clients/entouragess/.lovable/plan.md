

## Four Updates

### 1. Age Verification — Already Done
The site already has a working age gate (`AgeGate.tsx`) wrapping all routes in `App.tsx`. No changes needed.

### 2. Individual Product Pages (New)
Create a new page `src/pages/Product.tsx` at route `/product/:blend` (e.g. `/product/relaxed`). Each blend page will display:

- Blend name, description, and effect color
- Two strength tabs: **10mg THC** and **25mg THC** (both with 5mg CBD)
- For each strength, two package sizes:
  - **Single Gummy Pack** (1 gummy)
  - **100mg Total THC Pack** (10 gummies for 10mg strength, 4 gummies for 25mg strength)
- Terpene blend with per-serving amounts
- Cannabinoid content per serving (THC, CBD, terpene totals)
- Serving size and total servings per package
- Placeholder sections for COAs and ingredients (awaiting client assets)

The Shop page product cards will link to `/product/:blend` instead of just showing cards. A route will be added in `App.tsx`.

**Data structure per blend per strength:**

```text
Blend: Relaxed / Balanced / Uplifted
├── 10mg Strength
│   ├── Single Pack: 1 gummy, 10mg THC, 5mg CBD, [terpenes]
│   └── 100mg Pack: 10 gummies, 10mg THC per serving, 5mg CBD per serving
└── 25mg Strength
    ├── Single Pack: 1 gummy, 25mg THC, 5mg CBD, [terpenes]
    └── 100mg Pack: 4 gummies, 25mg THC per serving, 5mg CBD per serving
```

### 3. FDA Disclaimer
Add an FDA disclaimer to the `FarmBillBanner` component (which already appears on every page via `SiteFooter`):

> "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."

### 4. Farm Bill on Every Page — Already Done
The `FarmBillBanner` component is already rendered inside `SiteFooter`, which is included on every page. No changes needed.

---

**Technical summary:**
- **New file:** `src/pages/Product.tsx` — individual product detail page
- **Edit:** `src/App.tsx` — add `/product/:blend` route
- **Edit:** `src/pages/Shop.tsx` — link product cards to `/product/:blend`
- **Edit:** `src/components/FarmBillBanner.tsx` — add FDA disclaimer text

