import { useEffect } from 'react'

/**
 * Animación sutil al hacer scroll para todos los elementos con [data-reveal].
 * Sin JavaScript o con «reducir movimiento» el contenido se muestra siempre.
 */
export function useReveal(): void {
  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return
    root.classList.add('reveal-ready')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}
