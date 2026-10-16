import { business } from '../config/business'

/** Normaliza un número a solo dígitos y valida el formato internacional (E.164: 8–15 dígitos). */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null
}

/** Elimina caracteres de control y limita la longitud de un texto que irá en un enlace. */
export function cleanText(value: string, max = 120): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

export interface BookingRequest {
  service?: string
  /** Fecha "AAAA-MM-DD" (opcional). */
  date?: string
  /** Hora "HH:MM" (opcional). */
  time?: string
  name?: string
}

function formatDate(iso: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d, 12))
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== d) return null
  return new Intl.DateTimeFormat(business.locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
    .format(date)
    .replace(',', '')
}

/** Construye el mensaje predefinido. El cliente puede editarlo en WhatsApp antes de enviarlo. */
export function buildBookingMessage(req: BookingRequest = {}): string {
  const lines: string[] = []
  const name = req.name ? cleanText(req.name, 60) : ''
  lines.push(
    `Hola${name ? `, soy ${name}` : ''}. Quisiera reservar una hora en ${business.descriptor} ${business.name}.`,
  )
  const service = req.service ? cleanText(req.service, 80) : ''
  if (service) lines.push(`Me interesa el servicio de ${service}.`)

  const date = req.date ? formatDate(req.date) : null
  const time = req.time && /^([01]\d|2[0-3]):[0-5]\d$/.test(req.time) ? req.time : null
  if (date && time) lines.push(`Si es posible, me acomodaría el ${date} a las ${time}.`)
  else if (date) lines.push(`Si es posible, me acomodaría el ${date}.`)
  else if (time) lines.push(`Si es posible, me acomodaría cerca de las ${time}.`)

  lines.push('¿Qué horarios tienen disponibles?')
  return lines.join(' ')
}

/** Enlace oficial wa.me. Devuelve `null` si el número configurado no es válido. */
export function whatsappUrl(req?: BookingRequest): string | null {
  const phone = normalizePhone(business.contact.whatsapp)
  if (!phone) return null
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildBookingMessage(req))}`
}

export function phoneHref(): string | null {
  const phone = normalizePhone(business.contact.phoneDisplay)
  return phone ? `tel:+${phone}` : null
}
