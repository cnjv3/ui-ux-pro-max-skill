import { HandHeart, Ruler, ShieldCheck, Sparkles } from 'lucide-react'
import { business } from '../config/business'
import { LogoMark } from './ui/Logo'
import { SmartImage } from './ui/SmartImage'
import { DemoBadge } from './ui/DemoBadge'
import { HoursCompact } from './BusinessHours'
import { WhatsAppButton } from './WhatsAppButton'

const PILLARS = [
  { icon: Sparkles, title: 'Calidad', text: 'Productos profesionales y terminaciones cuidadas en cada servicio.' },
  { icon: ShieldCheck, title: 'Higiene', text: 'Herramientas desinfectadas y estación limpia para cada cliente.' },
  { icon: Ruler, title: 'Técnica', text: 'Cortes precisos, adaptados a tu rostro, tu cabello y tu estilo.' },
  { icon: HandHeart, title: 'Atención', text: 'Te escuchamos antes de empezar y te asesoramos con honestidad.' },
]

export function About() {
  const [main, second, third] = business.images.about
  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-title"
      className="relative overflow-hidden bg-ivory py-24 text-ink sm:py-32"
    >
      <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        {/* Composición editorial de fotografías */}
        <div
          className="relative isolate mx-auto grid w-full max-w-xl aspect-[5/6] grid-cols-6 grid-rows-8 gap-3 sm:gap-4"
          data-reveal
        >
          <div className="col-span-2 row-span-2 grid place-items-center border border-bronze/30">
            <LogoMark className="h-14 w-auto text-bronze sm:h-16" />
          </div>
          <SmartImage
            src={second.src}
            alt={second.alt}
            width={600}
            height={800}
            sizes="(min-width: 1024px) 18vw, 33vw"
            widths={[320, 480, 640]}
            className="col-span-2 col-start-1 row-span-4 row-start-3"
          />
          <SmartImage
            src={main.src}
            alt={main.alt}
            width={900}
            height={1200}
            sizes="(min-width: 1024px) 30vw, 66vw"
            widths={[480, 768, 1080]}
            className="col-span-4 col-start-3 row-span-6 row-start-2"
          />
          <SmartImage
            src={third.src}
            alt={third.alt}
            width={600}
            height={600}
            sizes="(min-width: 1024px) 14vw, 33vw"
            widths={[320, 480, 640]}
            className="col-span-2 col-start-1 row-span-2 row-start-7"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -bottom-4 -z-10 hidden h-2/3 w-2/3 border border-bronze/25 sm:block"
          />
        </div>

        <div>
          <p className="eyebrow text-bronze" data-reveal>
            Nosotros
          </p>
          <h2 id="nosotros-title" className="heading mt-5 text-4xl sm:text-5xl lg:text-[3.5rem]" data-reveal>
            Más que un corte, <em className="text-bronze">una experiencia.</em>
          </h2>
          <div className="mt-7 space-y-4 text-[0.95rem] leading-relaxed text-taupe" data-reveal>
            <p>
              Creemos que cada detalle importa. Trabajamos para ofrecer cortes precisos, atención personalizada y un
              ambiente donde puedas disfrutar de una experiencia de barbería de calidad.
            </p>
            <p>
              En {business.descriptor.toLowerCase()} <strong className="font-semibold text-ink">{business.name}</strong>{' '}
              cada visita comienza con una conversación: entendemos lo que buscas, te recomendamos lo que mejor te queda
              y trabajamos sin apuros, con hora reservada.
            </p>
          </div>

          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="flex gap-4"
                data-reveal
                style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
              >
                <span className="grid size-11 shrink-0 place-items-center border border-bronze/35 text-bronze">
                  <Icon className="size-5" strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-taupe">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-y border-ink/12 py-6" data-reveal>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-taupe uppercase">Horario semanal</p>
              <DemoBadge show={business.hours.isDemo} light label="Horario de ejemplo" />
            </div>
            <HoursCompact />
          </div>

          <div className="mt-10" data-reveal>
            <WhatsAppButton variant="dark" />
          </div>
        </div>
      </div>
    </section>
  )
}
