/**
 * Media registry — every remote asset the site uses lives here.
 *
 * STATUS: these are *candidate* assets supplied with the brief. They could not
 * be fetched from the build environment (outbound access to both hosts was
 * blocked), so neither availability nor subject matter has been verified.
 * Every slot is rendered through <SafeImage>/<HeroVideo>, which swap in a
 * local art-directed fallback panel instead of a broken image if loading fails.
 *
 * To replace an asset: change `src`, update `alt` to describe the new image,
 * and — if it is on a new host — add that host to `images.remotePatterns` in
 * next.config.ts.
 */

export type MediaSlot = {
  src: string | null;
  alt: string;
  /** Short label shown on the fallback panel if the image fails or is missing. */
  fallbackLabel: string;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1600&auto=format&fit=crop`;

export const media = {
  heroBackground: {
    src: "https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/restaurant_bg.png",
    alt: "A softly lit dining room in the evening, tables set for dinner.",
    fallbackLabel: "The dining room",
  },
  heroVideo: {
    src: "https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_food_video.mp4",
    alt: "Close-up footage of a plated signature dish.",
    fallbackLabel: "The signature experience",
  },

  // Candidate photographs supplied with the brief. Subject matter is not
  // guaranteed to match the dish names; review before launch.
  candidateA: {
    src: unsplash("photo-1506377247377-2a5b3b417ebb"),
    alt: "A carefully plated dish photographed in low, warm light.",
    fallbackLabel: "Fine-dining plating",
  },
  candidateB: {
    src: unsplash("photo-1544148103-0773bf10d330"),
    alt: "An intimate restaurant setting with warm light and set tables.",
    fallbackLabel: "Table details",
  },
  candidateC: {
    src: unsplash("photo-1559339352-11d035aa65de"),
    alt: "A restaurant interior with soft evening lighting.",
    fallbackLabel: "Restaurant interior",
  },
  candidateD: {
    src: unsplash("photo-1600891964092-4316c288032e"),
    alt: "A seared cut of beef plated with accompaniments.",
    fallbackLabel: "Ember-seared",
  },

  // Slots with no supplied photograph yet. They render the local fallback
  // panel until a licensed image is added.
  chefPreparation: {
    src: null,
    alt: "Chef preparing a dish at the pass.",
    fallbackLabel: "Chef preparation",
  },
  seasonalIngredients: {
    src: null,
    alt: "Seasonal produce arranged on a dark surface.",
    fallbackLabel: "Seasonal ingredients",
  },
  wineService: {
    src: null,
    alt: "A glass of red wine being poured at the table.",
    fallbackLabel: "Wine service",
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
