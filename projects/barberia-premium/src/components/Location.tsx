import { useState } from 'react'
import { Check, Copy, MapPin, Navigation } from 'lucide-react'
import { business } from '../config/business'
import { directionsUrl, embedUrl, fullAddress } from '../lib/maps'
import { SectionHeading } from './ui/SectionHeading'
import { DemoBadge } from './ui/DemoBadge'

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* usa el método alternativo */
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  area.remove()
  return ok
}

export function Location() {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'error'>('idle')
  const [mapLoaded, setMapLoaded] = useState(false)
  const address = fullAddress()
  const { references, isDemo } = business.address

  const onCopy = async () => {
    const ok = await copyText(address)
    setCopied(ok ? 'ok' : 'error')
    window.setTimeout(() => setCopied('idle'), 2500)
  }

  return (
    <section id="ubicacion" aria-labelledby="ubicacion-title" className="bg-coal py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch lg:gap-16">
        <div className="flex flex-col">
          <SectionHeading
            id="ubicacion-title"
            eyebrow="Ubicación"
            title={
              <>
                Encuéntranos <em className="text-gold">fácilmente</em>
              </>
            }
          />
          <address className="mt-10 not-italic" data-reveal>
            <div className="flex gap-4 border-t border-ivory/10 pt-6">
              <MapPin className="mt-1 size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="font-display text-2xl leading-snug text-ivory">{business.address.street}</p>
                <p className="mt-1 text-sm text-stone">
                  {[business.address.district, business.address.city, business.address.region, business.address.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <DemoBadge show={isDemo} label="Dirección de ejemplo" className="mt-3" />
              </div>
            </div>
          </address>

          {references.length > 0 && (
            <div className="mt-8" data-reveal>
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold uppercase">Cómo llegar</p>
              <ul className="mt-3 space-y-2 text-sm text-stone">
                {references.map((ref) => (
                  <li key={ref} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rotate-45 bg-gold" />
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-10" data-reveal>
            <a href={directionsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <Navigation className="size-4" strokeWidth={1.6} aria-hidden="true" />
              Cómo llegar
            </a>
            <button type="button" onClick={onCopy} className="btn btn-outline">
              {copied === 'ok' ? (
                <Check className="size-4" strokeWidth={1.6} aria-hidden="true" />
              ) : (
                <Copy className="size-4" strokeWidth={1.6} aria-hidden="true" />
              )}
              {copied === 'ok' ? 'Copiada' : 'Copiar dirección'}
            </button>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {copied === 'ok'
              ? 'Dirección copiada al portapapeles'
              : copied === 'error'
                ? 'No se pudo copiar la dirección'
                : ''}
          </p>
        </div>

        <div
          className="relative min-h-[22rem] overflow-hidden border border-gold/20 bg-char sm:min-h-[28rem]"
          data-reveal
        >
          {!mapLoaded && (
            <div aria-hidden="true" className="absolute inset-0 grid place-items-center text-stone">
              <MapPin className="size-8 animate-pulse text-gold/50" strokeWidth={1.2} />
            </div>
          )}
          <iframe
            title={`Mapa de ubicación: ${address}`}
            src={embedUrl()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoaded(true)}
            className="absolute inset-0 size-full border-0 [filter:grayscale(1)_contrast(1.05)_brightness(0.92)] transition-[filter] duration-700 hover:[filter:none]"
          />
        </div>
      </div>
    </section>
  )
}
