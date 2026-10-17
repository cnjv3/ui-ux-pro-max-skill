"use client";

import { Info, X } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { formatPrice, fullMenu } from "@/content/menu";

export function MenuModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="menu-modal-title">
      <div className="flex h-full flex-col bg-noir/70">
        <div className="frame flex shrink-0 items-center justify-between gap-6 border-b border-line py-5">
          <div>
            <p className="eyebrow text-[0.62rem]">NOIRÉ · À la carte</p>
            <h2 id="menu-modal-title" className="mt-1 font-serif text-2xl text-ivory sm:text-3xl">
              The Full <em className="text-gilded italic">Menu</em>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            aria-label="Close menu"
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-ivory transition-colors hover:border-gold/60 hover:text-gold"
          >
            <X className="size-5" strokeWidth={1.4} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
          <div className="frame grid gap-x-20 gap-y-14 py-12 md:grid-cols-2 md:py-16">
            {fullMenu.map((category) => (
              <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                <h3
                  id={`cat-${category.id}`}
                  className="flex items-center gap-4 font-sans text-[0.72rem] font-medium uppercase tracking-[0.32em] text-gold"
                >
                  {category.title}
                  <span aria-hidden="true" className="h-px flex-1 bg-gold/25" />
                </h3>
                <ul className="mt-7 space-y-6">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-lg text-ivory sm:text-xl">{item.name}</span>
                        <span aria-hidden="true" className="leader" />
                        <span className="shrink-0 font-sans text-sm tabular-nums text-stone">
                          <span className="sr-only">, illustrative price </span>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      {item.note && <p className="mt-1 text-sm text-stone/70">{item.note}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="frame pb-14">
            <p className="glass flex items-start gap-3 rounded-2xl px-5 py-4 text-sm leading-relaxed text-stone">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
              This menu is illustrative and created for a demonstration. Dishes, availability and prices are
              placeholders — please confirm current offerings and prices directly with the restaurant.
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
