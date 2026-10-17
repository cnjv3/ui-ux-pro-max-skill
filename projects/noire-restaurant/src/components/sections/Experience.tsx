"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { experienceThemes } from "@/content/editorial";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const theme = experienceThemes[index];
  useSectionReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Parallax only on larger screens with motion allowed.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          gsap.utils.selector(root)("[data-parallax]"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = experienceThemes.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      ref={root}
      id="experience"
      aria-labelledby="experience-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden py-24 md:min-h-[min(100svh,960px)] md:py-32"
    >
      {/* Wide photograph with restrained parallax */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={theme.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <SafeImage slot={theme.image} alt="" sizes="100vw" fallbackVariant="plain" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-noir/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-noir/70" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_30%,rgba(7,7,7,0.75)_100%)]" />
      </div>

      <div className="frame relative grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="eyebrow flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            The Experience
          </p>
          <h2 id="experience-title" data-reveal className="mt-6 text-title text-ivory">
            An Atmosphere Worth <em className="text-gilded italic">Lingering</em> In.
          </h2>
          <p data-reveal className="mt-6 max-w-[42ch] text-lede text-ivory/80">
            Soft light, considered details, and the pleasure of taking your time.
          </p>

          <div
            data-reveal
            role="tablist"
            aria-label="Experience themes"
            className="mt-12 flex flex-wrap gap-2"
          >
            {experienceThemes.map((item, i) => (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`exp-tab-${item.id}`}
                aria-selected={i === index}
                aria-controls="exp-panel"
                tabIndex={i === index ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={onTabKey}
                className={cn(
                  "min-h-11 rounded-full border px-5 text-[0.68rem] uppercase tracking-[0.24em] transition-colors duration-500",
                  i === index
                    ? "border-gold/70 bg-gold/10 text-gold"
                    : "border-white/20 text-ivory/80 hover:border-white/40 hover:text-ivory",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Floating glass label */}
        <div
          id="exp-panel"
          role="tabpanel"
          aria-labelledby={`exp-tab-${theme.id}`}
          data-reveal
          className="glass max-w-sm rounded-3xl p-7 lg:col-span-4 lg:col-start-9 lg:justify-self-end"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -6 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow text-[0.62rem]">
                {String(index + 1).padStart(2, "0")} / {String(experienceThemes.length).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-2xl italic text-ivory">{theme.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">{theme.copy}</p>
            </motion.div>
          </AnimatePresence>
          <p className="mt-6 border-t border-line pt-4 text-[0.62rem] uppercase tracking-[0.24em] text-stone/60">
            Concept imagery · demo
          </p>
        </div>
      </div>
    </section>
  );
}
