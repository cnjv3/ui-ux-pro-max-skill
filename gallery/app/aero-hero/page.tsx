import type { Metadata } from "next";
import AeroHeroDemo from "@/components/ui/aero-hero-3-demo";

export const metadata: Metadata = {
  title: "Aero Hero — UI/UX Pro Max",
};

export default function AeroHeroPage() {
  return (
    <main>
      <AeroHeroDemo />
    </main>
  );
}
