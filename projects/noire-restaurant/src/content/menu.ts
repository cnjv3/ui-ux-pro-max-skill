import type { MediaKey } from "./media";

/**
 * ILLUSTRATIVE CONTENT — dishes, descriptions and prices are fictional
 * placeholders for the NOIRÉ demo. Replace them with the restaurant's real
 * menu. Set `price` to `null` to show "On request" instead of a figure.
 */

export const currency = {
  locale: "es-CL",
  code: "CLP",
  /** Rendered before the amount, e.g. "CLP $32.000". */
  prefix: "CLP $",
};

export function formatPrice(price: number | null) {
  if (price === null) return "On request";
  return `${currency.prefix}${new Intl.NumberFormat(currency.locale).format(price)}`;
}

export type SignatureDish = {
  index: string;
  name: string;
  description: string;
  price: number | null;
  image: MediaKey;
};

export const signatureDishes: SignatureDish[] = [
  {
    index: "01",
    name: "Ember-Seared Wagyu",
    description:
      "Rich, delicately charred beef with a silky reduction and seasonal accompaniments.",
    price: 32000,
    image: "candidateD",
  },
  {
    index: "02",
    name: "Wild Mushroom Risotto",
    description:
      "Creamy Arborio rice, forest mushrooms, aged cheese, and aromatic herbs.",
    price: 18000,
    image: "candidateA",
  },
  {
    index: "03",
    name: "Ocean Butterfish",
    description: "Delicate fish with citrus beurre blanc and seasonal vegetables.",
    price: 24000,
    image: "candidateB",
  },
  {
    index: "04",
    name: "Dark Chocolate Crémeux",
    description:
      "Silky dark chocolate, roasted hazelnut, and a delicate finishing salt.",
    price: 9000,
    image: "candidateC",
  },
];

export type MenuItem = { name: string; note?: string; price: number | null };
export type MenuCategory = { id: string; title: string; items: MenuItem[] };

export const fullMenu: MenuCategory[] = [
  {
    id: "starters",
    title: "Starters",
    items: [
      { name: "Burrata & Heirloom Tomatoes", note: "Basil oil, aged balsamic", price: 12000 },
      { name: "Hand-Cut Beef Tartare", note: "Cured yolk, capers, toasted brioche", price: 14000 },
      { name: "Roasted Pumpkin Velouté", note: "Brown butter, toasted seeds", price: 9500 },
    ],
  },
  {
    id: "mains",
    title: "Mains",
    items: [
      { name: "Ember-Seared Wagyu", note: "Silky reduction, seasonal garnish", price: 32000 },
      { name: "Wild Mushroom Risotto", note: "Aged cheese, aromatic herbs", price: 18000 },
      { name: "Ocean Butterfish", note: "Citrus beurre blanc", price: 24000 },
      { name: "Handmade Truffle Tagliatelle", note: "Parmesan, cultured butter", price: 21000 },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      { name: "Dark Chocolate Crémeux", note: "Roasted hazelnut, finishing salt", price: 9000 },
      { name: "Vanilla Bean Panna Cotta", note: "Macerated berries", price: 8000 },
      { name: "Seasonal Fruit Tart", note: "Crème pâtissière, glazed fruit", price: 8500 },
    ],
  },
  {
    id: "wine",
    title: "Wine & Pairings",
    items: [
      { name: "Sparkling Selection", note: "By the glass", price: 9000 },
      { name: "Chilean Red Wines", note: "By the glass", price: 8500 },
      { name: "White Wine Selection", note: "By the glass", price: 8000 },
      { name: "Sommelier's Pairing", note: "Matched to the tasting experience", price: null },
    ],
  },
];

export const tastingChapters = [
  {
    index: "01",
    title: "The Beginning",
    copy: "Delicate opening flavors, seasonal produce and refined small plates that set a quiet, curious tone for the evening.",
    image: "seasonalIngredients" as MediaKey,
  },
  {
    index: "02",
    title: "The Expression",
    copy: "Thoughtful combinations, rich textures and signature preparations — the heart of the progression.",
    image: "candidateD" as MediaKey,
  },
  {
    index: "03",
    title: "The Finale",
    copy: "Elegant desserts, subtle sweetness and memorable finishing notes to close the table gently.",
    image: "candidateA" as MediaKey,
  },
];
