"use client";

import type { RefObject } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Staggered fade-and-rise for every `[data-reveal]` element inside `scope`,
 * triggered once as the section enters the viewport. Uses gsap.matchMedia so
 * nothing is hidden or animated when the visitor prefers reduced motion, and
 * useGSAP so everything is reverted on unmount (safe under Strict Mode).
 */
export function useSectionReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = scope.current;
        if (!root) return;
        const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-reveal]"));
        if (!items.length) return;
        // opacity (not visibility) so unrevealed items stay reachable by keyboard.
        gsap.set(items, { opacity: 0, y: 36 });
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.12,
              overwrite: true,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
