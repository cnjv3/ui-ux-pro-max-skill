import { useReveal } from './hooks/useReveal'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Services } from './components/Services'
import { Gallery } from './components/Gallery'
import { BusinessHours } from './components/BusinessHours'
import { Location } from './components/Location'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { FloatingWhatsApp } from './components/WhatsAppButton'

export default function App() {
  useReveal()
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] bg-gold px-4 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <BusinessHours />
        <Location />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
