import { cacheLife } from "next/cache";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Experience } from "@/components/sections/Experience";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Reservation } from "@/components/sections/Reservation";
import { SignatureDishes } from "@/components/sections/SignatureDishes";
import { Story } from "@/components/sections/Story";
import { Tasting } from "@/components/sections/Tasting";
import { Testimonials } from "@/components/sections/Testimonials";

async function getCopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Home() {
  const year = await getCopyrightYear();

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <SignatureDishes />
        <Story />
        <Tasting />
        <Experience />
        <Testimonials />
        <Reservation />
        <Gallery />
      </main>
      <Footer year={year} />
    </>
  );
}
