"use client";

import { useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function Story() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-story-main]"),
          { clipPath: "inset(12% 12% 12% 12% round 999px 999px 999px 999px)", scale: 1.08 },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 999px 999px)",
            scale: 1,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: q("[data-story-main]")[0], start: "top 80%", once: true },
          },
        );
        gsap.fromTo(
          q("[data-story-line]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: q("[data-story-main]")[0], start: "top 70%", once: true },
          },
        );
        gsap.to(q("[data-story-inset]"), {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="section-y relative overflow-hidden">
      {/* soft warm wash to separate from neighbours without a new colour */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-[600px] rounded-full bg-gold/[0.04] blur-3xl"
      />
      <div className="frame grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            The Art of Hospitality
          </p>
          <h2 id="story-title" data-reveal className="mt-6 text-title text-ivory">
            Made with <em className="text-gilded italic">Intention.</em>
            <br />
            Served with Soul.
          </h2>
          <div className="mt-10 space-y-6 text-lede text-stone">
            <p data-reveal className="max-w-[46ch]">
              At NOIRÉ, every plate begins with a simple belief: exceptional dining is about more than
              ingredients. It is about the moments, memories, and conversations that gather around the table.
            </p>
            <p data-reveal className="max-w-[46ch]">
              Our approach brings seasonal inspiration, thoughtful preparation, and a welcoming atmosphere
              together in an experience designed to be savored.
            </p>
          </div>
          <div data-reveal className="mt-12 flex items-center gap-5">
            <span aria-hidden="true" className="h-px w-14 bg-gold/50" />
            <div>
              <p className="font-serif text-3xl italic text-stone/75">Alexander Thorne</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-stone/60">
                Chef · fictional character for this demo
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:col-span-6 lg:col-start-7">
          <span
            data-story-line
            aria-hidden="true"
            className="absolute -top-10 left-[12%] h-[calc(100%+5rem)] w-px origin-top bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0"
          />
          <div
            data-story-main
            className="relative ml-auto aspect-[4/5] w-[86%] overflow-hidden rounded-[999px] border border-line bg-char"
          >
            <SafeImage
              slot="candidateC"
              alt="An elegant, softly lit dining room — the setting of the NOIRÉ story."
              sizes="(min-width: 1024px) 480px, 80vw"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir/50 to-transparent" />
          </div>
          <div
            data-story-inset
            className="absolute -bottom-6 left-0 aspect-square w-[42%] overflow-hidden rounded-full border-[6px] border-noir bg-char shadow-[var(--shadow-gold)]"
          >
            <SafeImage slot="candidateA" alt="A detail of a plated dish." sizes="240px" />
          </div>
          <p className="glass absolute right-2 top-8 rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-[0.28em] text-ivory/90 sm:right-[-0.5rem]">
            Seasonal · Considered
          </p>
        </div>
      </div>
    </section>
  );
}
