import { useOpenStatus } from '../../hooks/useOpenStatus'
import { describeNextOpen } from '../../lib/hours'

interface OpenStatusBadgeProps {
  tone?: 'dark' | 'light'
  className?: string
}

/** «Abierto ahora» / «Cerrado · Próxima apertura». No se muestra si el horario no es válido. */
export function OpenStatusBadge({ tone = 'dark', className = '' }: OpenStatusBadgeProps) {
  const status = useOpenStatus()
  if (!status) return null
  const light = tone === 'light'
  const isOpen = status.state === 'open'
  const detail =
    status.state === 'open'
      ? status.closingSoon
        ? `Cierra pronto · ${status.closesAt}`
        : `Hasta las ${status.closesAt}`
      : status.nextOpen
        ? `Próxima apertura: ${describeNextOpen(status.nextOpen)}`
        : null
  return (
    <p
      className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${light ? 'text-taupe' : 'text-stone'} ${className}`}
      aria-live="polite"
    >
      <span
        className={`inline-flex items-center gap-2 font-semibold tracking-[0.16em] uppercase ${isOpen ? (light ? 'text-[#2f6b45]' : 'text-[#8fd1a6]') : light ? 'text-ink' : 'text-ivory'}`}
      >
        <span className="relative flex size-2">
          {isOpen && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
          )}
          <span className={`relative inline-flex size-2 rounded-full ${isOpen ? 'bg-current' : 'bg-stone/70'}`} />
        </span>
        {isOpen ? 'Abierto ahora' : 'Cerrado'}
      </span>
      {detail && <span>{detail}</span>}
    </p>
  )
}
