"use client";

import { useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { tastingChapters } from "@/content/menu";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function Tasting() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
          defaults: { ease: "power3.out" },
        });
        tl.from(q("[data-reveal]"), { opacity: 0, y: 30, duration: 1.1, stagger: 0.12 })
          .from(q("[data-rule]"), { scaleX: 0, duration: 1.4, ease: "power4.out" }, 0.2);

        q("[data-chapter]").forEach((col, i) => {
          gsap.from(col, {
            opacity: 0,
            y: 60,
            duration: 1.3,
            delay: i * 0.18,
            scrollTrigger: { trigger: q("[data-chapters]")[0], start: "top 80%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tasting" aria-labelledby="tasting-title" className="section-y relative border-y border-line bg-char/40">
      <div className="frame">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="tasting-title"
            eyebrow="The Tasting Experience"
            title={
              <>
                A Journey in <em className="text-gilded italic">Seven</em> Courses.
              </>
            }
            className="lg:col-span-7"
          />
          <p data-reveal className="max-w-[40ch] text-lede text-stone lg:col-span-4 lg:col-start-9">
            A considered progression of textures, aromas, and seasonal inspiration.
          </p>
        </div>

        <div data-rule aria-hidden="true" className="mt-16 h-px origin-left bg-gradient-to-r from-gold/60 via-line to-transparent" />

        <ol data-chapters className="mt-14 grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
          {tastingChapters.map((chapter, i) => (
            <li key={chapter.index} data-chapter className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-8" : undefined}>
              <article aria-labelledby={`chapter-${chapter.index}`} className="group">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-6xl italic leading-none text-gold/80">{chapter.index}</span>
                  <span aria-hidden="true" className="h-px flex-1 translate-y-[-0.6em] bg-line" />
                </div>
                <div className="relative mt-8 aspect-[5/4] overflow-hidden rounded-2xl border border-line bg-char md:aspect-[4/5] lg:aspect-[5/4]">
                  <SafeImage
                    slot={chapter.image}
                    alt=""
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="transition-transform duration-[1400ms] ease-luxe group-hover:scale-105"
                  />
                </div>
                <h3 id={`chapter-${chapter.index}`} className="mt-7 text-subtitle text-ivory">
                  <span className="sr-only">Chapter {chapter.index}: </span>
                  {chapter.title}
                </h3>
                <p className="mt-3 max-w-[36ch] text-[0.95rem] leading-relaxed text-stone">{chapter.copy}</p>
              </article>
            </li>
          ))}
        </ol>

        <p className="mt-16 text-xs uppercase tracking-[0.24em] text-stone/60">
          Illustrative outline — the full course composition changes with the season.
        </p>
      </div>
    </section>
  );
}
