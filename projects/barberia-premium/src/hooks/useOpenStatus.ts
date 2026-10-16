import { useEffect, useState } from 'react'
import { business } from '../config/business'
import { getOpenStatus, type OpenStatus } from '../lib/hours'

/** Estado abierto/cerrado, recalculado cada 30 s y al volver a la pestaña. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState(() => getOpenStatus(business.hours))
  useEffect(() => {
    const update = () => setStatus(getOpenStatus(business.hours))
    const id = window.setInterval(update, 30_000)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return status
}
