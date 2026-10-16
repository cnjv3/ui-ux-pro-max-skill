import { useEffect, useState } from 'react'

/** Devuelve el id de la sección visible para resaltar el enlace activo del menú. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}
