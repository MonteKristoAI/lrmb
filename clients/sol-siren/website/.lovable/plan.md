

## Plan: Replace Sloane images with WebP versions

### What's changing
Swap the 3 existing Sloane PNG images with the 3 new WebP uploads.

### Image mapping
| Upload | New file | Description |
|--------|----------|-------------|
| `ChatGPT_Image_Mar_22_2026_07_40_56_PM.webp` | `sloane-front.webp` | Front/angle view on mannequin |
| `ChatGPT_Image_Mar_22_2026_07_41_00_PM.webp` | `sloane-details.webp` | Zipper/pocket detail |
| `ChatGPT_Image_Mar_22_2026_07_41_15_PM.webp` | `sloane-hanger.webp` | Branded hanger |

### Steps
1. Copy 3 uploaded WebP files to `src/assets/products/` with new names
2. Delete old files: `sloane-front.png`, `sloane-details.png`, `sloane-hanger.png`
3. Update imports in `src/data/products.ts` from `.png` to `.webp`
4. Verify build succeeds

