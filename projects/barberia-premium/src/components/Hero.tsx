import { ArrowDown, Clock, MapPin, Phone } from 'lucide-react'
import { business } from '../config/business'
import { groupWeekly } from '../lib/hours'
import { fullAddress } from '../lib/maps'
import { phoneHref } from '../lib/whatsapp'
import { LogoMark } from './ui/Logo'
import { SmartImage } from './ui/SmartImage'
import { DemoBadge } from './ui/DemoBadge'
import { WhatsAppButton } from './WhatsAppButton'

export function Hero() {
  const hours = groupWeekly(business.hours.weekly).filter((r) => !r.closed)
  const tel = phoneHref()
  const { address, contact } = business

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <SmartImage
        src={business.images.hero}
        alt=""
        width={2400}
        height={1600}
        priority
        widths={[768, 1280, 1920, 2400]}
        className="absolute inset-0 -z-20"
        imgClassName="hero-zoom"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,11,9,0.78)_0%,rgba(13,11,9,0.55)_40%,rgba(13,11,9,0.92)_88%,#0d0b09_100%)]"
      />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      <div className="container-x flex flex-1 flex-col items-center justify-center pt-32 pb-14 text-center">
        <LogoMark className="fade-up h-20 w-auto text-gold sm:h-24" />
        <p
          className="fade-up mt-6 text-[0.7rem] font-medium tracking-[0.5em] text-gold uppercase"
          style={{ ['--delay' as string]: '120ms' }}
        >
          {business.descriptor} {business.name}
        </p>
        <h1
          id="hero-title"
          className="heading fade-up mt-6 max-w-4xl text-[clamp(2.9rem,9vw,6.6rem)] text-ivory"
          style={{ ['--delay' as string]: '220ms' }}
        >
          {/* Cada frase en su propia línea: «Tu estilo.» / «Tu identidad.» */}
          {business.copy.heroTitle.split(/(?<=\.)\s+/).map((line, i) => (
            <span key={i} className={`block ${i > 0 ? 'italic text-gold' : ''}`}>
              {line}
            </span>
          ))}
        </h1>
        <p
          className="fade-up mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg"
          style={{ ['--delay' as string]: '340ms' }}
        >
          {business.copy.heroSubtitle}
        </p>
        <div
          className="fade-up mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
          style={{ ['--delay' as string]: '460ms' }}
        >
          <WhatsAppButton />
          <a href="#servicios" className="btn btn-outline">
            Ver servicios
          </a>
        </div>
      </div>

      <div className="container-x pb-8">
        <dl className="grid gap-px border-t border-ivory/15 pt-6 text-center sm:grid-cols-3 sm:pt-8">
          <div className="flex flex-col items-center gap-1.5 px-4 py-3">
            <dt className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.3em] text-gold uppercase">
              <MapPin className="size-3.5" strokeWidth={1.6} aria-hidden="true" /> Dirección
            </dt>
            <dd className="text-sm text-ivory/90">{fullAddress()}</dd>
            <DemoBadge show={address.isDemo} />
          </div>
          <div className="flex flex-col items-center gap-1.5 px-4 py-3 sm:border-x sm:border-ivory/15">
            <dt className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.3em] text-gold uppercase">
              <Phone className="size-3.5" strokeWidth={1.6} aria-hidden="true" /> WhatsApp
            </dt>
            <dd className="font-display text-2xl text-ivory">
              {tel ? (
                <a href={tel} className="transition-colors hover:text-gold">
                  {contact.phoneDisplay}
                </a>
              ) : (
                contact.phoneDisplay
              )}
            </dd>
            <DemoBadge show={contact.isDemo} />
          </div>
          <div className="flex flex-col items-center gap-1.5 px-4 py-3">
            <dt className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.3em] text-gold uppercase">
              <Clock className="size-3.5" strokeWidth={1.6} aria-hidden="true" /> Horario
            </dt>
            {hours.map((row) => (
              <dd key={row.label} className="text-sm text-ivory/90">
                {row.label}: {row.value}
              </dd>
            ))}
            <DemoBadge show={business.hours.isDemo} />
          </div>
        </dl>
      </div>

      <a
        href="#nosotros"
        className="absolute top-1/2 left-8 hidden -translate-y-1/2 flex-col items-center gap-3 text-[0.6rem] tracking-[0.4em] text-ivory/60 uppercase transition-colors hover:text-gold xl:flex"
        aria-label="Desplazarse a la sección Nosotros"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <ArrowDown className="size-4 motion-safe:animate-bounce" strokeWidth={1.4} aria-hidden="true" />
      </a>
    </section>
  )
}
