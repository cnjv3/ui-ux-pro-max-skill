import { business } from '../config/business'
import { groupWeekly } from '../lib/hours'
import { fullAddress } from '../lib/maps'
import { phoneHref, whatsappUrl } from '../lib/whatsapp'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './ui/BrandIcons'
import { Logo } from './ui/Logo'
import { NAV_LINKS } from './Navbar'

export function Footer() {
  const { contact } = business
  const wa = whatsappUrl()
  const tel = phoneHref()
  const socials = [
    wa && { href: wa, label: 'WhatsApp', icon: WhatsAppIcon },
    contact.instagram && {
      href: `https://www.instagram.com/${encodeURIComponent(contact.instagram)}/`,
      label: 'Instagram',
      icon: InstagramIcon,
    },
    contact.facebook &&
      contact.facebook.startsWith('https://') && { href: contact.facebook, label: 'Facebook', icon: FacebookIcon },
  ].filter(Boolean) as { href: string; label: string; icon: typeof WhatsAppIcon }[]

  return (
    <footer className="border-t border-gold/15 bg-coal pt-20 pb-28 sm:pb-12">
      <div className="container-x grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr_1fr]">
        <div>
          <a href="#inicio" aria-label="Volver al inicio" className="inline-block text-ivory">
            <Logo />
          </a>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone">
            Del cabello a la barba, cada detalle pensado para resaltar tu estilo con precisión y cuidado.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (se abre en una nueva pestaña)`}
                    className="grid size-11 place-items-center border border-ivory/15 text-ivory transition-colors duration-300 hover:border-gold hover:text-gold"
                  >
                    <Icon className="size-[1.1rem]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Pie de página">
          <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold uppercase">Navegación</p>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="link-underline text-ivory/80 transition-colors hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold uppercase">Contacto</p>
          <address className="mt-5 space-y-3 text-sm text-ivory/80 not-italic">
            <p>{fullAddress()}</p>
            <p>
              {tel ? (
                <a href={tel} className="transition-colors hover:text-gold">
                  {contact.phoneDisplay}
                </a>
              ) : (
                contact.phoneDisplay
              )}
            </p>
          </address>
        </div>

        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold uppercase">Horario</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/80">
            {groupWeekly(business.hours.weekly).map((row) => (
              <li key={row.label} className="flex justify-between gap-4 border-b border-ivory/10 pb-3">
                <span>{row.label}</span>
                <span className={row.closed ? 'text-stone' : 'tabular-nums'}>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x mt-16 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {business.descriptor} {business.name}. Todos los derechos reservados.
        </p>
        <p>Las reservas se coordinan directamente por WhatsApp. Este sitio no almacena tus datos.</p>
      </div>
    </footer>
  )
}
