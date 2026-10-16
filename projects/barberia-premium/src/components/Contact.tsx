import { useId, useMemo, useState } from 'react'
import { Clock, Info, MapPin, Phone } from 'lucide-react'
import { business, type DayKey } from '../config/business'
import { groupWeekly, isValidSchedule, zonedNow } from '../lib/hours'
import { fullAddress } from '../lib/maps'
import { buildBookingMessage, phoneHref, whatsappUrl } from '../lib/whatsapp'
import { InstagramIcon, WhatsAppIcon } from './ui/BrandIcons'
import { SmartImage } from './ui/SmartImage'
import { DemoBadge } from './ui/DemoBadge'
import { OpenStatusBadge } from './ui/OpenStatusBadge'

function todayIso(): string {
  const tz = isValidSchedule(business.hours) ? business.hours.timeZone : undefined
  const z = tz ? zonedNow(new Date(), tz) : null
  const d = z ? new Date(Date.UTC(z.year, z.month - 1, z.day)) : new Date()
  return d.toISOString().slice(0, 10)
}

function dayNotice(date: string, time: string): string | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const [y, m, d] = date.split('-').map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay() as DayKey
  const range = business.hours.weekly[weekday]
  if (business.hours.closedDates.includes(date) || !range)
    return 'Según nuestro horario, ese día el local está cerrado.'
  if (time && (time < range.open || time >= range.close)) return `Ese día atendemos de ${range.open} a ${range.close}.`
  return null
}

export function Contact() {
  const uid = useId()
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const minDate = useMemo(todayIso, [])

  const validDate = date && date >= minDate ? date : ''
  const booking = { service, date: validDate, time, name }
  const href = whatsappUrl(booking)
  const preview = buildBookingMessage(booking)
  const notice = dayNotice(validDate, time)
  const tel = phoneHref()
  const { contact } = business

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32"
    >
      <SmartImage
        src={business.images.contact}
        alt=""
        width={1920}
        height={1280}
        widths={[768, 1280, 1920]}
        className="absolute inset-0 -z-20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(13,11,9,0.97)_0%,rgba(13,11,9,0.9)_50%,rgba(13,11,9,0.75)_100%)]"
      />

      <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <p className="eyebrow text-gold" data-reveal>
            Reserva
          </p>
          <h2 id="contacto-title" className="heading mt-5 text-[clamp(2.6rem,6vw,4.6rem)] text-ivory" data-reveal>
            Tu próximo corte <em className="text-gold">comienza aquí.</em>
          </h2>
          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-stone" data-reveal>
            Sin aplicaciones ni registros. Elige tu servicio, propón un día y te responderemos por WhatsApp con la
            disponibilidad.
          </p>

          <form
            className="mt-10 grid gap-4 border border-gold/25 bg-ink/70 p-6 backdrop-blur-sm sm:grid-cols-2 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              if (href) window.open(href, '_blank', 'noopener,noreferrer')
            }}
            data-reveal
          >
            <div className="sm:col-span-2">
              <label
                htmlFor={`${uid}-service`}
                className="mb-2 block text-[0.65rem] font-semibold tracking-[0.25em] text-gold uppercase"
              >
                Servicio
              </label>
              <select
                id={`${uid}-service`}
                className="field cursor-pointer"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">Aún no lo decido</option>
                {business.services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor={`${uid}-date`}
                className="mb-2 block text-[0.65rem] font-semibold tracking-[0.25em] text-gold uppercase"
              >
                Día preferido <span className="font-normal tracking-normal text-stone normal-case">(opcional)</span>
              </label>
              <input
                id={`${uid}-date`}
                type="date"
                min={minDate}
                className="field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor={`${uid}-time`}
                className="mb-2 block text-[0.65rem] font-semibold tracking-[0.25em] text-gold uppercase"
              >
                Hora preferida <span className="font-normal tracking-normal text-stone normal-case">(opcional)</span>
              </label>
              <input
                id={`${uid}-time`}
                type="time"
                step={900}
                className="field"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor={`${uid}-name`}
                className="mb-2 block text-[0.65rem] font-semibold tracking-[0.25em] text-gold uppercase"
              >
                Tu nombre <span className="font-normal tracking-normal text-stone normal-case">(opcional)</span>
              </label>
              <input
                id={`${uid}-name`}
                type="text"
                autoComplete="given-name"
                maxLength={60}
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {(notice || (date && !validDate)) && (
              <p className="flex items-start gap-2 text-xs text-gold-soft sm:col-span-2" role="status">
                <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                {date && !validDate ? 'Elige una fecha a partir de hoy.' : notice}
              </p>
            )}

            <div className="sm:col-span-2">
              <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.25em] text-stone uppercase">
                Mensaje que se enviará
              </p>
              <p className="border-l-2 border-gold/50 bg-coal/80 px-4 py-3 text-sm leading-relaxed text-ivory/85 italic">
                {preview}
              </p>
            </div>

            <button type="submit" disabled={!href} className="btn btn-gold min-h-14 text-[0.78rem] sm:col-span-2">
              <WhatsAppIcon className="size-5" />
              Enviar por WhatsApp
            </button>
            <p className="text-xs leading-relaxed text-stone sm:col-span-2">
              Podrás revisar y editar el mensaje antes de enviarlo. Tu hora queda reservada solo cuando la barbería te
              la confirme por WhatsApp.
            </p>
          </form>
        </div>

        <aside aria-label="Datos de contacto" className="flex flex-col gap-8 lg:pt-28">
          <OpenStatusBadge className="self-start border border-ivory/15 bg-ink/60 px-4 py-3" />

          <div className="flex gap-4 border-t border-ivory/10 pt-6" data-reveal>
            <Phone className="mt-1 size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-stone uppercase">Teléfono / WhatsApp</p>
              <p className="mt-1 font-display text-3xl text-ivory">
                {tel ? (
                  <a href={tel} className="transition-colors hover:text-gold">
                    {contact.phoneDisplay}
                  </a>
                ) : (
                  contact.phoneDisplay
                )}
              </p>
              <DemoBadge show={contact.isDemo} className="mt-2" />
            </div>
          </div>

          <div className="flex gap-4 border-t border-ivory/10 pt-6" data-reveal>
            <MapPin className="mt-1 size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-stone uppercase">Dirección</p>
              <p className="mt-1 text-ivory">{fullAddress()}</p>
              <a
                href="#ubicacion"
                className="link-underline mt-2 inline-block text-xs tracking-[0.2em] text-gold uppercase"
              >
                Ver mapa
              </a>
            </div>
          </div>

          <div className="flex gap-4 border-t border-ivory/10 pt-6" data-reveal>
            <Clock className="mt-1 size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-stone uppercase">Horario</p>
              <ul className="mt-1 space-y-1 text-ivory">
                {groupWeekly(business.hours.weekly).map((row) => (
                  <li key={row.label}>
                    {row.label}: <span className={row.closed ? 'text-stone' : ''}>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {contact.instagram && (
            <a
              href={`https://www.instagram.com/${encodeURIComponent(contact.instagram)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 border-t border-ivory/10 pt-6 text-ivory transition-colors hover:text-gold"
              data-reveal
            >
              <InstagramIcon className="size-5 text-gold" />
              <span>@{contact.instagram}</span>
            </a>
          )}
        </aside>
      </div>
    </section>
  )
}
