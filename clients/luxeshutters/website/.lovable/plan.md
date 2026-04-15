

## Replace "Why Choose Us" Section with "How Does it Work?"

Replace the current landscaping-focused "Why MonteKristo Landscaping" section with the "How Does it Work?" process steps from the uploaded screenshots, tailored to the Luxe Shutters business.

### What Changes

**File: `src/components/WhyChooseUs.tsx`**

- Change the section heading from "Why MonteKristo Landscaping" to "How Does it Work?"
- Replace the subtitle and intro paragraph with: "Here at Luxe Shutters, we pride ourselves on being a service based company who supplies and installs the highest quality window furnishings and outdoor screens. We help our clients with a simple, step by step process that removes all stress and offers transparency and communication along the way."
- Replace the 5 landscaping values with 7 process steps:
  1. **Get in Touch With Us** - Request a Free Quote, Book a discovery call or Upload your plans...
  2. **Mobile Showroom** - Our consultants will come to your home and discuss your needs...
  3. **Fast Quote & Follow Up** - You will receive a quote in 48 hours...
  4. **Swift Order Processing & Transparent Lead Times** - As soon as the quote has been accepted and the 50% deposit is paid...
  5. **Preparation for a Smooth Installation Experience** - A couple of weeks prior to your install...
  6. **Installation Day** - The Big Day Arrives! Installation time varies...
  7. **Post Install Support for your New Products** - Once the installation is finished...
- Update the background image import (swap from landscaping to a more relevant one, or keep the current visual style)
- Update the stats at the bottom to reflect shutters/blinds business (keep the layout but adjust labels if needed)

### Technical Details

- Only `src/components/WhyChooseUs.tsx` needs editing
- The numbered list layout (01-07 grid) already works well for this step-by-step format
- The existing grid layout (`grid-cols-[4rem_1fr_1.5fr]`) maps perfectly to the number + title + description format shown in the screenshots

