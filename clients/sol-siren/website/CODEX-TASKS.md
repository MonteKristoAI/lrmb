# Sol Siren — April 8 Corrections Implementation

You are Codex operating on the `sol-siren` Vite + React + TypeScript project. The Sol Siren Vintage client (Erin) sent a thread of 38 emails on April 8 2026 correcting wrong product photos on her site. All the new photos are staged in `_incoming-apr8/<product>/` and the complete manifest is `_incoming-apr8/INSTRUCTIONS.md`. Your job: apply everything end-to-end and leave the project in a clean, buildable state.

**Do not ask for approval between steps. Work autonomously. Commit nothing — leave changes uncommitted for review.**

---

## Ground rules

1. Project root: `/Users/milanmandic/Desktop/MonteKristo AI/sol-siren`
2. Package manager: `bun`
3. Image tooling: `sips` (macOS, HEIC → JPG) and `cwebp` (JPG → webp, quality 85). Both already installed. Example conversion:
   ```bash
   sips -s format jpeg input.heic --out /tmp/stage.jpg
   cwebp -q 85 /tmp/stage.jpg -o output.webp
   ```
   For PNG/JPG/JPEG input, skip `sips` and go direct with `cwebp`. For `.webp` input, just copy the file.
3. Never `rm -rf` a whole product folder without replacing it. Delete individual files inside and write new ones.
4. All new webp outputs must be reasonably sized (< 500KB ideally, < 1MB max). Use `cwebp -q 85`. If >1MB, re-run with `-q 75`.
5. Work in a single pass — don't ask questions mid-run.

---

## Phase 1 — Convert staging images to webp

For every folder in `_incoming-apr8/` that contains raw images (any non-webp), produce `.webp` versions IN PLACE next to the originals, named `<product>-<N>.webp` (1-indexed, numeric, sequential). Keep existing webp files untouched. Once all webp versions exist, **delete the raw originals** from the staging folder so each product folder only contains webp files numbered `<product>-1.webp … <product>-N.webp`.

Folders to process (with expected counts after conversion):

| Folder | Count | Notes |
|---|---|---|
| `nova/` | 3 | Rename from "N.K." |
| `roxanne/` | 6 | Replace all |
| `sybil/` | 5 | Replace all |
| `frankie/` | 4 | Already webp — just renumber if needed |
| `kate/` | 7 | Replace all |
| `aspen/` | 7 | Replace all |
| `collette/` | 9 | Replace all |
| `rhiannon/` | 6 | Replace all |
| `margaret/` | 1 | Prepend to existing (see Phase 2) |
| `simone/` | 3 | Replace all |
| `janis/` | 5 | Replace all |
| `margaux/` | 5 | Replace all |
| `elvira/` | 6 | Replace all |
| `emmylou/` | 3 | Already PNG from Drive — convert |
| `stevie/` | 8 | Replace all |
| `sierra/` | 7 | **SKIP** — treat as obsolete (Sierra was renamed to Tallulah; use tallulah/ set only) |
| `vixen/` | 11 | Replace all |
| `cleo/` | 6 | Replace all |
| `roan/` | 8 | Replace all |
| `valentina/` | 8 | Replace all |
| `vivienne/` | 9 | Replace all |
| `kendra/` | 1 | Prepend to existing (see Phase 2) |
| `candace/` | 8 | Replace all |
| `diana/` | 10 | Replace all |
| `bianca/` | 9 | Replace all |
| `nico/` | 12 | Replace all |
| `blair/` | 1 | Prepend to existing (see Phase 2) |
| `tallulah/` | 13 | Replace all (Tallulah is the canonical rename of Sierra) |
| `clover/` | 9 | Replace all |

Empty folders to ignore completely: `goldie/`, `farrah/`, `topanga/`, `aurora/`. Client will send photos later.

After Phase 1 each listed folder contains only `<product>-1.webp … <product>-N.webp`, sorted sequentially. There should be no `.heic`, `.jpg`, `.jpeg`, `.png` files in any `_incoming-apr8/<product>/` folder.

