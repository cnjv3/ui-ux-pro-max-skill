"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, signatureDishes, type SignatureDish } from "@/content/menu";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { cn } from "@/lib/cn";
import { MenuModal } from "./MenuModal";

export function SignatureDishes() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useSectionReveal(root);

  return (
    <section ref={root} id="menu" aria-labelledby="dishes-title" className="section-y relative">
      <div className="frame">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="dishes-title"
            eyebrow="The Chef's Selection"
            title={
              <>
                An Artful Approach <br className="hidden sm:block" />
                to Every <em className="text-gilded italic">Plate.</em>
              </>
            }
            copy="Seasonal produce, considered technique, and flavors designed to linger."
          />
          <div data-reveal className="shrink-0">
            <Button
              variant="line"
              icon
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              Discover the Full Menu
            </Button>
          </div>
        </div>

        <ul
          className="-mx-[clamp(1rem,0.4rem+3vw,2.5rem)] mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1rem,0.4rem+3vw,2.5rem)] pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-24 lg:grid-cols-4 lg:gap-x-6"
          aria-label="Signature dishes"
        >
          {signatureDishes.map((dish, i) => (
            <DishCard key={dish.index} dish={dish} offset={i % 2 === 1} />
          ))}
        </ul>
        <p className="mt-2 text-xs text-stone/60 sm:hidden" aria-hidden="true">
          Swipe to see more →
        </p>
      </div>

      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  );
}

function DishCard({ dish, offset }: { dish: SignatureDish; offset: boolean }) {
  return (
    <li
      data-reveal
      className={cn("group w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none", offset && "lg:mt-20")}
    >
      <article className="relative" aria-labelledby={`dish-${dish.index}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] border border-line bg-char">
          <SafeImage
            slot={dish.image}
            alt={`${dish.name} — illustrative photograph`}
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 78vw"
            className="transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.06]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 font-sans text-[0.65rem] tracking-[0.25em] text-ivory">
            {dish.index}
          </span>
          {/* Gold corner detail revealed on hover */}
          <span
            aria-hidden="true"
            className="absolute bottom-4 right-4 size-10 border-b border-r border-gold opacity-0 transition-all duration-700 ease-luxe group-hover:opacity-100 max-sm:opacity-60 sm:translate-x-2 sm:translate-y-2 sm:group-hover:translate-x-0 sm:group-hover:translate-y-0"
          />
        </div>

        <div className="pt-6 transition-transform delay-75 duration-700 ease-luxe group-hover:-translate-y-1.5">
          <div className="relative h-px w-full bg-line">
            <span className="absolute inset-y-0 left-0 w-10 bg-gold transition-[width] duration-700 ease-luxe group-hover:w-full" />
          </div>
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <h3 id={`dish-${dish.index}`} className="text-[1.35rem] leading-tight text-ivory">
              {dish.name}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone">{dish.description}</p>
          <p className="mt-4 font-serif text-base italic text-gold">
            <span className="sr-only">Illustrative price: </span>
            {formatPrice(dish.price)}
          </p>
        </div>
      </article>
    </li>
  );
}
