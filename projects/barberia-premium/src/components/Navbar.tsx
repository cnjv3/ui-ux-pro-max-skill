import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useScrolled } from '../hooks/useScrolled'
import { useActiveSection } from '../hooks/useActiveSection'
import { Logo } from './ui/Logo'
import { WhatsAppButton } from './WhatsAppButton'

export const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'galeria', label: 'Galería' },
  { id: 'contacto', label: 'Contacto' },
]
const IDS = NAV_LINKS.map((l) => l.id)

export function Navbar() {
  const scrolled = useScrolled()
  const active = useActiveSection(IDS)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Bloquea el scroll, gestiona el foco y cierra con Escape en el menú móvil.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (e.key === 'Tab') {
        const items = [toggleRef.current!, ...focusables()]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const solid = scrolled || open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-lux ${
          solid ? 'border-b border-ivory/10 bg-ink/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Principal" className="container-x flex h-20 items-center justify-between gap-6">
          <a
            href="#inicio"
            className="relative z-10 text-ivory"
            aria-label="Ir al inicio"
            onClick={() => setOpen(false)}
          >
            <Logo compact />
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`link-underline text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-colors duration-300 hover:text-gold ${
                    active === link.id ? 'text-gold' : 'text-ivory/85'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="#contacto" className="btn btn-gold hidden min-h-11 px-6 py-3 sm:inline-flex">
              Agendar hora
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 grid size-12 cursor-pointer place-items-center text-ivory transition-colors hover:text-gold lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil (fuera del <header>: su backdrop-filter rompería el position: fixed) */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-ink lg:hidden"
      >
        <div className="container-x flex min-h-full flex-col py-10">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.id}
                className="fade-up border-b border-ivory/10"
                style={{ ['--delay' as string]: `${i * 60}ms` }}
              >
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`flex items-center justify-between py-5 font-display text-3xl transition-colors hover:text-gold ${
                    active === link.id ? 'text-gold' : 'text-ivory'
                  }`}
                >
                  {link.label}
                  <span className="text-xs font-sans tracking-[0.3em] text-stone">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-10">
            <a href="#contacto" className="btn btn-gold w-full" onClick={() => setOpen(false)}>
              Agendar hora
            </a>
            <WhatsAppButton variant="outline" className="w-full" />
          </div>
        </div>
      </div>
    </>
  )
}
