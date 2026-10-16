import { CalendarX2, Clock } from 'lucide-react'
import { business } from '../config/business'
import { DAY_NAMES, WEEK_ORDER, groupWeekly, zonedNow, isValidSchedule } from '../lib/hours'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { OpenStatusBadge } from './ui/OpenStatusBadge'
import { DemoBadge } from './ui/DemoBadge'
import { SectionHeading } from './ui/SectionHeading'

interface HoursCompactProps {
  tone?: 'dark' | 'light'
  className?: string
}

/** Resumen compacto (columnas «LUN – VIE / SÁB / DOM») para otras secciones. */
export function HoursCompact({ tone = 'light', className = '' }: HoursCompactProps) {
  const light = tone === 'light'
  return (
    <dl className={`grid grid-cols-3 gap-4 ${className}`}>
      {groupWeekly(business.hours.weekly).map((row) => (
        <div key={row.label}>
          <dt className={`font-display text-xl font-semibold ${light ? 'text-bronze' : 'text-gold'}`}>{row.short}</dt>
          <dd
            className={`mt-1 text-xs font-medium tracking-wide ${light ? 'text-ink' : 'text-ivory/90'} ${row.closed ? 'uppercase' : ''}`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function BusinessHours() {
  const status = useOpenStatus()
  const valid = isValidSchedule(business.hours)
  const today = valid ? zonedNow(new Date(), business.hours.timeZone).weekday : null
  // `status` se usa para volver a renderizar cuando cambia el día u hora.
  void status

  return (
    <section id="horarios" aria-labelledby="horarios-title" className="bg-cream py-24 text-ink sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeading
            id="horarios-title"
            tone="light"
            eyebrow="Horarios de atención"
            title={
              <>
                Reserva con tiempo, <em className="text-bronze">llega sin esperas.</em>
              </>
            }
            intro="Atendemos con hora agendada para dedicarle a cada cliente el tiempo que merece. Escríbenos y te confirmamos la disponibilidad."
          />
          <div className="mt-8 flex flex-wrap items-center gap-4" data-reveal>
            <OpenStatusBadge tone="light" className="border border-ink/15 bg-ivory px-4 py-3" />
            <DemoBadge show={business.hours.isDemo} light label="Horario de ejemplo" />
          </div>
          {!valid && (
            <p className="mt-6 text-sm text-taupe">
              Horario por confirmar. Escríbenos por WhatsApp para consultar disponibilidad.
            </p>
          )}
        </div>

        <ul className="border-t border-ink/15" data-reveal>
          {WEEK_ORDER.map((day) => {
            const range = business.hours.weekly[day]
            const isToday = day === today
            return (
              <li
                key={day}
                className={`flex items-center justify-between gap-4 border-b border-ink/15 px-2 py-4 sm:px-4 ${isToday ? 'bg-ivory' : ''}`}
                aria-current={isToday ? 'date' : undefined}
              >
                <span className="flex items-center gap-3">
                  <span className={`font-display text-xl capitalize sm:text-2xl ${isToday ? 'font-semibold' : ''}`}>
                    {DAY_NAMES[day]}
                  </span>
                  {isToday && (
                    <span className="bg-ink px-2 py-0.5 text-[0.58rem] font-semibold tracking-[0.2em] text-ivory uppercase">
                      Hoy
                    </span>
                  )}
                </span>
                <span className={`flex items-center gap-2 text-sm tabular-nums ${range ? 'text-ink' : 'text-taupe'}`}>
                  {range ? (
                    <>
                      <Clock className="size-4 text-bronze" strokeWidth={1.5} aria-hidden="true" />
                      {range.open} – {range.close}
                    </>
                  ) : (
                    <>
                      <CalendarX2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      Cerrado
                    </>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
