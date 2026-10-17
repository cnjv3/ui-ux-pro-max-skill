/**
 * Brand-level configuration.
 *
 * NOIRÉ is a fictional brand created for a design demonstration. Every contact
 * field below is intentionally empty: fill them in only with real, verified
 * details. Components hide anything that is left as `null` / empty.
 */

export type NavItem = { label: string; href: `#${string}` };

export const siteConfig = {
  name: "NOIRÉ",
  fullName: "NOIRÉ Restaurant & Wine Bar",
  tagline: "Contemporary fine dining, seasonal ingredients and curated wines.",
  description:
    "An intimate dining room and wine bar built around seasonal ingredients, considered technique and evenings designed to be savored.",

  nav: [
    { label: "Home", href: "#home" },
    { label: "Our Story", href: "#story" },
    { label: "Menu", href: "#menu" },
    { label: "Experience", href: "#experience" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavItem[],

  /** Shown in the hero. Do not replace with a street address unless it is real. */
  atmosphereLabel: "Location to be announced",
  serviceLabel: "Dinner & wine, after dark",

  contact: {
    /** e.g. "reservations@your-domain.com" */
    email: null as string | null,
    /** Display format, e.g. "+56 9 1234 5678" */
    phone: null as string | null,
  },

  /**
   * International number without "+" or spaces, e.g. "56912345678".
   * When set, the reservation section shows an optional WhatsApp button that
   * opens a prefilled message in the guest's own WhatsApp app.
   */
  whatsappNumber: null as string | null,

  /** Add only real, owned profiles. Empty array hides the block. */
  socials: [] as { label: string; href: string }[],

  /**
   * Set to `true` only once the newsletter form is wired to a real provider.
   * While `false`, the form is labelled as a demo and nothing is sent.
   */
  newsletterConnected: false,
  /** Same idea for the reservation form. */
  reservationsConnected: false,
} as const;
