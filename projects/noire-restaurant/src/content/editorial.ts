import type { MediaKey } from "./media";

/**
 * SAMPLE TESTIMONIALS — placeholder copy written for the demo. They are not
 * genuine customer reviews and must be replaced (or removed) before launch.
 */
export const sampleTestimonials = [
  {
    quote: "The evening felt considered from the first moment to the last.",
    attribution: "Sample guest quote",
  },
  {
    quote: "Every detail contributed to a wonderfully intimate dining experience.",
    attribution: "Sample guest quote",
  },
  {
    quote: "A thoughtful balance of atmosphere, presentation, and flavor.",
    attribution: "Sample guest quote",
  },
];

/** Fictional concepts for the demo — not confirmed facilities. */
export const experienceThemes: {
  id: string;
  label: string;
  title: string;
  copy: string;
  image: MediaKey;
}[] = [
  {
    id: "dining-room",
    label: "The Dining Room",
    title: "Low light, long evenings",
    copy: "Warm tones, soft acoustics and tables spaced for conversation.",
    image: "heroBackground",
  },
  {
    id: "private-dining",
    label: "Private Dining",
    title: "A table of your own",
    copy: "A concept for intimate gatherings, celebrations and quiet occasions.",
    image: "candidateC",
  },
  {
    id: "wine",
    label: "The Wine Experience",
    title: "Poured with intention",
    copy: "A concept for curated pours and pairings guided by the season.",
    image: "candidateB",
  },
];

export type GalleryItem = {
  image: MediaKey;
  caption: string;
  /** Grid placement: 2-column grid on mobile, 12-column editorial grid from md. */
  layout: string;
  /** Aspect ratio below md; from md the grid row height takes over. */
  aspect: string;
};

export const galleryItems: GalleryItem[] = [
  { image: "candidateD", caption: "Fine-dining plating", layout: "col-span-2 md:col-span-5 md:row-span-2", aspect: "aspect-[4/5]" },
  { image: "seasonalIngredients", caption: "Seasonal ingredients", layout: "col-span-1 md:col-span-4", aspect: "aspect-[3/4]" },
  { image: "heroBackground", caption: "Restaurant interiors", layout: "col-span-1 md:col-span-3 md:row-span-2", aspect: "aspect-[3/4]" },
  { image: "chefPreparation", caption: "Chef preparation", layout: "col-span-1 md:col-span-4", aspect: "aspect-square" },
  { image: "wineService", caption: "Wine service", layout: "col-span-1 md:col-span-4", aspect: "aspect-square" },
  { image: "candidateB", caption: "Table details", layout: "col-span-2 md:col-span-8", aspect: "aspect-[16/10]" },
];
