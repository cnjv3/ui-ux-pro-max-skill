"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { sampleTestimonials } from "@/content/editorial";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { cn } from "@/lib/cn";

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const reduce = useReducedMotion();
  const count = sampleTestimonials.length;
  const item = sampleTestimonials[index];
  useSectionReveal(root);

  const go = (dir: number) => setState(([i]) => [(i + dir + count) % count, dir]);
  const goTo = (i: number) => setState(([current]) => [i, i > current ? 1 : -1]);

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <section ref={root} aria-labelledby="testimonials-title" className="section-y relative">
      <div className="frame">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-labelledby="testimonials-title"
          onKeyDown={onKey}
          className="relative mx-auto max-w-4xl text-center"
        >
          <p data-reveal className="eyebrow flex items-center justify-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            Kind Words
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
          </p>
          <h2 id="testimonials-title" data-reveal className="sr-only">
            Sample guest testimonials
          </h2>

          <Quote data-reveal aria-hidden="true" className="mx-auto mt-10 size-9 text-gold/60" strokeWidth={1} />

          <div data-reveal className="relative mt-8 grid min-h-[13rem] place-items-center sm:min-h-[11rem]">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.figure
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                custom={direction}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 40, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -40, filter: "blur(6px)" }}
                transition={{ duration: reduce ? 0.15 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <blockquote className="font-serif text-[clamp(1.6rem,1.1rem+2.4vw,3rem)] italic leading-[1.25] text-ivory">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-8 text-[0.68rem] uppercase tracking-[0.3em] text-stone/70">
                  {item.attribution} — not a genuine review
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <p aria-live="polite" className="sr-only">
            Testimonial {index + 1} of {count}
          </p>

          <div data-reveal className="mt-12 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="inline-flex size-12 items-center justify-center rounded-full border border-line text-ivory transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-1">
              {sampleTestimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className="group inline-flex h-11 items-center px-1.5"
                >
                  <span
                    className={cn(
                      "block h-px transition-all duration-500 ease-luxe",
                      i === index ? "w-10 bg-gold" : "w-5 bg-stone/40 group-hover:bg-stone",
                    )}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="inline-flex size-12 items-center justify-center rounded-full border border-line text-ivory transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <p className="mt-8 text-xs text-stone/60">
            Sample testimonials written for this demonstration — they are not reviews from real guests.
          </p>
        </div>
      </div>
    </section>
  );
}
