import type { DayKey, TimeRange } from '../config/business'

export const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
/** Orden de presentación: lunes → domingo. */
export const WEEK_ORDER: DayKey[] = [1, 2, 3, 4, 5, 6, 0]

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export interface HoursConfig {
  timeZone: string
  weekly: Record<DayKey, TimeRange | null>
  closedDates: string[]
}

export type OpenStatus =
  | { state: 'open'; closesAt: string; closingSoon: boolean }
  | { state: 'closed'; nextOpen: { dayOffset: number; day: DayKey; time: string } | null }

function toMinutes(time: string): number {
  const m = TIME_RE.exec(time)
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN
}

function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/**
 * Comprueba que el horario sea utilizable. Si no lo es, el indicador de
 * estado NO se muestra (mejor nada que un estado incorrecto).
 */
export function isValidSchedule(cfg: HoursConfig): boolean {
  if (!cfg || !isValidTimeZone(cfg.timeZone)) return false
  let openDays = 0
  for (const day of WEEK_ORDER) {
    const range = cfg.weekly?.[day]
    if (range === undefined) return false
    if (range === null) continue
    const open = toMinutes(range.open)
    const close = toMinutes(range.close)
    if (Number.isNaN(open) || Number.isNaN(close) || close <= open) return false
    openDays++
  }
  if (!Array.isArray(cfg.closedDates) || cfg.closedDates.some((d) => !DATE_RE.test(d))) return false
  return openDays > 0
}

/** Fecha y hora actuales en la zona horaria del local. */
export function zonedNow(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const year = get('year')
  const month = get('month')
  const day = get('day')
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay() as DayKey
  return { year, month, day, weekday, minutes: get('hour') * 60 + get('minute') }
}

function isoDate(year: number, month: number, day: number, addDays = 0): string {
  const d = new Date(Date.UTC(year, month - 1, day + addDays))
  return d.toISOString().slice(0, 10)
}

/** Calcula si el local está abierto según su horario y zona horaria. `null` si faltan datos válidos. */
export function getOpenStatus(cfg: HoursConfig, now = new Date()): OpenStatus | null {
  if (!isValidSchedule(cfg)) return null
  const z = zonedNow(now, cfg.timeZone)
  if ([z.year, z.month, z.day, z.minutes].some(Number.isNaN)) return null

  const rangeFor = (offset: number): TimeRange | null => {
    if (cfg.closedDates.includes(isoDate(z.year, z.month, z.day, offset))) return null
    return cfg.weekly[((z.weekday + offset) % 7) as DayKey]
  }

  const today = rangeFor(0)
  if (today) {
    const open = toMinutes(today.open)
    const close = toMinutes(today.close)
    if (z.minutes >= open && z.minutes < close) {
      return { state: 'open', closesAt: today.close, closingSoon: close - z.minutes <= 30 }
    }
    if (z.minutes < open) {
      return { state: 'closed', nextOpen: { dayOffset: 0, day: z.weekday, time: today.open } }
    }
  }
  for (let offset = 1; offset <= 60; offset++) {
    const range = rangeFor(offset)
    if (range) {
      return {
        state: 'closed',
        nextOpen: { dayOffset: offset, day: ((z.weekday + offset) % 7) as DayKey, time: range.open },
      }
    }
  }
  return { state: 'closed', nextOpen: null }
}

export function describeNextOpen(next: { dayOffset: number; day: DayKey; time: string }): string {
  if (next.dayOffset === 0) return `hoy a las ${next.time}`
  if (next.dayOffset === 1) return `mañana a las ${next.time}`
  if (next.dayOffset < 7) return `el ${DAY_NAMES[next.day]} a las ${next.time}`
  return `${DAY_NAMES[next.day]} a las ${next.time}`
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export interface HoursRow {
  label: string
  short: string
  value: string
  closed: boolean
  days: DayKey[]
}

/** Agrupa días consecutivos con el mismo horario: «Lunes a viernes · 10:00 – 20:00». */
export function groupWeekly(weekly: Record<DayKey, TimeRange | null>): HoursRow[] {
  const rows: HoursRow[] = []
  const key = (r: TimeRange | null) => (r ? `${r.open}-${r.close}` : 'closed')
  for (const day of WEEK_ORDER) {
    const range = weekly[day]
    const last = rows[rows.length - 1]
    if (last && key(weekly[last.days[last.days.length - 1]]) === key(range)) {
      last.days.push(day)
    } else {
      rows.push({
        label: '',
        short: '',
        value: range ? `${range.open} – ${range.close}` : 'Cerrado',
        closed: !range,
        days: [day],
      })
    }
  }
  for (const row of rows) {
    const first = DAY_NAMES[row.days[0]]
    const last = DAY_NAMES[row.days[row.days.length - 1]]
    const abbr = (d: string) => d.slice(0, 3).toUpperCase()
    if (row.days.length === 1) {
      row.label = cap(first)
      row.short = abbr(first)
    } else if (row.days.length === 2) {
      row.label = `${cap(first)} y ${last}`
      row.short = `${abbr(first)} – ${abbr(last)}`
    } else {
      row.label = `${cap(first)} a ${last}`
      row.short = `${abbr(first)} – ${abbr(last)}`
    }
  }
  return rows
}
