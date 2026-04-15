

## Portfolio Page

### What we're building
A full-screen portfolio page with 6 project images, each taking up nearly the entire viewport. On hover, the image reveals the project name, location, and a "Click for more info" prompt at the bottom center. Clean, immersive, editorial feel.

### Projects (placeholder data)
1. Luxury Villa — Dubai
2. Modern Residence — Riyadh
3. Commercial Tower — Jeddah
4. Waterfront Penthouse — Abu Dhabi
5. Corporate Headquarters — Montreal
6. Heritage Renovation — Quebec City

### Changes

**1. Create portfolio data (`src/data/portfolioData.ts`)**
- Array of 6 projects with id, title, location, and a high-quality Unsplash placeholder image URL

**2. Create Portfolio page (`src/pages/Portfolio.tsx`)**
- Navbar + Footer for consistent layout
- 6 stacked sections, each with an image covering ~95vh
- Default state: image only, subtle dark vignette at bottom
- On hover: smooth overlay fade-in with project title, location, and "Click for more info" text centered at the bottom
- Hover animation: overlay fades in, text slides up slightly
- Images use `object-cover` for full bleed
- Not clickable yet — just cursor-pointer styling for future use

**3. Update Navbar (`src/components/Navbar.tsx`)**
- Change Portfolio href from `#portfolio` to `/portfolio` and add `isRoute: true`

**4. Update routes (`src/App.tsx`)**
- Add `/portfolio` route

### Design
- Each image: `h-[95vh] w-full object-cover` inside a `relative overflow-hidden` container
- Hover overlay: `bg-black/40` with `transition-opacity duration-500`
- Text: Playfair Display for title, DM Sans for location and CTA
- "Click for more info" in small uppercase tracking text with a subtle underline animation

