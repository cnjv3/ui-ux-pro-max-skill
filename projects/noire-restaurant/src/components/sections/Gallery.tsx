"use client";

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { SafeImage } from "@/components/ui/SafeImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryItems } from "@/content/editorial";
import { media } from "@/content/media";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { cn } from "@/lib/cn";

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useSectionReveal(root);

  return (
    <section ref={root} id="gallery" aria-labelledby="gallery-title" className="section-y relative">
      <div className="frame">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="gallery-title"
            eyebrow="The Gallery"
            title={
              <>
                Moments from the <em className="text-gilded italic">Table.</em>
              </>
            }
          />
          <p data-reveal className="max-w-[34ch] text-sm leading-relaxed text-stone">
            Plating, produce, preparation and the quiet details in between. Select any image to view it larger.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-12 md:auto-rows-[clamp(180px,20vw,280px)] md:gap-5">
          {galleryItems.map((item, i) => (
            <li key={item.caption} data-reveal className={cn("relative", item.layout)}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View larger: ${item.caption}`}
                aria-haspopup="dialog"
                className={cn(
                  "group relative block w-full overflow-hidden rounded-2xl border border-line bg-char md:h-full md:aspect-auto",
                  item.aspect,
                )}
              >
                <SafeImage
                  slot={item.image}
                  alt=""
                  sizes="(min-width: 768px) 40vw, 50vw"
                  className="transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/0 to-noir/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                  <span className="text-left text-[0.6rem] uppercase tracking-[0.26em] text-ivory/90 sm:text-[0.66rem]">
                    {item.caption}
                  </span>
                  <span
                    aria-hidden="true"
                    className="glass hidden size-9 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-flex"
                  >
                    <Expand className="size-3.5 text-gold" strokeWidth={1.5} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox index={open} onIndex={setOpen} />
    </section>
  );
}

function Lightbox({ index, onIndex }: { index: number | null; onIndex: (i: number | null) => void }) {
  const reduce = useReducedMotion();
  const [direction, setDirection] = useState(0);
  const count = galleryItems.length;
  const isOpen = index !== null;
  const current = index ?? 0;
  const item = galleryItems[current];

  const step = useCallback(
    (dir: number) => {
      if (index === null) return;
      setDirection(dir);
      onIndex((index + dir + count) % count);
    },
    [index, count, onIndex],
  );

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) step(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) step(-1);
  };

  return (
    <Dialog open={isOpen} onClose={() => onIndex(null)} labelledBy="lightbox-caption" onKeyDown={onKeyDown}>
      <div className="flex h-full flex-col">
        <div className="frame flex shrink-0 items-center justify-between py-4">
          <p className="text-xs tabular-nums tracking-[0.2em] text-stone" aria-live="polite">
            {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={() => onIndex(null)}
            aria-label="Close gallery"
            className="inline-flex size-12 items-center justify-center rounded-full border border-line text-ivory transition-colors hover:border-gold/60 hover:text-gold"
          >
            <X className="size-5" strokeWidth={1.4} aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.figure
              key={current}
              className="relative flex h-full w-full max-w-6xl flex-col"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -60 }}
              transition={{ duration: reduce ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-char">
                <SafeImage
                  slot={item.image}
                  sizes="(min-width: 1280px) 1150px, 100vw"
                  className="!object-contain"
                  draggable={false}
                />
              </div>
              <figcaption id="lightbox-caption" className="mt-4 text-center">
                <span className="eyebrow text-[0.62rem]">{item.caption}</span>
                <span className="mt-1 block text-sm text-stone">{media[item.image].alt}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous image"
            className="glass absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full text-ivory hover:text-gold sm:left-6"
          >
            <ChevronLeft className="size-5" strokeWidth={1.4} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next image"
            className="glass absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full text-ivory hover:text-gold sm:right-6"
          >
            <ChevronRight className="size-5" strokeWidth={1.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </Dialog>
  );
}
