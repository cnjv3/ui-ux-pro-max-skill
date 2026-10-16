import { useEffect, useState, type ReactNode } from 'react'
import { whatsappUrl, type BookingRequest } from '../lib/whatsapp'
import { WhatsAppIcon } from './ui/BrandIcons'

interface WhatsAppButtonProps {
  booking?: BookingRequest
  children?: ReactNode
  variant?: 'gold' | 'outline' | 'outline-dark' | 'dark'
  className?: string
  icon?: boolean
  ariaLabel?: string
}

const VARIANTS = {
  gold: 'btn btn-gold',
  outline: 'btn btn-outline',
  'outline-dark': 'btn btn-outline-dark',
  dark: 'btn btn-dark',
}

/** Botón de reserva por WhatsApp (enlace oficial wa.me con mensaje predefinido). */
export function WhatsAppButton({
  booking,
  children = 'Reservar por WhatsApp',
  variant = 'gold',
  className = '',
  icon = true,
  ariaLabel,
}: WhatsAppButtonProps) {
  const href = whatsappUrl(booking)
  const cls = `${VARIANTS[variant]} ${className}`
  if (!href) {
    // Número no configurado o inválido: no se genera un enlace roto.
    return (
      <span className={cls} aria-disabled="true" title="Configura el número de WhatsApp en src/config/business.ts">
        {icon && <WhatsAppIcon className="size-4" />}
        WhatsApp no disponible
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      aria-label={ariaLabel ? `${ariaLabel} (se abre WhatsApp en una nueva pestaña)` : undefined}
    >
      {icon && <WhatsAppIcon className="size-4 shrink-0" />}
      {children}
    </a>
  )
}

/**
 * Botón flotante. Aparece tras el hero y se oculta en la sección de contacto
 * (donde ya hay un botón grande) para no tapar contenido importante.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  const href = whatsappUrl()

  useEffect(() => {
    const contact = document.getElementById('contacto')
    let contactInView = false
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.6 && !contactInView)
    const io =
      contact && 'IntersectionObserver' in window
        ? new IntersectionObserver(([e]) => {
            contactInView = e.isIntersecting
            update()
          })
        : null
    if (contact && io) io.observe(contact)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      io?.disconnect()
    }
  }, [])

  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp (se abre en una nueva pestaña)"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-14 place-items-center rounded-full bg-gold text-ink
        shadow-[0_12px_32px_-10px_rgba(0,0,0,0.7)] ring-1 ring-ink/10 transition-all duration-500 ease-lux
        hover:bg-gold-soft active:scale-95 sm:right-6 sm:bottom-6 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  )
}
