import { business } from '../config/business'

export function fullAddress(): string {
  const a = business.address
  return [a.street, a.district, a.city, a.region, a.country].filter(Boolean).join(', ')
}

function query(): string {
  return (business.address.mapsQuery || fullAddress()).trim()
}

/** Abre Google Maps con la ruta hasta el local (app en móviles, web en escritorio). */
export function directionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query())}`
}

/** Mapa embebido de Google Maps (no requiere clave API). */
export function embedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query())}&output=embed`
}
