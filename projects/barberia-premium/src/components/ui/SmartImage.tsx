import { useState } from 'react'
import { imageSrcSet, imageUrl } from '../../lib/format'
import { LogoMark } from './Logo'

interface SmartImageProps {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  widths?: number[]
  priority?: boolean
  className?: string
  imgClassName?: string
}

/**
 * Imagen optimizada (srcset + lazy loading). Si la imagen no carga, muestra
 * un fondo de marca en su lugar: nunca aparece una imagen rota.
 */
export function SmartImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  widths = [480, 768, 1080, 1440],
  priority = false,
  className = '',
  imgClassName = '',
}: SmartImageProps) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden bg-char ${className}`}>
      {failed ? (
        <div
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_30%_20%,#2a231c,#120f0c_70%)]"
        >
          <LogoMark className="h-16 w-auto text-gold/30" />
        </div>
      ) : (
        <img
          src={imageUrl(src, widths[Math.min(2, widths.length - 1)])}
          srcSet={imageSrcSet(src, widths)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  )
}
