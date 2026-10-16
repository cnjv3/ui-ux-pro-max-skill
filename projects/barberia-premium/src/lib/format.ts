import { business } from '../config/business'

const money = new Intl.NumberFormat(business.locale, {
  style: 'currency',
  currency: business.currency,
  maximumFractionDigits: 0,
})

export function formatPrice(value: number | null): string {
  return value == null || !Number.isFinite(value) ? 'Consultar' : money.format(value)
}

export function formatDuration(min: number | null): string | null {
  if (min == null || !Number.isFinite(min) || min <= 0) return null
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

/** Genera la URL de una imagen optimizada (solo para imágenes de Unsplash). */
export function imageUrl(src: string, width: number, quality = 70): string {
  if (!src.startsWith('https://images.unsplash.com/')) return src
  const url = new URL(src)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality))
  return url.toString()
}

export function imageSrcSet(src: string, widths: number[]): string | undefined {
  if (!src.startsWith('https://images.unsplash.com/')) return undefined
  return widths.map((w) => `${imageUrl(src, w)} ${w}w`).join(', ')
}
