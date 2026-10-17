export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@silva.example";

export const navLinks = [
  { label: "About", href: "#mission" },
  { label: "Projects", href: "#projects" },
  { label: "Community", href: "#participate" },
  { label: "Conservation", href: "#action" },
  { label: "Journal", href: "#journal" },
] as const;

export function mailto(subject: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
}