---

## Phase 2 — Sync into `src/assets/products/`

For each product in Phase 1's table, update `src/assets/products/<product>/` according to the mode:

### Mode A — REPLACE ALL (default)

Applies to: roxanne, sybil, kate, aspen, collette, rhiannon, simone, janis, margaux, elvira, emmylou, stevie, vixen, cleo, roan, valentina, vivienne, candace, diana, bianca, nico, tallulah, clover, nova

Steps:
1. Delete all existing `.webp` files in `src/assets/products/<product>/` (create the folder if it doesn't exist — only `frankie/` is new).
2. Copy every `_incoming-apr8/<product>/<product>-*.webp` file into `src/assets/products/<product>/` with the same name.
3. If the folder contained other files before (e.g. top-level `<product>-front.webp` outside the folder), leave those alone — only touch files inside `src/assets/products/<product>/`.

### Mode B — PREPEND (additive)

Applies to: **blair, kendra, margaret**

The client said "add this photo" / "delete first photo, replace with attached". Interpretation:
1. Rename the existing files in `src/assets/products/<product>/`: shift each `<product>-N.webp` up by the number of new photos (e.g. if 1 new photo, old `<product>-1.webp` becomes `<product>-2.webp`). For `margaret`, delete old `margaret-1.webp` first (client said delete first photo), then rename the rest up by one starting from 2, then place new photo as `margaret-1.webp`.
   - **blair**: existing count unknown — list folder, shift everything up by 1, place new file as `blair-1.webp`.
   - **kendra**: shift existing up by 1, place new file as `kendra-1.webp`.
   - **margaret**: delete existing `margaret-1.webp`, leave the rest in place (they already keep numbering 2..N), place new file as `margaret-1.webp`.
2. Always use the numbers that leave a contiguous 1..N sequence.

### Mode C — AURORA/TILLY first photo reorder

The client said "AURORA — please use pic #5 as first image" and later "AURORA should be renamed TILLY". The product is already named Tilly in the codebase (`src/assets/products/tilly/`). No photos were sent — just reorder existing ones:

1. In `src/assets/products/tilly/`, identify the current `tilly-5.webp`.
2. Rename current `tilly-1.webp` → temp, current `tilly-5.webp` → `tilly-1.webp`, temp → `tilly-5.webp`.
3. That puts the existing pic #5 in slot 1 and the old pic 1 in slot 5. Everything else stays.

### Mode D — New product (FRANKIE)

Create `src/assets/products/frankie/` and copy the four staged webp files (`frankie-1.webp`..`frankie-4.webp`) into it.

---

## Phase 3 — Update `src/data/products.ts`

The file uses dynamic imports of individual webp files plus a `products` array with per-product objects. For each modified product, regenerate the import block and the `images: [...]` array so they reflect the new file count exactly.

### Products needing import/images updates

For each product in the Phase 1 table (except Aurora/Tilly reorder, which doesn't change imports), make sure:
1. The `import <product>Img<N>` lines match the new number of files (1..N).
2. The product object's `image: <product>Img1` (hero) stays at `<product>Img1`.
3. The product object's `images: [<product>Img1, ..., <product>Img<N>]` array is regenerated in order 1..N.
4. Remove any stale imports that no longer correspond to a file.

Watch out for existing weirdness in the file — e.g. some products currently have imports with mismatched numbering like `margaret-20.webp`, `aspen-10.webp`, `tallulah-11.webp`. Your job is to replace those with clean 1..N ordering after the folder sync.

### Mode A+B products: ensure alignment

After renaming/copying files in Phase 2, the folder contents for every touched product should be `<product>-1.webp` through `<product>-N.webp` with no gaps. Update the imports accordingly.

### Special: FRANKIE (new product)

Add a new product entry to the `products` array. Use this template (insert in the Penny Lane / Afghan section, near Roxanne/Sybil):

```ts
{
  id: "frankie",
  name: "FRANKIE",
  variant: "Vintage 1970s Suede & Fur Trim Penny Lane Jacket – The Frankie",
  price: 0,
  image: frankieImg1,
  slug: toSlug("frankie"),
  category: "Penny Lane/Afghan",
  description:
    "Frankie carries the quiet confidence of 1970s bohemian outerwear. Crafted in rich brown suede with soft fur trim along the collar and front, this jacket captures the relaxed tailoring and textural contrast that defined the era.\n\nA garment with a past — ready for its next chapter.",
  materials: "Suede body, fur trim, satin lining",
  era: "1970s",
  color: "Brown",
  condition: "Excellent vintage condition",
  tags: ["Penny Lane", "Afghan", "Suede", "Fur trim"],
  images: [frankieImg1, frankieImg2, frankieImg3, frankieImg4],
  sold: false,
},
```

Add the corresponding imports at the top of the file:

```ts
import frankieImg1 from "@/assets/products/frankie/frankie-1.webp";
import frankieImg2 from "@/assets/products/frankie/frankie-2.webp";
import frankieImg3 from "@/assets/products/frankie/frankie-3.webp";
import frankieImg4 from "@/assets/products/frankie/frankie-4.webp";
```

If the existing product objects in the file use slightly different field names (e.g. `type` instead of `category`, or missing `sold`), copy the shape from the nearest Penny Lane/Afghan product (Roxanne or Sybil) verbatim — match the existing schema exactly. Read one existing product object first, then mirror it.

### Special: TALLULAH (merge Sierra batch)

The `sierra/` staging folder is obsolete. The `tallulah/` product entry already exists. After Phase 2, the `src/assets/products/tallulah/` folder should contain `tallulah-1.webp` through `tallulah-13.webp`. Regenerate the 13 imports and the images array.

### Special: VIXEN title fix

In the `vixen` product object, if the variant/name/description contains "bearskin" (any casing), replace with "boarskin". The client was explicit: "The title should read 'boarskin' not 'bearskin'."

### Special: JANIS sold

Mark the `janis` product as sold. Set `sold: true` (or whatever the existing schema uses for sold items — mirror how `sloane` is marked). Reason: client asked on Apr 10 "Can you please mark the Janis Coat sold/archived?"

### Special: NOVA

The nova product already exists. After Phase 2, the folder should contain `nova-1.webp`, `nova-2.webp`, `nova-3.webp`. Regenerate imports and images array. Current file has 5 nova imports — reduce to 3.

---

## Phase 4 — Verify

1. Run `bun install` if needed, then `bun run build` from the project root.
2. If the build fails:
   - Read the error.
   - Fix missing imports / typos / stale references.
   - Re-run.
3. Keep iterating until `bun run build` exits 0.
4. Do NOT run `bun run dev` (no need for a dev server).

---

## Phase 5 — Report

Write a summary to `/Users/milanmandic/Desktop/MonteKristo AI/sol-siren/CODEX-REPORT.md` with:
- Total images converted
- Total raw files deleted from staging
- Per-product counts before/after in `src/assets/products/`
- List of products.ts edits (imports added/removed, products added, products changed)
- FRANKIE confirmation (folder + product entry)
- VIXEN title confirmation
- JANIS sold confirmation
- Build result (`bun run build` exit status and bundle sizes)
- Any products that had ambiguity or issues you resolved
- Any follow-ups the human should handle (e.g. Goldie/Farrah/Topanga photos still pending from client, Frankie description is placeholder)

---

## Known follow-ups (DO NOT try to do these — out of scope for this run)

- Create jewelry section from `SOL SIREN DESIGN JEWELRY.numbers` spreadsheet
- Gift cards in $50 increments feature
- Goldie / Farrah / Topanga photos (client will send later)
- Topanga sizing placeholders

Focus only on the 25 products listed in the Phase 1 table + FRANKIE new product + JANIS sold + VIXEN title fix.
