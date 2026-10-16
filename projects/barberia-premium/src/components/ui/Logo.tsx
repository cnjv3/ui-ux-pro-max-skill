import { business } from '../../config/business'

interface LogoMarkProps {
  className?: string
  title?: string
}

/** Monograma: arco fino con tijeras estilizadas. Se reemplaza por `logoSrc` si se configura. */
export function LogoMark({ className = 'h-10 w-auto', title }: LogoMarkProps) {
  if (business.logoSrc) {
    return <img src={business.logoSrc} alt={title ?? ''} className={className} />
  }
  return (
    <svg
      viewBox="0 0 48 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M4 62V24a20 20 0 0 1 40 0v38" />
      <path d="M8.5 62V25a15.5 15.5 0 0 1 31 0v37" opacity=".45" />
      <circle cx="18" cy="47" r="4.2" />
      <circle cx="30" cy="47" r="4.2" />
      <path d="M20.6 43.8 31 19M27.4 43.8 17 19" />
      <circle cx="24" cy="36.3" r=".9" fill="currentColor" stroke="none" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  compact?: boolean
}

export function Logo({ className = '', compact = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className={compact ? 'h-9 w-auto text-gold' : 'h-11 w-auto text-gold'} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.6rem] font-semibold tracking-[0.06em] uppercase">{business.name}</span>
        <span className="mt-1 text-[0.58rem] font-medium tracking-[0.42em] text-gold uppercase">
          {business.descriptor}
        </span>
      </span>
    </span>
  )
}
