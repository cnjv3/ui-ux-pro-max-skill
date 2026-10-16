import { Clock3 } from 'lucide-react'
import { business } from '../config/business'
import { formatDuration, formatPrice } from '../lib/format'
import { SmartImage } from './ui/SmartImage'
import { SectionHeading } from './ui/SectionHeading'
import { DemoBadge } from './ui/DemoBadge'
import { WhatsAppButton } from './WhatsAppButton'

export function Services() {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-title"
      className="relative isolate overflow-hidden bg-coal py-24 sm:py-32"
    >
      <SmartImage
        src={business.images.services}
        alt=""
        width={1920}
        height={1280}
        widths={[768, 1280, 1920]}
        className="absolute inset-0 -z-20 opacity-25"
        imgClassName="grayscale-[40%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0d0b09_0%,rgba(13,11,9,0.86)_30%,rgba(13,11,9,0.9)_70%,#0d0b09_100%)]"
      />

      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="servicios-title"
            eyebrow="Servicios"
            title={
              <>
                Lista de <em className="text-gold">servicios</em>
              </>
            }
            intro="Cada servicio incluye asesoría personalizada. Elige el tuyo y resérvalo directamente por WhatsApp."
          />
          {business.servicesAreDemo && (
            <p className="max-w-xs text-xs leading-relaxed text-stone md:text-right" data-reveal>
              <DemoBadge show label="Precios de ejemplo" className="mb-2" />
              <br />
              Precios y duraciones de demostración, pendientes de confirmación por el local.
            </p>
          )}
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {business.services.map((service, i) => {
            const duration = formatDuration(service.durationMin)
            return (
              <li
                key={service.id}
                data-reveal
                style={{ ['--reveal-delay' as string]: `${(i % 3) * 90}ms` }}
                className={`group relative flex flex-col border bg-ink/80 p-7 backdrop-blur-sm transition-[border-color,transform] duration-500 ease-lux hover:-translate-y-1 hover:border-gold/70 sm:p-8 ${
                  service.featured ? 'border-gold/55' : 'border-gold/20'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-3 right-3 left-3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-sm text-gold/70 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {service.featured && (
                    <span className="border border-gold/50 px-2 py-0.5 text-[0.58rem] font-semibold tracking-[0.2em] text-gold uppercase">
                      Recomendado
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-display text-[1.9rem] leading-tight font-medium text-ivory">{service.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{service.description}</p>

                <div className="mt-7 flex items-end justify-between gap-4 border-t border-ivory/10 pt-5">
                  <div>
                    <p className="sr-only">Precio</p>
                    <p className="font-display text-3xl text-gold tabular-nums">{formatPrice(service.price)}</p>
                  </div>
                  {duration && (
                    <p className="flex items-center gap-1.5 text-xs text-stone">
                      <Clock3 className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                      <span className="sr-only">Duración estimada:</span>
                      {duration}
                    </p>
                  )}
                </div>
                <WhatsAppButton
                  booking={{ service: service.name }}
                  variant="outline"
                  className="mt-6 w-full group-hover:border-gold/70"
                  ariaLabel={`Reservar ${service.name} por WhatsApp`}
                >
                  Reservar
                </WhatsAppButton>
              </li>
            )
          })}
        </ul>

        <div className="mt-20 flex flex-col items-center gap-6 text-center" data-reveal>
          <p className="heading text-3xl text-ivory sm:text-4xl">
            Encuentra tu <em className="text-gold">próximo estilo</em>
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href="#contacto" className="btn btn-gold">
              Agendar hora
            </a>
            <a href="#galeria" className="btn btn-outline">
              Ver galería
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
