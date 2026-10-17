import ActionAreas from "@/components/ActionAreas";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Participate from "@/components/Participate";
import Projects from "@/components/Projects";
import RevealObserver from "@/components/RevealObserver";
import WhyForests from "@/components/WhyForests";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Mission />
        <ActionAreas />
        <Projects />
        <WhyForests />
        <Participate />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
