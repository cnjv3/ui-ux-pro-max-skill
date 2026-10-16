import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { business } from '../config/business'
import { imageUrl } from '../lib/format'
import { SmartImage } from './ui/SmartImage'
import { SectionHeading } from './ui/SectionHeading'

// Distribución tipo mosaico en escritorio; cuadrícula de 2 columnas en móvil.
const LAYOUT = ['lg:col-span-2 lg:row-span-2', '', 'lg:row-span-2', '', '', '', '', '']

export function Gallery() {
  const images = business.images.gallery
  const [index, setIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const open = (i: number, el: HTMLButtonElement) => {
    triggerRef.current = el
    setIndex(i)
  }
  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (index !== null && !dialog.open) dialog.showModal()
    if (index === null && dialog.open) {
      dialog.close()
      triggerRef.current?.focus()
    }
  }, [index])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, step])

  const current = index !== null ? images[index] : null

  return (
    <section id="galeria" aria-labelledby="galeria-title" className="bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          id="galeria-title"
          align="center"
          eyebrow="Galería"
          title={
            <>
              Inspiraciones de <em className="text-gold">estilo</em>
            </>
          }
          intro="Cortes clásicos, degradados, barbas y los detalles que hacen la diferencia."
        />

        <ul className="mt-14 grid grid-flow-dense grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:auto-rows-[15rem]">
          {images.map((img, i) => (
            <li
              key={`${img.src}-${i}`}
              className={`aspect-square lg:aspect-auto ${LAYOUT[i % LAYOUT.length]}`}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 4) * 70}ms` }}
            >
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                className="group relative block size-full cursor-zoom-in overflow-hidden"
                aria-label={`Ampliar imagen: ${img.alt}`}
              >
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={800}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  widths={[360, 540, 800, 1100]}
                  className="size-full"
                  imgClassName="transition-[transform,filter] duration-[1.2s] ease-lux grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0"
                />
                <span className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-ink/80 via-ink/0 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-[0.62rem] font-semibold tracking-[0.25em] text-ivory uppercase">
                    {img.category}
                  </span>
                  <Expand className="size-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label="Galería ampliada"
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-ink/95"
      >
        {current && (
          <figure className="relative flex w-[min(92vw,1100px)] flex-col items-center">
            <img
              src={imageUrl(current.src, 1600, 75)}
              alt={current.alt}
              className="max-h-[78svh] w-auto object-contain"
            />
            <figcaption className="mt-4 flex w-full items-center justify-between gap-4 text-sm text-stone">
              <span>
                <span className="mr-3 text-[0.62rem] font-semibold tracking-[0.25em] text-gold uppercase">
                  {current.category}
                </span>
                {current.alt}
              </span>
              <span className="tabular-nums">
                {index! + 1} / {images.length}
              </span>
            </figcaption>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                className="grid size-12 cursor-pointer place-items-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="grid size-12 cursor-pointer place-items-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="grid size-12 cursor-pointer place-items-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold"
                aria-label="Cerrar galería"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </section>
  )
}
