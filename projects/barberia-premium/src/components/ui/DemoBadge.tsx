interface DemoBadgeProps {
  show: boolean
  label?: string
  light?: boolean
  className?: string
}

/** Etiqueta visible para datos de demostración pendientes de confirmar por el propietario. */
export function DemoBadge({ show, label = 'Dato de ejemplo', light = false, className = '' }: DemoBadgeProps) {
  if (!show) return null
  return (
    <span
      className={`demo-badge ${light ? 'demo-badge-light' : ''} ${className}`}
      title="Dato de demostración: reemplazar en src/config/business.ts"
    >
      {label}
    </span>
  )
}
